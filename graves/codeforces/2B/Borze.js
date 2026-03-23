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
  var input = readline();
  var output = '';

  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) == '.') {
      output += '0';
    } else if (input.charAt(i) == '-') {
      if (input.charAt(i + 1) == '.') {
        output += '1';
        i++;
      } else {
        output += '2';
        i++;
      }
    }
  }

  console.log(output);
}
