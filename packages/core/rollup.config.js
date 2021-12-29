import typescript from '@rollup/plugin-typescript'
import clear from 'rollup-plugin-clear'
import path from 'path'

const output = [
  {
    file: `dist/index.esm.js`,
    format: 'esm',
  },
  {
    file: `dist/index.cjs.js`,
    format: 'cjs',
  },
]
const external = ['vue', 'vue-router', 'ramda', 'mitt']

const plugins = [
  clear({
    targets: ['dist'],
    watch: true,
  }),
  typescript({
    tsconfig: path.resolve(__dirname, './tsconfig.json'),
  }),
  external,
]

export default {
  input: 'src/index.ts',
  output,
  plugins,
}
