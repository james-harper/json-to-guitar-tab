'use strict';

const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const gulp = require('gulp');
const babel = require('gulp-babel');

let compiledDirectory = 'js/compiled';

let jsFiles = [
  'js/constants.js',
  'js/utils/bar.js',
  'js/utils/chord.js',
  'js/utils/note.js',
  'js/utils/pattern.js',
  'js/chord-map.js',
  'js/example-progressions.js',
  'js/components/tab/bar.js',
  'js/components/tab/tab.js',
  'js/app.js',
];

gulp.task('scripts', function() {
  gulp.src('js/vendor/*.js')
  .pipe(concat('vendor.all.js'))
  .pipe(gulp.dest(compiledDirectory));

  return gulp.src(jsFiles)
  .pipe(concat('all.js'))
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(gulp.dest(compiledDirectory))
  .pipe(rename('all.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest(compiledDirectory));;
});