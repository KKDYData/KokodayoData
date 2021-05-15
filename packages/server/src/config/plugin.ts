import { EggPlugin } from 'egg'
export default {
  static: false, // default is true
} as EggPlugin

export const cors = {
  enable: true,

  package: 'egg-cors',
}
