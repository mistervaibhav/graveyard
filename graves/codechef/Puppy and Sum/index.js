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

    // * EXAMPLE
    var d = parseInt(arr[i].split(' ')[0]); // ? get first no
    var n = parseInt(arr[i].split(' ')[1]); // ? get second no

    for (let i = 0; i < d; i++) {
      n = (n * (n + 1)) / 2;
    }

    console.log(n);
  }
});
