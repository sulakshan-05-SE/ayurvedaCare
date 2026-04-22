import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create appointment
router.post('/', protect, async (req, res) => {
  const { service, date, time, phone, address } = req.body;
  const token = Math.floor(1000 + Math.random() * 9000).toString(); // Simple 4-digit token
  const appointment = await Appointment.create({
    user: req.user._id,
    service,
    date,
    time,
    phone,
    address,
    token
  });
  res.status(201).json(appointment);
});

// Get user's appointments
router.get('/myappointments', protect, async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id }).populate('service').populate('doctor');
  res.json(appointments);
});

export default router;
