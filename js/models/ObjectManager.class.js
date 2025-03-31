/*
objectTemplates[type]= {
    type: string,
    object: {
        img: Image,
        height: number,
        hitbox: {},
        animations: {
            name: string,
            imageDuration: number,
            animationImages: [Image, Image, ...]
        }
    }
}
*/

class ObjectManager {
    objectTemplates = [];
    enemies = [];

    async addEnemy(json) {
        let newEnemy= new MoveableObject('');
        if (this.objectTemplates[json.type]) {
            //bilder zuweisen
        } else {
            //bilder laden
        }
    }
}