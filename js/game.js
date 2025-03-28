//TODO: refactor all constructors!
//TODO: Start game with button

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

function tuEs() {
    world.loadLevel('./game/level1.json')
        .then(loadCharacterAndEnemiesAndBottleTemplate)
        .then((prom)=> {
            world.draw(ctx);
            world.applyGravity(world.gravity);
        });
}

function tuEsBottle() {
    world.spawnBottle();
    world.bottles[0].animate('rotate');
    console.log(world.bottles[0].y) ///DEBUG
}

function loadCharacterAndEnemiesAndBottleTemplate() {
    let characterLoaded= world.loadCharacter('./game/pepe.json');
    let enemiesLoaded= world.loadEnemies();
    let bottleTemplateLoaded= world.loadBottleTemplate('./game/bottle.json');
    return Promise.all([characterLoaded, enemiesLoaded, bottleTemplateLoaded]);
}

function loadBottleTemplate() {
    world.loadBottleTemplate('./game/bottle.json');
}
