
let timer = 0;
let intervalId = null;
let startTimestamp = null;
let times = [];
let canStart = true;
let inspectionIntervalId = null;
let inspectionTime = 15;
let spaceKeyDownTimestamp = null;
let showPreview = true;
let isSpaceKeyDown = false;


const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Escape'];


window.addEventListener('load', function() {
  fetch('/get_times/')
    .then(response => response.json())
    .then(data => {
      for (let i = data.length - 1; i >= 0; i--) {
        const displayTime = data[i] === -1 ? 'DNF' : data[i];
        addTimeToTableWithoutAppending(displayTime);
        times.unshift(displayTime); // Aktualisieren Sie das 'times' Array
      }
      updateAverages();
      updateToggleButtonState();
    });
});


document.getElementById('togglePreview').addEventListener('click', function() {
  showPreview = !showPreview; // Toggle
  updateToggleButtonState();
  updateTimer(); // wAktualisieren Sie die Timer-Anzeige nach dem Umschalten
});


function updateToggleButtonState() {
  const icon = document.getElementById('toggleIcon');
  if (showPreview) {
    icon.className = 'fas fa-eye'; // offenes Auge
  } else {
    icon.className = 'fas fa-eye-slash'; // durchgestrichenes Auge
  }
}


function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(2);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else if (minutes > 0) {
    return `${minutes}:${secs}`;
  } else {
    return `${secs}`;
  }
}


function updateTimer() {
  if (startTimestamp) {
    timer = (Date.now() - startTimestamp) / 1000;
  }

  if (showPreview || !intervalId) {
    document.getElementById('time').textContent = formatTime(timer);
  } else if (!showPreview && intervalId) {
    document.getElementById('time').textContent = 'Solve';
  }
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

      times.unshift('DNF'); // Fügt DNF zur Liste hinzu
      addTimeToTable('DNF'); // Dies sendet DNF an den Server, damit es gespeichert wird

      updateAverages();
      resetTimer(); // Timer zurücksetzen, damit Sie erneut mit der Inspektion beginnen können
    } else {
      document.getElementById('time').textContent = inspectionTime.toFixed(2);
      if (inspectionTime <= 5) {
        document.getElementById('time').style.color = 'red';
      }
    }
  }, 1000);
}


function resetTimer() {
  timer = 0;
  startTimestamp = null;
  spaceKeyDownTimestamp = null;
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
    const row = table.insertRow(0);  // Zeile am Anfang der Tabelle hinzufügen
    const cell = row.insertCell(0);

    if (typeof time === 'number') {
        cell.textContent = time.toFixed(2);
    } else {
        cell.textContent = time; // Dies sollte "DNF" handhaben
    }
}





function addTimeToTable(time) {
    // Wenn es sich um ein DNF handelt, senden Sie -1 an den Server
    const timeToSend = time === 'DNF' ? -1 : time;

    addTimeToTableWithoutAppending(time);
    times.unshift(time); // Diese Zeile hinzufügen
    updateAverages();

    // Senden Sie die Zeit an den Django-Server
    fetch('/add_time/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // Für Django CSRF
        },
        body: JSON.stringify({
            time: timeToSend
        }),
    });
}


