let gameInterval; 
const highestScoreElement = document.getElementById("highest-score");
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let scoreValue = 0;
highestScoreElement.innerText = `Highest Score: ${highScore}`;
// localStorage.setItem("highScore", 0);

function startGame() {
    const body = document.querySelector("body");

    createGame();
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

    const fanWidth = fan.offsetWidth;
    const fanHeight = fan.offsetHeight;
    const fanHalfWidth = fanWidth / 2;
    const fanHalfHeight = fanHeight / 2;

    createColumns(4, 130, 500);
    const lamp = document.querySelectorAll(".lamp");
    const plant = document.querySelectorAll(".plant");
    const lampHitBox = document.querySelectorAll(".lamp-hitbox");
    const plantHitBox = document.querySelectorAll(".plant-hitbox");
    const columns = {};
    for (let i = 0; i < lamp.length; i++) {
        columns[i] = {
            lamp: lamp[i],
            plant: plant[i],
            lampHitbox: lampHitBox[i],
            plantHitbox: plantHitBox[i]
        };
    }

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateFanPositionAndAngle();
    });

    gameInterval = setInterval(() => {
        updateColumns(columns, 130);
        checkCollision([lampHitBox, plantHitBox]);

        angle += 10;
        trash.style.transform = `rotate(${angle}deg)`;

        velocityY += gravity;

        if (isFanUnderTrash()) {
            velocityY -= windForce;

            if (fan.offsetLeft < trash.offsetLeft) {
                velocityX -= windForce;
            } else {
                velocityX += windForce;
            }
        }

        velocityY = Math.max(-10, Math.min(10, velocityY));
        velocityX = Math.max(-100, Math.min(100, velocityX));

        let dx = mouseX - trash.offsetLeft;
        let dy = mouseY - trash.offsetTop;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceMultiplier = 5;

        let newLeft = trash.offsetLeft - (dx / distance * forceMultiplier);
        let newTop = trash.offsetTop - (dy / distance * forceMultiplier) + velocityY;

        if (newLeft >= margin && newLeft + trash.offsetWidth <= bodyWidth - margin) {
            trash.style.left = newLeft + "px";
        }
        if (newTop >= margin && newTop + trash.offsetHeight <= bodyHeight - margin) {
            trash.style.top = newTop + "px";
        }
    }, 13);

    function updateFanPositionAndAngle() {
        let angle = Math.atan2(mouseY - trash.offsetTop, mouseX - trash.offsetLeft);
        angle = angle * (180 / Math.PI);

        fan.style.left = (mouseX - fanHalfWidth) + "px";
        fan.style.top = (mouseY - fanHalfHeight) + "px";
        fan.style.transform = `rotate(${angle}deg)`;
    }

    function isFanUnderTrash() {
        let trashRect = trash.getBoundingClientRect();
        let fanRect = fan.getBoundingClientRect();

        let horizontalOverlap = !(trashRect.right < fanRect.left ||
            trashRect.left > fanRect.right);

        let verticalAlignment = trashRect.bottom >= fanRect.top && trashRect.top <= fanRect.bottom;

        return horizontalOverlap && verticalAlignment;
    }

    function updateColumns(columns, distanceBetweenTop) {
        Object.values(columns).forEach(column => {
            if (column.plant.offsetLeft < -400) {
                scoreValue++;
                score.innerText = `Score: ${scoreValue}`;
                column.plant.style.left = bodyWidth + "px";
                column.lamp.style.left = bodyWidth + "px";
                column.plantHitbox.style.left = bodyWidth + 50 + "px";
                column.lampHitbox.style.left = bodyWidth + 110 + "px";

                let { lampTop, plantTop } = generateGapsValues(distanceBetweenTop);
                column.plant.style.top = `${plantTop}vh`;
                column.lamp.style.top = `${lampTop}vh`;
                column.plantHitbox.style.top = `${plantTop + 10}vh`;
                column.lampHitbox.style.top = `${lampTop + 60}vh`;
            } else {
                column.plant.style.left = column.plant.offsetLeft - 3 + "px";
                column.lamp.style.left = column.lamp.offsetLeft - 3 + "px";
                column.plantHitbox.style.left = column.plantHitbox.offsetLeft - 3 + "px";
                column.lampHitbox.style.left = column.lampHitbox.offsetLeft - 3 + "px";
            }
        });
    }

    function createGame() {
        const fan = document.createElement("div");
        fan.id = "fan";
        body.appendChild(fan);

        const trash = document.createElement("img");
        trash.id = "trash";
        trash.src = "images/trash.png";
        body.appendChild(trash);

        const score = document.createElement("p");
        score.id = "score";
        score.innerText = `Score: ${scoreValue}`;
        body.appendChild(score);

        const startDiv = document.querySelector(".center-container");
        startDiv.style.opacity = 0;
        body.style.cursor = "none";
    }

    function createColumns(size, distanceBetweenTop, distanceBetweenLeft) {
        let gap = 0;
        for (let i = 0; i < size; i++) {
            let { lampTop, plantTop } = generateGapsValues(distanceBetweenTop);

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
            plantHitBox.style.left = bodyWidth + gap + 50 + "px";
            plantHitBox.style.top = `${plantTop + 10}vh`;
            body.appendChild(plantHitBox);

            const lampHitBox = document.createElement("div");
            lampHitBox.classList.add("lamp-hitbox");
            lampHitBox.style.left = bodyWidth + gap + 110 + "px";
            lampHitBox.style.top = `${lampTop + 60}vh`;
            body.appendChild(lampHitBox);

            gap += distanceBetweenLeft;
        }
    }

    function generateGapsValues(distanceBetweenGaps) {
        let lampTopValue = Math.floor(Math.random() * (-50 - -100)) + -100;
        return { lampTop: lampTopValue, plantTop: lampTopValue + distanceBetweenGaps };
    }

    function checkCollision(arr) {
        const trashRect = trash.getBoundingClientRect();
        arr.forEach(hitboxes => {
            hitboxes.forEach(item => {
                let itemRect = item.getBoundingClientRect();
                let itemCollision = !(trashRect.right < itemRect.left ||
                    trashRect.left > itemRect.right ||
                    trashRect.bottom < itemRect.top ||
                    trashRect.top > itemRect.bottom);

                if (itemCollision == true) {
                    endGame();
                }
            });
        });
    }
}

function endGame() {
    clearInterval(gameInterval);

    // Show elements
    document.querySelector(".center-container").style.opacity = 1;
    document.body.style.cursor = "auto";

    // Remove game elements
    document.querySelectorAll("#fan, #trash, #score, .lamp, .plant, .lamp-hitbox, .plant-hitbox").forEach(element => {
        element.remove();
    });

    if (scoreValue > highScore) { 
        highScore = scoreValue;
        localStorage.setItem("highScore", highScore);
        highestScoreElement.innerText = `Highest Score: ${highScore}`;
    }

    scoreValue = 0;
}
