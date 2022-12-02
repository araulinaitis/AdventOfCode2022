import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', {encoding: 'UTF-8'})).split('\r\n').map(row => row.split(' ').join(''));
const input = (await fs.readFile('./data/data.csv', {encoding: 'UTF-8'})).split('\r\n').map(row => row.split(' ').join(''));

// console.log(input);
// A Rock X
// B Paper Y
// C Scissors Z

const moves = {
  AX: 1 + 3,
  AY: 2 + 6,
  AZ: 3 + 0,
  BX: 1 + 0,
  BY: 2 + 3,
  BZ: 3 + 6,
  CX: 1 + 6,
  CY: 2 + 0,
  CZ: 3 + 3,
};

const points = input.map(input => moves[input]).reduce((prev, cur) => prev + cur);
console.log(points);