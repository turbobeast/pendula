var gulp = require('gulp');
var browserify = require('browserify');
var vinyl = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

gulp.task('js', function () {
	return browserify('./dev/js/main.js')
        .bundle()
        .pipe(vinyl('main.js'))
        .pipe( gulp.dest('./public/javascripts/') );
});