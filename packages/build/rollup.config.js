import typescript from 'rollup-plugin-typescript2'
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
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declarationDir: 'dist',
        },
        include: ['src'],
      },
    }),
  ],
}
