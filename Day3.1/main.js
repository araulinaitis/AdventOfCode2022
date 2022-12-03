import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', {encoding: 'UTF-8'})).split('\r\n');
const input = (await fs.readFile('./data/data.csv', {encoding: 'UTF-8'})).split('\r\n');

// console.log(input);

let points = 0;
for (let backpack of input) {
  const firstHalf = backpack.slice(0, backpack.length / 2);
  const secondHalf = backpack.slice(backpack.length / 2);

  for (let firstChar of firstHalf) {
    if (secondHalf.includes(firstChar)) {
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