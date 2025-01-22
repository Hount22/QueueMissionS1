const inputField = document.getElementById("First-name");
const submitButton = document.getElementById("submitButton");

let validVN = []; // จะเก็บหมายเลข VN ที่ดึงมาจากไฟล์ Excel

// ฟังก์ชันโหลดข้อมูลจากไฟล์ Excel
async function loadExcelData() {
    try {
        const response = await fetch("/data/q.xlsx"); // โหลดไฟล์ Excel
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // ดึงหมายเลข VN จากไฟล์ (สมมุติว่าอยู่ในคอลัมน์แรก)
        validVN = data.map(row => row[0]?.toString().trim()).filter(Boolean); // ตรวจสอบว่าไม่เป็นค่าว่าง
    } catch (error) {
        console.error("Error loading Excel file:", error);
    }
}

// เรียกฟังก์ชันโหลดข้อมูลเมื่อเริ่มต้น
loadExcelData();

// ตรวจสอบการกรอก VN
inputField.addEventListener("input", () => {
    const inputText = inputField.value.trim();
    if (inputText === "") {
        submitButton.disabled = true;
        submitButton.classList.remove("active");
    } else if (validVN.includes(inputText)) {
        submitButton.disabled = false;
        submitButton.classList.add("active");
    } else {
        submitButton.disabled = true;
        submitButton.classList.remove("active");
    }
});

// เมื่อกดปุ่มค้นหา
submitButton.addEventListener("click", () => {
    const vnValue = inputField.value.trim();
    if (!validVN.includes(vnValue)) {
        alert("Error: คุณกรอกข้อมูลไม่ถูกต้อง");
        window.location.reload(); // รีเฟรชหน้าเพื่อกรอกใหม่
    } else {
        localStorage.setItem("vnData", vnValue); // เก็บ VN ที่ถูกต้อง
        window.location.href = "resultdata.html"; // ไปหน้าถัดไป
    }
});
