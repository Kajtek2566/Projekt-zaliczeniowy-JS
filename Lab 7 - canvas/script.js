const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const numBallsInput = document.getElementById('numBalls');
const distanceInput = document.getElementById('distance');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

let balls = [];
let animationFrameId;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Ball {
    constructor(x, y, vx, vy, radius) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx = -this.vx;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy = -this.vy;
        }
    }
}

function distance(ball1, ball2) {
    return Math.sqrt((ball1.x - ball2.x) ** 2 + (ball1.y - ball2.y) ** 2);
}

function drawLine(ball1, ball2) {
    ctx.beginPath();
    ctx.moveTo(ball1.x, ball1.y);
    ctx.lineTo(ball2.x, ball2.y);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

function createBalls(numBalls) {
    balls = [];
    for (let i = 0; i < numBalls; i++) {
        const radius = 10;
        const x = Math.random() * (canvas.width - 2 * radius) + radius;
        const y = Math.random() * (canvas.height - 2 * radius) + radius;
        const vx = (Math.random() - 0.5) * 2;
        const vy = (Math.random() - 0.5) * 2;
        balls.push(new Ball(x, y, vx, vy, radius));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const maxDistance = parseFloat(distanceInput.value);
    balls.forEach(ball => {
        ball.update();
        ball.draw();
    });

    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            if (distance(balls[i], balls[j]) < maxDistance) {
                drawLine(balls[i], balls[j]);
            }
        }
    }

    animationFrameId = requestAnimationFrame(animate);
}

startButton.addEventListener('click', () => {
    const numBalls = parseInt(numBallsInput.value, 10);
    createBalls(numBalls);
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animate();
});

resetButton.addEventListener('click', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls = [];
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    animate();
});
