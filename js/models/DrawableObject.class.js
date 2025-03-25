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

    constructor(imgPath, width, height) {
        this.img = new Image();
        this.img.src = imgPath;
        if (!width) {
            this.decodeImage().then(() => {
                console.log('constructor: ', this.img.width, this.img.height); ///DEBUG
                this.width = this.img.width;
                this.height = this.img.height;
                console.log('constructor: ', this.width, this.height); ///DEBUG
                this.ratio = this.width / this.height;
                console.log('constructor: ', this.ratio); ///DEBUG
            });
        } else {
            this.width = width;
            this.height = height;
            this.ratio = this.width / this.height;
        }
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
        this.drawBoundingBox(ctx); ///DEBUG
        ctx.restore();
        this.restorePosition();
    }

    decodeImage() {
        return this.img.decode();
    }

    isTransformed() {
        return this.isFlippedHorizontally || this.rotationAngle !== 0;
    }
    // TODD stell die Frage in einem Forum oder bei DevAk
    // isTransformed() könnte man auch als get isTransformed() schreiben.
    // welche Version ist besser hinsichtlich Wartbarkeit und Lesbarkeit?

    isRotated() {
        return this.rotationAngle !== 0;
    }
    // TDOD stell die Frage in einem Forum oder bei DevAk
    // isRotated() könnte man auch als get isRotated() schreiben.
    // welche Version ist besser hinsichtlich Wartbarkeit und Lesbarkeit?

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
        if (height === undefined) 
            throw new Error('scaleToHeight(height): height is not defined, DrawableObject.img.path: ' + this.img.src);
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
        return `DrawableObject: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}, ratio=${this.ratio}`;
    }
}