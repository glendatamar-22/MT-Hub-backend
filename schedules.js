import express from 'express';
import Schedule from '../models/Schedule.js';
import Group from '../models/Group.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/schedules
// @desc    Get all schedules (with optional group filter)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Filter by group if provided
    if (req.query.group) {
      query.group = req.query.group;
      
      // Check if user has access to this group
      if (req.user.role === 'teacher') {
        if (!req.user.assignedGroups.includes(req.query.group)) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to access this group',
          });
        }
      }
    } else {
      // If no group specified, show schedules from user's assigned groups
      if (req.user.role === 'teacher') {
        query.group = { $in: req.user.assignedGroups };
      }
    }

    // Filter by date range if provided
    if (req.query.startDate) {
      query.date = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      query.date = {
        ...query.date,
        $lte: new Date(req.query.endDate),
      };
    }

    const schedules = await Schedule.find(query)
      .populate('group', 'name location')
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/schedules/:id
// @desc    Get single schedule
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('group', 'name location');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Check if user has access to this group
    if (
      req.user.role === 'teacher' &&
      !req.user.assignedGroups.includes(schedule.group._id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this schedule',
      });
    }

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/schedules
// @desc    Create new schedule
// @access  Private (Teacher/Admin)
router.post('/', protect, async (req, res) => {
  try {
    const { group, title, date, startTime, endTime, location, description } = req.body;

    // Verify group exists
    const groupDoc = await Group.findById(group);
    if (!groupDoc) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user has access to this group
    if (
      req.user.role === 'teacher' &&
      !req.user.assignedGroups.includes(group)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create schedules for this group',
      });
    }

    const schedule = await Schedule.create({
      group,
      title,
      date,
      startTime,
      endTime,
      location,
      description,
    });

    const populatedSchedule = await Schedule.findById(schedule._id)
      .populate('group', 'name location');

    res.status(201).json({
      success: true,
      data: populatedSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/schedules/:id
// @desc    Update schedule
// @access  Private (Teacher/Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Check if user has access to this group
    if (
      req.user.role === 'teacher' &&
      !req.user.assignedGroups.includes(schedule.group)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this schedule',
      });
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      {
        new: true,
        runValidators: true,
      }
    ).populate('group', 'name location');

    res.json({
      success: true,
      data: updatedSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/schedules/:id
// @desc    Delete schedule
// @access  Private (Teacher/Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Check if user has access to this group
    if (
      req.user.role === 'teacher' &&
      !req.user.assignedGroups.includes(schedule.group)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this schedule',
      });
    }

    await schedule.deleteOne();

    res.json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

