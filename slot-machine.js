// Game state
let balance = 500;
let currentBet = 10;
let isSpinning = false;
let isFinalSpin = false;

// Slot symbols
const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '⭐', '💎', '7️⃣'];

// DOM elements
const balanceDisplay = document.getElementById('balance');
const betInput = document.getElementById('bet-amount');
const spinBtn = document.getElementById('spin-btn');
const messageDisplay = document.getElementById('message');
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const lastChanceModal = document.getElementById('last-chance-modal');
const walkAwayBtn = document.getElementById('walk-away-btn');
const finalSpinBtn = document.getElementById('final-spin-btn');
const cutscene = document.getElementById('cutscene');
const cutsceneText = document.getElementById('cutscene-text');

// Update balance display
function updateBalance() {
    balanceDisplay.textContent = balance;
}

// Update bet button text
function updateBetButton() {
    spinBtn.textContent = `SPIN ($${currentBet})`;
}

// Get random symbol
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Get discouraging message based on balance
function getDiscoragingMessage(balance) {
    if (balance >= 400) {
        return "You lost. Maybe quit while you're ahead?";
    } else if (balance >= 300) {
        return "Another loss. This isn't looking good...";
    } else if (balance >= 200) {
        return "You're down over $200. Time to stop?";
    } else if (balance >= 150) {
        return "This is getting bad. You should really walk away.";
    } else if (balance >= 100) {
        return "You've lost half your money. STOP NOW.";
    } else if (balance >= 50) {
        return "You're hemorrhaging money. This is a terrible idea.";
    } else if (balance >= 25) {
        return "You're almost broke. Please stop this madness.";
    } else if (balance >= 10) {
        return "You have almost nothing left. Just STOP.";
    } else if (balance > 1) {
        return "You're nearly broke. This is your last chance to quit with SOMETHING.";
    }
    return "You lost everything.";
}

// Ensure symbols never match (always lose)
function getNonMatchingSymbols() {
    const s1 = getRandomSymbol();
    let s2, s3;

    // Make sure no two symbols match
    do {
        s2 = getRandomSymbol();
    } while (s2 === s1);

    do {
        s3 = getRandomSymbol();
    } while (s3 === s1 || s3 === s2);

    return [s1, s2, s3];
}

// Spin animation
function spinSlots() {
    return new Promise((resolve) => {
        const slots = [slot1, slot2, slot3];
        slots.forEach(slot => slot.classList.add('spinning'));

        let spinCount = 0;
        const maxSpins = 20;

        const interval = setInterval(() => {
            slots.forEach(slot => {
                slot.textContent = getRandomSymbol();
            });

            spinCount++;

            if (spinCount >= maxSpins) {
                clearInterval(interval);
                slots.forEach(slot => slot.classList.remove('spinning'));
                resolve();
            }
        }, 100);
    });
}

// Check for win
function checkWin(s1, s2, s3) {
    if (s1 === s2 && s2 === s3) {
        // Three of a kind
        const multipliers = {
            '🍒': 2,
            '🍋': 2,
            '🍊': 2,
            '🍇': 3,
            '🍉': 3,
            '⭐': 5,
            '💎': 10,
            '7️⃣': 20
        };
        return currentBet * (multipliers[s1] || 2);
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // Two of a kind
        return Math.floor(currentBet * 0.5);
    }
    return 0;
}

// Regular spin
async function spin() {
    if (isSpinning || balance < currentBet) return;

    isSpinning = true;
    spinBtn.disabled = true;
    messageDisplay.textContent = '';

    // Deduct bet
    balance -= currentBet;
    updateBalance();

    // Spin animation
    await spinSlots();

    // Set final symbols - ALWAYS LOSE (never match)
    const [s1, s2, s3] = getNonMatchingSymbols();

    slot1.textContent = s1;
    slot2.textContent = s2;
    slot3.textContent = s3;

    // Always lose - show discouraging message
    messageDisplay.textContent = getDiscoragingMessage(balance);
    messageDisplay.style.color = '#ff6b6b';

    // Check if down to last dollar
    if (balance === 1 && !isFinalSpin) {
        setTimeout(() => {
            lastChanceModal.classList.remove('hidden');
        }, 1500);
    } else if (balance < currentBet && balance !== 1) {
        messageDisplay.textContent = `Not enough money! Lower your bet or you're done!`;
        betInput.max = balance;
        if (currentBet > balance) {
            currentBet = balance;
            betInput.value = currentBet;
            updateBetButton();
        }
    }

    isSpinning = false;
    spinBtn.disabled = false;
}

