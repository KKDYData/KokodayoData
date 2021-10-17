import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'

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

const plugins = [
  clear({
    targets: ['dist'],
    watch: true,
  }),
  typescript({
    tsconfig: 'tsconfig.json',
  }),
]

export default {
  input: 'src/index.ts',
  output,
  plugins,
}
