'use strict';

var gulp = require('gulp');

gulp.task('lint', function () {
	var eslint = require('gulp-eslint');

	return gulp.src('*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], function () {

});

gulp.task('default', ['test']);
