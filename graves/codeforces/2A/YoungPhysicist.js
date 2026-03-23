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
  var T = readline();

  let matrix = [];

  while (T-- > 0) {
    let vector = readline()
      .split(' ')
      .map((int) => parseInt(int));

    matrix.push(vector);
  }

  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  for (let i = 0; i < matrix.length; i++) {
    let vector = matrix[i];
    sumX += vector[0];
    sumY += vector[1];
    sumZ += vector[2];
  }

  if (sumX === 0 && sumY === 0 && sumZ === 0) {
    console.log('YES');
  } else {
    console.log('NO');
  }
}
