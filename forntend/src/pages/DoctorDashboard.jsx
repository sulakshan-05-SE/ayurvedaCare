import { useState, useEffect } from 'react';
import API from '../services/api';
import { FileText, Save } from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get('/doctors/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveNotes = async (id) => {
    try {
      await API.put(`/doctors/appointments/${id}/notes`, { notes });
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert('Failed to save notes');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Doctor Dashboard</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100 bg-emerald-50 rounded-t-2xl">
          <h3 className="text-xl font-bold text-emerald-800">My Appointments</h3>
          <p className="text-emerald-600 text-sm mt-1">Approved & Completed appointments.</p>
        </div>
        
        <div className="p-6 space-y-6">
          {appointments.length === 0 ? (
            <p className="text-center text-slate-500 py-4">No appointments found.</p>
          ) : appointments.map(apt => (
            <div key={apt._id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{apt.user?.name}</h4>
                  <p className="text-sm text-slate-600 font-medium">Service: {apt.service?.title}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-800">
                    {new Date(apt.date).toLocaleDateString()} at {apt.time}
                  </div>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border uppercase ${apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg mt-4">
                <h5 className="text-sm font-semibold text-slate-700 flex items-center mb-2">
                  <FileText className="h-4 w-4 mr-1 text-slate-500" /> Treatment Notes
                </h5>
                
                {editingId === apt._id ? (
                  <div className="space-y-3">
                    <textarea 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                      rows="3"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add prescription, treatment notes..."
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200 rounded transition whitespace-nowrap">
                        Cancel
                      </button>
                      <button onClick={() => saveNotes(apt._id)} className="px-3 py-1.5 text-sm bg-emerald-600 text-white hover:bg-emerald-700 rounded transition flex items-center whitespace-nowrap">
                        <Save className="h-4 w-4 mr-1" /> Save Notes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {apt.notes || <span className="text-slate-400 italic">No notes added yet.</span>}
                    </p>
                    <button 
                      onClick={() => { setEditingId(apt._id); setNotes(apt.notes || ''); }}
                      className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 outline-none"
                    >
                      {apt.notes ? 'Edit Notes' : '+ Add Notes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
