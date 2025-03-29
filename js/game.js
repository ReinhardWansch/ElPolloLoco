//TODO: Start game with button
//TODO: Higher bottom of Pepe hitbox so he can jump over chickens

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
    await loadCharacterAndEnemiesAndBottleTemplate();
    world.draw(ctx);
    world.applyGravity(world.gravity);
}
// function tuEs() {
//     world.loadLevel('./game/level1.json')
//         .then(async () => { return await loadCharacterAndEnemiesAndBottleTemplate() })
//         .then(() => {
//             world.draw(ctx);
//             world.applyGravity(world.gravity);
//         });
// }

function tuEsBottle() {
    world.spawnBottle();
    world.bottles[0].animate('rotate');
    console.log(world.bottles[0].y) ///DEBUG
}

function loadCharacterAndEnemiesAndBottleTemplate() {
    let characterLoaded = world.loadCharacter('./game/pepe.json');
    let enemiesLoaded = world.loadEnemies();
    let bottleTemplateLoaded = world.loadBottleTemplate('./game/bottle.json');
    return Promise.all([characterLoaded, enemiesLoaded, bottleTemplateLoaded]);
}

function loadBottleTemplate() {
    world.loadBottleTemplate('./game/bottle.json');
}
