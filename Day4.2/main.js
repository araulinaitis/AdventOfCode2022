import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', {encoding: 'UTF-8'})).split('\r\n').map(row => row.split(',').map(entry => entry.split('-').map(val => parseInt(val))));
const input = (await fs.readFile('./data/data.csv', {encoding: 'UTF-8'})).split('\r\n').map(row => row.split(',').map(entry => entry.split('-').map(val => parseInt(val))));

console.log(input);

let partialOverlapCount = 0;
for (let [pair1, pair2] of input) {
  // console.log({ pair1, pair2 });
  if (isBetween(pair1[0], ...pair2) || isBetween(pair1[1], ...pair2) || isBetween(pair2[0], ...pair1) || isBetween(pair2[1], ...pair1)) partialOverlapCount++;
}

function isBetween(x, x1, x2) {
  return ((x >= x1 && x <= x2) || (x >= x2 && x <= x1))
}

console.log(partialOverlapCount);