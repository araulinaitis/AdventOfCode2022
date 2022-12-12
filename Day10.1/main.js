import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

// console.log(input);

let X = 1;
let output = [X];

const funcs = {
  addx: (val) => {
    output.push(X);
    X += val;
    output.push(X);
  },
  noop: () => {
    output.push(X);
  }
}

for (let [command, valStr] of input) {
  const val = parseInt(valStr);
  funcs[command](val);
}

let sum = 0;
for (let idx = 19; idx < output.length; idx += 40) {
  sum += output[idx] * (idx + 1);
}
console.log({sum});