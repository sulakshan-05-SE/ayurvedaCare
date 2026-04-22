import express from 'express';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { protect, doctor, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all doctors (public)
router.get('/', async (req, res) => {
  const doctors = await Doctor.find({}).populate('userId', 'name email');
  res.json(doctors);
});

// Doctor Dashboard - Get approved appointments for this doctor
router.get('/appointments', protect, doctor, async (req, res) => {
  // Assuming a doctor document links to userId
  const doctorProfile = await Doctor.findOne({ userId: req.user._id });
  if (!doctorProfile) return res.status(404).json({ message: 'Doctor profile not found' });

  const appointments = await Appointment.find({ doctor: doctorProfile._id, status: { $in: ['Approved', 'Completed'] } }).populate('user', 'name email phone').populate('service');
  res.json(appointments);
});

// Update treatment notes
router.put('/appointments/:id/notes', protect, doctor, async (req, res) => {
  const { notes, status } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (appointment) {
    appointment.notes = notes || appointment.notes;
    appointment.status = status || appointment.status;
    await appointment.save();
    res.json(appointment);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

export default router;
