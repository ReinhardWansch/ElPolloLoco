class DrawableObject {
    img;
    x = 0;
    y = 0;
    width;
    height;
    ratio;
    isFlippedHorizontally= false;

    constructor(imgPath, width= 100, height= 100) {
        this.img = new Image();
        this.img.src = imgPath;
        this.width = width;
        this.height = height;
        this.ratio = this.width / this.height;
    }

    draw(ctx) {
        if (this.isFlippedHorizontally) {
            this.drawFlippedHorizontally(ctx);
        } else {
            this.drawNormal(ctx);
        }
    }

    drawNormal(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFlippedHorizontally(ctx) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

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

    flipHorizontally(ctx) {
        this.isFlippedHorizontally = !this.isFlippedHorizontally;
    }
}