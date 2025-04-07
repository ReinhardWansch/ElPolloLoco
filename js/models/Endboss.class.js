class Endboss extends LivingObject {

    activate() {
        this.animate('alert');
    }

    walk() {
        this.stopMotionX();
        this.animate('walk');
        this.startMotionX();
    }   
    
    attack() {
        this.stopMotionX();
        this.animate('attack');
        //shoot chick
    }
}