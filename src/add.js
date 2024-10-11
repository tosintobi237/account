



function calculateBalance() {
    let totalBags = 0;
    let totalAmountPaid = 0;
    let totalOldBalanceBeforeClick = 0;
    let totalBalanceAfterClick = 0;
    let totalCostSum = 0;
    let tableBody = document.querySelector('#recordTable tbody');
    tableBody.innerHTML = ''; // Clear previous records

    let currentDateTime = new Date().toLocaleString(); // Get current date and time

    function updatePersonBalance(i, pricePerBag) {
        let bags = parseInt(document.getElementById('bags' + i).value) || 0;
        let amountPaid = parseFloat(document.getElementById('amount' + i).value) || 0;
        let totalCost = bags * pricePerBag;
        let oldBalance = parseFloat(document.querySelector('.person' + i + ' .old-balance').textContent) || 0;
        let totalBalance = totalCost - amountPaid + oldBalance;

        document.querySelector('.person' + i + ' .total-balance').textContent = totalBalance.toFixed(2);

        // Update balance in local storage
        localStorage.setItem('balance' + i, totalBalance.toFixed(2));

        document.querySelector('.person' + i + ' .old-balance').textContent = totalBalance.toFixed(2);

        totalBags += bags;
        totalAmountPaid += amountPaid;
        totalOldBalanceBeforeClick += oldBalance;
        totalBalanceAfterClick += totalBalance;
        totalCostSum += totalCost;

        let row = tableBody.insertRow();
        row.insertCell(0).textContent = currentDateTime;
        row.insertCell(1).textContent = document.querySelector('.person' + i + ' h3').textContent;
        row.insertCell(2).textContent = bags;
        row.insertCell(3).textContent = amountPaid.toFixed(2);
        row.insertCell(4).textContent = oldBalance.toFixed(2);
        row.insertCell(5).textContent = totalBalance.toFixed(2);
    }

    // Update balances for all persons
    for (let i = 1; i <= 4; i++) {
        updatePersonBalance(i, 250);
    }
    updatePersonBalance(5, 270);
    updatePersonBalance(6, 300);
    updatePersonBalance(7, 250);
    updatePersonBalance(8, 250);
    updatePersonBalance(9, 220);
    for (let i = 10; i <= 11; i++) {
        updatePersonBalance(i, 300);
    }
    updatePersonBalance(12, 280);
    updatePersonBalance(13, 250);
    for (let i = 14; i <= 18; i++) {
        updatePersonBalance(i, 300);
    }
    updatePersonBalance(19, 300)
    updatePersonBalance(20, 300)
    updatePersonBalance(21, 300);

    for (let i = 22; i <= 28; i++) {
        updatePersonBalance(i, 300);
    }
    updatePersonBalance(29, 300);
    updatePersonBalance(30, 300);

    for (let i = 31; i <= 36; i++) {
        updatePersonBalance(i, 300);
    }
    updatePersonBalance(37, 250);

    for (let i = 38; i <= 40; i++) {
        updatePersonBalance(i, 300);
    }
    updatePersonBalance(41, 300);
    updatePersonBalance(42, 300);
    updatePersonBalance(43, 250);
    updatePersonBalance(44, 250);

    // Add a final row for the total sums
let totalRow = tableBody.insertRow();
totalRow.insertCell(0).innerHTML = '<strong>' + currentDateTime + '</strong>';
totalRow.insertCell(1).innerHTML = '<strong>TOTAL</strong>';
totalRow.insertCell(2).innerHTML = '<strong>' + totalBags + '</strong>';
totalRow.insertCell(3).innerHTML = '<strong>' + totalAmountPaid.toFixed(2) + '</strong>';
totalRow.insertCell(4).innerHTML = '<strong>' + totalOldBalanceBeforeClick.toFixed(2) + '</strong>';
totalRow.insertCell(5).innerHTML = '<strong>' + totalBalanceAfterClick.toFixed(2) + '</strong>';

    

    // Save the updated table content with the current time in local storage
    localStorage.setItem('transaction_' + currentDateTime, tableBody.innerHTML);

    document.getElementById('totalBags').textContent = totalBags;
    document.getElementById('totalAmountPaid').textContent = totalAmountPaid.toFixed(2);
    document.getElementById('totalOldBalanceBeforeClick').textContent = totalOldBalanceBeforeClick.toFixed(2);
    document.getElementById('totalBalanceAfterClick').textContent = totalBalanceAfterClick.toFixed(2);

    listSavedTransactions(); // Update the list of saved transactions
}




// Load transactions for a specific date and time from local storage
function loadTransactionsForDateTime(dateTime) {
    let savedTransaction = localStorage.getItem('transaction_' + dateTime);
    if (savedTransaction) {
        document.querySelector('#recordTable tbody').innerHTML = savedTransaction;
    } else {
        alert('No transactions found for ' + dateTime);
    }
}

// Delete transactions for a specific date and time from local storage with confirmation
function deleteTransactionsForDateTime(dateTime) {
    let confirmation = confirm('Are you sure you want to delete the transactions for ' + dateTime + '?');
    if (confirmation) {
        localStorage.removeItem('transaction_' + dateTime);
        alert('Transactions for ' + dateTime + ' have been deleted.');
        listSavedTransactions(); // Refresh the list after deletion
    } else {
        alert('Deletion canceled.');
    }
}

// List all saved transactions by date and time from local storage
function listSavedTransactions() {
    let transactionListDiv = document.getElementById('savedTransactionList');
    transactionListDiv.innerHTML = '';

    let keys = Object.keys(localStorage);
    let savedTransactions = keys.filter(key => key.startsWith('transaction_')).map(key => key.replace('transaction_', ''));

    if (savedTransactions.length === 0) {
        transactionListDiv.textContent = 'No saved transactions.';
    } else {
        savedTransactions.forEach(function(dateTime) {
            let transactionItem = document.createElement('div');
            transactionItem.textContent = dateTime;

            let loadButton = document.createElement('button');
            loadButton.textContent = 'Load';
            loadButton.onclick = function() {
                loadTransactionsForDateTime(dateTime);
            };
            transactionItem.appendChild(loadButton);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                deleteTransactionsForDateTime(dateTime);
            };
            transactionItem.appendChild(deleteButton);

            transactionListDiv.appendChild(transactionItem);
        });
    }
}

// Existing load balances and table function from local storage
function loadBalancesAndTable() {
    for (let i = 1; i <= 42; i++) {
        let savedBalance = localStorage.getItem('balance' + i);
        if (savedBalance !== null) {
            document.querySelector('.person' + i + ' .old-balance').textContent = savedBalance;
            document.querySelector('.person' + i + ' .total-balance').textContent = savedBalance;
        }
    }

    let savedTableContent = localStorage.getItem('transaction_' + new Date().toLocaleString());
    if (savedTableContent !== null) {
        document.querySelector('#recordTable tbody').innerHTML = savedTableContent;
    }
}

// Initialize the page on load
window.onload = function() {
    loadBalancesAndTable();
    listSavedTransactions();
};

// Make functions global
window.calculateBalance = calculateBalance;
window.loadTransactionsForDateTime = loadTransactionsForDateTime;
window.deleteTransactionsForDateTime = deleteTransactionsForDateTime;
window.listSavedTransactions = listSavedTransactions;
window.loadBalancesAndTable = loadBalancesAndTable;