let body = document.body;

class Cube {
    #TURNS_PER_MOUSE_DELTA = 0.002;

    constructor(element) {
        this.asElement = element;
        this.degXonRelease = 0;
        this.degYonRelease = 0;
        this.posX = 0;
        this.posY = 0;
        this.isFocused = false;
    }

    updatePos(deltaX=0, deltaY=0) {
        this.posX += deltaX;
        this.posY += deltaY;
    }

    updateDeg(deltaX=0, deltaY=0) {
        this.degXonRelease += deltaX * this.#TURNS_PER_MOUSE_DELTA;
        this.degYonRelease += deltaY * this.#TURNS_PER_MOUSE_DELTA;
    }

    rotate(deltaX=0, deltaY=0) {
        this.asElement.style.transform = `translate(${this.posX}px, ${this.posY}px) rotateY(${this.degXonRelease + (deltaX * this.#TURNS_PER_MOUSE_DELTA)}turn) rotateX(${this.degYonRelease + (deltaY * this.#TURNS_PER_MOUSE_DELTA)}turn)`;
    }

    translate(deltaX=0, deltaY=0) {
        this.asElement.style.transform = `translate(${this.posX + deltaX}px, ${this.posY + deltaY}px) rotateY(${this.degXonRelease}turn) rotateX(${this.degYonRelease}turn)`;
    }
}


let mouse = {
    initPosX: 0,
    initPosY: 0,
    deltaX: 0,
    deltaY: 0,


    resetInitPosByOffset() {
        [this.initPosX, this.initPosY] = [this.initPosX += this.deltaX, this.initPosY += this.deltaY];
    }
};

let superCube = new Cube(document.querySelector(".super-cube"));


let tempCubes = document.querySelectorAll(".cube");
let cubes = [];
for (let i = 0; i < tempCubes.length; ++i) {
    cubes.push(new Cube(tempCubes[i]));
}

superCube.asElement.onmousedown = e => {
    e.preventDefault();
    superCube.isFocused = true;
    [mouse.initPosX, mouse.initPosY] = getMousePos(e);
};

let keyFlags = {};


body.onmouseup = e => {
    if (superCube.isFocused) {
        if (keyFlags.Shift) {
            superCube.updateDeg(mouse.deltaX, mouse.deltaY);
        }
        else if (keyFlags.Alt) {
            superCube.updatePos(mouse.deltaX, mouse.deltaY);
        }
        else {
            cubes.forEach(cube => {
                cube.updateDeg(mouse.deltaX, mouse.deltaY);
            })
        }
    }
    superCube.isFocused = false;
};


body.onkeydown = e => {
    e.preventDefault();
    if (!superCube.isFocused)
        keyFlags[e.key] = true;
};

body.onkeyup = e => {
    if (superCube.isFocused && keyFlags[e.key]) {
        switch (e.key) {
            case "Shift":
                superCube.updateDeg(mouse.deltaX, mouse.deltaY);
                mouse.resetInitPosByOffset();
                break;
            
            case "Alt":
                superCube.updatePos(mouse.deltaX, mouse.deltaY);
                mouse.resetInitPosByOffset();
                break;
        }
    }

    keyFlags[e.key] = false;
};


function scratchElementIfNotAlready(element) {
    if (!element.classList.contains("--scratched"))
            element.classList.add("--scratched");
}


function makeElementVisibleIfNotAlready(element) {
    if (!element.classList.contains("--visible")) {
        element.classList.remove("--invisible");
        element.classList.add("--visible");
    }
}


let squareInTitle = document.getElementById("title-square");
let cubeInTitle = document.getElementById("title-cube");
body.onmousemove = e => {
    if (superCube.isFocused) {
        
        scratchElementIfNotAlready(squareInTitle);
        makeElementVisibleIfNotAlready(cubeInTitle);

        [mouse.deltaX, mouse.deltaY] = getMouseDeltaXY(e);

        if (keyFlags.Shift) {
            superCube.rotate(mouse.deltaX, mouse.deltaY);
        }
        else if (keyFlags.Alt) {
            superCube.translate(mouse.deltaX, mouse.deltaY);
        }
        else
            cubes.forEach(cube => cube.rotate(mouse.deltaX, mouse.deltaY));
    }
};

function getMousePos(e) {
    return [e.clientX, e.clientY];
}

function getMouseDeltaXY(e) {
    let [mousePosX, mousePosY] = getMousePos(e);
    return [mousePosX - mouse.initPosX, mousePosY - mouse.initPosY];
}


let audioButton = document.querySelector(".audio-button");
let stopAudioButton = document.querySelector(".stop-animation-button");
let artistCredit = document.querySelector(".artist-credit");
let userInfo = document.querySelector(".user-info");
let myAudio = document.querySelector("audio");
audioButton.onclick = e => {
    
    scratchElementIfNotAlready(squareInTitle);
    makeElementVisibleIfNotAlready(cubeInTitle);

    myAudio.play().then(startRotating());
};


function startRotating() {
    userInfo.classList.add("--invisible");

    artistCredit.classList.remove("--invisible");
    artistCredit.classList.add("--visible");

    stopAudioButton.classList.remove("--invisible");
    stopAudioButton.classList.add("--visible");

    superCube.asElement.classList.add("--spinning");
    cubes.forEach(cube => {
        cube.asElement.classList.add("--spinning");
    });

    body.classList.add("--changing-colors");
}


myAudio.onended = e => {
    stopRotating();
};


stopAudioButton.onclick = e => {
    myAudio.pause();
    stopRotating();
}


function stopRotating() {
    
    userInfo.classList.remove("--invisible");
    userInfo.classList.add("--visible");
    
    artistCredit.classList.remove("--visible");
    artistCredit.classList.add("--invisible");
    
    stopAudioButton.classList.remove("--visible");
    stopAudioButton.classList.add("--invisible");
    
    superCube.asElement.classList.remove("--spinning");
    cubes.forEach(cube => {
        cube.asElement.classList.remove("--spinning");
    });
    
    body.classList.remove("--changing-colors");
}