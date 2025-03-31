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
            console.log('Template vorhanden...'); ///DEBUG
            this.setObjectPropertiesFromTemplate(newObject, json.type);
        } else {
            console.log('kein Template vorhanden'); ///DEBUG
            let enemyJson = await fetch(json.pathToJson).then(response => response.json());
            console.log(`enemyJson.height: ${enemyJson.height}`); ///DEBUG
            await this.loadObjectImage(newObject, enemyJson);
            console.log('before setObjectHeight(), newObject.height ', newObject.height); ///DEBUG
            this.setObjectHeight(newObject, enemyJson.height);
            console.log('after setObjectHeight, newObject.height: ', newObject.height); ///DEBUG
            await newObject.loadAnimationImages(json.pathToJson);
            console.log('after loadAnimationImages(json.pathToJson), json.pathToJson: ', json.pathToJson, ', ', 'newObject.height: ', newObject.height); ///DEBUG
            this.addObjectTemplate(enemyJson, newObject);
        }
        this.setObjectPropertiesFromJson(newObject, json);
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

    setObjectPropertiesFromJson(enemy, json) {
        console.log('setObjectPropertiesFromTemplate()'); ///DEBUG
        enemy.x = json.spawnX;
        enemy.y = json.spawnY;
        enemy.speedX = json.speedX;
        enemy.groundY = this.groundY;
    }

    async loadObjectImage(object, json) {
        console.log('loadObjectIamge(..), '); ///DEBUG
        object.img = new Image();
        object.img.src = json.staticImagePath;
        await object.img.decode();
    }

    setObjectHeight(object, height) {
        console.log('setObjectHeight(object, height), height: ', height); ///DEBUG
        console.log('object.height: ', object.height); ///DEBUG
        object.setSizeFromImage();
        console.log('after object.setSizeFromImage(), object.height: ', object.height); ///DEBUG
        object.scaleToHeight(height);
        console.log('after object.scaleToHeight(height), height: ', height); ///DEBUG
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