import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', {encoding: 'UTF-8'})).split('\r\n');
const input = (await fs.readFile('./data/data.csv', {encoding: 'UTF-8'})).split('\r\n');

console.log(input);

let points = 0;
for (let group = 0; group < input.length - 1; group += 3 ){
  for (let firstChar of input[group]) {
    if (input[group + 1].includes(firstChar) && input[group + 2].includes(firstChar)) {
      points += pointValue(firstChar);
      break;
    }
  }
}

console.log(points);

function pointValue(char) {
  if (char.toLowerCase() == char) {
    return char.charCodeAt(0) - 96;
  }
  return char.charCodeAt(0) - 38
}