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
    leftBorder;
    rightBorder;

    constructor(ctx) {
        this.ctx = ctx;
        this.keyboard = new Keyboard();
    }

    /*#############*/
    /*## LOADING ##*/
    /*#############*/

    /*** Load Level ***/
    /******************/

    loadLevel(pathToJson) {
        return fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                this.groundY = json.groundY;
                this.leftBorder = json.leftBorderCameraX;
                this.rightBorder = json.rightBorderCameraX;
                return json.backgrounds;
            })
            .then(backgrounds => {
                console.log('creating background-objects'); ///DEBUG
                return this.createBackgroundObjects(backgrounds);
            });
    }

    createBackgroundObjects(backgrounds) {
        let allImagesReady = [];
        backgrounds.forEach((background) => {
            let mob = new MoveableObject(background.imagePath, 0, 0);
            console.log('creating Background, before Image ready, ', mob.toString()); ///DEBUG
            let imageReady = mob.decodeImage()
                .then(() => {
                    console.log('creating Background, making Image ready, ', mob.toString()); ///DEBUG
                    mob.scaleToHeight(this.ctx.canvas.height);
                    this.backgroundObjects.push({ mob: mob, loopsX: background.loopsX });
                });
            allImagesReady.push(imageReady);
        });
        return Promise.all(allImagesReady);
    }

    /*** Load Character ***/
    /**********************/

    loadCharacter(pathToJson) {
        return fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                this.character = new Character(json.staticImagePath, this.keyboard);
                this.character.setHitbox(json);
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

    draw() {
        if (this.keyboard.ArrowRight && this.cameraX >= this.rightBorder)
            this.cameraX -= this.character.speedX;
        if (this.keyboard.ArrowLeft && this.cameraX <= this.leftBorder)
            this.cameraX += this.character.speedX;
        this.clearCanvas();
        this.ctx.translate(this.cameraX, 0);
        this.drawBackgroundObjects();
        this.drawObjects(this.cloudObjects);
        this.drawObjects(this.enemies);
        this.ctx.translate(-this.cameraX, 0);
        // this.drawObject(this.character);
        // this.debugCheckCollision();
        window.requestAnimationFrame(() => this.draw(this.ctx));
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
        console.log('drawBackgroundObjects()    '); ///DEBUG
        this.backgroundObjects.forEach((backgroundObjectI) => {
            this.ctx.drawImage(
                backgroundObjectI.mob.img,
                -backgroundObjectI.mob.width + 1,
                backgroundObjectI.mob.y,
                backgroundObjectI.mob.width,
                backgroundObjectI.mob.height
            );
            for (let i = 0; i < backgroundObjectI.loopsX; i++) {
                this.ctx.drawImage(
                    backgroundObjectI.mob.img,
                    (backgroundObjectI.mob.x + i * backgroundObjectI.mob.width) - i * 2,
                    backgroundObjectI.mob.y,
                    backgroundObjectI.mob.width,
                    backgroundObjectI.mob.height
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
            decodePromises.push(backgroundObject.mob.img.decode());
        });
        return Promise.all(decodePromises);
    }

    /*##########*/
    /*## MISC ##*/
    /*##########*/

    applyGravity() {
        this.character.applyGravity(this.gravity);
        this.enemies.forEach((enemy) => enemy.applyGravity);
    }

    /*###########*/
    /*## DEBUG ##*/
    /*###########*/

    debugCheckCollision() {
        if (this.character.isCollision(this.enemies[1], -this.cameraX)) {
            console.log('hallo chicken');
        }
    }
}