const inputField = document.getElementById('First-name');
const submitButton = document.getElementById('submitButton');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.close-btn');


// ฟังก์ชันสำหรับอ่านไฟล์ Excel และดึงข้อมูลจากคอลัมน์ "VN"
async function loadExcelData() {
  try {
    const response = await fetch('/data/q.xlsx'); // เข้าถึงไฟล์จากเส้นทางที่ตั้งไว้ใน Express
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // อ่านข้อมูลจาก sheet แรก
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // แปลงข้อมูลใน sheet เป็น JSON
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });  // ใช้ header: 1 เพื่อให้ได้ข้อมูลในรูปแบบแถว
    console.log(data); // ตรวจสอบข้อมูลที่ได้จาก Excel
    return data;
  } catch (error) {
    console.error("Error loading Excel file:", error);
  }
}


// ฟังก์ชันค้นหา VN
function searchVN(vnValue, data) {
  const vnColumnIndex = 0; // คอลัมน์ VN เป็นคอลัมน์แรก (A)
  const results = data.filter(row => row[vnColumnIndex] && row[vnColumnIndex].toString() === vnValue);
  console.log(results); // ตรวจสอบผลลัพธ์การค้นหา
  return results.length > 0 ? results[0] : null;  // ส่งคืนแถวที่ตรงกัน
}

// ฟังก์ชันแสดงข้อมูลใน div.result
function displayData(data) {
  const resultDiv = document.querySelector('.result');
  resultDiv.innerHTML = ''; // ล้างข้อมูลเก่า

  if (data) {
    resultDiv.innerHTML = `
      <p><strong>ข้อมูลที่ตรงกัน:</strong></p>
      <p><strong>VN:</strong> ${data[0]}</p>  <!-- คอลัมน์ A -->
      <p><strong>ลำดับที่:</strong> ${data[1]}</p>  <!-- คอลัมน์ B -->
      <p><strong>Status:</strong> ${data[2]}</p>  <!-- คอลัมน์ C -->
    `;
  } else {
    resultDiv.innerHTML = `<p>ไม่พบข้อมูลที่ตรงกัน</p>`;
  }
}

// ฟังก์ชันตรวจสอบการพิมพ์ข้อมูลใน input
inputField.addEventListener("input", async (event) => {
  const inputText = inputField.value.trim(); // ข้อความที่ผู้ใช้พิมพ์

  if (inputText === "") {
    modal.classList.remove('active');
    submitButton.disabled = true;
    submitButton.classList.remove('active');
    return;
  }

  const data = await loadExcelData(); // โหลดข้อมูลจากไฟล์ Excel

  // ตรวจสอบว่าค่าที่พิมพ์ตรงกับคอลัมน์ VN หรือไม่
  const result = searchVN(inputText, data);

  // แสดงข้อมูลที่ค้นพบ
  displayData(result);

  // แสดง modal
  modal.classList.add('active');

  if (result) {
    submitButton.disabled = false;
    submitButton.classList.add('active');
  } else {
    submitButton.disabled = true;
    submitButton.classList.remove('active');
  }
});

// ปิด modal เมื่อคลิกปุ่มปิด
closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
});

// เพิ่มฟังก์ชันสำหรับรีเฟรชหน้าเมื่อคลิกปุ่ม "ค้นหา"
submitButton.addEventListener('click', () => {
  location.reload();
});
