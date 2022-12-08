import * as fs from 'fs/promises';

// const input = (await fs.readFile('./data/test.csv', { encoding: 'UTF-8' })).split('\r\n');
const input = (await fs.readFile('./data/data.csv', { encoding: 'UTF-8' })).split('\r\n');

// console.log(input);

const fileSystem = {size: 0, contents: {folders: {}, files: {}}, name: '/'};
let directories = [fileSystem];

let currentFolder = fileSystem;
let lastCommand = 'cd';

const commands = {
  cd: dir => {
    if (dir == '/') {
      currentFolder = fileSystem;
    } else if (dir == '..') {
      currentFolder = currentFolder['..'];
    } else {
      currentFolder = currentFolder.contents.folders[dir];
    }
  },
  ls: () => {},
};

for (let row of input) {
  const entries = row.split(' ');
  if (entries[0] == '$') {
    commands[entries[1]](entries[2]);
    lastCommand = entries[1];
  } else {
    if (lastCommand == 'ls') {
      if (entries[0] == 'dir') {
        const [_, folderName] = entries;
        const newFolder = { '..': currentFolder, size: 0, contents: {folders: {}, files: {}}, name: folderName}
        currentFolder.contents.folders[folderName] = newFolder;
        directories.push(newFolder);
      } else {
        const [size, fileName] = entries;
        currentFolder.contents.files[fileName] = parseInt(size);
        addSize(currentFolder, parseInt(size));
      }
    }
  }
}

function addSize(folder, size) {
  folder.size += size;
  if (folder['..']) addSize(folder['..'], size);
}

const sub10kSize = directories.map((info) => info.size).filter(val => val <= 100000).reduce((prev, cur) => prev + cur);

console.log(sub10kSize);