/*jshint esversion: 6 */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

//compile sass
gulp.task('sass', function () {
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'public/scss/*.scss'])
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

//Move JS Files to src
gulp.task('js', function () {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js',
    ])
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

//Watch our SASS files & Serve
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: './',
    port: 3334,
  });
  gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'], ['sass']);
  gulp.watch('views/*.ejs').on('change', browserSync.reload);
});

//Move FontAwesome Fonts folder to browserSync
gulp.task('fonts', function () {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('public/fonts'));
});

//move font awesome css files
gulp.task('fa', function () {
  return gulp.src('node_modules/font-awesome/css/font-awesome.min.css')
    .pipe(gulp.dest('public/css'));
});

gulp.task('default', ['js', 'serve', 'fa', 'fonts']);
