let body = document.body;

class Cube {
    constructor(element) {
        this.asElement = element;
        this.degXonRelease = 0;
        this.degYonRelease = 0;
        this.posX = 0;
        this.posY = 0;
    }
}

let superCube = new Cube(document.querySelector(".super-cube"));

let tempCubes = document.querySelectorAll(".cube");
let cubes = [];
for (let i = 0; i < tempCubes.length; ++i) {
    cubes.push(new Cube(tempCubes[i]));
}

let initMousePosX, initMousePosY;
let isCubeFocused = false;
superCube.asElement.onmousedown = e => {
    e.preventDefault();
    isCubeFocused = true;
    [initMousePosX, initMousePosY] = getMousePos(e);
};

keyFlags = {};

const TURNS_PER_MOUSE_DELTA = 0.002;
let deltaX, deltaY = 0;
body.onmouseup = e => {
    isCubeFocused = false;
    if (keyFlags.Shift) {
        superCube.degXonRelease += deltaX * TURNS_PER_MOUSE_DELTA;
        superCube.degYonRelease += deltaY * TURNS_PER_MOUSE_DELTA;
    }
    else {
        cubes.forEach(cube => {
            cube.degXonRelease += deltaX * TURNS_PER_MOUSE_DELTA;
            cube.degYonRelease += deltaY * TURNS_PER_MOUSE_DELTA;
        })
    }
};


body.onkeydown = e => {
    e.preventDefault();
    if (!isCubeFocused)
        keyFlags[e.key] = true;
};

body.onkeyup = e => {
    keyFlags[e.key] = false;
};

body.onmousemove = e => {
    if (isCubeFocused && keyFlags.Shift) {

        [deltaX, deltaY] = getMouseDeltaXY(e);

        rotate(superCube, deltaX, deltaY);
    }
    else if (isCubeFocused) {
        
        [deltaX, deltaY] = getMouseDeltaXY(e);

        cubes.forEach(cube => {
            rotate(cube, deltaX, deltaY);
        });
    }
};

function getMousePos(e) {
    return [e.clientX, e.clientY];
}

function getMouseDeltaXY(e) {
    let [mousePosX, mousePosY] = getMousePos(e);
    return [mousePosX - initMousePosX, mousePosY - initMousePosY];
}

function rotate(item, deltaX, deltaY) {
    let element = item.asElement;
    element.style.transform = `rotateY(${item.degXonRelease + (deltaX * TURNS_PER_MOUSE_DELTA)}turn) rotateX(${item.degYonRelease + (deltaY * TURNS_PER_MOUSE_DELTA)}turn)`;
}

// function translate(item, deltaX, deltaY) {
//     let element = item.asElement;
//     element.style.transform = `translate(${item.posX + deltaX}px, ${item.posY + deltaY}px)`;
// }