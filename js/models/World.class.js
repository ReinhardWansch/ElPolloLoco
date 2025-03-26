class World {
    ctx;
    level;
    character;
    enemies= [];
    backgroundObjects = [];
    cloudObjects = [];
    keyboard;
    gravity = 0.5;
    cameraX = 0;

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
            .then(json => this.level= json);
    }

    /*** Backgrounds ***/
    /*******************/

    createBackgroundObjects() {
        let allImagesReady = [];
        this.level.backgrounds.forEach((background) => {
            let imageReady = this.createBackgroundObject(background);
            allImagesReady.push(imageReady);
        });
        return Promise.all(allImagesReady);
    }

    createBackgroundObject(background) {
        let mob = new MoveableObject(background.imagePath, 0, 0);
        let imageReady = mob.decodeImage().then(() => {
            mob.scaleToHeight(this.ctx.canvas.height);
            this.backgroundObjects.push({ mob: mob, loopsX: background.loopsX });
        });
        return imageReady;
    }

    /*** Clouds ***/
    /**************/

    createCloudObjects() {
        let allImagesReady = [];
        this.level.clouds.forEach((cloud) => {
            let mob= new MoveableObject(cloud.imagePath);
            let imageReady = mob.decodeImage().then(() => {
                mob.scaleToHeight(this.ctx.canvas.height);
                mob.speedX = cloud.speedX;
                this.cloudObjects.push({mob: mob, loopsX: cloud.loopsX});
            });
            allImagesReady.push(imageReady);
        });
        console.log(allImagesReady); ///DEBUG
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
                this.character.groundY = this.level.groundY;
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
        if (this.keyboard.ArrowRight && this.cameraX >= this.level.rightBorder)
            this.cameraX -= this.character.speedX;
        if (this.keyboard.ArrowLeft && this.cameraX <= this.level.leftBorder)
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

    drawBackgroundObjects() {
        console.log('World.drawBackgroundObjects()'); ///DEBUG
        this.drawRepetitiveObjects(this.backgroundObjects);
    }

    drawCloudObjects() {
        console.log('World.drawCloudObjects()'); ///DEBUG
        this.drawRepetitiveObjects(this.cloudObjects);
    }

    drawObjects(objects) {
        objects.forEach((object) => {
            this.drawObject(object);
        });
    }

    drawObject(object) {
        object.draw(this.ctx);
    }

    drawRepetitiveObjects(objects) {
        objects.forEach((objectI) => {
            console.log(objectI.mob); ///DEBUG
            this.ctx.drawImage(
                objectI.mob.img,
                -objectI.mob.width + 1,
                objectI.mob.y,
                objectI.mob.width,
                objectI.mob.height
            );
            for (let i = 0; i < objectI.loopsX; i++) {
                this.ctx.drawImage(
                    objectI.mob.img,
                    (objectI.mob.x + i * objectI.mob.width) - i * 2,
                    objectI.mob.y,
                    objectI.mob.width,
                    objectI.mob.height
                );
            }
        });
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
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