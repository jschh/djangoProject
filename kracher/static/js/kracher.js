document.addEventListener('DOMContentLoaded', (event) => {
    const pre = document.querySelector('.jokeCard');

    document.addEventListener('mousemove', (e) => {
        rotateElement(e, pre);
    });
});

function rotateElement(event, element) {
    const x = event.clientX;
    const y = event.clientY;

    //Mitte herausfinden
    const middleX = window.innerWidth / 2;
    const middleY = window.innerHeight / 2;

    //Offset berechnen
    const offsetX = ((x - middleX) / middleX) * 15;
    const offsetY = ((y - middleY) / middleY) * 15;

    element.style.setProperty("--rotateY", offsetX + "deg");
    element.style.setProperty("--rotateX", -1 * offsetY + "deg");
}


const stars = document.querySelectorAll('.star');

stars.forEach(star => {
    star.addEventListener('click', function() {
        const value = this.dataset.value;

        stars.forEach(s => {
            if(s.dataset.value <= value) {
                s.classList.add('active');
                s.textContent = "★"; // Gefüllter Stern
            } else {
                s.classList.remove('active');
                s.textContent = "☆"; // Leerer Stern
            }
        });
    });
});
