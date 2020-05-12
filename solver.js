let givens = [];
let added = [];

let endI = 0;

onmessage = function (e) {
  let msg = e.data;
  if (msg[0] == "start") {
    givens = msg[1];
    // validate(8, 3)
    endI = givens.lastIndexOf(0)
    postMessage(["solved", thingy()])
  }
}

function thingy() {
  for (let i = 1; i < 10; i++) {
    if (solve(givens.indexOf(0), i)) {
      return true;
    }
  }
  return false;
}

function solve(i, value) {
  if (i >= endI + 1) {
    return true
  }
  if (validate(i, value)) {
    added[i] = value;
    postMessage(["number", i, value])
    let newI = givens.indexOf(0, i + 1);
    if (i !== endI) {
      for (let j = 1; j < 10; j++) {
        if (solve(newI, j)) {
          return true;
        }
      }
    } else {
      return true;
    }
  }
  added[i] = 0;
  return false;
}

function validate(i, value) {
  postMessage(["number", i, value])
  // Check columns
  for (let j = Math.floor(i / 9) * 9; j < Math.ceil(i / 9) * 9 - 1; j++) {
    if (givens[j] == value || added[j] == value) {
      // postMessage(["red", j]);
      // postMessage(["red", i]);
      return false;
    }
  }

  // Check rows
  for (let j = i % 9; j < 81; j += 9) {
    if (givens[j] == value || added[j] == value) {
      // postMessage(["red", j]);
      // postMessage(["red", i]);
      return false;
    }
  }

  // Check box
  let x = Math.floor(i / 9);
  let y = i % 9;
  x = Math.floor(x / 3) * 3;
  y = Math.floor(y / 3) * 3;
  for (let j = x; j < 3 + x; j++) {
    for (let k = y; k < 3 + y; k++) {
      if (givens[j * 9 + k] == value || added[j * 9 + k] == value) {
        // postMessage(["red", j * 9 + k]);
        // postMessage(["red", i]);
        return false;
      }
    }
  }

  return true;
}