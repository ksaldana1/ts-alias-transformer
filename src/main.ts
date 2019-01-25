import path from 'path';
import ts from 'typescript';
import _ from 'lodash';
import fs from 'fs';
import { transformer } from './transformer';

export function main(modelsFilePath: string, outDirFilePath: string) {
  const program = ts.createProgram([modelsFilePath], {});
  const source = program.getSourceFile(modelsFilePath);
  const printer = ts.createPrinter();

  // Run source file through our transformer
  const result = ts.transform(source, [transformer(program)]);

  // Create our output folder
  if (!fs.existsSync(outDirFilePath)) {
    fs.mkdirSync(outDirFilePath);
  }

  // Write pretty printed transformed typescript to output directory
  fs.writeFileSync(
    path.resolve(outDirFilePath, './models.ts'),
    printer.printFile(_.first(result.transformed))
  );
}
