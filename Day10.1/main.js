import * as fs from 'fs/promises';

const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
// const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

console.log(input);

let X = 1;
let output = [];

const funcs = {
  addx: (val) => {
    output.push(X);
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

for (let idx = 20; idx < output.length; idx += 40) {
  console.log(output[idx]);
}