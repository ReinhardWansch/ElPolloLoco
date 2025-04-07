class HitableObject extends AnimatedObject {
    hitbox = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
    }
    isCausingDemage = false;

    draw(ctx) {
        super.draw(ctx);
        this.drawHitbox(ctx); ///DEBUG
    }

    setDimensions(json) {
        this.setSizeFromImage();
        this.scaleToHeight(json.height);
        this.setHitbox(json);
    }

    isCollision(otherObject, xOffset) {
        let thisCoords = this.getHitboxCoordinates();
        let otherCoords = otherObject.getHitboxCoordinates();
        if (xOffset) thisCoords.x = thisCoords.x + xOffset;
        return thisCoords.x < otherCoords.x + otherObject.hitbox.width &&
            thisCoords.x + this.hitbox.width > otherCoords.x &&
            thisCoords.y < otherCoords.y + otherObject.hitbox.height &&
            thisCoords.y + this.hitbox.height > otherCoords.y;
    }

    setHitbox(json) {
        this.hitbox = json.hitbox;
    }

    getHitboxCoordinates() {    
        if(this.isFlippedHorizontally) 
            return {
                x: this.x + this.width - this.hitbox.x - this.hitbox.width,
                y: this.y + this.hitbox.y,
            }
        else return {
            x: this.x + this.hitbox.x,
            y: this.y + this.hitbox.y,
        }
    }

    

    /*###########*/
    /*## DEBUG ##*/
    /*###########*/

    drawHitbox(ctx) {
        let hitBoxCoords= this.getHitboxCoordinates();
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "white";
        ctx.rect(hitBoxCoords.x, hitBoxCoords.y, this.hitbox.width, this.hitbox.height);
        ctx.stroke();
    }
}