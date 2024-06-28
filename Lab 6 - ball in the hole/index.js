document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const hole = document.getElementById('hole');
    const gameArea = document.getElementById('gameArea');
    const gameWidth = gameArea.clientWidth;
    const gameHeight = gameArea.clientHeight;

    const joystick = document.getElementById('joystick');
    const joystickContainer = document.getElementById('joystickContainer');
    const joystickContainerRect = joystickContainer.getBoundingClientRect();
    const joystickMaxRadius = joystickContainer.offsetWidth / 2 - joystick.offsetWidth / 2;

    let ballPos = { x: Math.random() * (gameWidth - 30), y: Math.random() * (gameHeight - 30) };
    let holePos = { x: Math.random() * (gameWidth - 50), y: Math.random() * (gameHeight - 50) };

    ball.style.left = ballPos.x + 'px';
    ball.style.top = ballPos.y + 'px';
    hole.style.left = holePos.x + 'px';
    hole.style.top = holePos.y + 'px';

    let startTime;
    let gameActive = false;

    function startGame() {
        gameActive = true;
        startTime = Date.now();
    }

    function stopGame() {
        gameActive = false;
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        alert(`Udało Ci się! Czas: ${duration} sekund`);
        logRecord(duration);
        resetGame();
    }

    function logRecord(time) {
        let records = JSON.parse(localStorage.getItem('records')) || [];
        records.push(time);
        localStorage.setItem('records', JSON.stringify(records));
        console.log('Rekordy:', records);
    }

    function resetGame() {
        ballPos = { x: Math.random() * (gameWidth - 30), y: Math.random() * (gameHeight - 30) };
        holePos = { x: Math.random() * (gameWidth - 50), y: Math.random() * (gameHeight - 50) };

        ball.style.left = ballPos.x + 'px';
        ball.style.top = ballPos.y + 'px';
        hole.style.left = holePos.x + 'px';
        hole.style.top = holePos.y + 'px';

        startGame();
    }

    function checkCollision() {
        const ballRect = ball.getBoundingClientRect();
        const holeRect = hole.getBoundingClientRect();
        return (
            ballRect.left < holeRect.left + holeRect.width &&
            ballRect.left + ballRect.width > holeRect.left &&
            ballRect.top < holeRect.top + holeRect.height &&
            ballRect.top + ballRect.height > holeRect.top
        );
    }

    function moveBall(x, y) {
        if (!gameActive) return;

        ballPos.x += x;
        ballPos.y += y;

        ballPos.x = Math.min(Math.max(0, ballPos.x), gameWidth - 30);
        ballPos.y = Math.min(Math.max(0, ballPos.y), gameHeight - 30);

        ball.style.left = ballPos.x + 'px';
        ball.style.top = ballPos.y + 'px';

        if (checkCollision()) {
            stopGame();
        }
    }

    function handleJoystickMove(event) {
        const rect = joystickContainer.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(offsetY, offsetX);
        const distance = Math.min(joystickMaxRadius, Math.sqrt(offsetX * offsetX + offsetY * offsetY));
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);

        joystick.style.transform = `translate(${x}px, ${y}px)`;

        moveBall(x / 10, y / 10);
    }

    function handleJoystickEnd() {
        joystick.style.transform = 'translate(-50%, -50%)';
    }

    joystickContainer.addEventListener('mousedown', (event) => {
        document.addEventListener('mousemove', handleJoystickMove);
        document.addEventListener('mouseup', handleJoystickEnd);
    });

    joystickContainer.addEventListener('touchstart', (event) => {
        document.addEventListener('touchmove', handleJoystickMove);
        document.addEventListener('touchend', handleJoystickEnd);
    });

    startGame();
});
