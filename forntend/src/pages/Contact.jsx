import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-12 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">Contact Us</h1>
        <p className="text-lg text-slate-600 md:px-24">
          Have questions about our treatments or want to schedule a visit? Reach out to our team.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <Phone className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Phone</h3>
          <p className="text-slate-600">+94 77 123 4567</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <Mail className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Email</h3>
          <p className="text-slate-600">care@ayurvedacare.com</p>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <MapPin className="h-10 w-10 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Location</h3>
          <p className="text-slate-600">123 Ayurveda Road, Colombo 03, Sri Lanka</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mt-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 font-semibold">Send a Message</h2>
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
              <input type="text" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input type="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea required rows="4" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-md w-full md:w-auto">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
