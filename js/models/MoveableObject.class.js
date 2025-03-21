class MoveableObject extends AnimatedObject {
    speed = 1;
    currentMotionInterval;
    refreshRate = 1000 / 60;

    constructor(x, y, width, height, image) {
        super(x, y, width, height, image);
    }

    moveRight() {
        this.stopMotion();
        if (this.isFlippedHorizontally) this.flipHorizontally();
        this.currentMotionInterval = window.setInterval(() => {
            this.x += this.speed;
        }, this.refreshRate);
        this.stopAnimation();
        this.animate('walk');
    }

    moveLeft() {
        this.stopMotion();
        if (!this.isFlippedHorizontally) this.flipHorizontally();
        this.currentMotionInterval = window.setInterval(() => {
            this.x -= this.speed;
        }, this.refreshRate);
        this.stopAnimation();
        this.animate('walk');
    }   

    stopMotion() {
        clearInterval(this.currentMotionInterval);
        this.stopAnimation();
        this.animate('alert');
    }

}