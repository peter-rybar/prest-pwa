import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
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
        resolve(),
        commonjs(),
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
            "node_modules/leaflet/dist/leaflet.css": "dist/lib/leaflet/leaflet.css",
            "node_modules/leaflet/dist/leaflet.js": "dist/lib/leaflet/leaflet.js",
            "node_modules/leaflet/dist/images/": "dist/lib/leaflet/images",
            "node_modules/leaflet-control-geocoder/dist/Control.Geocoder.css": "dist/lib/leaflet-control-geocoder/Control.Geocoder.css",
            "node_modules/leaflet-control-geocoder/dist/Control.Geocoder.js": "dist/lib/leaflet-control-geocoder/Control.Geocoder.js",
            "node_modules/leaflet-control-geocoder/dist/images/": "dist/lib/leaflet-control-geocoder/images",
            "node_modules/storejs/dist/store.min.js": "dist/lib/store.js",
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
