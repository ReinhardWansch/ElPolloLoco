class Bottle extends MoveableObject {
    isDestroyed = false;

    constructor (imgPath) {
        super(imgPath);
        this.isCausingDemage= true;
        // this.decodeImagesAll().then(()=>this.animate('rotate'));
    }

    draw(ctx) {
        if (!this.airborne) {
            this.isCausingDemage = false;
            if (this.currentAnimationName != 'splash') {
                this.animate('splash');
                world.sounds['bottleSplash'].play();
            };
            this.stopMotion();
            window.setTimeout(() => { this.isDestroyed = true; }, 675);
        }
        super.draw(ctx);
    }

}