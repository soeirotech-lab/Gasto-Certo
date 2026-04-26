const transactionsUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expenseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");

const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

// 🔥 Pega dados do navegador
const localStorageTransactions = JSON.parse(
  // pegue os dados do navegador e transforme em objeto
  localStorage.getItem("transactions"), // "me dá o que está salvo com o nome 'transactions'"
);

// Se existir dados salvos → usa eles
// Se não → usa padrão
let transactions =
  localStorage.getItem("transactions") !== null
    ? localStorageTransactions // se tiver algo salvo, use ele
    : [
        { id: 1, name: "Bolo de brigadeiro", amount: -20 },
        { id: 2, name: "Salário", amount: 300 },
      ];

// Salva no navegador
const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Remove transação
const removeTransaction = (id) => {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  init();
};

// Adiciona na tela
const addTransactionIntoDOM = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+";
  const CSSClass = transaction.amount < 0 ? "minus" : "plus";
  const amount = Math.abs(transaction.amount);

  const li = document.createElement("li");

  li.classList.add(CSSClass);

  li.innerHTML = `
    ${transaction.name}
    <span>${operator} R$ ${amount.toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  transactionsUl.append(li);
};

// Atualiza valores
const updateBalanceValues = () => {
  const amounts = transactions.map((t) => t.amount);

  const total = amounts.reduce((acc, v) => acc + v, 0).toFixed(2);

  const income = amounts
    .filter((v) => v > 0)
    .reduce((acc, v) => acc + v, 0)
    .toFixed(2);

  const expense = Math.abs(
    amounts.filter((v) => v < 0).reduce((acc, v) => acc + v, 0),
  ).toFixed(2);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `+ R$ ${income}`;
  expenseDisplay.textContent = `- R$ ${expense}`;
};

// Inicia sistema
const init = () => {
  transactionsUl.innerHTML = "";
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValues();
};

// ID
const generateID = () => Math.round(Math.random() * 100000);

// Form
const handleFormSubmit = (event) => {
  event.preventDefault();

  const name = inputTransactionName.value.trim();
  const amount = inputTransactionAmount.value.trim();

  if (name === "" || amount === "") {
    alert("Preencha todos os campos");
    return;
  }

  const transaction = {
    id: generateID(),
    name,
    amount: Number(amount),
  };

  transactions.push(transaction);

  updateLocalStorage();
  init();

  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
};

form.addEventListener("submit", handleFormSubmit);

// Start
init();

console.log(balanceDisplay);
console.log(inputTransactionName);
console.log(inputTransactionAmount);
