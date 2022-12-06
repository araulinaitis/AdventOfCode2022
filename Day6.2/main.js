import * as fs from 'fs/promises';

// const input = await fs.readFile('./data/test.csv', { encoding: 'UTF-8' });
const input = await fs.readFile('./data/data.csv', { encoding: 'UTF-8' });

// console.log(input);

const sequenceLength = 14;
let code = '';
for (let idx = 0; idx < input.length - sequenceLength; ++idx) {
  if (code.length == 0) {
    code = input[idx];
  }
  for (let offset = 1; offset < sequenceLength; ++offset) {
    if (!code.includes(input[idx + offset])) {
      code += input[idx + offset];
    } else {
      code = '';
      break;
    }
  }
  if (code.length == sequenceLength) {
    console.log({ idx: idx + sequenceLength, code });
    break;
  }
}
