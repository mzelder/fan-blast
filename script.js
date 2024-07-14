document.addEventListener("DOMContentLoaded", () => {
    let body = document.querySelector("body");
    let cursor = document.querySelector("#cursor");
    let customCursor = document.querySelector("#custom-cursor");
    
    const bodyWidth = body.offsetWidth;
    const bodyHeight = body.offsetHeight;

    let mouseX = 0;
    let mouseY = 0;
    

    document.addEventListener("mousemove", (e) => { 
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateCustomCursor();
    });

    // Update custom cursor position and force every 10 milliseconds (adjust timing as needed)
    setInterval(() => {
        // Calculate distance between cursor and customCursor
        let dx = mouseX - cursor.offsetLeft;
        let dy = mouseY - cursor.offsetTop;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Define a force multiplier (adjust as needed)
        let forceMultiplier = 3;

        // Calculate the potential new position of cursor
        let newLeft = cursor.offsetLeft - (dx / distance * forceMultiplier);
        let newTop = cursor.offsetTop - (dy / distance * forceMultiplier);

        // Check if the new position exceeds boundaries and adjust if necessary
        if (newLeft >= 0 && newLeft + cursor.offsetWidth <= bodyWidth) {
            cursor.style.left = newLeft + 'px';
        }
        
        if (newTop >= 0 && newTop + cursor.offsetHeight <= bodyHeight) {
            cursor.style.top = newTop + 'px';
        }
    }, 10);

    function updateCustomCursor() {
        // Calculate angle between cursor and customCursor
        let angle = Math.atan2(mouseY - cursor.offsetTop, mouseX - cursor.offsetLeft);
        angle = angle * (180 / Math.PI);

        // Apply rotation to custom cursor
        customCursor.style.left = mouseX + 'px';
        customCursor.style.top = mouseY + 'px';
        customCursor.style.transform = `rotate(${angle}deg) scaleX(-1)`;
    }
});
