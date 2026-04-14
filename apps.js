const APP_PASSWORD = 'dilse2026';

const TICKET_TAILOR_LINKS = {
  CHECKIN: 'https://app.tickettailor.com/event/tickets-issued/7584207',
  ORDERS: 'https://app.tickettailor.com/orders',
  CREATE: 'https://app.tickettailor.com/orders#pop=/orders/add',
  DASHBOARD: 'https://app.tickettailor.com/dashboard',
};

const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const appPassword = document.getElementById('appPassword');
const loginBtn = document.getElementById('loginBtn');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');
const connectionStatus = document.getElementById('connectionStatus');

function showLoginMessage(text, type = 'error') {
  if (!loginMessage) return;
  loginMessage.textContent = text;
  loginMessage.classList.remove('hidden', 'success', 'error');
  loginMessage.classList.add(type);
}

function hideLoginMessage() {
  if (!loginMessage) return;
  loginMessage.textContent = '';
  loginMessage.classList.add('hidden');
  loginMessage.classList.remove('success', 'error');
}

function setStatus(text, type = '') {
  if (!connectionStatus) return;
  connectionStatus.textContent = text;
  connectionStatus.classList.remove('ok', 'error');

  if (type) {
    connectionStatus.classList.add(type);
  }
}

function unlockApp() {
  if (!loginScreen || !appShell) return;
  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  sessionStorage.setItem('frontDeskUnlocked', 'true');
  setStatus('Ready', 'ok');
}

function checkLoginState() {
  const unlocked = sessionStorage.getItem('frontDeskUnlocked');

  if (unlocked === 'true') {
    unlockApp();
  }
}

function handleLogin() {
  hideLoginMessage();

  const value = appPassword ? appPassword.value.trim() : '';

  if (!value) {
    showLoginMessage('Please enter the password.', 'error');
    return;
  }

  if (value !== APP_PASSWORD) {
    showLoginMessage('Incorrect password.', 'error');
    appPassword.value = '';
    appPassword.focus();
    return;
  }

  unlockApp();
}

function handleLogout() {
  sessionStorage.removeItem('frontDeskUnlocked');

  if (appShell) {
    appShell.classList.add('hidden');
  }

  if (loginScreen) {
    loginScreen.classList.remove('hidden');
  }

  if (appPassword) {
    appPassword.value = '';
    appPassword.focus();
  }

  hideLoginMessage();
  setStatus('Not connected');
}

function openLink(type) {
  const url = TICKET_TAILOR_LINKS[type];

  if (!url || url.includes('PASTE_')) {
    alert(`Please add the ${type} Ticket Tailor link in apps.js first.`);
    return;
  }

  window.open(url, '_blank', 'noopener');
}

function toggleHelp() {
  const helpBox = document.getElementById('helpBox');
  if (!helpBox) return;

  const isHidden = helpBox.style.display === 'none' || helpBox.style.display === '';
  helpBox.style.display = isHidden ? 'block' : 'none';
}

function calculateTotal() {
  const ticketPriceInput = document.getElementById('ticketPrice');
  const ticketQuantityInput = document.getElementById('ticketQuantity');
  const amountDueInput = document.getElementById('amountDue');
  const totalResult = document.getElementById('totalResult');

  if (!ticketPriceInput || !ticketQuantityInput || !amountDueInput || !totalResult) return;

  const price = parseFloat(ticketPriceInput.value);
  const quantity = parseInt(ticketQuantityInput.value, 10);

  if (Number.isNaN(price) || Number.isNaN(quantity) || quantity < 1) {
    amountDueInput.value = '';
    totalResult.textContent = 'Please enter a valid ticket price and quantity.';
    totalResult.style.color = '#991b1b';
    calculateChange();
    return;
  }

  const total = price * quantity;
  amountDueInput.value = total.toFixed(2);
  totalResult.textContent = `Total due: $${total.toFixed(2)}`;
  totalResult.style.color = '#15803d';
  calculateChange();
}

function calculateChange() {
  const amountDueInput = document.getElementById('amountDue');
  const amountPaidInput = document.getElementById('amountPaid');
  const result = document.getElementById('changeResult');

  if (!amountDueInput || !amountPaidInput || !result) return;

  const due = parseFloat(amountDueInput.value);
  const paidText = amountPaidInput.value.trim();
  const paid = parseFloat(paidText);

  if (Number.isNaN(due)) {
    result.textContent = '';
    result.style.color = '';
    return;
  }

  if (!paidText || Number.isNaN(paid)) {
    result.textContent = 'Enter amount paid to see change.';
    result.style.color = '#555';
    return;
  }

  const change = paid - due;

  if (change < 0) {
    result.textContent = `Still owed: $${Math.abs(change).toFixed(2)}`;
    result.style.color = '#991b1b';
    return;
  }

  result.textContent = `Change due: $${change.toFixed(2)}`;
  result.style.color = '#15803d';
}

window.openLink = openLink;
window.toggleHelp = toggleHelp;
window.calculateChange = calculateChange;
window.calculateTotal = calculateTotal;

if (loginBtn) {
  loginBtn.addEventListener('click', handleLogin);
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', handleLogout);
}

if (appPassword) {
  appPassword.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  });
}

const ticketPriceInput = document.getElementById('ticketPrice');
const ticketQuantityInput = document.getElementById('ticketQuantity');
const amountPaidInput = document.getElementById('amountPaid');

if (ticketPriceInput) {
  ticketPriceInput.addEventListener('input', calculateTotal);
}

if (ticketQuantityInput) {
  ticketQuantityInput.addEventListener('input', calculateTotal);
}

if (amountPaidInput) {
  amountPaidInput.addEventListener('input', calculateChange);
}

calculateTotal();

checkLoginState();
