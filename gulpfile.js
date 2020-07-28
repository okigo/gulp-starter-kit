const {
  src, dest, watch, parallel, series,
} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const pug = require('gulp-pug');

function runSync(cb) {
  browserSync.init({
    server: './dist',
    notify: false,
  });
  cb();
}

function compileCSS(cb) {
  return src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
    .on('end', () => {
      cb();
    });
}

function compileJS(cb) {
  return src('src/js/*.js')
    .pipe(babel())
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
    .on('end', () => {
      cb();
    });
}

function compileHTML(cb) {
  return src('src/pug/pages/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(dest('dist/'))
    .on('end', () => {
      cb();
    });
}

function runWatch(cb) {
  watch('src/js/*.js', series(compileJS));
  watch('src/scss/*.scss', series(compileCSS));
  watch('src/pug/**/*.pug', series(compileHTML));
  watch('dist/*.html').on('change', browserSync.reload);
  cb();
}

exports.sync = runSync;
exports.css = compileCSS;
exports.js = compileJS;
exports.html = compileHTML;
exports.watch = runWatch;

exports.default = series(runSync, parallel(compileCSS, compileJS), compileHTML, runWatch);
