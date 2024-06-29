document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const hole = document.getElementById('hole');
    const gameArea = document.getElementById('gameArea');
    const joystick = document.getElementById('joystick');
    const joystickContainer = document.getElementById('joystickContainer');
    const joystickMaxRadius = joystickContainer.offsetWidth / 2 - joystick.offsetWidth / 2;

    let ballPos = { x: Math.random() * (gameArea.clientWidth - 30), y: Math.random() * (gameArea.clientHeight - 30) };
    let holePos = { x: Math.random() * (gameArea.clientWidth - 50), y: Math.random() * (gameArea.clientHeight - 50) };

    ball.style.left = ballPos.x + 'px';
    ball.style.top = ballPos.y + 'px';
    hole.style.left = holePos.x + 'px';
    hole.style.top = holePos.y + 'px';

    let gameActive = true;
    let joystickActive = false;
    let joystickDirection = { x: 0, y: 0 };
    let joystickInterval;
    let startTime;

    function moveBall(x, y) {
        if (!gameActive) return;

        ballPos.x += x;
        ballPos.y += y;

        ballPos.x = Math.min(Math.max(0, ballPos.x), gameArea.clientWidth - 30);
        ballPos.y = Math.min(Math.max(0, ballPos.y), gameArea.clientHeight - 30);

        ball.style.left = ballPos.x + 'px';
        ball.style.top = ballPos.y + 'px';

        if (checkCollision()) {
            gameActive = false;
            const endTime = new Date().getTime();
            const timeTaken = (endTime - startTime) / 1000; // in seconds
            alert(`Udało Ci się! Twój czas: ${timeTaken.toFixed(2)} sekundy.`);
            resetGame();
        }
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

    function resetGame() {
        ballPos = { x: Math.random() * (gameArea.clientWidth - 30), y: Math.random() * (gameArea.clientHeight - 30) };
        holePos = { x: Math.random() * (gameArea.clientWidth - 50), y: Math.random() * (gameArea.clientHeight - 50) };

        ball.style.left = ballPos.x + 'px';
        ball.style.top = ballPos.y + 'px';
        hole.style.left = holePos.x + 'px';
        hole.style.top = holePos.y + 'px';

        gameActive = true;
        startTime = new Date().getTime();
    }

    function handleJoystickMove(event) {
        if (!joystickActive) return;

        const rect = joystickContainer.getBoundingClientRect();
        const offsetX = (event.clientX || event.touches[0].clientX) - rect.left - rect.width / 2;
        const offsetY = (event.clientY || event.touches[0].clientY) - rect.top - rect.height / 2;
        const angle = Math.atan2(offsetY, offsetX);
        const distance = Math.min(joystickMaxRadius, Math.sqrt(offsetX * offsetX + offsetY * offsetY));
        const x = distance * Math.cos(angle);
        const y = distance * Math.sin(angle);

        joystick.style.transform = `translate(${x}px, ${y}px)`;

        joystickDirection = { x: x / 5, y: y / 5 };  
    }

    function handleJoystickStart(event) {
        joystickActive = true;
        handleJoystickMove(event);
        event.preventDefault();

        joystickInterval = setInterval(() => {
            moveBall(joystickDirection.x, joystickDirection.y);
        }, 1000 / 60); 
    }

    function handleJoystickEnd() {
        joystickActive = false;
        clearInterval(joystickInterval);
        joystick.style.transform = 'translate(-50%, -50%)';
        joystickDirection = { x: 0, y: 0 };
    }

    joystickContainer.addEventListener('mousedown', handleJoystickStart);
    document.addEventListener('mousemove', handleJoystickMove);
    document.addEventListener('mouseup', handleJoystickEnd);

    joystickContainer.addEventListener('touchstart', handleJoystickStart);
    document.addEventListener('touchmove', handleJoystickMove);
    document.addEventListener('touchend', handleJoystickEnd);

    
    resetGame();
});
