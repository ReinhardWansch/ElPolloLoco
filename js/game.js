let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");
let world = new World(ctx);

/*##########*/
/*## INIT ##*/
/*##########*/

async function init() {
    world.looseFunction = looseGame;
    world.winFunction = winGame;
    addMobileControlHandlers();
    await world.loadLevel('./game/level1.json');
    await world.loadCharacter('./game/pepe.json');
    await world.loadEnemies();
    await world.loadBottleTemplate('./game/bottle.json');
    await world.loadChickTemplate('./game/chick.json');
    world.loadCollectibles();
    await world.loadEndboss();
    world.loadSounds();
    hideElement('loadingCtn');
    document.getElementById('buttonStartGame').disabled = false;
}

function addMobileControlHandlers() {
    let rightButton = document.getElementById('mobileButtonRight');
    rightButton.addEventListener('touchstart', () => {
        world.keyboard.ArrowRight = true;
    });
    rightButton.addEventListener('touchend', () => {
        world.keyboard.ArrowRight = false;
    });
}

/*##########*/
/*## GAME ##*/
/*##########*/

function startGame() {
    hideElement('startScreenCtn');
    hideElement('looseScreenCtn');
    hideElement('winScreenCtn');
    world.isGameRunning = true;
    world.draw(ctx);
    world.applyGravity(world.gravity);
    startBackgroundMovement();
    startEnemyMovement();
}

function startBackgroundMovement() {
    world.backgrounds.forEach(backgroundI => {
        backgroundI.startMotion();
    });
}

function startEnemyMovement() {
    world.enemies.forEach(enemy => {
        enemy.startMotionX();
        enemy.animate('walk');
    });
}

function looseGame() {
    world.isGameRunning = false;
    world.endboss.stopActionLoop();
    showElement('looseScreenCtn');
}

function winGame() {
    world.isGameRunning = false;
    showElement('winScreenCtn');
}

async function restartGame() {
    world.cameraX = 0;
    world.character = null;
    world.enemies = [];
    world.bottles = [];
    world.chicks = [];
    world.endboss = null;
    await world.loadCharacter('./game/pepe.json');
    await world.loadEnemies();
    await world.loadEndboss();
    startGame();
}

/*#############*/
/*## UTILITY ##*/
/*#############*/

function hideElement(elementId) {
    document.getElementById(elementId).classList.add('d-none');
}

function showElement(elementId) {
    document.getElementById(elementId).classList.remove('d-none');
}

function enableButton(elemId) {
    document.getElementById(elemId).classList.remove('button-disabled');
}
