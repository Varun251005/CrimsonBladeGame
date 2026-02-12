// ============================================================
// Robot / Mech – Clean vector armored silhouette fighter
// Dark plated armor, white eye slits, fist combat, NO glow.
// ============================================================

class Robot extends Character {
    constructor(x, y) {
        super(x, y, '#222222');
        this.facingRight = false;

        // AI
        this.decisionInterval = 30;
        this.decisionTimer    = 0;
        this.aggressionLevel  = 0.7;
        this.aiAction         = 'idle';

        // Visual
        this.breathe  = 0;
    }

    // ── AI decision tree ──
    makeDecision(player, canvasWidth) {
        const dx   = player.x - this.x;
        const dist = Math.abs(dx);
        this.facingRight = dx > 0;
        const roll = Math.random();

        if (this.hitStun > 0) { this.aiAction = 'idle'; return; }

        if (dist < 80) {
            if (roll < this.aggressionLevel * 0.6) {
                this.aiAction = roll < 0.2 ? 'heavy' : roll < 0.15 ? 'special' : 'light';
            } else if (roll < 0.85) {
                this.aiAction = 'block';
            } else {
                this.aiAction = 'retreat';
            }
        } else if (dist < 200) {
            if (roll < this.aggressionLevel * 0.5) this.aiAction = 'approach';
            else if (roll < this.aggressionLevel * 0.7) this.aiAction = 'jumpAttack';
            else this.aiAction = 'idle';
        } else {
            this.aiAction = roll < this.aggressionLevel * 0.8 ? 'approach' : 'idle';
        }

        if ((this.x < 60 || this.x > canvasWidth - 60) && roll < 0.5) {
            this.aiAction = 'approach';
        }
    }

    executeAction(player) {
        switch (this.aiAction) {
            case 'approach':
                this.facingRight ? this.moveRight() : this.moveLeft(); break;
            case 'retreat':
                this.facingRight ? this.moveLeft() : this.moveRight(); break;
            case 'light':    this.attack('light');   break;
            case 'heavy':    this.attack('heavy');   break;
            case 'special':  this.attack('special'); break;
            case 'block':    this.block(true);       break;
            case 'jumpAttack':
                this.jump(); this.attack('heavy');   break;
            default:         this.block(false);      break;
        }
    }

    // ── Update with AI ──
    updateAI(player, canvasWidth) {
        this.decisionTimer++;
        if (this.decisionTimer >= this.decisionInterval) {
            this.decisionTimer = 0;
            this.makeDecision(player, canvasWidth);
        }
        this.executeAction(player);
        super.update();
        this.breathe += 0.04;
    }

    // ═══════════════════════════════════════════════════════
    // DRAW
    // ═══════════════════════════════════════════════════════

