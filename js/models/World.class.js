class World {
    ctx;
    keyboard;
    level;
    objectTemplates = [];
    backgrounds = [];
    character;
    enemies = [];
    bottles = [];
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
        this.character.scaleToHeight(json.height);
        this.character.x = json.positionX;
        this.character.setHitbox(json);
        this.character.speedX = json.speedX;
        this.character.jumpSpeed = json.jumpSpeed;
        this.character.keyboard.addKeyHandlerDown('ArrowUp', () => this.character.jump());
        this.character.groundY = this.level.groundY;
        this.character.healthbar = new Statusbar(json.healthbarId, './game/healthbar.json');
    }



    /*** Load Enemies ***/
    /********************/

    async loadEnemies() {
        for (let json of this.level.enemies) {
            if (!this.objectTemplates[json.type]) {
                await this.createTemplateObject(json);
            }
            this.spawnEnemy(json);
        }
    }

    async createTemplateObject(json) {
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

    spawnEnemy(json) {
        let newEnemy = Object.create(this.objectTemplates[json.type]);
        newEnemy.x = json.spawnX;
        newEnemy.y = json.spawnY;
        newEnemy.speedX = json.speedX;
        newEnemy.groundY = this.level.groundY;
        this.enemies.push(newEnemy);
    }

    /*** Load Endboss ***/
    /********************/

    async loadEndboss() {
        let json = await fetch(this.level.endboss.pathToJson).then(response => response.json());
        this.endboss = new LivingObject(json.staticImagePath);
        this.endboss.setSizeFromImage();
        this.endboss.loadAnimationImagesFromJson(json);
        await this.endboss.decodeImage();
        await this.endboss.decodeImagesAll();
        this.endboss.setSizeFromImage();
        this.endboss.scaleToHeight(json.height);
        this.endboss.x = this.level.endboss.positionX;
        this.endboss.speedX = json.speedX;
        this.endboss.groundY = this.level.groundY + json.groundYoffset;
        this.endboss.setHitbox(json);
        this.endboss.healthbar = new Statusbar(json.healthbarId, './game/bossHealthbar.json');
        this.endboss.applyGravity(this.gravity);
        return this.endboss.decodeImagesAll();
    }

    /*** Load Bottles ***/
    /********************/

    async loadBottleTemplate(pathToJson) {
        let bottleJson = await fetch(pathToJson).then(res => res.json());
        let bottleTemplate = new Bottle(bottleJson.staticImagePath);
        await bottleTemplate.loadAnimationImagesFromJson(bottleJson);
        await bottleTemplate.decodeImagesAll();
        await bottleTemplate.decodeImage();
        bottleTemplate.setSizeFromImage();
        bottleTemplate.scaleToHeight(bottleJson.height);
        bottleTemplate.characterOffsetX = bottleJson.characterOffsetX;
        bottleTemplate.characterOffsetY = bottleJson.characterOffsetY;
        bottleTemplate.speedX = bottleJson.speedX;
        bottleTemplate.speedY = bottleJson.speedY;
        bottleTemplate.hitbox = bottleJson.hitbox;
        bottleTemplate.airborne = true;
        bottleTemplate.groundY = this.level.groundY;
        this.objectTemplates['bottle'] = bottleTemplate;
    }

    spawnBottle() {
        let newBottle = Object.create(this.objectTemplates['bottle']);
        let template = this.objectTemplates['bottle'];
        newBottle.x = -this.cameraX + this.character.x + template.characterOffsetX;
        newBottle.y = this.character.y + template.characterOffsetY;
        if (this.keyboard.ArrowRight || this.keyboard.ArrowLeft) {
            newBottle.speedX += this.character.speedX * 0.75;
        }
        if (this.character.isFlippedHorizontally) newBottle.speedX *= -1;
        newBottle.startMotion();
        newBottle.animate('rotate');
        newBottle.applyGravity(this.gravity);
        this.bottles.push(newBottle);
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
        this.drawBottles();
        this.drawEnemies();
        this.drawEndboss();
        this.ctx.translate(-this.cameraX, 0); //move Camera back
        this.drawCharacter();
        this.checkCharacterCollision();
        this.checkBottleCollision();
        this.checkBottleStatus();
        window.requestAnimationFrame(() => {
            if (isGameRunning) this.draw(this.ctx)
        });
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
                this.character.hurt();
            }
        });
    }

    // TODO: refactor: extract killEnemy function
    // TODO: end game if endboss is dead
    checkBottleCollision() {
        this.bottles.forEach((bottle) => {
            this.enemies.forEach((enemy) => {
                //enemy collision
                if (bottle.isCollision(enemy)) {
                    this.bottles.splice(this.bottles.indexOf(bottle), 1);
                    if (bottle.isCausingDemage) {
                        enemy.stopMotion();
                        enemy.animate('die');
                        window.setTimeout(() => { this.enemies.splice(this.enemies.indexOf(enemy), 1) }, 250);
                    }
                }
                //endboss collision
                if (bottle.isCollision(this.endboss)) {
                    this.bottles.splice(this.bottles.indexOf(bottle), 1);
                    this.endboss.hurt();
                }
            });
        });
    }

    checkBottleStatus() {
        this.bottles.forEach((bottle) => {
            if (bottle.isDestroyed) {
                this.bottles.splice(this.bottles.indexOf(bottle), 1);
            }
        });
    }
}