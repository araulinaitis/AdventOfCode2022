import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', {encoding: 'UTF-8'})).split('\r\n\r\n');
const input = (await fs.readFile('./data/data.csv', {encoding: 'UTF-8'})).split('\r\n\r\n');

// console.log(input[0]);

// const crateInput = input[0].split('\r\n').map(row => row.replaceAll('   ', '[ ]')).slice(0, -1);
let crateInput = [];
for (let row of input[0].split('\r\n').slice(0, -1)) {
  let newRow = [];
  for (let idx = 1; idx < row.length; idx += 4) {
    newRow.push(row[idx]);
  }
  crateInput.push(newRow);
}
const moveInput = input[1].split('\r\n');

// console.log(crateInput);
// console.log(moveInput);

let crates = [];
for (let row of crateInput.reverse()) {
  let index = 1;
  for (let char of row) {
    if (char == ' ') {
      index++;
      continue;
    }

    if (!crates[index]) crates[index] = [];
    crates[index] = [...crates[index], char];
    index++;
  }
}

// console.log(crates.map(row => row.join('')));

let moves = [];

for (let row of moveInput) {
  const [moveCount, fromIdx, toIdx] = row.match(/move ([\d]+) from ([\d]+) to ([\d]+)/).slice(1);
  moves.push({moveCount, fromIdx, toIdx});
}

for (let move of moves) {
  crates[move.toIdx].splice(crates[move.toIdx].length, 0, ...crates[move.fromIdx].splice(-1 * parseInt(move.moveCount)));
}

let output = '';
for (let crate of crates) {
  if (!crate) continue;
  output += crate.slice(-1);
}
console.log(output);