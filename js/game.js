let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");

let testObject = new DrawableObject("./img/4_enemie_boss_chicken/3_attack/G16.png", 100, 100);
draw();



/*##########*/
/*## DRAW ##*/
/*##########*/

function draw() {
    console.log('draw()'); ///DEBUG
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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


/*###########*/
/*## DEBUG ##*/
/*###########*/
