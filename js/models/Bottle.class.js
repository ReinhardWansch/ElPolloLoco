class Bottle extends MoveableObject {

    constructor (imgPath) {
        super(imgPath);
        this.decodeImagesAll().then(()=>this.animate('rotate'));
    }

    draw(ctx) {
        console.log('Bottle.draw()'); ///DEBUG
        if (!this.airborne) {
            console.log('diiisch'); ///DEBUG
        }
        super.draw(ctx);
    }

}