class Statusbar {
    htmlElementId;
    currentImageIndex;
    imagePaths = [];

    constructor(htmlElementId, pathToJson) {
        this.htmlElementId = htmlElementId;
        this.loadImagePaths(pathToJson);
    }

    async loadImagePaths(pathToJson) {
        let json= await fetch(pathToJson).then(response => response.json());
        json.valueImagePaths.forEach((valueImagePathI) => {
            this.imagePaths.push(valueImagePathI);
        });
        this.currentImageIndex= json.valueImagePaths.length-1;
    }

    increase() {
        if (!this.isFull()){
            let htmlElement= document.getElementById(this.htmlElementId);
            htmlElement.src= this.imagePaths[++this.currentImageIndex];
        }
    }
    
    decrease() {
        if (!this.isEmpty()){
            let htmlElement= document.getElementById(this.htmlElementId);
            htmlElement.src= this.imagePaths[--this.currentImageIndex];
        }
    }

    isEmpty() {
        return this.currentImageIndex <= 0;
    }

    isFull() {
        return this.currentImageIndex >= this.imagePaths.length - 1;
    }


}
