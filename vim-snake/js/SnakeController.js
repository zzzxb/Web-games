window.onload = run;
document.onkeydown = keyDown;

const world = {width:50, height:50, size: 6};
const init_snakeLength = 3; // 不能超过窗口 width 的一半

let goto_xy = objArray(world.width, world.height);
let snake_x = new Array(), snake_y = new Array(),
    food_x = new Array(), food_y = new Array();
let keyCode, mode, foodNum, speed, score, game;
let gameOverAudio = new Audio("assets/over.mp3");
let bgm = new Audio("assets/bg.mp3");
let gold = new Audio("assets/sfx.wav");

function run() {
    createWorld();
    init();
}

function init() {
    clearScreen();
    game = false; // 暂停游戏
    score = 0; // 初始化分数
    foodNum = 2; // 食物初始数量
    speed = 100 // 初始化速度
    keyCode = 0; // 用于判断方向
    mode = false; // 用于判断模式
    // 清空数组
    snake_x = [];
    snake_y = [];
    food_x = [];
    food_y = [];
    initSnake();
}

function render() {
    if(game) {
        control();
        getFood();
        createFood();
        drawSnake();
    }
}

function getFood() {
    for (let i = 0; i < food_x.length; i++) {
        if (mode && snake_x[0] == food_x[i] && snake_y[0] == food_y[i]) {
            gold.play();
            food_x.splice(i,1);
            food_y.splice(i,1);
            foodNum ++;
            score ++;
        }
    }
    document.getElementById("score").innerHTML = " " + score;
}

let start;
function keyDown(e) {
    if (game && (e.which == 27 || (e.ctrlKey && e.which == 219))) { // esc 或 control + [
        mode = false;
    }else if (e.which == 73) { // i -> insert
        mode = true;
        if (!game) {
            init();
            bgm.loop = true;
            bgm.play();
            keyCode = 74;
            game = true;
            window.clearInterval(start);
            clearScreen();
            start = window.setInterval("render()", speed);
        }
    }

    if (game && !mode) {
        switch(e.which) {
            case 72: if (keyCode != 76) keyCode = 72; break; // h -> left
            case 74: if (keyCode != 75) keyCode = 74; break; // j -> down
            case 75: if (keyCode != 74) keyCode = 75; break; // k -> up
            case 76: if (keyCode != 72) keyCode = 76; break; // l - right
        }
    }
}

function control() {
    let x = 0, y = 0;
    switch (keyCode) {
        case 72: x = 0; y = -1; break;
        case 76: x = 0; y = 1; break;
        case 75: x = -1; y = 0; break;
        case 74: x = 1; y = 0; break;
    }
    snake_x.unshift(snake_x[0] + x);
    snake_y.unshift(snake_y[0] + y);
    gameOverOrwine();
}

function logo(){
    goto_xy[10][10].style.backgroundColor = "red";
}

function  clearScreen() {
    for (let i = 0; i < world.width; i++) {
        for (let j = 0; j < world.height; j++) {
            goto_xy[i][j].style.backgroundColor = "rgba(0,0,0,0)";
        }
    }
}

function createFood() {
    let superposition = true;
    for (let i = 0; i < foodNum; i++) { //生成食物后食物减少
        if (foodNum > 0) {
            let x = Math.round(Math.random() * world.width - 1);
            let y = Math.round(Math.random() * world.height - 1);
            food_x.unshift(x);
            food_y.unshift(y);
            foodNum--;
        }
    }
    for (let i = 0; i < food_x.length; i++) {
        goto_xy[food_x[i]][food_y[i]].style.backgroundColor = "#fdb933";
    }
}

function drawSnake() {
    for (let i = 0; i < snake_x.length; i++) {
            goto_xy[snake_x[i]][snake_y[i]].style.backgroundColor = "#586e3d";
    }
    if ((score + init_snakeLength) < snake_x.length)
        goto_xy[snake_x.pop()][snake_y.pop()].style.backgroundColor = "rgba(0,0,0,0)";
}

function initSnake() {
    if (init_snakeLength > 0 &&  init_snakeLength < world.width/2){
        for (let i = 0; i < init_snakeLength ; i++) {
            snake_x[i] = (world.width / 2) - i;
            snake_y[i] = world.height / 2;
        }
    }
    else{
        alert("你的牙签不合格!");
    }
}

function createWorld() {
    // 获取和创建标签
    const body = document.getElementById("body");
    const box = document.getElementById("box");
    const screen = document.getElementById("screen");
    screen.appendChild(document.createElement("table"));
    const table = document.getElementsByTagName("table")[0];
    // 加入css样式
    style(body, box, screen, table);
    // 添加表格
    for (let i = 0; i < world.height; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < world.width; j++) {
            let td = document.createElement("td");
            td.style.width = (world.size/16) + "em";
            td.style.height = (world.size/16) + "em";
            goto_xy[i][j] = tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function style(body, box, screen, table) {
    // body.style.backgroundColor = "darkcyan";
    body.style.backgroundColor = "#586e3d";
    box.style.textAlign = "center";
    box.style.margin = "0 auto"
    box.style.width = (((world.size+2) * world.width)/16)+ "em";
    screen.style.border = "1px solid black";
    table.style.backgroundColor = "#92ae57";
    table.style.borderpadding = "0";
    table.style.borderSpacing = "0";
}

function objArray(line, row) {
    let to_xy = new Array(line);
    for (let i = 0; i < row; i++) {
        to_xy[i] = new Array(row);
    }
    return to_xy;
}

function gameOverOrwine() {
    for (let i = 1; i < snake_x.length; i++) {
        if ((snake_x[0] == snake_x[i]) && (snake_y[0] == snake_y[i])) {
            game = false;
            bgm.pause();
            alert("Game Over !")
            gameOverAudio.play();
            clearScreen();
            init();
        }
    }
    if (snake_x[0] < 0 || snake_y[0] < 0 ||
        snake_x[0] > world.width-1 || snake_y[0] > world.height - 1) {
            game = false;
            bgm.pause();
            gameOverAudio.play();
            alert("Game Over !")
            clearScreen();
            init();
    }else if ((score + init_snakeLength) == (world.width * world.height) ) {
        alert("Winner !")
            clearScreen();
            init();
    }

}