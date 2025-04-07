class LivingObject extends MoveableObject {
    healthbar;
    dieInterval;
    isDead = false;


    hurt() {
        if (this.healthbar.isEmpty()) {
            this.die();     
        } else if (this.currentAnimationName != 'hurt') {
            this.animate('hurt');
            this.healthbar.decrease();
        }
    }

    die() {
        if (this.currentAnimationName != 'die') {
            this.animate('die');
            this.stopMotion();
            let count= 0;
            this.dieInterval= window.setInterval(() => {
                if (count++ >= this.animationImages.die.images.length) {
                    clearInterval(this.dieInterval);
                    this.dieInterval= null;
                    this.stopAnimation();
                    this.isDead= true;
                } else {
                    this.y -= 10;            
                }
            }, this.animationImages.die.imageDuration);
        }
    }
}