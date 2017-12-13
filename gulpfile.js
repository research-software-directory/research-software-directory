var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('watch', ['build'], function(gulpCallback) {
    gulp.watch('/style/**/*.scss', ['build']);
});

gulp.task('build', function() {
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