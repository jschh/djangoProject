let card = document.querySelector('.userCard');
let scale = 1;
let rotation = 0;

// Set the initial transform values
card.style.transform = `rotateY(${rotation}deg) rotateX(0deg) scale(${scale})`;

// Get the center of the card
let rect = card.getBoundingClientRect();
let cardCenterX = rect.left + rect.width / 2;
let cardCenterY = rect.top + rect.height / 2;

document.addEventListener('mousemove', (e) => {
    // Calculate rotation values based on the card center
    let xAxis = (cardCenterX - e.pageX) / 15;
    let yAxis = (cardCenterY - e.pageY) / 15;
    card.style.transform = `rotateY(${xAxis + rotation}deg) rotateX(${yAxis}deg) scale(${scale})`;
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
