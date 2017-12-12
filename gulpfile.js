var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('watch', ['build'], function(gulpCallback) {
    gulp.watch('/style/**/*.scss', ['build']);
});

gulp.task('build', function() {
    var plugins = [
        autoprefixer({browsers: ['>5%']}),
        cssnano
    ];

    return gulp.src('/style/**/*.scss')
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('/static/style'))
});