import fs from 'fs'
import path from 'path'

export function copyFile(dir: string, targetDir: string, regex?: RegExp) {
  // const outDir =
  const copy = (d: fs.Dirent[], parent: string) => {
    d.forEach((p) => {
      const isMath = regex ? regex.test(p.name) : true
      if (p.isFile() && isMath) {
        fs.copyFileSync(
          path.join(dir, parent, p.name),
          path.join(targetDir, parent, p.name)
        )
      } else if (p.isDirectory()) {
        const nextDir = path.join(dir, parent)
        copy(fs.readdirSync(nextDir, { withFileTypes: true }), dir + parent)
      }
    })
  }
  const nextDir = fs.readdirSync(dir, { withFileTypes: true })
  copy(nextDir, '')
}
