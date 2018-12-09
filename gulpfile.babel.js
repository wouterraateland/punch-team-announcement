'use strict';

import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

import browserify from 'browserify';

import gulp       from 'gulp';
import babel      from 'gulp-babel';
import sass       from 'gulp-sass';
import gutil      from 'gulp-util';
import uglify     from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';

const es6Source  = './src/js/**/*.js';
const sassSource = './src/sass/**/*.scss';

gulp.task('es6', () => {
	console.log('Updating js');
	// set up the browserify instance on a task basis
	const b = browserify({
		entries : './src/js/index.js',
		debug   : true
	}).transform('babelify', {
		presets : ['es2015']
	});

	return b.bundle()
		.pipe(source('./index.js'))
		.pipe(buffer())
		//.pipe(sourcemaps.init({ loadMaps : true }))
			// Add transformation tasks to the pipeline here.
			.pipe(babel())
			.pipe(uglify())
			.on('error', gutil.log)
		//.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('sass', () => {
	console.log('Updating Sass');
	return gulp.src(sassSource)
		.pipe(sourcemaps.init({ loadMaps : true }))
		.pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('sass:watch', () => {
	gulp.watch(sassSource, ['sass']);
});

gulp.task('es6:watch', () => {
	gulp.watch(es6Source, ['es6']);
});

gulp.task('build', ['es6', 'sass']);
gulp.task('watch', ['es6:watch', 'sass:watch']);
gulp.task('default', ['build', 'watch']);
