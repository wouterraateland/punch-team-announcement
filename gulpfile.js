const source = require('vinyl-source-stream')

const browserify = require('browserify')
const babelify   = require('babelify')

const gulp       = require('gulp')
const sass       = require('gulp-sass')

const es6Source  = './src/js/**/*.js'
const sassSource = './src/sass/**/*.scss'

gulp.task('es6', () => {
	browserify('src/js/index.js')
	  .transform(babelify)
	  .bundle()
	  .pipe(source('index.js'))
	  .pipe(gulp.dest('dist'))
})

gulp.task('sass', () => {
	gulp.src(sassSource)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist'))
})

gulp.task('sass:watch', () => {
	gulp.watch(sassSource, ['sass'])
})

gulp.task('es6:watch', () => {
	gulp.watch(es6Source, ['es6'])
})

gulp.task('build', ['es6', 'sass'])
gulp.task('watch', ['es6:watch', 'sass:watch'])
gulp.task('default', ['build', 'watch'])
