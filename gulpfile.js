"use strict";
var commonJs = require('rollup-plugin-commonjs');
var childProcess = require('child_process');
var fs = require('fs');
var gulp = require('gulp');
var nodeResolve = require('rollup-plugin-node-resolve');
var rimraf = require('rimraf');
var rollup = require('rollup');
var runSequence = require('run-sequence');
var closure = require('google-closure-compiler-js');
var RollupRx = (function () {
    function RollupRx() {
    }
    RollupRx.prototype.resolveId = function (id, from) {
        if (id.startsWith('rxjs/')) {
            return __dirname + "/node_modules/rxjs-es/" + id.split('rxjs/').pop() + ".js";
        }
    };
    return RollupRx;
}());
function closureCompilerPlugin(options) {
    if (options === void 0) { options = {}; }
    return {
        transformBundle: function (bundle) {
            var compilation = Object.assign({}, options, {
                jsCode: options.jsCode ? options.jsCode.concat({ src: bundle }) : [{ src: bundle }]
            });
            console.log('Hold on! Closure compiler is optimizing. It can take some time...');
            var transformed = closure.compile(compilation);
            console.log('Closure compiler optimizing complete');
            return { code: transformed.compiledCode, map: transformed.sourceMap };
        }
    };
}
var build_1 = require("@angular/service-worker/build");
gulp.task('build', function (done) { return runSequence('task:clean', 'task:ngc', 'task:rollup', 'task:shell', [
    'task:static',
    'task:images',
], 'task:service-worker', 'task:worker-script', done); });
gulp.task('task:clean', function (done) {
    rimraf('tmp', function () { return rimraf('dist', function () { return done(); }); });
});
gulp.task('task:ngc', function () {
    childProcess.execSync('./node_modules/.bin/ngc -p tsconfig-esm.json');
});
gulp.task('task:rollup', function (done) {
    rollup
        .rollup({
        entry: 'tmp/ngc/main-static.js',
        plugins: [
            new RollupRx(),
            nodeResolve({ jsnext: true, main: true }),
            commonJs({
                include: 'node_modules/**',
                exclude: ['node_modules/rxjs/**'],
                namedExports: {
                    'node_modules/angular2-universal/browser.js': ['UniversalModule', 'prebootComplete', 'platformUniversalDynamic'],
                }
            }),
            closureCompilerPlugin({ compilationLevel: 'SIMPLE' }),
        ],
    })
        .then(function (bundle) { return bundle.write({
        format: 'iife',
        dest: 'tmp/rollup/app.js',
    }); })
        .then(function () { return done(); }, function (err) { return console.error('output error', err); });
});
gulp.task('task:uglifyjs', function () {
    fs.mkdirSync('tmp/uglifyjs');
    childProcess.execSync('node_modules/.bin/uglifyjs -m --screw-ie8 tmp/rollup/app.js -o tmp/uglifyjs/app.min.js');
});
gulp.task('task:worker-script', function () { return gulp
    .src([
    'node_modules/@angular/service-worker/bundles/worker-basic.js',
])
    .pipe(gulp.dest('dist')); });
gulp.task('task:static', function () { return gulp
    .src([
    'manifest.webmanifest',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/@angular/material/core/theming/prebuilt/indigo-pink.css',
    'tmp/app-shell/index.html',
    'tmp/rollup/app.js',
])
    .pipe(gulp.dest('dist')); });
gulp.task('task:images', function () { return gulp
    .src([
    'images/**/*.*',
])
    .pipe(gulp.dest('dist/images')); });
gulp.task('task:shell', function () {
    childProcess.execSync('node ./main-universal-entry.js');
});
gulp.task('task:service-worker', function () { return gulp
    .src('ngsw-manifest.json')
    .pipe(build_1.gulpAddStaticFiles(gulp.src([
    'dist/**/*.*'
]), { manifestKey: 'static' }))
    .pipe(gulp.dest('dist')); });
