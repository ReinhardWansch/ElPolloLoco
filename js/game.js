let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");

let testObject = new AnimatedOject("./img/4_enemie_boss_chicken/3_attack/G16.png", 200, 200);

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

function tuEs() {
    testObject.x= 200;
    testObject.y= 150;
    testObject.flipHorizontally();
    testObject.rotationAngle= 45;
}