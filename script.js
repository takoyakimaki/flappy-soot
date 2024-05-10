//board
let board;
let boardWidth =360;
let boardHeight = 575;
let context;

//soot
let sootWidth = 44; 
let sootHeight = 34;
let sootX =boardWidth/8;
let sootY = boardHeight/2


let soot = {
    x : sootX,
    y :sootY,
    width : sootWidth,
    height : sootHeight
}

//pipes

let pipeArray = [];
pipeWidth = 64; // 384/3072 = 1/8
pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//game physics
let originalVelocityX = -2;
let velocityX = originalVelocityX;//pipe moving
let velocityY = 0; //soot jump speed
let gravity = 0.4;

let gameStart = false;
let gameOver = false;
let score = 0;
let jump = false;
let bestScore = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //load image
    sootImg = new Image ();
    sootImg.src = "./soot.png";
    sootImg.onload = function(){
        context.drawImage (sootImg, soot.x, soot.y, soot.width, soot.height);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 secs
    document.addEventListener("keydown", movesoot);
}

function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, boardWidth, boardHeight);

    //soot
    
    soot.y = Math.max(soot.y +velocityY, 0); //make sure soot does not passed the top of canvas
    if (jump) {
        velocityY += gravity; // Apply gravity only if the soot has jumped
    }
    context.drawImage(sootImg, soot.x, soot.y, soot.width, soot.height);

    if (soot.y > boardHeight){
        gameOver = true;
    }

    //pipes
    if (gameStart || jump) {
        for (let i = 0; i < pipeArray.length; i++){
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
            if (!pipe.passed && soot.x > pipe.x +pipe.width){
                score += 0.5; //bcs there are 2 pipes
                pipe.passed = true;

                bestScore = Math.max(score, bestScore);

                if (score % 20 === 0) {
                    // Increase pipe velocity
                    velocityX -= 0.5;
                }  

            }
            if (detectCollision(soot, pipe)){
                gameOver = true;
            }
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); // remove first element from the array
    }
    
 
    if(gameOver){
        context.fillText("GAME OVER", 110, 270);
    }
    context.fillStyle = "white";
    context.font = "24px sans-serif";
    context.fillText("SCORE: " + score, 10, 30);
    context.fillText("BEST: " + bestScore, 10, 60); 
}

function placePipes(){
    if (gameOver){
        return;
    }
    let rightmostPipeX = 0;
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        if (pipe.x > rightmostPipeX) {
            rightmostPipeX = pipe.x;
        }
    }

    if (boardWidth - rightmostPipeX > pipeWidth * 2) { // Adjust the multiplier as needed
        let randomPipeY = pipeY- pipeHeight/4 -Math.random()* (pipeHeight/2); //TO REDUCE THE HEIGHT OF PIPE IN THE DISPLAY
        let openingSpace = board.height/4;
        
        let topPipe = {
            img: topPipeImg,
            x : pipeX,
            y : randomPipeY,
            width : pipeWidth,
            height : pipeHeight,
            passed : false //to see if flappy soot already passed pipe
        }

        pipeArray.push(topPipe);

        let bottomPipe = {
            img : bottomPipeImg,
            x :pipeX,
            y :randomPipeY +pipeHeight + openingSpace,
            width : pipeWidth, 
            height : pipeHeight,
            passed : false
        }
        pipeArray.push(bottomPipe);

        }
}

function resetGame() {
    soot.y = sootY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    velocityX = originalVelocityX; // Reset pipe velocity
}

function movesoot(e){ //e for key event
    if (e.code == "Space" || e.code =="ArrowUp" || e.code == "KeyX"){
        
        velocityY = -6;
        jump = true;

        //reset game
         if (gameOver){
            resetGame();
         }
    }
}

function detectCollision (a,b){
    return  a.x < b.x +b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}
