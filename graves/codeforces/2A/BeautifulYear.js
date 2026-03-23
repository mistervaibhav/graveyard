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
  const year = readline();

  while (true) {
    year += 1;
    let a = year / 1000;
    let b = (year / 100) % 10;
    let c = (year / 10) % 10;
    let d = year % 10;
    if (a != b && a != c && a != d && b != c && b != d && c != d) {
      break;
    }
  }

  console.log(year);
}
