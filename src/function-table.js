document.addEventListener('DOMContentLoaded', function () {
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
            resultDiv.innerHTML = '';
            resultDiv2.innerHTML = '';

            if (result) {
                createTable(result, "resultDiv", [
                    ["หมายเลข VN", result[0]],
                    ["ชื่อ-นามสกุล", result[1]],
                    ["วันที่-เวลาลงทะเบียน", `${result[6]} ${result[7]}`],
                    ["วันที่-เวลานัด", `${result[6]}<br>${result[2]}`],
                    ["รายการนัด", result[12]],
                    ["ชื่อแพทย์", result[3]],
                    ["ห้องตรวจ", result[4]]
                ]);

                createTable(result, "resultDiv2", [
                    ["เวชระเบียน", result[7]],
                    ["ตรวจร่างกาย", result[8]],
                    ["ติดต่อพยาบาล", result[9]],
                    ["แพทย์ตรวจ", result[10]],
                    ["เวลารวมทั้งสิ้น", result[11]] // คืนค่าการแสดงเวลา
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
        resultDiv.innerHTML = '';

        if (data) {
            const table = document.createElement("table");
            table.className = "minimal-table";

            table.innerHTML = `
                <thead>
                    <tr>
                        <th>หัวข้อ</th>
                        <th>รายละเอียด</th>
                    </tr>
                </thead>
            `;

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

    function updateTime() {
        const timeElement = document.getElementById('time');
        const currentTime = new Date();
        let hours = currentTime.getHours();
        const minutes = currentTime.getMinutes().toString().padStart(2, '0');
        const seconds = currentTime.getSeconds().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        timeElement.textContent = `${hours}:${minutes}:${seconds} ${period}`;
    }

    function startClock() {
        const timeElement = document.getElementById('time');
        timeElement.style.display = 'block';
        setInterval(updateTime, 1000);
    }

    window.onload = function() {
        startClock();
    };

    const backButton = document.createElement("button");
    backButton.innerText = "กลับหน้าหลัก";
    backButton.className = "back-button";
    backButton.onclick = () => history.back();
    document.querySelector(".result2").appendChild(backButton);
});