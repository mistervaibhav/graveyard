'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', (inputStdin) => {
  inputString += inputStdin;
});

process.stdin.on('end', (_) => {
  inputString = inputString
    .trim()
    .split('\n')
    .map((string) => {
      return string.trim();
    });

  main();
});

function readline() {
  return inputString[currentLine++];
}

function readIntArray() {
  return readline()
    .split(' ')
    .map((num) => parseInt(num));
}

function readFloatArray() {
  return readline()
    .split(' ')
    .map((num) => parseFloat(num));
}

/*=====================START CODING HERE=====================*/

// DONT FUCK WITH THE MAIN FUNCTION !!
function main() {
  let t = readline();

  while (t-- > 0) {
    let cars = readline();

    let speeds = readIntArray();

    let count = 0;
    let maxSpeed = Number.MAX_VALUE;

    speeds.forEach((speed) => {
      if (speed <= maxSpeed) {
        maxSpeed = speed;
        count++;
      }
    });

    console.log(count);
  }
}
