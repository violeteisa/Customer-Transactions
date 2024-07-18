document.addEventListener('DOMContentLoaded', function() {
    const apiData = {
        "customers": [
            { "id": 1, "name": "Ahmed Ali" },
            { "id": 2, "name": "Aya Elsayed" },
            { "id": 3, "name": "Mina Adel" },
            { "id": 4, "name": "Sarah Reda" },
            { "id": 5, "name": "Mohamed Sayed" }
        ],
        "transactions": [
            { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
            { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
            { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
            { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
            { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
            { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
            { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
            { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
            { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
        ]
    };

    let customers = apiData.customers;
    let transactions = apiData.transactions;
    let customersMap = {};

    customers.forEach(customer => {
        customersMap[customer.id] = customer;
    });

    function displayData() {
        let cartona = "";
        for(let i = 0; i < transactions.length; i++) {
            let customer = customersMap[transactions[i].customer_id];
            cartona += `
            <tr data-customer-id="${customer.id}">
                <td class="fw-bold">${customer.name}</td>
                <td class="fw-bold">${transactions[i].date}</td>
                <td class="fw-bold">${transactions[i].amount}</td>
            </tr>
            `;
        }
        document.getElementById('customer-table-body').innerHTML = cartona;
        addRowClickListeners();
    }

    function addRowClickListeners() {
        const rows = document.querySelectorAll('#customer-table-body tr');
        rows.forEach(row => {
            row.addEventListener('click', function() {
                const customerId = parseInt(this.getAttribute('data-customer-id'));
                renderChart(customerId);
            });
        });
    }

    function renderChart(customerId) {
        const customer = customersMap[customerId];
        const ctx = document.getElementById('transaction-chart').getContext('2d');
        const customerTransactions = transactions.filter(transaction => transaction.customer_id === customer.id);
        const transactionsByDate = customerTransactions.reduce((acc, transaction) => {
            const date = transaction.date;
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += transaction.amount;
            return acc;
        }, {});

        const labels = Object.keys(transactionsByDate);
        const data = Object.values(transactionsByDate);

        if (window.chart) {
            window.chart.destroy();
        }

        window.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Total Transaction Amount for ${customer.name}`,
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    displayData();
});
