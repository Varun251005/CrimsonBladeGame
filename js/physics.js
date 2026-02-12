// ============================================================
// Physics Engine – Gravity, Collision, Bounds
// ============================================================

const GRAVITY          = 1.4;
const FALL_GRAVITY     = 1.8;
const MAX_FALL_SPEED   = 20;
const GROUND_FRICTION  = 0.85;
const AIR_FRICTION     = 0.96;
const MIN_VELOCITY     = 0.15;
const KATANA_RANGE     = 65;
const KATANA_HIT_H     = 55;

class Physics {
    constructor() {
        this.gravity     = GRAVITY;
        this.fallGravity = FALL_GRAVITY;
        this.maxFall     = MAX_FALL_SPEED;
        this.friction    = GROUND_FRICTION;
        this.airFriction = AIR_FRICTION;
    }

    applyGravity(character, ground) {
        const isOnGround = character.y + character.height >= ground;

        if (!isOnGround) {
            const g = character.velocityY > 0 ? this.fallGravity : this.gravity;
            character.velocityY += g;
            if (character.velocityY > this.maxFall) {
                character.velocityY = this.maxFall;
            }
        } else {
            if (character.isJumping && character.velocityY >= 0) {
                character.onLand();
            }
            character.y = ground - character.height;
            character.velocityY = 0;
            character.isJumping = false;
        }
    }

    applyFriction(character) {
        const f = character.isJumping ? this.airFriction : this.friction;
        character.velocityX *= f;
        if (Math.abs(character.velocityX) < MIN_VELOCITY) character.velocityX = 0;
    }

    checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    checkAttackCollision(attacker, defender) {
        if (!attacker.isAttacking || attacker.attackHit) return false;

        const hitbox = {
            x: attacker.facingRight
                ? attacker.x + attacker.width - 10
                : attacker.x - KATANA_RANGE + 10,
            y: attacker.y + 10,
            width:  KATANA_RANGE,
            height: KATANA_HIT_H
        };
        return this.checkCollision(hitbox, defender);
    }

    keepInBounds(character, canvasWidth) {
        if (character.x < 0) { character.x = 0; character.velocityX = 0; }
        if (character.x + character.width > canvasWidth) {
            character.x = canvasWidth - character.width;
            character.velocityX = 0;
        }
    }

    updatePosition(character) {
        character.x += character.velocityX;
        character.y += character.velocityY;
    }
}
