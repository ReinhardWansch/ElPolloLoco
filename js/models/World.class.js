class World {
    ctx;
    character;
    enemies = [];
    backgroundObjects = [];
    cloudObjects = [];
    keyboard;
    gravity = 0.5;
    groundY;

    constructor(ctx) {
        this.ctx = ctx;
        this.keyboard = new Keyboard();
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
                json.clouds.forEach((cloud) => {
                    let cloudObject= new MoveableObject(cloud.imagePath);
                    cloudObject.scaleToHeight(canvas.height);
                    cloudObject.speedX= cloud.speedX;
                    cloudObject.startMotionX();
                    this.cloudObjects.push(cloudObject);
                });
                this.groundY = json.groundY;
            });
    }

    loadCharacter(pathToJson) {
        return fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                this.character = new Character(json.staticImagePath, this.keyboard);
                this.character.scaleToHeight(json.height);
                this.character.speedX = json.speedX;
                this.character.keyboard.addKeyHandlerDown('ArrowUp', () => this.character.jump());
                this.character.groundY = this.groundY;
                this.character.jumpSpeed = json.jumpSpeed;
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
        this.drawObjects(this.cloudObjects);
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
        this.character.applyGravity(this.gravity);
    }

}