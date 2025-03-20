class DrawableObject {
    img;
    x = 0;
    y = 0;
    storedX;
    storedY;
    width;
    height;
    ratio;
    isFlippedHorizontally = false;
    rotationAngle = 0;

    constructor(imgPath, width = 100, height = 100) {
        this.img = new Image();
        this.img.src = imgPath;
        this.width = width;
        this.height = height;
        this.ratio = this.width / this.height;
    }

    draw(ctx) {
        this.storePosition();
        ctx.save();
        if (this.isRotated()) {
            this.centerAtCartesianOrigin();
            this.transformCtxRotate(ctx, this.rotationAngle, this.storedX, this.storedY);
        }
        if (this.isFlippedHorizontally) this.transformCtxFlipHorizontally(ctx);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
        this.restorePosition();
    }

    isTransformed() {
        return this.isFlippedHorizontally || this.rotationAngle !== 0;
    }
    // isTransformed() könnte man auch als get isTransformed() schreiben.
    // welche Version ist besser hinsichtlich Wartbarkeit und Lesbarkeit?

    isRotated() {
        return this.rotationAngle !== 0;
    }
    // isTransformed() könnte man auch als get isRotated() schreiben.
    // welche Version ist besser hinsichtlich Wartbarkeit und Lesbarkeit?

    /*##############*/
    /*## POSITION ##*/
    /*##############*/

    storePosition() {
        this.storedX = this.x;
        this.storedY = this.y;
    }

    restorePosition() {
        this.x = this.storedX;
        this.y = this.storedY;
    }

    centerAtCartesianOrigin() {
        this.x = -this.width / 2;
        this.y = -this.height / 2;
    }
    
    /*##########*/
    /*## FLIP ##*/
    /*##########*/

    flipHorizontally() {
        this.isFlippedHorizontally = !this.isFlippedHorizontally;
    }

    transformCtxFlipHorizontally(ctx) {
        ctx.scale(-1, 1);
        ctx.translate(-this.x * 2 - this.width, 0);
    }

    /*############*/
    /*## ROTATE ##*/
    /*############*/

    rotate(angle) {
        this.rotationAngle = angle;
    }

    transformCtxRotate(ctx, angle, xStored, yStored) {
        ctx.translate(xStored + this.width / 2, yStored + this.height / 2);
        ctx.rotate(angle * Math.PI / 180);
    }

    /*###########*/
    /*## SCALE ##*/
    /*###########*/

    scale(factor) {
        this.width *= factor;
        this.height *= factor;
    }

    scaleToHeight(height) {
        this.height = height;
        this.width = this.height * this.ratio;
    }

    scaleToWidth(width) {
        this.width = width;
        this.height = this.width / this.ratio;
    }

    /*##########*/
    /*## MISC ##*/
    /*##########*/

    resetTransformations() {
        this.isFlippedHorizontally = false;
        this.rotationAngle = 0;
    }
}