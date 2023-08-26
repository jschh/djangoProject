function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}


function editWitz(witzTd) {
    // Prüfen, ob das Element bereits bearbeitbar ist
    if (witzTd.getAttribute('contenteditable') == 'false') {
        // Bearbeitbar machen und Fokus setzen
        witzTd.setAttribute('contenteditable', 'true');
        witzTd.focus();

        // Zeige den 'Speichern' Button
        witzTd.nextElementSibling.querySelector('button[data-witz-id]').style.display = 'inline-block';
    } else {
        // Bearbeitbarkeit zurücksetzen
        witzTd.setAttribute('contenteditable', 'false');

        // 'Speichern' Button ausblenden
        witzTd.nextElementSibling.querySelector('button[data-witz-id]').style.display = 'none';
    }
}


function saveWitz(witzId) {
    let csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    let witzText = document.querySelector(`#witz-${witzId}`).innerText;

    fetch(`/kracher/edit/${witzId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
            text: witzText
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Hier können Sie z.B. eine Erfolgsmeldung anzeigen
        } else {
            // Hier können Sie eine Fehlermeldung anzeigen
        }
    })
    .catch(error => {
        console.error('There was an error:', error);
    });
}




function addNewWitz(btn) {
    // Create new Witz in database and refresh the page
    let td = btn.parentElement.previousElementSibling;
    let newText = td.innerText;

    fetch(`/kracher/add/`, {
        method: 'POST',
        body: JSON.stringify({ text: newText }),
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Verwende die getCookie Funktion
        }
    }).then(response => response.json()).then(data => {
        location.reload();
    });
}



