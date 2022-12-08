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

const totalSpace = 70000000;
const sizeNeeded = 30000000;
const currentSize = fileSystem.size;
const currentUnused = totalSpace - currentSize;
const targetDelta = sizeNeeded - currentUnused;

const dirToDelete = directories.filter(dir => dir.size > targetDelta).sort((a, b) => {
  if (a.size < b.size) return -1;
  if (a.size > b.size) return 1;
  return 0;
})[0];

console.log({dirToDelete});

function addSize(folder, size) {
  folder.size += size;
  if (folder['..']) addSize(folder['..'], size);
}
