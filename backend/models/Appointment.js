import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Admin assigns doctor later or user picks
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'], 
    default: 'Pending' 
  },
  phone: { type: String },
  address: { type: String },
  token: { type: String },
  rejectionReason: { type: String },
  notes: { type: String } // Doctor's treatment notes
}, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
