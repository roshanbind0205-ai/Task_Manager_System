
import express from 'express';

import {
    getUserProfile,updateUserProfile,changePassword
} from '../controllers/userController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected User Routes
router.use(authMiddleware);

// Get User Profile
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);

export default router;
