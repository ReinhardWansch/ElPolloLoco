class World {
    ctx;
    level;
    character;
    enemies = [];
    endboss;
    backgroundObjects = [];
    cloudObjects = [];
    bottles = [];
    bottleTemplate = {};
    keyboard;
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
        let res= await fetch(pathToJson);
        let json = await res.json();
        this.level = json;
        await this.createBackgroundObjects();
        await this.createCloudObjects();
    }

    /*** Backgrounds ***/
    /*******************/

    createBackgroundObjects() {
        return this.addRepetitiveObjectsAll(this.level.backgrounds, this.backgroundObjects);
    }

    /*** Clouds ***/
    /**************/

    async createCloudObjects() {
        await this.addRepetitiveObjectsAll(this.level.clouds, this.cloudObjects);
        this.cloudObjects.forEach((cloud) => {
            cloud.mob.startMotion();
        });
    }

    /*** Add Objects ***/
    /*******************/

    async addRepetitiveObjectsAll(objectDescriptions, objects) {
        objectDescriptions.forEach(async (descriptionI) => {
            await this.addRepetitiveObject(descriptionI, objects);
        });
    }

    async addRepetitiveObject(objectDescription, objects) {
        let mob = new MoveableObject(objectDescription.imagePath);
        await mob.setSizeFromImage().then(() => {
            mob.scaleToHeight(this.ctx.canvas.height);
            if (objectDescription.speedX) mob.speedX = objectDescription.speedX;
            objects.push({ mob: mob, loopsX: objectDescription.loopsX });
        });
    }

    /*** Load Character ***/
    /**********************/

    async loadCharacter(pathToJson) {
        let json = await fetch(pathToJson).then(response => response.json());
        this.character = new Character(json.staticImagePath, this.keyboard);
        await this.character.setSizeFromImage();
        await this.character.loadAnimationImagesFromJson(json);
        this.character.setHitbox(json);
        this.character.scaleToHeight(json.height);
        this.character.x = json.positionX;
        this.character.speedX = json.speedX;
        this.character.keyboard.addKeyHandlerDown('ArrowUp', () => this.character.jump());
        this.character.groundY = this.level.groundY;
        this.character.jumpSpeed = json.jumpSpeed;
        return this.character.decodeImagesAll();
    }

    /*** Load Enemies ***/
    /********************/

    loadEnemies() {
        let enemiesReady = [];
        this.level.enemies.forEach((enemyDescription) => {
            let enemyReady = this.loadEnemy(enemyDescription);
            enemiesReady.push(enemyReady);
        });
        return Promise.all(enemiesReady);
    }

    async loadEnemy(enemyDescription) {
        let enemyJson = await fetch(enemyDescription.pathToJson).then(response => response.json());
        let enemy = new MoveableObject(enemyJson.staticImagePath);
        await enemy.setSizeFromImage();
        enemy.loadAnimationImagesFromJson(enemyJson);
        enemy.setHitbox(enemyJson);
        enemy.scaleToHeight(enemyJson.height);
        enemy.x = enemyDescription.spawnX;
        enemy.y = enemyDescription.spawnY;
        enemy.groundY = this.level.groundY;
        // enemy.speedX = Math.random() * -3 + -1;
        enemy.speedX = enemyDescription.speedX;
        enemy.startMotion();
        enemy.animate('walk');
        this.enemies.push(enemy);
    }

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
        this.drawBackgroundObjects();
        this.drawCloudObjects();
        this.drawBottles();
        this.drawEnemies();
        this.drawEndboss();
        this.ctx.translate(-this.cameraX, 0); //move Camera back
        this.drawCharacter();
        this.checkCharacterCollision();
        this.checkBottleCollision();
        this.checkBottleStatus();
        window.requestAnimationFrame(() => this.draw(this.ctx));
    }

    drawCharacter() {
        this.drawObject(this.character);
    }

    drawBackgroundObjects() {
        this.drawRepetitiveObjects(this.backgroundObjects);
    }

    drawCloudObjects() {
        this.drawRepetitiveObjects(this.cloudObjects);
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

    drawRepetitiveObjects(objects) {
        objects.forEach((objectI) => {
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
            this.enemies.forEach((enemy)=>{
                if (bottle.isCollision(enemy)) {
                    this.bottles.splice(this.bottles.indexOf(bottle), 1);
                    if (bottle.isCausingDemage) {
                        enemy.stopMotion();
                        enemy.animate('die');
                        window.setTimeout(() => {this.enemies.splice(this.enemies.indexOf(enemy),1)}, 250);
                    }
                }
            });
        });
    }

    //TODO.refactor with Object.assign(..)
    spawnBottle() {
        console.log('spawnBottle'); ///DEBUG
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