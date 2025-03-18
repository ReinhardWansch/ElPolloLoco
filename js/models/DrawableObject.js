class DrawableObject {
    img;
    x = 0;
    y = 0;
    width;
    height;

    constructor(imgPath, height = 100, width = 100) {
        this.img = new Image();
        this.img.src = imgPath;
        this.height = height;
        this.width = width;
    }

    draw(ctx) {
        this.img.decode().then(() => {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        });
    }
}