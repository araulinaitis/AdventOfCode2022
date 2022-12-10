import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(number => number.split('').map(number => parseInt(number)));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(number => number.split('').map(number => parseInt(number)));

// console.log(input);

let visibleCount = 0;
for (let row in input) {
  for (let col in input[row]) {
    if (isVisibile(row, col, input)) {
      visibleCount++;
    }
  }
}

console.log(visibleCount);

function isVisibile(row, col, trees) {
  row = parseInt(row);
  col = parseInt(col);
  if (row == 0 || col == 0 || row == trees.length - 1 || col == trees[0].length - 1) return true;
  const thisTree = trees[row][col];
  
  // check up
  let upTrees = [];
  for (let newRow = row - 1; newRow >= 0; --newRow) {
    upTrees.push(trees[newRow][col]);
  }

  // check down
  let downTrees = [];
  for (let newRow = row + 1; newRow < trees.length; ++newRow) {
    downTrees.push(trees[newRow][col]);
  }

  // check left
  let leftTrees = [];
  for (let newCol = col - 1; newCol >= 0; --newCol) {
    leftTrees.push(trees[row][newCol]);
  }

  // check right
  let rightTrees = [];
  for (let newCol = col + 1; newCol < trees[0].length; ++newCol) {
    rightTrees.push(trees[row][newCol]);
  }

  if (upTrees.every(tree => tree < thisTree)) return true;
  if (downTrees.every(tree => tree < thisTree)) return true;
  if (leftTrees.every(tree => tree < thisTree)) return true;
  if (rightTrees.every(tree => tree < thisTree)) return true;

  return false;
}