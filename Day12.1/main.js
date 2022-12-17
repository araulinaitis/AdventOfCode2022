import * as fs from 'fs/promises';

const a = 'a'.charCodeAt(0);

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => val.charCodeAt(0) - a));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n').map(row => row.split('').map(val => val.charCodeAt(0) - a));

console.log(input.map(row => row.join(' ')));

// I know I could us A* (or any other pathfinding algorigthm) here, but that's boring,
// so I'm doing it my own way for fun. It's not going to be efficient, but at least it will be fun

class Node {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.elevation = input[row][col];
    if (this.elevation == -14) this.elevation = -1;
    if (this.elevation == -28) this.elevation = 26;
    this.forward = [];
    this.distanceToEnd = this.elevation == 26 ? 0 : undefined;
    this.pathToEnd = [];

  }

  buildConnections() {
    for (let offset of [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ]) {
      let otherNode = nodes?.[this.row + offset.row]?.[this.col + offset.col];
      if (!otherNode) continue;
      if (otherNode.elevation <= this.elevation + 1) {
        this.forward.push(nodes[this.row + offset.row][this.col + offset.col]);
      }
    }
  }

  checkPathToEnd() {
    if (this.distanceToEnd) return false;
    let bestPathToEnd;
    let bestDistanceToEnd = Infinity;
    for (let node of this.forward) {
      if (node.elevation == 26 && this.elevation == 25) {
        this.distanceToEnd = 1;
        this.pathToEnd = [this, node];
        return;
      }
      if (node.distanceToEnd !== undefined) {
        if (node.distanceToEnd + 1 < bestDistanceToEnd) {
          bestDistanceToEnd = node.distanceToEnd + 1;
          bestPathToEnd = [this, ...node.pathToEnd];
        }
      }
    }

    if (bestDistanceToEnd == Infinity) return false;
    this.distanceToEnd = bestDistanceToEnd;
    this.pathToEnd = bestPathToEnd;
    
    return true;
  }
}

let startingNode;
let nodes = [];

for (let row = 0; row < input.length; ++row) {
  if (!nodes[row]) nodes[row] = [];
  for (let col = 0; col < input[row].length; ++col) {
    let thisNode = new Node(row, col);
    if (input[row][col] == -14) startingNode = thisNode;
    nodes[row][col] = thisNode;
  }
}

for (let row of nodes) {
  for (let node of row) {
    node.buildConnections();
  }
}


let changed = true;
while (changed) {
  changed = false;
  for (let row of nodes) {
    for (let node of row) {
      let thisChanged = node.checkPathToEnd();
      if (!changed && thisChanged) changed = true;
    }
  }
}
// console.log(startingNode);

let path = [];
for (let row = 0; row < input.length; ++row) {
  if (!path[row]) path[row] = [];
  for (let col = 0; col < input[row].length; ++col) {
    path[row][col] = '.';
  }
}

for (let node of startingNode.pathToEnd) {
  path[node.row][node.col] = 'x'
  // console.log(path.map(row => row.join('')).join('\n'));
  // console.log('\n');
}

// so... this was 2 off of the right answer... I sorta just guessed in AOC until it worked...
console.log(startingNode.distanceToEnd);

