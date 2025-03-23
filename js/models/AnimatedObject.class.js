//TODO decode - Funktion wenn alle Bilde decodiert sind
class AnimatedObject extends DrawableObject {
    // --- animationImages ---
    // {
    //    "name": {
    //         "imageDuration": durationInMs
    //         "images": ["path1", "path2", "path3", ...]
    //     }, 
    //     ...
    // }
    animationImages = {};
    currentImageIndex = 0;
    currentAnimationInterval;

    constructor(imgPath, width, height) {
        super(imgPath, width, height);
    }

    //TODO refactor loadAnimationImages
    loadAnimationImages(pathToJson) {
        fetch(pathToJson)
            .then(response => response.json())
            .then(json => {
                json.animations.forEach((animationI) => {
                    this.animationImages[animationI.name] = {};
                    this.animationImages[animationI.name].images = [];
                    this.animationImages[animationI.name].imageDuration = animationI.imageDuration;
                    animationI.imagePaths.forEach((path) => {
                        let img = new Image();
                        img.src = path;
                        this.animationImages[animationI.name].images.push(img);
                    });
                });
            });
        return this.decodeImagesAll();
    }

    decodeImagesAll() {
        let decodePromises = [];
        for (let animationName in this.animationImages) {
            decodePromises.push(this.decodeImages(animationName));
        }
        return Promise.all(decodePromises);
    }
    
    decodeImages(animationName) {
        let images = this.animationImages[animationName].images;
        let decodedImagePromises = [];
        images.forEach((img) => {
            decodedImagePromises.push(img.decode());
        });
        return Promise.all(decodedImagePromises);
    }

    animate(animationName) {
        this.stopAnimation();
        let imageDuration = this.animationImages.die.imageDuration;
        // let imageDuration = this.animationImages[animationName][imageDuration];
        this.currentImageIndex = 0;
        this.img = this.animationImages[animationName].images[0];
        this.currentAnimationInterval = window.setInterval(() => {
            this.setNextImage(animationName);
        }, imageDuration);

    }

    setNextImage(animationName) {
        let images = this.animationImages[animationName].images;
        let i = this.currentImageIndex % images.length;
        this.img = images[i];
        this.currentImageIndex++;
    }

    stopAnimation() {
        clearInterval(this.currentAnimationInterval);
    }
}