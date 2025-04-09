//TODO: Endboss hurts Character
//TODO: Collect bottles
//TODO: Design Page
//TODO: Frage: Warum ist das Container-Div-Element höher als das Canvas-Element?
//TODO: Favicon

let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");
let world = new World(ctx);
let isGameRunning = false;

async function init() {
    world.looseFunction = looseGame;
    world.winFunction = winGame;
    // await world.loadLevel('./game/level1.json');
    await world.loadLevel('./game/level0.json');
    await world.loadCharacter('./game/pepe.json');
    await world.loadEnemies();
    await world.loadBottleTemplate('./game/bottle.json');
    world.loadCollectibles();
    await world.loadEndboss('./game/polloLoco.json');
    hideElement('loadingCtn');
    document.getElementById('buttonStartGame').disabled= false;
}

function startGame() {
    hideElement('startScreenCtn');
    world.isGameRunning = true;
    world.draw(ctx);
    world.applyGravity(world.gravity);
    startBackgroundMovement();
    startEnemyMovement();
    isGameRunning = true;
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


/*###########*/
/*## DEBUG ##*/
/*###########*/

function tuEs() {
    let x= new Statusvalue('bottleValue');
    x.decrease();
}
