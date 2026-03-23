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

function main() {
  let lines = 5;

  let matrix = [];

  while (lines-- > 0) {
    let array = readline()
      .split(' ')
      .map((int) => parseInt(int));

    matrix.push(array);
  }

  let x;
  let y;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === 1) {
        x = i + 1;
        y = j + 1;
      }
    }
  }

  console.log(Math.abs(3 - x) + Math.abs(3 - y));
}
