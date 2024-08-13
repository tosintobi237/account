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
        
        // Update balance on the backend instead of localStorage
        updateBalanceInBackend(i, totalBalance.toFixed(2));
        
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

    // Save the updated table content with the current time in global storage
    saveDailyTransactions(currentDateTime, tableBody.innerHTML);

    document.getElementById('totalBags').textContent = totalBags;
    document.getElementById('totalAmountPaid').textContent = totalAmountPaid.toFixed(2);
    document.getElementById('totalOldBalanceBeforeClick').textContent = totalOldBalanceBeforeClick.toFixed(2);
    document.getElementById('totalBalanceAfterClick').textContent = totalBalanceAfterClick.toFixed(2);

    displaySavedTransactions(); // Update the list of saved transactions
}

// Replace localStorage set operation with API call to save balance
function updateBalanceInBackend(personId, balance) {
    // Example API call
    fetch('/api/updateBalance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ personId: personId, balance: balance }),
    }).then(response => {
        if (!response.ok) {
            console.error('Failed to update balance for person ' + personId);
        }
    }).catch(error => {
        console.error('Error updating balance:', error);
    });
}

// Save the transaction in global storage with the date and time as the key
function saveDailyTransactions(currentDateTime, tableBodyContent) {
    fetch('/api/saveTransaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dateTime: currentDateTime, tableBody: tableBodyContent }),
    }).then(response => {
        if (!response.ok) {
            console.error('Failed to save transactions');
        }
    }).catch(error => {
        console.error('Error saving transactions:', error);
    });
}

// Load transactions for a specific date and time
function loadTransactionsForDateTime(dateTime) {
    fetch(`/api/getTransaction?dateTime=${encodeURIComponent(dateTime)}`)
        .then(response => response.json())
        .then(data => {
            if (data.tableBody) {
                document.querySelector('#recordTable tbody').innerHTML = data.tableBody;
            } else {
                alert('No transactions found for ' + dateTime);
            }
        })
        .catch(error => {
            console.error('Error loading transactions:', error);
        });
}

// Delete transactions for a specific date and time with confirmation
function deleteTransactionsForDateTime(dateTime) {
    let confirmation = confirm('Are you sure you want to delete the transactions for ' + dateTime + '?');
    if (confirmation) {
        fetch(`/api/deleteTransaction?dateTime=${encodeURIComponent(dateTime)}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Transactions for ' + dateTime + ' have been deleted.');
                displaySavedTransactions(); // Refresh the list after deletion
            } else {
                alert('Failed to delete transactions for ' + dateTime);
            }
        })
        .catch(error => {
            console.error('Error deleting transactions:', error);
        });
    } else {
        alert('Deletion canceled.');
    }
}

// List all saved transactions by date and time
function listSavedTransactions() {
    fetch('/api/listTransactions')
        .then(response => response.json())
        .then(data => {
            let savedTransactions = data.transactions;
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
        })
        .catch(error => {
            console.error('Error listing transactions:', error);
        });
}

// Initialize the page on load
window.onload = function() {
    loadBalancesAndTable();
    displaySavedTransactions();
};

// Existing load balances and table function
function loadBalancesAndTable() {
    fetch('/api/getBalances')
        .then(response => response.json())
        .then(data => {
            for (let i = 1; i <= 40; i++) {
                let savedBalance = data['balance' + i];
                if (savedBalance !== null) {
                    document.querySelector('.person' + i + ' .old-balance').textContent = savedBalance;
                    document.querySelector('.person' + i + ' .total-balance').textContent = savedBalance;
                }
            }

            let savedTableContent = data.tableContent;
            if (savedTableContent !== null) {
                document.querySelector('#recordTable tbody').innerHTML = savedTableContent;
            }
        })
        .catch(error => {
            console.error('Error loading balances and table:', error);
        });
}
