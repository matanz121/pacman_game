var context = canvas.getContext("2d");
var shape = new Object();
var board;
var score;
var highScore = 0;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var direction = 4; // direction for Pacman image
var ballsCount = 0;
var candyCount = 0;
var life;

Start();

function RestartTheGame() {
    document.getElementById('endGame').style.display = 'none';
    document.getElementById('canvas').style.display = 'block';
    document.getElementById('pacGame').style.display = 'block';
    ballsCount = 0;
    candyCount = 0;
    Start();
}

function Start() {
    board = new Array()
    score = 0;
    life = 3;
    pac_color = "yellow";
    var pacman_remain = 1;
    start_time = new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        for (var j = 0; j < 10; j++) {
            var randomNum = Math.random();
            if (randomNum > 0.97) {
                board[i][j] = 6; // Monster
            }
            else if (randomNum > 0.85) {
                board[i][j] = 5; // NoEntry
            }
            else if (randomNum > 0.75) {
                board[i][j] = 4; // Bomb
            }
            else if (randomNum > 0.55) {
                board[i][j] = 3; // Candy
                candyCount++;
            }
            else if (pacman_remain > 0) {
                shape.i = i;
                shape.j = j;
                pacman_remain--;
                board[i][j] = 2; // Pacman
            }
            else {
                board[i][j] = 1;
                ballsCount++;
            }
        }
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval = setInterval(UpdatePosition, 100);
}

function GetKeyPressed() {
    if (keysDown[38]) { // up
        return 1;
    }
    if (keysDown[40]) { // down
        return 2;
    }
    if (keysDown[37]) {  // left
        return 3;
    }
    if (keysDown[39]) { // right
        return 4;
    }
}

function Draw() {
    canvas.width = canvas.width;
    lblScore.value = score;
    lblTime.value = time_elapsed;
    lblLife.value = life;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] == 1) {
                context.beginPath();
                context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // eye half circle
                context.fillStyle = "black"; //color 
                context.fill();
            }
            else if (board[i][j] == 2) {
                context.beginPath();
                switch (direction) {
                    case 2: start = 0.75 * Math.PI; end = 0.25 * Math.PI; eyeX = 17; eyeY = 6; break; // down 
                    case 3: start = 1.25 * Math.PI; end = 2.85 * Math.PI; eyeX = 5; eyeY = 15; break; // left
                    case 4: start = 0.25 * Math.PI; end = 1.85 * Math.PI; eyeX = 5; eyeY = 15; break; // right
                    default: start = 1.65 * Math.PI; end = 1.25 * Math.PI; eyeX = 17; eyeY = 6; break; // up
                }
                context.arc(center.x, center.y, 30, start, end); // half circle
                context.lineTo(center.x, center.y);
                context.fillStyle = pac_color; //color 
                context.fill();
                context.beginPath();
                context.arc(center.x + eyeX, center.y - eyeY, 5, 0, 2 * Math.PI); // eye half circle
                context.fillStyle = "black"; //color 
                context.fill();
            }
            else if (board[i][j] == 3) {
                context.beginPath();
                var image = document.getElementById("candy");
                context.drawImage(image, center.x - 25, center.y - 15);
            }
            else if (board[i][j] == 4) {
                context.beginPath();
                var image = document.getElementById("bomb");
                context.drawImage(image, center.x - 15, center.y - 30);
            }
            else if (board[i][j] == 5) {
                context.beginPath();
                var image = document.getElementById("noEntry");
                context.drawImage(image, center.x - 25, center.y - 20);
            }
            else if (board[i][j] == 6) {
                context.beginPath();
                var image = document.getElementById("monster");
                context.drawImage(image, center.x - 20, center.y - 20);
            }

        }
    }
}

function UpdatePosition() {
    board[shape.i][shape.j] = 0;
    var x = GetKeyPressed();
    if (x == 1) // up
    {
        if (shape.j > 0 && board[shape.i][shape.j - 1] != 5) {
            shape.j--;
            direction = 1;
        }
    }
    else if (x == 2) // down
    {
        if (shape.j < 9 && board[shape.i][shape.j + 1] != 5) {
            shape.j++;
            direction = 2;
        }
    }
    else if (x == 3) // left
    {
        if (shape.i > 0 && board[shape.i - 1][shape.j] != 5) {
            shape.i--;
            direction = 3;
        }
    }
    else if (x == 4) // right
    {
        if (shape.i < 9 && board[shape.i + 1][shape.j] != 5) {
            shape.i++;
            direction = 4;
        }
    }
    if (board[shape.i][shape.j] == 1) // balls
    {
        document.getElementById('eatBallsAudio').play();
        score++;
        ballsCount--;
        if(candyCount == 0 && ballsCount == 0)
        {
            gameOver();
        }
    }
    else if (board[shape.i][shape.j] == 3) // candy
    {
        document.getElementById('eatCandyAudio').play();
        score += 3;
        candyCount--;
        if(candyCount == 0 && ballsCount == 0)
        {
            gameOver();
        }
    }
    else if (board[shape.i][shape.j] == 4) // bomb
    {
        document.getElementById('eatBombAudio').play();
        if (score >= 2) {
            score -= 2;
        }
        else {
            score = 0;
        }
    }
    else if (board[shape.i][shape.j] == 6) // monster
    {
        life--;
        if (life == 0) {
            document.getElementById('deathAudio').play();
            gameOver();
        }
        else {
            document.getElementById('eatMonsterAudio').play();
        }
    }
    board[shape.i][shape.j] = 2;
    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000;
    if (score >= 30 && time_elapsed <= 10) {
        pac_color = "green";
    }
    if (time_elapsed > 50) {
        document.getElementById('deathAudio').play();
        gameOver();
    }
    else {
        Draw();
    }
}

function gameOver() {
    clearInterval(interval);
    document.getElementById('canvas').style.display = 'none';
    document.getElementById('pacGame').style.display = 'none';
    document.getElementById('endGame').style.display = 'block';
    document.getElementById('newHighScore').style.display = 'none';
    if (score > highScore) {
        highScore = score;
        document.getElementById('newHighScore').style.display = 'block';
        document.getElementById('newHighScore').innerHTML = "This is the highest score until now";
    }
    document.getElementById('currentScore').innerHTML = "Your score is: " + score;
    document.getElementById('timeLeft').innerHTML = "Time passed: " + time_elapsed;
    document.getElementById('highScore').innerHTML = "The High score is: " + highScore;

}