document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);


const asteroidContainer  = document.getElementById('asteroidContainer');
const shipUser = document.getElementById('ship');

const points = document.getElementById('points');
const bestScore = document.getElementById('bestScore');

let i = 0;
let z = 0;

let posX; 
let posY;

let posXBot;
let posYBot; 

let buttonClick = false;
//Create array for asteroids
const asteroids = [];

const speed = 5;
let botSpeed = 7;

//Deafault positioning of the ship
function setDefaultPostion(){
    posX =  window.innerWidth / 2; 
    posY = window.innerHeight / 2;

    shipUser.style.left = posX + 'px';
    shipUser.style.top = posY + 'px';
}

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

setDefaultPostion();

//checking which key was pressed 
function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' | event.key === 'a') {
        keys.left = true;
        // Smoothly rotate the ship to the left (270 degrees)
        shipUser.style.transform = 'rotate(-90deg)';
    }
    if (event.key === 'ArrowRight' | event.key === 'd') {
        keys.right = true;
        // Smoothly rotate the ship to the right (90 degrees)
        shipUser.style.transform = 'rotate(90deg)';
    }
    if (event.key === 'ArrowUp' | event.key === 'w') {
        keys.up = true;
        // Smoothly rotate the ship upwards (0 degrees)
        shipUser.style.transform = 'rotate(0deg)';
    }
    if (event.key === 'ArrowDown' | event.key === 's') {
        keys.down = true;
        // Smoothly rotate the ship downward (180 degrees)
        shipUser.style.transform = 'rotate(180deg)';
    }
}

function handleKeyUp(event) {
    if (event.key === 'ArrowLeft' | event.key === 'a') {
        keys.left = false;
    }
    if (event.key === 'ArrowRight' | event.key === 'd') {
        keys.right = false;
    }
    if (event.key === 'ArrowUp' | event.key === 'w') {
        keys.up = false;
    }
    if (event.key === 'ArrowDown' | event.key === 's') {
        keys.down = false;
    }
}

//Updating User ship position
function moveUsership() {
    if (keys.left) {
        posX -= speed;
    } 
    if (keys.right) {
        posX += speed;
    } 
    if (keys.up) {
        posY -= speed; 
    } 
    if (keys.down) {
        posY += speed;
    }


    posX = Math.max(0, Math.min(window.innerWidth - 50, posX));
    posY = Math.max(0, Math.min(window.innerHeight - 100, posY));

    shipUser.style.left = posX + 'px';
    shipUser.style.top = posY + 'px';
}

function isColliding(rect1, rect2) {
    //Make ship borders smaller(make his borders smaller) 
    const rect1Inner = {
        left: rect1.left + (rect1.width * 0.5), 
        top: rect1.top + (rect1.height * 0.5),
        right: rect1.right - (rect1.width * 0.5),
        bottom: rect1.bottom - (rect1.height * 0.3)
    };

    //Check for collision
    return (
        rect1Inner.left < rect2.right &&
        rect1Inner.right > rect2.left &&
        rect1Inner.top < rect2.bottom &&
        rect1Inner.bottom > rect2.top
    );
}

function createAsteroids() {
        //Create asteroid, add a class and add to array
        const asteroid = document.createElement('div');
        asteroid.classList.add('asteroid');
        asteroidContainer.appendChild(asteroid);

        // Generate random position on one of the edges
        const edge = Math.floor(Math.random() * 4);
        let posXBot, posYBot;

        switch (edge) {
            case 0: // Top edge
                posXBot = Math.random() * window.innerWidth;
                posYBot = 0;
                break;
            case 1: // Right edge
                posXBot = window.innerWidth;
                posYBot = Math.random() * window.innerHeight;
                break;
            case 2: // Bottom edge
                posXBot = Math.random() * window.innerWidth;
                posYBot = window.innerHeight;
                break;
            case 3: // Left edge
                posXBot = 0;
                posYBot = Math.random() * window.innerHeight;
                break;
        }
        const rotationAngle = Math.random() * 360; // Random angle between 0 and 360 degrees
        asteroid.style.transform = `rotate(${rotationAngle}deg)`; // Apply the random rotation

        asteroid.style.left = posXBot + 'px';
        asteroid.style.top = posYBot + 'px';

        const dx = posX - posXBot;
        const dy = (posY+25) - posYBot;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const moveX = (dx / distance) * botSpeed;
        const moveY = (dy / distance) * botSpeed;
        rotationValue = Math.random() * 10 - 5;
        
        //Push asteroid with new variables 
        asteroids.push({ 
            asteroid,
            posXBot,
            posYBot,
            moveX,
            moveY,
            rotationAngle,
            rotationValue
        });
}

