
let timer = 0;
let intervalId = null;
let startTimestamp = null;
let times = [];
let canStart = true;
let inspectionIntervalId = null;
let inspectionTime = 15;
let spaceKeyDownTimestamp = null;
let showPreview = true;


const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Escape'];


window.addEventListener('load', function() {
  console.log("Window loaded");
    fetch('/get_times/')
        .then(response => response.json())
        .then(data => {
        for (let time of data) {
            addTimeToTableWithoutAppending(time);
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
  times.unshift(time); // Füge Zeit zum Anfang der 'times'-Array hinzu
}



function addTimeToTable(time) {
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
      time: time
    }),
  });
}


function updateAverages() {
  let best = Infinity;
  let sum = 0;
  let count = times.length;

  for (let time of times) {
    let parsedTime = parseFloat(time);
    sum += parsedTime;

    if (parsedTime < best) {
      best = parsedTime;
    }
  }


  document.getElementById('best').textContent = "Best: " + (count > 0 ? best.toFixed(2) : "NaN");
  let averageAll = sum / count;
  document.getElementById('average').textContent = "Avg: " + averageAll.toFixed(2);
  let last3 = times.slice(0, 3);
  let averageLast3 = last3.reduce((a, b) => a + parseFloat(b), 0) / last3.length;
  document.getElementById('last3').textContent = "AVG3: " + (last3.length >= 3 ? averageLast3.toFixed(2) : "NaN");
  let last5 = times.slice(0, 5);
  let averageLast5 = last5.reduce((a, b) => a + parseFloat(b), 0) / last5.length;
  document.getElementById('last5').textContent = "AVG5: " + (last5.length >= 5 ? averageLast5.toFixed(2) : "NaN");
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
  if (!ignoredKeys.includes(event.key)) { // Ignoriere spezielle Tasten
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
  if (!ignoredKeys.includes(event.key))  {
    console.log('worked')
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
      updateTimer(); // Diese Zeile wurde nach oben verschoben
      addTimeToTable(timer);
      timer = 0;
    }
  }
});


document.getElementById('deleteLast').addEventListener('click', deleteLastTime);
document.getElementById('deleteAll').addEventListener('click', deleteAllTimes);


console.log("Script end");