// The legendary final spin
async function finalSpin() {
    isFinalSpin = true;
    lastChanceModal.classList.add('hidden');

    // Start cutscene
    cutscene.classList.remove('hidden');
    const cutsceneBg = document.getElementById('cutscene-bg');
    const cutsceneSlot1 = document.getElementById('cutscene-slot1');
    const cutsceneSlot2 = document.getElementById('cutscene-slot2');
    const cutsceneSlot3 = document.getElementById('cutscene-slot3');

    const messages = [
        { text: "You insert your last dollar...", effect: "normal", duration: 4000, slotAction: "idle" },
        { text: "Your hand trembles...", effect: "normal", duration: 3500, slotAction: "idle" },
        { text: "This is it...", effect: "normal", duration: 4000, slotAction: "idle" },
        { text: "Your last chance...", effect: "normal", duration: 4000, slotAction: "idle" },
        { text: "The coin drops...", effect: "normal", duration: 3500, slotAction: "idle" },
        { text: "Clink.", effect: "normal", duration: 2500, slotAction: "idle" },
        { text: "Clink.", effect: "normal", duration: 2500, slotAction: "idle" },
        { text: "Clatter.", effect: "normal", duration: 3000, slotAction: "idle" },
        { text: "Click.", effect: "normal", duration: 3000, slotAction: "idle" },
        { text: "The machine accepts it...", effect: "normal", duration: 4000, slotAction: "idle" },
        { text: "Silence.", effect: "normal", duration: 5000, slotAction: "idle" },
        { text: "...", effect: "normal", duration: 3000, slotAction: "idle" },
        { text: "The machine whirs to life...", effect: "normal", duration: 4000, slotAction: "glow" },
        { text: "A low hum fills the air...", effect: "normal", duration: 4000, slotAction: "glow" },
        { text: "Something feels... different...", effect: "normal", duration: 4500, slotAction: "glow" },
        { text: "Very different...", effect: "normal", duration: 4000, slotAction: "glow" },
        { text: "The air grows heavy...", effect: "normal", duration: 4000, slotAction: "glow" },
        { text: "You can barely breathe...", effect: "normal", duration: 4500, slotAction: "glow" },
        { text: "Static electricity crackles...", effect: "flash-colors", duration: 4000, slotAction: "glow" },
        { text: "Your hair stands on end...", effect: "normal", duration: 4000, slotAction: "glow" },
        { text: "Time seems to slow down...", effect: "normal", duration: 5000, slotAction: "glow" },
        { text: "Everything moves in slow motion...", effect: "normal", duration: 5000, slotAction: "glow" },
        { text: "The machine glows brighter...", effect: "flash-colors", duration: 4000, slotAction: "glow" },
        { text: "Brighter...", effect: "flash-colors", duration: 3500, slotAction: "glow" },
        { text: "BRIGHTER...", effect: "flash-colors", duration: 4000, slotAction: "glow" },
        { text: "The reels prepare to spin...", effect: "normal", duration: 5000, slotAction: "glow" },
        { text: "You hear a mechanical whir...", effect: "normal", duration: 4000, slotAction: "glow" },
        { text: "The reels start spinning...", effect: "normal", duration: 4000, slotAction: "start-spin" },
        { text: "Slowly at first...", effect: "normal", duration: 4000, slotAction: "spin" },
        { text: "Then faster...", effect: "shake", duration: 3500, slotAction: "spin" },
        { text: "Faster...", effect: "shake", duration: 3000, slotAction: "spin" },
        { text: "FASTER...", effect: "shake", duration: 3000, slotAction: "spin" },
        { text: "FASTER!!!", effect: "shake", duration: 3000, slotAction: "spin" },
        { text: "The machine is going CRAZY!", effect: "shake", duration: 4000, slotAction: "spin" },
        { text: "This isn't normal!", effect: "shake", duration: 4000, slotAction: "spin" },
        { text: "The floor starts vibrating...", effect: "shake", duration: 4500, slotAction: "spin" },
        { text: "The whole casino starts shaking...", effect: "shake", duration: 4500, slotAction: "spin" },
        { text: "Slot machines nearby start malfunctioning...", effect: "shake", duration: 5000, slotAction: "spin" },
        { text: "Other players step back...", effect: "shake", duration: 4000, slotAction: "spin" },
        { text: "🔴 WARNING LIGHTS ACTIVATE 🔴", effect: "flash-red", duration: 4000, slotAction: "spin" },
        { text: "⚠️ EMERGENCY PROTOCOLS ENGAGED ⚠️", effect: "flash-red", duration: 4500, slotAction: "spin" },
        { text: "Alarms start going off...", effect: "flash-red", duration: 4000, slotAction: "spin" },
        { text: "Lights are flashing EVERYWHERE...", effect: "flash-colors", duration: 4500, slotAction: "spin" },
        { text: "The entire building is lit up!", effect: "flash-colors", duration: 4500, slotAction: "spin" },
        { text: "🚨 SIRENS BLARING 🚨", effect: "flash-colors", duration: 4000, slotAction: "spin" },
        { text: "🚨 CODE RED 🚨", effect: "flash-colors", duration: 4000, slotAction: "spin" },
        { text: "People are running over!", effect: "shake", duration: 4000, slotAction: "spin" },
        { text: "A crowd is forming...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "Dozens of people...", effect: "normal", duration: 4000, slotAction: "spin" },
        { text: "Hundreds of people...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "Everyone in the casino!", effect: "shake", duration: 4500, slotAction: "spin" },
        { text: "The manager SPRINTS over...", effect: "shake", duration: 4000, slotAction: "spin" },
        { text: "His face filled with panic!", effect: "shake", duration: 4000, slotAction: "spin" },
        { text: '"WHAT\'S HAPPENING?!"', effect: "shake", duration: 4000, slotAction: "spin" },
        { text: '"IS THIS MACHINE BROKEN?!"', effect: "shake", duration: 4000, slotAction: "spin" },
        { text: '"I\'VE NEVER SEEN THIS BEFORE!"', effect: "shake", duration: 4500, slotAction: "spin" },
        { text: "He grabs his radio...", effect: "normal", duration: 4000, slotAction: "spin" },
        { text: '"GET ME SECURITY!"', effect: "shake", duration: 4000, slotAction: "spin" },
        { text: '"GET ME MAINTENANCE!"', effect: "shake", duration: 4000, slotAction: "spin" },
        { text: '"GET ME EVERYONE!"', effect: "shake", duration: 4500, slotAction: "spin" },
        { text: "Security guards rush in...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "Security cameras all turn toward you...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "You're on every monitor in the building...", effect: "normal", duration: 5000, slotAction: "spin" },
        { text: "Everyone in the casino is watching...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "All eyes on you...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "Complete silence except for the machine...", effect: "normal", duration: 5000, slotAction: "spin" },
        { text: "The machine is GLOWING...", effect: "flash-colors", duration: 4500, slotAction: "spin-glow" },
        { text: "A brilliant golden light...", effect: "flash-colors", duration: 4500, slotAction: "spin-glow" },
        { text: "It's almost blinding...", effect: "flash-colors", duration: 4500, slotAction: "spin-glow" },
        { text: "Smoke starts pouring out...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "White smoke fills the air...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "Someone yells 'FIRE!'", effect: "shake", duration: 4000, slotAction: "spin" },
        { text: '"NO! IT\'S NOT FIRE!"', effect: "shake", duration: 4000, slotAction: "spin" },
        { text: "The smoke clears...", effect: "normal", duration: 5000, slotAction: "spin" },
        { text: "The machine is still spinning...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "But something is changing...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "The sound is different...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "The pitch is lowering...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "The spinning begins to slow...", effect: "normal", duration: 5000, slotAction: "spin" },
        { text: "Slower...", effect: "normal", duration: 4000, slotAction: "spin" },
        { text: "Slower...", effect: "normal", duration: 4000, slotAction: "spin" },
        { text: "Even slower...", effect: "normal", duration: 4500, slotAction: "spin" },
        { text: "The crowd holds their breath...", effect: "normal", duration: 5000, slotAction: "spin" },
        { text: "Pin drop silence...", effect: "normal", duration: 5000, slotAction: "spin" },
        { text: "First reel...", effect: "normal", duration: 5000, slotAction: "stop-reel1" },
        { text: "It's stopping...", effect: "normal", duration: 4500, slotAction: "stop-reel1" },
        { text: "Slowing down...", effect: "normal", duration: 4500, slotAction: "stop-reel1" },
        { text: "Almost there...", effect: "normal", duration: 5000, slotAction: "stop-reel1" },
        { text: "💎", effect: "reel", duration: 4000, slotAction: "show-reel1" },
        { text: "...", effect: "normal", duration: 3000, slotAction: "reel1-glow" },
        { text: "The crowd gasps...", effect: "normal", duration: 4000, slotAction: "reel1-glow" },
        { text: "DIAMOND!", effect: "giant", duration: 4000, slotAction: "reel1-glow" },
        { text: "Someone screams!", effect: "shake", duration: 4000, slotAction: "reel1-glow" },
        { text: "The manager's jaw drops...", effect: "normal", duration: 4500, slotAction: "reel1-glow" },
        { text: '"That\'s... that\'s impossible..."', effect: "normal", duration: 4500, slotAction: "reel1-glow" },
        { text: "But wait...", effect: "normal", duration: 4500, slotAction: "reel1-glow" },
        { text: "There are still two more reels...", effect: "normal", duration: 5000, slotAction: "reel1-glow" },
        { text: "Second reel...", effect: "normal", duration: 5000, slotAction: "stop-reel2" },
        { text: "Everyone leans in...", effect: "normal", duration: 4500, slotAction: "stop-reel2" },
        { text: "Closer...", effect: "normal", duration: 4000, slotAction: "stop-reel2" },
        { text: "The tension is unbearable...", effect: "normal", duration: 5000, slotAction: "stop-reel2" },
        { text: "It's slowing...", effect: "normal", duration: 4500, slotAction: "stop-reel2" },
        { text: "Slower...", effect: "normal", duration: 4500, slotAction: "stop-reel2" },
        { text: "💎", effect: "reel", duration: 4000, slotAction: "show-reel2" },
        { text: "...", effect: "normal", duration: 3000, slotAction: "reel2-glow" },
        { text: "ANOTHER DIAMOND!!!", effect: "giant", duration: 4500, slotAction: "reel2-glow" },
        { text: '"NO WAY..."', effect: "shake", duration: 4000, slotAction: "reel2-glow" },
        { text: '"NO FREAKING WAY!"', effect: "shake", duration: 4500, slotAction: "reel2-glow" },
        { text: "The crowd is going INSANE!", effect: "shake", duration: 5000, slotAction: "reel2-glow" },
        { text: "People are shouting!", effect: "shake", duration: 4000, slotAction: "reel2-glow" },
        { text: "Screaming!", effect: "shake", duration: 4000, slotAction: "reel2-glow" },
        { text: "Jumping up and down!", effect: "shake", duration: 4500, slotAction: "reel2-glow" },
        { text: "The manager's face goes pale...", effect: "normal", duration: 4500, slotAction: "both-glow" },
        { text: "Then white...", effect: "normal", duration: 4000, slotAction: "both-glow" },
        { text: "He grabs a chair...", effect: "normal", duration: 4000, slotAction: "both-glow" },
        { text: "His hands are shaking...", effect: "shake", duration: 4500, slotAction: "both-glow" },
        { text: '"If that third reel..."', effect: "normal", duration: 4500, slotAction: "both-glow" },
        { text: "He can't even finish the sentence...", effect: "normal", duration: 5000, slotAction: "both-glow" },
        { text: "Security is calling headquarters...", effect: "normal", duration: 4500, slotAction: "both-glow" },
        { text: "This has NEVER happened before...", effect: "normal", duration: 5000, slotAction: "both-glow" },
        { text: "Not in the history of the casino...", effect: "normal", duration: 5000, slotAction: "both-glow" },
        { text: "Third reel...", effect: "normal", duration: 6000, slotAction: "slow-reel3" },
        { text: "The final reel...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "Your destiny...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "Still spinning...", effect: "normal", duration: 4500, slotAction: "slow-reel3" },
        { text: "It's slowing down...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "So slowly...", effect: "normal", duration: 4500, slotAction: "slow-reel3" },
        { text: "Agonizingly slowly...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "You can see each symbol...", effect: "normal", duration: 4500, slotAction: "slow-reel3" },
        { text: "Cherry... Lemon... Orange...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "Grape... Watermelon...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "Star...", effect: "normal", duration: 4500, slotAction: "slow-reel3" },
        { text: "Diamond approaching...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "It's getting closer...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "Closer...", effect: "normal", duration: 4500, slotAction: "slow-reel3" },
        { text: "CLOSER...", effect: "normal", duration: 4500, slotAction: "slow-reel3" },
        { text: "Almost there...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "So close...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "Just a little more...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "Your heart is pounding...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "The whole world is watching...", effect: "normal", duration: 5000, slotAction: "slow-reel3" },
        { text: "...", effect: "normal", duration: 4000, slotAction: "slow-reel3" },
        { text: "...", effect: "normal", duration: 4000, slotAction: "slow-reel3" },
        { text: "...", effect: "normal", duration: 4000, slotAction: "slow-reel3" },
        { text: "💎💎💎", effect: "reel", duration: 5000, slotAction: "show-reel3" },
        { text: "...", effect: "normal", duration: 3000, slotAction: "all-glow" },
        { text: "...", effect: "normal", duration: 3000, slotAction: "all-glow" },
        { text: "...", effect: "normal", duration: 3000, slotAction: "all-glow" },
        { text: "JACKPOT!!!", effect: "giant", duration: 4000, slotAction: "winner" },
        { text: "🎰🎰🎰", effect: "giant", duration: 4000, slotAction: "winner" },
        { text: "JACKPOT!!!", effect: "giant", duration: 4000, slotAction: "winner" },
        { text: "JACKPOT!!!", effect: "giant", duration: 4000, slotAction: "winner" },
        { text: "MEGA JACKPOT!!!", effect: "strobe", duration: 4000, slotAction: "winner" },
        { text: "ULTRA JACKPOT!!!", effect: "strobe", duration: 4000, slotAction: "winner" },
        { text: "SUPER MEGA ULTRA JACKPOT!!!", effect: "strobe", duration: 5000, slotAction: "winner" },
        { text: "🎉🎊🎉🎊🎉🎊🎉🎊🎉🎊", effect: "confetti", duration: 4000, slotAction: "winner" },
        { text: "THE MACHINE EXPLODES WITH LIGHT!", effect: "strobe", duration: 4500, slotAction: "winner" },
        { text: "BLINDING GOLDEN LIGHT!", effect: "strobe", duration: 4500, slotAction: "winner" },
        { text: "✨💫⭐🌟✨💫⭐🌟", effect: "strobe", duration: 4000, slotAction: "winner" },
        { text: "Bells are ringing!", effect: "flash-colors", duration: 4000, slotAction: "winner" },
        { text: "DING DING DING DING!", effect: "flash-colors", duration: 4000, slotAction: "winner" },
        { text: "💰💰💰💰💰💰💰💰", effect: "confetti", duration: 4000, slotAction: "winner" },
        { text: "The crowd ERUPTS!", effect: "shake", duration: 4500, slotAction: "winner" },
        { text: "Absolute CHAOS!", effect: "shake", duration: 4500, slotAction: "winner" },
        { text: "People are crying!", effect: "confetti", duration: 4000, slotAction: "winner" },
        { text: "People are screaming!", effect: "shake", duration: 4000, slotAction: "winner" },
        { text: "People are fainting!", effect: "shake", duration: 4500, slotAction: "winner" },
        { text: "The manager collapses...", effect: "confetti", duration: 4500, slotAction: "winner" },
        { text: "He's unconscious on the floor!", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "Someone call a medic!", effect: "shake", duration: 4000, slotAction: "winner" },
        { text: '"THIS HAS NEVER HAPPENED BEFORE!"', effect: "shake", duration: 4500, slotAction: "winner" },
        { text: '"NOT IN 50 YEARS!"', effect: "shake", duration: 4000, slotAction: "winner" },
        { text: '"NOT EVER!"', effect: "shake", duration: 4000, slotAction: "winner" },
        { text: "Security doesn't know what to do...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "They're just standing there...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "Mouths hanging open...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "In complete shock...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "Confetti ERUPTS from the ceiling...", effect: "confetti", duration: 4500, slotAction: "winner" },
        { text: "MOUNTAINS of confetti!", effect: "confetti", duration: 4500, slotAction: "winner" },
        { text: "It's raining confetti!", effect: "confetti", duration: 4500, slotAction: "winner" },
        { text: "🎊🎉🎊🎉🎊🎉🎊🎉🎊🎉🎊", effect: "confetti", duration: 4000, slotAction: "winner" },
        { text: "Balloons fall from above!", effect: "confetti", duration: 4500, slotAction: "winner" },
        { text: "🎈🎈🎈🎈🎈", effect: "confetti", duration: 4000, slotAction: "winner" },
        { text: "Champagne bottles are popping...", effect: "confetti", duration: 4500, slotAction: "winner" },
        { text: "🍾 POP! POP! POP! 🍾", effect: "confetti", duration: 4000, slotAction: "winner" },
        { text: "Champagne everywhere!", effect: "confetti", duration: 4500, slotAction: "winner" },
        { text: "People are cheering!", effect: "shake", duration: 4000, slotAction: "winner" },
        { text: "People are screaming!", effect: "shake", duration: 4000, slotAction: "winner" },
        { text: "People are dancing!", effect: "confetti", duration: 4500, slotAction: "winner" },
        { text: "Complete pandemonium!", effect: "shake", duration: 4500, slotAction: "winner" },
        { text: "The casino has gone WILD!", effect: "shake", duration: 5000, slotAction: "winner" },
        { text: "News vans are pulling up outside...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "TV cameras rushing in...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "Reporters everywhere!", effect: "shake", duration: 4500, slotAction: "winner" },
        { text: "📺 YOU'RE ON LIVE TV! 📺", effect: "flash-colors", duration: 5000, slotAction: "winner" },
        { text: "News helicopters circle overhead...", effect: "normal", duration: 5000, slotAction: "winner" },
        { text: "🚁 BREAKING NEWS 🚁", effect: "flash-colors", duration: 4500, slotAction: "winner" },
        { text: "Social media is EXPLODING!", effect: "flash-colors", duration: 4500, slotAction: "winner" },
        { text: "You're trending worldwide!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "#1 on every platform!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "The casino owner arrives...", effect: "normal", duration: 5000, slotAction: "winner" },
        { text: "He looks at the machine...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "He looks at you...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "He checks his phone...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "His face goes white...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: '"Pay them."', effect: "normal", duration: 5000, slotAction: "winner" },
        { text: "The accountants arrive...", effect: "normal", duration: 4500, slotAction: "winner" },
        { text: "They're calculating...", effect: "normal", duration: 5000, slotAction: "winner" },
        { text: "Their calculators can't even display it...", effect: "normal", duration: 5000, slotAction: "winner" },
        { text: "The number is too big!", effect: "shake", duration: 4500, slotAction: "winner" },
        { text: "YOU WIN...", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "💰💰💰💰💰💰💰💰💰", effect: "mega-win", duration: 4500, slotAction: "winner" },
        { text: "$500,000,000,000!!!", effect: "mega-win", duration: 6000, slotAction: "winner" },
        { text: "FIVE HUNDRED BILLION DOLLARS!!!", effect: "mega-win", duration: 6000, slotAction: "winner" },
        { text: "HALF A TRILLION DOLLARS!!!", effect: "mega-win", duration: 6000, slotAction: "winner" },
        { text: "$500,000,000,000!!!", effect: "mega-win", duration: 6000, slotAction: "winner" },
        { text: "You are richer than most countries...", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "Richer than nations...", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "You could buy entire cities...", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "Islands...", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "COUNTRIES...", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "You are a BILLIONAIRE!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "You are LEGENDARY!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "You are IMMORTAL!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "Your name will live forever!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "They will write songs about you!", effect: "confetti", duration: 5000, slotAction: "winner" },
        { text: "Books about you!", effect: "confetti", duration: 5000, slotAction: "winner" },
        { text: "Movies about you!", effect: "confetti", duration: 5000, slotAction: "winner" },
        { text: "Statues will be built!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "This day will never be forgotten!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "The casino will never be the same!", effect: "confetti", duration: 5000, slotAction: "winner" },
        { text: "The world will never be the same!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "YOU will never be the same!", effect: "mega-win", duration: 5000, slotAction: "winner" },
        { text: "This is the greatest moment in casino history!", effect: "mega-win", duration: 6000, slotAction: "winner" },
        { text: "Congratulations, you absolute LEGEND!", effect: "mega-win", duration: 6000, slotAction: "winner" },
        { text: "🏆👑 YOU ARE THE KING! 👑🏆", effect: "mega-win", duration: 6000, slotAction: "winner" },
        { text: "🏆 YOU ARE THE ULTIMATE WINNER! 🏆", effect: "mega-win", duration: 6000, slotAction: "winner" }
    ];

    // Start spinning interval for cutscene slots
    let spinInterval;

    for (let i = 0; i < messages.length; i++) {
        const message = messages[i];

        // Reset classes
        cutsceneText.className = '';
        cutsceneBg.className = 'cutscene-bg-effect';

        // Apply effects
        if (message.effect === 'shake') {
            cutsceneBg.classList.add('shake');
        } else if (message.effect === 'flash-red') {
            cutsceneBg.classList.add('flash-red');
        } else if (message.effect === 'flash-colors') {
            cutsceneBg.classList.add('flash-colors');
        } else if (message.effect === 'strobe') {
            cutsceneBg.classList.add('strobe');
        } else if (message.effect === 'confetti') {
            cutsceneBg.classList.add('confetti-bg');
        } else if (message.effect === 'mega-win') {
            cutsceneText.classList.add('mega-win');
            cutsceneBg.classList.add('confetti-bg');
        } else if (message.effect === 'giant') {
            cutsceneText.classList.add('giant-text');
            cutsceneBg.classList.add('flash-colors');
        } else if (message.effect === 'reel') {
            cutsceneText.classList.add('reel-symbol');
        }

        // Handle slot actions
        if (message.slotAction === 'idle') {
            cutsceneSlot1.classList.remove('spinning', 'glowing', 'winner');
            cutsceneSlot2.classList.remove('spinning', 'glowing', 'winner');
            cutsceneSlot3.classList.remove('spinning', 'glowing', 'winner');
        } else if (message.slotAction === 'glow') {
            cutsceneSlot1.classList.add('glowing');
            cutsceneSlot2.classList.add('glowing');
            cutsceneSlot3.classList.add('glowing');
        } else if (message.slotAction === 'start-spin') {
            cutsceneSlot1.classList.remove('glowing');
            cutsceneSlot2.classList.remove('glowing');
            cutsceneSlot3.classList.remove('glowing');
            cutsceneSlot1.classList.add('spinning');
            cutsceneSlot2.classList.add('spinning');
            cutsceneSlot3.classList.add('spinning');
            // Start changing symbols rapidly
            spinInterval = setInterval(() => {
                cutsceneSlot1.textContent = getRandomSymbol();
                cutsceneSlot2.textContent = getRandomSymbol();
                cutsceneSlot3.textContent = getRandomSymbol();
            }, 100);
        } else if (message.slotAction === 'spin') {
            // Continue spinning (symbols changing in interval)
        } else if (message.slotAction === 'spin-glow') {
            cutsceneSlot1.classList.add('glowing');
            cutsceneSlot2.classList.add('glowing');
            cutsceneSlot3.classList.add('glowing');
        } else if (message.slotAction === 'stop-reel1') {
            cutsceneSlot1.classList.remove('spinning', 'glowing');
        } else if (message.slotAction === 'show-reel1') {
            cutsceneSlot1.textContent = '💎';
        } else if (message.slotAction === 'reel1-glow') {
            cutsceneSlot1.classList.add('glowing');
        } else if (message.slotAction === 'stop-reel2') {
            cutsceneSlot2.classList.remove('spinning', 'glowing');
        } else if (message.slotAction === 'show-reel2') {
            cutsceneSlot2.textContent = '💎';
        } else if (message.slotAction === 'reel2-glow') {
            cutsceneSlot2.classList.add('glowing');
        } else if (message.slotAction === 'both-glow') {
            cutsceneSlot1.classList.add('glowing');
            cutsceneSlot2.classList.add('glowing');
        } else if (message.slotAction === 'slow-reel3') {
            // Slot 3 still spinning
        } else if (message.slotAction === 'show-reel3') {
            cutsceneSlot3.classList.remove('spinning', 'glowing');
            cutsceneSlot3.textContent = '💎';
            clearInterval(spinInterval);
        } else if (message.slotAction === 'all-glow') {
            cutsceneSlot1.classList.remove('glowing');
            cutsceneSlot2.classList.remove('glowing');
            cutsceneSlot3.classList.remove('glowing');
            cutsceneSlot1.classList.add('glowing');
            cutsceneSlot2.classList.add('glowing');
            cutsceneSlot3.classList.add('glowing');
        } else if (message.slotAction === 'winner') {
            cutsceneSlot1.classList.remove('glowing', 'spinning');
            cutsceneSlot2.classList.remove('glowing', 'spinning');
            cutsceneSlot3.classList.remove('glowing', 'spinning');
            cutsceneSlot1.classList.add('winner');
            cutsceneSlot2.classList.add('winner');
            cutsceneSlot3.classList.add('winner');
        }

        cutsceneText.textContent = message.text;
        await new Promise(resolve => setTimeout(resolve, message.duration));
    }

    // Update balance
    await new Promise(resolve => setTimeout(resolve, 3000));
    balance = 500000000000;
    cutscene.classList.add('hidden');
    updateBalance();

    slot1.textContent = '💎';
    slot2.textContent = '💎';
    slot3.textContent = '💎';

    messageDisplay.textContent = '🎰 LEGENDARY JACKPOT! YOU ARE A BILLIONAIRE! 🎰';
    messageDisplay.style.color = '#ffd700';
    messageDisplay.style.fontSize = '1.8em';

    // Disable further spins
    spinBtn.disabled = true;
    spinBtn.textContent = 'YOU WON! GAME OVER!';
}

// Walk away with $1
function walkAway() {
    lastChanceModal.classList.add('hidden');
    messageDisplay.textContent = 'You walked away with $1. At least you have something!';
    messageDisplay.style.color = '#ffd700';
    spinBtn.disabled = true;
    spinBtn.textContent = 'GAME OVER';
}

// Event listeners
betInput.addEventListener('input', (e) => {
    currentBet = Math.min(Math.max(1, parseInt(e.target.value) || 1), balance);
    betInput.value = currentBet;
    updateBetButton();
});

spinBtn.addEventListener('click', spin);
walkAwayBtn.addEventListener('click', walkAway);
finalSpinBtn.addEventListener('click', finalSpin);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isSpinning && !spinBtn.disabled && lastChanceModal.classList.contains('hidden')) {
        e.preventDefault();
        spin();
    }
});

// Initialize
updateBalance();
updateBetButton();
