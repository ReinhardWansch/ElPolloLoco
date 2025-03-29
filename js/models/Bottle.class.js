class Bottle extends MoveableObject {
    isDestroyed = false;

    constructor (imgPath) {
        super(imgPath);
        // this.decodeImagesAll().then(()=>this.animate('rotate'));
    }

    draw(ctx) {
        if (!this.airborne) {
            if (this.currentAnimationName != 'splash') this.animate('splash');
            this.stopMotion();
            window.setTimeout(() => { this.isDestroyed = true; }, 675);
        }
        super.draw(ctx);
    }

}