class Statusvalue {
    htmlElementId;

    constructor(htmlElementId) {
        this.htmlElementId = htmlElementId;
    }


    decrease() {
        let value = this.getValue();
        if (value > 0) {
            value--;
            this.setValue(value);
        }
    }

    increase() {
        let value = this.getValue();
        value++;
        this.setValue(value);
    }

    getValue() {
        let htmlElement = document.getElementById(this.htmlElementId);
        return parseInt(htmlElement.innerHTML);
    }

    setValue(value) {
        let htmlElement = document.getElementById(this.htmlElementId);
        htmlElement.innerHTML = value;
    }

    isZero() {
        return this.getValue() <= 0;
    }
}