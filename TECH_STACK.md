# 🔧 Technical Stack Documentation

## Stickman Shadow Revenge - Tech Stack & Architecture

---

## 📊 Technology Overview

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | 5 | Game structure and DOM management |
| CSS3 | 3 | Styling, animations, and UI design |
| JavaScript | ES6+ | Game logic and interactivity |
| Canvas API | 2D Context | Graphics rendering engine |

---

## 🏗️ Architecture Design

### Design Pattern: **Object-Oriented Programming (OOP)**

The game follows OOP principles with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           Main Game Loop                │
│         (game.js - 60 FPS)              │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
   ┌───▼────┐      ┌────▼────┐
   │ Player │      │ Physics │
   │ Update │      │ Engine  │
   └───┬────┘      └────┬────┘
       │                │
       └────────┬───────┘
                │
         ┌──────▼───────┐
         │  Collision   │
         │  Detection   │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │   Render     │
         │   (Canvas)   │
         └──────────────┘
```




  - HUD updates
  - Health bar rendering
  - Score display
  - Game over screen

Methods:
  - showMainMenu()   → Main menu
  - showHUD()        → Game interface
  - updateHealth()   → Health bars
  - updateTimer()    → Countdown
  - updateScore()    → Score display
  - showGameOver()   → End screen
```

---

## 🎮 Game Loop Architecture

### RequestAnimationFrame Loop (60 FPS)

```javascript
gameLoop() {
  1. Clear Canvas
     ↓
  2. Draw Background (sky, ground, clouds)
     ↓
  3. Update Player Input
     ↓
  4. Update AI Logic (if 1-player mode)
     ↓
  5. Apply Physics (gravity, friction)
     ↓
  6. Check Collisions (players, attacks)
     ↓
  7. Update Positions
     ↓
  8. Draw Characters
     ↓
  9. Update UI (health, score, timer)
     ↓
  10. Check Win Conditions
     ↓
  11. Request Next Frame
     ↓
  Loop continues...
}
```

---

## ⚙️ Physics System

### Gravity Implementation
```javascript
gravity = 0.8 pixels/frame²
velocityY += gravity (each frame)
if (y + height >= ground) {
    y = ground - height
    velocityY = 0
    isJumping = false
}
```

### Collision Detection (AABB)
```javascript
// Axis-Aligned Bounding Box
collision = 
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
```

### Attack Hitbox
```javascript
hitbox = {
    x: attacker.x + (facingRight ? width : -40),
    y: attacker.y + 20,
    width: 40,
    height: 60
}
```

---

## 🎨 Animation System

### Frame-Based Animation
```javascript
animationSpeed counter → increment each frame
Every 5 frames: advance animation frame
animationFrame = (frame + 1) % 4

States:
- idle   → Breathing/bobbing animation
- walk   → Leg and arm swing cycle
- jump   → Extended pose
- attack → Punch extension + effect
- death  → Falling animation
```

---

## 🤖 AI System (Robot)

### Decision Tree
```
Every 30 frames:
├─ Distance < 80px?
│  ├─ Yes → Attack (70% chance)
│  │       ├─ Special (30%)
│  │       ├─ Heavy (30%)
│  │       └─ Light (40%)
│  └─ No → Continue
│
├─ Distance < 100px?
│  └─ Block (30% chance)
│
├─ Distance > 150px?
│  └─ Move towards player
│
└─ Optimal range (50-150px)
   └─ Maintain distance
```

### Aggression Scaling
```javascript
aggressionLevel starts at 0.7
Increases by 0.1 each round (max 0.9)
Higher aggression = more attacks
```

---

## 💾 State Management

### Game States
```javascript
States:
- 'menu'     → Main menu displayed
- 'playing'  → Active gameplay
- 'roundEnd' → Between rounds
- 'gameover' → Game ended

Mode:
- '1player'  → vs AI robots
- '2players' → vs human player
```

### Round System (2-Player)
```javascript
maxRounds = 3 (best of 3)
Win condition = Math.ceil(maxRounds / 2)
              = 2 wins required
Track: player1Wins, player2Wins
```

---

## 🎯 Combat System

### Damage Types
```javascript
Light Attack  → 5 damage  (fast, spam-able)
Heavy Attack  → 10 damage (slower cooldown)
Special Move  → 15 damage (longest cooldown)

Blocking reduces damage by 70%
Invulnerability frames = 20 (after hit)
```

