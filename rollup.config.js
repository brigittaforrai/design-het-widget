import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
// import { terser } from "rollup-plugin-terser"
// import {LitElement} from 'lit-element'

import pkg from './package.json';

export default [
  {
    input: 'index.js',
    output: {
      file: pkg.main,
      format: 'esm',
      name: 'design-het-widget'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
      })
    ]
  }
  // {
  //   input: 'index.js',
  //   output: {
  //     file: pkg.main.replace(/\.js$/, '.min.js'),
  //     format: 'umd',
  //     name: 'design-het-widget'
  //   },
  //   plugins: [
  //     resolve(),
  //     commonjs(),
  //     babel({
  //       babelrc: false,
  //       exclude: 'node_modules/**',
  //     }),
  //     terser()
  //   ]
  // }
]
