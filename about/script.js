// Typing Effect Code
const typedTextElement = document.getElementById("typed-text");
const cursor = document.querySelector(".cursor");
const text = "杨雅冰. Yabing Yang.";
const typingSpeed = 50;

let textIndex = 0;
function typeText() {
  if (textIndex < text.length) {
    typedTextElement.textContent += text.charAt(textIndex);
    textIndex++;
    setTimeout(typeText, typingSpeed);
  } else {
    cursor.style.display = "none"; // Remove the cursor when the typing is complete
  }
}

// Cursor Trail Code
const canvas = document.getElementById("cursor-canvas");
const ctx = canvas.getContext("2d");

// Set the canvas dimensions to match the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cursorPositions = [];
let lineColor = getRandomColor();

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawLine() {
  ctx.beginPath();
  ctx.moveTo(cursorPositions[0].x, cursorPositions[0].y);
  for (let i = 1; i < cursorPositions.length; i++) {
    ctx.lineTo(cursorPositions[i].x, cursorPositions[i].y);
  }
  ctx.strokeStyle = `${lineColor}80`; // Set the opacity to 50% (80 in hexadecimal)
  ctx.stroke();
}

function updateCursorPositions(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  cursorPositions.push({ x, y });
}

document.addEventListener("mousemove", updateCursorPositions);

document.addEventListener("mouseout", () => {
  lineColor = getRandomColor(); // Change the line color
});

let animationInterval;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineJoin = 'round'; // Line join style for smoother lines
  ctx.lineWidth = 20; // Increase the line width
  drawLine();

  // Clear the canvas every 5 seconds
  if (cursorPositions.length > 300) {
    cursorPositions.length = 0; // Clear the cursor positions array
  }
}

function startAnimation() {
  animationInterval = setInterval(animate, 16.67); // Approximately 60 FPS
}

window.addEventListener("load", () => {
  startAnimation();
  typeText();
});