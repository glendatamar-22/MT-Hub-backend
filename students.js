import express from 'express';
import Student from '../models/Student.js';
import Group from '../models/Group.js';
import Parent from '../models/Parent.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/students
// @desc    Get all students (with optional group filter)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // If user is a teacher, only show students from their assigned groups
    if (req.user.role === 'teacher') {
      query.group = { $in: req.user.assignedGroups };
    }

    // Filter by group if provided
    if (req.query.group) {
      query.group = req.query.group;
    }

    // Search by name
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const students = await Student.find(query)
      .populate('group', 'name location')
      .populate('parent', 'firstName lastName email phone')
      .sort({ lastName: 1, firstName: 1 });

    res.json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get single student
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('group', 'name location')
      .populate('parent', 'firstName lastName email phone');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check if user has access to this student's group
    if (
      req.user.role === 'teacher' &&
      !req.user.assignedGroups.includes(student.group._id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this student',
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/students
// @desc    Create new student
// @access  Private (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create students',
      });
    }

    const { firstName, lastName, age, groupId, parentId } = req.body;

    // Verify group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found',
      });
    }

    // Verify parent exists
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: 'Parent not found',
      });
    }

    const student = await Student.create({
      firstName,
      lastName,
      age,
      group: groupId,
      parent: parentId,
    });

    // Add student to group
    group.students.push(student._id);
    await group.save();

    // Add student to parent
    parent.students.push(student._id);
    await parent.save();

    const populatedStudent = await Student.findById(student._id)
      .populate('group', 'name location')
      .populate('parent', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      data: populatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update students',
      });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('group', 'name location')
      .populate('parent', 'firstName lastName email phone');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete students',
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Remove student from group
    await Group.updateOne(
      { _id: student.group },
      { $pull: { students: student._id } }
    );

    // Remove student from parent
    await Parent.updateOne(
      { _id: student.parent },
      { $pull: { students: student._id } }
    );

    await student.deleteOne();

    res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;

