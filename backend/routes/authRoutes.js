import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import Doctor from '../models/Doctor.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone, address, age, gender, image } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name, email, password: hashedPassword, role: role || 'user',
    phone, address, age, gender, image
  });

  if (user.role === 'doctor') {
    await Doctor.create({
      userId: user._id, 
      specialization: 'General Ayurveda',
      experience: 1,
      consultationFee: 500
    });
  }

  if (user) {
    res.status(201).json({
      _id: user.id, name: user.name, email: user.email, role: user.role, image: user.image,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id, name: user.name, email: user.email, role: user.role, image: user.image,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

export default router;
