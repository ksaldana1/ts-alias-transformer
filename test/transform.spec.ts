import ts from 'typescript';
import path from 'path';
import { transformer } from '../src/transformer';

describe('ts-alias-transformer', () => {
  it('At least works with my example', () => {
    const filePath = path.resolve(__dirname, './models', 'basic_example.ts');
    const program = ts.createProgram([filePath], {});
    const source = program.getSourceFile(filePath);
    const printer = ts.createPrinter();

    const result = ts.transform(source, [transformer(program)]);
    expect(printer.printFile(result.transformed[0])).toMatchSnapshot();
  });
  it('works with a relatively complicated node_module type import', () => {
    const filePath = path.resolve(__dirname, './models', 'from_package.ts');
    const program = ts.createProgram([filePath], {});
    const source = program.getSourceFile(filePath);
    const printer = ts.createPrinter();

    const result = ts.transform(source, [transformer(program)]);
    expect(printer.printFile(result.transformed[0])).toMatchSnapshot();
  });
});
