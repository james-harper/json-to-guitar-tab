'use strict';

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const minifyCSS = require('gulp-minify-css');
const gulp = require('gulp');
const babel = require('gulp-babel');

let compiledDirectory = type => 'assets/compiled/' + type;

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
  gulp.src('css/all.css')
  .pipe(minifyCSS())
  .pipe(gulp.dest(compiledDirectory('css')));

  gulp.src('js/vendor/*.js')
  .pipe(concat('vendor.all.js'))
  .pipe(uglify())
  .pipe(gulp.dest(compiledDirectory('js')));

  return gulp.src(jsFiles)
  .pipe(concat('all.min.js'))
  .pipe(babel({ presets: ['es2015'] }))
  .pipe(uglify())
  .pipe(gulp.dest(compiledDirectory('js')));;
});

gulp.task('watch', function() {
    gulp.watch('js/**/*.js', ['scripts']);
});
