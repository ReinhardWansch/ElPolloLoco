class MoveableObject extends HitableObject {
    speedX = 0;
    speedY = 0;
    currentMotionIntervalX;
    currentMotionIntervalY;
    accelerationX = 0;
    accelerationY = 0;
    refreshRate = 1000 / 60;
    airborne;
    groundY;

    /*############*/
    /*## MOTION ##*/
    /*############*/

    startMotion() {
        this.startMotionX();
        this.startMotionY();
    }

    startMotionX() {
        this.stopMotionX();
        this.currentMotionIntervalX = window.setInterval(() => {
            this.x += this.speedX;
            this.speedX += this.accelerationX;
        }, this.refreshRate);
    }

    startMotionY() {
        this.stopMotionY();
        this.currentMotionIntervalY = window.setInterval(() => {
            this.y += this.speedY;
            this.speedY += this.accelerationY;
        }, this.refreshRate);
    }

    stopMotion() {
        this.stopMotionX();
        this.stopMotionY();
    }

    stopMotionX() {
        clearInterval(this.currentMotionIntervalX);
        this.currentMotionIntervalX = null;
    }

    stopMotionY() {
        clearInterval(this.currentMotionIntervalY);
        this.currentAnimationIntervalY = null;
    }

    /*##################*/
    /*## ACCELERATION ##*/
    /*##################*/

    applyGravity(g) {
        this.stopMotionY();
        this.currentMotionIntervalY = window.setInterval(() => {
            if (this.y + this.height < this.groundY) {
                this.airborne = true;
                this.accelerationY = g;
                this.y += this.speedY;
                this.speedY += this.accelerationY;
            } else {
                this.airborne = false;
                this.y = this.groundY - this.height;
                this.speedY = 0;
                this.accelerationY = 0;
            }
        }, this.refreshRate);
    }

    setAccelerationX(a) {
        this.accelerationX = a;
    }

    setAccelerationY(a) {
        this.accelerationY = a;
    }

}