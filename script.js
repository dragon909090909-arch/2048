const grid = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const messageEl = document.getElementById("message");

let board = [];
let score = 0;
let best = localStorage.getItem("best2048") || 0;

bestEl.textContent = "Best: " + best;

function init() {
  board = Array(16).fill(0);
  score = 0;
  messageEl.textContent = "";
  addNumber();
  addNumber();
  draw();
}

function draw() {
  grid.innerHTML = "";
  board.forEach(num => {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (num !== 0) {
      cell.textContent = num;
      cell.dataset.value = num;
    }
    grid.appendChild(cell);
  });
  scoreEl.textContent = "Score: " + score;
  bestEl.textContent = "Best: " + best;
}

function addNumber() {
  let empty = board.map((v,i)=>v===0?i:null).filter(v=>v!==null);
  if (!empty.length) return;
  let i = empty[Math.floor(Math.random()*empty.length)];
  board[i] = Math.random() > 0.9 ? 4 : 2;
}

function slide(arr) {
  arr = arr.filter(v=>v);
  for (let i=0;i<arr.length-1;i++) {
    if (arr[i] === arr[i+1]) {
      arr[i] *= 2;
      score += arr[i];
      if (navigator.vibrate) navigator.vibrate(50);
      arr[i+1] = 0;
    }
  }
  return arr.filter(v=>v);
}

function move(dir) {
  let old = board.join();

  for (let i=0;i<4;i++) {
    let line = [];
    for (let j=0;j<4;j++) {
      let index = dir < 2 ? i*4+j : j*4+i;
      if (dir % 2) index = dir < 2 ? i*4+3-j : (3-j)*4+i;
      line.push(board[index]);
    }

    line = slide(line);
    while (line.length < 4) line.push(0);

    for (let j=0;j<4;j++) {
      let index = dir < 2 ? i*4+j : j*4+i;
      if (dir % 2) index = dir < 2 ? i*4+3-j : (3-j)*4+i;
      board[index] = line[j];
    }
  }

  if (old !== board.join()) {
    addNumber();
    if (score > best) {
      best = score;
      localStorage.setItem("best2048", best);
    }
    draw();
    checkGameOver();
  }
}

function checkGameOver() {
  if (board.includes(0)) return;
  for (let i=0;i<16;i++) {
    let x = i%4;
    let y = Math.floor(i/4);
    if (x<3 && board[i]===board[i+1]) return;
    if (y<3 && board[i]===board[i+4]) return;
  }
  messageEl.textContent = "Game Over 💀";
}

document.addEventListener("keydown", e => {
  if (e.key==="ArrowLeft") move(0);
  if (e.key==="ArrowRight") move(1);
  if (e.key==="ArrowUp") move(2);
  if (e.key==="ArrowDown") move(3);
});

let sx, sy;
grid.addEventListener("touchstart", e => {
  sx = e.touches[0].clientX;
  sy = e.touches[0].clientY;
});
grid.addEventListener("touchend", e => {
  let dx = e.changedTouches[0].clientX - sx;
  let dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) move(1);
    else if (dx < -30) move(0);
  } else {
    if (dy > 30) move(3);
    else if (dy < -30) move(2);
  }
});

function restart() {
  init();
}

init();
