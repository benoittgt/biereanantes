// Initialize modules
const { src, dest, watch, series, parallel } = require('gulp');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const browserSync = require('browser-sync').create();


// File paths
const files = {
  cssPath: 'src/css/**/*.css',
  jsPath: 'src/js/**/*.js'
}

function cssTask(){
  return src(files.cssPath)
    .pipe(sourcemaps.init()) // initialize sourcemaps first
    .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
    .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
    .pipe(dest('dist')
    ); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
  return src([
    files.jsPath
    //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
  ])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('dist')
    );
}


// Cachebust
function cacheBustTask(){
  var cbString = new Date().getTime();
  return src(['index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.')
    );
}

//Browser sync task- creates a new browser seson
//the first time you run gulp. Then the watch tasks
//continuosly check for changes to the html, css, and
//js files- browser refreshes on change.
function syncTask(){
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch('app/css/**/*.css', cssTask).on('change', browserSync.reload);
  gulp.watch('app/js/**/*.js', jsTask).on('change', browserSync.reload);
  gulp.watch('./*html').on('change', browserSync.reload);
}

// Watch task: watch CSS and JS files for changes
// If any change, run css and js tasks simultaneously
function watchTask(){
  watch([files.cssPath, files.jsPath],
    {interval: 1000, usePolling: true}, //Makes docker work
    series(
      parallel(cssTask, jsTask),
      cacheBustTask
    ),
  );
}

// Export the default Gulp task so it can be run
// Runs the css and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
  parallel(cssTask, jsTask,syncTask),
  cacheBustTask,
  watchTask
);
