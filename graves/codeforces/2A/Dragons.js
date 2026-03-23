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
  let [s, n] = readIntArray();

  let levels = [];
  let flag = false;

  while (n-- > 0) {
    levels.push(readIntArray());
  }

  levels.sort((a, b) => a[0] - b[0]);

  levels.forEach((match) => {
    if (s <= match[0]) {
      flag = false;
    } else {
      s += match[1];
      flag = true;
    }
  });

  console.log(flag ? 'YES' : 'NO');
}
