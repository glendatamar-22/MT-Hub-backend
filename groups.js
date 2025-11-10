import express from 'express';
import Group from '../models/Group.js';
import Student from '../models/Student.js';
import Schedule from '../models/Schedule.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/groups
// @desc    Get all groups
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    // If user is a teacher, only show their assigned groups
    if (req.user.role === 'teacher') {
      query._id = { $in: req.user.assignedGroups };
    }

    const groups = await Group.find(query)
      .populate('teachers', 'name email')
      .populate({
        path: 'students',
        select: 'firstName lastName age',
        options: { limit: 5 }, // Limit for performance
      })
      .sort({ name: 1 });

    // Get next schedule for each group
    const groupsWithSchedule = await Promise.all(
      groups.map(async (group) => {
        const nextSchedule = await Schedule.findOne({
          group: group._id,
          date: { $gte: new Date() },
        })
          .sort({ date: 1, startTime: 1 })
          .limit(1);

        const groupObj = group.toObject();
        groupObj.nextTraining = nextSchedule
          ? {
              date: nextSchedule.date,
              startTime: nextSchedule.startTime,
            }
          : null;
        groupObj.studentCount = group.students.length;

        return groupObj;
      })
    );

    res.json({
      success: true,
      data: groupsWithSchedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/groups/:id
// @desc    Get single group
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('teachers', 'name email')
      .populate({
        path: 'students',
        populate: {
          path: 'parent',
          select: 'firstName lastName email phone',
        },
      });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Check if user has access to this group
    if (
      req.user.role === 'teacher' &&
      !req.user.assignedGroups.includes(group._id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this group',
      });
    }

    res.json({
      success: true,
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/groups
// @desc    Create new group
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create groups',
      });
    }

    const group = await Group.create(req.body);

    res.status(201).json({
      success: true,
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/groups/:id
// @desc    Update group
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update groups',
      });
    }

    const group = await Group.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    res.json({
      success: true,
      data: group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/groups/:id
// @desc    Delete group
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete groups',
      });
    }

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Delete associated students
    await Student.deleteMany({ group: group._id });

    await group.deleteOne();

    res.json({
      success: true,
      message: 'Group deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

