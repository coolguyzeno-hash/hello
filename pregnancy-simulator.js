// Pregnancy Simulator Logic
let currentWeek = 0;
let isStarted = false;
let events = [];
let activeSymptoms = new Set();

// Baby development data by week
const developmentData = {
    0: { size: "Not conceived", title: "Ready to Begin", description: "Click 'Start Pregnancy' to begin your journey!" },
    1: { size: "Poppy seed", title: "Conception Week", description: "The journey begins! Fertilization occurs and the egg begins to divide." },
    4: { size: "Poppy seed", title: "Implantation", description: "The embryo implants in the uterine wall. Pregnancy hormones start to rise." },
    6: { size: "Sweet pea", title: "Heartbeat Begins", description: "The baby's heart starts beating! Tiny arm and leg buds are forming." },
    8: { size: "Raspberry", title: "Baby Takes Shape", description: "All major organs are developing. Baby is now officially a fetus!" },
    10: { size: "Strawberry", title: "Vital Development", description: "Baby's vital organs are functioning. Fingers and toes are forming!" },
    12: { size: "Lime", title: "End of First Trimester", description: "Baby can make movements! Risk of miscarriage drops significantly." },
    14: { size: "Lemon", title: "Second Trimester Begins", description: "Baby can squint, frown, and grimace. Gender may be visible on ultrasound!" },
    16: { size: "Avocado", title: "Growing Strong", description: "Baby's muscles are getting stronger. You might feel the first movements!" },
    18: { size: "Bell pepper", title: "Hearing Develops", description: "Baby can hear your voice! Their ears are in position and functioning." },
    20: { size: "Banana", title: "Halfway There!", description: "You're halfway through! Baby is very active and can recognize your voice." },
    22: { size: "Papaya", title: "Sensory Development", description: "Baby's sense of touch is developing. They can feel you touching your belly!" },
    24: { size: "Cantaloupe", title: "Viability Milestone", description: "Baby is considered viable if born early. Lungs are developing rapidly." },
    26: { size: "Lettuce", title: "Eyes Open", description: "Baby's eyes can now open! They're developing sleep and wake cycles." },
    28: { size: "Eggplant", title: "Third Trimester!", description: "Final trimester begins! Baby is gaining weight and brain is developing fast." },
    30: { size: "Cabbage", title: "Rapid Growth", description: "Baby is growing so fast! They can see light filtering through your belly." },
    32: { size: "Jicama", title: "Practice Breathing", description: "Baby is practicing breathing movements. Their bones are fully formed!" },
    34: { size: "Butternut squash", title: "Getting Cozy", description: "Space is getting tight! Baby is in position for birth." },
    36: { size: "Romaine lettuce", title: "Almost Ready", description: "Baby is shedding vernix and lanugo. Lungs are nearly mature!" },
    38: { size: "Pumpkin", title: "Full Term!", description: "Baby is full term! They can arrive any day now." },
    40: { size: "Watermelon", title: "Due Date!", description: "Congratulations! Baby is ready to meet you. Time for delivery!" }
};

// Milestone events
const milestones = {
    6: { title: "Heartbeat Detected!", description: "The baby's heart is beating at about 150-170 beats per minute.", achievement: 1 },
    12: { title: "First Trimester Complete", description: "You've made it through the first 12 weeks!", achievement: 0 },
    14: { title: "Gender Can Be Determined", description: "At your next ultrasound, you might be able to find out the gender!", achievement: 2 },
    18: { title: "Baby Can Hear You!", description: "Your baby can now hear sounds from outside the womb.", achievement: 3 },
    20: { title: "Halfway Milestone", description: "You're halfway through your pregnancy journey!", achievement: -1 },
    24: { title: "Viability Week", description: "Baby has a chance of survival if born prematurely with medical care.", achievement: -1 },
    26: { title: "Second Trimester Complete", description: "Two trimesters down, one to go!", achievement: 4 },
    28: { title: "Eyes Can Open", description: "Baby's eyes can now open and close, and they can see light!", achievement: 5 },
    37: { title: "Full Term!", description: "Your baby is now considered full term and ready for birth!", achievement: 6 },
    40: { title: "Birth Day!", description: "Congratulations! Your baby has arrived! 🎉👶", achievement: 7 }
};

