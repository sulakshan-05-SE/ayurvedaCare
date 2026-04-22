import express from 'express';
import Feedback from '../models/Feedback.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Submit feedback
router.post('/', protect, async (req, res) => {
  const { message, rating } = req.body;
  const feedback = await Feedback.create({
    user: req.user._id,
    message,
    rating
  });
  res.status(201).json(feedback);
});

// Admin get all feedback
router.get('/', protect, admin, async (req, res) => {
  const feedbacks = await Feedback.find({}).populate('user', 'name');
  res.json(feedbacks);
});

export default router;
