const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  JSONSchemaInput,
  FetchingJSONSchemaStore
} = require('quicktype-core')

const fs = require('fs')

async function quicktypeJSONSchema(targetLanguage, typeName, jsonSchemaString) {
  const inputData = new InputData()

  await inputData.addSource(
    'json',
    {
      name: typeName,
      samples: [jsonSchemaString]
    },
    () => jsonInputForTargetLanguage(targetLanguage)
  )

  const res = await quicktype({
    inputData,
    lang: targetLanguage,
    checkProvenance: true,
    combineClasses: true,
    inferEnums: true,
    leadingComments: [
      'This file is created by quicktype-core',
      'Do not modify this file!!!!!!!!!',
      '使用 quicktype 生成的类型，不要乱改！'
    ],

    rendererOptions: {
      'just-types': true
    }
  })

  return res
}

const OUTPUT_DIR = './lib/'

const transplie = (typeName, jsonSchemaString, fileName) =>
  quicktypeJSONSchema('ts', 'I' + typeName, jsonSchemaString).then(res => {
    fs.writeFileSync(OUTPUT_DIR + fileName, res.lines.join('\n'))
  })

module.exports = {
  transplie
}
