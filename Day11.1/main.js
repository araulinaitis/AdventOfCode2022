import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n\r\n').map(monkey => monkey.split('\r\n'));
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n\r\n').map(monkey => monkey.split('\r\n'));

// console.log(input);

const monkeyNumRegex = /Monkey ([0-9]+)/;
const operationRegex = /new = old ([\+\*]) ([0-9]*(old)?)/;

let monkeys = {}
for (let monkey of input) {
  const thisMonkey = { inspections: 0 };
  const monkeyNum = monkey[0].match(monkeyNumRegex)[1];
  thisMonkey.index = monkeyNum;
  monkeys[monkeyNum] = thisMonkey;

  const worryStr = monkey[1].trim().split('Starting items: ').slice(1)[0];
  thisMonkey.items = worryStr.split(', ').map(val => parseInt(val));

  const operationStr = monkey[2].match(operationRegex);
  thisMonkey.operation = {};
  thisMonkey.operation.operation = operationStr[1];
  thisMonkey.operation.second = operationStr[2];

  const testStr = monkey[3].trim().split('Test: divisible by ').slice(1)[0];
  thisMonkey.test = parseInt(testStr);

  const trueStr = monkey[4].split('throw to monkey ')[1];
  thisMonkey.true = trueStr;

  const falseStr = monkey[5].split('throw to monkey ')[1];
  thisMonkey.false = falseStr;
}

for (let round = 0; round < 20; ++round) {
  for (let monkeyIdx = 0; monkeyIdx < Object.values(monkeys).length; ++monkeyIdx) {
    const monkey = monkeys[monkeyIdx];
    
    while (monkey.items.length) {
      monkey.inspections++;
      const old = monkey.items[0];
      const second = monkey.operation.second == 'old' ? old : parseInt(monkey.operation.second);
      let newWorry;
      switch (monkey.operation.operation) {
        case '*':
          newWorry = old * second;
          break;
        case '+':
          newWorry = old + second;
          break;
      }

      newWorry = Math.floor(newWorry / 3);

      if (newWorry % monkey.test == 0) {
        monkeys[monkey.true].items.push(newWorry);
      } else {
        monkeys[monkey.false].items.push(newWorry);
      }
      monkey.items = monkey.items.slice(1);
    }
  }
}
console.log(Object.values(monkeys).map(monkey => monkey.inspections));