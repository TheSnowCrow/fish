# 🐟 Fish Putt Adventure

A retro-style physics-based mini-golf puzzle game where you help a tiny fish escape from its tank and make its way to the ocean!

## 🎮 Game Overview

Fish Putt Adventure is a charming physics puzzler combining slingshot mechanics with mini-golf gameplay. Pull back and launch your fish through increasingly challenging levels across 5 unique worlds.

### Features

- **Retro Pixel Art Style** - Classic 8-bit aesthetics with modern gameplay
- **Physics-Based Gameplay** - Realistic bouncing, friction, and momentum
- **5 Unique Worlds** - From fish tanks to sewers to the open ocean
- **15 Handcrafted Levels** - 3 levels per world with increasing difficulty
- **Multiple Surface Types** - Glass, tile, soap, sponge, sand, and more!
- **Fun Obstacles** - Rotating toothbrushes, swinging cat paws, bouncy bumpers, and bubbles
- **Star Rating System** - Challenge yourself to complete levels with fewer strokes
- **Collectibles** - Gather shells and starfish in each level
- **Retro Sound Effects** - Chiptune-style beeps and boops

## 🎯 How to Play

### Controls

1. **Aim**: Click/tap and drag from the fish to aim
2. **Launch**: Release to launch the fish in the opposite direction
3. **Boost**: Tap/click during flight to use your bubble boost (once per shot)

### Goal

- Reach the water goal zone in each level
- Use as few strokes as possible to earn more stars
- Collect shells and starfish for extra points

### Scoring

- ⭐⭐⭐ 3 Stars: Complete under par (2+ strokes under limit)
- ⭐⭐ 2 Stars: Complete at par (within stroke limit)
- ⭐ 1 Star: Complete over par (using extra strokes)

## 🌍 Worlds

1. **Fish Tank Escape** - Tutorial levels with gentle obstacles
2. **Bathroom Counter** - Slippery surfaces and spinning brushes
3. **Bathtub Run** - Bouncy rubber ducks and bubble lifts
4. **Sewer Putt-Putt** - Challenging pipes and slime zones
5. **Beach + Ocean** - The final push to freedom!

## 🚀 Running the Game

### Quick Start

Simply open `index.html` in a modern web browser:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Or just double-click index.html
```

Then navigate to `http://localhost:8000` in your browser.

### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- HTML5 Canvas support
- Web Audio API support (for sound)

### Mobile Support

The game works on mobile devices with touch controls! For the best experience:
- Use in landscape mode
- Add to home screen for fullscreen play
- Ensure device audio is enabled

## 🎨 Technical Details

### Technologies Used

- **HTML5 Canvas** - For retro pixel rendering
- **Vanilla JavaScript** - No frameworks, pure JS
- **Web Audio API** - For retro sound effects
- **LocalStorage** - For save game progress

### Architecture

```
├── index.html          # Entry point
└── js/
    ├── utils.js        # Vector math and utilities
    ├── audio.js        # Sound system
    ├── particles.js    # Particle effects
    ├── physics.js      # Physics engine
    ├── entities.js     # Fish and game objects
    ├── obstacles.js    # Environmental hazards
    ├── levels.js       # Level definitions
    ├── input.js        # Touch/mouse handling
    ├── renderer.js     # Rendering system
    ├── ui.js           # Menus and UI
    ├── game.js         # Main game engine
    └── main.js         # Initialization
```

### Surface Types

Each surface affects physics differently:

- **Glass**: High bounce, low friction (slippery)
- **Tile**: Medium bounce, medium friction
- **Soap**: Very low friction (super slippery!)
- **Sponge**: Low bounce, high friction (absorbs energy)
- **Towel**: Very high friction (stops movement quickly)
- **Sand**: Medium-high friction, low bounce

### Obstacles

- **Bumpers**: Bouncy circles that propel the fish
- **Rotating Toothbrush**: Spinning obstacle that knocks fish away
- **Swinging Cat Paw**: Pendulum that swats the fish
- **Bubbles**: Lift the fish upward when touched
- **Moving Platforms**: Platforms that move back and forth

## 🎵 Audio

All sound effects are generated procedurally using the Web Audio API for authentic retro tones:

- Launch sound (whoosh)
- Bounce effects (boing)
- Goal completion (victory jingle)
- Collectibles (ding)
- Bubble pops
- Splash effects

## 🐛 Debug Mode

Press **D** key to toggle debug mode which shows:
- Physics collision circles
- FPS counter (in console)
- Additional logging

## 📱 iOS Deployment

To deploy as an iOS app:

1. Use a tool like [Capacitor](https://capacitorjs.com/) or [Cordova](https://cordova.apache.org/)
2. Wrap the HTML5 game as a native app
3. Submit to App Store

```bash
# Example with Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap copy
npx cap open ios
```

## 🎮 Gameplay Tips

- **Angle is everything**: Sometimes a gentle angle is better than raw power
- **Use walls**: Bounce off walls to reach tricky spots
- **Save your boost**: Use the mid-air boost strategically
- **Watch the obstacles**: Learn their patterns before launching
- **Experiment**: Try different approaches to find the perfect shot

## 🛠️ Customization

Want to modify the game?

- **Add levels**: Edit `js/levels.js` to add new level configurations
- **Change colors**: Modify the `Utils.COLORS` palette in `js/utils.js`
- **Adjust physics**: Tweak surface properties in `js/physics.js`
- **Add obstacles**: Create new obstacle types in `js/obstacles.js`

## 📄 License

This game was created as a demonstration project based on the Fish Putt Adventure Game Design Document.

## 🙏 Credits

- **Design**: Based on Fish Putt Adventure GDD
- **Development**: Built with retro gaming passion
- **Inspiration**: Classic games like Golf Peaks, Cut the Rope, and Angry Birds

---

**Enjoy helping the fish reach the ocean! 🐟🌊**
