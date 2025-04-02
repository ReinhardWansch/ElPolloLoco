class World {
    ctx;
    keyboard;
    level;
    objectTemplates = [];
    backgrounds = [];
    character;
    enemies = [];
    bottles = [];
    bottleTemplate = {};
    endboss;
    gravity = 0.5;
    cameraX = 0;

    constructor(ctx) {
        this.ctx = ctx;
        this.keyboard = new Keyboard();
        this.keyboard.addKeyHandlerDown(' ', this.spawnBottle.bind(this));
    }

    /*#############*/
    /*## LOADING ##*/
    /*#############*/

    /*** Load Level ***/
    /******************/

    async loadLevel(pathToJson) {
        let res = await fetch(pathToJson);
        let json = await res.json();
        this.level = json;
        await this.loadBackgrounds();
    }

    /*** Load Backgrounds ***/
    /*******************/

    //TODO: start movement of background objects at another place
    async loadBackgrounds() {
        for (let json of this.level.backgrounds) {
            let newBackgroundObject = new BackgroundObject(json.imagePath, json.loopsX);
            await newBackgroundObject.decodeImage();
            newBackgroundObject.setSizeFromImage();
            newBackgroundObject.scaleToHeight(this.ctx.canvas.height);
            if (json.speedX) newBackgroundObject.speedX = json.speedX;
            this.backgrounds.push(newBackgroundObject);
        }
    }

    /*** Load Character ***/
    /**********************/

    async loadCharacter(pathToJson) {
        let json = await fetch(pathToJson).then(response => response.json());
        this.character = new Character(json.staticImagePath, this.keyboard);
        await this.character.decodeImage();
        await this.character.setSizeFromImage();
        await this.character.loadAnimationImagesFromJson(json);
        await this.character.decodeImagesAll();
        this.character.setHitbox(json);
        this.character.scaleToHeight(json.height);
        this.character.x = json.positionX;
        this.character.speedX = json.speedX;
        this.character.keyboard.addKeyHandlerDown('ArrowUp', () => this.character.jump());
        this.character.groundY = this.level.groundY;
        this.character.jumpSpeed = json.jumpSpeed;
    }



    /*** Load Enemies ***/
    /********************/

    async loadEnemies() {
        for (let json of this.level.enemies) {
            if (!this.objectTemplates[json.type]) {
                let enemyJson = await fetch(json.pathToJson).then(response => response.json());
                let templateObject = new MoveableObject(enemyJson.staticImagePath);
                await templateObject.decodeImage();
                templateObject.setSizeFromImage();
                templateObject.scaleToHeight(enemyJson.height);
                templateObject.loadAnimationImagesFromJson(enemyJson);
                await templateObject.decodeImagesAll();
                templateObject.setHitbox(enemyJson);
                this.objectTemplates[json.type] = templateObject;
            }
            let newEnemy= Object.create(this.objectTemplates[json.type]);
            newEnemy.x = json.spawnX;
            newEnemy.y = json.spawnY;
            newEnemy.speedX = json.speedX;
            newEnemy.groundY = this.level.groundY;
            this.enemies.push(newEnemy);
        }
    }

    // async loadEnemies() {
    //     for (let json of this.level.enemies) {
    //         let newEnemy = new MoveableObject(json.pathToJson);
    //         let enemyJson= await fetch(json.pathToJson).then(response => response.json());
    //         let img = new Image();
    //         img.src = enemyJson.staticImagePath;
    //         newEnemy.img = img;
    //         await newEnemy.decodeImage();
    //         newEnemy.setSizeFromImage();
    //         newEnemy.scaleToHeight(enemyJson.height);
    //         await newEnemy.loadAnimationImagesFromJson(enemyJson);
    //         newEnemy.setHitbox(enemyJson);
    //         newEnemy.x = json.spawnX;
    //         newEnemy.y = json.spawnY;
    //         newEnemy.speedX = json.speedX;
    //         newEnemy.groundY = this.level.groundY;
    //         this.enemies.push(newEnemy);
    //     }
    // }

    /*** Load Endboss ***/
    /********************/

    async loadEndboss(pathToJson) {
        let json = await fetch(pathToJson).then(response => response.json());
        this.endboss = new Endboss(json.staticImagePath);
        await this.endboss.setSizeFromImage();
        await this.endboss.loadAnimationImagesFromJson(json);
        this.endboss.setHitbox(json);
        this.endboss.scaleToHeight(json.height);
        this.endboss.x = json.positionX;
        this.endboss.speedX = json.speedX;
        this.endboss.groundY = json.groundY;
        this.endboss.applyGravity(this.gravity);
        return this.endboss.decodeImagesAll();
    }

    /*** loadBottles ***/
    /*******************/

    //TODO: refactor with Object.asign(..)
    async loadBottleTemplate(pathToJson) {
        let bottleJson = await fetch(pathToJson).then(res => res.json());
        let bottleTemp = new MoveableObject(bottleJson.staticImagePath);
        await bottleTemp.loadAnimationImagesFromJson(bottleJson);
        this.bottleTemplate.img = await bottleTemp.decodeImage().then(() => { return bottleTemp.img });
        this.bottleTemplate.height = bottleJson.height;
        this.bottleTemplate.characterOffsetX = bottleJson.characterOffsetX;
        this.bottleTemplate.characterOffsetY = bottleJson.characterOffsetY;
        this.bottleTemplate.speedX = bottleJson.speedX;
        this.bottleTemplate.speedY = bottleJson.speedY;
        this.bottleTemplate.hitbox = bottleJson.hitbox;
        this.bottleTemplate.animationImages = bottleTemp.animationImages;
    }

    /*##########*/
    /*## DRAW ##*/
    /*##########*/

    draw() {
        if (this.keyboard.ArrowRight && this.cameraX >= this.level.rightBorderCameraX)
            this.cameraX -= this.character.speedX;
        if (this.keyboard.ArrowLeft && this.cameraX <= this.level.leftBorderCameraX)
            this.cameraX += this.character.speedX;
        this.clearCanvas();
        this.ctx.translate(this.cameraX, 0); //move Camera
        this.drawBackgrounds();
        // this.drawBottles();
        this.drawEnemies();
        // this.drawEndboss();
        this.ctx.translate(-this.cameraX, 0); //move Camera back
        this.drawCharacter();
        this.checkCharacterCollision();
        // this.checkBottleCollision();
        // this.checkBottleStatus();
        window.requestAnimationFrame(() => this.draw(this.ctx));
    }

    drawCharacter() {
        this.drawObject(this.character);
    }

    drawBackgrounds() {
        this.drawObjects(this.backgrounds);
    }

    drawEnemies() {
        this.drawObjects(this.enemies);
    }

    drawEndboss() {
        this.drawObject(this.endboss);
    }

    drawBottles() {
        this.drawObjects(this.bottles);
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

    /*##########*/
    /*## MISC ##*/
    /*##########*/

    applyGravity() {
        this.character.applyGravity(this.gravity);
        this.enemies.forEach((enemy) => enemy.applyGravity(this.gravity));
    }

    checkCharacterCollision() {
        this.enemies.forEach((enemy) => {
            if (this.character.isCollision(enemy, -this.cameraX)) {
                if (this.character.currentAnimationName != 'hurt')
                    this.character.animate('hurt', 5);
            }
        });
    }

    checkBottleCollision() {
        this.bottles.forEach((bottle) => {
            this.objectManager.enemies.forEach((enemy) => {
                if (bottle.isCollision(enemy)) {
                    this.bottles.splice(this.bottles.indexOf(bottle), 1);
                    if (bottle.isCausingDemage) {
                        enemy.stopMotion();
                        enemy.animate('die');
                        window.setTimeout(() => { this.objectManager.enemies.splice(this.objectManager.enemies.indexOf(enemy), 1) }, 250);
                    }
                }
            });
        });
    }

    //TODO.refactor with Object.assign(..)
    spawnBottle() {
        let newBottle = new Bottle('');
        newBottle.airborne = true;
        newBottle.img = this.bottleTemplate.img;
        newBottle.ratio = this.bottleTemplate.img.width / this.bottleTemplate.img.height;
        newBottle.scaleToHeight(this.bottleTemplate.height);
        newBottle.x = -this.cameraX + this.character.x + this.bottleTemplate.characterOffsetX;
        newBottle.y = this.character.y + this.bottleTemplate.characterOffsetY;
        newBottle.speedX = this.bottleTemplate.speedX;
        if (this.keyboard.ArrowRight || this.keyboard.ArrowLeft) {
            newBottle.speedX += this.character.speedX * 0.75;
        }
        if (this.character.isFlippedHorizontally) newBottle.speedX *= -1;
        newBottle.speedY = this.bottleTemplate.speedY;
        newBottle.hitbox = this.bottleTemplate.hitbox;
        newBottle.groundY = this.level.groundY;
        newBottle.animationImages = this.bottleTemplate.animationImages;
        newBottle.startMotion();
        // newBottle.animate('rotate');
        newBottle.applyGravity(this.gravity);
        this.bottles.push(newBottle);
    }

    checkBottleStatus() {
        this.bottles.forEach((bottle) => {
            if (bottle.isDestroyed) {
                this.bottles.splice(this.bottles.indexOf(bottle), 1);
            }
        });
    }
}