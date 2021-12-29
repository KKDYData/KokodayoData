import { factory } from 'typescript'

export const AxiosDeclartion = factory.createImportDeclaration(
  undefined,
  undefined,
  factory.createImportClause(
    false,
    undefined,
    factory.createNamedImports([
      factory.createImportSpecifier(
        false,
        undefined,
        factory.createIdentifier('request')
      ),
    ])
  ),
  factory.createStringLiteral('./instance'),
  undefined
)

export const ResponseDEclartion = factory.createImportDeclaration(
  undefined,
  undefined,
  factory.createImportClause(
    false,
    undefined,
    factory.createNamedImports([
      factory.createImportSpecifier(
        false,
        undefined,
        factory.createIdentifier('JsonResponse')
      ),
    ])
  ),
  factory.createStringLiteral('./response'),
  undefined
)
