const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = 800;
const height = 400;
const playerSize = 80;
const gravity = 0.5;
const jumpStrength = 10;
const obstacleWidth = 120;
const obstacleHeight = 40;
const coinRadius = 20;
const coinDiameter = 2 * coinRadius;
const jumpSound = new Audio('./assets/jump.mp3');
const coinSound = new Audio('./assets/coin.mp3');
const gameoverSound = new Audio('./assets/game-over.mp3');
const playerImage = new Image();
playerImage.src = './assets/boneco.png';
const obstacleImage = new Image();
obstacleImage.src = './assets/obs.png';
const coinImage = new Image();
coinImage.src = './assets/coin.png';

canvas.width = width;
canvas.height = height;

let player = {
  x: 100,
  y: height - playerSize,
  width: playerSize,
  height: playerSize,
  vy: 0,
  jumping: false
};

let obstacles = [];
let coins = [];
let score = 0;
let gameRunning = true;

function drawPlayer() {
  const playerX = player.x - player.width / 2;
  const playerY = player.y - player.height / 2;
  ctx.drawImage(playerImage, playerX, playerY, player.width, player.height);
}

function drawObstacle(obstacle) {
  const obstacleX = obstacle.x - obstacleWidth / 2;
  const obstacleY = obstacle.y - obstacleHeight / 2;
  ctx.drawImage(obstacleImage, obstacleX, obstacleY, obstacleWidth, obstacleHeight);
}

function drawCoin(coin) {
  const coinX = coin.x - coinRadius;
  const coinY = coin.y - coinRadius;
  ctx.drawImage(coinImage, coinX, coinY, coinDiameter, coinDiameter);
}

function drawScore() {
  ctx.font = '24px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Pontos: ' + score, 10, 30);
}

function updatePlayer() {
  if (player.jumping) {
    player.vy -= jumpStrength;
    player.jumping = false;
    jumpSound.play();
  }

  if (player.y < 0) {
    player.y = 0;
    player.vy = 0;
  }

  player.y += player.vy;
  player.vy += gravity;

  if (player.y + player.height > height) {
    player.y = height - player.height;
    player.vy = 0;
  }
}

function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= 5;

    if (obstacles[i].x + obstacleWidth < 0) {
      obstacles.splice(i, 1);
      i--;
    }
  }

  if (obstacles.length < 5 && Math.random() < 0.01) {
    obstacles.push({
      x: width,
      y: height - obstacleHeight
    });
  }
}

function updateCoins() {
  for (let i = 0; i < coins.length; i++) {
    coins[i].x -= 5;

    if (coins[i].x + coinRadius < 0) {
      coins.splice(i, 1);
      i--;
    }
  }

  if (coins.length < 3 && Math.random() < 0.01) {
    coins.push({
      x: width,
      y: Math.random() * (height - coinRadius * 2) + coinRadius
    });
  }
}

function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    if (
      player.x < obstacles[i].x + obstacleWidth &&
      player.x + player.width > obstacles[i].x &&
      player.y < obstacles[i].y + obstacleHeight &&
      player.y + player.height > obstacles[i].y
    ) {
      gameOver();
    }
  }

  for (let i = 0; i < coins.length; i++) {
    if (
      player.x < coins[i].x + coinRadius &&
      player.x + player.width > coins[i].x &&
      player.y < coins[i].y + coinRadius &&
      player.y + player.height > coins[i].y
    ) {
      coins.splice(i, 1);
      i--;
      score++;
      coinSound.play();
    }
  }
}

function gameOver() {
  gameoverSound.play();
  gameRunning = false;
  ctx.clearRect(0, 0, width, height);
  ctx.font = '32px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Game Over!', width / 2 - 80, height / 2 - 10);
  ctx.font = '24px Arial';
  ctx.fillText('Pontos: ' + score, width / 2 - 80, height / 2 + 30);
  document.getElementById('game-over').style.display = 'block';
}

function resetGame() {
  player.x = 100;
  player.y = height - playerSize;
  player.vy = 0;
  obstacles = [];
  coins = [];
  score = 0;
  gameRunning = true;
  document.getElementById('game-over').style.display = 'none';
  loop();
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  drawPlayer();

  for (let i = 0; i < obstacles.length; i++) {
    drawObstacle(obstacles[i]);
  }

  for (let i = 0; i < coins.length; i++) {
    drawCoin(coins[i]);
  }

  drawScore();
}

function update() {
  updatePlayer();
  updateObstacles();
  updateCoins();
  checkCollisions();

  if (gameRunning) {
    requestAnimationFrame(loop);
  }
}

function loop() {
  draw();
  update();
}

function jump() {
  if (!player.jumping) {
    player.jumping = true;
  }
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'KeyW' || event.code === 'ArrowUp') {
    jump();
  }
});

document.getElementById('jump-button').addEventListener('click', jump);

document.getElementById('restart-button').addEventListener('click', resetGame);

loop();
