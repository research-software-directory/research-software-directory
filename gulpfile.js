var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

/* dev tasks */
gulp.task('css-dev', function() {
    var plugins = [
        autoprefixer({browsers: ['>5%']}),
        cssnano
    ];

    return gulp.src('/style/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('/static/style'))
});

gulp.task('js-dev', function (cb) {
    return gulp.src('/scripts/**/*.js')
        .pipe(gulp.dest('/static/scripts'));
});

gulp.task('watch', ['css-dev', 'js-dev'], function(gulpCallback) {
    gulp.watch('/scripts/**/*.js', ['js-dev']).on('change', function(file) { console.log(file.path + ' changed'); });
    gulp.watch('/style/**/*.scss', ['css-dev']).on('change', function(file) { console.log(file.path + ' changed'); });
});

/* production tasks */
gulp.task('css-production', function (cb) {
    var plugins = [
        autoprefixer({browsers: ['>5%']}),
        cssnano
    ];

    return gulp.src('style/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('static/style'))
});

gulp.task('js-production', function (cb) {
    return gulp.src('scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('static/scripts'));
});

gulp.task('build-production', ['js-production', 'css-production']);