// Symptoms by trimester
const symptomsByWeek = {
    1: ["Morning Sickness", "Fatigue"],
    6: ["Morning Sickness", "Fatigue", "Frequent Urination"],
    8: ["Morning Sickness", "Fatigue", "Food Cravings", "Mood Swings"],
    12: ["Fatigue", "Food Cravings", "Mood Swings"],
    14: ["Food Cravings", "Back Pain"],
    18: ["Food Cravings", "Back Pain", "Heartburn"],
    24: ["Back Pain", "Heartburn", "Frequent Urination"],
    28: ["Back Pain", "Heartburn", "Frequent Urination", "Swelling"],
    32: ["Back Pain", "Heartburn", "Frequent Urination", "Swelling"],
    36: ["Back Pain", "Frequent Urination", "Swelling", "Fatigue"]
};

function startPregnancy() {
    if (isStarted) return;

    isStarted = true;
    currentWeek = 1;

    document.getElementById('startBtn').disabled = true;
    document.getElementById('nextWeekBtn').disabled = false;
    document.getElementById('skipBtn').disabled = false;

    addEvent("Week 1", "Pregnancy Begins!", "Your pregnancy journey has started. The adventure of a lifetime awaits!", true);

    updateDisplay();
    updateBellySize();
}

function nextWeek() {
    if (!isStarted || currentWeek >= 40) return;

    currentWeek++;
    updateDisplay();
    updateBellySize();
    updateSymptoms();
    checkMilestone();

    // Add random events
    if (Math.random() > 0.7) {
        addRandomEvent();
    }

    // End simulation at week 40
    if (currentWeek === 40) {
        celebrateBirth();
    }
}

function skipWeeks() {
    if (!isStarted || currentWeek >= 40) return;

    const weeksToAdd = Math.min(4, 40 - currentWeek);
    for (let i = 0; i < weeksToAdd; i++) {
        currentWeek++;
        checkMilestone();
    }

    updateDisplay();
    updateBellySize();
    updateSymptoms();
    addEvent(`Week ${currentWeek}`, "Time Jump", `Skipped ahead ${weeksToAdd} weeks.`);

    if (currentWeek === 40) {
        celebrateBirth();
    }
}

function updateDisplay() {
    const data = getDevelopmentData(currentWeek);

    document.getElementById('currentWeek').textContent = currentWeek;
    document.getElementById('trimester').textContent = getTrimester(currentWeek);
    document.getElementById('babySize').textContent = data.size;
    document.getElementById('weeksLeft').textContent = `${40 - currentWeek} weeks`;

    const progress = (currentWeek / 40) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressMarker').style.left = `calc(${progress}% - 20px)`;
    document.getElementById('progressPercent').textContent = Math.round(progress) + '%';

    document.getElementById('developmentTitle').textContent = data.title;
    document.getElementById('developmentDescription').textContent = data.description;
}

function updateBellySize() {
    const belly = document.getElementById('belly');
    const baseSize = 200;
    const maxSize = 350;
    const growth = (currentWeek / 40) * (maxSize - baseSize);
    const newSize = baseSize + growth;

    belly.style.width = newSize + 'px';
    belly.style.height = newSize + 'px';

    // Update baby icon size
    const babyIcon = document.getElementById('babyIcon');
    const iconSize = 4 + (currentWeek / 40) * 3; // 4rem to 7rem
    babyIcon.style.fontSize = iconSize + 'rem';
}

