# XP Clicker Game 🎮

An addictive incremental clicker game built with vanilla JavaScript, HTML, and CSS. Level up, buy upgrades, hire auto-clickers, and unlock achievements!

![CI/CD](https://github.com/yourusername/hello/workflows/CI%2FCD%20Pipeline/badge.svg)

## 🎯 Features

- **XP System**: Click to gain XP and level up
- **Leveling**: Progressive difficulty with increasing XP requirements
- **Upgrades**: Purchase click multipliers to boost your power
- **Auto Clickers**: Hire workers to generate passive XP
- **Achievements**: Unlock achievements and earn bonus coins
- **Save System**: Auto-save and manual save functionality
- **Responsive Design**: Play on desktop or mobile

## 🚀 Quick Start

### Play Online
Visit the game at: [GitHub Pages URL]

### Play Locally

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hello.git
cd hello
```

2. Open `game.html` in your browser:
```bash
# On Windows
start game.html

# On macOS
open game.html

# On Linux
xdg-open game.html
```

Or use a local server:
```bash
npm install
npm start
```

Then visit `http://localhost:8080/game.html`

## 🎮 How to Play

1. **Click the button** to earn XP
2. **Level up** when you reach the XP threshold
3. **Earn coins** from leveling up and achievements
4. **Buy upgrades** to increase click power
5. **Hire auto-clickers** for passive XP generation
6. **Unlock achievements** for bonus rewards

## 🛠️ Development

### Prerequisites
- Node.js 18+ (for development tools)
- Git

### Install Development Dependencies
```bash
npm install
```

### Run Linting
```bash
# Lint JavaScript
npm run lint

# Lint CSS
npm run lint:css

# Validate HTML
npm run validate:html

# Run all checks
npm test
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that:

### Automated Checks
- ✅ **HTML Validation**: Validates all HTML files
- ✅ **JavaScript Linting**: ESLint checks for code quality
- ✅ **CSS Validation**: Stylelint ensures CSS standards
- ✅ **Security Checks**: Scans for potential secrets
- ✅ **File Size Monitoring**: Warns about large files
- ✅ **Performance Checks**: Detects console.log and TODOs

### Build & Deploy
- 📦 **Build Artifacts**: Creates production-ready build
- 🚀 **Auto Deploy**: Deploys to GitHub Pages on main branch

### Workflow Triggers
- Push to `main` or `goodbye` branches
- Pull requests to `main` branch

## 📁 Project Structure

```
hello/
├── game.html           # Main game page
├── game.css            # Game styles
├── game.js             # Game logic
├── index.html          # Landing page
├── style.css           # Landing page styles
├── script.js           # Landing page scripts
├── package.json        # Dependencies and scripts
├── .github/
│   └── workflows/
│       └── ci-cd.yml   # CI/CD pipeline
└── README.md           # This file
```

## 🎨 Customization

### Add New Upgrades
Edit the `upgrades` array in `game.js`:
```javascript
{
    id: 'my_upgrade',
    name: 'My Upgrade',
    icon: '🎯',
    description: 'Description here',
    baseCost: 100,
    costMultiplier: 2,
    effect: () => gameState.clickValue *= 2
}
```

### Add New Auto Clickers
Edit the `autoClickers` array in `game.js`:
```javascript
{
    id: 'my_clicker',
    name: 'My Clicker',
    icon: '🤖',
    description: '10 XP/s',
    baseCost: 1000,
    costMultiplier: 1.15,
    xpPerSecond: 10
}
```

### Add New Achievements
Edit the `achievements` array in `game.js`:
```javascript
{
    id: 'my_achievement',
    name: 'My Achievement',
    icon: '🏆',
    description: 'Achievement description',
    condition: () => gameState.level >= 20
}
```

## 🧪 Testing

The game includes automated testing in the CI/CD pipeline. To run tests locally:

```bash
npm test
```

## 📄 License

MIT License - feel free to use this project for learning or your own games!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues

- Save data is stored in localStorage (cleared if browser cache is cleared)
- Large numbers may cause display issues (consider number formatting for very large values)

## 🎯 Future Enhancements

- [ ] Prestige system
- [ ] Multiple save slots
- [ ] Sound effects and music
- [ ] Leaderboards
- [ ] More upgrade tiers
- [ ] Special events and bonuses

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions

---

Made with ❤️ using vanilla JavaScript