    draw(ctx) {
        ctx.save();

        if (this.invulnerable && Math.floor(this.invulnTimer / 3) % 2 === 0) {
            ctx.globalAlpha = 0.35;
        }

        const cx    = this.x + this.width / 2;
        const baseY = this.y;
        const footY = baseY + this.height;
        const flip  = this.facingRight ? 1 : -1;
        const bob   = this.currentAction === 'idle' ? Math.sin(this.breathe) * 1 : 0;

        if (this.defeated) {
            this._drawDefeated(ctx, cx, baseY, flip);
            ctx.restore();
            return;
        }

        // ── Ground shadow ──
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(cx, footY + 2, 24, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        const DARK  = '#151515';
        const MID   = '#1e1e1e';
        const PLATE = '#252525';
        const EDGE  = '#333';

        // ═══════ LEGS ═══════
        this._drawLegs(ctx, cx, baseY, footY, flip, bob, DARK, PLATE, EDGE);

        // ═══════ TORSO (armored) ═══════
        this._drawTorso(ctx, cx, baseY, flip, bob, DARK, MID, PLATE, EDGE);

        // ═══════ ARMS ═══════
        this._drawArms(ctx, cx, baseY, flip, bob, DARK, PLATE, EDGE);

        // ═══════ HEAD / HELMET ═══════
        this._drawHead(ctx, cx, baseY, flip, bob, DARK, PLATE, EDGE);

        // ── Dust ──
        this.drawDust(ctx);

        // ── Slash trail ──
        this._drawSlashTrail(ctx);

        ctx.restore();
    }

    // ── HEAD / HELMET ──
    _drawHead(ctx, cx, baseY, flip, bob, dark, plate, edge) {
        const headY = baseY + 13 + bob;

        // Helmet shape (angular)
        ctx.fillStyle = dark;
        ctx.strokeStyle = edge;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 14, headY + 8);
        ctx.lineTo(cx - 12, headY - 12);
        ctx.lineTo(cx - 4,  headY - 15);
        ctx.lineTo(cx + 4,  headY - 15);
        ctx.lineTo(cx + 12, headY - 12);
        ctx.lineTo(cx + 14, headY + 8);
        ctx.lineTo(cx + 10, headY + 12);
        ctx.lineTo(cx - 10, headY + 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Visor plate
        ctx.fillStyle = plate;
        ctx.beginPath();
        ctx.moveTo(cx - 11, headY - 2);
        ctx.lineTo(cx + 11, headY - 2);
        ctx.lineTo(cx + 10, headY + 5);
        ctx.lineTo(cx - 10, headY + 5);
        ctx.closePath();
        ctx.fill();

        // White eye slits (round / mechanical)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx + flip * 3 - 4, headY + 1, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + flip * 3 + 4, headY + 1, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Antenna / crest detail
        ctx.strokeStyle = edge;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, headY - 15);
        ctx.lineTo(cx, headY - 20);
        ctx.stroke();
    }

    // ── TORSO (armored plates) ──
    _drawTorso(ctx, cx, baseY, flip, bob, dark, mid, plate, edge) {
        const topY = baseY + 25 + bob;
        const botY = baseY + 68 + bob;
        const sw = 20;   // shoulder width
        const ww = 14;   // waist width

        // Main chest plate
        ctx.fillStyle = dark;
        ctx.strokeStyle = edge;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - sw, topY);
        ctx.lineTo(cx + sw, topY);
        ctx.lineTo(cx + ww, botY);
        ctx.lineTo(cx - ww, botY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Center chest plate detail
        ctx.fillStyle = plate;
        ctx.beginPath();
        ctx.moveTo(cx - 8, topY + 4);
        ctx.lineTo(cx + 8, topY + 4);
        ctx.lineTo(cx + 5, botY - 8);
        ctx.lineTo(cx - 5, botY - 8);
        ctx.closePath();
        ctx.fill();

        // Horizontal armor line
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - sw + 3, topY + 18);
        ctx.lineTo(cx + sw - 3, topY + 18);
        ctx.stroke();

        // Shoulder pads
        for (let side = -1; side <= 1; side += 2) {
            ctx.fillStyle = plate;
            ctx.strokeStyle = edge;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx + side * (sw - 2), topY - 2);
            ctx.lineTo(cx + side * (sw + 10), topY + 3);
            ctx.lineTo(cx + side * (sw + 8),  topY + 14);
            ctx.lineTo(cx + side * (sw - 2),  topY + 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Belt
        ctx.fillStyle = mid;
        ctx.fillRect(cx - ww - 1, botY - 4, (ww + 1) * 2, 5);
    }

