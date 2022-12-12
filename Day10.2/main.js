import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

// console.log(input);

let X = 1;
let sprite = { x: 1 };
let count = 1;

let output = [0, 1, 2, 3, 4, 5].map(val => Array(40).fill('.'));

const funcs = {
  addx: (val) => {
    clock();
    X += val;
    sprite.x = X % 40;
    clock();
  },
  noop: () => {
    clock();
  }
}

function clock() {
  // console.log(count, sprite.row);
  const row = Math.floor(count / 40);
  if (count % 40 == sprite.x - 1) {
    output[row][sprite.x - 1] = '#';
  } else if (count % 40 == sprite.x) {
    output[row][sprite.x] = '#';
  } else if (count % 40 == sprite.x + 1) {
    output[row][sprite.x + 1] = '#';
  }
  count++;
}

// function clock() {
//   // console.log(count, sprite.row);
//   if (count == sprite.row * 40 + sprite.x - 2) {
//     output[sprite.row][sprite.x - 2] = '#';
//   } else if (count == sprite.row * 40 + sprite.x - 1) {
//     output[sprite.row][sprite.x - 1] = '#';
//   } else if (count == sprite.row * 40 + sprite.x) {
//     output[sprite.row][sprite.x] = '#';
//   }
//   count++;
// }

for (let [command, valStr] of input) {
  const val = parseInt(valStr);
  funcs[command](val);
}

console.log(output.map(row => row.join('')));
