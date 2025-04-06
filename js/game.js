//TODO: Design Page
//TODO: Move Clouds
//TODO: Frage: Warum ist das Container-Div-Element höher als das Canvas-Element?
//TODO: Favicon

let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");
let world = new World(ctx);

async function init() {
    await world.loadLevel('./game/level1.json');
    await world.loadCharacter('./game/pepe.json');
    await world.loadEnemies();
    await world.loadBottleTemplate('./game/bottle.json');
    await world.loadEndboss('./game/polloLoco.json');
    hideElement('loadingCtn');
    document.getElementById('buttonStartGame').disabled= false;
}

function startGame() {
    hideElement('startScreenCtn');
    world.draw(ctx);
    world.applyGravity(world.gravity);
    startEnemyMovement();
}

function startEnemyMovement() {
    world.enemies.forEach(enemy => {
        enemy.startMotionX();
        enemy.animate('walk');
    });
}

function hideElement(elementId) {
    document.getElementById(elementId).classList.add('d-none');
}


/*###########*/
/*## DEBUG ##*/
/*###########*/

async function tuEs() {
    await world.loadLevel('./game/level1.json');
    await loadStuff();
    world.draw(ctx);
    world.applyGravity(world.gravity);
    startEnemyMovement();
}

async function loadStuff() {
    await world.loadCharacter('./game/pepe.json');
    await world.loadEnemies();
    await world.loadBottleTemplate('./game/bottle.json');
    await world.loadEndboss('./game/polloLoco.json');
}

// let x= new Statusbar('healthbar');
async function tuEs2() {
    await x.loadImagePaths('./game/healthbar.json');
}
