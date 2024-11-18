// EmployeeDatabase class to handle data storage and retrieval
class EmployeeDatabase {
    constructor() {
        this.storageKey = 'employeeData';
        this.employees = this.loadEmployees();
        this.currentPhotoData = null;
    }

    loadEmployees() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading employees:', error);
            return [];
        }
    }

    saveEmployees() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.employees));
            return true;
        } catch (error) {
            console.error('Error saving employees:', error);
            return false;
        }
    }

    addEmployee(employee) {
        // Check if employee with same ID already exists
        if (this.employees.some(emp => emp.id === employee.id)) {
            throw new Error('Employee ID already exists');
        }
        
        // Add timestamp for tracking
        employee.createdAt = new Date().toISOString();
        employee.updatedAt = new Date().toISOString();
        
        this.employees.push(employee);
        return this.saveEmployees();
    }

    updateEmployee(updatedEmployee) {
        const index = this.employees.findIndex(emp => emp.id === updatedEmployee.id);
        if (index !== -1) {
            // Preserve creation timestamp and update the update timestamp
            updatedEmployee.createdAt = this.employees[index].createdAt;
            updatedEmployee.updatedAt = new Date().toISOString();
            
            this.employees[index] = updatedEmployee;
            return this.saveEmployees();
        }
        return false;
    }

    deleteEmployee(id) {
        const initialLength = this.employees.length;
        this.employees = this.employees.filter(emp => emp.id !== id);
        if (this.employees.length !== initialLength) {
            return this.saveEmployees();
        }
        return false;
    }

    getEmployee(id) {
        return this.employees.find(emp => emp.id === id);
    }

    searchEmployees(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        return this.employees.filter(emp => 
            emp.id.toLowerCase().includes(searchTerm) ||
            emp.firstName.toLowerCase().includes(searchTerm) ||
            emp.lastName.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm)
        );
    }

    exportToCSV() {
        if (this.employees.length === 0) return null;
        
        const headers = ['ID', 'First Name', 'Last Name', 'Department', 'Position', 'Salary', 'Email', 'Contact'];
        const csvRows = [headers.join(',')];
        
        for (const emp of this.employees) {
            const row = [
                emp.id,
                emp.firstName,
                emp.lastName,
                emp.department,
                emp.position,
                emp.salary,
                emp.email,
                emp.contact
            ].map(value => `"${value || ''}"`);
            csvRows.push(row.join(','));
        }
        
        return csvRows.join('\n');
    }
}

// Initialize database
const db = new EmployeeDatabase();

// Handle photo upload
document.getElementById('photo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoData = e.target.result;
            document.getElementById('employee-photo').src = photoData;
            db.currentPhotoData = photoData;
        }
        reader.readAsDataURL(file);
    }
});

// Collect form data with validation
function getFormData() {
    const data = {
        id: document.getElementById('employee-id').value.trim(),
        photo: db.currentPhotoData || document.getElementById('employee-photo').src,
        firstName: document.getElementById('first-name').value.trim(),
        lastName: document.getElementById('last-name').value.trim(),
        middleName: document.getElementById('middle-name').value.trim(),
        department: document.getElementById('department').value.trim(),
        position: document.getElementById('position').value.trim(),
        jobTitle: document.getElementById('job-title').value.trim(),
        dateHired: document.getElementById('date-hired').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || '',
        salary: document.getElementById('salary').value,
        dob: document.getElementById('dob').value,
        bankDetails: document.getElementById('bank-details').value.trim(),
        email: document.getElementById('email').value.trim(),
        accountNumber: document.getElementById('account-number').value.trim(),
        contact: document.getElementById('contact').value.trim(),
        trn: document.getElementById('trn').value.trim(),
        address: document.getElementById('address').value.trim(),
        attendanceMode: document.getElementById('attendance-mode').value
    };

    // Remove empty values
    Object.keys(data).forEach(key => {
        if (data[key] === '') delete data[key];
    });

    return data;
}

// Validate form data
function validateForm(data) {
    const requiredFields = ['id', 'firstName', 'lastName', 'department', 'position'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
        return false;
    }

    if (data.email && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Please enter a valid email address');
        return false;
    }

    return true;
}

// Clear form
function clearForm() {
    const form = document.querySelector('.employee-form');
    form.reset();
    document.getElementById('employee-photo').src = 'placeholder.png';
    db.currentPhotoData = null;
}

