class Character extends MoveableObject {
    keyboard;
    jumpSpeed = -5;

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

    getFlag_StartWalkAnimation() {
        return !this.airborne && this.currentAnimationName != 'walk' && this.currentAnimationName != 'hurt';
    }
    
    getFlag_StartIdleAnimation() {
        return !this.airborne && this.currentAnimationName != 'idle' && this.currentAnimationName != 'hurt';
    }
}