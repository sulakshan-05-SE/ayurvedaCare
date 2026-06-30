import express from 'express'; // Trigger restart
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (to be added)
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import newsRoutes from './routes/newsRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/news', newsRoutes);

import path from 'path';

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  // Serve static files from the frontend dist folder
  app.use(express.static(path.join(__dirname, '../forntend/dist')));

  // For any other route, send back the frontend index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../forntend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Ayurveda Clinic API is running');
  });
}

// Start Server
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
