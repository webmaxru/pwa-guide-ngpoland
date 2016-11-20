const commonJs = require('rollup-plugin-commonjs');
const childProcess = require('child_process');
const fs = require('fs');
const gulp = require('gulp');
const nodeResolve = require('rollup-plugin-node-resolve');
const rimraf = require('rimraf');
const rollup = require('rollup');
const runSequence = require('run-sequence');
const closure = require('google-closure-compiler-js');
const  connect = require('gulp-connect');

class RollupRx {
  resolveId(id, from){
    if(id.startsWith('rxjs/')){
      return `${__dirname}/node_modules/rxjs-es/${id.split('rxjs/').pop()}.js`;
    }
  }
}

function closureCompilerPlugin(options: any = {}){
  return {
    transformBundle(bundle){
      const compilation = Object.assign({}, options, {
        jsCode: options.jsCode ? options.jsCode.concat({ src: bundle }) : [{ src: bundle }]
      });
	  console.log('- Closure compiler is optimizing. It can take a minute or two...');
      const transformed = closure.compile(compilation);
	  return { code: transformed.compiledCode, map: transformed.sourceMap };
    }
  }
}

import {gulpGenerateManifest, gulpAddStaticFiles} from '@angular/service-worker/build';

gulp.task('build', done => runSequence(
  'task:clean',
  'task:ngc',
  'task:rollup',
  'task:shell',
  [
    'task:static',
    'task:assets',
  ],
  'task:service-worker',
  'task:worker-script',
  done
));

gulp.task('build-noshell', done => runSequence(
  'task:clean',
  'task:ngc',
  'task:rollup',
  'task:no-shell',
  [
    'task:static',
    'task:assets',
  ],
  'task:service-worker',
  'task:worker-script',
  done
));

gulp.task('task:clean', done => {
  console.log('- Cleaning tmp and dist folders...');
  rimraf('tmp', () => rimraf('dist', () => done()));
});

gulp.task('task:ngc', () => {
  console.log('- Compiling Angular app using settings from tsconfig-esm.json...');
  childProcess.execSync('./node_modules/.bin/ngc -p tsconfig-esm.json');
});

gulp.task('task:rollup', done => {
  console.log('- Rolling up using main-static.js as an entry...');
  rollup
    .rollup({
      entry: 'tmp/ngc/main-static.js',
      plugins: [
        new RollupRx(),
        nodeResolve({jsnext: true, main: true}),
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
    .then(bundle => bundle.write({
      format: 'iife',
      dest: 'tmp/rollup/app.js',
    }))
    .then(() => done(), err => console.error('output error', err));
});

gulp.task('task:worker-script', () => gulp
  .src([
    'node_modules/@angular/service-worker/bundles/worker-basic.js',
  ])
  .pipe(gulp.dest('dist'))
);

gulp.task('task:shell', () => {
  console.log('- Rendering app shell using main-universal-entry.js as an entry...');
  childProcess.execSync('node ./main-universal-entry.js');
});

gulp.task('task:static', () => gulp
  .src([
    'manifest.webmanifest',
    'node_modules/zone.js/dist/zone.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/@angular/material/core/theming/prebuilt/indigo-pink.css',
    'tmp/rollup/app.js',
    'tmp/app-shell/index.html',
    'push-sw.js'
  ])
  .pipe(gulp.dest('dist'))
);

gulp.task('task:no-shell', () => gulp
  .src([
    'index.html',
  ])
  .pipe(gulp.dest('dist'))
);

gulp.task('task:assets', () => gulp
  .src([
    'assets/**/*.*'
  ])
  .pipe(gulp.dest('dist/assets'))
);

gulp.task('task:service-worker', () => gulp
  .src('ngsw-manifest.json')
  .pipe(gulpAddStaticFiles(gulp.src([
    'dist/**/*.*'
  ]), {manifestKey: 'static'}))
  .pipe(gulp.dest('dist'))
);

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: false,
    port: 8080
  });
});

gulp.task('html', function () {
  gulp.src('./dist/*.*')
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./dist/*.*'], ['html']);
});

gulp.task('serve', ['connect', 'watch']);
