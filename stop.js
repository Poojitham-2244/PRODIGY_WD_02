let startTime = 0, elapsedTime = 0, timerInterval = null, isRunning = false, isPaused = false, lapCount = 0;

const timeDisplay = document.getElementById('timeDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapTimes = document.getElementById('lapTimes');
const lapList = document.getElementById('lapList');
const statusIndicator = document.getElementById('statusIndicator');

startBtn.onclick = startStop;
pauseBtn.onclick = pause;
resetBtn.onclick = reset;
lapBtn.onclick = recordLap;
document.getElementById('clearLapsBtn').onclick = clearLaps;

function updateDisplay() {
    const totalTime = elapsedTime + (isRunning ? Date.now() - startTime : 0);
    timeDisplay.textContent = formatTime(totalTime);
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
}

function startStop() {
    if (!isRunning) {
        startTime = Date.now();
        isRunning = true;
        isPaused = false;
        timerInterval = setInterval(updateDisplay, 10);
        updateUI('running');
    }
}

function pause() {
    if (isRunning) {
        elapsedTime += Date.now() - startTime;
        isRunning = false;
        isPaused = true;
        clearInterval(timerInterval);
        updateUI('paused');
    }
}

function reset() {
    clearInterval(timerInterval);
    startTime = elapsedTime = lapCount = 0;
    isRunning = isPaused = false;
    updateDisplay();
    updateUI('stopped');
    lapTimes.style.display = 'none';
    lapList.innerHTML = '';
}

function recordLap() {
    if (isRunning) {
        const currentTime = elapsedTime + (Date.now() - startTime);
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `<span class="lap-number">Lap ${++lapCount}</span><span class="lap-time">${formatTime(currentTime)}</span>`;
        lapList.insertBefore(lapItem, lapList.firstChild);
        lapTimes.style.display = 'block';
    }
}

function clearLaps() {
    lapList.innerHTML = '';
    lapCount = 0;
    lapTimes.style.display = 'none';
}

function updateUI(state) {
    const states = {
        running: { text: 'Running', start: true, pause: false, lap: false },
        paused: { text: 'Resume', start: false, pause: true, lap: true },
        stopped: { text: 'Start', start: false, pause: true, lap: true }
    };
    const s = states[state];
    startBtn.textContent = s.text;
    startBtn.disabled = s.start;
    pauseBtn.disabled = s.pause;
    lapBtn.disabled = s.lap;
    statusIndicator.className = `status-indicator status-${state}`;
}

updateDisplay();