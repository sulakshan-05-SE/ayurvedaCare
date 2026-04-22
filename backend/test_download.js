import mongoose from 'mongoose';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

mongoose.connect('mongodb://127.0.0.1:27017/ayurveda_clinic');

async function test() {
  try {
    const admin = await User.findOne({ role: 'admin' });
    const token = jwt.sign({ id: admin._id }, 'ayurveda_super_secret_key_123', { expiresIn: '30d' });

    const res = await fetch('http://127.0.0.1:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status: ${res.status} Text: ${text}`);
    }
    
    const data = await res.json();
    console.log('Users fetched! Count:', data.length);

  } catch (err) {
    console.error('Fetch failed:', err.message);
  } finally {
     mongoose.disconnect();
  }
}

test();
