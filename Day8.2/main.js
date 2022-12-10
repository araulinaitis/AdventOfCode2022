import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(number => number.split('').map(number => parseInt(number)));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(number => number.split('').map(number => parseInt(number)));

// console.log(input);

let bestView = 0;
for (let row = 1; row < input.length - 1; ++row) {
  for (let col = 1; col < input[row].length - 1; ++col) {
    const view = calculateView(row, col, input);
    if (view > bestView) {
      bestView = view;
    }
  }
}

console.log(bestView);

function calculateView(row, col, trees) {
  row = parseInt(row);
  col = parseInt(col);
  if (row == 0 || col == 0 || row == trees.length - 1 || col == trees[0].length - 1) return true;
  const thisTree = trees[row][col];
  
  // check up
  let upScore = 0;
  for (let newRow = row - 1; newRow >= 0; --newRow) {
    upScore++;
    if (trees[newRow][col] >= thisTree) break;
  }

  // check down
  let downScore = 0;
  for (let newRow = row + 1; newRow < trees.length; ++newRow) {
    downScore++;
    if (trees[newRow][col] >= thisTree) break;
  }

  // check left
  let leftScore = 0;
  for (let newCol = col - 1; newCol >= 0; --newCol) {
    leftScore++;
    if (trees[row][newCol] >= thisTree) break;
  }

  // check right
  let rightScore = 0;
  for (let newCol = col + 1; newCol < trees[0].length; ++newCol) {
    rightScore++;
    if (trees[row][newCol] >= thisTree) break;
  }

  return upScore * rightScore * downScore * leftScore;
}