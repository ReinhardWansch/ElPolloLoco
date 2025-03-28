//@disable-copilot-suggestions
class World {
    ctx;
    level;
    character;
    enemies = [];
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
            .then(json => this.level = json)
            .then(this.createBackgroundObjects.bind(this))
            .then(this.createCloudObjects.bind(this));
    }

    /*** Backgrounds ***/
    /*******************/

    createBackgroundObjects() {
        return this.addRepetitiveObjectsAll(this.level.backgrounds, this.backgroundObjects);
    }

    /*** Clouds ***/
    /**************/

    createCloudObjects() {
        return this.addRepetitiveObjectsAll(this.level.clouds, this.cloudObjects);
    }

    /*** Add Objects ***/
    /*******************/

    addRepetitiveObjectsAll(objectDescriptions, objects) {
        let allImagesReady = [];
        objectDescriptions.forEach((descriptionI) => {
            let imageReady = this.addRepetitiveObject(descriptionI, objects);
            allImagesReady.push(imageReady);
        });
        return Promise.all(allImagesReady);
    }

    addRepetitiveObject(objectDescription, objects) {
        let mob = new MoveableObject(objectDescription.imagePath);
        let imageReady = mob.setSizeFromImage().then(() => {
            mob.scaleToHeight(this.ctx.canvas.height);
            objects.push({ mob: mob, loopsX: objectDescription.loopsX });
        });
        return imageReady;
    }

    /*** Load Character ***/
    /**********************/

    async loadCharacter(pathToJson) {
        let json = await fetch(pathToJson).then(response => response.json());
        this.character = new Character(json.staticImagePath, this.keyboard);
        await this.character.setSizeFromImage();
        this.character.loadAnimationImagesFromJson(json);
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
        let enemyJson= await fetch(enemyDescription.pathToJson).then(response => response.json());
        let enemy= new MoveableObject(enemyJson.staticImagePath);
        await enemy.setSizeFromImage();
        enemy.loadAnimationImagesFromJson(enemyJson);
        enemy.setHitbox(enemyJson);
        enemy.scaleToHeight(enemyJson.height);
        enemy.x= enemyDescription.spawnX;
        enemy.groundY = this.level.groundY;
        enemy.speedX = Math.random() * -3 + -1;
        enemy.startMotion();
        enemy.animate('walk');
        this.enemies.push(enemy);
    }

    setRandomEnemySpeeds() {
        this.enemies.forEach((enemy) => {
            enemy.speedX = Math.random() * 3 + 1;
            console.log(enemy.speedX); ///DEBUG
        });
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
        this.ctx.translate(this.cameraX, 0);
        this.drawBackgroundObjects();
        this.drawCloudObjects();
        this.drawEnemies();
        this.ctx.translate(-this.cameraX, 0);
        this.drawObject(this.character);
        this.debugCheckCharacterCollision();
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

    /*###########*/
    /*## DEBUG ##*/
    /*###########*/

    debugCheckCharacterCollision() {
        this.enemies.forEach((enemy)=>{
            if (this.character.isCollision(enemy, -this.cameraX)) {
                this.character.animate('hurt');
                console.log('hallo chicken'); ///DEBUG
            }
        });
    }
}