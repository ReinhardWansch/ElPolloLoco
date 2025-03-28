//TODO: refactor all constructors!
//TODO: Start game with button

let canvas = document.getElementById("canvasElem");
let ctx = canvas.getContext("2d");
let world = new World(ctx);


function start() {
    world.draw(ctx);
    world.applyGravity();
}






/*###########*/
/*## DEBUG ##*/
/*###########*/

function tuEs() {
    world.loadLevel('./game/level1.json')
        .then(loadCharacterAndEnemies)
        .then(() => {
            world.drawBackgroundObjects();
            world.drawCloudObjects();
            world.drawCharacter();
            world.drawEnemies();
        });
}

function loadCharacterAndEnemies() {
    let characterPromise = world.loadCharacter('./game/pepe.json');
    let enemyPromise = world.loadEnemies('./game/enemies.json');
    return Promise.all([characterPromise, enemyPromise]);
}

