import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n');
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n');

console.log(input);

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
}

class Sensor extends Node {
  constructor(x, y) {
    super(x, y);
    board[x][y] = this;
  }

  setNoBeacons() {
    let distance = Math.abs(this.beacon.y - this.y) + Math.abs(this.beacon.x - this.x); // manhattan distance
    for (let xOffset = -distance; xOffset <= distance; ++xOffset) {
      for (let yOffset = -distance; yOffset <= distance; ++yOffset) {
        if (Math.abs(xOffset) + Math.abs(yOffset) > distance) continue; // manhattan distance
        new NoBeacon(this.x + xOffset, this.y + yOffset);
        // if (board?.[this.x + xOffset]?.[this.y + yOffset] == '') new NoBeacon(this.x + xOffset, this.y + yOffset);
      }
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
  sensors.push(newSensor);
}

// for (let x = minX; x <= maxX; ++x) {
//   if (!board[x]) board[x] = {};
//   for (let y = minY; y <= maxY; ++y) {
//     if (!board[x][y]) board[x][y] = '';
//   }
// }

print();

console.log('');
let sensorCount = 0;
for (let sensor of sensors) {
  // print();
  // console.log('');
  sensor.setNoBeacons();
  sensorCount++;
  console.log(sensorCount);
}

print();
console.log(Object.values(board).map(col => col[10]));
console.log(Object.values(board).map(col => col[10]).filter(el => el instanceof NoBeacon).length)

function print() {
  console.log(
    Object.values(board).reverse()
      .map(col =>
        Object.values(col)
          .map(entry => {
            if (entry instanceof Sensor) return 'S';
            if (entry instanceof Beacon) return 'B';
            if (entry instanceof NoBeacon) return '#';
            return '.';
          })
          .join('')
      )
      .join('\n')
  );
}