let card = document.querySelector('.userCard');
let debugLine = document.querySelector('.debug-line');
let scale = 1;
let rotation = 0;

// Set the initial transform values
card.style.transform = `rotateY(0deg) rotateX(0deg) scale(${scale})`;

document.addEventListener('mousemove', (e) => {
    // Get the center of the screen
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;

    // Calculate rotation values based on the center of the screen
    let xAxis = (e.pageX - centerX) / 18;
    let yAxis = -(e.pageY - centerY) / 18;

    card.style.transform = `rotateY(${xAxis + rotation}deg) rotateX(${yAxis}deg) scale(${scale})`;

    // Calculate the angle for the debug line
    let angle = Math.atan2(e.pageY - centerY, e.pageX - centerX) * 180 / Math.PI;
    debugLine.style.transform = `rotate(${angle}deg)`;
});

document.addEventListener('mouseleave', (e) => {
    card.style.transform = `rotateY(${rotation}deg) rotateX(0deg) scale(${scale})`;
});

document.addEventListener('wheel', (e) => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(.125, scale), 4);

    card.style.transform = `rotateY(${rotation}deg) rotateX(0deg) scale(${scale})`;
});

// Rotate the card when the left arrow key is pressed
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        rotation += 360; // Add 360 degrees to the rotation
        card.style.transform = `rotateY(${rotation}deg) rotateX(0deg) scale(${scale})`;
    }
});
