document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);


const tankBot = document.getElementById('tankBot');
const tankUser = document.getElementById('tank');

const gameField = document.getElementById('gameField');

// Initial X and Y position
let posX; 
let posY;

let posXBot;
let posYBot; 

const speed = 5;
const botSpeed = 1;
let rotateTank = 0;
let rotateTankBot = 0;

const gameFieldReact = gameField.getBoundingClientRect();

function setDefaultPostion(){
    posX =  gameFieldReact.left + gameFieldReact.width / 2; 
    posY = gameFieldReact.top + gameFieldReact.height / 2;
    console.log(posX + " " + posY)

    posXBot = gameField.right / 2 - 25;
    posYBot = gameField.left / 2 - 300; 

    tankBot.style.left = posXBot + 'px';
    tankBot.style.top = posYBot + 'px';

    tankUser.style.left = posX + 'px';
    tankUser.style.top = posY + 'px';
}

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

setDefaultPostion();
function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' | event.key === 'a') {
        keys.left = true;
    }
    if (event.key === 'ArrowRight' | event.key === 'd') {
        keys.right = true;
    }
    if (event.key === 'ArrowUp' | event.key === 'w') {
        keys.up = true;
    }
    if (event.key === 'ArrowDown' | event.key === 's') {
        keys.down = true;
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

function moveUserTank() {
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


    //nie dziala
    posX = Math.max(gameFieldReact.left, Math.min(gameFieldReact.right - 50, posX));
    posY = Math.max(gameFieldReact.top, Math.min(gameFieldReact.bottom - 200, posY));

    tankUser.style.left = posX + 'px';
    tankUser.style.top = posY + 'px';
}



function isColliding(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

function moveBot() {
    // Calculate direction towards the user's tank
    const dx = posX - posXBot;
    const dy = posY - posYBot;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction (move in the direction of the user tank)
    const moveX = dx / distance * botSpeed;
    const moveY = dy / distance * botSpeed;

    // Move the bot toward the user tank
    posXBot += moveX;
    posYBot += moveY;

    // Update the bot's position
    tankBot.style.left = posXBot + 'px';
    tankBot.style.top = posYBot + 'px';
}

let isGameRunning = true;
function gameLoop() {
    if (!isGameRunning){
        document.getElementById("mainDiv").classList.remove("fadeOut");
        document.getElementById("header").classList.remove("fadeOut");
        document.getElementById("gameInfo").classList.remove("fadeOut");
        setDefaultPostion();
        keys.left = false;
        keys.right = false;
        keys.up = false;
        keys.down = false;
        return;
    }

    moveUserTank();
    moveBot();

    const userTankRect = tankUser.getBoundingClientRect();
    const botTankRect = tankBot.getBoundingClientRect();

    if (isColliding(userTankRect, botTankRect)) {
        // alert("You lost, try again.")
        // isGameRunning = false;
        console.log("Dodtkely sie")
    }

    requestAnimationFrame(gameLoop);
}

// Start the game
function startGame(){
    isGameRunning = true;
    gameLoop();
    document.getElementById("mainDiv").classList.add("fadeOut");
    document.getElementById("header").classList.add("fadeOut");
    document.getElementById("gameInfo").classList.add("fadeOut");
}