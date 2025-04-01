class BackgroundObject extends MoveableObject {
    loopsX;

    constructor(imagePath, loopsX) {
        super(imagePath);
        this.loopsX = loopsX;
    }

    draw(ctx) {
        ctx.drawImage(
            this.img,
            -this.width + 1,
            this.y,
            this.width,
            this.height
        );
        for (let i = 0; i < this.loopsX; i++) {
            ctx.drawImage(
                this.img,
                (this.x + i * this.width) - i * 2,
                this.y,
                this.width,
                this.height
            );
        }
    }
}