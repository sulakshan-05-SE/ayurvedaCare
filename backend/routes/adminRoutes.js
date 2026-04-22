import express from 'express';
import bcrypt from 'bcryptjs';
import ExcelJS from 'exceljs';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Service from '../models/Service.js';
import Feedback from '../models/Feedback.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

// Appointments
router.get('/appointments', async (req, res) => {
  const appointments = await Appointment.find({})
    .populate('user', 'name email phone')
    .populate('service')
    .populate({ path: 'doctor', populate: { path: 'userId', select: 'name email' } })
    .sort({ createdAt: -1 });
  res.json(appointments);
});

router.put('/appointments/:id/status', async (req, res) => {
  const { status, rejectionReason } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (appointment) {
    appointment.status = status;
    if (status === 'Rejected' && rejectionReason) {
      appointment.rejectionReason = rejectionReason;
    }
    await appointment.save();
    res.json(appointment);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

router.put('/appointments/:id/assign-doctor', async (req, res) => {
  const { doctorId } = req.body;
  const appointment = await Appointment.findById(req.params.id);
  if (appointment) {
    appointment.doctor = doctorId;
    await appointment.save();
    res.json(appointment);
  } else {
    res.status(404).json({ message: 'Appointment not found' });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  const usersCount = await User.countDocuments({ role: 'user' });
  const doctorsCount = await Doctor.countDocuments({});
  const appointmentsCount = await Appointment.countDocuments({});
  const servicesCount = await Service.countDocuments({});
  res.json({ usersCount, doctorsCount, appointmentsCount, servicesCount });
});

// Users
router.get('/users', async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// Doctors
router.get('/doctors', async (req, res) => {
  const doctors = await Doctor.find({}).populate('userId', '-password');
  res.json(doctors);
});

// Create new Doctor (and User)
router.post('/doctors', async (req, res) => {
  const { name, email, password, phone, specialization, experience, consultationFee } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role: 'doctor', phone });
    const doctor = await Doctor.create({ userId: user._id, specialization, experience, consultationFee });
    res.status(201).json({ user, doctor });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create doctor' });
  }
});

// Update Doctor
router.put('/doctors/:id', async (req, res) => {
  const { name, email, phone, specialization, experience, consultationFee } = req.body;
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId');
    if (doctor) {
      doctor.specialization = specialization || doctor.specialization;
      doctor.experience = experience || doctor.experience;
      doctor.consultationFee = consultationFee || doctor.consultationFee;
      await doctor.save();

      const user = await User.findById(doctor.userId._id);
      if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        await user.save();
      }
      res.json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update doctor' });
  }
});

// Delete Doctor
router.delete('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (doctor) {
      await User.findByIdAndDelete(doctor.userId);
      await Appointment.deleteMany({ doctor: doctor._id });
      await Doctor.findByIdAndDelete(req.params.id);
      res.json({ message: 'Doctor removed' });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete doctor' });
  }
});

// Report Generation
router.get('/reports/excel', async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('user', 'name')
      .populate('service', 'title')
      .sort({ createdAt: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Appointments');

    worksheet.columns = [
      { header: 'TokenNo', key: 'token', width: 12 },
      { header: 'Patient', key: 'patientName', width: 25 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Service', key: 'service', width: 25 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 12 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    appointments.forEach(apt => {
      worksheet.addRow({
        token: apt.token ? `#${apt.token}` : '-',
        patientName: apt.user?.name || 'Unknown',
        phone: apt.phone || '-',
        service: apt.service?.title || 'General',
        date: new Date(apt.date).toLocaleDateString(),
        time: apt.time,
        status: apt.status
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ayurveda_bookings_report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Report Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

export default router;
