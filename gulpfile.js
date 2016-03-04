var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var htmlreplace = require('gulp-html-replace');
var cssnano = require('gulp-cssnano');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
  javascript: 'source/js/**/*.js',
  jasmine: 'source/jasmine/**/*.js',
  images: 'source/img/**/*',
  css: 'source/css/**/*',
  html: 'source/index.html'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['public']);
});

gulp.task('jasmine', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.jasmine)
    .pipe(gulp.dest('public/jasmine'));
});

gulp.task('javascript', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.javascript)
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(gulp.dest('public/img'));
});

gulp.task('css', ['clean'], function() {
  return gulp.src(paths.css)
    .pipe(cssnano())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('public/css'));
});

// Rename all js and css refernces in html
gulp.task('html', ['clean'], function() {
  return gulp.src(paths.html)
    .pipe(htmlreplace({
      'css': 'css/styles.min.css',
      'js': 'js/all.min.js'
    }))
    .pipe(gulp.dest('public'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.javascript, ['javascript']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.html, ['html']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'javascript', 'jasmine', 'images', 'html', 'css']);
