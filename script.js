// =========================
// GET ELEMENTS
// =========================

const addButton = document.querySelector(".add-transaction-button");

const transactionModal = document.getElementById("transactionModal");
const closeModal = document.getElementById("closeModal");
const cancelModal = document.getElementById("cancelModal");
const transactionForm = document.getElementById("transactionForm");

const cards = document.querySelectorAll(".summary-card h2");


// =========================
// LOAD SAVED TRANSACTIONS
// =========================

let transactions = 
    JSON.parse(localStorage.getItem("transactions")) || [];
    


// =========================
// OPEN MODAL
// =========================

addButton.addEventListener("click", function () {
    transactionModal.classList.add("active");
});


// =========================
// CLOSE MODAL
// =========================

closeModal.addEventListener("click", function () {
    transactionModal.classList.remove("active");
});

cancelModal.addEventListener("click", function () {
    transactionModal.classList.remove("active");
});


// Close by clicking outside

transactionModal.addEventListener("click", function (event) {

    if (event.target === transactionModal) {
        transactionModal.classList.remove("active");
    }

});


// =========================
// ADD TRANSACTION
// =========================

transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // Get values

    const type =
        document.getElementById("transactionType").value;

    const amount =
        Number(document.getElementById("transactionAmount").value);

    const category =
        document.getElementById("transactionCategory").value;


    // Create transaction

    const transaction = {

        type: type,

        amount: amount,

        category: category,

        date: new Date().toLocaleDateString()

    };


    // Save transaction

    transactions.push(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update everything

    updateDashboard();

    updateSpendingOverview();

    updateTransactionHistory();


    // Close modal

    transactionModal.classList.remove("active");


    // Reset form

    transactionForm.reset();

});


// =========================
// UPDATE DASHBOARD CARDS
// =========================

function updateDashboard() {

    let income = 0;

    let expenses = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            income += transaction.amount;

        }

        else if (transaction.type === "expense") {

            expenses += transaction.amount;

        }

    });


    const balance = income - expenses;

    const savings = income - expenses;


    // Update cards

    cards[0].textContent =
        `$${balance.toLocaleString()}`;

    cards[1].textContent =
        `$${income.toLocaleString()}`;

    cards[2].textContent =
        `$${expenses.toLocaleString()}`;

    cards[3].textContent =
        `$${savings.toLocaleString()}`;

}


// =========================
// UPDATE SPENDING OVERVIEW
// =========================

function updateSpendingOverview() {

    const spendingItems =
        document.querySelectorAll(".spending-item");


    // Category totals

    const categoryTotals = {

        Food: 0,

        Transport: 0,

        Shopping: 0,

        Bills: 0

    };


    // Calculate expenses by category

    transactions.forEach(function (transaction) {

        if (
            transaction.type === "expense" &&
            categoryTotals.hasOwnProperty(transaction.category)
        ) {

            categoryTotals[transaction.category] +=
                transaction.amount;

        }

    });


    // Update displayed amounts

    spendingItems.forEach(function (item) {

        const category =
            item.querySelector("strong").textContent;

        const amount =
            item.querySelectorAll("strong")[1];


        if (categoryTotals.hasOwnProperty(category)) {

            amount.textContent =
                `$${categoryTotals[category].toLocaleString()}`;

        }

    });

}


// =========================
// TRANSACTION HISTORY
// =========================

function updateTransactionHistory() {

    const transactionsList =
        document.getElementById("transactionsList");


    // Clear old transactions

    transactionsList.innerHTML = "";


    // No transactions yet

    if (transactions.length === 0) {

        transactionsList.innerHTML = `

            <p class="empty-transactions">
                No transactions yet. Add your first transaction above.
            </p>

        `;

        return;

    }


    // Show newest first

    const recentTransactions =
        [...transactions].reverse();


    recentTransactions.forEach(function (transaction) {

        const sign =
            transaction.type === "income" ? "+" : "-";


        const className =
            transaction.type === "income"
                ? "transaction-income"
                : "transaction-expense";


        const row =
            document.createElement("div");


        row.className =
            "transaction-row";


        row.innerHTML = `

            <div>

                <strong>
                    ${transaction.category}
                </strong>

                <span>
                    ${transaction.date}
                </span>

            </div>

            <strong class="${className}">

                ${sign}$${transaction.amount.toLocaleString()}

            </strong>

        `;


        transactionsList.appendChild(row);

    });

}

// =========================
// CURRENCY CONVERTER
// =========================

const convertButton =
    document.querySelector(".convert-button");

const currencyAmount =
    document.querySelector(".currency-input input");

const currencySelects =
    document.querySelectorAll(".currency-row select");

const conversionResult =
    document.querySelector(".conversion-result");


convertButton.addEventListener("click", function () {

    const amount =
        Number(currencyAmount.value);

    const from =
        currencySelects[0].value.substring(0, 3);

    const to =
        currencySelects[1].value.substring(0, 3);


    if (!amount || amount <= 0) {

        conversionResult.innerHTML =
            "Please enter a valid amount.";

        return;

    }


    // Demo exchange rates relative to USD

    const rates = {

        USD: 1,

        EUR: 0.92,

        GBP: 0.79,

        INR: 83

    };


    const result =
        (amount / rates[from]) * rates[to];


    conversionResult.innerHTML = `

        ${amount.toLocaleString()} ${from}

        <strong>
            ≈ ${result.toLocaleString(undefined, {
                maximumFractionDigits: 2
            })} ${to}
        </strong>

    `;

});


// =========================
// INITIALIZE APP
// =========================

updateDashboard();

updateSpendingOverview();

updateTransactionHistory();