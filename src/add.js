document.addEventListener('DOMContentLoaded', function () {
    const PRICE_PER_BAG = {
        'default': 300,
        1: 250,
        2: 250,
        4: 250,
        5: 260,
        7: 250,
        8: 250,
        9: 220,
        12: 280,
        13: 250,
        19: 250,
        31: 260,
        35: 250,
        36: 270,
        41: 270,
        42: 250,
        43: 250,
        44: 250,
        46: 250,
        53: 250,
        54: 250,
    };

    function getPricePerBag(i) {
        return PRICE_PER_BAG[i] || PRICE_PER_BAG['default'];
    }

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

    function insertRow(tableBody, data, isTotalRow = false) {
        let row = tableBody.insertRow();

        row.insertCell(0).textContent = isTotalRow ? data.dateTime : data.dateTime || '';
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
        tableBody.innerHTML = '';

        let currentDateTime = new Date().toLocaleString();
        let transactionData = [];

        for (let i = 1; i <= 54; i++) {
            let result = updatePersonBalance(i);

            totalBags += result.bags;
            totalAmountPaid += result.amountPaid;
            totalOldBalanceBeforeClick += result.oldBalance;
            totalBalanceAfterClick += result.totalBalance;
            totalCostSum += result.totalCost;

            let data = {
                dateTime: currentDateTime,
                name: document.querySelector('.person' + i + ' h3').textContent,
                ...result
            };

            transactionData.push(data);
            insertRow(tableBody, data);
        }

        transactionData.push({
            dateTime: currentDateTime,
            name: 'TOTAL',
            bags: totalBags,
            amountPaid: totalAmountPaid,
            oldBalance: totalOldBalanceBeforeClick,
            totalBalance: totalBalanceAfterClick
        });

        localStorage.setItem('transaction_' + currentDateTime, JSON.stringify(transactionData));

        document.getElementById('totalBags').textContent = totalBags;
        document.getElementById('totalAmountPaid').textContent = totalAmountPaid.toFixed(2);
        document.getElementById('totalOldBalanceBeforeClick').textContent = totalOldBalanceBeforeClick.toFixed(2);
        document.getElementById('totalBalanceAfterClick').textContent = totalBalanceAfterClick.toFixed(2);

        listSavedTransactions();
    }

    function listSavedTransactions() {
        let transactionListDiv = document.getElementById('savedTransactionList');
        transactionListDiv.innerHTML = '';

        let keys = Object.keys(localStorage);

        let savedTransactions = keys
            .filter(key => key.startsWith('transaction_'))
            .map(key => key.replace('transaction_', ''))
            .sort((a, b) => new Date(b) - new Date(a));

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

    function loadTransactionsForDateTime(dateTime) {
        let savedTransaction = localStorage.getItem('transaction_' + dateTime);
        if (savedTransaction) {
            let transactionData = JSON.parse(savedTransaction);
            let tableBody = document.querySelector('#recordTable tbody');
            tableBody.innerHTML = '';
            transactionData.forEach(data => insertRow(tableBody, data));
        } else {
            alert('No transactions found for ' + dateTime);
        }
    }

    function deleteTransactionsForDateTime(dateTime) {
        if (confirm('Are you sure you want to delete the transactions for ' + dateTime + '?')) {
            localStorage.removeItem('transaction_' + dateTime);
            alert('Transactions for ' + dateTime + ' have been deleted.');
            listSavedTransactions();
        }
    }

    function loadBalancesAndTable() {
        for (let i = 1; i <= 54; i++) {
            let savedBalance = localStorage.getItem('balance' + i);
            if (savedBalance !== null) {
                document.querySelector('.person' + i + ' .old-balance').textContent = savedBalance;
                document.querySelector('.person' + i + ' .total-balance').textContent = savedBalance;
            }
        }
    }

    window.onload = function () {
        loadBalancesAndTable();
        listSavedTransactions();
    };

    window.calculateBalance = calculateBalance;
    window.loadTransactionsForDateTime = loadTransactionsForDateTime;
    window.deleteTransactionsForDateTime = deleteTransactionsForDateTime;
    window.listSavedTransactions = listSavedTransactions;
    window.loadBalancesAndTable = loadBalancesAndTable;
});
