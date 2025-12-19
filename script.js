// ---------------- BOOT SEQUENCE ----------------
const bootLines = [
  "ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM",
  "COPYRIGHT 2075-2077 ROBCO INDUSTRIES",
  "-Server 6-",
  "",
  "Initializing boot agent...",
  "Loading system modules...",
  "Configuring memory...",
  "",
  ">> ENTER PASSWORD NOW"
];

const bootEl = document.getElementById('boot');
const contentEl = document.getElementById('content');
let bootIndex = 0;

function playBoot() {
  if (bootIndex < bootLines.length) {
    bootEl.textContent += bootLines[bootIndex] + "\n";
    bootIndex++;
    setTimeout(playBoot, 350);
  } else {
    setTimeout(() => {
      bootEl.style.display = 'none';
      contentEl.style.display = 'block';
      render();
    }, 600);
  }
}

// ---------------- CONFIG ----------------
const WORDS = ["PRICE", "TIRES", "TRIBE", "TRIED", "TERMS", "STICK", "THIRD", "FRIES"];
const BRACKETS = [['(', ')'], ['[', ']'], ['{', '}'], ['<', '>']];
const MAX_ATTEMPTS = 4;

// ---------------- STATE ----------------
let password = WORDS[Math.floor(Math.random() * WORDS.length)];
let attempts = MAX_ATTEMPTS;
let removedWords = new Set();
let usedBracketStrings = new Set();

// ---------------- DOM ----------------
const screen = document.getElementById('screen');
const log = document.getElementById('log');
const attemptsEl = document.getElementById('attempts');
const restartBtn = document.getElementById('restartBtn');

restartBtn.onclick = () => location.reload();

// ---------------- AUDIO ----------------
const sounds = {
  click: new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg'),
  success: new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'),
  fail: new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg')
};
Object.values(sounds).forEach(s => s.volume = 0.3);

// ---------------- UTILS ----------------
function likeness(a, b) {
  let score = 0;
  for (let i = 0; i < a.length; i++) if (a[i] === b[i]) score++;
  return score;
}

function randomJunk(len) {
  const chars = "!@#$%^&*+-_=|:?/";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateBracketString() {
  const [o, c] = BRACKETS[Math.floor(Math.random() * BRACKETS.length)];
  return o + randomJunk(4) + c;
}

function randomHex() {
  return '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

// ---------------- RENDER ----------------
function render() {
  screen.innerHTML = '';
  let entries = [];

  WORDS.forEach(word => {
    if (!removedWords.has(word)) entries.push({ type: 'word', value: word });
  });

  for (let i = 0; i < 6; i++) entries.push({ type: 'bracket', value: generateBracketString() });

  entries.sort(() => Math.random() - 0.5);

  for (let i = 0; i < entries.length; i += 2) {
    const left = entries[i];
    const right = entries[i + 1];

    screen.appendChild(addrCell());
    screen.appendChild(entryCell(left));
    screen.appendChild(addrCell());
    screen.appendChild(entryCell(right));
  }
}

function addrCell() {
  const d = document.createElement('div');
  d.className = 'addr';
  d.textContent = randomHex();
  return d;
}

function entryCell(entry) {
  const d = document.createElement('div');
  d.className = 'entry';
  if (!entry) return d;
  d.textContent = randomJunk(6) + entry.value + randomJunk(6);
  d.onclick = () => activate(entry);
  return d;
}

// ---------------- GAME LOGIC ----------------
function activate(entry) {
  if (attempts <= 0) return;
  sounds.click.currentTime = 0; sounds.click.play();

  if (entry.type === 'word') {
    attempts--;
    attemptsEl.textContent = attempts;

    if (entry.value === password) {
      sounds.success.play();
      log.innerHTML += `> ${entry.value} — ACCESS GRANTED<br>`;
      attempts = 0;
      return;
    }

    const score = likeness(entry.value, password);
    log.innerHTML += `> ${entry.value} — ${score}/${password.length} correct<br>`;

    if (attempts === 0) {
      sounds.fail.play();
      log.innerHTML += '<span class="locked">> LOCKED OUT</span>';
    }
  } else {
    if (usedBracketStrings.has(entry.value)) return;
    usedBracketStrings.add(entry.value);

    if (Math.random() < 0.5 && attempts < MAX_ATTEMPTS) {
      attempts++;
      log.innerHTML += `> ${entry.value} — ATTEMPTS RESTORED<br>`;
    } else {
      removeDud();
      log.innerHTML += `> ${entry.value} — DUD REMOVED<br>`;
    }

    attemptsEl.textContent = attempts;
    render();
  }
}

function removeDud() {
  const candidates = WORDS.filter(w => w !== password && !removedWords.has(w));
  if (candidates.length === 0) return;
  removedWords.add(candidates[Math.floor(Math.random() * candidates.length)]);
}

// ---------------- START ----------------
playBoot();