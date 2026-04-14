const APP_PASSWORD = 'dilse2026';

const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const appPassword = document.getElementById('appPassword');
const loginBtn = document.getElementById('loginBtn');
const loginMessage = document.getElementById('loginMessage');
const logoutBtn = document.getElementById('logoutBtn');

const connectionStatus = document.getElementById('connectionStatus');
const loadEventsBtn = document.getElementById('loadEventsBtn');
const clearResultsBtn = document.getElementById('clearResultsBtn');
const searchBtn = document.getElementById('searchBtn');
const eventSelect = document.getElementById('eventSelect');
const searchInput = document.getElementById('searchInput');
const messageBox = document.getElementById('messageBox');
const resultsContainer = document.getElementById('resultsContainer');

function showLoginMessage(text, type = 'error') {
  loginMessage.textContent = text;
  loginMessage.classList.remove('hidden', 'success', 'error');
  loginMessage.classList.add(type);
}

function hideLoginMessage() {
  loginMessage.textContent = '';
  loginMessage.classList.add('hidden');
  loginMessage.classList.remove('success', 'error');
}

function setStatus(text, type = '') {
  connectionStatus.textContent = text;
  connectionStatus.classList.remove('ok', 'error');

  if (type) {
    connectionStatus.classList.add(type);
  }
}

function unlockApp() {
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

  const value = appPassword.value.trim();

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
  appShell.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  appPassword.value = '';
  hideLoginMessage();
  setStatus('Not connected');
  appPassword.focus();
}

function showMessage(text, type = 'success') {
  messageBox.textContent = text;
  messageBox.classList.remove('hidden', 'success', 'error');
  messageBox.classList.add(type);
}

function hideMessage() {
  messageBox.textContent = '';
  messageBox.classList.add('hidden');
  messageBox.classList.remove('success', 'error');
}

function renderPlaceholderResults(title, detail) {
  resultsContainer.innerHTML = `
    <div class="result-card">
      <h3>${title}</h3>
      <p>${detail}</p>
    </div>
  `;
}

function clearResults() {
  resultsContainer.innerHTML = '<p>No results yet</p>';
  searchInput.value = '';
  eventSelect.value = '';
  hideMessage();
  setStatus('Ready', 'ok');
}

function loadDemoEvents() {
  const demoEvents = [
    { id: 'dil-se-main', name: 'Dil Se - April 18 Main Event' },
    { id: 'vip-entry', name: 'Dil Se - VIP Entry' },
    { id: 'late-entry', name: 'Dil Se - Late Entry / Walk-In' }
  ];

  eventSelect.innerHTML = '<option value="">Choose Event</option>';

  for (const event of demoEvents) {
    const option = document.createElement('option');
    option.value = event.id;
    option.textContent = event.name;
    eventSelect.appendChild(option);
  }

  setStatus('Demo connected', 'ok');
  showMessage('Demo events loaded. Next we will connect this safely to Netlify functions.', 'success');
  renderPlaceholderResults('Events loaded', 'You can now select an event and test the search flow.');
}

function runDemoSearch() {
  hideMessage();

  const selectedEvent = eventSelect.value;
  const query = searchInput.value.trim();

  if (!selectedEvent) {
    showMessage('Please select an event first.', 'error');
    setStatus('Event needed', 'error');
    return;
  }

  if (!query) {
    showMessage('Please type a guest name, email, or order ID.', 'error');
    setStatus('Search needed', 'error');
    return;
  }

  setStatus('Searching demo...', 'ok');

  resultsContainer.innerHTML = `
    <div class="result-card">
      <h3>Demo Search Result</h3>
      <p><strong>Event:</strong> ${eventSelect.options[eventSelect.selectedIndex].text}</p>
      <p><strong>Search:</strong> ${query}</p>
      <p>This is only a safe demo screen right now. In the next step, we will connect this to your secure backend so no personal data or API key is exposed in the browser.</p>
    </div>
  `;

  showMessage('Demo search completed.', 'success');
}

loginBtn.addEventListener('click', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

appPassword.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleLogin();
  }
});

loadEventsBtn.addEventListener('click', loadDemoEvents);
clearResultsBtn.addEventListener('click', clearResults);
searchBtn.addEventListener('click', runDemoSearch);

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    runDemoSearch();
  }
});

checkLoginState();
