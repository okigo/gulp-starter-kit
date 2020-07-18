const {
  src, dest, watch, parallel, series,
} = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');

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

function runWatch(cb) {
  watch('src/js/*.js', series(compileJS));
  watch('src/scss/*.scss', series(compileCSS));
  watch('dist/*.html').on('change', browserSync.reload);
  cb();
}

exports.sync = runSync;
exports.css = compileCSS;
exports.js = compileJS;
exports.watch = runWatch;

exports.default = series(runSync, parallel(compileCSS, compileJS), runWatch);
