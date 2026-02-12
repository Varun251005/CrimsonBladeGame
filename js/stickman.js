// ============================================================
// Ninja – Clean vector silhouette fighter with katana
// Inspired by shadow-ninja art style: solid dark shapes,
// white eye slits, headband tails, sharp edges, NO glow.
// ============================================================

class Stickman extends Character {
    constructor(x, y, playerNumber) {
        super(x, y, '#111111');
        this.playerNumber = playerNumber;
        this.facingRight   = playerNumber === 1;

        // Ninja-specific
        this.scarfWave  = 0;            // headband tail wave phase
        this.breathe    = 0;            // idle micro-motion
    }

    // ── Update ──
    update() {
        super.update();
        this.scarfWave += 0.09;
        this.breathe   += 0.05;

        // Slash trail: clean dark arcs (no glow)
        if (this.isAttacking && this.attackTimer >= HIT_ACTIVE_START && this.attackTimer <= HIT_ACTIVE_END) {
            const angle = this.getKatanaAngle();
            const flip  = this.facingRight ? 1 : -1;
            const cx    = this.x + this.width / 2;
            const cy    = this.y + 20;
            const tipX  = cx + Math.cos(angle) * flip * 55;
            const tipY  = cy + Math.sin(angle) * 55;
            this.slashTrail.push({ x: tipX, y: tipY, life: 1.0 });
        }
    }

    // ═══════════════════════════════════════════════════════
    // DRAW
    // ═══════════════════════════════════════════════════════