### Attack Cooldowns
```javascript
attackCooldown = 30 frames (~0.5 seconds)
attackDuration = 15 frames (active hitbox)

Cooldown prevents spam
Duration determines hit window
```

---

## 🎨 Rendering Pipeline

### Canvas Layers (bottom to top)
```
1. Clear Canvas
2. Sky Gradient
3. Clouds (animated)
4. Ground Gradient
5. Ground Line & Grass
6. Player 1
7. Player 2
8. Attack Effects
9. UI Overlay (external to canvas)
```

### Drawing Order Important!
```javascript
Background → Furthest from camera
Characters → Middle layer
Effects    → On top of characters
UI         → Separate HTML elements
```

---

## 📱 Responsive Design

### Canvas Scaling
```css
Canvas fixed at 1200x600
Centered with transform
Border and shadow effects
```

### CSS Media Queries
```css
@media (max-width: 768px)
- Reduce font sizes
- Adjust menu padding
- Stack control sections
- Smaller buttons
```

---

## 🔍 Browser Compatibility

### Minimum Requirements
```
Browser Support:
✅ Chrome 90+
✅ Firefox 88+
✅ Edge 90+
✅ Safari 14+

Required APIs:
- requestAnimationFrame
- Canvas 2D Context
- ES6 Classes
- Arrow Functions
- Template Literals
```

---

## ⚡ Performance Optimization

### Techniques Used
```javascript
1. RequestAnimationFrame (browser-optimized)
2. Object pooling (clouds array)
3. Conditional rendering (effects only when needed)
4. Event delegation
5. Minimize DOM manipulation
6. Canvas clearing only changed areas
7. Efficient collision detection
```

### Expected Performance
```
Target: 60 FPS
Canvas: 1200x600 pixels
Characters: 2 active entities
AI calculations: Every 30 frames
Minimal CPU usage: <10% on modern systems
```

---

## 🔐 Code Best Practices

### Applied Principles
```
✅ DRY (Don't Repeat Yourself)
✅ Single Responsibility Principle
✅ Class Inheritance (Character → Stickman/Robot)
✅ Modular file structure
✅ Clear naming conventions
✅ Separation of concerns
✅ Event-driven architecture
```

---

## 🚀 Future Enhancement Possibilities

### Easy Additions
- Sound effects (Web Audio API)
- Particle systems (additional canvas)
- More enemy types (new classes)
- Power-ups (collectible objects)
- Combo system (input buffer)

### Advanced Features
- WebGL rendering (3D effects)
- Online multiplayer (WebSockets)
- Animation sprite sheets
- Level system with progression
- Mobile touch controls
- Save system (LocalStorage)

---

## 📊 Performance Metrics

### Typical Frame Budget (60 FPS = 16.67ms)
```
Update Logic:    ~2ms
Physics:         ~1ms
AI Calculations: ~1ms (every 30 frames)
Rendering:       ~5ms
UI Updates:      ~1ms
Total:          ~10ms (comfortable margin)
```

---

## 🛠️ Development Tools

### Recommended VS Code Extensions
```
1. Live Server (ritwickdey.LiveServer)
2. JavaScript (ES6) code snippets
3. HTML CSS Support
4. Prettier - Code formatter
5. ESLint (for code quality)
```

### Debug Tools
```
Browser DevTools:
- Console (debugging)
- Sources (breakpoints)
- Performance (profiling)
- Network (file loading)
```

---

## 📚 API Reference

### Canvas 2D Context Methods Used
```javascript
- fillRect()        → Draw rectangles
- strokeRect()      → Draw outlines
- beginPath()       → Start new path
- arc()             → Draw circles
- lineTo()          → Draw lines
- stroke()          → Render path
- fill()            → Fill path
- save()            → Save state
- restore()         → Restore state
- translate()       → Move origin
- scale()           → Flip/scale
- clearRect()       → Clear area
```

### Web APIs Used
```javascript
- requestAnimationFrame() → Game loop
- addEventListener()      → Input handling
- setInterval()          → Timer
- setTimeout()           → Delays
- Date.now()            → Timing (if needed)
```

---

## 🎓 Learning Outcomes

### Skills Demonstrated
```
✅ Game loop architecture
✅ Object-oriented JavaScript
✅ Canvas API manipulation
✅ Physics simulation
✅ AI programming
✅ Collision detection
✅ Event handling
✅ State management
✅ Animation techniques
✅ UI/UX design
```

---

**Built with modern web technologies for maximum compatibility and performance!** 🚀
