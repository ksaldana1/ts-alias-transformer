import ts from 'typescript';
import path from 'path';
import { transformer } from '../src/transformer';

const filePaths = ['basic_example', 'basic_example_2', 'from_package'];

describe('ts-alias-transformer', () => {
  const program = ts.createProgram(
    filePaths.map(f => path.resolve(__dirname, './models', `${f}.ts`)),
    {}
  );
  const printer = ts.createPrinter();

  filePaths.forEach(fp => {
    it(`${fp}`, () => {
      const filePath = path.resolve(__dirname, './models', `${fp}.ts`);
      const source = program.getSourceFile(filePath);
      const result = ts.transform(source, [transformer(program)]);
      expect(printer.printFile(result.transformed[0])).toMatchSnapshot();
    });
  });
});
