class SolidObject extends AnimatedObject {
    hitbox = {
        xRelative: 0,
        yRelative: 0,
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
        this.hitbox= json.hitbox;
    }

    /*###########*/
    /*## DEBUG ##*/
    /*###########*/

    drawHitbox(ctx) {
        let x= this.x + this.hitbox.xRelative;
        let y = this.y + this.hitbox.yRelative;
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "white";
        ctx.rect(x, y, this.hitbox.width, this.hitbox.height);
        ctx.stroke();
    }
}