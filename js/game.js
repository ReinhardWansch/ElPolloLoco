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
    world.loadLevel("game/level1.json")
        .then(world.createBackgroundObjects.bind(world))
        .then(world.createCloudObjects.bind(world))
        .then(world.drawBackgroundObjects.bind(world))
        .then(world.drawCloudObjects.bind(world));
}

function logStuff() {
    console.log(world.backgroundObjects);
    console.log(world.cloudObjects);
}

