import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { terser } from "rollup-plugin-terser"
import image from 'rollup-plugin-image'

import pkg from './package.json';

export default [
  {
    input: 'index.js',
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'design-het-widget'
    },
    plugins: [
      resolve(),
      commonjs(),
      image(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
      })
    ]
  },
  {
    input: 'index.js',
    output: {
      file: pkg.main.replace(/\.js$/, '.min.js'),
      format: 'umd',
      name: 'design-het-widget'
    },
    plugins: [
      resolve(),
      commonjs(),
      image(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
      }),
      terser()
    ]
  }
]
