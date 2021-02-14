const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  JSONSchemaInput,
  FetchingJSONSchemaStore
} = require('quicktype-core')

const fs = require('fs')

async function quicktypeJSON(targetLanguage, typeName, jsonString) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage)

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString]
  })

  const inputData = new InputData()
  inputData.addInput(jsonInput)

  return await quicktype({
    inputData,
    lang: targetLanguage
  })
}

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

    rendererOptions: {
      // converters: 'all-objects',
      // 'acronym-style': 'pascal',
      // 'nice-property-names': 'true',
      'just-types': true
    }
  })

  return res
}

const OUTPUT_DIR = './src/'

const transplie = (typeName, jsonSchemaString, fileName) =>
  quicktypeJSONSchema('ts', typeName, jsonSchemaString).then(res => {
    fs.writeFileSync(OUTPUT_DIR + fileName, res.lines.join('\n'))
  })

module.exports = {
  transplie
}