function updateSymptoms() {
    // Find the closest symptom week
    let closestWeek = 0;
    for (let week in symptomsByWeek) {
        if (parseInt(week) <= currentWeek) {
            closestWeek = week;
        }
    }

    if (closestWeek > 0) {
        activeSymptoms = new Set(symptomsByWeek[closestWeek]);
    }

    // Update symptom display
    const symptomTags = document.querySelectorAll('.symptom-tag');
    symptomTags.forEach(tag => {
        if (activeSymptoms.has(tag.textContent)) {
            tag.classList.remove('inactive');
            tag.classList.add('active');
        } else {
            tag.classList.remove('active');
            tag.classList.add('inactive');
        }
    });
}

function checkMilestone() {
    if (milestones[currentWeek]) {
        const milestone = milestones[currentWeek];
        addEvent(`Week ${currentWeek}`, milestone.title, milestone.description, true);

        if (milestone.achievement >= 0) {
            unlockAchievement(milestone.achievement);
        }
    }
}

function unlockAchievement(index) {
    const achievements = document.querySelectorAll('.achievement');
    if (achievements[index]) {
        achievements[index].classList.remove('locked');
        achievements[index].classList.add('unlocked');
    }
}

function addEvent(week, title, description, isMilestone = false) {
    const container = document.getElementById('eventsContainer');
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event-item' + (isMilestone ? ' milestone' : '');

    eventDiv.innerHTML = `
        <div class="event-week">${week}</div>
        <div class="event-content">
            <div class="event-title">${title}</div>
            <div class="event-description">${description}</div>
        </div>
    `;

    container.insertBefore(eventDiv, container.firstChild);
    events.push({ week, title, description });
}

function addRandomEvent() {
    const randomEvents = [
        { title: "Ultrasound Day", description: "You had an ultrasound and saw your baby moving around!" },
        { title: "First Kicks", description: "You felt your baby kick for the first time!" },
        { title: "Doctor's Visit", description: "Everything is progressing normally. Baby is healthy!" },
        { title: "Nursery Planning", description: "You started planning the baby's nursery." },
        { title: "Baby Shower", description: "Friends and family celebrated with you at a baby shower!" },
        { title: "Name Ideas", description: "You and your partner discussed baby name ideas." },
        { title: "Baby Classes", description: "You attended a prenatal class to prepare for birth." },
        { title: "Cravings", description: "You had an unusual food craving today!" }
    ];

    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    addEvent(`Week ${currentWeek}`, event.title, event.description);
}

function celebrateBirth() {
    document.getElementById('nextWeekBtn').disabled = true;
    document.getElementById('skipBtn').disabled = true;

    setTimeout(() => {
        alert('🎉 Congratulations! Your baby has been born! 👶\n\nThank you for experiencing this pregnancy simulation.');
    }, 500);
}

function resetSimulation() {
    currentWeek = 0;
    isStarted = false;
    events = [];
    activeSymptoms = new Set();

    document.getElementById('startBtn').disabled = false;
    document.getElementById('nextWeekBtn').disabled = true;
    document.getElementById('skipBtn').disabled = true;

    // Reset achievements
    document.querySelectorAll('.achievement').forEach(achievement => {
        achievement.classList.remove('unlocked');
        achievement.classList.add('locked');
    });

    // Reset events
    document.getElementById('eventsContainer').innerHTML = `
        <div class="event-item welcome">
            <div class="event-week">Welcome</div>
            <div class="event-content">
                <div class="event-title">Start Your Journey</div>
                <div class="event-description">Begin the pregnancy simulation to track baby's development week by week.</div>
            </div>
        </div>
    `;

    updateDisplay();
    updateBellySize();
    updateSymptoms();
}

function getTrimester(week) {
    if (week === 0) return "Not Started";
    if (week <= 13) return "First (1-13 weeks)";
    if (week <= 27) return "Second (14-27 weeks)";
    return "Third (28-40 weeks)";
}

function getDevelopmentData(week) {
    if (developmentData[week]) {
        return developmentData[week];
    }

    // Find closest week data
    let closestWeek = 0;
    for (let w in developmentData) {
        if (parseInt(w) <= week) {
            closestWeek = w;
        }
    }

    return developmentData[closestWeek] || developmentData[0];
}

// Initialize display
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateBellySize();
    updateSymptoms();
});
