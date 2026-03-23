process.stdin.resume();
process.stdin.setEncoding('utf8');

// * STANDARD INPUT IS STORED IN A STRING
var arr = '';

process.stdin.on('data', function (chunk) {
  arr += chunk;
});

process.stdin.on('end', function () {
  // * CONVERTING THAT INPUT INTO AN ARRAY
  arr = arr.split('\n');
  // * EXTRACTING THE NUMBER OF TESTCASES
  var T = parseInt(arr.shift());
  // * LOOP THROUGH THE TESTCASES
  for (let i = 0; i < T; i++) {
    // * ALL YOUR LOGIC GOES HERE

    let num = arr[i];
    let digit;
    let res = 0;

    while (num) {
      digit = num % 10;
      res = res * 10 + digit;
      num = parseInt(num / 10);
    }

    console.log(res);
  }
});
