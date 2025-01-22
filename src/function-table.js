const vnData = localStorage.getItem("vnData");
console.log("VN from localStorage:", vnData);

async function loadExcelAndDisplayData() {
    try {
        const response = await fetch("../data/q.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("Excel Data:", data);

        const result = data.find(row => row[0]?.toString().trim() === vnData);
        console.log("Result Data:", result);

        const resultDiv = document.getElementById("resultDiv");
        const resultDiv2 = document.getElementById("resultDiv2");
        resultDiv.innerHTML = ''; // ล้างเนื้อหาเก่าก่อนเพิ่มใหม่
        resultDiv2.innerHTML = ''; // ล้างเนื้อหาเก่าก่อนเพิ่มใหม่

        if (result) {
            // สร้างตารางใน resultDiv
            createTable(result, "resultDiv", [
                ["หมายเลข VN", result[0]],
                ["ชื่อ-นามสกุล", result[1]],
                ["ข้อมูลเพิ่มเติม", result[2]],
                ["วันที่-เวลาลงทะเบียน", `${result[6]} ${result[7]}`],
                ["วันที่-เวลานัด", `${result[6]} ${result[2]}`],
                ["รายการนัด", result[12]],
                ["ชื่อแพทย์", result[3]],
                ["ห้องตรวจ", result[4]]
            ]);

            // สร้างตารางใน resultDiv2
            createTable(result, "resultDiv2", [
                ["เวชระเบียน", result[7]],
                ["ตรวจร่างกาย", result[8]],
                ["ติดต่อพยาบาล", result[9]],
                ["แพทย์ตรวจ", result[10]],
                ["เวลารวมทั้งสิ้น", result[11]]
            ]);
        } else {
            resultDiv.innerHTML = `<p style="color: red;">ไม่พบข้อมูล VN</p>`;
            resultDiv2.innerHTML = `<p style="color: red;">ไม่พบข้อมูล VN</p>`;
        }
    } catch (error) {
        console.error("Error loading Excel file:", error);
    }
}

function createTable(data, elementId, rowsData) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.innerHTML = ''; // ล้างเนื้อหาเก่าก่อนเพิ่มใหม่

    if (data) {
        // สร้างตาราง
        const table = document.createElement("table");
        table.className = "minimal-table";

        // สร้างหัวตาราง
        table.innerHTML = `
            <thead>
                <tr>
                    <th>หัวข้อ</th>
                    <th>รายละเอียด</th>
                </tr>
            </thead>
        `;

        // สร้างเนื้อหาในตาราง
        const tbody = document.createElement("tbody");
        rowsData.forEach(([key, value]) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${key}</td><td>${value}</td>`;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        resultDiv.appendChild(table);
    } else {
        resultDiv.innerHTML = `<p style="color: red;">ไม่พบข้อมูล VN</p>`;
    }
}

loadExcelAndDisplayData();


// ฟังก์ชันในการอัพเดตเวลา
function updateTime() {
    const timeElement = document.getElementById('time');
    const currentTime = new Date();

    // การคำนวณเวลาในรูปแบบ 12 ชั่วโมง
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');
    
    // กำหนด AM หรือ PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // แปลงเวลาเป็นรูปแบบ 12 ชั่วโมง
    hours = hours % 12;
    hours = hours ? hours : 12; // ถ้าเวลาเป็น 0 ให้เปลี่ยนเป็น 12

    // แสดงเวลาในรูปแบบ HH:MM:SS AM/PM
    timeElement.textContent = `${hours}:${minutes}:${seconds} ${period}`;
}

// ฟังก์ชันที่จะทำงานและแสดงเวลา
function startClock() {
    const timeElement = document.getElementById('time');
    timeElement.style.display = 'block'; // แสดงเวลาเมื่อเริ่มทำงาน
    setInterval(updateTime, 1000); // เริ่มการอัพเดตเวลา
}

// เมื่อฟังก์ชัน JS ทำงาน ให้เริ่มแสดงเวลา
window.onload = function() {
    startClock(); // เรียกใช้งานฟังก์ชันเพื่อเริ่มต้น
};




document.addEventListener('DOMContentLoaded', function () {
    const scrollPrompt = document.getElementById('scrollPrompt');
    let isPromptClicked = false; // ติดตามสถานะการคลิก

    // แสดงป๊อปอัปเมื่อโหลดหน้า
    scrollPrompt.style.display = 'block';

    // ตรวจสอบเมื่อผู้ใช้เลื่อน
    window.addEventListener('scroll', function () {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        // หากเลื่อนถึงจุดสุดท้าย ซ่อนป๊อปอัป
        if (scrollTop + clientHeight >= scrollHeight - 10 && !isPromptClicked) {
            scrollPrompt.style.display = 'none';
        }

        // หากเลื่อนกลับมาด้านบนสุด แสดงป๊อปอัปอีกครั้ง
        if (scrollTop === 0 && !isPromptClicked) {
            scrollPrompt.style.display = 'block';
        }
    });

    // ซ่อนป๊อปอัปเมื่อคลิก
    scrollPrompt.addEventListener('click', function () {
        scrollPrompt.style.display = 'none';
        isPromptClicked = true; // เปลี่ยนสถานะเมื่อคลิก
    });
});