// Add Employee
function addEmployee() {
    try {
        const employeeData = getFormData();
        if (!validateForm(employeeData)) return;
        
        if (db.addEmployee(employeeData)) {
            alert('Employee added successfully!');
            clearForm();
        } else {
            alert('Error saving employee data');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Update Employee
function updateEmployee() {
    try {
        const employeeData = getFormData();
        if (!employeeData.id) {
            alert('Please select an employee to update');
            return;
        }
        
        if (!validateForm(employeeData)) return;
        
        if (db.updateEmployee(employeeData)) {
            alert('Employee updated successfully!');
            clearForm();
        } else {
            alert('Employee not found or error updating');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Delete Employee
function deleteEmployee() {
    const id = document.getElementById('employee-id').value.trim();
    
    if (!id) {
        alert('Please select an employee to delete');
        return;
    }

    if (confirm('Are you sure you want to delete this employee?')) {
        if (db.deleteEmployee(id)) {
            alert('Employee deleted successfully!');
            clearForm();
        } else {
            alert('Error deleting employee');
        }
    }
}

// Search and display results
function searchEmployees() {
    const searchTerm = document.getElementById('search-input').value.trim();
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }
    
    const results = db.searchEmployees(searchTerm);
    displaySearchResults(results);
}

// ... (keep all the previous code until the searchEmployees function) ...

// Updated search employees function
function searchEmployees() {
    const searchTerm = document.getElementById('search-input').value.trim();
    if (!searchTerm) {
        alert('Please enter an employee ID or name to search');
        return;
    }
    
    const results = db.searchEmployees(searchTerm);
    displaySearchResults(results);
}

// Updated display search results function
function displaySearchResults(results) {
    const modal = document.getElementById('searchModal');
    const resultsContainer = document.getElementById('searchResults');
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No employees found</div>';
    } else {
        results.forEach(employee => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <div class="search-result-header">
                    <img src="${employee.photo || 'placeholder.png'}" alt="Employee Photo" class="employee-photo">
                    <div>
                        <h3>${employee.firstName} ${employee.lastName}</h3>
                        <p>Employee ID: ${employee.id}</p>
                    </div>
                </div>
                <div class="employee-details">
                    <p><strong>Department:</strong> ${employee.department}</p>
                    <p><strong>Position:</strong> ${employee.position}</p>
                    <p><strong>Email:</strong> ${employee.email || 'N/A'}</p>
                    <p><strong>Contact:</strong> ${employee.contact || 'N/A'}</p>
                    <p><strong>Attendance Mode:</strong> ${employee.attendanceMode}</p>
                    <p><strong>Date Hired:</strong> ${employee.dateHired || 'N/A'}</p>
                </div>
                <button onclick="loadEmployeeToForm('${employee.id}')" class="action-btn update">
                    Edit Employee
                </button>
            `;
            
            resultsContainer.appendChild(resultItem);
        });
    }
    
    modal.style.display = 'block';
}

// Function to close the search modal
function closeSearchModal() {
    document.getElementById('searchModal').style.display = 'none';
}

// Function to load employee data into the form
function loadEmployeeToForm(id) {
    const employee = db.getEmployee(id);
    if (employee) {
        // Fill all form fields with employee data
        Object.keys(employee).forEach(key => {

            const element = document.getElementById(key);
            if (element) {
                if (key === 'photo') {
                    document.getElementById('employee-photo').src = employee[key];
                    db.currentPhotoData = employee[key];
                } else if (element.type === 'radio') {
                    const radio = document.querySelector(`input[name="gender"][value="${employee[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = employee[key];
                }
            }
        });
        
        // Close the modal after loading the data
        closeSearchModal();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('searchModal');
    if (event.target === modal) {
        closeSearchModal();
    }
}

// Add event listener for the search input (optional: search as you type)
document.getElementById('search-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchEmployees();
    }
});

// Initialize event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Add any additional initialization here
});

// ... (keep all the remaining previous code) ...

// Export employees
function exportEmployees() {
    const csv = db.exportToCSV();
    if (!csv) {
        alert('No employees to export');
        return;
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Load employee data into form
function loadEmployee(id) {
    const employee = db.getEmployee(id);
    if (employee) {
        Object.keys(employee).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'photo') {
                    document.getElementById('employee-photo').src = employee[key];
                    db.currentPhotoData = employee[key];
                } else if (element.type === 'radio') {
                    const radio = document.querySelector(`input[name="gender"][value="${employee[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    element.value = employee[key];
                }
            }
        });
    }
}

// Initialize event listeners when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Add any additional initialization here
});