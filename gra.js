document.addEventListener('DOMContentLoaded', function() {
    // Elementy DOM
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const highscoreElement = document.getElementById('highscore');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    // Zmienne gry
    let score = 0;
    let highscore = localStorage.getItem('highscore') || 0;
    let timeLeft = 30;
    let gameInterval;
    let timeInterval;
    let isGameRunning = false;
    let isGamePaused = false;
    
    highscoreElement.textContent = highscore;
    
    // Obiekty gry
    const ball = {
        x: 0,
        y: 0,
        radius: 20,
        speedX: 0,
        speedY: 0,
        draw: function() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.stroke();
        },
        move: function() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            this.speedX *= 0.98;
            this.speedY *= 0.98;
            
            if (Math.abs(this.speedX) < 0.1) this.speedX = 0;
            if (Math.abs(this.speedY) < 0.1) this.speedY = 0;
            
            if (this.x + this.radius > canvas.width) {
                this.x = canvas.width - this.radius;
                this.speedX = -this.speedX * 0.8;
            }
            if (this.x - this.radius < 0) {
                this.x = this.radius;
                this.speedX = -this.speedX * 0.8;
            }
            if (this.y + this.radius > canvas.height) {
                this.y = canvas.height - this.radius;
                this.speedY = -this.speedY * 0.8;
            }
            if (this.y - this.radius < 0) {
                this.y = this.radius;
                this.speedY = -this.speedY * 0.8;
            }
        }
    };
    
    const goal = {
        x: 0,
        y: 0,
        width: 20,
        height: 100,
        draw: function() {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    
    const defender = {
        x: 0,
        y: 0,
        width: 40,
        height: 60,
        speed: 3,
        draw: function() {
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },
        move: function() {
            if (ball.x > this.x + this.width / 2) {
                this.x += this.speed;
            } else if (ball.x < this.x + this.width / 2) {
                this.x -= this.speed;
            }
            
            if (ball.y > this.y + this.height / 2) {
                this.y += this.speed;
            } else if (ball.y < this.y + this.height / 2) {
                this.y -= this.speed;
            }
            
            this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
        }
    };
    
    // Funkcje gry
    function drawField() {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 20);
        ctx.lineTo(canvas.width / 2, canvas.height - 20);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        goal.x = canvas.width - 30;
        goal.y = canvas.height / 2 - goal.height / 2;
        goal.draw();
    }
    
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawField();
        
        ball.move();
        ball.draw();
        
        defender.move();
        defender.draw();
        
        if (checkCollision(ball, defender)) {
            const dx = ball.x - (defender.x + defender.width / 2);
            const dy = ball.y - (defender.y + defender.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            ball.speedX = (dx / distance) * 10;
            ball.speedY = (dy / distance) * 10;
        }
        
        if (ball.x + ball.radius > goal.x && 
            ball.y > goal.y && 
            ball.y < goal.y + goal.height) {
            score++;
            scoreElement.textContent = score;
            resetBall();
        }
    }
    
    function checkCollision(ball, rect) {
        const closestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.height));
        const distanceX = ball.x - closestX;
        const distanceY = ball.y - closestY;
        return (distanceX * distanceX + distanceY * distanceY) < (ball.radius * ball.radius);
    }
    
    function resetBall() {
        ball.x = canvas.width / 4;
        ball.y = canvas.height / 2;
        ball.speedX = 0;
        ball.speedY = 0;
    }
    
    function startGame() {
        if (isGameRunning) return;
        
        isGameRunning = true;
        isGamePaused = false;
        score = 0;
        timeLeft = 30;
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        pauseBtn.textContent = 'PAUZA';
        
        resetBall();
        defender.x = canvas.width / 2 - defender.width / 2;
        defender.y = canvas.height / 2 - defender.height / 2;
        
        gameInterval = setInterval(update, 1000/60);
        
        timeInterval = setInterval(function() {
            if (!isGamePaused) {
                timeLeft--;
                timeElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    endGame();
                }
            }
        }, 1000);
    }
    
    function pauseGame() {
        if (!isGameRunning) return;
        
        isGamePaused = !isGamePaused;
        pauseBtn.textContent = isGamePaused ? 'WZNÓW' : 'PAUZA';
    }
    
    function endGame() {
        clearInterval(gameInterval);
        clearInterval(timeInterval);
        isGameRunning = false;
        
        if (score > highscore) {
            highscore = score;
            highscoreElement.textContent = highscore;
            localStorage.setItem('highscore', highscore);
            alert(`Nowy rekord! ${highscore} goli! Gratulacje!`);
        } else {
            alert(`Koniec czasu! Twój wynik to: ${score} goli!`);
        }
    }
    
    function resetGame() {
        endGame();
        score = 0;
        timeLeft = 30;
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawField();
        resetBall();
        defender.x = canvas.width / 2 - defender.width / 2;
        defender.y = canvas.height / 2 - defender.height / 2;
        ball.draw();
        defender.draw();
    }
    
    // Event listeners
    canvas.addEventListener('click', function(e) {
        if (!isGameRunning || isGamePaused) return;
        
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        
        const dx = mouseX - ball.x;
        const dy = mouseY - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = Math.min(15, distance / 5);
        
        ball.speedX = (dx / distance) * force;
        ball.speedY = (dy / distance) * force;
    });
    
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    pauseBtn.addEventListener('click', pauseGame);
    
    // Inicjalizacja
    drawField();
    resetBall();
    defender.x = canvas.width / 2 - defender.width / 2;
    defender.y = canvas.height / 2 - defender.height / 2;
    ball.draw();
    defender.draw();
    
    // Funkcje wspólne
    function updateClock() {
        const now = new Date();
        const clock = document.getElementById('clock');
        if (clock) {
            clock.textContent = now.toLocaleTimeString();
        }
    }
    
    setInterval(updateClock, 1000);
    updateClock();
    
    // Data w stopce
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('pl-PL');
    }
    
    // Licznik odwiedzin
    if (!localStorage.getItem('visitCount')) {
        localStorage.setItem('visitCount', '0');
    }
    
    let visitCount = parseInt(localStorage.getItem('visitCount'));
    visitCount++;
    localStorage.setItem('visitCount', visitCount.toString());
    
    const visitCounterElement = document.getElementById('visit-counter');
    if (visitCounterElement) {
        visitCounterElement.textContent = visitCount;
    }
    
    // Czas spędzony na stronie
    let timeSpent = 0;
    const timeSpentElement = document.getElementById('time-spent');
    
    if (!sessionStorage.getItem('timeSpent')) {
        sessionStorage.setItem('timeSpent', '0');
    } else {
        timeSpent = parseInt(sessionStorage.getItem('timeSpent'));
        if (timeSpentElement) {
            timeSpentElement.textContent = timeSpent;
        }
    }
    
    const timeSpentInterval = setInterval(() => {
        timeSpent++;
        if (timeSpentElement) {
            timeSpentElement.textContent = timeSpent;
        }
        sessionStorage.setItem('timeSpent', timeSpent.toString());
    }, 1000);
});