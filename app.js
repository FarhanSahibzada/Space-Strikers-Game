// board
let board;
let boardwidth = 720;
let boardheight = 500;
let context;

// ship
let shipwidth = 80;
let shipheight = 60;
let shipimage;
let ship = {
    x: boardwidth / 2 - 40,
    y: boardheight - 80,
    height: shipheight,
    width: shipwidth,
}
let velocitx = 20;

//fire 
let fireheight = 40;
let firewidth = 40;
let fireimage;
let fire = {
    x: boardwidth / 2 - 20,
    y: boardheight - 100,
    width: firewidth,
    height: fireheight,
    active: false
}

// emeny
let enemyarr = []
let enemywidth = 60;
let enemyheight = 40;
let enemyimage;
let enemyx = boardwidth / 2 - 20;
let enemyy = 0;

// game over 
let gameover = false;
let enemyInterval;
// startbtn
let div1 = document.querySelector(".displays");
let startbtn = document.getElementById("start");
// play again btn
let div2 = document.querySelector(".displaya");
let playagainbtn = document.getElementById("again");
// score
let score = 0;
let showscore = document.getElementById("showscore");
// for mobile btns
let mobilebtn =  document.querySelector(".shortbtn");
let holdDuration = 100;
let holdInterval;



window.onload = function () {
    board = document.getElementById("board");
    boardwidth = Math.min(720, window.innerWidth - 20);  // Max width of 720, but smaller if the screen is smaller
    boardheight = Math.min(500, window.innerHeight - 20);
      // Max height of 500, but smaller if the screen is smaller
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d");

    shipimage = new Image();
    shipimage.src = "images/ship.png";
    fireimage = new Image();
    fireimage.src = "images/fire.png";
    enemyimage = new Image();
    enemyimage.src = "images/enemy.png";

    startbtn.addEventListener("click", startGame);
    playagainbtn.addEventListener("click", resetGame);
    mobilebtn.addEventListener("click", clickbtn);
    mobilebtn.addEventListener('touchstart', (event) => {
        event.preventDefault(); // Prevents default touch action
        clickbtn(event);
        holdInterval = setInterval(() => {
            clickbtn(event)
        }, holdDuration)
    });
    mobilebtn.addEventListener('touchend', (event) => {
        event.preventDefault();
        clearInterval(holdInterval);
    });
    mobilebtn.addEventListener('touchcancel', (event) => {
        event.preventDefault();
        clearInterval(holdInterval);
    });
}

function startGame() {
    ship.x = boardwidth / 2 - ship.width / 2;
    ship.y = boardheight - ship.height - 20;
    
    // Recalculate fire position based on ship's new position
    fire.x = ship.x + (ship.width / 2) - (fire.width / 2);
    fire.y = ship.y - fire.height;
    enemyInterval = setInterval(placeenemy, 1200);
    requestAnimationFrame(engine);
    document.addEventListener("keydown", moveship);
    div1.style.display = "none";
}

function resetGame() {
    clearInterval(enemyInterval);
    enemyarr = [];
    firetrue = false;
    gameover = false;
    score = 0;
    ship.x = boardwidth / 2 - 40;
    ship.y = boardheight - 80;
    fire.x = boardwidth / 2 - 20;
    fire.y = boardheight - 100;
    div2.style.display = "none";
    startGame();
}
function engine() {
    if (gameover) {
        return
    }
    context.clearRect(0, 0, boardwidth, boardheight);

    //ship
    context.drawImage(shipimage, ship.x, ship.y, ship.width, ship.height);
    //fire

    if (fire.active) {
        context.drawImage(fireimage, fire.x, fire.y, fire.width, fire.height);
        fire.y -= 15;
        if (fire.y <= 0) {
            fire.active = false;
            fire.y = ship.y - 20;
        }
    }
    for (let i = 0; i < enemyarr.length; i++) {
        let enemmy = enemyarr[i];
        enemmy.y += 2;
        context.drawImage(enemmy.img, enemmy.x, enemmy.y, enemmy.width, enemmy.height);
        if (iscollision(ship, enemmy, 33)) {
            clearInterval(enemyInterval);
            gameover = true;
            showscore.innerHTML = score;
            div2.style.display = "block";
        }
        if (collision(enemmy, fire, 30)) {
            score += 1;
            fire.active = false;
            fire.y = ship.y - 20;
            firetrue = false;
            enemyarr.splice(i, 1);
            i--;
        }

    }

    while (enemyarr.length > 0 && enemyarr[0].y > boardheight) {
        enemyarr.shift();
        showscore.innerHTML = score;
        gameover = true;
        clearInterval(enemyInterval);
        div2.style.display = "block";
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 15, 45)


    requestAnimationFrame(engine);
}

