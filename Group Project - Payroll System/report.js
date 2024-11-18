// Initialize report counter and load saved reports
let reportCounter = 1000;
const reports = JSON.parse(localStorage.getItem('reports') || '[]');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadEmployees();
});

function initializePage() {
    document.getElementById('reportDate').valueAsDate = new Date();
    document.getElementById('reportNo').value = generateReportNumber();
    addNewRow(); // Add initial row
}

function generateReportNumber() {
    return `RPT${++reportCounter}`;
}

function loadEmployees() {
    // Load employees from localStorage
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    return employees;
}

function addNewRow() {
    const tbody = document.getElementById('reportBody');
    const employees = loadEmployees();
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>
            <select class="employee-select" onchange="updateEmployeeDetails(this)">
                <option value="">Select Employee</option>
                ${employees.map(emp => `
                    <option value="${emp.id}">${emp.id}</option>
                `).join('')}
            </select>
        </td>
        <td class="employee-name"></td>
        <td class="employee-salary"></td>
        <td class="employee-department"></td>
    `;
    tbody.appendChild(tr);
}

function updateEmployeeDetails(select) {
    const employees = loadEmployees();
    const selectedEmployee = employees.find(emp => emp.id === select.value);
    const row = select.closest('tr');
    
    if (selectedEmployee) {
        row.querySelector('.employee-name').textContent = 
            `${selectedEmployee.firstName} ${selectedEmployee.lastName}`;
        row.querySelector('.employee-salary').textContent = selectedEmployee.salary;
        row.querySelector('.employee-department').textContent = selectedEmployee.department;
    }
}

function newReport() {
    clearForm();
    document.getElementById('reportNo').value = generateReportNumber();
    document.getElementById('reportDate').valueAsDate = new Date();
    addNewRow();
}

function saveReport() {
    const reportData = {
        reportNo: document.getElementById('reportNo').value,
        date: document.getElementById('reportDate').value,
        details: getReportDetails()
    };

    if (!validateReportData(reportData)) {
        alert('Please fill in all required fields');
        return;
    }

    reports.push(reportData);
    localStorage.setItem('reports', JSON.stringify(reports));
    alert('Report saved successfully!');
}

function getReportDetails() {
    const details = [];
    const rows = document.getElementById('reportBody').getElementsByTagName('tr');
    
    for (let row of rows) {
        const employeeId = row.querySelector('.employee-select').value;
        if (employeeId) {
            details.push({
                employeeId: employeeId,
                name: row.querySelector('.employee-name').textContent,
                salary: row.querySelector('.employee-salary').textContent,
                department: row.querySelector('.employee-department').textContent
            });
        }
    }
    
    return details;
}

function validateReportData(data) {
    return data.details.length > 0;
}

function deleteReport() {
    const reportNo = document.getElementById('reportNo').value;
    const index = reports.findIndex(r => r.reportNo === reportNo);
    
    if (index > -1) {
        reports.splice(index, 1);
        localStorage.setItem('reports', JSON.stringify(reports));
        clearForm();
        alert('Report deleted successfully!');
    }
}

function generateReport() {
    saveReport();
    // Here you would typically generate a PDF or printable version of the report
    printReport();
}

function clearForm() {
    document.getElementById('reportBody').innerHTML = '';
    addNewRow();
}

function printReport() {
    window.print();
}