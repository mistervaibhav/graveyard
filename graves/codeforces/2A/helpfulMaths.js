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

  driver();
});

function readline() {
  return inputString[currentLine++];
}

function driver() {
  const x = readline();
  main(x);
}

function main(string) {
  if (!string.includes('+')) {
    console.log(string);
    return;
  }

  string = string
    .split('+')
    .sort((a, b) => a - b)
    .join('+');

  console.log(string);
}