function placeenemy() {
    let randomx = Math.random() * (boardwidth - enemywidth);
    let enemy = {
        img: enemyimage,
        x: randomx,
        y: enemyy,
        width: enemywidth,
        height: enemyheight,
        passed: false
    }
    enemyarr.push(enemy)
    console.log(enemyarr.length);
}

function xpostion(xover) {
    return (xover < 0 || xover > boardwidth - shipwidth + 10)
}
function ypostion(xover) {
    return (xover < 0 || xover > boardheight - shipheight)
}
function moveship(e) {
    if (e.code == "ArrowLeft") {
        let over = ship.x - velocitx;
        let o = fire.x - velocitx;
        if (!xpostion(over)) {
            ship.x = over;
            if (fire.active) {
                fire.x = o;
            }
        }
    }
    else if (e.code == "ArrowRight") {
        let over = ship.x + velocitx;
        let o = fire.x + velocitx;
        if (!xpostion(over)) {
            ship.x = over;
            if (fire.active) {
                fire.x = o;
            }
        }
    }
    else if (e.code == "ArrowUp") {
        let over = ship.y - velocitx;
        let o = fire.y - velocitx;
        if (!ypostion(over)) {
            ship.y = over;
            if (fire.active) {
                fire.y = o;
            }
        }
    }
    else if (e.code == "ArrowDown") {
        let over = ship.y + velocitx;
        let o = fire.y + velocitx;
        if (!ypostion(over)) {
            ship.y = over;
            if (fire.active) {
                fire.y = o;
            }
        }
    }
    else if (e.code == "Space") {
        if (!fire.active) {
            fire.active = true;
            fire.x = ship.x + (ship.width / 2) - (fire.width / 2);
            fire.y = ship.y - fire.height;
        }
    }
}

function clickbtn(e) {

    if (e.target.id == "left") {
        let over = ship.x - velocitx;
        let o = fire.x - velocitx;
        if (!xpostion(over)) {
            ship.x = over;
            if (fire.active) {
                fire.x = o;
            }
        }
    }
    else if (e.target.id == "right") {
        let over = ship.x + velocitx;
        let o = fire.x + velocitx;
        if (!xpostion(over)) {
            ship.x = over;
            if (fire.active) {
                fire.x = o;
            }
        }
    }
    else if (e.target.id == "up") {
        let over = ship.y - velocitx;
        let o = fire.y - velocitx;
        if (!ypostion(over)) {
            ship.y = over;
            if (fire.active) {
                fire.y = o;
            }
        }
    }
    else if (e.target.id == "down") {
        let over = ship.y + velocitx;
        let o = fire.y + velocitx;
        if (!ypostion(over)) {
            ship.y = over;
            if (fire.active) {
                fire.y = o;
            }
        }
    }
    else if (e.target.id == "firebtn") {
        if (!fire.active) {
            fire.active = true;
            fire.x = ship.x + (ship.width / 2) - (fire.width / 2);
            fire.y = ship.y - fire.height;
        }
    }



}


function collision(a, b, gap) {
    return a.x < b.x + b.width - gap &&
        a.x + a.width - gap > b.x &&
        a.y < b.y + b.height - gap &&
        a.y + a.height - gap > b.y;
}
function iscollision(a, b, gap, gapp = 10) {
    return a.x < b.x + b.width - gapp &&
        a.x + a.width - gapp > b.x &&
        a.y < b.y + b.height - gap &&
        a.y + a.height - gap > b.y;
}
