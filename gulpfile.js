var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('watch', function(gulpCallback) {
    gulp.watch('static/**/*.scss', ['build']);
});

gulp.task('build', function() {
    var plugins = [
        autoprefixer({browsers: ['>5%']}),
        cssnano
    ];

    return gulp.src('static/**/*.scss')
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('static'))
});