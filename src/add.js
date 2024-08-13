// Function to calculate balance and save transactions by date and time
function calculateBalance() {
    let totalBags = 0;
    let totalAmountPaid = 0;
    let totalOldBalanceBeforeClick = 0;
    let totalBalanceAfterClick = 0;
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
        localStorage.setItem('balance' + i, totalBalance.toFixed(2));
        document.querySelector('.person' + i + ' .old-balance').textContent = totalBalance.toFixed(2);

        totalBags += bags;
        totalAmountPaid += amountPaid;
        totalOldBalanceBeforeClick += oldBalance;
        totalBalanceAfterClick += totalBalance;

        let row = tableBody.insertRow();
        row.insertCell(0).textContent = currentDateTime;
        row.insertCell(1).textContent = document.querySelector('.person' + i + ' h3').textContent;
        row.insertCell(2).textContent = bags;
        row.insertCell(3).textContent = amountPaid.toFixed(2);
        row.insertCell(4).textContent = oldBalance.toFixed(2);
        row.insertCell(5).textContent = totalBalance.toFixed(2);
    }

    // Update balances for all persons
    for (let i = 1; i <= 11; i++) {
        updatePersonBalance(i, 250);
    }
    updatePersonBalance(12, 280);
    updatePersonBalance(13, 270);
    for (let i = 14; i <= 40; i++) {
        updatePersonBalance(i, 300);
    }

    // Save the updated table content with the current time
    localStorage.setItem('tableContent_' + currentDateTime, tableBody.innerHTML);

    document.getElementById('totalBags').textContent = totalBags;
    document.getElementById('totalAmountPaid').textContent = totalAmountPaid.toFixed(2);
    document.getElementById('totalOldBalanceBeforeClick').textContent = totalOldBalanceBeforeClick.toFixed(2);
    document.getElementById('totalBalanceAfterClick').textContent = totalBalanceAfterClick.toFixed(2);

    // Save the current transaction
    saveDailyTransactions(currentDateTime);
}

// Save the transaction in localStorage with the date and time as the key
function saveDailyTransactions(currentDateTime) {
    let tableBody = document.querySelector('#recordTable tbody').innerHTML;
    localStorage.setItem('transactions_' + currentDateTime, tableBody);
    displaySavedTransactions(); // Update the list of saved transactions
}

// Load transactions for a specific date and time
function loadTransactionsForDateTime(dateTime) {
    let savedTableContent = localStorage.getItem('transactions_' + dateTime);
    if (savedTableContent !== null) {
        document.querySelector('#recordTable tbody').innerHTML = savedTableContent;
    } else {
        alert('No transactions found for ' + dateTime);
    }
}

// Delete transactions for a specific date and time with confirmation
function deleteTransactionsForDateTime(dateTime) {
    let confirmation = confirm('Are you sure you want to delete the transactions for ' + dateTime + '?');
    if (confirmation) {
        localStorage.removeItem('transactions_' + dateTime);
        alert('Transactions for ' + dateTime + ' have been deleted.');
        displaySavedTransactions(); // Refresh the list after deletion
    } else {
        alert('Deletion canceled.');
    }
}

// List all saved transactions by date and time
function listSavedTransactions() {
    let savedTransactions = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key.startsWith('transactions_')) {
            savedTransactions.push(key.replace('transactions_', ''));
        }
    }
    return savedTransactions;
}

// Display saved transactions on the page
function displaySavedTransactions() {
    let savedTransactions = listSavedTransactions();
    let transactionListDiv = document.getElementById('savedTransactionList');
    transactionListDiv.innerHTML = '';

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

// Initialize the page on load
window.onload = function() {
    loadBalancesAndTable();
    displaySavedTransactions();
};

// Existing load balances and table function
function loadBalancesAndTable() {
    for (let i = 1; i <= 40; i++) {
        let savedBalance = localStorage.getItem('balance' + i);
        if (savedBalance !== null) {
            document.querySelector('.person' + i + ' .old-balance').textContent = savedBalance;
            document.querySelector('.person' + i + ' .total-balance').textContent = savedBalance;
        }
    }

    let savedTableContent = localStorage.getItem('tableContent');
    if (savedTableContent !== null) {
        document.querySelector('#recordTable tbody').innerHTML = savedTableContent;
    }
}
