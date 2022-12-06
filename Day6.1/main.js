import * as fs from 'fs/promises';

// const input = await fs.readFile('./data/test.csv', { encoding: 'UTF-8' });
const input = await fs.readFile('./data/data.csv', { encoding: 'UTF-8' });

// console.log(input);

let code = '';
for (let idx = 0; idx < input.length - 4; ++idx) {
  if (code.length == 0) {
    code = input[idx];
  }
  for (let offset = 1; offset < 4; ++offset) {
    if (!code.includes(input[idx + offset])) {
      code += input[idx + offset];
    } else {
      code = '';
      break;
    }
  }
  if (code.length == 4) {
    console.log({ idx: idx + 4, code });
    break;
  }
}
