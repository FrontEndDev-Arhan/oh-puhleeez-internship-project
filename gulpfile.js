// Requires the gulp plugin
const gulp = require('gulp');
// Requires the gulp-sass plugin
const sass = require('gulp-sass');
// Requires the browser-sync plugin
const browserSync = require('browser-sync').create();
// Requires the gulp-useref plugin
const useref = require('gulp-useref');
// Requires the gulp-uglify plugin
const uglify = require('gulp-uglify');
// Requires the gulp-if plugin
const gulpIf = require('gulp-if');
// Requires the gulp-cssnano plugin
const cssnano = require('gulp-cssnano');
// Requires the gulp-imagemin plugin
const imagemin = require('gulp-imagemin');
// Requires the gulp-cache plugin
const cache = require('gulp-cache');
// Requires the del plugin
const del = require('del');
// Requires the run-sequence plugin
const runSequence = require('run-sequence');
// Requires the gulp-autoprefixer plugin
const autoPrefixer = require('gulp-autoprefixer');
// Requires the gulp-plumber plugin
const plumber = require('gulp-plumber');

// Gulp Syntax
// gulp.task('task-name', function () {
//   return gulp
//     .src('source-files') // Get source files with gulp.src
//     .pipe(aGulpPlugin()) // Sends it through a gulp plugin
//     .pipe(gulp.dest('destination')); // Outputs the file in the destination folder
// });

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
});

gulp.task('sass', function () {
  return (
    gulp
      .src('resources/sass/*.scss')
      // Handle the errors
      .pipe(plumber())
      // Using gulp-sass
      // Converts Sass to CSS with gulp-sass
      .pipe(sass())
      .pipe(autoPrefixer())
      .pipe(gulp.dest('resources/css/'))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      )
  );
});

gulp.task('useref', function () {
  return (
    gulp
      .src('*/**.html')
      // Handle the errors
      .pipe(plumber())
      .pipe(useref())
      // Minifies only if it's a JavaScript file
      .pipe(gulpIf('*.js', uglify()))
      // Minifies only if it's a CSS file
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('build/'))
  );
});

gulp.task('images', function () {
  return (
    gulp
      .src(
        'resources/html__images/**/*.+(png|jpg|gif|svg)' &&
          'resources/css/css__images/**/*.+(png|jpg|gif|svg)'
      )
      // Caching images that ran through imagemin
      .pipe(
        cache(
          imagemin({
            interlaced: true,
          })
        )
      )
      .pipe(gulp.dest('build/images/'))
  );
});

gulp.task('clean:dist', function () {
  return del.sync('build');
});

gulp.task('fonts', function () {
  return gulp.src('resources/fonts/**/*').pipe(gulp.dest('build/fonts/'));
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', ['sass', 'useref', 'images', 'fonts'], callback);
});

gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync', 'watch'], callback);
});

gulp.task(
  'watch',
  /* array of tasks to complete before watch task starts */ [
    'browserSync',
    'sass',
  ],
  function () {
    // gulp watch syntax
    gulp.watch('resources/sass/*.scss', ['sass']);
    // Other watchers
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('**/**/*.html', browserSync.reload);
    gulp.watch('resources/js/**/**/*.js', browserSync.reload);
    gulp.watch('resources/sass/**/*.scss', browserSync.reload);
  }
);
