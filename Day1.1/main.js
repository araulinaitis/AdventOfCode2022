import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', {encoding: 'UTF-8'})).split('\r\n\r\n').map(row => row.split('\r\n').map(val => parseInt(val)));
const input = (await fs.readFile('./data/data.csv', {encoding: 'UTF-8'})).split('\r\n\r\n').map(row => row.split('\r\n').map(val => parseInt(val)));

// console.log(input);

const caloriesPerElf = input.map(row => row.reduce((prev, cur) => prev + cur));

console.log(Math.max(...caloriesPerElf));