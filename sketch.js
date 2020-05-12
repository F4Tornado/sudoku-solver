const c = document.getElementById("c");
const draw = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;

let numbers = [5, 6, 0, 8, 4, 7, 0, 0, 0, 3, 0, 9, 0, 0, 0, 6, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 8, 0, 0, 4, 0, 7, 9, 0, 6, 0, 2, 0, 1, 8, 0, 5, 0, 0, 3, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 6, 0, 0, 0, 8, 0, 7, 0, 0, 0, 3, 1, 6, 0, 5, 9];

let reds = [];

let running = true;

draw.textAlign = "center";
draw.textBaseline = "middle";
draw.font = "32px Source code pro"

function drawLoop() {
  draw.fillStyle = "#000";
  draw.fillRect(0, 0, c.width, c.height);

  draw.strokeStyle = "#fff";
  // Draw vertical lines
  for (let i = 1; i < 9; i++) {
    let a = gridToCoords(i, 0);
    let b = gridToCoords(i, 9);
    if (i % 3 == 0) {
      draw.lineWidth = 8;
    } else {
      draw.lineWidth = 2;
    }
    draw.beginPath();
    draw.moveTo(a[0], a[1]);
    draw.lineTo(b[0], b[1]);
    draw.stroke();
  }

  // Draw horizontal lines
  for (let i = 1; i < 9; i++) {
    let a = gridToCoords(0, i);
    let b = gridToCoords(9, i);
    if (i % 3 == 0) {
      draw.lineWidth = 8;
    } else {
      draw.lineWidth = 2;
    }
    draw.beginPath();
    draw.moveTo(a[0], a[1]);
    draw.lineTo(b[0], b[1]);
    draw.stroke();
  }

  // Draw the numbers
  draw.fillStyle = "#fff";
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] !== 0) {
      let pos = gridToCoords(Math.floor(i / 9), i % 9);
      draw.fillText(numbers[i], pos[0] + 32, pos[1] + 32);
    }
  }

  // Draw any red flashes, and remove them if neccesary
  for (let i = 0; i < reds.length; i++) {
    if (reds[i].show()) {
      reds.splice(i, 1);
    }
  }

  if (running) {
    setTimeout(drawLoop, 0);
  }
}

function gridToCoords(x, y) {
  return [x * 64 + 128, y * 64 + 128];
}


// Blink red over a tile

class Red {
  constructor(i) {
    this.y = i % 9;
    this.x = Math.floor(i / 9);
    this.t = performance.now() + 1000;
  }

  show() {
    draw.fillStyle = `rgba(255, 0, 0, ${1 - (performance.now() - (this.t - 1000)) / 1000})`;
    let pos = gridToCoords(this.x, this.y);
    draw.fillRect(pos[0], pos[1], 64, 64);

    if (performance.now() >= this.t) {
      return "I REQUIRE LØØPS BRØTHER";
    }
  }
}

// Spawn a web worker that solves the sudoku so this file can work on drawing
const worker = new Worker("solver.js");

worker.onmessage = function (e) {
  let msg = e.data;
  if (msg[0] == "red") { // Add a red highlight if the worker wants
    // reds.push(new Red(msg[1]))
  } else if (msg[0] == "number") { // Change a number if the worker wants
    numbers[msg[1]] = msg[2];
  } else if (msg[0] == "solved") {
    console.log(msg[1]);
  }
}

worker.postMessage(["start", numbers])

drawLoop();