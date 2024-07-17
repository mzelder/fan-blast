document.addEventListener("DOMContentLoaded", () => {
    let body = document.querySelector("body");
    let cursor = document.querySelector("#cursor");
    let fan = document.querySelector("#fan");

    const bodyWidth = body.offsetWidth;
    const bodyHeight = body.offsetHeight;
    const margin = 5;
    const gravity = 0.1;
    let velocityY = 0;

    let mouseX = 0;
    let mouseY = 0;

    // Get half the width and height of the fan
    const fanWidth = fan.offsetWidth;
    const fanHeight = fan.offsetHeight;
    const fanHalfWidth = fanWidth / 2;
    const fanHalfHeight = fanHeight / 2;

    // Mouse move event listener to update mouse coordinates and fan angle
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        fanAngle();
    });

    // Update cursor position and apply gravity every 10 milliseconds
    setInterval(() => {
        // Apply gravity to velocity
        velocityY += gravity;

        // Calculate distance between cursor and fan
        let dx = mouseX - cursor.offsetLeft;
        let dy = mouseY - cursor.offsetTop;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Define a force multiplier (adjust as needed)
        let forceMultiplier = 1;
        
        console.log(dy);
        console.log(distance);
        


        // Calculate the potential new position of cursor
        let newLeft = cursor.offsetLeft - (dx / distance * forceMultiplier);
        let newTop = cursor.offsetTop - (dy / distance * forceMultiplier) + velocityY;

        // Check if the new position exceeds boundaries and adjust if necessary
        if (newLeft >= margin && newLeft + cursor.offsetWidth <= bodyWidth - margin) {
            cursor.style.left = newLeft + 'px';
        }
        if (newTop >= margin && newTop + cursor.offsetHeight <= bodyHeight - margin) {
            cursor.style.top = newTop + 'px';
        }
    }, 10);

    // Function to calculate fan angle based on cursor position
    function fanAngle() {
        let angle = Math.atan2(mouseY - cursor.offsetTop, mouseX - cursor.offsetLeft);
        angle = angle * (180 / Math.PI);

        // Apply rotation to fan
        fan.style.left = (mouseX - fanHalfWidth) + 'px';
        fan.style.top = (mouseY - fanHalfHeight) + 'px';
        fan.style.transform = `rotate(${angle}deg)`;
    }
});
