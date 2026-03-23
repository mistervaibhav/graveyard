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
  const T = readline();

  //   console.log(T);

  for (let i = 0; i < T; i++) {
    let n = readline();
    let arr = readline().split(' ');
    foo(n, arr);
  }
}

function foo(n, arr) {
  let res = 0;

  for (let i = 1; i < n; i++) {
    if (parseInt(arr[i]) > parseInt(arr[i - 1])) {
      res += parseInt(arr[i]) - parseInt(arr[i - 1]) - 1;
    } else {
      res += parseInt(arr[i - 1]) - parseInt(arr[i]) - 1;
    }
  }

  console.log(res);
}
