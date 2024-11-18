// Initialize cheque counter and load saved cheques
let chequeCounter = 1000;
const cheques = JSON.parse(localStorage.getItem('cheques') || '[]');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadBankAccounts();
    loadPayees();
});

function initializePage() {
    document.getElementById('chequeDate').valueAsDate = new Date();
    document.getElementById('chequeNo').value = generateChequeNumber();
}

function generateChequeNumber() {
    return `CHQ${++chequeCounter}`;
}

function loadBankAccounts() {
    const bankAccounts = [
        { id: 1, name: "Main Account - 1234" },
        { id: 2, name: "Payroll Account - 5678" }
    ];

    const select = document.getElementById('bankAccount');
    bankAccounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.textContent = account.name;
        select.appendChild(option);
    });
}

function loadPayees() {
    // Load employees as payees
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const select = document.getElementById('payeeSelect');
    
    employees.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.id;
        option.textContent = `${emp.firstName} ${emp.lastName}`;
        select.appendChild(option);
    });
}

function newCheque() {
    clearForm();
    document.getElementById('chequeNo').value = generateChequeNumber();
    document.getElementById('chequeDate').valueAsDate = new Date();
}

function saveCheque() {
    const chequeData = {
        chequeNo: document.getElementById('chequeNo').value,
        date: document.getElementById('chequeDate').value,
        amount: document.getElementById('amount').value,
        payee: document.getElementById('payeeSelect').value,
        bankAccount: document.getElementById('bankAccount').value,
        status: 'PENDING'
    };

    if (!validateChequeData(chequeData)) {
        alert('Please fill in all required fields');
        return;
    }

    cheques.push(chequeData);
    localStorage.setItem('cheques', JSON.stringify(cheques));
    updateAccountSummary();
    alert('Cheque saved successfully!');
}

function validateChequeData(data) {
    return data.payee && data.amount && data.bankAccount;
}

function updateAccountSummary() {
    const tbody = document.getElementById('accountBody');
    tbody.innerHTML = '';

    cheques.forEach(cheque => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cheque.bankAccount}</td>
            <td>Payment to ${cheque.payee}</td>
            <td>${cheque.chequeNo}</td>
            <td>${cheque.status}</td>
            <td>${parseFloat(cheque.amount).toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function saveAndClose() {
    saveCheque();
    window.location.href = 'dashboard.html';
}

function clearForm() {
    document.getElementById('payeeSelect').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('bankAccount').value = '';
    document.getElementById('chequeDate').valueAsDate = new Date();
}

function deleteCheque() {
    const chequeNo = document.getElementById('chequeNo').value;
    const index = cheques.findIndex(c => c.chequeNo === chequeNo);
    
    if (index > -1) {
        cheques.splice(index, 1);
        localStorage.setItem('cheques', JSON.stringify(cheques));
        updateAccountSummary();
        clearForm();
        alert('Cheque deleted successfully!');
    }
}

function printCheque() {
    window.print();
}