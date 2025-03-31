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

    async addObject(json, objects) {
        let newObject = new MoveableObject('');
        if (this.objectTemplates[json.type]) {
            this.setObjectPropertiesFromTemplate(newObject, json.type);
        } else {
            let enemyJson = await fetch(json.pathToJson).then(response => response.json());
            await this.loadObjectImage(newObject, enemyJson);
            newObject.loadAnimationImages(json.pathToJson);
            await newObject.decodeImagesAll();
            this.addObjectTemplate(enemyJson, newObject);
        }
        this.setEnemyPropertiesFromJson(newObject, json);
        objects.push(newObject);
    }

    setObjectPropertiesFromTemplate(object, type) {
        object.img = this.objectTemplates[type].img;
        object.setSizeFromImage();
        object.scaleToHeight(this.objectTemplates[type].height);
        let hitbox = this.objectTemplates[type].hitbox;
        if (hitbox) object.hitbox = hitbox;
        object.animationImages = this.objectTemplates[type].animationImages;
    }

    setEnemyPropertiesFromJson(enemy, json) {
        enemy.x = json.spawnX;
        enemy.y = json.spawnY;
        enemy.speedX = json.speedX;
        enemy.groundY = this.groundY;
    }

    async loadObjectImage(object, json) {
        object.img = new Image();
        object.img.src = json.staticImagePath;
        await object.img.decode();
        object.setSizeFromImage();
        object.scaleToHeight(json.height);
    }

    addObjectTemplate(json, object) {  
        this.objectTemplates[json.type] = {
            img: object.img,
            height: json.height,
            hitbox: json.hitbox,
            animationImages: object.animationImages,
        }
    }

}