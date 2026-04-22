import { Link } from 'react-router-dom';
import { Activity, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-emerald-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
              <Activity className="h-8 w-8 text-emerald-400" />
              <span>AyurvedaCare</span>
            </Link>
            <p className="text-emerald-200/80 text-sm leading-relaxed">
              Experience the ancient wisdom of holistic healing. We provide natural, time-tested treatments to bring balance back to your life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-emerald-400 transition">About Us</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition">Our Services</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition">Contact</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition">Patient Portal</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-emerald-200/80">
                <MapPin className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm">123 Ayurveda Road, Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-3 text-emerald-200/80">
                <Phone className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm">+94 77 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 text-emerald-200/80">
                <Mail className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm">care@ayurvedacare.com</span>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 hover:text-white transition w-8 h-8 flex items-center justify-center text-xs font-bold text-emerald-200">
                FB
              </a>
              <a href="#" className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 hover:text-white transition w-8 h-8 flex items-center justify-center text-xs font-bold text-emerald-200">
                TW
              </a>
              <a href="#" className="bg-emerald-800 p-2 rounded-full hover:bg-emerald-700 hover:text-white transition w-8 h-8 flex items-center justify-center text-xs font-bold text-emerald-200">
                IG
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-emerald-800 text-center text-sm text-emerald-400/60">
          <p>&copy; {new Date().getFullYear()} AyurvedaCare Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
