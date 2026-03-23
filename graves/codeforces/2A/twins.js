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
  const count = readline();

  const coins = [];

  for (let i = 0; i < count; i++) {
    coins.push(readline());
  }

  let sum = coins.reduce((a, b) => a + b);

  let min = 0;

  coins.forEach((coin) => {
    if (min < sum - coin) {
      min++;
      sum -= coin;
    }
  });

  console.log(min);
}
