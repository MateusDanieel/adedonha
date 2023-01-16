const gulp = require('gulp');

const browsersync = require('browser-sync').create();
const SSI = require('browsersync-ssi');

const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const concat = require('gulp-concat');
const lost = require('lost');
const uglify = require('gulp-uglify');

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './app/',
      index: './index.html'
    },
    ghostMode: true,
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

function css() {
  return gulp
    .src([
      './node_modules/normalize.css/normalize.css',
      './app/src/scss/*.scss'
    ])
    .pipe(concat('style.min.css'))
    .pipe(postcss([atImport(), autoprefixer(), precss(), cssnano(), lost()]))
    .pipe(gulp.dest('./app/dist/css'))
    .pipe(browsersync.stream());
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp.src([
      './app/src/js/modernizr-3.11.2.js',
      './app/src/js/plugins.js',
      './app/src/js/main.js'
    ])
      .pipe(concat('script.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/dist/js'))
      .pipe(browsersync.stream()));
}

function watchFiles() {
  gulp.watch('./app/src/scss/*.scss', css);

  gulp.watch([
    './app/src/js/*.js',
  ], scripts);

  gulp.watch('./app/*.html', browserSyncReload);
}

const js = gulp.series(scripts);
const build = gulp.series(css);
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;

exports.default = watch;