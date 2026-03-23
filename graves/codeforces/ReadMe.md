# Templates

## Python Template

```python

import sys

############ ---- Input Functions ---- ############
def single_integer_input():
    return(int(sys.stdin.readline()))

def array_of_integers_input():
    return(list(map(int,sys.stdin.readline().split())))

def array_of_chars_input():
    s = sys.stdin.readline()
    return(list(s[:len(s) - 1]))

def space_separated_integers_input():
    return(map(int,sys.stdin.readline().split()))

if __name__ == '__main__':
    # Start coding

```

## Javascript Template

```javascript
"use strict";

process.stdin.resume();
process.stdin.setEncoding("utf-8");

let inputString = "";
let currentLine = 0;

process.stdin.on("data", (inputStdin) => {
  inputString += inputStdin;
});

process.stdin.on("end", (_) => {
  inputString = inputString
    .trim()
    .split("\n")
    .map((string) => {
      return string.trim();
    });

  main();
});

function readline() {
  return inputString[currentLine++];
}

function main() {
  const input = readline();

  // Start coding
}
```
