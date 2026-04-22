import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { LogOut, User, Activity } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const name = Cookies.get('name');
  const image = Cookies.get('image');

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('name');
    Cookies.remove('image');
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
              <Activity className="h-6 w-6 text-emerald-300" />
              <span>AyurvedaCare</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 ms-8">
            <Link to="/" className="hover:text-emerald-200 transition font-medium">Home</Link>
            <Link to="/about" className="hover:text-emerald-200 transition font-medium">About</Link>
            <Link to="/services" className="hover:text-emerald-200 transition font-medium">Services</Link>
            <Link to="/contact" className="hover:text-emerald-200 transition font-medium">Contact</Link>
          </div>

          <div className="flex items-center space-x-4 ms-auto">
            {!token ? (
              <>
                <Link to="/login" className="hover:text-emerald-200 transition">Login</Link>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-md font-medium transition shadow-sm">Register</Link>
              </>
            ) : (
              <>
                <span className="text-emerald-100 hidden sm:inline-flex items-center gap-2">
                  {image ? (
                    <img src={image} alt={name} className="h-6 w-6 rounded-full object-cover border border-emerald-500" />
                  ) : (
                    <User className="h-4 w-4"/> 
                  )}
                  {name} ({role})
                </span>
                {role === 'admin' && <Link to="/admin" className="hover:text-emerald-200">Admin</Link>}
                {role === 'doctor' && <Link to="/doctor" className="hover:text-emerald-200">Doctor</Link>}
                {role === 'user' && <Link to="/dashboard" className="hover:text-emerald-200">Dashboard</Link>}
                
                <button onClick={handleLogout} className="flex items-center bg-red-600 hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium transition shadow-sm">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
