class DrawableObject {
    img;
    x = 0;
    y = 0;
    width;
    height;
    ratio;

    constructor(imgPath, height = 100, width = 100) {
        this.img = new Image();
        this.img.src = imgPath;
        this.height = height;
        this.width = width;
        this.ratio = this.width / this.height;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
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
}