function updateAverages() {
    let best = Infinity;
    let bestAvg3 = Infinity;
    let bestAvg5 = Infinity;
    let sum = 0;
    let count = 0;
    let recent = times.length > 0 && times[0] !== 'DNF' ? parseFloat(times[0]) : NaN;

    for (let time of times) {
        if (time !== 'DNF') {
            let parsedTime = parseFloat(time);
            sum += parsedTime;
            count++;

            if (parsedTime < best) {
                best = parsedTime;
            }
        }
    }

    // Time
    document.getElementById('lastTime').textContent = isNaN(recent) ? "DNF" : recent.toFixed(2);
    document.getElementById('bestTime').textContent = count > 0 ? best.toFixed(2) : "-";

    // AVG3
    if (times.length >= 3) {
        let last3 = times.slice(0, 3);
        let hasDNFinLast3 = last3.includes('DNF');
        let averageLast3 = hasDNFinLast3 ? 'DNF' : (last3.reduce((a, b) => a + parseFloat(b || 0), 0) / last3.length).toFixed(2);
        document.getElementById('lastLast3').textContent = averageLast3;

        for (let i = 0; i <= times.length - 3; i++) {
            let avg3Segment = times.slice(i, i + 3);
            let avg3Value = avg3Segment.reduce((a, b) => a + parseFloat(b || 0), 0) / avg3Segment.length;
            if (avg3Value < bestAvg3) {
                bestAvg3 = avg3Value;
            }
        }
        document.getElementById('bestLast3').textContent = bestAvg3.toFixed(2);
    } else {
        document.getElementById('lastLast3').textContent = "-";
        document.getElementById('bestLast3').textContent = "-";
    }

    // AVG5
    if (times.length >= 5) {
        let last5 = times.slice(0, 5);
        let hasDNFinLast5 = last5.includes('DNF');
        let averageLast5 = hasDNFinLast5 ? 'DNF' : (last5.reduce((a, b) => a + parseFloat(b || 0), 0) / last5.length).toFixed(2);
        document.getElementById('lastLast5').textContent = averageLast5;

        for (let i = 0; i <= times.length - 5; i++) {
            let avg5Segment = times.slice(i, i + 5);
            let avg5Value = avg5Segment.reduce((a, b) => a + parseFloat(b || 0), 0) / avg5Segment.length;
            if (avg5Value < bestAvg5) {
                bestAvg5 = avg5Value;
            }
        }
        document.getElementById('bestLast5').textContent = bestAvg5.toFixed(2);
    } else {
        document.getElementById('lastLast5').textContent = "-";
        document.getElementById('bestLast5').textContent = "-";
    }

    // Average
    let averageAll = count > 0 ? (sum / count).toFixed(2) : "-";
    document.getElementById('lastAverage').textContent = averageAll;
}






function deleteLastTime() {
    if (times.length > 0) {
        times.shift();
        const table = document.getElementById('times');
        table.deleteRow(0);
        updateAverages();

        fetch('/delete_last_time/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('Last time deleted successfully');
            } else {
                console.error('Failed to delete last time');
            }
        });
    }
}

function deleteAllTimes() {
    times = [];
    const table = document.getElementById('times');
    let rows = table.rows.length;
    for (let i = rows - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
    updateAverages();

    fetch('/delete_all_times/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('All times deleted successfully');
        } else {
            console.error('Failed to delete all times');
        }
    });
}




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

  // Hinzugefügt: Überprüfung, ob die Leertaste losgelassen wird und der Timer läuft
  if (event.code === 'Space' && intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    updateTimer();
    addTimeToTable(timer);
    timer = 0;
    return; // Dies stellt sicher, dass nach dem Stoppen des Timers kein weiterer Code in dieser Funktion ausgeführt wird
  }

  if (event.code === 'Space') {
    event.preventDefault();
    isSpaceKeyDown = false;
    if (Date.now() - spaceKeyDownTimestamp >= 1000 && inspectionIntervalId) {
      stopInspectionTimer();
      startTimestamp = Date.now();
      intervalId = setInterval(updateTimer, 10);
      document.getElementById('time').style.color = '#ffffff';
    }
  } else if (intervalId && event.code !== 'Escape') {
    clearInterval(intervalId);
    intervalId = null;
    updateTimer();
    addTimeToTable(timer);
    timer = 0;
  }
});



document.getElementById('deleteLast').addEventListener('click', deleteLastTime);
document.getElementById('deleteAll').addEventListener('click', function(event) {
    if (confirm("Möchten Sie wirklich alle Zeiten löschen?")) {
        deleteAllTimes();
    } else {
        // Die Aktion wurde vom Benutzer abgebrochen
        console.log("Delete All abgebrochen");
    }
});


console.log("Script end");
