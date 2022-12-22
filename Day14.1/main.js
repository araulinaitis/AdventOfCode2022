import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' -> ').map(coords => coords.split(',').map(val => parseInt(val))));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' -> ').map(coords => coords.split(',').map(val => parseInt(val))));

console.log(input);

let board = {};

class Rock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    if (!board[x]) board[x] = {};
    board[x][y] = this;
  }
}

class Sand {
  constructor() {
    this.x = 500;
    this.y = 0;
    board[this.x][this.y] = this;
    this.settled = false;
    this.infiniteFall = false;
  }

  fall() {
    while (!this.settled && !this.infiniteFall) {
      this.step();
    }
  }

  move(x, y) {
    this.remove();
    if (x < minX || x > maxX || y > maxY) {
      this.infiniteFall = true;
      return;
    }
    this.x = x;
    this.y = y;
    this.add();
  }

  step() {
    // check if we can fall
    if (!board[this.x][this.y + 1]) {
      this.move(this.x, this.y + 1);
      return;
    }

    // check if we're on top of something
    if (board[this.x][this.y + 1]) {
      // check if we can move left
      // if we're at the left edge of the board, then the sand will fall off and never settle, so we're done
      if (this.x == minX) {
        this.infiniteFall = true;
        return;
      }

      // check if there's a valid left move
      if (!board[this.x - 1][this.y + 1]) {
        this.move(this.x - 1, this.y + 1);
        return;
      }

      // check if there's a valid right move
      // if we're at the right edge of the board, then the sand will fall off and never settle, so we're done
      if (this.x == maxX) {
        this.infiniteFall = true;
        return;
      }

      // check if there's a valid right move
      if (!board[this.x + 1][this.y + 1]) {
        this.move(this.x + 1, this.y + 1);
        return;
      }
    }

    this.settled = true;
  }

  remove() {
    board[this.x][this.y] = '';
  }

  add() {
    try {
      board[this.x][this.y] = this;
    } catch (err) {
      console.log(err);
    }
  }
}

let minX = Infinity;
let minY = 0;
let maxX = -Infinity;
let maxY = -Infinity;
for (let row of input) {
  let startX = row[0][0];
  let startY = row[0][1];
  let thisIdx = 0;
  while (row[thisIdx + 1] !== undefined) {
    const targetX = row[thisIdx + 1][0];
    const targetY = row[thisIdx + 1][1];
    const xStep = startX < targetX ? 1 : -1;
    const yStep = startY < targetY ? 1 : -1;
    let x = startX;
    let y = startY;
    while (x != targetX || y != targetY) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
      
      new Rock(x, y);
      if (x != targetX) x += xStep;
      if (y != targetY) y += yStep;
    }
    // make the last rock because the while loop above doesn't do it
    new Rock(targetX, targetY);
    startX = targetX;
    startY = targetY;
    thisIdx++;
  }
}

for (let x = minX; x <= maxX; ++x) {
  if (!board[x]) board[x] = {};
  for (let y = minY; y <= maxY; ++y) {
    if (!board[x][y]) board[x][y] = '';
  }
}

print();

while (true) { // while (true) is gross but oh well
  const sand = new Sand();
  sand.fall();
  if (sand.infiniteFall) break
}

let sandCount = 0;
print();
console.log(sandCount);

function print() {
  console.log(
    Object.values(board).reverse()
      .map(col =>
        Object.values(col).map(entry => {
          if (entry instanceof Sand) {
            sandCount++;
            return 'O';
            // return entry.index;
          }
          if (entry instanceof Rock) return '#';
          return '.';
        }).join('')
      )
      .join('\n')
  );
}
