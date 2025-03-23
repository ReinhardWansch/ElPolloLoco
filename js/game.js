let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");
let world = new World(ctx);
let levelLoaded = world.loadLevel('./game/level1.json'). then(() => {
        world.decodeBackgroundImages();
    });
let characterLoaded = world.loadCharacter('./game/pepe.json').then(() => {
        world.character.loadAnimationImages('./game/pepe.json');
    });
let loadings = [
    levelLoaded,
    characterLoaded,
]

function init() {
    Promise.all(loadings).then(() => {
        world.draw(ctx);
        world.applyGravity();
    });
}






/*###########*/
/*## DEBUG ##*/
/*###########*/

function tuEs() {
    world.character.y -= 1;
    world.character.speedY = -5;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logObject(object) {
    console.log(object);
}