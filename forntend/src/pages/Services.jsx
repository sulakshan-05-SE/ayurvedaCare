import { useState, useEffect } from 'react';
import API from '../services/api';
import { Leaf, Clock, Banknote } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get('/services');
        setServices(res.data);
      } catch (error) {
        console.error("Failed to load services");
        // Provide dummy data if backend fails/is off
        setServices([
          { _id: '1', title: 'Panchakarma Detox', description: 'A complete holistic detox and cleansing program.', price: 5000, duration: '2 Hours' },
          { _id: '2', title: 'Abhyanga Body Massage', description: 'A warm oil healing massage to improve circulation.', price: 2000, duration: '1 Hour' },
          { _id: '3', title: 'Shirodhara Therapy', description: 'Pouring of warm herbal oil on the forehead for relaxation.', price: 2500, duration: '45 Mins' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">Our Healing Services</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Explore our range of ancient therapeutic treatments formulated to purify the mind and body.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading services...</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 pt-8">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden flex flex-col">
              {service.image ? (
                <div className="h-48 w-full bg-slate-200 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                </div>
              ) : (
                <div className="bg-emerald-50 h-48 flex justify-center items-center">
                  <Leaf className="h-16 w-16 text-emerald-600" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-slate-600 flex-grow mb-6">{service.description}</p>
                
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm font-semibold text-slate-700">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-emerald-600" /> {service.duration || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-emerald-600 mr-1">Rs.</span> {service.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
