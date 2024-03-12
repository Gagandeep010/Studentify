"use strict";

// Elements
const balanceEl = document.getElementById("balance");
const creditAmtEl = document.getElementById("Credit-amt");
const expenseAmtEl = document.getElementById("expense-amt");
const listEl = document.getElementById("lists");
const formEl = document.getElementById("form");
const transactionEl = document.getElementById("transaction");
const amountEl = document.getElementById("amount-input");

// Global variables
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let isEditing = false;
let editId = null;

// Function to initialize the application
function init() {
    listEl.innerHTML = "";
    isEditing = false;
    editId = null;
    renderTransactions();
}

// Function to render transactions
function renderTransactions() {
    balanceEl.textContent = formatCurrency(calculateBalance());
    creditAmtEl.textContent = formatCurrency(calculateCredits());
    expenseAmtEl.textContent = formatCurrency(calculateExpenses());
    listEl.innerHTML = "";
    transactions.forEach(addTransactionDOM);
}

// Function to calculate balance
function calculateBalance() {
    return transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
}

// Function to calculate total credits
function calculateCredits() {
    return transactions.reduce((acc, transaction) => {
        if (transaction.amount > 0) {
            return acc + transaction.amount;
        }
        return acc;
    }, 0);
}

// Function to calculate total expenses
function calculateExpenses() {
    return transactions.reduce((acc, transaction) => {
        if (transaction.amount < 0) {
            return acc + Math.abs(transaction.amount);
        }
        return acc;
    }, 0);
}

// Function to add transaction to the DOM
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const listItem = document.createElement("li");
    listItem.classList.add(transaction.amount < 0 ? "minus" : "plus");
    listItem.innerHTML = `
        <span>${transaction.name}</span>
        <span>${sign}${formatCurrency(Math.abs(transaction.amount))}</span>
        <button class="update-btn btn" onclick="editTransaction(${transaction.id})"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn btn" onclick="deleteTransaction(${transaction.id})">X</button>
    `;
    listEl.appendChild(listItem);
}

// Function to format currency
function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
}

// Function to handle form submission
formEl.addEventListener("submit", function(e) {
    e.preventDefault();
    const name = transactionEl.value.trim();
    const amount = +amountEl.value.trim();

    if (name === "" || isNaN(amount) || amount === 0) {
        alert("Please enter a valid transaction.");
        return;
    }

    const transaction = {
        id: Date.now(),
        name,
        amount,
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    init();

    transactionEl.value = "";
    amountEl.value = "";
});

// Function to delete a transaction
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    init();
}

// Function to edit a transaction
function editTransaction(id) {
    const transactionToEdit = transactions.find(transaction => transaction.id === id);
    if (!transactionToEdit) return;

    isEditing = true;
    editId = id;

    transactionEl.value = transactionToEdit.name;
    amountEl.value = Math.abs(transactionToEdit.amount);
}

// Initialize the application
init();