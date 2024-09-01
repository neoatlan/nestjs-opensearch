#!/usr/bin/env node
const { copyFile, readdir } = require('fs/promises');
const { join } = require('path');

async function main() {
  const testRoot = join(__dirname, '..', 'test');
  const testDirs = (await readdir(testRoot, { withFileTypes: true }))
    .filter((dir) => dir.isDirectory() && dir.name !== 'base')
    .map((dir) => dir.name);

  const testBaseDir = join(testRoot, 'base');
  const baseFiles = (await readdir(testBaseDir, { withFileTypes: true }))
    .filter((file) => file.isFile())
    .filter((file) => file.name !== 'package.json')
    .map((file) => file.name);

  const promises = [];
  for (const testDir of testDirs) {
    for (const baseFile of baseFiles) {
      promises.push(
        copyFile(
          join(testBaseDir, baseFile),
          join(testRoot, testDir, baseFile),
        ),
      );
    }
  }

  await Promise.all(promises);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
