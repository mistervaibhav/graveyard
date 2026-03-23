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
  var watermelon = parseInt(arr.shift());

  if (watermelon % 2 === 0 && watermelon > 2) {
    console.log('YES');
  } else {
    console.log('NO');
  }
});
