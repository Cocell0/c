#!/usr/bin/env node

import { Command } from 'commander';
import { readFile } from 'fs/promises';
const pkg = JSON.parse(await readFile(new URL('./package.json', import.meta.url)));
const version = pkg.version;

import commandUpload from './commands/upload.js';

const program = new Command('C̀');

program
  .version(version)
  .description('a CLI program to manage C̀')
  .addCommand(commandUpload)

if (!process.argv.slice(2).length) {
  console.log(`
 ██████╗
██╔════╝
██║     
██║     
╚██████╗
 ╚═════╝
    `);
  program.outputHelp();
} else {
  program.parse(process.argv);
}
