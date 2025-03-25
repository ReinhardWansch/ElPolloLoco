class SolidObject extends AnimatedObject {
    hitbox = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
    }

    constructor(imgPath, width, height) {
        super(imgPath, width, height);
    }

    draw(ctx) {
        super.draw(ctx);
        this.drawHitbox(ctx);
    }

    setHitbox(json) {
        this.hitbox = json.hitbox;
    }

    /*###############*/
    /*## COLLISION ##*/
    /*###############*/

    isCollision(otherObject, xOffset) {
        let thisCoords = this.getHitboxCoordinates();
        let otherCoords = otherObject.getHitboxCoordinates();
        if (xOffset) thisCoords.x = thisCoords.x + xOffset;
        return thisCoords.x < otherCoords.x + otherObject.hitbox.width &&
            thisCoords.x + this.hitbox.width > otherCoords.x &&
            thisCoords.y < otherCoords.y + otherObject.hitbox.height &&
            thisCoords.y + this.hitbox.height > otherCoords.y;
    }

    getHitboxCoordinates() {
        return {
            x: this.x + this.hitbox.x,
            y: this.y + this.hitbox.y,
        }
    }

    /*###########*/
    /*## DEBUG ##*/
    /*###########*/

    drawHitbox(ctx) {
        let x = this.x + this.hitbox.x;
        let y = this.y + this.hitbox.y;
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "white";
        ctx.rect(x, y, this.hitbox.width, this.hitbox.height);
        ctx.stroke();
    }
}