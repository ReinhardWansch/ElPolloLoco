class World {
    ctx;
    keyboard;
    gravity = 0.5;
    cameraX = 0;
    isGameRunning = false;
    looseFunction;
    winFunction;
    gameOverDelay = 500;
    level;
    objectTemplates = [];
    backgrounds = [];
    character;
    enemies = [];
    collectibles = [];
    endboss;
    bottles = [];
    sounds = [];

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
        await this.loadObjectImages(json, this.character);
        this.character.setDimensions(json);
        this.character.x = json.positionX;
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
        await this.loadObjectImages(enemyJson, templateObject);
        templateObject.setDimensions(enemyJson);
        this.objectTemplates[json.type] = templateObject;
    }

    spawnEnemy(json) {
        let newEnemy = Object.create(this.objectTemplates[json.type]);
        newEnemy.x = json.spawnX;
        newEnemy.y = json.spawnY;
        newEnemy.speedX = json.speedX;
        newEnemy.groundY = this.level.groundY;
        newEnemy.isCausingDemage = true;
        this.enemies.push(newEnemy);
    }

    /*** Load Endboss ***/
    /********************/

    async loadEndboss() {
        let json = await fetch(this.level.endboss.pathToJson).then(response => response.json());
        this.endboss = new Endboss(json.staticImagePath, this);
        await this.loadObjectImages(json, this.endboss);
        this.endboss.setDimensions(json);
        this.endboss.x = this.level.endboss.spawnX;
        this.endboss.speedX = json.speedX;
        this.endboss.groundY = this.level.groundY + json.groundYoffset;
        this.endboss.healthbar = new Statusbar(json.healthbarId, './game/bossHealthbar.json');
        this.endboss.applyGravity(this.gravity);
        return this.endboss.decodeImagesAll();
    }

    //TODO: refactor, axtract loadObjectTemplate function, in json-file: bossOffset -> offset 
    async loadChickTemplate(pathToJson) {
        let chickJson = await fetch(pathToJson).then(res => res.json());
        let chickTemplate = new MoveableObject(chickJson.staticImagePath);
        await this.loadObjectImages(chickJson, chickTemplate);
        chickTemplate.setDimensions(chickJson);
        chickTemplate.bossOffsetX = chickJson.bossOffsetX;
        chickTemplate.bossOffsetY = chickJson.bossOffsetY;
        chickTemplate.speedX = chickJson.speedX;
        this.objectTemplates['chick'] = chickTemplate;
    }

    /*** Load Bottles ***/
    /********************/

    //TODO: refactor, axtract loadObjectTemplate function, in json-file: characterOffset -> offset
    async loadBottleTemplate(pathToJson) {
        let bottleJson = await fetch(pathToJson).then(res => res.json());
        let bottleTemplate = new Bottle(bottleJson.staticImagePath);
        await this.loadObjectImages(bottleJson, bottleTemplate);
        bottleTemplate.setDimensions(bottleJson);
        bottleTemplate.characterOffsetX = bottleJson.characterOffsetX;
        bottleTemplate.characterOffsetY = bottleJson.characterOffsetY;
        bottleTemplate.speedX = bottleJson.speedX;
        bottleTemplate.speedY = bottleJson.speedY;
        bottleTemplate.airborne = true;
        bottleTemplate.groundY = this.level.groundY;
        this.objectTemplates['bottle'] = bottleTemplate;
    }

    //TODO: refactor
    spawnBottle() {
        if (!this.character.bottleValue.isZero()) {
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
            this.sounds['bottleThrow'].play();
            this.character.bottleValue.decrease();
        }
    }

    /*** Load Collectibles ***/
    /*************************/

    loadCollectibles() {
        for (let json of this.level.collectibles) {
            if (json.type == 'bottle') {
                let newBottleCollectible = Object.create(this.objectTemplates['bottle']);
                newBottleCollectible.x = json.spawnX;
                newBottleCollectible.y = json.spawnY;
                this.collectibles.push(newBottleCollectible);
            }
        }
    }

    /*** Load Sounds ***/
    /*******************/

    loadSounds() {
        // character
        this.sounds['jump'] = new Audio('./sounds/jump-6462 (mp3cut.net).mp3');
        this.sounds['characterHurt'] = new Audio('./sounds/pepeHurt.mp3');
        // bottle
        this.sounds['bottleCollect'] = new Audio('./sounds/bottle-clink-101000 (mp3cut.net).mp3');
        this.sounds['bottleThrow'] = new Audio('./sounds/bottleThrow (mp3cut.net).mp3');
        this.sounds['bottleSplash'] = new Audio('./sounds/glass-break-316720.mp3');
        // chicken
        this.sounds['chickenDie'] = new Audio('./sounds/chickenDie.mp3');
        // endboss
        this.sounds['endbossHurt'] = new Audio('./sounds/endbossHurt.mp3');
        this.sounds['chickPeep'] = new Audio('./sounds/chickPeep.mp3');
        this.sounds['endbossAttack'] = new Audio('./sounds/endbossAttack.mp3');
    }

    /*** Helper ***/
    /**************/

    async loadObjectImages(json, object) {
        object.loadAnimationImagesFromJson(json);
        let imageDecoded = object.decodeImage();
        let imagesAllDecoded = object.decodeImagesAll();
        return Promise.all([imageDecoded, imagesAllDecoded]);
    }

    /*##########*/
    /*## DRAW ##*/
    /*##########*/

    draw() {
        this.moveCharacter();
        this.clearCanvas();
        this.drawNonPlayerObjects();
        this.drawCharacter();
        this.checkCollisions();
        this.checkStatus();
        window.requestAnimationFrame(() => {
            if (this.isGameRunning) this.draw(this.ctx)
        });
    }

    moveCharacter() {
        if (this.keyboard.ArrowRight && this.cameraX >= this.level.rightBorderCameraX)
            this.cameraX -= this.character.speedX;
        if (this.keyboard.ArrowLeft && this.cameraX <= this.level.leftBorderCameraX)
            this.cameraX += this.character.speedX;
    }

    drawNonPlayerObjects() {
        this.ctx.translate(this.cameraX, 0); //move Camera
        this.drawBackgrounds();
        this.drawBottles();
        this.drawEnemies();
        this.drawCollectibles();
        this.drawEndboss();
        this.ctx.translate(-this.cameraX, 0); //move Camera back
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

    drawCollectibles() {
        this.drawObjects(this.collectibles);
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

    /*################*/
    /*## COLLISIONS ##*/
    /*################*/

    checkCollisions() {
        this.checkEnemyCollision();
        this.checkBottleCollision();
        this.checkCollectibleCollisions();
        this.checkBossCollision();
        //chick collision
    }

    checkEnemyCollision() {
        this.enemies.forEach((enemy) => {
            if (this.character.isCollision(enemy, -this.cameraX)) {
                if (enemy.isCausingDemage)
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
                        this.sounds['chickenDie'].play();
                        enemy.isCausingDemage = false;
                        enemy.stopMotion();
                        enemy.animate('die');
                        window.setTimeout(() => { this.enemies.splice(this.enemies.indexOf(enemy), 1) }, 250);
                    }
                }
            });
            //endboss collision
            if (bottle.isCollision(this.endboss)) {
                this.bottles.splice(this.bottles.indexOf(bottle), 1);
                this.endboss.hurt();
            }
        });
    }

    checkCollectibleCollisions() {
        this.collectibles.forEach((collectibleI) => {
            if (this.character.isCollision(collectibleI, -this.cameraX)) {
                this.sounds['bottleCollect'].play();
                this.collectibles.splice(this.collectibles.indexOf(collectibleI), 1);
                this.character.bottleValue.increase();
            }
        });
    }

    checkBossCollision() {
        if (this.character.isCollision(this.endboss, -this.cameraX))
            this.character.hurt();
    }

    checkChickCollision() {
        this.enemies.forEach((enemy) => {
            if (this.character.isCollision(enemy, -this.cameraX)) {
                if (enemy.isCausingDemage)
                    this.character.hurt();
            }
        });
    }

    /*###################*/
    /*## OBJECT STATUS ##*/
    /*###################*/

    checkStatus() {
        this.checkBottleStatus();
        this.checkCharacterStatus();
        this.checkEndbossStatus();
    }

    checkBottleStatus() {
        this.bottles.forEach((bottle) => {
            if (bottle.isDestroyed) {
                this.bottles.splice(this.bottles.indexOf(bottle), 1);
            }
        });
    }

    checkCharacterStatus() {
        if (this.character.isDead) {
            this.character.scaleToHeight(0);
            window.setTimeout(() => this.looseFunction(), this.gameOverDelay);
        }
    }

    checkEndbossStatus() {
        if (this.endboss.isDead) {
            this.endboss.scaleToHeight(0);
            window.setTimeout(() => this.winFunction(), this.gameOverDelay);
        }
        if (world.cameraX < this.level.endboss.encounterCameraX) {
            if (!this.endboss.isActive) this.endboss.activate();
        }
    }


    /*##########*/
    /*## MISC ##*/
    /*##########*/

    applyGravity() {
        this.character.applyGravity(this.gravity);
        this.enemies.forEach((enemy) => enemy.applyGravity(this.gravity));
    }



    /*###########*/
    /*## DEBUG ##*/
    /*###########*/

    spawnChick() {
        this.sounds['chickPeep'].play();
        let newChick = Object.create(this.objectTemplates['chick']);
        newChick.x = this.endboss.x + this.objectTemplates['chick'].bossOffsetX;
        newChick.y = this.endboss.y + this.objectTemplates['chick'].bossOffsetY;
        newChick.isCausingDemage = true;
        newChick.rotate(-90);
        newChick.startMotionX();
        newChick.animate('walk');
        this.enemies.push(newChick);
    }
}