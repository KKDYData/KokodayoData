import typescript from '@rollup/plugin-typescript'
import clear from 'rollup-plugin-clear'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: `dist/index.esm.js`,
      format: 'esm',
    },
    {
      file: `dist/index.cjs.js`,
      format: 'cjs',
    },
  ],
  plugins: [
    clear({
      targets: ['dist'],
      watch: true,
    }),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
}
