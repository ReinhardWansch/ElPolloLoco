class AnimatedOject extends DrawableObject {
    staticImgPath;

    constructor(imgPath, width = 100, height = 100) {
        super(imgPath, width, height);
        this.staticImgPath = imgPath;
    }
}