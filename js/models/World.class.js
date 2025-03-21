class World {
    ctx;
    character;
    enemies = [];
    backgroundObjects = [];
    // keyboard;
    floorHeight;

    constructor(ctx) {
        this.ctx = ctx;
        // this.keyboard = new Keyboard();
    }

    /*#############*/
    /*## LOADING ##*/
    /*#############*/

    loadLevel(pathToJson) {
        fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                json.backgroundImagePaths.forEach((path) => {
                    let backgroundObject= new DrawableObject(path);
                    backgroundObject.scaleToHeight(canvas.height);
                    this.backgroundObjects.push(backgroundObject);
                });
            });
    }

    /*##########*/
    /*## DRAW ##*/
    /*##########*/

    draw(ctx) {
        this.clearCanvas();
        this.drawObjects(this.backgroundObjects);
        window.requestAnimationFrame(() => this.draw(ctx));
    }

    drawObjects(objects) {
        objects.forEach((object) => {
            this.drawObject(object);
        });
    }

    drawObject(object) {
        object.draw(this.ctx);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

}