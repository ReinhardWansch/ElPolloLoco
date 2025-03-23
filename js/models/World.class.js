class World {
    ctx;
    character;
    enemies = [];
    backgroundObjects = [];
    // keyboard;
    gravity = 0.1;
    grouxndY;

    constructor(ctx) {
        this.ctx = ctx;
        // this.keyboard = new Keyboard();
    }

    /*#############*/
    /*## LOADING ##*/
    /*#############*/

    loadLevel(pathToJson) {
        return fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                json.backgroundImagePaths.forEach((path) => {
                    let backgroundObject = new DrawableObject(path);
                    backgroundObject.scaleToHeight(canvas.height);
                    this.backgroundObjects.push(backgroundObject);
                });
                this.groundY = json.groundY;
            });
    }

    loadCharacter(pathToJson) {
        return fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                this.character = new MoveableObject(json.staticImagePath);
                this.character.scaleToHeight(json.height);
            }, reason => {
                console.log('loading character rejected: ' + reason);
            })
            .catch((reason) => {
                console.log('error while loading character: ' + reason);
            });
    }

    /*##########*/
    /*## DRAW ##*/
    /*##########*/

    draw(ctx) {
        this.clearCanvas();
        this.drawObjects(this.backgroundObjects);
        this.drawObject(this.character);
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

    decodeBackgroundImages() {
        let decodePromises = [];
        this.backgroundObjects.forEach((backgroundObject) => {
            decodePromises.push(backgroundObject.img.decode());
        });
        return Promise.all(decodePromises);
    }

    /*##########*/
    /*## MISC ##*/
    /*##########*/

    applyGravity() {
        this.character.applyGravity(this.gravity, this.groundY);
    }

}