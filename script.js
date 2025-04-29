const words = ["TUMOR", "CELLS", "CARES", "BAYER", "STAGE", "RISKS", "GLAND", "TESTS"]; // Customize!
const answer = words[Math.floor(Math.random() * words.length)].toUpperCase();

let currentRow = [];
let attempts = 0;
const maxAttempts = 6;

const board = document.getElementById("game-board");
const message = document.getElementById("message");
const leaderboardList = document.getElementById("leaderboard-list");

function createBoard() {
  for (let i = 0; i < maxAttempts * 5; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    board.appendChild(tile);
  }
}

function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  keys.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.className = "key";
    btn.addEventListener("click", () => handleKey(letter));
    keyboard.appendChild(btn);
  });

  ["Enter", "Backspace"].forEach(key => {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.className = "key";
    btn.addEventListener("click", () => handleKey(key));
    keyboard.appendChild(btn);
  });
}

function handleKey(key) {
  if (message.textContent) return;

  if (key === "Backspace" && currentRow.length > 0) {
    currentRow.pop();
    updateBoard();
  } else if (key === "Enter") {
    if (currentRow.length === 5) {
      handleGuess();
    } else {
      alert("Enter 5 letters");
    }
  } else if (/^[A-Z]$/.test(key) && currentRow.length < 5) {
    currentRow.push(key);
    updateBoard();
  }
}

function updateBoard() {
  const tiles = document.querySelectorAll(".tile");
  const rowStart = attempts * 5;

  for (let i = 0; i < 5; i++) {
    tiles[rowStart + i].textContent = currentRow[i] || "";
  }
}

function handleGuess() {
  const guess = currentRow.join("");
  const tiles = document.querySelectorAll(".tile");
  const rowStart = attempts * 5;

  for (let i = 0; i < 5; i++) {
    const tile = tiles[rowStart + i];
    const letter = guess[i];
    const keyBtn = document.querySelector(`.key:contains('${letter}')`);

    if (letter === answer[i]) {
      tile.classList.add("correct");
    } else if (answer.includes(letter)) {
      tile.classList.add("present");
    } else {
      tile.classList.add("absent");
    }
  }

  attempts++;
  if (guess === answer) {
    message.textContent = "🎉 Correct! You solved it!";
    setTimeout(() => saveScore(attempts), 500);
  } else if (attempts === maxAttempts) {
    message.textContent = `❌ Game over! Word was: ${answer}`;
    setTimeout(() => saveScore("X"), 500);
  }

  currentRow = [];
}

function saveScore(score) {
  const name = prompt("Enter your name for the leaderboard:");
  if (!name) return;

  const entry = { name, score };
  const scores = JSON.parse(localStorage.getItem("nubeqaScores") || "[]");
  scores.push(entry);
  localStorage.setItem("nubeqaScores", JSON.stringify(scores));
  showLeaderboard();
}

function showLeaderboard() {
  leaderboardList.innerHTML = "";
  const scores = JSON.parse(localStorage.getItem("nubeqaScores") || "[]");
  scores.sort((a, b) => a.score - b.score);

  scores.slice(0, 10).forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name} — ${entry.score} tries`;
    leaderboardList.appendChild(li);
  });
}

// Init
createBoard();
createKeyboard();
showLeaderboard();
