//TODO: Design Page
//TODO: Dead Chickens can hurt Pepe

let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");
let world = new World(ctx);


function start() {
    world.draw(ctx);
    world.applyGravity();
}


/*###########*/
/*## DEBUG ##*/
/*###########*/

async function tuEs() {
    await world.loadLevel('./game/level1.json');
    await loadStuff();
    world.draw(ctx);
    world.applyGravity(world.gravity);
}

async function loadStuff() {
    await world.loadCharacter('./game/pepe.json');
    await world.loadEnemies();
    // await world.loadBottleTemplate('./game/bottle.json');
    // await world.loadEndboss('./game/polloLoco.json');
}

function startEnemyMovement() {
    world.enemies.forEach(enemy => {
        enemy.startMotionX();
    });
}





