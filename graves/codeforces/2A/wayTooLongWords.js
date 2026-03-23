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
// Make a Snippet for the code above this and then write your logic in main();

function main() {
  const T = readline();
  let words = [];

  for (let i = 0; i < T; i++) {
    words.push(readline());
  }

  words.forEach((word) => {
    foo(word);
  });
}

function foo(word) {
  if (word.length <= 10) {
    console.log(word);
  } else {
    let wordArr = word.split('');

    let start = wordArr[0];
    let middle = wordArr.length - 2;
    let end = wordArr[wordArr.length - 1];
    console.log(start + middle + end);
  }
}
