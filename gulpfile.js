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
	var mocha = require('gulp-mocha');

	return gulp.src('test/*.test.js', {read: false})
		.pipe(mocha({
			reporter: 'spec',
			timeout: 2000
		}));
});

gulp.task('default', ['test']);
