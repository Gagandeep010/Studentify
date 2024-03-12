const accountSid = '';
const authToken = '';
const twilioNumber = '+17605376526';

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

var form1 = document.getElementById("form1");
var studentDataArr = JSON.parse(localStorage.getItem("studentData")) || [];

function submitFun1(e) {
    e.preventDefault();
    var name = document.querySelector("#name").value;
    var Department = document.querySelector("#Department").value;
    var Section = document.querySelector("#Section").value;
    var rollNo = document.querySelector("#rollNo").value;

    var studentObj = {
        name: name,
        Department: Department,
        Section: Section,
        rollNo: rollNo,
        attendance: "N/A"
    };

    studentDataArr.push(studentObj);
    localStorage.setItem("studentData", JSON.stringify(studentDataArr));
    form1.reset();
    alert("Student Added Successfully");

    displayFun(studentDataArr);
}

function calculateAttendancePercentage(student) {
    const totalClasses = 12;
    const attendedClasses = 2;

    return (attendedClasses / totalClasses) * 100;
}

function sendSMS(student) {
    const phoneNumber = +916304258522;

    const message = `Dear ${student.name}, your attendance is less than 75%. Please improve your attendance.`;

    client.messages
        .create({
            body: message,
            from: twilioNumber,
            to: phoneNumber
        })
        .then((message) => console.log(`SMS sent: ${message.sid}`))
        .catch((error) => console.error(`Error sending SMS: ${error.message}`));
}

function checkAttendance(attendance) {
    if (attendance < 75) {
        alert("Attendance less than 75%, sending SMS...");

        studentDataArr.forEach((student) => {
            if (calculateAttendancePercentage(student) < 75) {
                sendSMS(student);
            }
        });
    }
}

function displayFun(studentDataArr) {
    var tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";

    studentDataArr.forEach(function (item, index) {
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.Department}</td>
            <td>${item.Section}</td>
            <td>${item.rollNo}</td>
            <td class="td6">
                <button onclick="markAttendance(${index}, 'P')">Present</button>
                <button onclick="markAttendance(${index}, 'A')">Absent</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function markAttendance(index, status) {
    studentDataArr[index].attendance = status;
    localStorage.setItem("studentData", JSON.stringify(studentDataArr));
    displayFun(studentDataArr);
    checkAttendance(calculateAttendancePercentage(studentDataArr[index]));
}

displayFun(studentDataArr);
form1.addEventListener("submit", submitFun1);
