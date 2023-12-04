const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const cache = require('gulp-cache');
const del = require('del');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');

// Development Tasks 
// -----------------
gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Watchers
gulp.task('watch', function () {

    browserSync({
        server: {
            baseDir: 'app'
        },
        browser: 'chrome', // Specify the browser
        notify: false
    })

    gulp.watch('app/scss/**/*.scss', gulp.series('sass')).on('change', browserSync.reload);
    gulp.watch('app/**/*.html').on('change', browserSync.reload);
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function () {

  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images 
gulp.task('images', function () {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg|webp)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'))
});

// Copying fonts 
gulp.task('css-fonts', function () {
  return gulp.src('app/css/fonts/**/*')
    .pipe(gulp.dest('dist/CSS/fonts'))
})

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

// Cleaning 
gulp.task('clean', function () {
  return Promise.resolve()
    .then(function () {
      return del.sync('dist');
    })
    .then(function () {
      return cache.clearAll();
    });
});


gulp.task('clean:dist', function () {
  return Promise.resolve()
    .then(function () {
      return del(['dist/**/*', '!dist/images', '!dist/images/**/*']);
    });
});


// Build Sequences
// ---------------
gulp.task('default', gulp.series('sass', 'watch'));

gulp.task('build', gulp.series('clean:dist', 'sass', ['useref', 'images', 'fonts', 'css-fonts']));