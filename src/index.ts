import path from 'path';
import ts from 'typescript';
import _ from 'lodash';
import fs from 'fs';
import { transformer } from './transformer';

const filePath = path.resolve(_.first(process.argv.slice(2)));

const program = ts.createProgram([filePath], {});
const source = program.getSourceFile(filePath);
const printer = ts.createPrinter();

// Run source file through our transformer
const result = ts.transform(source, [transformer(program)]);

// Create our output folder
const outputDir = path.resolve(__dirname, '../generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write pretty printed transformed typescript to output directory
fs.writeFileSync(
  path.resolve(__dirname, '../generated/models.ts'),
  printer.printFile(_.first(result.transformed))
);
