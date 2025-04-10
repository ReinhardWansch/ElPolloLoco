class AnimatedObject extends DrawableObject {
    animationImages = {};
    currentImageIndex = 0;
    currentAnimationInterval;
    currentAnimationName;

    async loadAnimationImages(pathToJson) {
        await fetch(pathToJson)
            .then(response => response.json())
            .then(json => this.loadAnimationImagesFromJson(json));
        return this.decodeImagesAll();
    }

    loadAnimationImagesFromJson(json) {
        json.animations.forEach((animationI) => {
            this.animationImages[animationI.name] = {};
            this.animationImages[animationI.name].images = [];
            this.animationImages[animationI.name].imageDuration = animationI.imageDuration;
            this.animationImages[animationI.name].animationLoops = animationI.animationLoops;
            animationI.imagePaths.forEach((path) => {
                let img = new Image();
                img.src = path;
                this.animationImages[animationI.name].images.push(img);
            });
        });
    }

    decodeImagesAll() {
        let decodePromisesAll = [];
        for (let animationName in this.animationImages) {
            decodePromisesAll.push(this.decodeImages(animationName));
        }
        return Promise.all(decodePromisesAll);
    }
    
    decodeImages(animationName) {
        let images = this.animationImages[animationName].images;
        let decodedImagePromises = [];
        images.forEach((img) => {
            decodedImagePromises.push(img.decode());
        });
        Promise.all(decodedImagePromises)
        return Promise.all(decodedImagePromises);
    }

    animate(animationName) {
        let repeatCount= this.animationImages[animationName].animationLoops;
        this.stopAnimation();
        let imageDuration = this.animationImages[animationName].imageDuration;
        this.currentImageIndex = 0;
        this.img = this.animationImages[animationName].images[0];
        repeatCount *= this.animationImages[animationName].images.length;
        this.currentAnimationInterval = window.setInterval(() => {
            this.setNextImage(animationName);
            if (repeatCount) {
                repeatCount--;
                if (repeatCount <= 0) this.stopAnimation(); 
            }
        }, imageDuration);
        this.currentAnimationName = animationName;
    }

    setNextImage(animationName) {
        let images = this.animationImages[animationName].images;
        let i = this.currentImageIndex % images.length;
        this.img = images[i];
        this.currentImageIndex++;
    }

    stopAnimation() {
        clearInterval(this.currentAnimationInterval);
        this.currentAnimationName = null;
    }

}