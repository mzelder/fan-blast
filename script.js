document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    const cursor = document.querySelector("#cursor");
    const fan = document.querySelector("#fan");
    
    const bodyWidth = body.offsetWidth;
    const bodyHeight = body.offsetHeight;
    const margin = 5;
    const gravity = 0.1;
    const windForce = 0.5; 
    let velocityY = 0;
    let velocityX = 0; 
    let angle = 0;

    let mouseX = 0;
    let mouseY = 0;

    // Get half the width and height of the fan
    const fanWidth = fan.offsetWidth;
    const fanHeight = fan.offsetHeight;
    const fanHalfWidth = fanWidth / 2;
    const fanHalfHeight = fanHeight / 2;
    
    // Create obstacles columns
    createColumns(5);
    const lamp = document.querySelectorAll(".lamp");
    const plant = document.querySelectorAll(".plant");
    const lampHitBox = document.querySelectorAll(".lamp-hitbox");
    const plantHitBox = document.querySelectorAll(".plant-hitbox");
    
    // Update mouse coordinates and fan angle on mouse move
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateFanPositionAndAngle();
    });

    setInterval(() => {
        //updateColumns();
        
        // if (checkColission()) {
        //     alert("Game over!");
        // }
        
        angle += 10;
        cursor.style.transform = `rotate(${angle}deg)`
        
        // Apply gravity
        velocityY += gravity;

        // Check if the fan is under the cursor and apply upward force
        if (isFanUnderCursor()) {
            velocityY -= windForce; // Apply wind force upward
            
            // Apply horizontal wind force
            if (fan.offsetLeft < cursor.offsetLeft) {
                velocityX -= windForce; // Apply wind force to the left
            } else {
                velocityX += windForce; // Apply wind force to the right
            }
        }

        // Limit velocities to avoid extreme values
       velocityY = Math.max(-10, Math.min(10, velocityY));
       velocityX = Math.max(-100, Math.min(100, velocityX));

    //    console.log(`Y: ${velocityY}`);
    //    console.log(`X: ${velocityX}`);

        // Calculate distance between cursor and fan
        let dx = mouseX - cursor.offsetLeft;
        let dy = mouseY - cursor.offsetTop;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Define a force multiplier (adjust as needed)
        let forceMultiplier = 2;

        // Calculate the potential new position of cursor
        let newLeft = cursor.offsetLeft - (dx / distance * forceMultiplier);
        let newTop = cursor.offsetTop - (dy / distance * forceMultiplier) + velocityY;

        // Check if the new position exceeds boundaries and adjust if necessary
        if (newLeft >= margin && newLeft + cursor.offsetWidth <= bodyWidth - margin) {
            cursor.style.left = newLeft + "px";
        }
        if (newTop >= margin && newTop + cursor.offsetHeight <= bodyHeight - margin) {
            cursor.style.top = newTop + "px";
        }
    }, 10);

    // Function to calculate fan angle and update its position
    function updateFanPositionAndAngle() {
        let angle = Math.atan2(mouseY - cursor.offsetTop, mouseX - cursor.offsetLeft);
        angle = angle * (180 / Math.PI);

        // Apply rotation to fan
        fan.style.left = (mouseX - fanHalfWidth) + "px";
        fan.style.top = (mouseY - fanHalfHeight) + "px";
        fan.style.transform = `rotate(${angle}deg)`;
    }

    // Function to check if the fan is under the cursor
    function isFanUnderCursor() {
        let cursorRect = cursor.getBoundingClientRect();
        let fanRect = fan.getBoundingClientRect();

        let horizontalOverlap = !(cursorRect.right < fanRect.left ||
                                  cursorRect.left > fanRect.right);

        let verticalAlignment = cursorRect.bottom >= fanRect.top && cursorRect.top <= fanRect.bottom;

        return horizontalOverlap && verticalAlignment;
    }

    // lamp: 1000px, hitbox: 1150px
    // plant: 1040px, hitbox 1100px
    // updating images of the col and hitboxes
    function updateColumns() {
        let lampNewPosition = lamp.offsetLeft - 1;
        let plantNewPosition = plant.offsetLeft - 1;
     
        if (lampNewPosition < -400 || plantNewPosition < -400) {
            lamp.style.left = bodyWidth + "px";
            plant.style.left = bodyWidth + 40 + "px";
            lampHitBox.style.left = bodyWidth + 150 + "px";
            plantHitBox.style.left = bodyWidth + 60 + "px";
        } else {
            lamp.style.left = lampNewPosition + "px";
            plant.style.left = plantNewPosition + "px";
            lampHitBox.style.left = lampNewPosition + 150 + "px";
            plantHitBox.style.left = plantNewPosition + 60 + "px";
        }
    }

    // Creating columns that contains plants, lamp and theirs hitboxes
    function createColumns(size) {
        let distanceBetween = 0; 
        for (let i = 0; i < size; i++) { 
            const plant = document.createElement("img");
            plant.src = "/plant.png";
            plant.classList.add("plant");
            plant.style.left = distanceBetween + 40 + "px";
            body.appendChild(plant);

            const lamp = document.createElement("img");
            lamp.src = "/lamp.png";
            lamp.classList.add("lamp");
            lamp.style.left = distanceBetween + "px";
            body.appendChild(lamp);

            const plantHitBox = document.createElement("div");
            plantHitBox.classList.add("plant-hitbox");
            plantHitBox.style.left = distanceBetween + 80 + "px";
            body.appendChild(plantHitBox);

            const lampHitBox = document.createElement("div");
            lampHitBox.classList.add("lamp-hitbox");
            lampHitBox.style.left = distanceBetween + 150 + "px";
            body.appendChild(lampHitBox);

            distanceBetween += 700;
        }
    }
    
    // Check colisisons for lamps and plants with cursor
    function checkColission() {
        let cursorRect = cursor.getBoundingClientRect();
        let lampRect = lampHitBox.getBoundingClientRect();
        let plantRect = plantHitBox.getBoundingClientRect();
        
        let lampCollision = !(cursorRect.right < lampRect.left ||
            cursorRect.left > lampRect.right ||
            cursorRect.bottom < lampRect.top ||
            cursorRect.top > lampRect.bottom);

        let plantCollision = !(cursorRect.right < plantRect.left ||
            cursorRect.left > plantRect.right ||
            cursorRect.bottom < plantRect.top ||
            cursorRect.top > plantRect.bottom);

        return lampCollision || plantCollision;
    }
});
