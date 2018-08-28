const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');

gulp.task('styles', () => {
  return gulp.src('css/*.css')  // ['css/styles.css' , 'css/responsive.css']
    .pipe(cleanCSS({ level: 2 }))
    .pipe(concat('bundle.css'))
    .pipe(rename('bundle.min.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts:db_helper', () => {
  return gulp.src('js/dbhelper.js')
    .pipe(babel({ presets: ['env'] }))
    .pipe(concat('dbhelper.bundle.js'))
    .pipe(rename('dbhelper.bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts:main', () => {
  return gulp.src('js/main.js')
    .pipe(babel({ presets: ['env'] }))
    .pipe(concat('main.bundle.js'))
    .pipe(rename('main.bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts:restaurant', () => {
  return gulp.src('js/restaurant_info.js')
    .pipe(babel({ presets: ['env'] }))
    .pipe(concat('restaurant.bundle.js'))
    .pipe(rename('restaurant.bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// Default task
gulp.task('default', ['styles', 'scripts:db_helper', 'scripts:main', 'scripts:restaurant']);
