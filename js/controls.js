// ============================================================
// Controls – Keyboard input with edge-triggered attacks
// ============================================================

class Controls {
    constructor() {
        this.keys    = {};          // currently held
        this.justPressed = {};      // edge-triggered (true once per press)

        this._onKeyDown = (e) => {
            // Ignore keys when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const key = this.normalizeKey(e);
            if (!this.keys[key]) {
                this.justPressed[key] = true;   // first frame only
            }
            this.keys[key] = true;
            // Prevent scrolling for game keys
            if (['w','a','s','d','f','g','h',
                 'arrowup','arrowdown','arrowleft','arrowright',
                 'numpad0','numpad1','numpad2','numpad3','numpad4',
                 'numpad5','numpad6','numpad7','numpad8','numpad9'].includes(key)) {
                e.preventDefault();
            }
        };

        this._onKeyUp = (e) => {
            // Ignore keys when typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const key = this.normalizeKey(e);
            this.keys[key] = false;
        };

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup',   this._onKeyUp);
    }

    // Normalize key names (numpad → simple names)
    normalizeKey(e) {
        // Map numpad keys
        if (e.code && e.code.startsWith('Numpad')) {
            return e.code.toLowerCase();   // numpad0-numpad9
        }
        return e.key.toLowerCase();
    }

    // Call once per frame AFTER processing input
    clearJustPressed() {
        this.justPressed = {};
    }

    // ── Player 1: WASD + FGH ──
    updatePlayer1(player) {
        if (player.defeated) return;

        // Movement (held keys)
        if (this.keys['a']) player.moveLeft();
        if (this.keys['d']) player.moveRight();
        if (this.justPressed['w']) player.jump();
        player.block(!!this.keys['s']);

        // Attacks (edge-triggered)
        if (this.justPressed['f']) player.attack('light');
        if (this.justPressed['g']) player.attack('heavy');
        if (this.justPressed['h']) player.attack('special');
    }

    // ── Player 2: Numpad 8456 + 123 ──
    updatePlayer2(player) {
        if (player.defeated) return;

        // Movement
        if (this.keys['numpad4']) player.moveLeft();
        if (this.keys['numpad6']) player.moveRight();
        if (this.justPressed['numpad8']) player.jump();
        player.block(!!this.keys['numpad5']);

        // Attacks (edge-triggered)
        if (this.justPressed['numpad1']) player.attack('light');
        if (this.justPressed['numpad2']) player.attack('heavy');
        if (this.justPressed['numpad3']) player.attack('special');
    }

    // Cleanup
    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup',   this._onKeyUp);
    }
}
