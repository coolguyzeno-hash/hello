// Game State
let gameState = {
    xp: 0,
    level: 1,
    coins: 0,
    clickValue: 1,
    xpPerSecond: 0,
    upgrades: {},
    autoClickers: {},
    achievements: {}
};

// XP needed for each level
function getXPForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

// Upgrades Data
const upgrades = [
    {
        id: 'click1',
        name: 'Better Clicks',
        icon: '👆',
        description: 'Double your click power',
        baseCost: 50,
        costMultiplier: 2,
        effect: () => gameState.clickValue *= 2
    },
    {
        id: 'click2',
        name: 'Super Clicks',
        icon: '✊',
        description: 'Triple your click power',
        baseCost: 500,
        costMultiplier: 3,
        effect: () => gameState.clickValue *= 3
    },
    {
        id: 'click3',
        name: 'Mega Clicks',
        icon: '💪',
        description: 'x5 click power',
        baseCost: 2000,
        costMultiplier: 4,
        effect: () => gameState.clickValue *= 5
    }
];

// Auto Clickers Data
const autoClickers = [
    {
        id: 'auto1',
        name: 'Intern',
        icon: '👨‍💻',
        description: '1 XP/s',
        baseCost: 100,
        costMultiplier: 1.15,
        xpPerSecond: 1
    },
    {
        id: 'auto2',
        name: 'Developer',
        icon: '👩‍💻',
        description: '5 XP/s',
        baseCost: 500,
        costMultiplier: 1.15,
        xpPerSecond: 5
    },
    {
        id: 'auto3',
        name: 'Senior Dev',
        icon: '🧑‍💼',
        description: '20 XP/s',
        baseCost: 2500,
        costMultiplier: 1.15,
        xpPerSecond: 20
    },
    {
        id: 'auto4',
        name: 'Tech Lead',
        icon: '👔',
        description: '100 XP/s',
        baseCost: 10000,
        costMultiplier: 1.15,
        xpPerSecond: 100
    },
    {
        id: 'auto5',
        name: 'AI Bot',
        icon: '🤖',
        description: '500 XP/s',
        baseCost: 50000,
        costMultiplier: 1.15,
        xpPerSecond: 500
    }
];

// Achievements Data
const achievements = [
    {
        id: 'first_click',
        name: 'First Steps',
        icon: '🎯',
        description: 'Make your first click',
        condition: () => gameState.xp >= 1
    },
    {
        id: 'level_5',
        name: 'Rising Star',
        icon: '⭐',
        description: 'Reach level 5',
        condition: () => gameState.level >= 5
    },
    {
        id: 'level_10',
        name: 'Expert',
        icon: '🏆',
        description: 'Reach level 10',
        condition: () => gameState.level >= 10
    },
    {
        id: 'first_upgrade',
        name: 'Upgrader',
        icon: '⬆️',
        description: 'Buy your first upgrade',
        condition: () => Object.keys(gameState.upgrades).length > 0
    },
    {
        id: 'first_auto',
        name: 'Automation Begins',
        icon: '⚙️',
        description: 'Buy your first auto clicker',
        condition: () => Object.values(gameState.autoClickers).some(count => count > 0)
    },
    {
        id: 'rich',
        name: 'Wealthy',
        icon: '💰',
        description: 'Earn 1000 coins',
        condition: () => gameState.coins >= 1000
    }
];

// Initialize game
function init() {
    loadGame();
    renderUpgrades();
    renderAutoClickers();
    renderAchievements();
    updateUI();

    // Click button
    document.getElementById('clickBtn').addEventListener('click', handleClick);

    // Footer buttons
    document.getElementById('saveBtn').addEventListener('click', saveGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);

    // Auto-save every 30 seconds
    setInterval(saveGame, 30000);

    // Auto clicker interval
    setInterval(autoClickerTick, 1000);

    // Update XP per second display
    setInterval(updateXPPerSecond, 100);
}

// Handle click
function handleClick(e) {
    const xpGained = gameState.clickValue;
    gameState.xp += xpGained;

    // Floating XP effect
    createFloatingXP(e, xpGained);

    checkLevelUp();
    checkAchievements();
    updateUI();
}

// Create floating XP effect
function createFloatingXP(e, value) {
    const effects = document.getElementById('clickEffects');
    const floatingXP = document.createElement('div');
    floatingXP.className = 'floating-xp';
    floatingXP.textContent = `+${value}`;

    const rect = e.target.getBoundingClientRect();
    floatingXP.style.left = `${e.clientX - rect.left}px`;
    floatingXP.style.top = `${e.clientY - rect.top}px`;

    effects.appendChild(floatingXP);

    setTimeout(() => floatingXP.remove(), 1000);
}

// Check level up
function checkLevelUp() {
    const xpNeeded = getXPForLevel(gameState.level);

    if (gameState.xp >= xpNeeded) {
        gameState.xp -= xpNeeded;
        gameState.level++;
        gameState.coins += 10;

        showLevelUpOverlay();
        checkAchievements();
    }
}

// Show level up overlay
function showLevelUpOverlay() {
    const overlay = document.getElementById('levelUpOverlay');
    document.getElementById('newLevel').textContent = gameState.level;
    overlay.classList.add('show');

    setTimeout(() => {
        overlay.classList.remove('show');
    }, 2000);
}

