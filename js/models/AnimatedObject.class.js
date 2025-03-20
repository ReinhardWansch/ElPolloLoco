class AnimatedOject extends DrawableObject {
    animationImages = {};
    currentImageIndex = 0;
    //name der Animation als key, value ist ein Array von Image-Objekten
    currentAnimationInterval;

    constructor(imgPath, width = 100, height = 100) {
        super(imgPath, width, height);
    }

    loadAnimationImages(pathToJson) {
        fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                json.animations.forEach((animationI) => {
                    this.animationImages[animationI.name]= {};
                    this.animationImages[animationI.name].paths = [];
                    this.animationImages[animationI.name].imageDuration = animationI.imageDuration;
                    animationI.paths.forEach((path) => {
                        let img = new Image();
                        img.src = path;
                        this.animationImages[animationI.name].paths.push(img);
                    });
                });
            });
    }

    animate(animationName) {
        this.stopAnimation();
        let imageDuration= this.animationImages[animationName].imageDuration;
        console.log(imageDuration); ///DEBUG
        this.currentImageIndex = 0;
        this.currentAnimationInterval = window.setInterval(() => {
            this.setNextImage(animationName);
        }, imageDuration);
        
    }

    setNextImage(animationName) {
        let images = this.animationImages[animationName].paths;
        let i = this.currentImageIndex % images.length;
        this.img = images[i];
        this.currentImageIndex++;
    }

    stopAnimation() {
        clearInterval(this.currentAnimationInterval);
    }
}