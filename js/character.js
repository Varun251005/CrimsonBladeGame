// ============================================================
// Base Character – Health, Combat, Animation State
// ============================================================

const CHAR_WIDTH       = 50;
const CHAR_HEIGHT      = 120;
const MOVE_ACCEL       = 1.2;
const MAX_SPEED        = 6;
const JUMP_POWER       = 18;
const LIGHT_DMG        = 8;
const HEAVY_DMG        = 15;
const SPECIAL_DMG      = 22;
const ATTACK_COOLDOWN  = 28;
const ATTACK_DURATION  = 18;
const HIT_ACTIVE_START = 5;
const HIT_ACTIVE_END   = 12;
const KNOCKBACK_FORCE  = 10;
const KNOCKBACK_VERT   = -5;
const INVULN_FRAMES    = 25;
const BLOCK_REDUCTION  = 0.25;
const LUNGE_SPEED      = 4;

class Character {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.width  = CHAR_WIDTH;
        this.height = CHAR_HEIGHT;
        this.color  = color;

        // Physics
        this.velocityX = 0;
        this.velocityY = 0;
        this.accel     = MOVE_ACCEL;
        this.maxSpeed  = MAX_SPEED;
        this.jumpPower = JUMP_POWER;
        this.isJumping = false;
        this.wasGrounded = false;

        // Combat
        this.health       = 100;
        this.maxHealth     = 100;
        this.isAttacking   = false;
        this.attackTimer   = 0;          // counts UP from 0 → ATTACK_DURATION
        this.attackCooldown = 0;
        this.attackHit     = false;      // prevent multi-hit per swing
        this.currentAttackType = 'light';
        this.isBlocking    = false;
        this.isDead        = false;
        this.defeated      = false;      // separate from isDead for fall anim
        this.defeatTimer   = 0;
        this.invulnerable  = false;
        this.invulnTimer   = 0;
        this.hitStun       = 0;

        // Animation
        this.facingRight    = true;
        this.animTime       = 0;
        this.currentAction  = 'idle';

        // Dust particles (landing)
        this.dustParticles  = [];

        // Slash trail points
        this.slashTrail     = [];
    }

    // ── Update ──
    update() {
        this.animTime += 0.016;   // ~60 fps

        // Attack timer
        if (this.isAttacking) {
            this.attackTimer++;
            if (this.attackTimer >= ATTACK_DURATION) {
                this.isAttacking = false;
                this.attackTimer = 0;
                this.attackHit   = false;
            }
        }

        // Cooldown
        if (this.attackCooldown > 0) this.attackCooldown--;

        // Invulnerability
        if (this.invulnTimer > 0) {
            this.invulnTimer--;
            this.invulnerable = this.invulnTimer > 0;
        }

        // Hit-stun (can't move)
        if (this.hitStun > 0) this.hitStun--;

        // Defeat fall animation
        if (this.defeated) {
            this.defeatTimer++;
        }

        // Dust particles update
        for (let i = this.dustParticles.length - 1; i >= 0; i--) {
            const d = this.dustParticles[i];
            d.x  += d.vx;
            d.y  += d.vy;
            d.vy += 0.15;
            d.life -= 0.04;
            if (d.life <= 0) this.dustParticles.splice(i, 1);
        }

        // Slash trail fade
        for (let i = this.slashTrail.length - 1; i >= 0; i--) {
            this.slashTrail[i].life -= 0.08;
            if (this.slashTrail[i].life <= 0) this.slashTrail.splice(i, 1);
        }

        // Determine action
        if (this.defeated)                          this.currentAction = 'defeat';
        else if (this.hitStun > 0)                  this.currentAction = 'hurt';
        else if (this.isAttacking)                  this.currentAction = 'attack';
        else if (this.isJumping)                    this.currentAction = 'jump';
        else if (Math.abs(this.velocityX) > 0.5)   this.currentAction = 'walk';
        else                                        this.currentAction = 'idle';
    }

    // ── On land callback ──
    onLand() {
        this.spawnDust();
    }

    // ── Spawn dust particles ──
    spawnDust() {
        const footY = this.y + this.height;
        const cx    = this.x + this.width / 2;
        for (let i = 0; i < 8; i++) {
            this.dustParticles.push({
                x:    cx + (Math.random() - 0.5) * 20,
                y:    footY,
                vx:   (Math.random() - 0.5) * 4,
                vy:   -Math.random() * 2 - 0.5,
                size: Math.random() * 4 + 2,
                life: 1.0
            });
        }
    }

    // ── Movement ──
    moveLeft() {
        if (this.defeated || this.hitStun > 0) return;
        if (this.isAttacking) return;
        this.velocityX = Math.max(this.velocityX - this.accel, -this.maxSpeed);
    }

    moveRight() {
        if (this.defeated || this.hitStun > 0) return;
        if (this.isAttacking) return;
        this.velocityX = Math.min(this.velocityX + this.accel, this.maxSpeed);
    }

    jump() {
        if (this.defeated || this.isJumping || this.hitStun > 0) return;
        this.velocityY = -this.jumpPower;
        this.isJumping = true;
    }

    block(state) {
        if (this.defeated || this.isAttacking) return;
        this.isBlocking = state;
    }

    // ── Attack ──
    attack(type = 'light') {
        if (this.defeated || this.isAttacking || this.attackCooldown > 0 || this.hitStun > 0) return false;

        this.isAttacking      = true;
        this.attackTimer       = 0;
        this.attackHit         = false;
        this.currentAttackType = type;
        this.attackCooldown    = ATTACK_COOLDOWN;

        // Lunge forward
        this.velocityX += this.facingRight ? LUNGE_SPEED : -LUNGE_SPEED;
        return true;
    }

    // ── Is in damage window? ──
    isInHitWindow() {
        return this.isAttacking &&
               this.attackTimer >= HIT_ACTIVE_START &&
               this.attackTimer <= HIT_ACTIVE_END &&
               !this.attackHit;
    }

    // ── Take damage ──
    takeDamage(damage, attackerX) {
        if (this.defeated || this.invulnerable) return false;

        if (this.isBlocking) {
            damage = Math.floor(damage * BLOCK_REDUCTION);
        }

        this.health -= damage;
        this.invulnerable = true;
        this.invulnTimer  = INVULN_FRAMES;
        this.hitStun      = 12;

        // Directional knockback
        const dir = attackerX < this.x ? 1 : -1;
        this.velocityX = dir * KNOCKBACK_FORCE;
        this.velocityY = KNOCKBACK_VERT;

        if (this.health <= 0) {
            this.health   = 0;
            this.defeated = true;
            this.isDead   = true;
            this.velocityX = dir * 8;
            this.velocityY = -10;
        }

        return true;
    }

    // ── Get current damage ──
    getCurrentDamage() {
        switch (this.currentAttackType) {
            case 'heavy':   return HEAVY_DMG;
            case 'special': return SPECIAL_DMG;
            default:        return LIGHT_DMG;
        }
    }

    // ── Katana swing angle (0→π arc over attack duration) ──
    getKatanaAngle() {
        const t = this.attackTimer / ATTACK_DURATION;
        return -Math.PI * 0.6 + t * Math.PI * 1.2;   // sweeps ~216°
    }

    // ── Draw dust ──
    drawDust(ctx) {
        ctx.save();
        for (const d of this.dustParticles) {
            ctx.globalAlpha = d.life * 0.5;
            ctx.fillStyle = 'rgba(60, 50, 40, 0.7)';
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    draw(ctx) {
        // base – override in subclass
    }
}
