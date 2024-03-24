const btn = document.querySelector('.pacman');
let position = { x: 0, y: 0 };
let dx = 0;
let dy = 0;
let score = 0;
const gameContainer = document.querySelector('.game-container');
const obstacles = document.querySelectorAll('.obstacle');
const enemies = [
    { x: 200, y: 50, dx: 0, dy: 2, element: document.getElementById('enemy1') }, // Moves upward and downward
    { x: 50, y: 300, dx: 2, dy: 0, element: document.getElementById('enemy2') }, // Moves left and right
    { x: 400, y: 100, dx: -2, dy: 2, element: document.getElementById('enemy3') }, // Moves diagonally
    { x: 200, y: 200, element: document.getElementById('enemy4') } // Chases Pacman
];

function updatePosition() {
    position.x += dx;
    position.y += dy;

    // Check for collisions with obstacles
    obstacles.forEach(obstacle => {
        if (
            position.x < obstacle.offsetLeft + obstacle.offsetWidth &&
            position.x + btn.offsetWidth > obstacle.offsetLeft &&
            position.y < obstacle.offsetTop + obstacle.offsetHeight &&
            position.y + btn.offsetHeight > obstacle.offsetTop
        ) {
            // Collision detected, move away from the obstacle
            if (dx > 0) position.x = obstacle.offsetLeft - btn.offsetWidth;
            else if (dx < 0) position.x = obstacle.offsetLeft + obstacle.offsetWidth;
            if (dy > 0) position.y = obstacle.offsetTop - btn.offsetHeight;
            else if (dy < 0) position.y = obstacle.offsetTop + obstacle.offsetHeight;
        }
    });

    // Check for collisions with game container boundaries
    if (position.x < 0) position.x = 0;
    if (position.x + btn.offsetWidth > gameContainer.offsetWidth) position.x = gameContainer.offsetWidth - btn.offsetWidth;
    if (position.y < 0) position.y = 0;
    if (position.y + btn.offsetHeight > gameContainer.offsetHeight) position.y = gameContainer.offsetHeight - btn.offsetHeight;

    // Update Pacman's position
    btn.style.left = position.x + 'px';
    btn.style.top = position.y + 'px';

    // Move enemies
enemies.forEach(enemy => {
    // If it's the chasing enemy, update its movement direction
    if (enemy === enemies[3]) {
        const dx_enemy = position.x - enemy.x;
        const dy_enemy = position.y - enemy.y;
        const magnitude = Math.sqrt(dx_enemy * dx_enemy + dy_enemy * dy_enemy);
        enemy.dx = dx_enemy / magnitude;
        enemy.dy = dy_enemy / magnitude;
    }
    
    // Update enemy's position
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;

    // Check for collision with game container boundaries
    if (enemy.x < 0 || enemy.x + enemy.element.offsetWidth > gameContainer.offsetWidth) {
        // Reverse horizontal direction upon collision with game container boundaries
        enemy.dx = -enemy.dx;
    }
    if (enemy.y < 0 || enemy.y + enemy.element.offsetHeight > gameContainer.offsetHeight) {
        // Reverse vertical direction upon collision with game container boundaries
        enemy.dy = -enemy.dy;
    }

    // Update enemy's position after collision with game container boundaries
    enemy.element.style.left = enemy.x + 'px';
    enemy.element.style.top = enemy.y + 'px';

    // Check for collision with Pacman
    if (
        position.x < enemy.x + enemy.element.offsetWidth &&
        position.x + btn.offsetWidth > enemy.x &&
        position.y < enemy.y + enemy.element.offsetHeight &&
        position.y + btn.offsetHeight > enemy.y
    ) {
        alert('Game Over!');
        clearInterval(interval);
    }

    // Check for collisions with obstacles
    obstacles.forEach(obstacle => {
        if (
            enemy.x < obstacle.offsetLeft + obstacle.offsetWidth &&
            enemy.x + enemy.element.offsetWidth > obstacle.offsetLeft &&
            enemy.y < obstacle.offsetTop + obstacle.offsetHeight &&
            enemy.y + enemy.element.offsetHeight > obstacle.offsetTop
        ) {
            // Reverse enemy's direction upon collision with an obstacle
            enemy.dx = -enemy.dx;
            enemy.dy = -enemy.dy;
        }
    });
});


    // Update Score
    score++;
    document.getElementById('scoreboard').innerText = 'Score: ' + score;
}

document.addEventListener('keydown', function(event) {
    switch(event.keyCode) {
        case 37:
            dx = -2;
            dy = 0;
            break;
        case 38:
            dx = 0;
            dy = -2;
            break;
        case 39:
            dx = 2;
            dy = 0;
            break;
        case 40:
            dx = 0;
            dy = 2;
            break;
    }
});

const interval = setInterval(updatePosition, 20);

