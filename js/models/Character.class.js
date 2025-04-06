class Character extends MoveableObject {
    keyboard;
    jumpSpeed = -5;
    healthbar;
    dieInterval;

    constructor(imgPath, keyboard) {
        super(imgPath);
        this.keyboard = keyboard;
    }

    draw(ctx) {
        if (this.keyboard.ArrowRight) {
            if (this.isFlippedHorizontally) this.flipHorizontally();
            if (this.getFlag_StartWalkAnimation()) this.animate('walk');
            // this.x += this.speedX;
        }
        else if (this.keyboard.ArrowLeft && this) {
            if (!this.isFlippedHorizontally) this.flipHorizontally();
            if (this.getFlag_StartWalkAnimation()) this.animate('walk');
            // this.x -= this.speedX;
        } else {
            if (this.getFlag_StartIdleAnimation()) this.animate('idle');
        }
        super.draw(ctx);
    }

    jump() {
        if (!this.airborne) {
            this.animate('jump');
            this.y -= 1;
            this.airborne = true;
            this.speedY = this.jumpSpeed;
        }
    }

    hurt() {
        if (this.healthbar.isEmpty()) {
            this.die();     
        } else if (this.currentAnimationName != 'hurt') {
            this.animate('hurt', 5);
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
                    // TODO show endscreen
                    // TODO endscreen delay in level-json instead of using imageDuration
                } else {
                    this.y -= 10;            
                }
            }, this.animationImages.die.imageDuration);
        }
    }

    getFlag_StartWalkAnimation() {
        return !this.airborne && this.currentAnimationName != 'walk' 
            && this.currentAnimationName != 'hurt' 
            && this.currentAnimationName != 'die';
    }
    
    getFlag_StartIdleAnimation() {
        return !this.airborne && this.currentAnimationName != 'idle' 
            && this.currentAnimationName != 'hurt'
            && this.currentAnimationName != 'die';
    }
}