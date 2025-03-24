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

    loadLevel(pathToJson) {
        return fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                this.loadBackgrounds(json);
                this.loadClouds(json);
                this.loadEnemies(json);
                this.leftBorder= json.leftBorderCameraX;
                this.rightBorder= json.rightBorderCameraX;
                this.groundY = json.groundY;
            });
    }

    loadBackgrounds(json) {
        json.backgrounds.forEach((backgroundObjectI) => {
            let newBackgroundObject = {
                loopsX: backgroundObjectI.loopsX,
                mob: new DrawableObject(backgroundObjectI.imagePath)
            }
            newBackgroundObject.mob.scaleToHeight(canvas.height);
            this.backgroundObjects.push(newBackgroundObject);
        });
    }

    loadClouds(json) {
        json.clouds.forEach((cloud) => {
            let cloudObject = new MoveableObject(cloud.imagePath);
            cloudObject.scaleToHeight(canvas.height);
            cloudObject.speedX = cloud.speedX;
            cloudObject.startMotionX();
            this.cloudObjects.push(cloudObject);
        });
    }

    //TODO: refactor loadEnemies, getEnemyObject
    //  - should only load enemies to array, spawning and "activating" could be done somewhere else
    async loadEnemies(json) {
        let loadingEnemiesPromises = [];
        json.enemies.forEach(async (enemy) => {
            let newEnemyObject= await this.getEnemyObject(enemy.pathToJson, enemy.speedX);
            newEnemyObject.x = enemy.spawnX;
            // newEnemyObject.speedX= enemy.speedX;
            // newEnemyObject.startMotionX();
            loadingEnemiesPromises.push(newEnemyObject);
            this.enemies.push(newEnemyObject);
        });
        return Promise.all(loadingEnemiesPromises);
    }

    //TODO: refactor loadEnemies, getEnemyObject
    //  - something like "start enemy" or "spawn enemy"
    async getEnemyObject(pathToJson, speedX) {
        let enemyObject;
        await fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                enemyObject = new MoveableObject(json.staticImagePath);
                enemyObject.loadAnimationImagesFromJson(json);
                enemyObject.setHitbox(json);
                enemyObject.scaleToHeight(json.height);
                enemyObject.groundY= this.groundY;
                enemyObject.speedX= speedX;
                enemyObject.startMotion();
                enemyObject.animate('walk');
                enemyObject.applyGravity(this.gravity);
            });
        return enemyObject;
    }

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
        this.drawObject(this.character);
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
    }

}