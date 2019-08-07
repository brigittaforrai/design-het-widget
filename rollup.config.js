import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import svgLoader from 'postcss-inline-svg'
import pkg from './package.json';

const dev = {
  input: 'index.js',
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'design-het-widget'
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      inject: false,
      minimize: true,
      plugins: [svgLoader()]
    }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
    })
  ]
}

const min = Object.assign(dev);

min.output = Object.assign(min.output, { file: pkg.main.replace(/\.js$/,'.min.js')})
min.plugins = [...min.plugins, terser()]


export default [dev,min]
