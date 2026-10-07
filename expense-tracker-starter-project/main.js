/**
 * ========================================================
 * Expense Tracker App — main.js
 * ========================================================
 */

// ========================================================
// DATA TRANSAKSI
// ========================================================

// Menyimpan semua transaksi
let transactions = [];

// Menyimpan ID transaksi yang sedang diedit
let editingId = null;

// Key untuk localStorage
const STORAGE_KEY = "expenseTrackerTransactions";


// ========================================================
// FUNGSI ID UNIK
// ========================================================

function generateId() {
  return +new Date();
}


// ========================================================
// Kriteria 1: DOM
// ========================================================

// Form transaksi
const transactionForm =
  document.getElementById("transactionForm");

// Input keterangan
const titleInput =
  document.getElementById("transactionFormTitleInput");

// Input nominal
const amountInput =
  document.getElementById("transactionFormAmountInput");

// Input tanggal
const dateInput =
  document.getElementById("transactionFormDateInput");

// Select tipe transaksi
const typeSelect =
  document.getElementById("transactionFormTypeSelect");

// Daftar pemasukan
const incomeList =
  document.getElementById("incomeList");

// Daftar pengeluaran
const expenseList =
  document.getElementById("expenseList");

// Search form
const searchForm =
  document.getElementById("searchTransactionForm");

// Search input
const searchInput =
  document.getElementById(
    "searchTransactionFormTitleInput"
  );


// ========================================================
// DASHBOARD ELEMENT
// ========================================================

const balanceElement =
  document.querySelector(
    ".tracker-summary__balance-amount"
  );

const incomeElement =
  document.querySelector(
    ".tracker-summary__stat-amount--income"
  );

const expenseElement =
  document.querySelector(
    ".tracker-summary__stat-amount--expense"
  );


// ========================================================
// FORMAT NOMINAL
// ========================================================

function formatCurrency(amount) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}


// ========================================================
// Kriteria 1: RENDER TRANSAKSI
// ========================================================

function renderTransactions() {

  // Kosongkan container terlebih dahulu
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";


  // Ambil keyword pencarian
  const keyword =
    searchInput.value
      .toLowerCase()
      .trim();


  // Filter berdasarkan judul
  const filteredTransactions =
    transactions.filter((transaction) => {

      return transaction.title
        .toLowerCase()
        .includes(keyword);

    });


  // Buat card untuk setiap transaksi
  filteredTransactions.forEach((transaction) => {

    const card =
      document.createElement("div");

    card.classList.add(
      "tracker-transaction-card"
    );

    card.setAttribute(
      "data-testid",
      "transaction-item"
    );


    // ====================================================
    // JUDUL
    // ====================================================

    const title =
      document.createElement("h4");

    title.textContent =
      transaction.title;

    title.setAttribute(
      "data-testid",
      "transaction-title"
    );


    // ====================================================
    // NOMINAL
    // ====================================================

    const amount =
      document.createElement("p");

    amount.textContent =
      formatCurrency(transaction.amount);

    amount.setAttribute(
      "data-testid",
      "transaction-amount"
    );


    // ====================================================
    // TANGGAL
    // ====================================================

    const date =
      document.createElement("p");

    date.textContent =
      transaction.date
        ? formatDate(transaction.date)
        : "-";

    date.setAttribute(
      "data-testid",
      "transaction-date"
    );


    // ====================================================
    // TIPE
    // ====================================================

    const type =
      document.createElement("p");

    type.textContent =
      transaction.type === "income"
        ? "Uang Masuk (+)"
        : "Uang Keluar (-)";

    type.setAttribute(
      "data-testid",
      "transaction-type"
    );


    // ====================================================
    // CONTAINER BUTTON
    // ====================================================

    const buttonContainer =
      document.createElement("div");

    buttonContainer.classList.add(
      "transaction-actions"
    );


    // ====================================================
    // EDIT BUTTON
    // ====================================================

    const editButton =
      document.createElement("button");

    editButton.type = "button";
    editButton.textContent = "Edit";

    editButton.setAttribute(
      "data-testid",
      "edit-button"
    );

    editButton.addEventListener(
      "click",
      () => {
        editTransaction(transaction.id);
      }
    );


    // ====================================================
    // DELETE BUTTON
    // ====================================================

    const deleteButton =
      document.createElement("button");

    deleteButton.type = "button";
    deleteButton.textContent = "Hapus";

    deleteButton.setAttribute(
      "data-testid",
      "delete-button"
    );

    deleteButton.addEventListener(
      "click",
      () => {
        deleteTransaction(transaction.id);
      }
    );


    // ====================================================
    // CHANGE TYPE BUTTON
    // ====================================================

    const changeTypeButton =
      document.createElement("button");

    changeTypeButton.type = "button";
    changeTypeButton.textContent =
      "Ubah Tipe";

    changeTypeButton.setAttribute(
      "data-testid",
      "change-type-button"
    );

    changeTypeButton.addEventListener(
      "click",
      () => {
        changeTransactionType(transaction.id);
      }
    );


    // Masukkan button ke container
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(changeTypeButton);


    // ====================================================
    // MASUKKAN SEMUA KE CARD
    // ====================================================

    card.appendChild(title);
    card.appendChild(amount);
    card.appendChild(date);
    card.appendChild(type);
    card.appendChild(buttonContainer);


    // ====================================================
    // MASUKKAN CARD KE LIST
    // ====================================================

    if (transaction.type === "income") {

      incomeList.appendChild(card);

    } else {

      expenseList.appendChild(card);

    }

  });
}