function moveBot() {
    asteroids.forEach((asteroidObj, index) => {
        // Asteroid movement 
        asteroidObj.posXBot += asteroidObj.moveX;
        asteroidObj.posYBot += asteroidObj.moveY;

        asteroidObj.asteroid.style.left = asteroidObj.posXBot + 'px';
        asteroidObj.asteroid.style.top = asteroidObj.posYBot + 'px';
        
        
        asteroidObj.rotationAngle += asteroidObj.rotationValue;

        // Apply the updated rotation to the asteroid
        asteroidObj.asteroid.style.transform = `rotate(${asteroidObj.rotationAngle}deg)`; 
        asteroidObj.asteroid.style.transition = 'transform 0.1s ease'; 
 
         // Check if the asteroid goes off-screen
        if (
            asteroidObj.posXBot < 0 || asteroidObj.posXBot > window.innerWidth || 
            asteroidObj.posYBot < 0 || asteroidObj.posYBot > window.innerHeight
        ) {
            asteroidObj.asteroid.remove();
            asteroids.splice(index, 1); // Remove the asteroid from the array
        }
    })
}

//Game loop it;s working unless variable isGameRunning = false
let isGameRunning = true;
function gameLoop() {

    //What happens when the game stops
    if (!isGameRunning){
        var teksty = document.getElementsByClassName('fade');
        Array.from(teksty).forEach(function(tekst) {
            tekst.classList.remove('hidden'); // Dodanie klasy 'ukryty' do każdego elementu
        });
        setDefaultPostion();
        keys.left = false;
        keys.right = false;
        keys.up = false;
        keys.down = false;
        return;
    }

    //Ship and asteroid movement
    moveUsership();
    moveBot();

    //Checking if asteroid collide with the user
    const usershipRect = shipUser.getBoundingClientRect();
    asteroids.forEach((asteroidObj, index) => {
        const asteroid = asteroidObj.asteroid;
        const asteroidRect = asteroid.getBoundingClientRect();

        // Sprawdzenie czy asteroida dotknela statek, jezeli tak to zakonczyc gre
        if (isColliding(usershipRect, asteroidRect)) {
            alert("Game Over")
            isGameRunning = false;

            //Usuniencie wszelkich procesow ktore dzialaja w czasie gry
            clearInterval(asteroidCreateInterval);
            if(z < i){
                z = i;
                bestScore.innerText = "Best score: " + z-1;
            }
            clearInterval(pointsInterval);
            botSpeed = 7;
            i = 0; //wyzerowanie timera
            asteroids.forEach(asteroidObj => {
                asteroidObj.asteroid.remove(); //Usuniencie wszystkich asteroid ktore sa na zapisane w tabeli po zakonczeniu kodu
            });
            setDefaultPostion();
            buttonClick = false;
        }
    });

    requestAnimationFrame(gameLoop);
}

function buttonClickAction(){
    if(!buttonClick){
        buttonClick = true;
        startGame();
    }
    var teksty = document.getElementsByClassName('fade');
    Array.from(teksty).forEach(function(tekst) {
        tekst.classList.add('hidden'); // Dodanie klasy 'ukryty' do każdego elementu
    });
}

// Start the game
function startGame(){
    isGameRunning = true;
    gameLoop();
    asteroidCreateInterval = setInterval(createAsteroids, 1000);
    pointsInterval = setInterval(() => {
        points.innerText = "Points: " + i++; // Update points every second
        if(i%5 == 0 && i>0){
            botSpeed += 1;
        }
    }, 1000);
}
