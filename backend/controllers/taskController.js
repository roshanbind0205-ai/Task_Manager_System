
import Task from '../models/Task.js';

// @desc Create a new task
// @route POST /api/tasks
// @access Private

export const createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Task title is required'
            });
        }

        const task = await Task.create({
            user: req.user._id,
            title: title.trim(),
            description,
            status,
            priority,
            dueDate
        });

        return res.status(201).json({
            success: true,
            message: 'Task created successfully',
            task
        });

    } catch (error) {
        console.error('Create Task Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error while creating task'
        });
    }
};


// @desc Get all tasks of logged-in user
// @route GET /api/tasks
// @access Private

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user._id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });

    } catch (error) {
        console.error('Get Tasks Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error while fetching tasks'
        });
    }
};


// @desc Get single task
// @route GET /api/tasks/:id
// @access Private

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        return res.status(200).json({
            success: true,
            task
        });

    } catch (error) {
        console.error('Get Single Task Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while fetching task'
        });
    }
};


// @desc Update task
// @route PUT /api/tasks/:id
// @access Private

export const updateTask = async (req, res) => {
    try {
        const allowedFields = [
            'title',
            'description',
            'status',
            'priority',
            'dueDate'
        ];

        const updates = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (
            updates.title !== undefined &&
            (typeof updates.title !== 'string' || !updates.title.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: 'Valid task title is required'
            });
        }

        if (updates.title !== undefined) {
            updates.title = updates.title.trim();
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            task
        });

    } catch (error) {
        console.error('Update Task Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while updating task'
        });
    }
};


// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });

    } catch (error) {
        console.error('Delete Task Error:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while deleting task'
        });
    }
};
