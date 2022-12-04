import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', {encoding: 'UTF-8'})).split('\r\n').map(row => row.split(',').map(entry => entry.split('-').map(val => parseInt(val))));
const input = (await fs.readFile('./data/data.csv', {encoding: 'UTF-8'})).split('\r\n').map(row => row.split(',').map(entry => entry.split('-').map(val => parseInt(val))));

console.log(input);

let fullOverlapCount = 0;
for (let [pair1, pair2] of input) {
  // console.log({ pair1, pair2 });
  if ((pair1[0] <= pair2[0] && pair1[1] >= pair2[1]) || (pair2[0] <= pair1[0] && pair2[1] >= pair1[1])) fullOverlapCount++;
}

console.log(fullOverlapCount);