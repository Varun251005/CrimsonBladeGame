// UI Manager - Handles all UI elements and menus

class UIManager {
    constructor(game) {
        this.game = game;
        this.initMenuButtons();
    }

    // Initialize menu button event listeners
    initMenuButtons() {
        // Main menu buttons
        document.getElementById('btn1Player').addEventListener('click', () => {
            this.showPlayerNames('1player');
        });

        document.getElementById('btn2Players').addEventListener('click', () => {
            this.showPlayerNames('2players');
        });

        document.getElementById('btnControls').addEventListener('click', () => {
            this.showControls();
        });

        // Player names
        document.getElementById('btnStartGame').addEventListener('click', () => {
            this.startGameWithNames();
        });

        // Controls menu
        document.getElementById('btnBackFromControls').addEventListener('click', () => {
            this.hideControls();
        });

        // Game over menu
        document.getElementById('btnRestart').addEventListener('click', () => {
            this.game.restartGame();
        });

        document.getElementById('btnMainMenu').addEventListener('click', () => {
            this.game.returnToMainMenu();
        });
    }

    // Show main menu
    showMainMenu() {
        this.hideAll();
        document.getElementById('mainMenu').classList.remove('hidden');
    }

    // Show controls screen
    showControls() {
        this.hideAll();
        document.getElementById('controlsMenu').classList.remove('hidden');
    }

    // Show player names screen
    showPlayerNames(mode) {
        this.hideAll();
        this.selectedMode = mode;
        document.getElementById('playerNamesMenu').classList.remove('hidden');
        document.getElementById('player2NameGroup').style.display = mode === '2players' ? 'flex' : 'none';
        document.getElementById('player1Name').value = '';
        document.getElementById('player2Name').value = '';
        document.getElementById('player1Name').focus();
    }

    // Start game with names
    startGameWithNames() {
        const p1 = document.getElementById('player1Name').value.trim().toUpperCase() || 'PLAYER 1';
        const p2 = document.getElementById('player2Name').value.trim().toUpperCase() || 'PLAYER 2';
        this.game.player1Name = p1;
        this.game.player2Name = p2;
        this.game.startGame(this.selectedMode);
    }

    // Hide controls screen
    hideControls() {
        document.getElementById('controlsMenu').classList.add('hidden');
        this.showMainMenu();
    }

    // Show game HUD
    showHUD() {
        document.getElementById('gameHUD').classList.remove('hidden');
        document.getElementById('gameCanvas').style.display = 'block';
    }

    // Hide all UI elements
    hideAll() {
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('playerNamesMenu').classList.add('hidden');
        document.getElementById('controlsMenu').classList.add('hidden');
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('gameHUD').classList.add('hidden');
        document.getElementById('gameCanvas').style.display = 'none';
    }

    // Update health bars
    updateHealth(player1Health, player2Health) {
        const health1 = document.getElementById('health1');
        const health2 = document.getElementById('health2');
        
        health1.style.width = Math.max(0, player1Health) + '%';
        health2.style.width = Math.max(0, player2Health) + '%';

        // Change color based on health
        health1.style.background = this.getHealthColor(player1Health);
        health2.style.background = this.getHealthColor(player2Health);
    }

    // Get health bar color based on percentage
    getHealthColor(health) {
        if (health > 60) {
            return 'linear-gradient(to right, #e0e0e0, #ccc)';
        } else if (health > 30) {
            return 'linear-gradient(to right, #999, #bbb)';
        } else {
            return 'linear-gradient(to right, #555, #777)';
        }
    }

    // Update timer
    updateTimer(seconds) {
        document.getElementById('timer').textContent = seconds;
        
        // Change color when time is running out
        const timerElement = document.getElementById('timer');
        if (seconds <= 10) {
            timerElement.style.color = '#ccc';
            timerElement.style.animation = 'pulse 0.5s infinite';
        } else {
            timerElement.style.color = '#fff';
            timerElement.style.animation = 'none';
        }
    }

    // Update score (for 1-player mode)
    updateScore(score) {
        document.getElementById('score').textContent = 'Score: ' + score;
    }

    // Update player names in HUD
    updatePlayerNames(p1Name, p2Name) {
        document.getElementById('p1NameDisplay').textContent = p1Name;
        document.getElementById('p2NameDisplay').textContent = p2Name;
    }

    // Update round display (for 2-player mode)
    updateRound(round, visible = true) {
        const roundDisplay = document.getElementById('roundDisplay');
        roundDisplay.textContent = 'Round: ' + round;
        
        if (visible) {
            roundDisplay.classList.remove('hidden');
            document.getElementById('score').classList.add('hidden');
        } else {
            roundDisplay.classList.add('hidden');
            document.getElementById('score').classList.remove('hidden');
        }
    }

    // Show game over screen
    showGameOver(message, finalScore = null) {
        this.hideAll();
        
        const gameOver = document.getElementById('gameOver');
        const gameOverText = document.getElementById('gameOverText');
        const finalScoreText = document.getElementById('finalScore');
        
        gameOverText.textContent = message;
        
        if (finalScore !== null) {
            finalScoreText.textContent = 'Final Score: ' + finalScore;
            finalScoreText.style.display = 'block';
        } else {
            finalScoreText.style.display = 'none';
        }
        
        gameOver.classList.remove('hidden');
    }

    // Add pulse animation to CSS dynamically
    addPulseAnimation() {
        if (!document.getElementById('pulseAnimation')) {
            const style = document.createElement('style');
            style.id = 'pulseAnimation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}
