document.addEventListener('DOMContentLoaded', function () {
    const PRICE_PER_BAG = {
        'default': 300,
        1: 250,
        2: 250,
        3: 250,
        4: 250,
        5: 270,
        7: 250,
        8: 250,
        9: 220,
        12: 280,
        13: 250,
        43: 250,
        44: 250,
    };

    function getPricePerBag(i) {
        return PRICE_PER_BAG[i] || PRICE_PER_BAG['default'];
    }

    // Update individual person's balance
    function updatePersonBalance(i) {
        let bags = parseInt(document.getElementById('bags' + i).value) || 0;
        let amountPaid = parseFloat(document.getElementById('amount' + i).value) || 0;
        let pricePerBag = getPricePerBag(i);
        let totalCost = bags * pricePerBag;
        let oldBalance = parseFloat(document.querySelector('.person' + i + ' .old-balance').textContent) || 0;
        let totalBalance = totalCost - amountPaid + oldBalance;

        document.querySelector('.person' + i + ' .total-balance').textContent = totalBalance.toFixed(2);
        document.querySelector('.person' + i + ' .old-balance').textContent = totalBalance.toFixed(2);

        localStorage.setItem('balance' + i, totalBalance.toFixed(2));

        return {
            bags: bags,
            amountPaid: amountPaid,
            oldBalance: oldBalance,
            totalBalance: totalBalance,
            totalCost: totalCost
        };
    }

    // Insert a new row into the table
    function insertRow(tableBody, data, isTotalRow = false) {
        let row = tableBody.insertRow();
        let currentDateTime = new Date().toLocaleString();

        row.insertCell(0).textContent = isTotalRow ? currentDateTime : data.dateTime || currentDateTime;
        row.insertCell(1).textContent = isTotalRow ? 'TOTAL' : data.name;
        row.insertCell(2).textContent = data.bags.toFixed(0);
        row.insertCell(3).textContent = data.amountPaid.toFixed(2);
        row.insertCell(4).textContent = data.oldBalance.toFixed(2);
        row.insertCell(5).textContent = data.totalBalance.toFixed(2);
    }

    function calculateBalance() {
        let totalBags = 0;
        let totalAmountPaid = 0;
        let totalOldBalanceBeforeClick = 0;
        let totalBalanceAfterClick = 0;
        let totalCostSum = 0;
        let tableBody = document.querySelector('#recordTable tbody');
        tableBody.innerHTML = ''; // Clear previous records

        let currentDateTime = new Date().toLocaleString(); // Get current date and time

        // Loop over all persons and update their balances
        for (let i = 1; i <= 45; i++) {
            let result = updatePersonBalance(i);

            totalBags += result.bags;
            totalAmountPaid += result.amountPaid;
            totalOldBalanceBeforeClick += result.oldBalance;
            totalBalanceAfterClick += result.totalBalance;
            totalCostSum += result.totalCost;

            insertRow(tableBody, {
                dateTime: currentDateTime,
                name: document.querySelector('.person' + i + ' h3').textContent,
                ...result
            });
        }

        // Insert a final row for totals
        let totalRow = tableBody.insertRow();
totalRow.insertCell(0).innerHTML = '<strong>' + currentDateTime + '</strong>';
totalRow.insertCell(1).innerHTML = '<strong>TOTAL</strong>';
totalRow.insertCell(2).innerHTML = '<strong>' + totalBags + '</strong>';
totalRow.insertCell(3).innerHTML = '<strong>' + totalAmountPaid.toFixed(2) + '</strong>';
totalRow.insertCell(4).innerHTML = '<strong>' + totalOldBalanceBeforeClick.toFixed(2) + '</strong>';
totalRow.insertCell(5).innerHTML = '<strong>' + totalBalanceAfterClick.toFixed(2) + '</strong>';

        // Save the updated table content to local storage
        localStorage.setItem('transaction_' + currentDateTime, tableBody.innerHTML);

        // Update total summaries on the page
        document.getElementById('totalBags').textContent = totalBags;
        document.getElementById('totalAmountPaid').textContent = totalAmountPaid.toFixed(2);
        document.getElementById('totalOldBalanceBeforeClick').textContent = totalOldBalanceBeforeClick.toFixed(2);
        document.getElementById('totalBalanceAfterClick').textContent = totalBalanceAfterClick.toFixed(2);

        listSavedTransactions(); // Update the list of saved transactions
    }

    // List all saved transactions from local storage
    function listSavedTransactions() {
        let transactionListDiv = document.getElementById('savedTransactionList');
        transactionListDiv.innerHTML = '';

        let keys = Object.keys(localStorage);
        let savedTransactions = keys.filter(key => key.startsWith('transaction_')).map(key => key.replace('transaction_', ''));

        if (savedTransactions.length === 0) {
            transactionListDiv.textContent = 'No saved transactions.';
        } else {
            savedTransactions.forEach(function (dateTime) {
                let transactionItem = document.createElement('div');
                transactionItem.textContent = dateTime;

                let loadButton = document.createElement('button');
                loadButton.textContent = 'Load';
                loadButton.onclick = function () {
                    loadTransactionsForDateTime(dateTime);
                };
                transactionItem.appendChild(loadButton);

                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = function () {
                    deleteTransactionsForDateTime(dateTime);
                };
                transactionItem.appendChild(deleteButton);

                transactionListDiv.appendChild(transactionItem);
            });
        }
    }

    // Load the transactions for a specific date and time from local storage
    function loadTransactionsForDateTime(dateTime) {
        let savedTransaction = localStorage.getItem('transaction_' + dateTime);
        if (savedTransaction) {
            document.querySelector('#recordTable tbody').innerHTML = savedTransaction;
        } else {
            alert('No transactions found for ' + dateTime);
        }
    }

    // Delete the transactions for a specific date and time from local storage
    function deleteTransactionsForDateTime(dateTime) {
        if (confirm('Are you sure you want to delete the transactions for ' + dateTime + '?')) {
            localStorage.removeItem('transaction_' + dateTime);
            alert('Transactions for ' + dateTime + ' have been deleted.');
            listSavedTransactions();
        }
    }

    // Load saved balances and table data on page load
    function loadBalancesAndTable() {
        for (let i = 1; i <= 45; i++) {
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

    // Initialize the page
    window.onload = function () {
        loadBalancesAndTable();
        listSavedTransactions();
    };

    // Expose functions globally
    window.calculateBalance = calculateBalance;
    window.loadTransactionsForDateTime = loadTransactionsForDateTime;
    window.deleteTransactionsForDateTime = deleteTransactionsForDateTime;
    window.listSavedTransactions = listSavedTransactions;
    window.loadBalancesAndTable = loadBalancesAndTable;
});
