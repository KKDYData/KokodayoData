import yaml from 'js-yaml'
import path from 'path'
import fs from 'fs'

const customConfig = yaml.load(
  fs.readFileSync(
    path.resolve(__dirname, `./config.${process.env.NODE_ENV}.yml`)
  )
)

export const orm = customConfig.orm
