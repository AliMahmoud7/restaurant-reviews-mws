const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
// const sourcemaps = require('gulp-sourcemaps');


gulp.task('styles', () => {
  return gulp.src('css/*.css')  // ['css/styles.css' , 'css/responsive.css']
    .pipe(cleanCSS({ level: 2 }))
    .pipe(concat('styles.bundle.min.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts:db_helper', () => {
  return gulp.src('js/dbhelper.js')
    .pipe(babel({ presets: ['env'] }))
    // .pipe(concat('dbhelper.min.js'))
    .pipe(rename('dbhelper.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Default task
gulp.task('default', ['styles', 'scripts:db_helper']);
