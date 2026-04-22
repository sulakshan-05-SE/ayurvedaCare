import express from 'express';
import Service from '../models/Service.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all services
router.get('/', async (req, res) => {
  const services = await Service.find({});
  res.json(services);
});

// Admin add service
router.post('/', protect, admin, async (req, res) => {
  const { title, description, price, duration, image } = req.body;
  const service = await Service.create({ title, description, price, duration, image });
  res.status(201).json(service);
});
// Admin update service
router.put('/:id', protect, admin, async (req, res) => {
  const { title, description, price, duration, image } = req.body;
  const service = await Service.findById(req.params.id);
  if (service) {
    service.title = title || service.title;
    service.description = description || service.description;
    service.price = price || service.price;
    service.duration = duration || service.duration;
    service.image = image || service.image;
    
    await service.save();
    res.json(service);
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
});

// Admin delete service
router.delete('/:id', protect, admin, async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (service) {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed' });
  } else {
    res.status(404).json({ message: 'Service not found' });
  }
});

export default router;
