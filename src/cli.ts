#!/usr/bin/env node
import program from 'commander';

import { main } from './main';

program
  .version('0.0.1')
  .description('resolve type aliases to their lowest structure')
  .option('-m, --models [path]', 'the path to your models')
  .option('-o, --outDir [path]', 'desired output directory');

program.parse(process.argv);

main(program.models, program.outDir);
