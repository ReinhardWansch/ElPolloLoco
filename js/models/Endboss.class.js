class Endboss extends LivingObject {
    isActive= false;
    actionLoop;

    activate() {
        let alertDuration = this.getAnimationDuration('alert');
        this.isActive = true;
        this.animate('alert');
        window.setTimeout(this.startActionLoop.bind(this), alertDuration);
    }

    walk() {
        this.stopMotionX();
        this.animate('walk');
        this.startMotionX();
    }   
    
    attack() {
        this.stopMotionX();
        this.animate('attack');
        //shoot chick
    }

    startActionLoop() {
        let attackDuration = this.getAnimationDuration('attack');
        this.actionLoop= window.setInterval(() => {
            if (this.isActive) {
                let randomNumer = Math.floor(Math.random() * 2);
                if (randomNumer < 1) {
                    this.walk();
                } else {
                    this.attack();
                }
            } else {
                this.actionLoop = null;
            }
        }, attackDuration);
    }

    getAnimationDuration(animationName) {
        return this.animationImages[animationName].imageDuration * this.animationImages[animationName].images.length;
    }
}