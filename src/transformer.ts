import ts from 'typescript';
import _ from 'lodash';

export function transformer<T extends ts.Node>(
  program: ts.Program
): ts.TransformerFactory<T> {
  const checker = program.getTypeChecker();

  return context => {
    const visit: ts.Visitor = node => {
      node = ts.visitEachChild(node, visit, context);
      /*
        Convert type references to type literals
  
          interface IUser {
            username: string
          }
          type User = IUser <--- IUser is a type reference
          interface Context {
            user: User <--- User is a type reference
          }
  
        In both cases we want to convert the type reference to
        it's primitive literals. We want:
  
          interface IUser {
            username: string
          }
          type User = {
            username: string
          }
          interface Context {
            user: {
              username: string
            }
          }
      */
      if (ts.isTypeReferenceNode(node)) {
        const symbol = checker.getSymbolAtLocation(node.typeName);
        const type = checker.getDeclaredTypeOfSymbol(symbol);
        const declarations = _.flatMap(checker.getPropertiesOfType(type), property => {
          /*
            Type references declarations may themselves have type references, so we need
            to resolve those literals as well 
          */
          return _.map(property.declarations, visit);
        });
        return ts.createTypeLiteralNode(declarations.filter(ts.isTypeElement));
      }

      /* 
        Convert type alias to interface declaration
          interface IUser {
            username: string
          }
          type User = IUser
      
        We want to remove all type aliases
          interface IUser {
            username: string
          }
  
          interface User {
            username: string  <-- Also need to resolve IUser
          }
      
      */

      if (ts.isTypeAliasDeclaration(node)) {
        const symbol = checker.getSymbolAtLocation(node.name);
        const type = checker.getDeclaredTypeOfSymbol(symbol);
        const declarations = _.flatMap(checker.getPropertiesOfType(type), property => {
          // Resolve type alias to it's literals
          return _.map(property.declarations, visit);
        });

        // Create interface with fully resolved types
        return ts.createInterfaceDeclaration(
          [],
          [ts.createToken(ts.SyntaxKind.ExportKeyword)],
          node.name.getText(),
          [],
          [],
          declarations.filter(ts.isTypeElement)
        );
      }
      // Remove all export declarations
      if (ts.isImportDeclaration(node)) {
        return null;
      }

      return node;
    };

    return node => ts.visitNode(node, visit);
  };
}
