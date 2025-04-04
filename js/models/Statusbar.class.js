class Statusbar {
    htmlElementId;
    currentImageIndex;
    imagePaths = [];

    constructor(htmlElementId) {
        this.htmlElementId = htmlElementId;
    }

    async loadValueImages(pathToJson) {
        let json= await fetch(pathToJson).then(response => response.json());
        json.valueImagePaths.forEach((valueImagePathObject) => {
            this.imagePaths.push(valueImagePathObject.imagePath);
        });
        this.currentImageIndex= json.valueImagePaths.length-1;
    }

    increase() {
        let htmlElement= document.getElementById(this.htmlElementId);
        htmlElement.src= this.imagePaths[++this.currentImageIndex];
    }
    
    decrease() {
        let htmlElement= document.getElementById(this.htmlElementId);
        htmlElement.src= this.imagePaths[--this.currentImageIndex];
    }


}
