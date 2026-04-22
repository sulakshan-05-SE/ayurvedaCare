import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Cookies from 'js-cookie';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', role: 'user',
    phone: '', address: '', age: '', gender: 'Other', image: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', formData);
      Cookies.set('token', res.data.token, { expires: 7 });
      Cookies.set('role', res.data.role, { expires: 7 });
      Cookies.set('name', res.data.name, { expires: 7 });
      if (res.data.image) Cookies.set('image', res.data.image, { expires: 7 });
      
      if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'doctor') navigate('/doctor');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input type="text" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input type="tel" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+94 77..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
            <input type="number" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} min="1" max="120" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
            <select 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
              <option value="Select">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <input type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Full address" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Profile Image URL</label>
            <input type="url" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/avatar.png" />
          </div>
          <div className="md:col-span-2 bg-emerald-50 p-4 rounded-lg mt-2">
            <label className="block text-sm font-medium text-emerald-900 mb-1">Account Role</label>
            <select 
              className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-700"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="user">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Administrator (Demo)</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md mt-4">
          Register
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-emerald-600 font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
