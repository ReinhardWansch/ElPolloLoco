/*
objectTemplates[chicken]= {
    img: Image,
    height: number,
    hitbox: {},
    animationImages: 
        name: {
            imageDuration: number,
            images: [Image, Image, ...],
        },
        ...
    }
}
*/

class ObjectManager {
    objectTemplates = [];
    enemies = [];
    groundY;

    constructor(groundY) {
        this.groundY = groundY;
    }

    async addEnemy(json) {
        let newEnemy= new MoveableObject('');
        if (this.objectTemplates[json.type]) {
            this.setEneyPropertiesFromTemplate(newEnemy, json.type);
        } else {
            let enemyJson= await fetch(json.pathToJson).then(response => response.json());
            //load images
            newEnemy.img = new Image();
            newEnemy.img.src = enemyJson.staticImagePath;
            await newEnemy.img.decode();
            newEnemy.setSizeFromImage();
            newEnemy.scaleToHeight(enemyJson.height);
            newEnemy.loadAnimationImages(json.pathToJson);
            await newEnemy.decodeImagesAll();
            // add ObjectTemplate
            this.objectTemplates[json.type]= {
                img: newEnemy.img,
                height: enemyJson.height,
                hitbox: enemyJson.hitbox,
                animationImages: newEnemy.animationImages,
            }
        }
        // set properties from json
        this.setEnemyPropertiesFromJson(newEnemy, json);
        this.enemies.push(newEnemy);
    }

    setEneyPropertiesFromTemplate(enemy, type) {
        enemy.img = this.objectTemplates[type].img;
        enemy.setSizeFromImage();
        enemy.scaleToHeight(this.objectTemplates[type].height);
        enemy.hitbox = this.objectTemplates[type].hitbox;
        enemy.animationImages = this.objectTemplates[type].animationImages;
    }

    setEnemyPropertiesFromJson(enemy, json) {
        enemy.x = json.spawnX;
        enemy.y = json.spawnY;
        enemy.speedX = json.speedX;
        enemy.groundY = this.groundY;
    }

    
}