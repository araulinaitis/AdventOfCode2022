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

class Node {
  constructor(x, y) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;

    this.x = x;
    this.y = y;
    if (!board[x]) board[x] = {};
  }

  manhattanDistanceTo(x, y) {
    return Math.abs(this.x - x) + Math.abs(this.y - y);
  }
}

class Sensor extends Node {
  constructor(x, y) {
    super(x, y);
    board[x][y] = this;
  }

  setNoBeacons() {
    for (let xOffset = -this.beaconDistance; xOffset <= this.beaconDistance; ++xOffset) {
      // for (let yOffset = -this.beaconDistance; yOffset <= this.beaconDistance; ++yOffset) {
        // let targetY = yOffset;
      //   if ((this.y + yOffset) !== 2000000) continue;
      if (Math.abs(xOffset) + Math.abs(targetY - this.y) > this.beaconDistance) continue; // manhattan distance
      // if (board?.[this.x + xOffset]?.[this.y + yOffset] !== '') continue;
      const thisNode = board?.[this.x + xOffset]?.[targetY];
      if (thisNode instanceof Node) continue;
      new NoBeacon(this.x + xOffset, targetY);
      // if (board?.[this.x + xOffset]?.[this.y + yOffset] == '') new NoBeacon(this.x + xOffset, this.y + yOffset);
      // }
    }
  }
}

class Beacon extends Node {
  constructor(x, y) {
    super(x, y);
    board[x][y] = this;
  }
}

class NoBeacon extends Node {
  constructor(x, y) {
    super(x, y);
    board[x][y] = this;
  }
}

let sensors = [];
for (let row of input) {
  const matchedStr = row.match(matchRegex);
  const [_, sensorX, sensorY, beaconX, beaconY] = matchedStr;
  let newSensor = new Sensor(parseInt(sensorX), parseInt(sensorY));
  let newBeacon = new Beacon(parseInt(beaconX), parseInt(beaconY));
  newSensor.beacon = newBeacon;
  newSensor.beaconDistance = newSensor.manhattanDistanceTo(newBeacon.x, newBeacon.y);
  sensors.push(newSensor);
}

// for (let x = minX; x <= maxX; ++x) {
//   if (!board[x]) board[x] = {};
//   for (let y = minY; y <= maxY; ++y) {
//     let thisNode = board[x][y];
//     if (thisNode instanceof Sensor || thisNode instanceof Beacon) continue;
//     // for (let sensor of sensors) {
//     //   if (sensor.manhattanDistanceTo(x, y) <= sensor.beaconDistance) {
//     //     new NoBeacon(x, y);
//     //     continue;
//     //   }
//     // }
//     if (!board[x][y]) board[x][y] = '';
//   }
// }

// print();

console.log('');
let idx = 1;
for (let sensor of sensors) {
  // print();
  // console.log('');
  sensor.setNoBeacons();
  // print();
  console.log(idx++);
}

// print();
// console.log(Object.values(board).map(col => col[targetY]));
console.log(
  Object.values(board)
    .map(col => col[targetY])
    .filter(el => el instanceof NoBeacon).length
);
let noBeaconCount = 0;
for (let x = minX; x <= maxX; ++x) {
  // console.log(board?.[x]?.[targetY]);
  if (board?.[x]?.[targetY] instanceof NoBeacon) noBeaconCount++;
}
console.log(noBeaconCount);

// function print() {
//   console.log(
//     Object.entries(board)
//       .sort(keySort)
//       .map(entry => entry[1])
//       .map(col =>
//         Object.entries(col)
//           .sort(keySort)
//           .map(entry => entry[1])
//           .map(entry => {
//             if (entry instanceof Sensor) return 'S';
//             if (entry instanceof Beacon) return 'B';
//             if (entry instanceof NoBeacon) return '#';
//             return '.';
//           })
//           .join('')
//       )
//       .join('\n')
//   );
// }

function print() {
  let xHeader = '';
  for (let x = minX; x <= maxX; ++x) {
    xHeader += padTo(x.toString(), 2);
  }
  console.log(xHeader);
  for (let y = minY; y <= maxY; ++y) {
    let row = padTo(y.toString(), 2);
    for (let x = minX; x <= maxX; ++x) {
      let thisNode = board?.[x]?.[y];
      if (!thisNode) row += padTo('.', 2);
      if (thisNode instanceof Beacon) row += padTo('B', 2);
      if (thisNode instanceof Sensor) row += padTo('S', 2);
      if (thisNode instanceof NoBeacon) row += padTo('#', 2);
    }
    console.log(row);
  }
}

function padTo(str, len) {
  while (str.length < len) {
    str = ' ' + str;
  }
  return str;
}

function keySort(a, b) {
  const [aKey, aData] = a;
  const [bKey, bData] = b;
  if (parseInt(aKey) < parseInt(bKey)) return -1;
  if (parseInt(aKey) > parseInt(bKey)) return 1;
  return 0;
}
