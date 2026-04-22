import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  consultationFee: { type: Number, required: true },
  about: { type: String },
  image: { type: String }
}, { timestamps: true });

// Note: In this simple app, Doctors might have a User account with role 'doctor' 
// or they are listed independently. We'll use role 'doctor' in User model,
// but since the requirement says "Admin / Doctor / User", let's update User schema role.
// Actually, I'll update it later or just write it here if it's fine. 

export default mongoose.model('Doctor', doctorSchema);
