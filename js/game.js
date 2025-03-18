let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");




/*##########*/
/*## DRAW ##*/
/*##########*/

function drawObjects(objects) {
    objects.forEach((object) => {
        drawObject(object);
    });
}

function drawObject(object) {
    object.draw(ctx);
}