import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

// console.log(input);

let head = { x: 0, y: 0 };
let tail = { x: 0, y: 0 };
let tailPositions = {};
for (let [dir, count] of input) {
  for (let i = 0; i < count; ++i) {
    moveHead(dir);
    moveTail();
    if (!tailPositions[tail.x]) tailPositions[tail.x] = {};
    tailPositions[tail.x][tail.y] = 1;
  }
}

console.log(Object.values(tailPositions).map(positions => Object.values(positions).reduce((prev, cur) => prev +cur)).reduce((prev, cur) => prev + cur));

function moveHead(dir) {
  switch (dir) {
    case 'U':
      head.x++;
      break;
    case 'R':
      head.y++;
      break;
    case 'D':
      head.x--;
      break;
    case 'L':
      head.y--;
      break;
  }
}

function moveTail() {
  while (Math.abs(tail.x - head.x) > 1 || Math.abs(tail.y - head.y) > 1) {
    if (tail.x < head.x) {
      tail.x++;
    }
    if (tail.y < head.y) {
      tail.y++;
    }
    if (tail.x > head.x) {
      tail.x--;
    }
    if (tail.y > head.y) {
      tail.y--;
    }
  }
}
