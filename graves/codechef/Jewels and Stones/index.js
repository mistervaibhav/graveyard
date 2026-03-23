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
  var t = readline();

  while (t-- > 0) {
    let jewels = new Set(readline().split(''));
    let stones = readline().split('');

    let count = 0;

    stones.forEach((stone) => {
      if (jewels.has(stone)) {
        count++;
      }
    });

    console.log(count);
  }
}
