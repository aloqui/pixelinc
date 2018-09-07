var gulp = require('gulp');
// Requires the gulp-sass plugin
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify-es').default,
  sassGlob = require('gulp-sass-glob'),
  postcss = require('gulp-postcss'),
  $ = require('gulp-load-plugins')(),
  postcssSVG = require('postcss-svg');

  appConfig = {
    src: {
      sass: './src/assets/scss/',
      js: './src/assets/javascripts/',
      html: './src/pages/'
    },
    dist: {
      base: './dist/',
      css: './dist/assets/stylesheets/',
      js: './dist/assets/javascripts/',
    }
  }
gulp.task('html', function() {
  return gulp.src(appConfig.src.html + '**/*.html')
  .pipe(gulp.dest(appConfig.dist.base))
})
gulp.task('js', function () {
  return gulp.src(appConfig.src.js + '**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(appConfig.dist.js))
    .pipe(browserSync.reload({
      stream: true
    }))
});
gulp.task('sass', function () {
  var postcssProcessors;
  postcssSVG = require('postcss-svg');
  postcssProcessors = [
    postcssSVG({
      //defaults: '[fill]: black',
      paths: ['./app/images/'],
    })
  ];
  // Gets all files ending with .scss in app/scss and children dirs
  return gulp.src(appConfig.src.sass + '**/*.scss')
    .pipe(sassGlob())
    .pipe($.plumber()) // keep watching and log errors in the console
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({ // Passes it through a gulp-sass
      /* include sass from the bower_components folder */
      includePaths: ['./bower_components']
      //errLogToConsole: true
    }))
    .pipe($.autoprefixer({
      browsers: ['last 3 versions', 'ie 9']
    }))
    .pipe(postcss(postcssProcessors))
    .pipe($.cssnano())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(appConfig.dist.css))
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: appConfig.dist.base
    },
  })
})

gulp.task('default', ['browserSync', 'html', 'sass', 'js'], function () {
  gulp.watch(appConfig.src.js + '**/*.js',['js']);
  gulp.watch(appConfig.src.html + '**/*.html', ['html']);
  gulp.watch(appConfig.src.sass + '**/*.scss', ['sass']);
  gulp.watch(appConfig.dist.base + '**/*.html', browserSync.reload);
  gulp.watch(appConfig.dist.base + '**/*.css', browserSync.reload);
  // Other watchers
});