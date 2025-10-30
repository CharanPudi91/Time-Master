// Task Management
let tasks = [];
let totalTasks = 0;
let completedTasks = 0;

function addTask() {
  const taskInput = document.getElementById("taskName");
  const task = taskInput.value.trim();
  if (!task) return;
  tasks.push({ name: task, done: false });
  taskInput.value = "";
  updateTasks();
}

function addTaskFromInput(inputId) {
  const input = document.getElementById(inputId);
  const task = input.value.trim();
  if (!task) return;
  tasks.push({ name: task, done: false });
  input.value = "";
  updateTasks();
}

function updateTasks() {
  const list = document.getElementById("taskList");
  const select = document.getElementById("taskSelect");
  list.innerHTML = "";
  select.innerHTML = "<option value=''>-- none --</option>";

  totalTasks = tasks.length;
  completedTasks = tasks.filter(t => t.done).length;
  document.getElementById("dashTotalTasks").textContent = totalTasks;
  document.getElementById("dashCompletedTasks").textContent = completedTasks;

  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.textContent = task.name;
    li.className = task.done ? "done" : "";
    li.onclick = () => {
      task.done = !task.done;
      updateTasks();
    };
    list.appendChild(li);

    const opt = document.createElement("option");
    opt.value = task.name;
    opt.textContent = task.name;
    select.appendChild(opt);
  });
}

// Pomodoro Timer
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let timer;
let isRunning = false;
let isWorkMode = true;
let remainingTime = workDuration;
let sessionsCompleted = 0;

function updateTimerDisplay() {
  const mins = Math.floor(remainingTime / 60).toString().padStart(2, "0");
  const secs = (remainingTime % 60).toString().padStart(2, "0");
  document.getElementById("timerDisplay").textContent = `${mins}:${secs}`;
  document.getElementById("timerMode").textContent = isWorkMode ? "Work" : "Break";
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      if (isWorkMode) {
        sessionsCompleted++;
        document.getElementById("sessionsCompleted").textContent = sessionsCompleted;
        document.getElementById("dashSessionsCompleted").textContent = sessionsCompleted;
        remainingTime = breakDuration;
      } else {
        remainingTime = workDuration;
      }
      isWorkMode = !isWorkMode;
      updateTimerDisplay();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWorkMode = true;
  remainingTime = workDuration;
  updateTimerDisplay();
}

function saveSettings() {
  const workInput = parseInt(document.getElementById("workMinutes").value);
  const breakInput = parseInt(document.getElementById("breakMinutes").value);
  if (workInput > 0 && breakInput > 0) {
    workDuration = workInput * 60;
    breakDuration = breakInput * 60;
    remainingTime = workDuration;
    updateTimerDisplay();
    alert("Timer settings saved!");
  }
}

// Chart.js — Weekly Productivity
const ctx = document.getElementById('chart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Focus Minutes',
      data: [25, 40, 30, 50, 35, 20, 45]
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } }
  }
});

// Initialize Display
updateTasks();
updateTimerDisplay();
