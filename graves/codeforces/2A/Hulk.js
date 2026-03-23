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
  var n = readline();

  let str = '';
  let odd = 'I hate ';
  let even = 'I love ';
  let that = 'that ';
  let end = 'it';

  for (let i = 1; i <= n; i++) {
    if (i % 2 !== 0) {
      if (i > 1) {
        str += that;
      }
      str += odd;
    } else if (i % 2 === 0) {
      str += that;
      str += even;
    }
  }

  str += end;

  console.log(str);
}

// main(7)
