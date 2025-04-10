//TODO: Design Level1
//TODO: Design Page
//TODO: Sounds
//TODO: Frage: Warum ist das Container-Div-Element höher als das Canvas-Element?
//TODO: Favicon

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
    await world.loadEndboss('./game/polloLoco.json');
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
    showElement('looseScreenCtn');
}

function winGame() {
    world.isGameRunning = false;
    showElement('winScreenCtn');
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


/*###########*/
/*## DEBUG ##*/
/*###########*/

// let testCanvas = document.getElementById("testCanvasElem");
// let testCtx = testCanvas.getContext("2d");
function tuEs() {
    let rightButton = document.getElementById('mobileButtonRight');
    console.log(rightButton); ///DEBUG
    rightButton.addEventListener('keydown', () => {
        console.log('ich werde gedrückt, rechts'); ///DEBUG
        world.keyboard.ArrowRight = true;
    });
    rightButton.addEventListener('touchend', () => {
        world.character.keyboard.ArrowRight = false;
    });
}

function tuEs2() {
    let rightButton = document.getElementById('mobileButtonRight');
    rightButton.addEventListener('touchstart', () => {
        console.log('Right button touched'); // DEBUG
        world.keyboard.ArrowRight = true;
    });
    rightButton.addEventListener('touchend', () => {
        console.log('Right button touch ended'); // DEBUG
        world.keyboard.ArrowRight = false;
    });
}
