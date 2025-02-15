#!/usr/bin/env node
const { copyFile, cp, readdir } = require('fs/promises');
const { join } = require('path');
const { rimraf } = require('rimraf');

const NON_COPYING_BASE_FILES = [ 'package.json' ];

async function main() {
  const distDir = join(__dirname, '..', 'dist');
  const testRoot = join(__dirname, '..', 'test');
  const testDirs = (await readdir(testRoot, { withFileTypes: true }))
    .filter((dir) => dir.isDirectory() && dir.name !== 'base')
    .map((dir) => dir.name);

  const testBaseDir = join(testRoot, 'base');
  const baseFiles = (await readdir(testBaseDir, { withFileTypes: true }))
    .filter((file) => file.isFile())
    .filter((file) => !NON_COPYING_BASE_FILES.includes(file.name))
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
    promises.push((async () => {
      const testDistDir = join(testRoot, testDir, 'dist');
      await rimraf(testDistDir);
      await cp(distDir, testDistDir, { recursive: true });
    })());
  }

  await Promise.all(promises);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(-1);
  });