    // ── LEGS (mechanical / armored) ──
    _drawLegs(ctx, cx, baseY, footY, flip, bob, dark, plate, edge) {
        const hipY = baseY + 68 + bob;
        const kneeOff = 22;

        let lKneeX, rKneeX, lFootX, rFootX, lKneeY, rKneeY;

        if (this.currentAction === 'walk') {
            const phase = Math.sin(this.animTime * 10);
            lKneeX = cx - 10 + phase * 11;
            rKneeX = cx + 10 - phase * 11;
            lKneeY = hipY + kneeOff + phase * 3;
            rKneeY = hipY + kneeOff - phase * 3;
            lFootX = lKneeX - 2; rFootX = rKneeX + 2;
        } else if (this.currentAction === 'jump') {
            lKneeX = cx - 16; rKneeX = cx + 16;
            lKneeY = rKneeY = hipY + 14;
            lFootX = cx - 18; rFootX = cx + 18;
        } else if (this.currentAction === 'attack') {
            lKneeX = cx - 14 * flip; rKneeX = cx + 10 * flip;
            lKneeY = rKneeY = hipY + kneeOff;
            lFootX = cx - 20 * flip; rFootX = cx + 14 * flip;
        } else {
            lKneeX = cx - 13; rKneeX = cx + 13;
            lKneeY = rKneeY = hipY + kneeOff;
            lFootX = cx - 15; rFootX = cx + 15;
        }

        // Thighs (thick)
        this._drawArmorLimb(ctx, cx - 6, hipY, lKneeX, lKneeY, 9, dark, edge);
        this._drawArmorLimb(ctx, cx + 6, hipY, rKneeX, rKneeY, 9, dark, edge);

        // Knee joints
        ctx.fillStyle = plate;
        ctx.beginPath();
        ctx.arc(lKneeX, lKneeY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rKneeX, rKneeY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Shins
        this._drawArmorLimb(ctx, lKneeX, lKneeY, lFootX, footY - 2, 7, dark, edge);
        this._drawArmorLimb(ctx, rKneeX, rKneeY, rFootX, footY - 2, 7, dark, edge);

        // Boots (blocky)
        ctx.fillStyle = '#111';
        ctx.strokeStyle = edge;
        ctx.lineWidth = 1;
        for (const fx of [lFootX, rFootX]) {
            ctx.beginPath();
            ctx.rect(fx - 7, footY - 5, 14, 7);
            ctx.fill();
            ctx.stroke();
        }
    }

    // ── ARMS ──
    _drawArms(ctx, cx, baseY, flip, bob, dark, plate, edge) {
        const shoulderY = baseY + 30 + bob;
        const armW = 6;

        if (this.isAttacking) {
            this._drawAttackArms(ctx, cx, shoulderY, flip, dark, plate, edge, armW);
        } else if (this.isBlocking) {
            // Guard stance: arms crossed
            const gx = cx + flip * 8;
            this._drawArmorLimb(ctx, cx + flip * 20, shoulderY + 2, gx, shoulderY - 4, armW, dark, edge);
            this._drawArmorLimb(ctx, cx - flip * 4, shoulderY + 4, gx + flip * 4, shoulderY + 12, armW, dark, edge);
            // Fists
            this._drawFist(ctx, gx, shoulderY - 4, plate);
        } else {
            // Idle / walk
            const swing = this.currentAction === 'walk' ? Math.sin(this.animTime * 10) * 10 : 0;

            // Back arm
            const bElbowX = cx - flip * 14;
            const bElbowY = shoulderY + 14 - swing;
            const bHandX  = bElbowX - flip * 6;
            const bHandY  = bElbowY + 14;
            this._drawArmorLimb(ctx, cx - flip * 20, shoulderY + 2, bElbowX, bElbowY, armW, dark, edge);
            this._drawArmorLimb(ctx, bElbowX, bElbowY, bHandX, bHandY, armW - 1, dark, edge);
            this._drawFist(ctx, bHandX, bHandY, plate);

            // Front arm
            const fElbowX = cx + flip * 16;
            const fElbowY = shoulderY + 8 + swing;
            const fHandX  = fElbowX + flip * 8;
            const fHandY  = fElbowY + 14;
            this._drawArmorLimb(ctx, cx + flip * 20, shoulderY + 2, fElbowX, fElbowY, armW, dark, edge);
            this._drawArmorLimb(ctx, fElbowX, fElbowY, fHandX, fHandY, armW - 1, dark, edge);
            this._drawFist(ctx, fHandX, fHandY, plate);
        }
    }

    // ── Attack arms (punching) ──
    _drawAttackArms(ctx, cx, shoulderY, flip, dark, plate, edge, armW) {
        const t = this.attackTimer / ATTACK_DURATION;
        const punchExtend = Math.sin(t * Math.PI) * 30;

        // Punch arm extends forward
        const elbowX = cx + flip * 16;
        const elbowY = shoulderY - 4;
        const fistX  = elbowX + flip * punchExtend;
        const fistY  = shoulderY + 2;

        this._drawArmorLimb(ctx, cx + flip * 20, shoulderY + 2, elbowX, elbowY, armW, dark, edge);
        this._drawArmorLimb(ctx, elbowX, elbowY, fistX, fistY, armW, dark, edge);
        this._drawFist(ctx, fistX, fistY, plate);

        // Off arm pulled back
        this._drawArmorLimb(ctx, cx - flip * 20, shoulderY + 2, cx - flip * 10, shoulderY + 16, armW, dark, edge);
        this._drawFist(ctx, cx - flip * 10, shoulderY + 16, plate);

        // Generate slash trail at fist position during hit window
        if (this.attackTimer >= HIT_ACTIVE_START && this.attackTimer <= HIT_ACTIVE_END) {
            this.slashTrail.push({ x: fistX + flip * 8, y: fistY, life: 1.0 });
        }
    }

    // ── Fist (small square) ──
    _drawFist(ctx, x, y, col) {
        ctx.fillStyle = col;
        ctx.fillRect(x - 4, y - 4, 8, 8);
    }

    // ── Armored limb (line + edge stroke) ──
    _drawArmorLimb(ctx, x1, y1, x2, y2, w, col, edge) {
        // Fill
        ctx.strokeStyle = col;
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        // Edge outline
        ctx.strokeStyle = edge;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // ── Slash trail (clean, for punch impacts) ──
    _drawSlashTrail(ctx) {
        if (this.slashTrail.length < 2) return;
        ctx.save();
        ctx.lineCap = 'round';
        for (let i = 1; i < this.slashTrail.length; i++) {
            const prev = this.slashTrail[i - 1];
            const cur  = this.slashTrail[i];
            ctx.strokeStyle = `rgba(180, 180, 180, ${cur.life * 0.5})`;
            ctx.lineWidth   = cur.life * 4;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(cur.x, cur.y);
            ctx.stroke();
        }
        ctx.restore();
    }

    // ── Defeated ──
    _drawDefeated(ctx, cx, baseY, flip) {
        const fallProgress = Math.min(this.defeatTimer / 35, 1);
        const angle = fallProgress * (Math.PI / 2) * flip;
        const groundY = baseY + this.height;

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx, groundY + 2, 28, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(cx, groundY);
        ctx.rotate(angle);
        ctx.globalAlpha = Math.max(0.3, 1 - this.defeatTimer / 200);

        const col = '#151515';

        // Head
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(-12, -this.height + 5);
        ctx.lineTo(12, -this.height + 5);
        ctx.lineTo(14, -this.height + 22);
        ctx.lineTo(-14, -this.height + 22);
        ctx.closePath();
        ctx.fill();

        // Torso
        ctx.fillRect(-16, -this.height + 25, 32, 43);

        // Legs
        ctx.strokeStyle = col;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-8, -this.height + 68);
        ctx.lineTo(-14, -this.height + 100);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, -this.height + 68);
        ctx.lineTo(14, -this.height + 100);
        ctx.stroke();

        // Arms
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-16, -this.height + 32);
        ctx.lineTo(-24, -this.height + 55);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(16, -this.height + 32);
        ctx.lineTo(24, -this.height + 55);
        ctx.stroke();

        ctx.restore();
    }

    // ── Scale difficulty ──
    increaseDifficulty() {
        this.aggressionLevel = Math.min(1.0, this.aggressionLevel + 0.1);
        this.decisionInterval = Math.max(15, this.decisionInterval - 3);
    }

    // ── Reset ──
    reset(x) {
        this.x = x;
        this.y = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health    = this.maxHealth;
        this.isJumping = false;
        this.isAttacking   = false;
        this.attackTimer    = 0;
        this.attackCooldown = 0;
        this.attackHit      = false;
        this.isBlocking     = false;
        this.isDead         = false;
        this.defeated       = false;
        this.defeatTimer    = 0;
        this.invulnerable   = false;
        this.invulnTimer    = 0;
        this.hitStun        = 0;
        this.dustParticles  = [];
        this.slashTrail     = [];
        this.decisionTimer  = 0;
        this.aiAction       = 'idle';
        this.facingRight    = false;
    }
}
