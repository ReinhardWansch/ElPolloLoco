let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");

let testObject = new DrawableObject("./img/4_enemie_boss_chicken/3_attack/G16.png", 200, 200);
let testObject2 = new DrawableObject("./spielwiese/mauer-720x480.jpg", 720, 480);
// draw();
testObject.x = 250;
testObject.y = 130;

/*##########*/
/*## DRAW ##*/
/*##########*/

function draw() {
    // console.log('draw()'); ///DEBUG
    // clearCanvas(ctx);
    drawObject(testObject);
    // requestAnimationFrame(draw);
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

function tuEs() {
    testObject.draw(ctx);
    testObject.drawFlippedHorizontally(ctx);
    testObject.x=10;
    testObject.draw(ctx);
    testObject.drawFlippedHorizontally(ctx);
    testObject.x=500;
    testObject.draw(ctx);
    testObject.drawRotated(ctx, 180);
    testObject.x=0;
    testObject.y=0;
    testObject.draw(ctx);
    testObject.drawRotated(ctx, 180);
}