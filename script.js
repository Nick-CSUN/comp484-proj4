const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originTextElement = document.querySelector("#origin-text p");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

// Timer variables
let timer = [0, 0, 0];
let interval;
let timerRunning = false;

// Metrics
let errors = 0;

// Paragraphs for randomization
const paragraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript is a versatile language used for web development.",
  "Typing fast requires practice and consistency.",
  "Coding challenges help improve problem solving skills.",
  "Stay focused and keep improving every day."
];

// Store current text
let originText = "";

// Add leading zero
function leadingZero(time) {
  return time <= 9 ? "0" + time : time;
}

// Timer function
function runTimer() {
  let currentTime =
    leadingZero(timer[0]) + ":" +
    leadingZero(timer[1]) + ":" +
    leadingZero(timer[2]);

  theTimer.innerHTML = currentTime;

  timer[2]++;

  if (timer[2] === 100) {
    timer[2] = 0;
    timer[1]++;
  }

  if (timer[1] === 60) {
    timer[1] = 0;
    timer[0]++;
  }
}

// Match text + visual feedback
function spellCheck() {
  let textEntered = testArea.value;
  let originTextMatch = originText.substring(0, textEntered.length);

  if (textEntered === originText) {
    clearInterval(interval);
    testWrapper.style.borderColor = "green";
    saveScore();
  } else if (textEntered === originTextMatch) {
    testWrapper.style.borderColor = "blue";
  } else {
    testWrapper.style.borderColor = "orange";
    errors++;
    updateMetrics();
  }

  updateMetrics();
}

// Start timer
function start() {
  if (testArea.value.length === 0 && !timerRunning) {
    timerRunning = true;
    interval = setInterval(runTimer, 10);
  }
}

// Reset everything
function reset() {
  clearInterval(interval);
  interval = null;
  timer = [0, 0, 0];
  timerRunning = false;
  errors = 0;

  theTimer.innerHTML = "00:00:00";
  testArea.value = "";
  testWrapper.style.borderColor = "grey";

  loadRandomText();
  updateMetrics();
}

// Random paragraph
function loadRandomText() {
  const randomIndex = Math.floor(Math.random() * paragraphs.length);
  originText = paragraphs[randomIndex];
  originTextElement.innerHTML = originText;
}

// WPM calculation
function calculateWPM() {
  let totalChars = testArea.value.length;
  let totalSeconds = timer[0] * 60 + timer[1] + timer[2] / 100;

  if (totalSeconds === 0) return 0;

  return Math.round((totalChars / 5) / (totalSeconds / 60));
}

// Update metrics display
function updateMetrics() {
  let wpm = calculateWPM();

  document.getElementById("wpm")?.remove();
  document.getElementById("errors")?.remove();

  const meta = document.querySelector(".meta");

  let wpmDisplay = document.createElement("div");
  wpmDisplay.id = "wpm";
  wpmDisplay.textContent = "WPM: " + wpm;

  let errorDisplay = document.createElement("div");
  errorDisplay.id = "errors";
  errorDisplay.textContent = "Errors: " + errors;

  meta.appendChild(wpmDisplay);
  meta.appendChild(errorDisplay);
}

// Save top 3 scores
function saveScore() {
  let totalTime =
    timer[0] * 60 +
    timer[1] +
    timer[2] / 100;

  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push(totalTime);
  scores.sort((a, b) => a - b);
  scores = scores.slice(0, 3);

  localStorage.setItem("scores", JSON.stringify(scores));

  displayScores();
}

// Display scores
function displayScores() {
  document.getElementById("scores")?.remove();

  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  const scoreDiv = document.createElement("div");
  scoreDiv.id = "scores";

  scoreDiv.innerHTML = "<strong>Top 3 Times:</strong><br>" +
    scores.map(s => s.toFixed(2) + "s").join("<br>");

  document.querySelector(".meta").appendChild(scoreDiv);
}

// Event listeners
testArea.addEventListener("keypress", start);
testArea.addEventListener("keyup", spellCheck);
resetButton.addEventListener("click", reset);

// Initialize
loadRandomText();
displayScores();