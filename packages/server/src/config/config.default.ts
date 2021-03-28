import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import yaml from 'js-yaml'
import path from 'path'
import fs from 'fs'

const customConfig = yaml.load(
  fs.readFileSync(
    path.resolve(__dirname, `./config.${process.env.NODE_ENV}.yml`)
  )
)

export type DefaultConfig = PowerPartial<EggAppConfig>

console.log('config:', customConfig)

export default (appInfo: EggAppInfo) => {
  const config = {} as DefaultConfig

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}'

  // add your config here
  config.middleware = []

  config.midwayFeature = {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  }
  config.orm = customConfig.orm

  return config
}