// ========================================================
// FORMAT TANGGAL
// ========================================================

function formatDate(dateString) {

  if (!dateString) {
    return "-";
  }

  const date =
    new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }
  );
}


// ========================================================
// Kriteria 1 Skilled:
// SUBMIT FORM
// ========================================================

transactionForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();


    // Ambil nilai form
    const title =
      titleInput.value.trim();

    const amount =
      Number(amountInput.value);

    const date =
      dateInput.value;

    const type =
      typeSelect.value;


    // ====================================================
    // VALIDASI JUDUL
    // ====================================================

    if (title === "") {

      alert(
        "Keterangan transaksi tidak boleh kosong."
      );

      return;
    }


    // ====================================================
    // VALIDASI NOMINAL
    // ====================================================

    if (
      isNaN(amount) ||
      amount < 1
    ) {

      alert(
        "Nominal harus lebih dari 0."
      );

      return;
    }


    // ====================================================
    // MODE EDIT
    // ====================================================

    if (editingId !== null) {

      const transaction =
        transactions.find(
          (item) =>
            item.id === editingId
        );


      if (transaction) {

        transaction.title = title;
        transaction.amount = amount;
        transaction.date = date;
        transaction.type = type;

      }


      editingId = null;


    } else {

      // ==================================================
      // MODE TAMBAH
      // ==================================================

      const newTransaction = {

        id: generateId(),

        title: title,

        amount: amount,

        date: date,

        type: type

      };


      transactions.push(
        newTransaction
      );

    }


    // Simpan ke localStorage
    saveTransactions();


    // Reset form
    resetForm();


    // Kirim custom event
    document.dispatchEvent(
      new Event("transaction:updated")
    );

  }
);


// ========================================================
// RESET FORM
// ========================================================

function resetForm() {

  transactionForm.reset();

  editingId = null;


  const submitButton =
    document.querySelector(
      '[data-testid="transactionFormSubmitButton"]'
    );


  if (submitButton) {

    submitButton.textContent =
      "Simpan";

  }

}


// ========================================================
// Kriteria 2: LOCAL STORAGE
// ========================================================

function saveTransactions() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );

}


function loadTransactions() {

  const savedData =
    localStorage.getItem(
      STORAGE_KEY
    );


  if (savedData) {

    try {

      transactions =
        JSON.parse(savedData);

    } catch (error) {

      transactions = [];

    }

  }

}


// ========================================================
// HAPUS TRANSAKSI
// ========================================================

function deleteTransaction(id) {

  transactions =
    transactions.filter(
      (transaction) =>
        transaction.id !== id
    );


  saveTransactions();


  document.dispatchEvent(
    new Event("transaction:updated")
  );

}


// ========================================================
// EDIT TRANSAKSI
// ========================================================

function editTransaction(id) {

  const transaction =
    transactions.find(
      (item) =>
        item.id === id
    );


  if (!transaction) {
    return;
  }


  // Isi kembali form
  titleInput.value =
    transaction.title;

  amountInput.value =
    transaction.amount;

  dateInput.value =
    transaction.date;

  typeSelect.value =
    transaction.type;


  // Simpan ID yang diedit
  editingId = id;


  // Ubah text tombol
  const submitButton =
    document.querySelector(
      '[data-testid="transactionFormSubmitButton"]'
    );


  if (submitButton) {

    submitButton.textContent =
      "Simpan Perubahan";

  }


  // Scroll ke form
  transactionForm.scrollIntoView({
    behavior: "smooth"
  });

}


// ========================================================
// UBAH TIPE TRANSAKSI
// ========================================================

function changeTransactionType(id) {

  const transaction =
    transactions.find(
      (item) =>
        item.id === id
    );


  if (!transaction) {
    return;
  }


  if (
    transaction.type === "income"
  ) {

    transaction.type = "expense";

  } else {

    transaction.type = "income";

  }


  saveTransactions();


  document.dispatchEvent(
    new Event("transaction:updated")
  );

}


// ========================================================
// Kriteria 1 Advanced:
// UPDATE DASHBOARD
// ========================================================

function updateDashboard() {

  let totalIncome = 0;
  let totalExpense = 0;


  transactions.forEach(
    (transaction) => {

      if (
        transaction.type === "income"
      ) {

        totalIncome +=
          transaction.amount;

      } else {

        totalExpense +=
          transaction.amount;

      }

    }
  );


  const balance =
    totalIncome - totalExpense;


  // Update dashboard
  balanceElement.textContent =
    formatCurrency(balance);

  incomeElement.textContent =
    formatCurrency(totalIncome);

  expenseElement.textContent =
    formatCurrency(totalExpense);

}


// ========================================================
// Kriteria 2 Advanced:
// CUSTOM EVENT
// ========================================================

document.addEventListener(
  "transaction:updated",
  function () {

    renderTransactions();

    updateDashboard();

  }
);


// ========================================================
// Kriteria 3 Skilled:
// SEARCH
// ========================================================

// Search berdasarkan input
searchInput.addEventListener(
  "input",
  function () {

    renderTransactions();

  }
);


// Search form
searchForm.addEventListener(
  "submit",
  function (event) {

    event.preventDefault();

    renderTransactions();

  }
);


// ========================================================
// INITIALIZATION
// ========================================================

// Ambil data dari localStorage
loadTransactions();

// Render awal
document.dispatchEvent(
  new Event("transaction:updated")
);