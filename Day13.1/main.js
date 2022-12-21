import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n\r\n').map(row => row.split('\r\n'));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n\r\n').map(row => row.split('\r\n'));

console.log(input);

const OUT_OF_ORDER = -1;
const NO_CONCLUSION = 0;
const IN_ORDER = 1;

const verboseLogging = true;

class List {
  constructor(input) {
    this.elements = [];
  }

  addElements(input) {
    this.elements = [];
    let buffer = '';
    let idx = 0;
    while (idx < input.length) {
      const char = input[idx];
      switch (char) {
        case ']':
          if (buffer.length) {
            this.elements.push(new Integer(buffer));
          }
          return idx + 1;
        case ',':
          if (buffer.length) {
            this.elements.push(new Integer(buffer));
            idx += buffer.length;
            buffer = '';
          } else {
            idx++;
          }
          break;
        case '[':
          const newList = new List();
          const skipCount = newList.addElements(input.slice(idx + 1)) + 1;
          idx += skipCount;
          this.elements.push(newList);
          break;
        default:
          if (!isNaN(parseInt(char))) {
            buffer += char;
          } else {
            if (verboseLogging) {
              console.log('...');
            }
          }
          idx++;
          break;
      }
    }
  }

  isCorrectOrder(otherElement) {
    if (verboseLogging) {
      console.log(`compare ${this.print()} with ${otherElement.print()}`);
    }
    if (otherElement instanceof Integer) {
      return this.isCorrectOrder(otherElement.asList());
    } else {
      // compare element by element
      let idx = 0;
      while (idx < this.elements.length) {
        // console.log(`compare ${this.elements[idx].print()} with ${otherElement.elements?.[idx]?.print?.() ?? ''}`)
        if (otherElement.elements[idx] == undefined) {
          // other list ran out of elements
          if (verboseLogging) {
            console.log(`other element ran out of items first, not in order`);
          }
          return OUT_OF_ORDER;
        }

        // both integers and equal (L == R)
        if (this.elements[idx] instanceof Integer && otherElement.elements[idx] instanceof Integer && this.elements[idx].value == otherElement.elements[idx].value) {
          if (verboseLogging) {
            console.log(`element ${this.elements[idx].print()} is equal to ${otherElement.elements[idx].print()}, continuing`);
          }
          idx++;
          continue;
        }

        // both integers and correct (L < R)
        if (this.elements[idx] instanceof Integer && otherElement.elements[idx] instanceof Integer && this.elements[idx].value < otherElement.elements[idx].value) {
          if (verboseLogging) {
            console.log(`element ${this.elements[idx].print()} is less than ${otherElement.elements[idx].print()}, in order`);
          }
          return IN_ORDER;
        }

        // both integers and incorrect (L > R)
        if (this.elements[idx] instanceof Integer && otherElement.elements[idx] instanceof Integer && this.elements[idx].value > otherElement.elements[idx].value) {
          if (verboseLogging) {
            console.log(`element ${this.elements[idx].print()} is not less than ${otherElement.elements[idx].print()}, not in order`);
          }
          return OUT_OF_ORDER;
        }

        // at least one element is a list, recurse to the next level of compare
        let thisCompareResult = this.elements[idx].isCorrectOrder(otherElement.elements[idx]);
        if (thisCompareResult == OUT_OF_ORDER || thisCompareResult == IN_ORDER) {
          return thisCompareResult;
        }
        idx++;
      }

      // other list still has elements left, so this list finished first
      if (this.elements.length < otherElement.elements.length) {
        if (verboseLogging) {
          console.log(`reached end of list, left ran out of items first... in order`);
        }
        return IN_ORDER;
      }

      // both lists ran out of items at the same time, no decision
      if (verboseLogging) {
        console.log(`all elements compared, no decision made yet`);
      }
      return NO_CONCLUSION;
    }
  }

  print() {
    return `[${this.elements.map(el => el.print()).join(',')}]`;
  }
}

class Integer {
  constructor(input) {
    this.value = parseInt(input);
  }

  asList() {
    let newList = new List();
    newList.elements = [this];
    return newList;
  }

  isCorrectOrder(otherElement) {
    if (verboseLogging) {
      console.log(`compare ${this.print()} with ${otherElement.print()}`);
    }
    if (otherElement instanceof List) {
      return this.asList().isCorrectOrder(otherElement);
    } else {
      if (this.value < otherElement.value) {
        if (verboseLogging) {
          console.log(`${this.value} is less than ${otherElement.value}, correct order`);
        }
        return IN_ORDER;
      } else {
        if (verboseLogging) {
          console.log(`${this.value} is not less than ${otherElement.value}, not correct order`);
        }
        return OUT_OF_ORDER;
      }
    }
  }

  print() {
    return this.value.toString();
  }
}

class Pair {
  constructor(input) {
    this.packet1 = new List();
    this.packet1.addElements(input[0].slice(1));
    this.packet2 = new List();
    this.packet2.addElements(input[1].slice(1));
  }

  compare() {
    const isInOrder = this.packet1.isCorrectOrder(this.packet2);
    if (verboseLogging) {
      console.log(isInOrder == OUT_OF_ORDER ? 'out of order' : isInOrder == IN_ORDER ? 'In Order' : 'uhh... I guess in order');
    }
    console.log(isInOrder == IN_ORDER || isInOrder == NO_CONCLUSION ? 'true' : 'false');
    return isInOrder == IN_ORDER || isInOrder == NO_CONCLUSION;
  }
}

let pairs = [];
for (let inputPair of input) {
  pairs.push(new Pair(inputPair));
}

let pairIndex = 1;
let correctIndexSum = 0;
for (let pair of pairs) {
  let thisCompareResult = pair.compare();
  if (thisCompareResult == IN_ORDER) correctIndexSum += pairIndex;
  pairIndex++;
}

console.log(correctIndexSum);
