let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");

// let testObject = new MoveableObject("./img/4_enemie_boss_chicken/3_attack/G16.png", 200, 200);
// testObject.loadAnimationImages('http://127.0.0.1:5500/game/testObject.json');

let chick= new MoveableObject('./img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
chick.loadAnimationImages('http://127.0.0.1:5500/game/chick.json');

draw();

/*##########*/
/*## DRAW ##*/
/*##########*/

function draw() {
    clearCanvas(ctx);
    drawObject(chick);
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
    
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}