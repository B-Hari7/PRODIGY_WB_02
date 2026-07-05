// ===========================
// DOM Element References
// ===========================
const displayEl = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const clearLapsBtn = document.getElementById('clearLapsBtn');
const lapsList = document.getElementById('lapsList');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// ===========================
// State Variables
// ===========================
let timerInterval = null;   // Holds the setInterval reference
let elapsedTime = 0;        // Total elapsed time in milliseconds
let startTimestamp = 0;     // Timestamp when the stopwatch was last started/resumed
let laps = [];              // Array of lap times (in milliseconds)

// ===========================
// Format Time Helper
// Converts milliseconds into "HH : MM : SS : MS" segments
// Returns an object so the display can wrap each unit / colon separately
// ===========================
function formatTime(timeInMs) {
  const hours = Math.floor(timeInMs / 3600000);
  const minutes = Math.floor((timeInMs % 3600000) / 60000);
  const seconds = Math.floor((timeInMs % 60000) / 1000);
  const milliseconds = Math.floor((timeInMs % 1000) / 10); // 2-digit ms

  const pad = (num) => String(num).padStart(2, '0');

  return {
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    milliseconds: pad(milliseconds),
 
    text: `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)} : ${pad(milliseconds)}`
  };
}


function renderDisplay(timeInMs) {
  const t = formatTime(timeInMs);
  displayEl.innerHTML =
    `${t.hours}<span class="colon">:</span>${t.minutes}<span class="colon">:</span>${t.seconds}<span class="colon">:</span>${t.milliseconds}`;
}


function updateDisplay() {
  const currentTime = Date.now() - startTimestamp + elapsedTime;
  renderDisplay(currentTime);
}

// ===========================
// Update the status indicator (idle / running / paused)
// ===========================
function setStatus(state) {
  statusDot.classList.remove('running', 'paused');
  if (state === 'running') {
    statusDot.classList.add('running');
    statusText.textContent = 'running';
  } else if (state === 'paused') {
    statusDot.classList.add('paused');
    statusText.textContent = 'paused';
  } else {
    statusText.textContent = 'idle';
  }
}

// ===========================
// Start Stopwatch
// Begins timing from zero
// ===========================
function startStopwatch() {
  startTimestamp = Date.now();
  timerInterval = setInterval(updateDisplay, 10);

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  lapBtn.disabled = false;

  setStatus('running');
}

// ===========================
// Pause Stopwatch
// Stops the timer but keeps the elapsed time saved
// ===========================
function pauseStopwatch() {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime += Date.now() - startTimestamp;

  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
  lapBtn.disabled = true;

  setStatus('paused');
}

// ===========================
// Resume Stopwatch
// Continues timing from where it was paused
// ===========================
function resumeStopwatch() {
  startTimestamp = Date.now();
  timerInterval = setInterval(updateDisplay, 10);

  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  lapBtn.disabled = false;

  setStatus('running');
}

// ===========================
// Reset Stopwatch
// Stops timing and resets everything to zero
// ===========================
function resetStopwatch() {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;
  startTimestamp = 0;

  renderDisplay(0);

  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  lapBtn.disabled = true;

  setStatus('idle');
  clearLaps();
}

// ===========================
// Add Lap
// Records the current elapsed time as a new lap
// ===========================
function addLap() {
  const currentTime = Date.now() - startTimestamp + elapsedTime;
  laps.push(currentTime);
  renderLaps();
}

// ===========================
// Render Laps List
// Rebuilds the lap list in the DOM, newest lap on top
// ===========================
function renderLaps() {
  lapsList.innerHTML = '';

  if (laps.length === 0) {
    const emptyMsg = document.createElement('li');
    emptyMsg.className = 'laps-empty';
    emptyMsg.textContent = 'no splits recorded';
    lapsList.appendChild(emptyMsg);
    return;
  }

  // Loop from last lap to first so the newest lap appears at the top
  for (let i = laps.length - 1; i >= 0; i--) {
    const lapItem = document.createElement('li');
    const lapNumber = i + 1;
    const lapTimeFormatted = formatTime(laps[i]).text;

    const lapLabel = document.createElement('span');
    lapLabel.textContent = `Lap ${String(lapNumber).padStart(2, '0')}`;

    const lapTime = document.createElement('span');
    lapTime.textContent = lapTimeFormatted;

    lapItem.appendChild(lapLabel);
    lapItem.appendChild(lapTime);
    lapsList.appendChild(lapItem);
  }
}

// ===========================
// Clear Laps
// Empties the laps array and updates the UI
// ===========================
function clearLaps() {
  laps = [];
  renderLaps();
}

// ===========================
// Event Listeners
// ===========================
startBtn.addEventListener('click', startStopwatch);
pauseBtn.addEventListener('click', pauseStopwatch);
resumeBtn.addEventListener('click', resumeStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', addLap);
clearLapsBtn.addEventListener('click', clearLaps);

// ===========================
// Initial Render
// ===========================
renderLaps();
renderDisplay(0);
setStatus('idle');