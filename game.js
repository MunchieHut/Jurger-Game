const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player setup
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    spriteIndex: 0,
    direction: 'down'
};

const spriteSheet = new Image();
spriteSheet.src = "jurger_sprites.png"; // Placeholder for sprite sheet

const sauces = [];
const sauceSpeed = 7;

// Save player position
function saveGame() {
    localStorage.setItem("playerX", player.x);
    localStorage.setItem("playerY", player.y);
    localStorage.setItem("playerDirection", player.direction);
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Update player position
function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
    saveGame();
}

// Draw sauces
function drawSauces() {
    ctx.fillStyle = "red";
    sauces.forEach(sauce => {
        ctx.beginPath();
        ctx.arc(sauce.x, sauce.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Update sauces
function updateSauces() {
    for (let i = sauces.length - 1; i >= 0; i--) {
        if (sauces[i].direction === 'up') sauces[i].y -= sauceSpeed;
        if (sauces[i].direction === 'down') sauces[i].y += sauceSpeed;
        if (sauces[i].direction === 'left') sauces[i].x -= sauceSpeed;
        if (sauces[i].direction === 'right') sauces[i].x += sauceSpeed;

        if (sauces[i].x < 0 || sauces[i].x > canvas.width || sauces[i].y < 0 || sauces[i].y > canvas.height) {
            sauces.splice(i, 1);
        }
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawSauces();
    updatePlayer();
    updateSauces();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowUp" || event.code === "KeyW") player.dy = -player.speed;
    if (event.code === "ArrowDown" || event.code === "KeyS") player.dy = player.speed;
    if (event.code === "ArrowLeft" || event.code === "KeyA") player.dx = -player.speed;
    if (event.code === "ArrowRight" || event.code === "KeyD") player.dx = player.speed;
    if (event.code === "Space") {
        sauces.push({ x: player.x + player.width / 2, y: player.y + player.height / 2, direction: player.direction });
    }
});

document.addEventListener("keyup", (event) => {
    if (["ArrowUp", "ArrowDown", "KeyW", "KeyS"].includes(event.code)) player.dy = 0;
    if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(event.code)) player.dx = 0;
});

gameLoop();