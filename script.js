let isDrawing = false;
let x = 0;
let y = 0;
let color = '#000000';
let size = 5;
let drawingHistory = [];
let currentStep = -1;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorButtons = document.querySelectorAll('.color-btn');
const sizeInput = document.getElementById('size');
const clearButton = document.getElementById('clear');
const undoButton = document.getElementById('undo');
const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', () => {
  const username = prompt("Enter a username:");
  if (!username) return alert('Submission cancelled. No username entered.');

  const dataUrl = canvas.toDataURL();
  const container = document.createElement('div');
  container.className = 'gallery-item window-frame';

  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerHTML = `
    <span>
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      ${username} <span class="score">0</span>★
    </span>
  `;

  const img = document.createElement('img');
  img.src = dataUrl;

  const votes = document.createElement('div');
  votes.className = 'vote-controls';
  const up = document.createElement('button');
  const down = document.createElement('button');
  up.textContent = '▲Up';
  down.textContent = '▼Down';

  up.addEventListener('click', () => adjustVotes(container, 1));
  down.addEventListener('click', () => adjustVotes(container, -1));

  votes.append(up, down);
  container.append(header, img, votes);
  container.dataset.score = 0;
  galleryGrid.appendChild(container);
  sortGallery();
});

const galleryGrid = document.getElementById('gallery-grid');
const template = new Image();
template.src = 'steen-template.jpg';

// Load template
template.onload = () => {
  canvas.width = template.width;
  canvas.height = template.height;
  ctx.drawImage(template, 0, 0);
  saveStep();
};

canvas.addEventListener('mousedown', e => {
  isDrawing = true;
  const pos = getCursorPosition(e);
  x = pos.x;
  y = pos.y;
});

canvas.addEventListener('mousemove', e => {
  if (isDrawing) {
    const pos = getCursorPosition(e);
    drawLine(ctx, x, y, pos.x, pos.y);
    x = pos.x;
    y = pos.y;
  }
});

canvas.addEventListener('mouseup', () => {
  if (isDrawing) {
    isDrawing = false;
    saveStep();
  }
});

function getCursorPosition(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  };
}

function drawLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    color = btn.dataset.color;
  });
});

sizeInput.addEventListener('input', () => {
  size = sizeInput.value;
});

clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
  saveStep();
});

undoButton.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    let canvasPic = new Image();
    canvasPic.src = drawingHistory[currentStep];
    canvasPic.onload = () => ctx.drawImage(canvasPic, 0, 0);
  }
});

function saveStep() {
  currentStep++;
  if (currentStep < drawingHistory.length) {
    drawingHistory.length = currentStep;
  }
  drawingHistory.push(canvas.toDataURL());
}

submitButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  if (!username) return alert('Enter a username!');

  const dataUrl = canvas.toDataURL();
  const container = document.createElement('div');
  container.className = 'gallery-item window-frame';

  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerHTML = `
    <span>
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      ${username} <span class="score">0</span>★
    </span>
  `;

  const img = document.createElement('img');
  img.src = dataUrl;

  const votes = document.createElement('div');
  votes.className = 'vote-controls';
  const up = document.createElement('button');
  const down = document.createElement('button');
  up.textContent = '▲Up';
  down.textContent = '▼Down';

  up.addEventListener('click', () => adjustVotes(container, 1));
  down.addEventListener('click', () => adjustVotes(container, -1));

  votes.append(up, down);
  container.append(header, img, votes);
  container.dataset.score = 0;
  galleryGrid.appendChild(container);
  sortGallery();
});

function adjustVotes(el, delta) {
  const scoreSpan = el.querySelector('.score');
  let score = parseInt(scoreSpan.textContent) + delta;
  scoreSpan.textContent = score;
  el.dataset.score = score;
  sortGallery();
}

function sortGallery() {
  const items = Array.from(galleryGrid.children);
  items.sort((a, b) => parseInt(b.dataset.score) - parseInt(a.dataset.score));
  items.forEach(item => galleryGrid.appendChild(item));
}

let isAdmin = false;

document.getElementById('admin-button').addEventListener('click', () => {
  const pwd = prompt('Enter admin password:');
  if (pwd === 'letmein') { // 🔐 Change this to whatever you want
    isAdmin = true;
    alert('Admin mode activated!');

    // Show delete buttons
    document.querySelectorAll('.gallery-item').forEach(addDeleteButton);
  } else {
    alert('Incorrect password.');
  }
});

function addDeleteButton(container) {
  if (container.querySelector('.delete-btn')) return; // Already added

  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️';
  delBtn.className = 'delete-btn';
  delBtn.style.marginTop = '5px';
  delBtn.style.background = '#c00';
  delBtn.style.color = 'white';
  delBtn.style.border = 'none';
  delBtn.style.padding = '2px 5px';
  delBtn.style.cursor = 'pointer';
  delBtn.style.fontSize = '12px';

  delBtn.addEventListener('click', () => {
    container.remove();
  });

  container.appendChild(delBtn);
}
// Add bottom center text
const watermark = document.createElement('div');
watermark.textContent = 'WoKT9g7Y9vERxdPg1AkeU9poRZxM713NGo4UoR2bonk';
watermark.style.position = 'fixed';
watermark.style.bottom = '10px';
watermark.style.left = '50%';
watermark.style.transform = 'translateX(-50%)';
watermark.style.fontSize = '12px';
watermark.style.color = '#FF7518';
watermark.style.opacity = '0.6';
document.body.appendChild(watermark);