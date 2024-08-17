document.addEventListener('DOMContentLoaded', function() {
    const timeInButton = document.getElementById('timeInButton');
    const timeOutButton = document.getElementById('timeOutButton');
    const employeeNameInput = document.getElementById('employeeName');
    const organizationNameInput = document.getElementById('organizationName');
    const payrollTableBody = document.querySelector('#payrollTable tbody');
    let payrollData = {};

    timeInButton.addEventListener('click', function() {
        const employeeName = employeeNameInput.value.trim();
        const organizationName = organizationNameInput.value.trim();
        if (employeeName === '' || organizationName === '') {
            alert('Please enter both employee name and organization name.');
            return;
        }
        const timeIn = new Date();
        if (!payrollData[employeeName]) {
            payrollData[employeeName] = { timeIn: timeIn, timeOut: null, organizationName: organizationName };
            addOrUpdateTableRow(employeeName);
        } else {
            alert('Employee has already clocked in.');
        }
    });

    timeOutButton.addEventListener('click', function() {
        const employeeName = employeeNameInput.value.trim();
        if (employeeName === '') {
            alert('Please enter an employee name.');
            return;
        }
        if (payrollData[employeeName] && !payrollData[employeeName].timeOut) {
            payrollData[employeeName].timeOut = new Date();
            addOrUpdateTableRow(employeeName);
            saveToServer(employeeName); // Save data to server
        } else {
            alert('Employee has not clocked in or has already clocked out.');
        }
    });

    function addOrUpdateTableRow(employeeName) {
        let row = document.getElementById(employeeName);
        const timeIn = formatTime(payrollData[employeeName].timeIn);
        const timeOut = payrollData[employeeName].timeOut ? formatTime(payrollData[employeeName].timeOut) : 'N/A';
        const totalHours = payrollData[employeeName].timeOut ? calculateTotalHours(payrollData[employeeName].timeIn, payrollData[employeeName].timeOut) : 'N/A';
        const organizationName = payrollData[employeeName].organizationName;

        if (!row) {
            row = document.createElement('tr');
            row.setAttribute('id', employeeName);
            row.innerHTML = `
                <td>${employeeName}</td>
                <td>${timeIn}</td>
                <td>${timeOut}</td>
                <td>${totalHours}</td>
                <td>${organizationName}</td>
            `;
            payrollTableBody.appendChild(row);
        } else {
            row.children[1].innerText = timeIn;
            row.children[2].innerText = timeOut;
            row.children[3].innerText = totalHours;
            row.children[4].innerText = organizationName;
        }
    }

    function formatTime(date) {
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    function calculateTotalHours(timeIn, timeOut) {
        const milliseconds = timeOut - timeIn;
        const hours = milliseconds / 1000 / 60 / 60;
        return hours.toFixed(2);
    }


    function saveToServer(employeeName) {
        fetch('/savePayroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employeeName: employeeName,
                timeIn: payrollData[employeeName].timeIn,
                timeOut: payrollData[employeeName].timeOut,
                totalHours: calculateTotalHours(payrollData[employeeName].timeIn, payrollData[employeeName].timeOut),
                organizationName: payrollData[employeeName].organizationName
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Data saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
    }
});
