class DrawableObject {
    img;
    x = 0;
    y = 0;
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
        if (this.isFlippedHorizontally) {
            this.drawFlippedHorizontally(ctx);
        } else if (this.rotationAngle !== 0){
            this.drawRotated(ctx);
        } else {
            this.drawNormal(ctx);
        }
    }

    drawNormal(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /*##########*/
    /*## FLIP ##*/
    /*##########*/

    flipHorizontally() {
        this.isFlippedHorizontally = !this.isFlippedHorizontally;
    }

    drawFlippedHorizontally(ctx) {
        ctx.save();
        this.transformCtxFlipHorizontally(ctx);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    transformCtxFlipHorizontally(ctx) {
        ctx.scale(-1, 1);
        ctx.translate(-this.x*2-this.width, 0);
    }

    /*############*/
    /*## ROTATE ##*/
    /*############*/

    rotate(angle) {
        this.rotationAngle = angle;
    }

    drawRotated(ctx) {
        let xSaved = this.x;
        let ySaved = this.y;
        this.x = -this.width / 2;
        this.y = -this.height / 2;
        ctx.save();
        // ctx.translate(xSaved + this.width / 2, ySaved + this.height / 2);
        // ctx.rotate(angle * Math.PI / 180);
        this.transformCtxRotate(ctx, this.rotationAngle, xSaved, ySaved);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
        this.x = xSaved;
        this.y = ySaved;
    }

    transformCtxRotate(ctx, angle, xSaved, ySaved) {
        ctx.translate(xSaved + this.width / 2, ySaved + this.height / 2);
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
        this.width = this.height * this.ratio;
        this.height = height;
    }

    scaleToWidth(width) {
        this.width = width;
        this.height = this.width / this.ratio;
    }
}