// Auto clicker tick
function autoClickerTick() {
    let totalXPPerSec = 0;

    autoClickers.forEach(clicker => {
        const count = gameState.autoClickers[clicker.id] || 0;
        totalXPPerSec += clicker.xpPerSecond * count;
    });

    gameState.xpPerSecond = totalXPPerSec;
    gameState.xp += totalXPPerSec;

    checkLevelUp();
    updateUI();
}

// Update XP per second
function updateXPPerSecond() {
    let totalXPPerSec = 0;

    autoClickers.forEach(clicker => {
        const count = gameState.autoClickers[clicker.id] || 0;
        totalXPPerSec += clicker.xpPerSecond * count;
    });

    document.getElementById('xpPerSec').textContent = totalXPPerSec;
}

// Render upgrades
function renderUpgrades() {
    const grid = document.getElementById('upgradesGrid');
    grid.innerHTML = '';

    upgrades.forEach(upgrade => {
        const timesOwned = gameState.upgrades[upgrade.id] || 0;
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, timesOwned));
        const canBuy = gameState.coins >= cost;

        const card = document.createElement('div');
        card.className = `upgrade-card ${!canBuy ? 'disabled' : ''}`;
        card.innerHTML = `
            <div class="upgrade-icon">${upgrade.icon}</div>
            <div class="upgrade-name">${upgrade.name}</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-cost">
                <span class="cost-value">${cost} coins</span>
                <button class="buy-btn" ${!canBuy ? 'disabled' : ''}>Buy</button>
            </div>
        `;

        card.querySelector('.buy-btn').addEventListener('click', () => buyUpgrade(upgrade.id));
        grid.appendChild(card);
    });
}

// Buy upgrade
function buyUpgrade(id) {
    const upgrade = upgrades.find(u => u.id === id);
    const timesOwned = gameState.upgrades[id] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, timesOwned));

    if (gameState.coins >= cost) {
        gameState.coins -= cost;
        gameState.upgrades[id] = timesOwned + 1;
        upgrade.effect();

        checkAchievements();
        renderUpgrades();
        updateUI();
    }
}

// Render auto clickers
function renderAutoClickers() {
    const grid = document.getElementById('autoClickersGrid');
    grid.innerHTML = '';

    autoClickers.forEach(clicker => {
        const owned = gameState.autoClickers[clicker.id] || 0;
        const cost = Math.floor(clicker.baseCost * Math.pow(clicker.costMultiplier, owned));
        const canBuy = gameState.coins >= cost;

        const card = document.createElement('div');
        card.className = `auto-clicker-card ${!canBuy ? 'disabled' : ''}`;
        card.innerHTML = `
            <div class="upgrade-icon">${clicker.icon}</div>
            <div class="auto-clicker-name">${clicker.name} <span class="auto-clicker-count">${owned}</span></div>
            <div class="auto-clicker-description">${clicker.description}</div>
            <div class="upgrade-cost">
                <span class="cost-value">${cost} coins</span>
                <button class="buy-btn" ${!canBuy ? 'disabled' : ''}>Buy</button>
            </div>
        `;

        card.querySelector('.buy-btn').addEventListener('click', () => buyAutoClicker(clicker.id));
        grid.appendChild(card);
    });
}

// Buy auto clicker
function buyAutoClicker(id) {
    const clicker = autoClickers.find(c => c.id === id);
    const owned = gameState.autoClickers[id] || 0;
    const cost = Math.floor(clicker.baseCost * Math.pow(clicker.costMultiplier, owned));

    if (gameState.coins >= cost) {
        gameState.coins -= cost;
        gameState.autoClickers[id] = owned + 1;

        checkAchievements();
        renderAutoClickers();
        updateUI();
    }
}

// Render achievements
function renderAchievements() {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = '';

    achievements.forEach(achievement => {
        const unlocked = gameState.achievements[achievement.id] || false;

        const card = document.createElement('div');
        card.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
        `;

        grid.appendChild(card);
    });
}

// Check achievements
function checkAchievements() {
    let newAchievements = false;

    achievements.forEach(achievement => {
        if (!gameState.achievements[achievement.id] && achievement.condition()) {
            gameState.achievements[achievement.id] = true;
            gameState.coins += 50; // Reward for achievement
            newAchievements = true;
        }
    });

    if (newAchievements) {
        renderAchievements();
        updateUI();
    }
}

// Update UI
function updateUI() {
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('xp').textContent = Math.floor(gameState.xp);
    document.getElementById('coins').textContent = gameState.coins;
    document.getElementById('clickValue').textContent = gameState.clickValue;

    const xpNeeded = getXPForLevel(gameState.level);
    const percentage = (gameState.xp / xpNeeded) * 100;

    document.getElementById('xpBar').style.width = `${Math.min(percentage, 100)}%`;
    document.getElementById('xpText').textContent = `${Math.floor(gameState.xp)} / ${xpNeeded}`;
}

// Save game
function saveGame() {
    localStorage.setItem('xpClickerSave', JSON.stringify(gameState));

    // Visual feedback
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.textContent = '✅ Saved!';
    setTimeout(() => {
        saveBtn.textContent = '💾 Save Game';
    }, 1000);
}

// Load game
function loadGame() {
    const saved = localStorage.getItem('xpClickerSave');

    if (saved) {
        gameState = JSON.parse(saved);
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset all progress?')) {
        localStorage.removeItem('xpClickerSave');
        location.reload();
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', init);
