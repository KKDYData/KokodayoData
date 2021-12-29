import fs from 'fs'
import path from 'path'
import { extractApi, copyFile } from '@kkdy/build'
import _ from 'lodash'
import rimraf from 'rimraf'
export * from './utilsType'

const outDir = path.resolve(__dirname, '../lib')
const sourceDir = path.resolve(__dirname, '../../server/src/interface')

const dirs = fs.readdirSync(sourceDir, { withFileTypes: true })
const exportList: string[] = []

const UtilsTypeRegex = /Type\.ts$/

const convert = (d: fs.Dirent[], parent: string) => {
  d.forEach((p) => {
    if (p.isFile() && !UtilsTypeRegex.test(p.name)) {
      const result = extractApi(path.join(parent, p.name))
      fs.writeFileSync(path.join(outDir, p.name), result)

      if (p.name !== 'index.ts') {
        exportList.push(p.name.split('.').shift())
      }
    }
  })
}

rimraf(outDir, () => {
  fs.mkdirSync(outDir)
  convert(dirs, sourceDir)
  fs.writeFileSync(
    path.resolve(__dirname, '../lib/index.ts'),
    exportList
      .map((name) => `export * as ${_.upperFirst(name)} from './${name}'`)
      .join('\n') +
      `\nexport * from './instance'` +
      `\nexport * from './utilsType'`
  )

  const responseType = 'response.ts'
  const request = 'instance.ts'
  const utils = 'utils.ts'

  fs.copyFileSync(
    path.join(__dirname, './', responseType),
    path.join(outDir, responseType)
  )
  fs.copyFileSync(
    path.join(__dirname, './', request),
    path.join(outDir, request)
  )

  copyFile(path.join(sourceDir), outDir, UtilsTypeRegex)
})
