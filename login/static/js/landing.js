document.addEventListener('DOMContentLoaded', (event) => {
    const pre = document.querySelector('.userCard');

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
