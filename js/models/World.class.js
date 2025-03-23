class World {
    ctx;
    character;
    enemies = [];
    backgroundObjects = [];
    cloudObjects = [];
    keyboard;
    gravity = 0.5;
    groundY;
    cameraX = 0;

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
                    let cloudObject = new MoveableObject(cloud.imagePath);
                    cloudObject.scaleToHeight(canvas.height);
                    cloudObject.speedX = cloud.speedX;
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
                this.character.x = json.positionX;
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
        if (this.keyboard.ArrowRight) this.cameraX -= this.character.speedX;
        if (this.keyboard.ArrowLeft) this.cameraX += this.character.speedX;
        this.clearCanvas();
        ctx.translate(this.cameraX, 0);
        // this.drawObjects(this.backgroundObjects);
        this.drawBackgroundObjects();
        this.drawObjects(this.cloudObjects);
        ctx.translate(-this.cameraX, 0);
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

    drawBackgroundObjects() {
        this.backgroundObjects.forEach((backgroundObject) => {
            for (let i = 0; i < 3; i++) {
                this.ctx.drawImage(
                    backgroundObject.img,
                    (backgroundObject.x + i * backgroundObject.width) -i*2,
                    backgroundObject.y,
                    backgroundObject.width,
                    backgroundObject.height
                );
            }
        });
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