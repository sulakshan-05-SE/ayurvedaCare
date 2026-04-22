import { useState, useEffect } from 'react';
import API from '../services/api';
import { Check, X, CheckCircle, Edit, Trash2, Plus, Download } from 'lucide-react';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [stats, setStats] = useState(null);
  
  // News state
  const [newsList, setNewsList] = useState([]);
  const [editingNews, setEditingNews] = useState(null);

  // Users state
  const [allUsers, setAllUsers] = useState([]);

  // Doctor CRUD state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctorProfile, setEditingDoctorProfile] = useState(null);

  // Service CRUD state
  const [services, setServices] = useState([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await API.get('/admin/stats');
      setStats(statsRes.data);
      const apptRes = await API.get('/admin/appointments');
      setAppointments(apptRes.data);
      const docRes = await API.get('/admin/doctors');
      setDoctors(docRes.data);
      const newsRes = await API.get('/news');
      setNewsList(newsRes.data);
      const usersRes = await API.get('/admin/users');
      setAllUsers(usersRes.data);
      const servRes = await API.get('/services');
      setServices(servRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      let payload = { status };
      if (status === 'Rejected') {
        const reason = window.prompt("Enter rejection reason:");
        if (reason === null) return; // User cancelled
        payload.rejectionReason = reason;
      }
      await API.put(`/admin/appointments/${id}/status`, payload);
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await API.get('/admin/reports/excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ayurveda_bookings_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to download report: ' + (err.response?.statusText || err.message));
    }
  };

  const handleAssignDoctor = async (apptId, doctorId) => {
    if (!doctorId) return;
    try {
      await API.put(`/admin/appointments/${apptId}/assign-doctor`, { doctorId });
      alert('Doctor assigned successfully');
      fetchData();
    } catch (err) {
      alert('Failed to assign doctor');
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    
    try {
      if (editingNews) {
        await API.put(`/news/${editingNews._id}`, payload);
        alert('Updated successfully!');
      } else {
        await API.post('/news', payload);
        alert('Posted successfully!');
      }
      setEditingNews(null);
      e.target.reset();
      fetchData();
    } catch(err) {
      alert('Failed to save News/Tip');
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/news/${id}`);
      fetchData();
    } catch(err) {
      alert('Failed to delete post');
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    
    try {
      if (editingDoctorProfile) {
        await API.put(`/admin/doctors/${editingDoctorProfile._id}`, payload);
        alert('Doctor updated successfully!');
      } else {
        await API.post('/admin/doctors', payload);
        alert('Doctor created successfully!');
      }
      setIsDoctorModalOpen(false);
      setEditingDoctorProfile(null);
      fetchData();
    } catch(err) {
      alert(err.response?.data?.message || 'Failed to save doctor');
    }
  };

  const deleteDoctorProfile = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor and their user account?')) return;
    try {
      await API.delete(`/admin/doctors/${id}`);
      fetchData();
    } catch(err) {
      alert('Failed to delete doctor');
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    
    try {
      if (editingService) {
        await API.put(`/services/${editingService._id}`, payload);
        alert('Service updated successfully!');
      } else {
        await API.post('/services', payload);
        alert('Service created successfully!');
      }
      setIsServiceModalOpen(false);
      setEditingService(null);
      fetchData();
    } catch(err) {
      alert('Failed to save service');
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      fetchData();
    } catch(err) {
      alert('Failed to delete service');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Admin Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-emerald-600">{stats.usersCount}</span>
            <span className="text-slate-500 font-medium mt-1">Users</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-blue-600">{stats.appointmentsCount}</span>
            <span className="text-slate-500 font-medium mt-1">Appointments</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-purple-600">{stats.doctorsCount}</span>
            <span className="text-slate-500 font-medium mt-1">Doctors</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center">
            <span className="text-3xl font-extrabold text-orange-600">{stats.servicesCount}</span>
            <span className="text-slate-500 font-medium mt-1">Services</span>
          </div>
        </div>
      )}

      {/* Bookings Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">Booking Management</h3>
          <button onClick={handleDownloadReport} className="flex items-center text-sm bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-200 transition shadow-sm border border-emerald-200">
            <Download className="h-4 w-4 mr-2" /> Download Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm py-3 px-4 border-b border-slate-200">
                <th className="py-3 px-6 font-semibold">Patient</th>
                <th className="py-3 px-6 font-semibold">Service</th>
                <th className="py-3 px-6 font-semibold">Date & Time</th>
                <th className="py-3 px-6 font-semibold">Status</th>
                <th className="py-3 px-6 font-semibold">Assigned Doctor</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map(apt => (
                <tr key={apt._id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-800 flex items-center justify-between">
                      <span>{apt.user?.name}</span>
                      {apt.token && <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded ml-2">#{apt.token}</span>}
                    </div>
                    <div className="text-xs text-slate-500">{apt.user?.email}</div>
                    {(apt.phone || apt.address) && (
                      <div className="text-[11px] text-slate-400 mt-1 leading-tight">
                        {apt.phone && <div>Tel: {apt.phone}</div>}
                        {apt.address && <div className="truncate max-w-[150px]" title={apt.address}>{apt.address}</div>}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-700">{apt.service?.title}</td>
                  <td className="py-4 px-6 text-slate-700 text-sm">
                    {new Date(apt.date).toLocaleDateString()} at {apt.time}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${apt.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 
                        apt.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        apt.status === 'Completed' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {apt.status === 'Approved' || apt.status === 'Completed' ? (
                      apt.doctor ? (
                        <span className="text-sm font-semibold text-emerald-700">{apt.doctor.userId?.name || 'Doctor Assigned'}</span>
                      ) : (
                        <select 
                          onChange={(e) => handleAssignDoctor(apt._id, e.target.value)}
                          className="w-full text-sm border-slate-300 rounded-md p-1 focus:ring-emerald-500 outline-none"
                          defaultValue=""
                        >
                          <option value="" disabled>Select Doctor</option>
                          {doctors.map(d => (
                            <option key={d._id} value={d._id}>
                              {d.userId?.name || 'Dr.'} - {d.specialization}
                            </option>
                          ))}
                        </select>
                      )
                    ) : (
                      <span className="text-xs text-slate-400">Needs Approval First</span>
                    )}
                  </td>
                  <td className="py-4 px-6 flex justify-center gap-2">
                    {apt.status === 'Pending' && (
                      <>
                        <button onClick={() => handleStatusChange(apt._id, 'Approved')} title="Approve Booking"
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded-lg transition">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleStatusChange(apt._id, 'Rejected')} title="Reject Booking"
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {(apt.status === 'Approved') && (
                      <button onClick={() => handleStatusChange(apt._id, 'Completed')} title="Mark Booking Completed"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* News & Tips CRUD Section */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Form Column */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">
          <div className="p-5 border-b border-slate-100 bg-emerald-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-emerald-900">
              {editingNews ? 'Edit Post' : 'Create New Post'}
            </h3>
            {editingNews && (
              <button onClick={() => setEditingNews(null)} className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center">
                 <Plus className="h-3 w-3 mr-1" /> New Post
              </button>
            )}
          </div>
          <form className="p-5 space-y-4" onSubmit={handleNewsSubmit}>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
               <input name="title" key={editingNews?.title || 't'} defaultValue={editingNews?.title} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
               <select name="type" key={editingNews?.type || 'y'} defaultValue={editingNews?.type || 'tip'} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm">
                  <option value="tip">Health Tip</option>
                  <option value="news">Clinic News</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
               <textarea name="content" key={editingNews?.content || 'c'} defaultValue={editingNews?.content} rows="4" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm"></textarea>
             </div>
             <button type="submit" className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition text-sm">
               {editingNews ? 'Save Changes' : 'Publish Post'}
             </button>
          </form>
        </div>

        {/* Existing Posts Column */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">Manage Published Posts</h3>
          </div>
          <div className="p-5 space-y-4">
            {newsList.length === 0 ? (
              <p className="text-slate-500 text-sm">No posts published yet.</p>
            ) : (
              newsList.map(item => (
                <div key={item._id} className="flex justify-between items-start p-4 border border-slate-200 rounded-xl hover:shadow-sm transition">
                  <div className="flex-1 pr-4">
                    <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full ${item.type === 'news' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.type}
                    </span>
                    <h4 className="font-bold text-slate-800 mt-1">{item.title}</h4>
                    <p className="text-sm text-slate-600 line-clamp-2 mt-1">{item.content}</p>
                    <span className="text-xs text-slate-400 mt-2 block">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setEditingNews(item)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => deleteNews(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
      </div>
      
      {/* Users & Doctors Directory Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800">User & Doctor Directory</h3>
            <p className="text-sm text-slate-500 mt-1">Manage system accounts and persons' details.</p>
          </div>
          <button onClick={() => { setEditingDoctorProfile(null); setIsDoctorModalOpen(true); }} className="flex items-center text-sm bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-semibold hover:bg-purple-200 transition shadow-sm border border-purple-200">
            <Plus className="h-4 w-4 mr-2" /> Add Doctor
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm py-3 px-4 border-b border-slate-200">
                <th className="py-3 px-6 font-semibold">Name & Identity</th>
                <th className="py-3 px-6 font-semibold">Contact Info</th>
                <th className="py-3 px-6 font-semibold">Role</th>
                <th className="py-3 px-6 font-semibold">Additional Details</th>
                <th className="py-3 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allUsers.map(user => {
                const doctorProfile = doctors.find(d => d.userId?._id === user._id);
                return (
                <tr key={user._id} className="hover:bg-slate-50 transition">
                  <td className="py-4 px-6 flex items-center gap-3">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">ID: {user._id.slice(-6)}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-700 text-sm font-medium">{user.email}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{user.phone || 'No Phone'}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold uppercase rounded-full 
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 
                        'bg-slate-100 text-slate-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {user.role === 'doctor' && doctorProfile ? (
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">{doctorProfile.specialization}</span>
                        <div className="text-xs text-slate-500 mt-0.5">{doctorProfile.experience} years exp • Fee: Rs. {doctorProfile.consultationFee}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500">
                        {user.age ? `${user.age} yrs` : '-'} {user.gender ? `• ${user.gender}` : ''}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 flex justify-center gap-2">
                    {user.role === 'doctor' && doctorProfile && (
                      <>
                        <button onClick={() => { setEditingDoctorProfile(doctorProfile); setIsDoctorModalOpen(true); }} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition" title="Edit Doctor">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteDoctorProfile(doctorProfile._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Remove Doctor">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Doctor Modal */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {editingDoctorProfile ? 'Edit Doctor Profile' : 'Add New Doctor'}
              </h3>
              <button onClick={() => setIsDoctorModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="p-5 space-y-4" onSubmit={handleDoctorSubmit}>
              {!editingDoctorProfile && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" name="password" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input name="name" defaultValue={editingDoctorProfile?.userId?.name} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" name="email" defaultValue={editingDoctorProfile?.userId?.email} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" name="phone" defaultValue={editingDoctorProfile?.userId?.phone || ''} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                <input name="specialization" defaultValue={editingDoctorProfile?.specialization} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
                  <input type="number" name="experience" defaultValue={editingDoctorProfile?.experience} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fee</label>
                  <input type="number" name="consultationFee" defaultValue={editingDoctorProfile?.consultationFee} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition text-sm">
                  {editingDoctorProfile ? 'Save Changes' : 'Create Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Management Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Services Management</h3>
            <p className="text-sm text-slate-500 mt-1">Manage the list of clinic services offered.</p>
          </div>
          <button onClick={() => { setEditingService(null); setIsServiceModalOpen(true); }} className="flex items-center text-sm bg-orange-100 text-orange-800 px-4 py-2 rounded-lg font-semibold hover:bg-orange-200 transition shadow-sm border border-orange-200">
            <Plus className="h-4 w-4 mr-2" /> Add Service
          </button>
        </div>
        <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service._id} className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition bg-slate-50">
               {service.image && <img src={service.image} alt={service.title} className="w-full h-32 object-cover bg-slate-200" />}
               <div className="p-4">
                 <h4 className="font-bold text-slate-800 text-lg">{service.title}</h4>
                 <p className="text-slate-500 text-sm mt-1 line-clamp-2">{service.description}</p>
                 <div className="mt-4 flex justify-between items-center">
                   <div className="text-sm font-semibold text-emerald-600">Rs. {service.price} • {service.duration}</div>
                   <div className="flex gap-2">
                     <button onClick={() => { setEditingService(service); setIsServiceModalOpen(true); }} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition" title="Edit Service">
                        <Edit className="h-4 w-4" />
                     </button>
                     <button onClick={() => deleteService(service._id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition" title="Delete Service">
                        <Trash2 className="h-4 w-4" />
                     </button>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="p-5 space-y-4" onSubmit={handleServiceSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input name="title" defaultValue={editingService?.title} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" defaultValue={editingService?.description} required rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (Rs.)</label>
                  <input type="number" name="price" defaultValue={editingService?.price} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                  <input name="duration" placeholder="e.g. 1 Hour" defaultValue={editingService?.duration} required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                <input type="url" name="image" defaultValue={editingService?.image} placeholder="Optional image link" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-sm" />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition text-sm">
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
