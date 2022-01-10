import ts from 'typescript'
import { factory } from 'typescript'
import fs from 'fs'
import prettier from 'prettier'
import { AxiosDeclartion, ResponseDEclartion } from './decration'

enum ParamName {
  params = 'params',
  data = 'data',
  none = '',
}

/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 * @param identifiers top level identifiers available
 */
export function extractApi(file: string): string {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  let program = ts.createProgram([file], { allowJs: true })
  const sourceFile = program.getSourceFile(file)

  // To print the AST, we'll use TypeScript's printer
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

  const importNodeList: (ts.ImportDeclaration | ts.InterfaceDeclaration)[] = [
    AxiosDeclartion,
    ResponseDEclartion,
  ]
  const fnList: ts.FunctionDeclaration[] = []

  // Loop through the root AST nodes of the file
  ts.forEachChild(sourceFile, (node) => {
    let name = ''

    if (ts.isImportDeclaration(node)) {
      importNodeList.push(
        factory.createImportDeclaration(
          undefined,
          undefined,
          node.importClause,
          factory.createStringLiteral((node.moduleSpecifier as any).text)
        )
      )
      console.log('import node', node.moduleSpecifier)
    } else if (ts.isInterfaceDeclaration(node)) {
      name = node.name.text
      if (name.startsWith('T')) {
        importNodeList.push(node)
        return
      }

      const apiName = factory.createIdentifier(name)
      const param = factory.createIdentifier('params')
      const data = factory.createIdentifier('data')
      const response = factory.createIdentifier('response')
      const path = factory.createIdentifier('path')
      const request = factory.createIdentifier('request')
      let method: ts.Identifier
      let pathValue: ts.StringLiteral
      let returnStatement: [ts.TypeNode] = [
        factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword),
      ]
      let paramType: ts.TypeNode
      let isParam = true
      let paramName = ParamName.none as ParamName

      node.forEachChild((node) => {
        if (ts.isPropertySignature(node)) {
          if (checkPropName(node, 'method') && checkString(node)) {
            method = factory.createIdentifier(node.type.literal.text)
          } else if (checkPropName(node, 'path') && checkString(node)) {
            pathValue = factory.createStringLiteral(node.type.literal.text)
            console.log('path is ', node.type.literal.text)
          } else if (checkPropName(node, ParamName.params)) {
            paramName = ParamName.params
            paramType = node.type
          } else if (checkPropName(node, ParamName.data)) {
            isParam = false
            paramName = ParamName.data
            paramType = node.type
          } else if (checkPropName(node, 'response')) {
            console.log('response')

            if (ts.isTypeLiteralNode(node.type)) {
              returnStatement = [node.type]
            } else if (ts.isTypeNode(node.type)) {
              returnStatement = [node.type]
            }
          }
        }
      })

      const fn = factory.createFunctionDeclaration(
        undefined,
        [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
        undefined,
        apiName,
        undefined,
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            paramName ? factory.createIdentifier(paramName) : undefined,
            undefined,
            paramType,
            undefined
          ),
        ],
        undefined,

        factory.createBlock([
          factory.createReturnStatement(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(request, method),
              [
                factory.createTypeReferenceNode(
                  factory.createIdentifier('JsonResponse'),
                  returnStatement
                ),
              ],
              [
                pathValue,

                paramName
                  ? isParam
                    ? factory.createObjectLiteralExpression(
                        [
                          factory.createShorthandPropertyAssignment(
                            param,
                            undefined
                          ),
                        ],
                        false
                      )
                    : data
                  : undefined,
              ].filter((s) => s)
            )
          ),
        ])
      )
      fnList.push(fn)
    }
  })

  const resultFile = ts.createSourceFile(
    'someFileName.ts',
    '',
    ts.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    ts.ScriptKind.TS
  )
  const result = [...importNodeList, '\n\n', ...fnList].reduce((res, cur) => {
    const parsered =
      typeof cur === 'string'
        ? cur
        : printer.printNode(ts.EmitHint.Unspecified, cur, resultFile)
    return res + parsered
  }, '') as string

  const formatedCode = prettier.format(result, {
    parser: 'typescript',
    bracketSpacing: true,
    semi: false,
    singleQuote: true,
  })
  console.log(formatedCode)

  return formatedCode
}

function checkPropName(
  node: ts.PropertySignature,
  name: string
): node is ts.PropertySignature & { name: ts.Identifier } {
  return ts.isIdentifier(node.name) && node.name.text === name
}

function checkString(
  node: ts.PropertySignature
): node is ts.PropertySignature & {
  type: ts.LiteralTypeNode & { literal: ts.StringLiteral }
} {
  return (
    ts.isLiteralTypeNode(node.type) && ts.isStringLiteral(node.type.literal)
  )
}
