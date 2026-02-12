# 🥷 Stickman Shadow Revenge

A 2D action-packed fighting game inspired by Shadow Ninja Revenge, featuring stickman characters with smooth animations and intense combat mechanics!

## 🎮 Game Overview

**Stickman Shadow Revenge** is a thrilling 2D fighting game where players control stickman warriors in epic battles. Choose between single-player mode (fight against AI-controlled robots) or two-player mode (compete with a friend in local multiplayer).

## ✨ Features

- **Two Game Modes:**
  - **1 Player Mode**: Battle against AI-controlled robots with increasing difficulty
  - **2 Player Mode**: Local multiplayer combat - fight with your friend!

- **Fluid Combat System:**
  - Punch, kick, and special moves
  - Health bars and damage system
  - Combo attacks
  - Block and dodge mechanics

- **Smooth 2D Animations:**
  - Stickman character animations (idle, walk, attack, jump, hurt, death)
  - Robot enemy animations
  - Impact effects and visual feedback

- **Keyboard Controls:**
  - **Player 1**: Alphabet keys (WASD + F, G, H for attacks)
  - **Player 2**: Numpad keys (8456 + 1, 2, 3 for attacks)

## 🛠️ Tech Stack

### Core Technologies
- **HTML5**: Game structure and canvas setup
- **CSS3**: Styling and UI elements
- **JavaScript (ES6+)**: Game logic and mechanics

### Graphics & Animation
- **HTML5 Canvas API**: 2D rendering
- **RequestAnimationFrame**: Smooth 60 FPS game loop
- **Custom sprite animation system**

### Architecture
- **Object-Oriented Programming**: Character classes, game state management
- **Modular design**: Separate files for different game components
- **Event-driven input system**: Keyboard event handling

## 📁 Project Structure

```
game/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Game styling and UI
├── js/
│   ├── game.js            # Main game engine and loop
│   ├── character.js       # Base character class
│   ├── stickman.js        # Stickman player character
│   ├── robot.js           # Robot enemy AI
│   ├── controls.js        # Input handling system
│   ├── physics.js         # Collision detection & physics
│   └── ui.js              # Menu and HUD interface
├── assets/
│   └── sounds/            # Sound effects (optional)
└── README.md              # This file
```

## 🎯 Controls

### Player 1 (Keyboard - Alphabets)
| Key | Action |
|-----|--------|
| W   | Jump |
| A   | Move Left |
| S   | Crouch/Block |
| D   | Move Right |
| F   | Light Punch |
| G   | Heavy Punch/Kick |
| H   | Special Move |

### Player 2 (Numpad)
| Key | Action |
|-----|--------|
| 8   | Jump |
| 4   | Move Left |
| 5   | Crouch/Block |
| 6   | Move Right |
| 1   | Light Punch |
| 2   | Heavy Punch/Kick |
| 3   | Special Move |

## 🚀 How to Run

1. **Clone or download** this repository to your local machine
2. **Open VS Code** and navigate to the project folder
3. **Install Live Server extension** (if not already installed):
   - Press `Ctrl+P` in VS Code
   - Type: `ext install ritwickdey.LiveServer`
   - Press Enter
4. **Right-click** on `index.html`
5. **Select** "Open with Live Server"
6. The game will open in your default browser!

### Alternative Method (without Live Server)
Simply open `index.html` directly in any modern web browser (Chrome, Firefox, Edge recommended).

## 🎮 How to Play

1. **Main Menu**: Choose between "1 Player" or "2 Players" mode
2. **1 Player Mode**: 
   - Control your stickman fighter
   - Defeat waves of robot enemies
   - Survive as long as possible
   - Increase your high score!

3. **2 Player Mode**:
   - Player 1 uses alphabet keys
   - Player 2 uses numpad
   - First to deplete opponent's health wins
   - Best of 3 rounds!

## 🔧 Development

### Requirements
- Modern web browser (Chrome 90+, Firefox 88+, Edge 90+)
- VS Code (recommended) or any text editor
- Live Server extension (optional but recommended)

### Customization
You can easily customize:
- **Character stats**: Edit health, speed, damage values in character classes
- **Controls**: Modify key mappings in `controls.js`
- **Visuals**: Adjust colors, sizes in `stickman.js` and `robot.js`
- **Game mechanics**: Tweak physics in `physics.js`

## 📝 Future Enhancements

- [ ] Add power-ups and weapons
- [ ] Multiple arenas/backgrounds
- [ ] Character selection screen
- [ ] Sound effects and background music
- [ ] Special combo moves
- [ ] Achievement system
- [ ] Online multiplayer support
- [ ] Mobile touch controls

## 🤝 Contributing

Feel free to fork this project and add your own features! Some ideas:
- New character types
- Different attack animations
- Boss battles
- Story mode

## 📄 License

This project is open source and available for educational purposes.

## 🎨 Credits

Inspired by Shadow Ninja Revenge and classic 2D fighting games!

---

**Built with ❤️ using HTML5, CSS3, and JavaScript**

Enjoy the fight! 🥊
