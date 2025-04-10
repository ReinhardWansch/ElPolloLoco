class Character extends LivingObject {
    keyboard;
    jumpSpeed = -5;
    bottleValue;

    constructor(imgPath, keyboard) {
        super(imgPath);
        this.keyboard = keyboard;
        this.bottleValue = new Statusvalue('bottleValue');
    }

    draw(ctx) {
        if (this.keyboard.ArrowRight) {
            if (this.isFlippedHorizontally) this.flipHorizontally();
            if (this.getFlag_StartWalkAnimation()) this.animate('walk');
        }
        else if (this.keyboard.ArrowLeft && this) {
            if (!this.isFlippedHorizontally) this.flipHorizontally();
            if (this.getFlag_StartWalkAnimation()) this.animate('walk');
        } else {
            if (this.getFlag_StartIdleAnimation()) this.animate('idle');
        }
        super.draw(ctx);
    }

    jump() {
        if (!this.airborne) {
            this.animate('jump');
            world.sounds['jump'].play();
            this.y -= 1;
            this.airborne = true;
            this.speedY = this.jumpSpeed;
        }
    }

    hurt() {
        world.sounds['characterHurt'].play();
        super.hurt();
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