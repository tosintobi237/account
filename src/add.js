
        function calculateBalance() {
            let totalBags = 0;
            let totalAmountPaid = 0;
            let totalOldBalanceBeforeClick = 0;
            let totalBalanceAfterClick = 0;
            let tableBody = document.querySelector('#recordTable tbody');
            tableBody.innerHTML = ''; // Clear previous records

            // Get the current date and time
            let currentDateTime = new Date().toLocaleString();

            // Loop through each person div
            for (let i = 1; i <= 34; i++) {
                let bags = parseInt(document.getElementById('bags' + i).value) || 0;
                let amountPaid = parseFloat(document.getElementById('amount' + i).value) || 0;
                let pricePerBag = 250;
                let totalCost = bags * pricePerBag;

                let oldBalance = parseFloat(document.querySelector('.person' + i + ' .old-balance').textContent) || 0;
                let totalBalance = totalCost - amountPaid + oldBalance;

                document.querySelector('.person' + i + ' .total-balance').textContent = totalBalance.toFixed(2);

                // Save the new total balance in localStorage
                localStorage.setItem('balance' + i, totalBalance.toFixed(2));

                // Replace the old balance with the new total balance
                document.querySelector('.person' + i + ' .old-balance').textContent = totalBalance.toFixed(2);

                // Accumulate totals
                totalBags += bags;
                totalAmountPaid += amountPaid;
                totalOldBalanceBeforeClick += oldBalance;
                totalBalanceAfterClick += totalBalance;

                // Insert a row into the table
                let row = tableBody.insertRow();
                row.insertCell(0).textContent = currentDateTime; // Date and Time
                row.insertCell(1).textContent = document.querySelector('.person' + i + ' h3').textContent;
                row.insertCell(2).textContent = bags;
                row.insertCell(3).textContent = amountPaid.toFixed(2);
                row.insertCell(4).textContent = oldBalance.toFixed(2);
                row.insertCell(5).textContent = totalBalance.toFixed(2);
            }

            // Save the table content to localStorage
            localStorage.setItem('tableContent', tableBody.innerHTML);

            // Display accumulated totals
            document.getElementById('totalBags').textContent = totalBags;
            document.getElementById('totalAmountPaid').textContent = totalAmountPaid.toFixed(2);
            document.getElementById('totalOldBalanceBeforeClick').textContent = totalOldBalanceBeforeClick.toFixed(2);
            document.getElementById('totalBalanceAfterClick').textContent = totalBalanceAfterClick.toFixed(2);
        }

        // Function to load balances and table data from localStorage on page load
        function loadBalancesAndTable() {
            // Load balances
            for (let i = 1; i <= 34; i++) {
                let savedBalance = localStorage.getItem('balance' + i);
                if (savedBalance !== null) {
                    document.querySelector('.person' + i + ' .old-balance').textContent = savedBalance;
                    document.querySelector('.person' + i + ' .total-balance').textContent = savedBalance;
                }
            }

            // Load table data
            let savedTableContent = localStorage.getItem('tableContent');
            if (savedTableContent !== null) {
                document.querySelector('#recordTable tbody').innerHTML = savedTableContent;
            }
        }

        // Call loadBalancesAndTable when the page loads
        window.onload = loadBalancesAndTable;
