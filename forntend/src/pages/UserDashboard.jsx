import { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar as CalendarIcon, Clock, Activity, FileText } from 'lucide-react';

const UserDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({ service: '', date: '', time: '', phone: '', address: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apptRes = await API.get('/appointments/myappointments');
      setAppointments(apptRes.data);
      const srvRes = await API.get('/services');
      setServices(srvRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments', formData);
      fetchData();
      setFormData({ service: '', date: '', time: '', phone: '', address: '' });
      alert('Appointment booked successfully!');
    } catch (err) {
      alert('Failed to book appointment');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">My Dashboard</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <CalendarIcon className="mr-2 text-emerald-600" /> Book an Appointment
          </h3>
          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
              <select required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})}>
                <option value="">Select Service</option>
                {services.map(s => <option key={s._id} value={s._id}>{s.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input type="date" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input type="time" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
              <input type="tel" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+94 77..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <textarea required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" placeholder="Full Address"></textarea>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold hover:bg-emerald-700">
              Book Now
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Activity className="mr-2 text-emerald-600" /> My Appointments
          </h3>
          {appointments.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl text-center text-slate-500 border border-slate-100 shadow-sm">
              No appointments booked yet.
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(apt => (
                <div key={apt._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{apt.service?.title || 'General Consultation'}</h4>
                    <div className="flex items-center text-slate-600 text-sm mt-1 space-x-4">
                      <span className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1"/> {new Date(apt.date).toLocaleDateString()}</span>
                      <span className="flex items-center"><Clock className="h-4 w-4 mr-1"/> {apt.time}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 flex flex-wrap gap-3">
                      {apt.token && <span><strong className="text-slate-700">Token:</strong> #{apt.token}</span>}
                      {apt.phone && <span><strong className="text-slate-700">Tel:</strong> {apt.phone}</span>}
                    </div>
                    {apt.notes && (
                      <p className="mt-3 text-sm text-slate-700 flex items-start bg-slate-50 p-2 rounded">
                        <FileText className="h-4 w-4 mr-2 text-emerald-600 mt-0.5 flex-shrink-0" /> 
                        {apt.notes}
                      </p>
                    )}
                    {apt.status === 'Rejected' && apt.rejectionReason && (
                      <p className="mt-3 text-sm text-red-700 flex items-start bg-red-50 p-2 rounded">
                        Reason: {apt.rejectionReason}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
