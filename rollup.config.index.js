import typescript from 'rollup-plugin-typescript';
import replace from 'rollup-plugin-replace'
// import babel   from 'rollup-plugin-babel'
// import es2015 from 'babel-preset-es2015-rollup';
import uglify from 'rollup-plugin-uglify';
// import { minify } from 'uglify-es';
import copy from 'rollup-plugin-copy';

const pkg = require('./package.json');

const bundle = 'index';

console.log(`rollup bindling: '${bundle}'`);

export default {
    entry: `./src/main/${bundle}.ts`,
    plugins: [
        typescript({
            typescript: require('typescript')
        }),
        replace({
            '@VERSION@': pkg.version
        }),
        // babel({
        //     presets: [es2015]
        // }),
        uglify({}/*, minify*/),
        copy({
            "node_modules/incremental-dom/dist/incremental-dom-min.js": "dist/lib/incremental-dom-min.js",
            "node_modules/materialize-css/dist/css/materialize.min.css": "dist/lib/materialize/css/materialize.min.css",
            "node_modules/jquery/dist/jquery.min.js": "dist/lib/jquery.min.js",
            "node_modules/materialize-css/dist/js/materialize.min.js": "dist/lib/materialize/js/materialize.min.js",
            "node_modules/materialize-css/dist/fonts/": "dist/lib/materialize/fonts/",
            verbose: true
        })
    ],
    globals: {
        // 'jquery': 'jQuery'
    },
    external: Object.keys(pkg.dependencies),
    targets: [
        {
            dest: `./dist/${bundle}.js`,
            // format: 'iife',
            format: 'umd',
            moduleName: pkg.name,
            sourceMap: true
        // },
        // {
        //     dest: './dist/lib/' + pkg.name + '.js',
        //     format: 'es',
        //     sourceMap: true
        }
    ]
}
