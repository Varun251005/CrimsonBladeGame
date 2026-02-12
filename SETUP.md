# 🚀 Quick Start Guide

## Welcome to Stickman Shadow Revenge Development!

This guide will help you get started with developing and running your game in VS Code.

---

## 📋 Prerequisites

Before you begin, ensure you have:
- ✅ **VS Code** installed (latest version recommended)
- ✅ **Modern Web Browser** (Chrome, Firefox, or Edge)
- ✅ **Live Server Extension** for VS Code (optional but highly recommended)

---

## 🔧 Setup Instructions

### Method 1: Using Live Server (Recommended)

1. **Install Live Server Extension**
   - Open VS Code
   - Press `Ctrl + Shift + X` to open Extensions
   - Search for "Live Server" by Ritwick Dey
   - Click **Install**

2. **Open Your Project**
   - Open the `game` folder in VS Code
   - Right-click on `index.html`
   - Select **"Open with Live Server"**
   - Your default browser will open with the game running!

3. **Auto-Reload Feature**
   - Any changes you make to the code will automatically reload in the browser
   - Perfect for development and testing!

### Method 2: Direct Browser Opening

1. **Navigate to the project folder**
   - Go to `c:\game\`
   - Double-click `index.html`
   - The game will open in your default browser

**Note:** Some features might be limited without a local server due to browser security policies.

---

## 🎮 Game Controls Reference

### Player 1 (Keyboard - Left Side)
```
W - Jump
A - Move Left
S - Crouch/Block
D - Move Right
F - Light Punch (5 damage)
G - Heavy Attack (10 damage)
H - Special Move (15 damage)
```

### Player 2 (Numpad - Right Side)
```
8 - Jump
4 - Move Left
5 - Crouch/Block
6 - Move Right
1 - Light Punch (5 damage)
2 - Heavy Attack (10 damage)
3 - Special Move (15 damage)
```

---

## 🎯 Game Modes

### 1 Player Mode
- Battle against AI-controlled robots
- Robots get progressively more aggressive
- Earn points for hitting enemies
- Survive as long as possible!
- **Scoring:**
  - Hit enemy: +10 points
  - Defeat enemy: +100 points

### 2 Players Mode
- Local multiplayer fighting
- Best of 3 rounds
- First player to win 2 rounds wins the match
- 99 seconds per round

---

## 🛠️ Project Structure

```
game/
├── index.html              # Main HTML file - Game container
├── css/
│   └── style.css          # All styling and animations
├── js/
│   ├── game.js            # Main game loop and state management
│   ├── character.js       # Base character class (health, attacks, etc.)
│   ├── stickman.js        # Stickman player with animations
│   ├── robot.js           # Robot enemy with AI logic
│   ├── controls.js        # Keyboard input handling
│   ├── physics.js         # Physics engine and collision detection
│   └── ui.js              # UI management (menus, HUD, etc.)
├── README.md              # Project documentation
├── SETUP.md              # This file!
└── TECH_STACK.md         # Technical details
```

---

## 🐛 Troubleshooting

### Game doesn't start
- ✅ Make sure all files are in the correct folders
- ✅ Check browser console for errors (F12)
- ✅ Try using Live Server instead of direct file opening

### Controls not working
- ✅ Click on the game canvas/window to focus it
- ✅ Make sure NumLock is ON for Player 2
- ✅ Check if another application is intercepting keys

### Canvas is blank
- ✅ Check browser console (F12) for JavaScript errors
- ✅ Ensure all JS files are loaded in correct order
- ✅ Try refreshing the page (Ctrl + F5)

### Performance issues
- ✅ Close other browser tabs
- ✅ Update your graphics drivers
- ✅ Try a different browser (Chrome recommended)

---

## 🎨 Customization Tips

### Change Character Colors
Edit in `stickman.js` and `robot.js`:
```javascript
// In stickman.js constructor
const color = playerNumber === 1 ? '#00ff00' : '#ff00ff';
// Change these hex colors to your preference!
```

### Adjust Game Difficulty
Edit in `character.js` and `robot.js`:
```javascript
// In character.js
this.health = 100;          // Change max health
this.damage = 5;            // Change attack damage
this.speed = 5;             // Change movement speed

// In robot.js
this.aggressionLevel = 0.7; // 0-1, higher = more aggressive
```

### Modify Controls
Edit in `controls.js`:
```javascript
this.player1Keys = {
    up: 'w',              // Change to any key
    left: 'a',
    // ... etc
};
```

### Change Arena Size
Edit in `game.js`:
```javascript
this.canvas.width = 1200;   // Change width
this.canvas.height = 600;   // Change height
```

---

## 📚 Learning Resources

### Want to learn more?
- **HTML5 Canvas**: [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- **JavaScript Game Development**: [MDN Game Development](https://developer.mozilla.org/en-US/docs/Games)
- **Animation Loop**: Understanding requestAnimationFrame
- **Collision Detection**: AABB collision basics

### Next Steps
1. ✨ Add sound effects
2. 🎵 Include background music
3. 🏆 Create a high score system
4. 🎨 Design custom backgrounds
5. ⚔️ Add weapons and power-ups
6. 🤖 Create different enemy types
7. 📱 Add mobile touch controls

---

## 🤝 Contributing

Have ideas to improve the game? Here's how:

1. **Add new features** - Weapons, combos, new moves
2. **Improve graphics** - Better animations, particle effects
3. **Enhance AI** - Smarter robot behavior
4. **Create levels** - Different arenas, obstacles
5. **Add sound** - Effects and music
6. **Optimize performance** - Smoother gameplay

---

## 📝 Development Workflow

### Making Changes
1. Edit your code in VS Code
2. Save the file (Ctrl + S)
3. Browser auto-reloads (with Live Server)
4. Test your changes
5. Repeat!

### Best Practices
- ✅ Comment your code
- ✅ Test after each change
- ✅ Keep functions small and focused
- ✅ Use meaningful variable names
- ✅ Check browser console for errors

### Debugging Tips
1. Open Developer Tools (F12)
2. Use `console.log()` to track values
3. Set breakpoints in Sources tab
4. Watch variables in real-time
5. Use Network tab to check file loading

---

## 🎉 You're Ready!

Everything is set up and ready to go! Here's what to do next:

1. **Right-click** `index.html` in VS Code
2. **Select** "Open with Live Server"
3. **Play** your game!
4. **Experiment** with the code
5. **Have fun** developing!

---

## 💡 Tips for Success

- 🎮 Play the game first to understand mechanics
- 📖 Read through the code comments
- 🔍 Start with small changes
- 💾 Save your work frequently
- 🧪 Test every modification
- 📝 Keep notes of your ideas
- 🎨 Get creative with customizations!

---

**Happy Coding! 🚀**

*Remember: The best way to learn is by doing. Don't be afraid to experiment and break things - that's how you learn!*
