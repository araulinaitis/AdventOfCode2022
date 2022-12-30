import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n');
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n');

// console.log(input);

// const targetY = 10;
const targetY = 2000000;
const matchRegex = /Sensor at x=(-*[0-9]+), y=(-*[0-9]+): closest beacon is at x=(-*[0-9]+), y=(-*[0-9]+)/;

let board = {};


let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

let sensorCount = 0;
for (let row of input) {
  const matchedStr = row.match(matchRegex);
  let [_, sensorX, sensorY, beaconX, beaconY] = matchedStr;
  sensorX = parseInt(sensorX);
  sensorY = parseInt(sensorY);
  beaconX = parseInt(beaconX);
  beaconY = parseInt(beaconY);
  

  // add nobeacons
  const dist = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
  for (let xOffset = -dist; xOffset <= dist; ++xOffset) {
    const x = sensorX + xOffset;
    if (x < 0 || x > 4000000) continue;
    for (let yOffset = -dist; yOffset <= dist; ++yOffset) {
      const y = sensorY + yOffset;
      // if (x < minX) minX = x;
      // if (y < minY) minY = y;
      // if (x > maxX) maxX = x;
      // if (y > maxY) maxY = y;

      if (y < 0 || y > 4000000) continue;
      if (board?.[y]?.[x]) continue;
      if (!board[y]) board[y] = {};
      // if (Math.abs(xOffset) + Math.abs(yOffset) > dist) {
      //   // board[y][x] = '.';
      // } else {
      //   board[y][x] = '#';
      // }
      if (Math.abs(xOffset) + Math.abs(yOffset) <= dist) board[y][x] = '#';
    }
    // console.log(xOffset);
    if (xOffset % 100 == 0) console.log(xOffset);
  }
  
  // add sensor/beacon after to put back on top :)
  if (!board[sensorY]) board[sensorY] = {};
  board[sensorY][sensorX] = 'S';
  if (!board[beaconY]) board[beaconY] = {};
  board[beaconY][beaconX] = 'B';
  console.log(sensorCount++);
}

// print();
console.log('');

let done = false;
for (let [rowIdx, row] of Object.entries(board)) {
  // const sortedRow = Object.entries(row).sort(keySort).map(entry => entry[1]);
  // console.log(sortedRow.join(''));
  // if (sortedRow.join('').search(/#\.#/) !== -1) {
  //   console.log(rowIdx, sortedRow.join('').search(/#\.#/));
  // }
  for (let x = 0; x <= 4000000; ++x) {
    if (!row[x]) {
      if (row?.[x - 1] == '#' && row?.[x + 1] == '#') {
        console.log(x, rowIdx);
        done = true;
        break;
      }
    }
  }
  if (done) break;
}

// console.log(board.map(col => col.join('')).join('\n'));
// console.log(board[10].join(''));

function print() {
  for (let y = minY; y <= maxY; ++y) {
    let row = '';
    for (let x = minX; x <= maxX; ++x) {
      row += board?.[x]?.[y] ?? '.';
    }
    console.log(row);
  }
}

function keySort(a, b) {
  const [aKey, aData] = a;
  const [bKey, bData] = b;
  if (parseInt(aKey) < parseInt(bKey)) return -1;
  if (parseInt(aKey) > parseInt(bKey)) return 1;
  return 0;
}
