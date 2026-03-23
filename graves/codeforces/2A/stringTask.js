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
// Make a Snippet for the code above this and then write your logic in main();

function driver() {
  const string = readline();
  main(string);
}

function main(string) {
  let result;

  string = string.toLowerCase().split('');

  for (let i = 0; i < string.length - 1; i++) {
    if (
      string[i] !== 'a' &&
      string[i] !== 'e' &&
      string[i] !== 'o' &&
      string[i] !== 'u' &&
      string[i] !== 'i' &&
      string[i] !== 'y'
    ) {
      result += '.';
      result += string[i];
    }
  }

  console.log(result);
}

main();
