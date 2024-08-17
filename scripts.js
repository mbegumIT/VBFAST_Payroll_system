document.getElementById("timeInButton").addEventListener("click", timeIn);
document.getElementById("timeOutButton").addEventListener("click", timeOut);
document.getElementById("downloadExcel").addEventListener("click", downloadExcel);

let employeeData = [];

function timeIn() {
    const employeeName = document.getElementById("employeeName").value;
    const startDate = document.getElementById("startDate").value;
    const organizationName = document.getElementById("organizationName").value;
    const timeIn = new Date().toLocaleTimeString();

    if (employeeName === "" || startDate === "" || organizationName === "") {
        alert("Please fill out all fields.");
        return;
    }

    const newRow = {
        employeeName,
        startDate,
        timeIn,
        timeOut: "",
        totalHours: "",
        organizationName
    };

    employeeData.push(newRow);
    updateTable();
}

function timeOut() {
    const employeeName = document.getElementById("employeeName").value;
    const organizationName = document.getElementById("organizationName").value;
    const timeOut = new Date().toLocaleTimeString();

    const row = employeeData.find(
        (data) =>
            data.employeeName === employeeName &&
            data.organizationName === organizationName &&
            data.timeOut === ""
    );

    if (row) {
        row.timeOut = timeOut;
        row.totalHours = calculateTotalHours(row.timeIn, timeOut);
        updateTable();
    } else {
        alert("Please check the employee name and organization.");
    }
}

function calculateTotalHours(timeIn, timeOut) {
    const [inHours, inMinutes, inSeconds] = timeIn.split(":").map(Number);
    const [outHours, outMinutes, outSeconds] = timeOut.split(":").map(Number);

    const inDate = new Date();
    inDate.setHours(inHours, inMinutes, inSeconds);

    const outDate = new Date();
    outDate.setHours(outHours, outMinutes, outSeconds);

    const diffMs = outDate - inDate;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
}

function updateTable() {
    const tbody = document.querySelector("#payrollTable tbody");
    tbody.innerHTML = "";

    employeeData.forEach((data) => {
        const row = tbody.insertRow();

        row.insertCell(0).innerText = data.employeeName;
        row.insertCell(1).innerText = data.startDate;
        row.insertCell(2).innerText = data.timeIn;
        row.insertCell(3).innerText = data.timeOut;
        row.insertCell(4).innerText = data.totalHours;
        row.insertCell(5).innerText = data.organizationName;
    });
}

function downloadExcel() {
    if (employeeData.length === 0) {
        alert("No data to export.");
        return;
    }

    const csvContent = [
        ["Employee Name", "Start Date", "Time In", "Time Out", "Total Hours", "Organization Name"],
        ...employeeData.map((data) =>
            [data.employeeName, data.startDate, data.timeIn, data.timeOut, data.totalHours, data.organizationName].join(",")
        ),
    ]
    .map((row) => row.join(","))
    .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employee_payroll.csv";
    a.click();
    URL.revokeObjectURL(url);
}
