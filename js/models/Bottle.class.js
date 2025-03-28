class Bottle extends MoveableObject {

    constructor (imgPath) {
        super(imgPath);
        this.decodeImagesAll().then(()=>this.animate('rotate'));
    }

    

}