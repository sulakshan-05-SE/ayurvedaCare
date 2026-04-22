import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Leaf, Heart, Award, Star, Quote } from 'lucide-react';

const Home = () => {
  const [services, setServices] = useState([]);
  const [news, setNews] = useState([]);
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    API.get('/services').then(res => setServices(res.data.slice(0, 3))).catch(console.error);
    API.get('/news').then(res => setNews(res.data)).catch(console.error);
    API.get('/feedback').then(res => setFeedback(res.data.slice(0, 4))).catch(console.error);
  }, []);

  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Natural Healing with <span className="text-emerald-600">Ayurveda</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Experience holistic wellness and personalized treatments from our expert Ayurvedic practitioners.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/register" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Book Appointment
          </Link>
          <Link to="/services" className="bg-white text-emerald-700 px-8 py-3 rounded-full font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition shadow-md">
            View Services
          </Link>
        </div>
      </section>

      {/* Featured Services */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">Our Signature Services</h2>
          <p className="text-slate-600 mt-2">Discover the perfect treatment for your constitution.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map(s => (
            <div key={s._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition">
              <div className="h-48 w-full bg-slate-200">
                 {s.image ? <img src={s.image} alt={s.title} className="w-full h-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-slate-400 bg-emerald-50"><Leaf className="h-12 w-12"/></div>}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-slate-600 mb-4">{s.description}</p>
                <p className="font-bold text-emerald-600">Rs. {s.price} / {s.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Health Tips & News */}
      <section className="bg-emerald-800 text-white p-10 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Ayurvedic Insights & News</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {news.map(item => (
            <div key={item._id} className="bg-emerald-900 bg-opacity-50 p-6 rounded-2xl border border-emerald-700">
              <span className={`text-xs font-bold uppercase py-1 px-3 rounded-full ${item.type === 'news' ? 'bg-blue-500' : 'bg-yellow-500'} text-white`}>
                {item.type}
              </span>
              <h3 className="text-xl font-bold mt-3 mb-2">{item.title}</h3>
              <p className="text-emerald-100 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Feedback */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800">What Our Patients Say</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {feedback.map(fb => (
             <div key={fb._id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative">
               <Quote className="absolute top-6 right-6 h-10 w-10 text-emerald-100" />
               <div className="flex mb-4">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} className={`h-5 w-5 ${i < fb.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
                 ))}
               </div>
               <p className="text-slate-700 italic tracking-wide">"{fb.message}"</p>
               <h4 className="mt-4 font-bold text-emerald-800">- {fb.user?.name || 'Patient'}</h4>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
