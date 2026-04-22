import express from 'express';
import News from '../models/News.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all news and tips (Public)
router.get('/', async (req, res) => {
  const news = await News.find({}).sort({ createdAt: -1 });
  res.json(news);
});

// Admin add news/tip
router.post('/', protect, admin, async (req, res) => {
  const { title, content, type } = req.body;
  const news = await News.create({ title, content, type });
  res.status(201).json(news);
});

// Admin delete news/tip
router.delete('/:id', protect, admin, async (req, res) => {
  const news = await News.findById(req.params.id);
  if (news) {
    await news.deleteOne();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Admin update news/tip
router.put('/:id', protect, admin, async (req, res) => {
  const { title, content, type } = req.body;
  const news = await News.findById(req.params.id);
  if (news) {
    news.title = title || news.title;
    news.content = content || news.content;
    news.type = type || news.type;
    await news.save();
    res.json(news);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

export default router;
