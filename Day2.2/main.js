import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', {encoding: 'UTF-8'})).split('\r\n').map(row => row.split(' ').join(''));
const input = (await fs.readFile('./data/data.csv', {encoding: 'UTF-8'})).split('\r\n').map(row => row.split(' ').join(''));

// console.log(input);
// A Rock X
// B Paper Y
// C Scissors Z

const moves = {
  AX: 3 + 0,
  AY: 1 + 3,
  AZ: 2 + 6,
  BX: 1 + 0,
  BY: 2 + 3,
  BZ: 3 + 6,
  CX: 2 + 0,
  CY: 3 + 3,
  CZ: 1 + 6,
};

const points = input.map(input => moves[input]).reduce((prev, cur) => prev + cur);
console.log(points);