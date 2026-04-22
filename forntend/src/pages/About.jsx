import { useState, useEffect } from 'react';
import API from '../services/api';
import { Info, Users } from 'lucide-react';

const About = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    API.get('/doctors').then(res => setDoctors(res.data)).catch(console.error);
  }, []);

  return (
    <div className="py-12 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">About AyurvedaCare</h1>
        <p className="text-lg text-slate-600">
          We are dedicated to bringing ancient, time-tested holistic healing to the modern world. Our approach balances mind, body, and spirit to promote optimal wellness.
        </p>
      </div>

      <div className="bg-emerald-50 rounded-3xl p-8 md:p-12 text-center md:text-left grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">Our Methodology</h2>
          <p className="text-emerald-700 leading-relaxed text-lg">
            Our priority is to provide authentic, high-quality Ayurvedic treatments tailored to the individual constitution (Prakriti) of our patients. We believe in getting to the root cause of health issues rather than just treating symptoms, fostering a long-term path to vitality.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
             <h3 className="text-3xl font-black text-slate-800">10k+</h3>
             <span className="text-slate-500">Patients Healed</span>
          </div>
          <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center shadow-sm">
             <h3 className="text-3xl font-black text-slate-800">15+</h3>
             <span className="text-slate-500">Expert Therapists</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800 flex justify-center items-center gap-2">
            <Users className="text-emerald-600" /> Meet Our Experts
          </h2>
          <p className="text-slate-600">Highly qualified Ayurvedic practitioners dedicated to your health.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 pt-4">
          {doctors.map(doc => (
            <div key={doc._id} className="bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col sm:flex-row overflow-hidden">
               <div className="sm:w-2/5 h-64 sm:h-auto bg-slate-200">
                  {doc.image ? (
                    <img src={doc.image} alt={doc.userId?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 bg-slate-100 uppercase font-black text-2xl">
                      {doc.userId?.name?.[0]}
                    </div>
                  )}
               </div>
               <div className="p-6 sm:w-3/5 flex flex-col justify-center space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{doc.userId?.name}</h3>
                    <p className="text-emerald-600 font-semibold">{doc.specialization}</p>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{doc.about || "Experienced practitioner committed to natural healing."}</p>
                  <div className="pt-2 flex items-center gap-4 text-sm font-medium text-slate-500">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{doc.experience} Years Exp.</span>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
