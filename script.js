if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

function switchTab(tab) {
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
}

// REMINDERS
function addReminder() {
  const text = document.getElementById('reminderText').value;
  const mins = parseInt(document.getElementById('reminderTime').value);
  if (!text || !mins || mins < 1) return alert("Fill all fields!");

  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') return alert("Notifications blocked!");

    const reminder = { text, time: Date.now() + mins * 60000 };
    const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    displayReminders();
  });
}

function displayReminders() {
  const list = document.getElementById('reminderList');
  list.innerHTML = '';
  const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
  reminders.forEach(r => {
    const li = document.createElement('li');
    const t = new Date(r.time).toLocaleTimeString();
    li.textContent = `🔔 ${r.text} at ${t}`;
    list.appendChild(li);
  });
}

setInterval(() => {
  const now = Date.now();
  let reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
  reminders = reminders.filter(r => {
    if (r.time <= now) {
      new Notification("⏰ Reminder", { body: r.text });
      return false;
    }
    return true;
  });
  localStorage.setItem('reminders', JSON.stringify(reminders));
  displayReminders();
}, 10000);

// TODO LIST
function addTodo() {
  const task = document.getElementById('todoInput').value;
  if (!task) return;
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.push({ task, done: false });
  localStorage.setItem('todos', JSON.stringify(todos));
  displayTodos();
}

function toggleTodo(i) {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos[i].done = !todos[i].done;
  localStorage.setItem('todos', JSON.stringify(todos));
  displayTodos();
}

function deleteTodo(i) {
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.splice(i, 1);
  localStorage.setItem('todos', JSON.stringify(todos));
  displayTodos();
}

function displayTodos() {
  const list = document.getElementById('todoList');
  list.innerHTML = '';
  const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  todos.forEach((todo, i) => {
    const li = document.createElement('li');
    li.className = todo.done ? 'completed' : '';
    li.innerHTML = `
      <span onclick="toggleTodo(${i})">${todo.task}</span>
      <button onclick="deleteTodo(${i})">🗑</button>
    `;
    list.appendChild(li);
  });
}

// NOTES
const notesArea = document.getElementById('notesArea');
notesArea.value = localStorage.getItem('notes') || '';
notesArea.addEventListener('input', () => {
  localStorage.setItem('notes', notesArea.value);
});

// Init displays
switchTab('reminder');
displayReminders();
displayTodos();
