import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import Cookies from 'js-cookie';
import { User, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      Cookies.set('token', res.data.token, { expires: 7 });
      Cookies.set('role', res.data.role, { expires: 7 });
      Cookies.set('name', res.data.name, { expires: 7 });
      if (res.data.image) Cookies.set('image', res.data.image, { expires: 7 });
      
      if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'doctor') navigate('/doctor');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
        <p className="text-slate-500 mt-2">Sign in to your account</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input type="email" required
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input type="password" required
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
        </div>
        <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md">
          Sign In
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account? <Link to="/register" className="text-emerald-600 font-semibold hover:underline">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
