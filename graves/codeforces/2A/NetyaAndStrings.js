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
  var a = arr[0];
  var b = arr[1];

  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a === b) {
    console.log(0);
  } else if (a > b) {
    console.log(1);
  } else if (a < b) {
    console.log(-1);
  }
});
