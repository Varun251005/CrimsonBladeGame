// ============================================================
// Game Engine – Loop, Background, Effects, State Management
// ============================================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx    = this.canvas.getContext('2d');
        this.canvas.width  = 1200;
        this.canvas.height = 600;

        this.physics  = new Physics();
        this.controls = new Controls();
        this.ui       = new UIManager(this);
        this.sound    = new SoundManager();

        // Game state
        this.state     = 'menu';
        this.mode      = null;
        this.isPaused  = false;
        this.player1Name = 'PLAYER 1';
        this.player2Name = 'PLAYER 2';

        // Ground
        this.groundY = this.canvas.height - 60;

        // Players
        this.player1 = null;
        this.player2 = null;

        // Timer / scoring
        this.timer      = 99;
        this.timerAccum = 0;
        this.score      = 0;

        // Rounds (2-player best of 3)
        this.currentRound  = 1;
        this.maxRounds     = 3;
        this.p1Wins        = 0;
        this.p2Wins        = 0;
        this.roundEndTimer = 0;

        // ── Hit freeze ──
        this.hitFreeze      = 0;
        this.HIT_FREEZE_DUR = 8;
        this.HEAVY_FREEZE   = 12;

        // ── Screen shake ──
        this.screenShake    = { x: 0, y: 0, intensity: 0, decay: 0.85 };

        // ── Impact effects ──
        this.impactEffects = [];

        // ── Background ──
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'assets/background.gif';
        this.bgLoaded = false;
        this.backgroundImage.onload = () => { this.bgLoaded = true; };

        // Clouds
        this.clouds = [];
        for (let i = 0; i < 7; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: 30 + Math.random() * 150,
                w: 120 + Math.random() * 200,
                h: 30 + Math.random() * 40,
                speed: 0.15 + Math.random() * 0.35,
                opacity: 0.12 + Math.random() * 0.15
            });
        }

        // Floating particles / embers
        this.floatingParticles = [];
        for (let i = 0; i < 30; i++) {
            this.floatingParticles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: -Math.random() * 0.8 - 0.2,
                opacity: Math.random() * 0.6 + 0.2,
                pulse: Math.random() * Math.PI * 2
            });
        }

        // Mist layers
        this.mistLayers = [];
        for (let i = 0; i < 3; i++) {
            this.mistLayers.push({
                x: Math.random() * this.canvas.width,
                y: this.groundY - 20 + i * 15,
                w: 300 + Math.random() * 200,
                speed: 0.2 + Math.random() * 0.3,
                opacity: 0.06 + Math.random() * 0.06
            });
        }

        // Start
        this.ui.showMainMenu();
        this.lastTime = performance.now();
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }

    // ════════════════════════════════════════════════════════
    // START / RESTART / MENU
    // ════════════════════════════════════════════════════════

    startGame(mode) {
        this.mode  = mode;
        this.state = 'playing';
        this.score = 0;
        this.timer = 99;
        this.timerAccum = 0;
        this.currentRound = 1;
        this.p1Wins = 0;
        this.p2Wins = 0;
        this.impactEffects = [];
        this.hitFreeze = 0;
        this.screenShake = { x: 0, y: 0, intensity: 0, decay: 0.85 };

        // Enable sound on first user interaction
        this.sound.enable();
        this.sound.playIntro();

        this.player1 = new Stickman(200, 0, 1, this.sound);

        if (mode === '2players') {
            this.player2 = new Stickman(this.canvas.width - 250, 0, 2, this.sound);
            this.ui.updateRound(1, true);
        } else {
            this.player2 = new Robot(this.canvas.width - 250, 0, this.sound);
            this.ui.updateRound(1, false);
        }

        this.ui.hideAll();
        this.ui.showHUD();
        this.ui.updatePlayerNames(this.player1Name, this.player2Name);
        this.ui.updateHealth(100, 100);
        this.ui.updateScore(0);
        this.ui.updateTimer(99);
    }

    restartGame() {
        this.startGame(this.mode);
    }

    returnToMainMenu() {
        this.state = 'menu';
        this.ui.showMainMenu();
    }

    // ════════════════════════════════════════════════════════
    // GAME LOOP
    // ════════════════════════════════════════════════════════

    gameLoop(timestamp) {
        requestAnimationFrame(this.gameLoop);

        // ── Hit-freeze pause ──
        if (this.hitFreeze > 0) {
            this.hitFreeze--;
            this.render();       // still draw, just don't update
            return;
        }

        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
        this.lastTime = timestamp;

        if (this.state === 'playing') {
            this.update(dt);
        } else if (this.state === 'roundEnd') {
            this.roundEndTimer--;
            if (this.roundEndTimer <= 0) this.nextRound();
        }

        this.render();
    }

    // ════════════════════════════════════════════════════════
    // UPDATE
    // ════════════════════════════════════════════════════════

    update(dt) {
        // Timer
        this.timerAccum += dt;
        if (this.timerAccum >= 1) {
            this.timerAccum -= 1;
            this.timer--;
            this.ui.updateTimer(this.timer);
            if (this.timer <= 0) {
                this.endRound();
                return;
            }
        }

        // Input
        this.controls.updatePlayer1(this.player1);
        if (this.mode === '2players') {
            this.controls.updatePlayer2(this.player2);
        } else if (this.player2 instanceof Robot) {
            this.player2.updateAI(this.player1, this.canvas.width);
        }
        this.controls.clearJustPressed();

        // Face each other
        if (!this.player1.defeated && !this.player2.defeated) {
            if (!this.player1.isAttacking) this.player1.facingRight = this.player1.x < this.player2.x;
            if (!this.player2.isAttacking) this.player2.facingRight = this.player2.x < this.player1.x;
        }

        // Physics
        this.physics.applyGravity(this.player1, this.groundY);
        this.physics.applyGravity(this.player2, this.groundY);
        this.physics.applyFriction(this.player1);
        this.physics.applyFriction(this.player2);
        this.physics.updatePosition(this.player1);
        this.physics.updatePosition(this.player2);
        this.physics.keepInBounds(this.player1, this.canvas.width);
        this.physics.keepInBounds(this.player2, this.canvas.width);

        // Character updates
        this.player1.update();
        if (!(this.player2 instanceof Robot)) this.player2.update();

        // ── Combat ──
        this.checkCombat(this.player1, this.player2);
        this.checkCombat(this.player2, this.player1);

        // UI
        this.ui.updateHealth(this.player1.health, this.player2.health);

        // Check defeat
        if (this.player1.defeated || this.player2.defeated) {
            // Wait a moment then end round
            const defeatedChar = this.player1.defeated ? this.player1 : this.player2;
            if (defeatedChar.defeatTimer > 80) {
                this.endRound();
            }
        }

        // Update effects
        this.updateEffects(dt);
    }

    // ── Combat hit check ──
    checkCombat(attacker, defender) {
        if (!attacker.isInHitWindow()) return;
        if (this.physics.checkAttackCollision(attacker, defender)) {
            const damage = attacker.getCurrentDamage();
            const hit    = defender.takeDamage(damage, attacker.x);
            if (hit) {
                attacker.attackHit = true;

                // Score
                if (this.mode === '1player' && attacker === this.player1) {
                    this.score += damage >= SPECIAL_DMG ? 25 : damage >= HEAVY_DMG ? 15 : 10;
                    this.ui.updateScore(this.score);
                }

                // Hit freeze
                this.hitFreeze = damage >= HEAVY_DMG ? this.HEAVY_FREEZE : this.HIT_FREEZE_DUR;

                // Play hit sound
                this.sound.playHit();

                // Screen shake
                const shakeStr = damage >= SPECIAL_DMG ? 14 : damage >= HEAVY_DMG ? 10 : 6;
                this.triggerScreenShake(shakeStr);

                // Impact effect
                const impactX = (attacker.x + defender.x) / 2 + (attacker.width / 2);
                const impactY = defender.y + defender.height * 0.35;
                this.spawnImpact(impactX, impactY, damage);
            }
        }
    }

    // ── End round ──
    endRound() {
        if (this.state !== 'playing') return;

        // Determine winner
        let winner = null;
        if (this.player1.health > this.player2.health) winner = 'p1';
        else if (this.player2.health > this.player1.health) winner = 'p2';
        // else draw

        if (this.mode === '1player') {
            if (winner === 'p1') {
                this.score += 100;
                this.ui.updateScore(this.score);
                // Next robot round
                if (this.player2 instanceof Robot) this.player2.increaseDifficulty();
                this.state = 'roundEnd';
                this.roundEndTimer = 120;
                this.currentRound++;
            } else {
                this.state = 'gameover';
                this.ui.showGameOver('DEFEATED', this.score);
            }
        } else {
            // 2-player best of 3
            if (winner === 'p1') this.p1Wins++;
            else if (winner === 'p2') this.p2Wins++;

            if (this.p1Wins >= 2) {
                this.state = 'gameover';
                this.ui.showGameOver('PLAYER 1 WINS!');
            } else if (this.p2Wins >= 2) {
                this.state = 'gameover';
                this.ui.showGameOver('PLAYER 2 WINS!');
            } else {
                this.state = 'roundEnd';
                this.roundEndTimer = 120;
                this.currentRound++;
            }
        }
    }

    // ── Next round ──
    nextRound() {
        this.state = 'playing';
        this.timer = 99;
        this.timerAccum = 0;
        this.impactEffects = [];
        this.hitFreeze = 0;

        this.player1.reset(200);
        this.player2.reset(this.canvas.width - 250);

        this.ui.updateHealth(100, 100);
        this.ui.updateTimer(99);
        if (this.mode === '2players') this.ui.updateRound(this.currentRound, true);
    }

    // ════════════════════════════════════════════════════════
    // EFFECTS
    // ════════════════════════════════════════════════════════

    triggerScreenShake(intensity) {
        this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
    }

    spawnImpact(x, y, damage) {
        const count = damage >= HEAVY_DMG ? 18 : 10;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * (damage >= HEAVY_DMG ? 6 : 4);
            this.impactEffects.push({
                type: 'spark',
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                life: 1.0
            });
        }
        // Shockwave ring
        this.impactEffects.push({
            type: 'ring',
            x, y,
            radius: 5,
            maxRadius: damage >= HEAVY_DMG ? 50 : 30,
            life: 1.0
        });
    }

    updateEffects(dt) {
        // Screen shake
        if (this.screenShake.intensity > 0.5) {
            this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity * 2;
            this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity * 2;
            this.screenShake.intensity *= this.screenShake.decay;
        } else {
            this.screenShake.x = 0;
            this.screenShake.y = 0;
            this.screenShake.intensity = 0;
        }

        // Impact effects
        for (let i = this.impactEffects.length - 1; i >= 0; i--) {
            const e = this.impactEffects[i];
            if (e.type === 'spark') {
                e.x += e.vx;
                e.y += e.vy;
                e.vy += 0.2;
                e.life -= 0.04;
            } else if (e.type === 'ring') {
                e.radius += (e.maxRadius - e.radius) * 0.15;
                e.life -= 0.05;
            }
            if (e.life <= 0) this.impactEffects.splice(i, 1);
        }

        // Background particles
        for (const p of this.floatingParticles) {
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += 0.03;
            if (p.y < -10) {
                p.y = this.canvas.height + 10;
                p.x = Math.random() * this.canvas.width;
            }
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
        }

        // Clouds
        for (const c of this.clouds) {
            c.x += c.speed;
            if (c.x > this.canvas.width + c.w) c.x = -c.w;
        }

        // Mist
        for (const m of this.mistLayers) {
            m.x += m.speed;
            if (m.x > this.canvas.width + m.w) m.x = -m.w;
        }
    }

    // ════════════════════════════════════════════════════════
    // RENDER
    // ════════════════════════════════════════════════════════

    render() {
        const ctx = this.ctx;
        ctx.save();

        // Screen shake offset
        ctx.translate(this.screenShake.x, this.screenShake.y);

        // ── Background ──
        this.drawBackground(ctx);

        if (this.state === 'playing' || this.state === 'roundEnd') {
            // ── Ground ──
            this.drawGround(ctx);

            // ── Characters ──
            this.player1.draw(ctx);
            this.player2.draw(ctx);

            // ── Impact effects ──
            this.drawImpacts(ctx);
        }

        ctx.restore();
    }

    // ── Background ──
    drawBackground(ctx) {
        if (this.bgLoaded) {
            ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Fallback gradient
            const grad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
            grad.addColorStop(0, '#1a0000');
            grad.addColorStop(0.5, '#330000');
            grad.addColorStop(1, '#0a0000');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Dark overlay for depth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Clouds
        for (const c of this.clouds) {
            ctx.save();
            ctx.globalAlpha = c.opacity;
            ctx.fillStyle = '#3a0808';
            ctx.beginPath();
            ctx.ellipse(c.x + c.w / 2, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Floating embers (clean, no glow)
        for (const p of this.floatingParticles) {
            const glow = 0.5 + Math.sin(p.pulse) * 0.5;
            ctx.save();
            ctx.globalAlpha = p.opacity * glow;
            ctx.fillStyle = '#4a2010';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Mist
        for (const m of this.mistLayers) {
            ctx.save();
            ctx.globalAlpha = m.opacity;
            ctx.fillStyle = '#220000';
            ctx.beginPath();
            ctx.ellipse(m.x + m.w / 2, m.y, m.w / 2, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // ── Ground ──
    drawGround(ctx) {
        ctx.save();
        // Ground surface line (clean)
        ctx.strokeStyle = '#2a1111';
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.moveTo(0, this.groundY);
        ctx.lineTo(this.canvas.width, this.groundY);
        ctx.stroke();

        // Ground fill
        const gGrad = ctx.createLinearGradient(0, this.groundY, 0, this.canvas.height);
        gGrad.addColorStop(0, 'rgba(20, 5, 5, 0.85)');
        gGrad.addColorStop(1, 'rgba(5, 0, 0, 0.95)');
        ctx.fillStyle = gGrad;
        ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        ctx.restore();
    }

    // ── Impact effects (clean, no glow) ──
    drawImpacts(ctx) {
        for (const e of this.impactEffects) {
            ctx.save();
            if (e.type === 'spark') {
                ctx.globalAlpha = e.life;
                ctx.fillStyle   = '#ddd';
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (e.type === 'ring') {
                ctx.globalAlpha = e.life * 0.4;
                ctx.strokeStyle = '#aaa';
                ctx.lineWidth   = 1.5 + e.life * 2;
                ctx.beginPath();
                ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        }
    }
}

// ── Boot ──
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
