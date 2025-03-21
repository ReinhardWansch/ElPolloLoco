let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");

let testObject = new MoveableObject("./img/4_enemie_boss_chicken/3_attack/G16.png", 200, 200);
testObject.loadAnimationImages('http://127.0.0.1:5500/game/testObject.json');

draw();

/*##########*/
/*## DRAW ##*/
/*##########*/

function draw() {
    clearCanvas(ctx);
    drawObject(testObject);
    requestAnimationFrame(draw);
}

function drawObjects(objects) {
    objects.forEach((object) => {
        drawObject(object);
    });
}

function drawObject(object) {
    object.draw(ctx);
}

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/*###########*/
/*## DEBUG ##*/
/*###########*/

async function tuEs() {
    testObject.moveRight();
    await wait(2000);
    testObject.stopMotion();
    await wait(500);
    testObject.moveLeft();
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}