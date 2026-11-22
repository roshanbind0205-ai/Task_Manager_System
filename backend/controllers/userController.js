import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            user
        });

    } catch (error) {
        console.error('Get Profile Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const updates = {};

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Name must be at least 3 characters'
                });
            }

            updates.name = name.trim();
        }

        if (email !== undefined) {
            if (typeof email !== 'string' || !email.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid email is required'
                });
            }

            updates.email = email.trim().toLowerCase();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name or email to update'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        console.error('Update Profile Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password'
            });
        }

        if (typeof newPassword !== 'string' || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = await bcrypt.hash(newPassword, 12);

        // Invalidate all existing JWT tokens
        user.tokenVersion += 1;

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully. Please login again.'
        });

    } catch (error) {
        console.error('Change Password Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Server error while changing password'
        });
    }
};
