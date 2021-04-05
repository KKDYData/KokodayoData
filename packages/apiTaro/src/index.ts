import fs from 'fs'
import path from 'path'
import { extractApi } from '@kkdy/build'
import _ from 'lodash'
import rimraf from 'rimraf'

const outDir = path.resolve(__dirname, '../lib')
const sourceDir = path.resolve(__dirname, '../../server/src/interface')

const dirs = fs.readdirSync(sourceDir, { withFileTypes: true })
const exportList: string[] = []

const convert = (d: fs.Dirent[], parent: string) => {
  d.forEach((p) => {
    if (p.isFile()) {
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
      .map((name) => `export * as Api${_.upperFirst(name)} from './${name}'`)
      .join('\n') + `\nexport * from './instance'`
  )

  const responseType = 'response.ts'
  const request = 'instance.ts'
  fs.copyFileSync(
    path.join(__dirname, './', responseType),
    path.join(outDir, responseType)
  )
  fs.copyFileSync(
    path.join(__dirname, './', request),
    path.join(outDir, request)
  )
})
