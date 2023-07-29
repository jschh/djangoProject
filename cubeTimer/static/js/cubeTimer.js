let timer = 0;
let intervalId = null;
let startTimestamp = null;
let times = localStorage.getItem('times') ? JSON.parse(localStorage.getItem('times')) : [];
let canStart = true;
let inspectionIntervalId = null;
let inspectionTime = 15;
let spaceKeyDownTimestamp = null;

window.onload = function() {
    for (let i = times.length - 1; i >= 0; i--) {
        addTimeToTableWithoutAppending(times[i]);
    }
    updateAverage();
};

function updateTimer() {
    timer = (Date.now() - startTimestamp) / 1000;
    document.getElementById('time').textContent = timer.toFixed(2);
}

function startInspectionTimer() {
    if (inspectionIntervalId) return;
    document.getElementById('time').textContent = inspectionTime.toFixed(2);
    inspectionIntervalId = setInterval(function() {
        inspectionTime--;
        if (inspectionTime <= 0) {
            clearInterval(inspectionIntervalId);
            inspectionIntervalId = null;
            document.getElementById('time').textContent = 'DNF';
            document.getElementById('time').style.color = 'red';
        } else {
            document.getElementById('time').textContent = inspectionTime.toFixed(2);
            if (inspectionTime <= 5) {
                document.getElementById('time').style.color = 'red';
            }
        }
    }, 1000);
}

function stopInspectionTimer() {
    if (inspectionIntervalId) {
        clearInterval(inspectionIntervalId);
        inspectionIntervalId = null;
        inspectionTime = 15;
        document.getElementById('time').textContent = '0.00';
    }
}

function addTimeToTableWithoutAppending(time) {
    const table = document.getElementById('times');
    const row = table.insertRow(0);
    const cell = row.insertCell();
    cell.textContent = time.toFixed(2);
}

function addTimeToTable(time) {
    addTimeToTableWithoutAppending(time);
    times.unshift(time);
    updateAverage();
    localStorage.setItem('times', JSON.stringify(times));
}

function updateAverage() {
    let sum = 0;
    for (let time of times) {
        sum += parseFloat(time);
    }
    let average = sum / times.length;
    document.getElementById('average').textContent = "Average: " + average.toFixed(2);
}

function deleteLastTime() {
    if (times.length > 0) {
        times.shift();
        const table = document.getElementById('times');
        table.deleteRow(0);
        updateAverage();
        localStorage.setItem('times', JSON.stringify(times));
    }
}

function deleteAllTimes() {
    times = [];
    const table = document.getElementById('times');
    let rows = table.rows.length;
    for (let i = rows - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
    updateAverage();
    localStorage.clear();
}

let isSpaceKeyDown = false;

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        if (!isSpaceKeyDown && !inspectionIntervalId && !intervalId && canStart) {
            isSpaceKeyDown = true;
            spaceKeyDownTimestamp = Date.now();
            startInspectionTimer();
        }
    } else if (event.code === 'Escape') {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        if (inspectionIntervalId) {
            stopInspectionTimer();
        }
    }
});

window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        isSpaceKeyDown = false;
        if (Date.now() - spaceKeyDownTimestamp >= 1000 && inspectionIntervalId) {
            stopInspectionTimer();
            startTimestamp = Date.now();
            intervalId = setInterval(updateTimer, 10);
            document.getElementById('time').style.color = '#ffffff';
        } else if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            addTimeToTable(timer);
            timer = 0;
        }
    }
});

document.getElementById('deleteLast').addEventListener('click', deleteLastTime);
document.getElementById('deleteAll').addEventListener('click', deleteAllTimes);