    draw(ctx) {
        ctx.save();

        // Invulnerability flash (simple alpha, no glow)
        if (this.invulnerable && Math.floor(this.invulnTimer / 3) % 2 === 0) {
            ctx.globalAlpha = 0.35;
        }

        const flip   = this.facingRight ? 1 : -1;
        const cx     = this.x + this.width / 2;
        const baseY  = this.y;
        const footY  = baseY + this.height;
        const bob    = this.currentAction === 'idle' ? Math.sin(this.breathe) * 1.5 : 0;

        // ── Defeated ──
        if (this.defeated) {
            this._drawDefeated(ctx, cx, baseY, flip);
            ctx.restore();
            return;
        }

        // ── Ground shadow (ellipse) ──
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(cx, footY + 2, 22, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // ── Common style ──
        const BODY   = '#0a0a0a';
        const DARK   = '#1a1a1a';
        const ACCENT = '#222';
        ctx.lineCap  = 'round';
        ctx.lineJoin = 'round';

        // ═══════ LEGS ═══════
        this._drawLegs(ctx, cx, baseY, footY, flip, bob, BODY);

        // ═══════ TORSO & OUTFIT ═══════
        this._drawTorso(ctx, cx, baseY, flip, bob, BODY, DARK);

        // ═══════ ARMS + KATANA ═══════
        this._drawArms(ctx, cx, baseY, flip, bob, BODY);

        // ═══════ HEAD + HEADBAND ═══════
        this._drawHead(ctx, cx, baseY, flip, bob, BODY);

        // ═══════ HEADBAND TAILS ═══════
        this._drawScarfTails(ctx, cx, baseY, flip, bob, BODY);

        // ── Dust (landing) ──
        this.drawDust(ctx);

        // ── Slash trail (clean, no glow) ──
        this._drawSlashTrail(ctx);

        ctx.restore();
    }

    // ── HEAD ──
    _drawHead(ctx, cx, baseY, flip, bob, col) {
        const headX = cx;
        const headY = baseY + 14 + bob;
        const r = 13;

        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(headX, headY, r, 0, Math.PI * 2);
        ctx.fill();

        // Headband (band around forehead)
        ctx.fillStyle = '#181818';
        ctx.fillRect(headX - r - 1, headY - 4, r * 2 + 2, 5);

        // White eye slits (angular)
        ctx.fillStyle = '#ffffff';
        const eyeBaseX = headX + flip * 3;
        // Left eye
        ctx.beginPath();
        ctx.moveTo(eyeBaseX - 5, headY - 2);
        ctx.lineTo(eyeBaseX - 1, headY - 3.5);
        ctx.lineTo(eyeBaseX - 1, headY - 0.5);
        ctx.closePath();
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.moveTo(eyeBaseX + 1, headY - 3.5);
        ctx.lineTo(eyeBaseX + 5, headY - 2);
        ctx.lineTo(eyeBaseX + 1, headY - 0.5);
        ctx.closePath();
        ctx.fill();
    }

    // ── HEADBAND TAILS ──
    _drawScarfTails(ctx, cx, baseY, flip, bob, col) {
        const headY = baseY + 14 + bob;
        const startX = cx - flip * 13;
        const startY = headY - 2;

        ctx.strokeStyle = col;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Two flowing tails
        for (let t = 0; t < 2; t++) {
            const offset = t * 8;
            const wave1 = Math.sin(this.scarfWave + t * 1.2) * 6;
            const wave2 = Math.sin(this.scarfWave * 0.8 + t * 1.5) * 10;
            ctx.beginPath();
            ctx.moveTo(startX, startY + t * 3);
            ctx.quadraticCurveTo(
                startX - flip * (18 + offset) + wave1, startY + 5 + t * 4,
                startX - flip * (30 + offset) + wave2, startY + 2 + t * 6 + wave1
            );
            ctx.stroke();
        }
    }

    // ── TORSO ──
    _drawTorso(ctx, cx, baseY, flip, bob, col, dark) {
        const shoulderW = 18;
        const waistW    = 12;
        const topY      = baseY + 28 + bob;
        const botY      = baseY + 65 + bob;

        // Main torso shape
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(cx - shoulderW, topY);
        ctx.lineTo(cx + shoulderW, topY);
        ctx.lineTo(cx + waistW, botY);
        ctx.lineTo(cx - waistW, botY);
        ctx.closePath();
        ctx.fill();

        // Belt / sash
        ctx.fillStyle = dark;
        ctx.fillRect(cx - waistW - 1, botY - 6, (waistW + 1) * 2, 6);

        // Cross-wrap detail line (subtle)
        ctx.strokeStyle = '#1c1c1c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - shoulderW + 4, topY + 3);
        ctx.lineTo(cx + 2, botY - 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + shoulderW - 4, topY + 3);
        ctx.lineTo(cx - 2, botY - 8);
        ctx.stroke();
    }

    // ── LEGS ──
    _drawLegs(ctx, cx, baseY, footY, flip, bob, col) {
        const hipY   = baseY + 65 + bob;
        const kneeOff = 22;
        const legW    = 7;

        let lKneeX, rKneeX, lFootX, rFootX, lKneeY, rKneeY;

        if (this.currentAction === 'walk') {
            const phase = Math.sin(this.animTime * 10);
            lKneeX = cx - 10 + phase * 12;
            rKneeX = cx + 10 - phase * 12;
            lKneeY = hipY + kneeOff + phase * 4;
            rKneeY = hipY + kneeOff - phase * 4;
            lFootX = lKneeX - 3;
            rFootX = rKneeX + 3;
        } else if (this.currentAction === 'jump') {
            lKneeX = cx - 14; rKneeX = cx + 14;
            lKneeY = rKneeY = hipY + 15;
            lFootX = cx - 18; rFootX = cx + 18;
        } else if (this.currentAction === 'attack') {
            // Wide combat stance
            lKneeX = cx - 16 * flip; rKneeX = cx + 8 * flip;
            lKneeY = rKneeY = hipY + kneeOff;
            lFootX = cx - 22 * flip; rFootX = cx + 12 * flip;
        } else {
            // Idle combat stance
            lKneeX = cx - 12; rKneeX = cx + 12;
            lKneeY = rKneeY = hipY + kneeOff;
            lFootX = cx - 14; rFootX = cx + 14;
        }

        ctx.fillStyle = col;
        // Left leg (thigh + shin as polygons)
        this._drawLimb(ctx, cx - 5, hipY, lKneeX, lKneeY, legW, col);
        this._drawLimb(ctx, lKneeX, lKneeY, lFootX, footY, legW - 1, col);
        // Right leg
        this._drawLimb(ctx, cx + 5, hipY, rKneeX, rKneeY, legW, col);
        this._drawLimb(ctx, rKneeX, rKneeY, rFootX, footY, legW - 1, col);

        // Feet (small rectangles)
        ctx.fillStyle = '#050505';
        ctx.fillRect(lFootX - 5, footY - 4, 12, 5);
        ctx.fillRect(rFootX - 5, footY - 4, 12, 5);
    }

    // ── ARMS ──
    _drawArms(ctx, cx, baseY, flip, bob, col) {
        const shoulderY = baseY + 32 + bob;
        const limbW = 5;

        if (this.isAttacking) {
            this._drawAttackArms(ctx, cx, shoulderY, flip, col, limbW);
        } else if (this.isBlocking) {
            // Guard: arms crossed in front
            const guardX = cx + flip * 10;
            this._drawLimb(ctx, cx + flip * 16, shoulderY, guardX, shoulderY - 5, limbW, col);
            this._drawLimb(ctx, cx - flip * 2, shoulderY + 3, guardX, shoulderY + 8, limbW, col);
            // Katana held diagonal in guard
            this._drawKatana(ctx, guardX, shoulderY - 5, flip * 0.3, -0.9, flip);
        } else {
            // Idle / walk
            const armSwing = this.currentAction === 'walk' ? Math.sin(this.animTime * 10) * 12 : 0;
            // Back arm
            const backElbowX = cx - flip * 12;
            const backElbowY = shoulderY + 16 - armSwing;
            this._drawLimb(ctx, cx - flip * 16, shoulderY, backElbowX, backElbowY, limbW, col);
            this._drawLimb(ctx, backElbowX, backElbowY, backElbowX - flip * 4, backElbowY + 10, limbW - 1, col);

            // Front arm (holds katana)
            const frontElbowX = cx + flip * 14;
            const frontElbowY = shoulderY + 10 + armSwing;
            const handX = frontElbowX + flip * 6;
            const handY = frontElbowY + 12;
            this._drawLimb(ctx, cx + flip * 16, shoulderY, frontElbowX, frontElbowY, limbW, col);
            this._drawLimb(ctx, frontElbowX, frontElbowY, handX, handY, limbW - 1, col);

            // Katana resting angled forward-down
            this._drawKatana(ctx, handX, handY, flip * 0.7, 0.55, flip);
        }
    }

    // ── Attack arms + katana swing ──
    _drawAttackArms(ctx, cx, shoulderY, flip, col, limbW) {
        const angle = this.getKatanaAngle();

        // Sword arm follows arc
        const elbowX = cx + flip * 14;
        const elbowY = shoulderY - 5;
        const handX  = elbowX + Math.cos(angle) * flip * 16;
        const handY  = elbowY + Math.sin(angle) * 16;

        this._drawLimb(ctx, cx + flip * 16, shoulderY, elbowX, elbowY, limbW, col);
        this._drawLimb(ctx, elbowX, elbowY, handX, handY, limbW, col);

        // Off-hand pulled back
        this._drawLimb(ctx, cx - flip * 16, shoulderY, cx - flip * 8, shoulderY + 15, limbW, col);

        // Katana follows swing
        this._drawKatana(ctx, handX, handY, Math.cos(angle) * flip, Math.sin(angle), flip);
    }

    // ── Draw katana (clean vector, no glow) ──
    _drawKatana(ctx, hiltX, hiltY, dirX, dirY, flip) {
        const bladeLen = 48;
        const tipX = hiltX + dirX * bladeLen;
        const tipY = hiltY + dirY * bladeLen;

        // Perpendicular for blade width
        const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        const nx = -dirY / len;
        const ny =  dirX / len;

        // Blade (tapered polygon: wider at hilt, narrow at tip)
        ctx.fillStyle = '#888';
        ctx.beginPath();
        ctx.moveTo(hiltX + nx * 2.5, hiltY + ny * 2.5);
        ctx.lineTo(tipX + nx * 0.5,  tipY + ny * 0.5);
        ctx.lineTo(tipX - nx * 0.5,  tipY - ny * 0.5);
        ctx.lineTo(hiltX - nx * 2.5, hiltY - ny * 2.5);
        ctx.closePath();
        ctx.fill();

        // Blade edge highlight
        ctx.strokeStyle = '#bbb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(hiltX + nx * 2.5, hiltY + ny * 2.5);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Hilt / crossguard
        const perpX = nx * 6;
        const perpY = ny * 6;
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(hiltX + perpX, hiltY + perpY);
        ctx.lineTo(hiltX - perpX, hiltY - perpY);
        ctx.stroke();

        // Handle (short dark segment behind hilt)
        const handleX = hiltX - dirX * 10;
        const handleY = hiltY - dirY * 10;
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(hiltX, hiltY);
        ctx.lineTo(handleX, handleY);
        ctx.stroke();

        // Pommel
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(handleX, handleY, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // ── Limb helper (thick line segment) ──
    _drawLimb(ctx, x1, y1, x2, y2, w, col) {
        ctx.strokeStyle = col;
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    // ── Slash trail (clean dark arc, no glow) ──
    _drawSlashTrail(ctx) {
        if (this.slashTrail.length < 2) return;
        ctx.save();
        ctx.lineCap = 'round';
        for (let i = 1; i < this.slashTrail.length; i++) {
            const prev = this.slashTrail[i - 1];
            const cur  = this.slashTrail[i];
            ctx.strokeStyle = `rgba(200, 200, 200, ${cur.life * 0.6})`;
            ctx.lineWidth   = cur.life * 5;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(cur.x, cur.y);
            ctx.stroke();
        }
        ctx.restore();
    }

    // ── Defeated pose (falls to ground, stays) ──
    _drawDefeated(ctx, cx, baseY, flip) {
        const fallProgress = Math.min(this.defeatTimer / 40, 1);
        const angle = fallProgress * (Math.PI / 2) * flip;
        const groundY = baseY + this.height;

        // Ground shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx, groundY + 2, 30, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(cx, groundY);
        ctx.rotate(angle);
        ctx.globalAlpha = Math.max(0.4, 1 - this.defeatTimer / 250);

        const col = '#0a0a0a';

        // Simplified fallen body
        ctx.fillStyle = col;
        // Head
        ctx.beginPath();
        ctx.arc(0, -this.height + 14, 12, 0, Math.PI * 2);
        ctx.fill();

        // Torso
        ctx.fillRect(-14, -this.height + 28, 28, 38);

        // Legs
        ctx.strokeStyle = col;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-5, -this.height + 66);
        ctx.lineTo(-14, -this.height + 100);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(5, -this.height + 66);
        ctx.lineTo(14, -this.height + 100);
        ctx.stroke();

        // Arms
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-14, -this.height + 35);
        ctx.lineTo(-22, -this.height + 55);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(14, -this.height + 35);
        ctx.lineTo(22, -this.height + 55);
        ctx.stroke();

        ctx.restore();
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
        this.facingRight = this.playerNumber === 1;
    }
}
