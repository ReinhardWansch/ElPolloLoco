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
        .then(world.drawBackgroundObjects.bind(world));
}

function logLoadLevel() {
    console.log(world.loadLevel("game/level1.json").then(()=>console.log('FERTIG')));
}

function logBackgroundObjects() {
    world.backgroundObjects.forEach((backgroundObject) => {
        console.log(backgroundObject.mob.toString());
    });
}

