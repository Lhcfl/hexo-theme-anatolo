import resolve from '@rollup/plugin-node-resolve';
import { resolve as pathResolve } from 'node:path';
import { defineConfig } from 'rollup';
import swc from 'unplugin-swc';

export default defineConfig([
  // browser-friendly UMD build
  {
    input: 'src/main.ts',
    output: {
      name: 'main.js',
      file: 'source/js_complied/bundle.js',
      // format: 'umd',
      format: 'umd',
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      swc.rollup({
        minify: true,
        jsc: {
          baseUrl: pathResolve('./'),
          paths: {
            '@/*': ['./src/*'],
          },
        },
      }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  // {
  //   input: 'src/main.js',
  //   external: ['ms'],
  //   output: [
  //     { file: pkg.main, format: 'cjs' },
  //     { file: pkg.module, format: 'es' },
  //   ],
  // },
]);
