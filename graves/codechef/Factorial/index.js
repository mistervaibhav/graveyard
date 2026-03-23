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
    var num = parseInt(arr[i].split(' ')[0]);
    let count = 0;
    let div = 5;

    if (num < 0) {
      count = -1;
    }

    while (parseInt(num / div) > 0) {
      count += parseInt(num / div);
      div = div * 5;
    }

    console.log(count);
  }
});
