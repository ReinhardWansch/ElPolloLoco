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

    constructor(imgPath) {
        this.img = new Image();
        this.img.src = imgPath;
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

    setSizeFromImage() {
        this.width = this.img.width;
        this.height = this.img.height;
        this.ratio = this.width / this.height;
    }

    decodeImage() {
        return this.img.decode();
    }

    
    /*##############*/
    /*## POSITION ##*/
    /*##############*/
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
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

    isRotated() {
        return this.rotationAngle !== 0;
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
        if (factor === undefined)
            throw new Error('scale(factor): factor is not defined, DrawableObject.img.path: ' + this.img.src);
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




    /*###########*/
    /*## DEBUG ##*/
    /*###########*/

    drawBoundingBox(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    toString() {
        return `DrawableObject: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}, ratio=${this.ratio}, hitbox=${this.hitbox}`;
    }
}