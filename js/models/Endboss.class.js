class Endboss extends LivingObject {
    world
    isActive = false;
    actionLoop;

    constructor(imgPath, world) {
        super(imgPath);
        this.world = world;
    }

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
        this.world.sounds['endbossAttack'].play();
        this.stopMotionX();
        this.animate('attack');
        window.setTimeout(this.world.spawnChick.bind(this.world), 1500);
    }

    hurt() {
        this.world.sounds['endbossHurt'].play();
        this.x += 10;
        if (this.healthbar.isEmpty()) {
            this.die();
        } else if (this.currentAnimationName != 'hurt') {
            this.healthbar.decrease();
        }
    }

    startActionLoop() {
        let attackDuration = this.getAnimationDuration('attack');
        this.actionLoop = window.setInterval(() => {
            if (this.isActive) {
                let randomNumer = Math.floor(Math.random() * 2);
                if (randomNumer < 1) {
                    this.walk();
                } else {
                    this.attack();
                }
            }
        }, attackDuration);
    }

    getAnimationDuration(animationName) {
        return this.animationImages[animationName].imageDuration * this.animationImages[animationName].images.length;
    }

    die() {
        this.stopActionLoop();
        super.die();
    }

    stopActionLoop() {
        clearInterval(this.actionLoop);
        this.actionLoop = null;
    }
}