import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split(' '));

// console.log(input);

let head = { x: 0, y: 0 };
let tails = [];
for (let i = 0; i < 9; ++i) {
  tails.push({x: 0, y: 0});
}

let tailPositions = {};
for (let [dir, count] of input) {
  for (let i = 0; i < count; ++i) {
    moveHead(dir);
    for (let i = 0; i < 9; ++i ) {
      moveTail(i);
    }
    if (!tailPositions[tails[8].x]) tailPositions[tails[8].x] = {};
    tailPositions[tails[8].x][tails[8].y] = 1;
  }
}

// console.log(tailPositions);
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

function moveTail(i) {
  let thisHead;
  if (i == 0) {
    thisHead = head;
  } else {
    thisHead = tails[i - 1];
  }

  const thisTail = tails[i];

  while (Math.abs(thisTail.x - thisHead.x) > 1 || Math.abs(thisTail.y - thisHead.y) > 1) {
    if (thisTail.x < thisHead.x) {
      thisTail.x++;
    }
    if (thisTail.y < thisHead.y) {
      thisTail.y++;
    }
    if (thisTail.x > thisHead.x) {
      thisTail.x--;
    }
    if (thisTail.y > thisHead.y) {
      thisTail.y--;
    }
  }
}
