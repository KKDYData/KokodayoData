import { factory } from 'typescript'

export const AxiosDeclartion = factory.createImportDeclaration(
  undefined,
  undefined,
  factory.createImportClause(
    false,
    undefined,
    factory.createNamedImports([
      factory.createImportSpecifier(undefined,
        factory.createIdentifier('request')
      )
    ]),
  ),
  factory.createStringLiteral('./instance')
)


export const ResponseDEclartion = factory.createImportDeclaration(
  undefined,
  undefined,
  factory.createImportClause(
    false,
    undefined,
    factory.createNamedImports([ factory.createImportSpecifier(
      undefined,
      factory.createIdentifier("JsonResponse")
    ) ])
  ),
  factory.createStringLiteral("./response")
)
