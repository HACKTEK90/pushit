if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

async function addReminder() {
  const text = document.getElementById("reminderText").value;
  const minutes = parseInt(document.getElementById("minutes").value);
  if (!text || !minutes || minutes < 1) return alert("Fill both fields properly!");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return alert("Enable notifications");

  const time = Date.now() + minutes * 60000;

  const reminder = { text, time };
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));
  displayReminders();
}

function displayReminders() {
  const list = document.getElementById("reminderList");
  list.innerHTML = "";

  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.forEach((r, i) => {
    const li = document.createElement("li");
    const date = new Date(r.time);
    li.textContent = `🔔 ${r.text} at ${date.toLocaleTimeString()}`;
    list.appendChild(li);
  });
}

setInterval(() => {
  const now = Date.now();
  let reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders = reminders.filter(r => {
    if (r.time <= now) {
      new Notification("⏰ Reminder", { body: r.text });
      return false; // remove it
    }
    return true;
  });
  localStorage.setItem("reminders", JSON.stringify(reminders));
  displayReminders();
}, 10000); // check every 10 seconds

displayReminders();
