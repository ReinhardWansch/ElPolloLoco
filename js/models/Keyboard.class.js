class Keyboard {
    keyHandlersDown= [];
    keyHandlersUp= [];

    constructor() {
        window.addEventListener('keydown', this.keydown.bind(this));
        window.addEventListener('keyup', this.keyup.bind(this));
    }

    keydown(event) {
        this[event.key] = true;
        if (this.keyHandlersDown[event.key]) this.keyHandlersDown[event.key]();
    }

    keyup(event) {
        this[event.key] = false;
    }

    addKeyHandlerDown(key, handler) {
        this.keyHandlersDown[key] = handler;
    }
    
    addKeyHandlerUp(key, handler) {
        this.keyHandlersUp[key] = handler;
    }
}