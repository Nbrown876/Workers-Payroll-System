function updateTime() {
    const now = new Date();
    document.getElementById('current-time').innerText = now.toLocaleString();
}
setInterval(updateTime, 1000);

function markAttendance() {
    const employeeId = document.getElementById('employee-id').value.trim();
    
    // Input validation
    if (!employeeId) {
        alert('Please enter your Employee ID.');
        return;
    }

    // Get employees from localStorage
    const employees = JSON.parse(localStorage.getItem('employeeData') || '[]');
    
    // Check if employee exists
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
        alert('Employee ID not found. Please check your ID or contact HR.');
        return;
    }

    const now = new Date();
    const today = now.toLocaleDateString();
    let records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    // Check for existing attendance today
    const existingRecord = records.find(record => 
        record.id === employeeId && 
        record.date === today
    );

    if (existingRecord) {
        alert(`Attendance already marked for ${employee.firstName} ${employee.lastName} today.`);
        return;
    }

    // Create new attendance record
    const attendance = {
        id: employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        date: today,
        time: now.toLocaleTimeString(),
        department: employee.department
    };

    // Add the record
    records.push(attendance);
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
    
    // Show success message
    alert(`Attendance marked successfully!\nEmployee: ${employee.firstName} ${employee.lastName}\nTime: ${attendance.time}`);
    
    // Update display
    displayRecords();
}

function displayRecords() {
    const records = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const tbody = document.getElementById('attendance-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';

    // Sort records by date and time (most recent first)
    records.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));

    records.forEach(record => {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = record.id;
        row.insertCell(1).innerText = record.employeeName || 'N/A';
        row.insertCell(2).innerText = record.date;
        row.insertCell(3).innerText = record.time;
        row.insertCell(4).innerText = record.department || 'N/A';
    });
}

function toggleAttendanceHistory() {
    const historyDiv = document.getElementById('attendance-history');
    const button = document.querySelector('button[onclick="toggleAttendanceHistory()"]');
    
    if (historyDiv.style.display === 'none') {
        displayRecords();
        historyDiv.style.display = 'block';
        button.textContent = 'Hide Attendance History';
    } else {
        historyDiv.style.display = 'none';
        button.textContent = 'Show Attendance History';
    }
}

// Initialize when page loads
window.onload = function() {
    updateTime();
    displayRecords();
};