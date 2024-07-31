document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    const trash = document.querySelector("#trash");
    const fan = document.querySelector("#fan");
    
    const bodyWidth = body.offsetWidth;
    const bodyHeight = body.offsetHeight;
    const margin = 50;
    const gravity = 1;
    const windForce = 3; 
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
    createColumns(4, 130, 500);
    const lamp = document.querySelectorAll(".lamp");
    const plant = document.querySelectorAll(".plant");
    const lampHitBox = document.querySelectorAll(".lamp-hitbox");
    const plantHitBox = document.querySelectorAll(".plant-hitbox");
    const items = [lamp, plant, lampHitBox, plantHitBox]
    
    // Update mouse coordinates and fan angle on mouse move
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateFanPositionAndAngle();
    });

    setInterval(() => {
        updateColumns(items);
        checkColission([lampHitBox, plantHitBox]);

        angle += 10;
        trash.style.transform = `rotate(${angle}deg)`
        
        // Apply gravity
        velocityY += gravity;

        // Check if the fan is under the trash and apply upward force
        if (isFanUnderTrash()) {
            velocityY -= windForce; // Apply wind force upward
            
            // Apply horizontal wind force
            if (fan.offsetLeft < trash.offsetLeft) {
                velocityX -= windForce; // Apply wind force to the left
            } else {
                velocityX += windForce; // Apply wind force to the right
            }
        }

        // Limit velocities to avoid extreme values
       velocityY = Math.max(-10, Math.min(10, velocityY));
       velocityX = Math.max(-100, Math.min(100, velocityX));

        // Calculate distance between trash and fan
        let dx = mouseX - trash.offsetLeft;
        let dy = mouseY - trash.offsetTop;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Define a force multiplier (adjust as needed)
        let forceMultiplier = 5;

        // Calculate the potential new position of trash
        let newLeft = trash.offsetLeft - (dx / distance * forceMultiplier);
        let newTop = trash.offsetTop - (dy / distance * forceMultiplier) + velocityY;

        // Check if the new position exceeds boundaries and adjust if necessary
        if (newLeft >= margin && newLeft + trash.offsetWidth <= bodyWidth - margin) {
            trash.style.left = newLeft + "px";
        }
        if (newTop >= margin && newTop + trash.offsetHeight <= bodyHeight - margin) {
            trash.style.top = newTop + "px";
        }
    }, 1);

    // Function to calculate fan angle and update its position
    function updateFanPositionAndAngle() {
        let angle = Math.atan2(mouseY - trash.offsetTop, mouseX - trash.offsetLeft);
        angle = angle * (180 / Math.PI);

        // Apply rotation to fan
        fan.style.left = (mouseX - fanHalfWidth) + "px";
        fan.style.top = (mouseY - fanHalfHeight) + "px";
        fan.style.transform = `rotate(${angle}deg)`;
    }

    // Function to check if the fan is under the trash
    function isFanUnderTrash() {
        let trashRect = trash.getBoundingClientRect();
        let fanRect = fan.getBoundingClientRect();

        let horizontalOverlap = !(trashRect.right < fanRect.left ||
                                  trashRect.left > fanRect.right);

        let verticalAlignment = trashRect.bottom >= fanRect.top && trashRect.top <= fanRect.bottom;

        return horizontalOverlap && verticalAlignment;
    }

    // updating images of the col and hitboxes
    function updateColumns(items) {
        items.forEach(array => {
            if (array[0].classList.contains("plant")) {
                array.forEach(plant => {
                    updateItem(plant);
                });
            } else if (array[0].classList.contains("lamp")) {
                array.forEach(lamp => {
                    updateItem(lamp);
                });
            } else if (array[0].classList.contains("plant-hitbox")) {
                array.forEach(plantHitbox => {
                    updateItem(plantHitbox);
                });
            } else {
                array.forEach(lampHitbox => {
                    updateItem(lampHitbox);
                });
            }
        });
    }

    function updateItem(item) {
        let newItemPosition = item.offsetLeft - 1;
        if (newItemPosition < -400) {
            item.style.left = bodyWidth + "px"; 
        } else {
            item.style.left = newItemPosition + "px";
        }
    }

    // Creating columns that contains plants, lamp and theirs hitboxes
    // lamp min: -100vh, max: -50
    // plant min: 20, max: 70
    // 120 between lamp and plant 
    function createColumns(size, distanceBetweenTop, distanceBetweenLeft) {
        let gap = 0; 
        for (let i = 0; i < size; i++) { 
            // Placing gaps in rows on random positions 
            let lampTop = Math.floor(Math.random() * (-50 - -100)) + -100;
            let plantTop = lampTop + distanceBetweenTop;

            const plant = document.createElement("img");
            plant.src = "images/plant.png";
            plant.classList.add("plant");
            plant.style.left = bodyWidth + gap + "px";
            plant.style.top = `${plantTop}vh`;
            body.appendChild(plant);

            const lamp = document.createElement("img");
            lamp.src = "images/lamp.png";
            lamp.classList.add("lamp");
            lamp.style.left = bodyWidth + gap + "px";
            lamp.style.top = `${lampTop}vh`;
            body.appendChild(lamp);

            const plantHitBox = document.createElement("div");
            plantHitBox.classList.add("plant-hitbox");
            plantHitBox.style.left = bodyWidth + gap + 80 + "px";
            body.appendChild(plantHitBox);

            const lampHitBox = document.createElement("div");
            lampHitBox.classList.add("lamp-hitbox");
            lampHitBox.style.left = bodyWidth + gap + 150 + "px";
            body.appendChild(lampHitBox);

            gap += distanceBetweenLeft;
        }
    }
    
    // Check colisisons for lamps and plants with trash
    function checkColission(arr) {
        const trashRect = trash.getBoundingClientRect();
        arr.forEach(hitboxes=> {
            hitboxes.forEach(item => { 
                let itemRect = item.getBoundingClientRect();
                let itemCollision = !(trashRect.right < itemRect.left ||
                    trashRect.left > itemRect.right ||
                    trashRect.bottom < itemRect.top ||
                    trashRect.top > itemRect.bottom);
                
                if (itemCollision == true) {
                    console.log("HIT!");
                }
            });
        });
    }
});
