import yaml from 'js-yaml'
import path from 'path'
import fs from 'fs'
import { TAds } from '../interface/ads'

export const ads = yaml.load(
  fs.readFileSync(path.resolve(__dirname, './ads.yml'), 'utf-8')
) as TAds[]

export const orm = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'odex',
  password: '123456',
  database: 'kkdy_test',
  synchronize: true,
  logging: false,
}

export const redis = {
  port: 6379,
  host: '0.0.0.0',
  family: 4,
  keyPrefix: 'kkdy:',
  db: 2,
}
