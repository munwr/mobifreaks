'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');



gulp.task('sass', function () {
  return gulp.src('./src/style.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream())
});

gulp.task('minifyImages', () =>
  gulp.src('./src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream())
);

gulp.task('minifyHTML', () => {
  return gulp.src('./src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
});

gulp.task('minifyJS', function () {
  return gulp.src('./src/js/*/*.js')
    .pipe(terser())
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.stream())
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
});

gulp.task('watch', function () {
  gulp.watch('./src/style.scss', gulp.parallel(['sass']));
  gulp.watch('./src/*.html', gulp.parallel(['minifyHTML']));
  gulp.watch('./src/images/*', gulp.parallel(['minifyImages']));
  gulp.watch('./src/js/*/*', gulp.parallel(['minifyJS']));
  gulp.watch("./dist/*").on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('sass', 'minifyImages', 'minifyHTML', 'minifyJS', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('sass', 'minifyImages', 'minifyHTML', 'minifyJS'));

