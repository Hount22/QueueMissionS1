const express = require('express');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const dataFolder = path.join(__dirname, 'data'); // โฟลเดอร์ที่เก็บไฟล์ Excel

app.use(express.static('public')); // โฟลเดอร์เก็บไฟล์ static (CSS, JS)
app.use(express.static('views')); // โฟลเดอร์เก็บไฟล์ static (HTML)

function readLatestExcel() {
  const fileName = 'q.xlsx'; // ใช้ชื่อไฟล์ q.xlsx เท่านั้น

  const filePath = path.join(dataFolder, fileName);
  
  // ตรวจสอบว่ามีไฟล์ `q.xlsx` หรือไม่
  if (!fs.existsSync(filePath)) {
    console.log(`File ${fileName} not found!`);
    return [];
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  return data; // คืนค่าข้อมูลจากไฟล์ Excel
}

// อัปเดตข้อมูลไปยัง client ทุกๆ 15 วินาที
setInterval(() => {
  const data = readLatestExcel();
  io.emit('updateData', data); // ส่งข้อมูลไปยัง client ทุก 15 วินาที
}, 15000);

io.on('connection', socket => {
  console.log('A user connected');

  socket.on('checkVN', vn => {
    const data = readLatestExcel();
    const record = data.find(row => row.VN === vn); // ค้นหาข้อมูลจาก VN ที่กรอก
    socket.emit('vnStatus', record || { status: 'ไม่พบข้อมูล' }); // ส่งข้อมูลหรือข้อความถ้าไม่พบ
  });
});

server.listen(5500, () => console.log('Server running on http://localhost:5500'));
