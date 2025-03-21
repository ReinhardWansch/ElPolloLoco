let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");
let world = new World(ctx);
world.loadLevel('./game/level1.json');

function init() {
    world.draw(ctx);
}






/*###########*/
/*## DEBUG ##*/
/*###########*/

async function tuEs() {
    world.backgroundObjects[0].x -= 100;
    world.backgroundObjects[1].x -= 100;
    world.backgroundObjects[2].x -= 100;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}