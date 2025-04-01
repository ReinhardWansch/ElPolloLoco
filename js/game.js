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
    // await loadStuff();
    await world.loadCharacter('./game/pepe.json');
    // world.draw(ctx);
    // world.applyGravity(world.gravity);
}

async function loadStuff() {
    await world.loadCharacter('./game/pepe.json');
    await world.loadEnemies();
    // await world.loadBottleTemplate('./game/bottle.json');
    // await world.loadEndboss('./game/polloLoco.json');
}
// function loadStuff() {
//     let characterLoaded = world.loadCharacter('./game/pepe.json');
//     let enemiesLoaded = world.loadEnemies();
//     let bottleTemplateLoaded = world.loadBottleTemplate('./game/bottle.json');
//     let endbossLoaded = world.loadEndboss('./game/polloLoco.json');
//     return Promise.all([characterLoaded, enemiesLoaded, bottleTemplateLoaded, endbossLoaded]);
// }

function logObjectTemplateChicken() {
    console.log(world.objectManager.objectTemplates['chicken']); ///DEBUG
}

function drawChickenFromEnemies() {
    let chicken= world.objectManager.enemies[0];
    ctx.drawImage(chicken.img, 0, 0, chicken.width, chicken.height);
}

function drawChickenFromTemplate() {
    let chickenTemplate= world.objectManager.objectTemplates['chicken'];
    ctx.drawImage(chickenTemplate.img, 0, 0, 100, chickenTemplate.height);
}

