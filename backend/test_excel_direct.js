import mongoose from 'mongoose';
import ExcelJS from 'exceljs';
import Appointment from './models/Appointment.js';
import User from './models/User.js';
import Service from './models/Service.js';

mongoose.connect('mongodb://127.0.0.1:27017/ayurveda_clinic');

async function test() {
  try {
    const appointments = await Appointment.find({})
      .populate('user', 'name')
      .populate('service', 'title');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Appointments');

    worksheet.columns = [
      { header: 'TokenNo', key: 'token', width: 12 },
      { header: 'Patient', key: 'patientName', width: 25 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Service', key: 'service', width: 25 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Time', key: 'time', width: 12 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    appointments.forEach(apt => {
      worksheet.addRow({
        token: apt.token ? `#${apt.token}` : '-',
        patientName: apt.user?.name || 'Unknown',
        phone: apt.phone || '-',
        service: apt.service?.title || 'General',
        date: new Date(apt.date).toLocaleDateString(),
        time: apt.time,
        status: apt.status
      });
    });

    await workbook.xlsx.writeFile('test.xlsx');
    console.log("Success");
  } catch (err) {
    console.error("FAIL", err);
  } finally {
    mongoose.disconnect();
  }
}

test();
