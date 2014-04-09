var gulp       = require( 'gulp' );
var browserify = require( 'gulp-browserify' );
var concat     = require( 'gulp-concat' );
var uglify     = require( 'gulp-uglify' );
var less       = require( 'gulp-less' );
var react      = require( 'gulp-react' );
var exec       = require( 'gulp-exec' );
var argv       = require( 'yargs' ).argv;

// Source files
var scripts = 'public/main.js';
var styles = 'public/less/**/*.less';
var jsx = 'react/src/**/*.jsx';

gulp.task( 'styles', function () {
	gulp.src( styles )
		.pipe( less() )
		.pipe( concat( 'styles.css' ) )
		.pipe( gulp.dest( 'public/css' ) );
} );

gulp.task( 'scripts', function () {
	gulp.src( scripts )
		.pipe( browserify( {
			debug: !! argv.debug // source maps ON
		} ) )
		.pipe( concat( 'main.min.js' ) )
		.pipe( gulp.dest( 'public' ) );
} );

gulp.task( 'bundle', [ 'react' ], function () {
	var requires = [
		'-r ./react/build/app.js:app',
		'-r ./react/build/users.collection.js:users',
		'-r react'
	].join( ' ' );
	var debug = argv.debug ? '--debug ' : '';
	gulp.src( '.' )
		.pipe( exec( 'browserify ' + debug + requires + ' > public/bundle.js' ) );
} );

gulp.task( 'compress', function () {
	gulp.src( 'public/bundle.js' )
		.pipe( uglify() )
		.pipe( concat( 'bundle.min.js' ) )
		.pipe( gulp.dest( 'public' ) );
} );

gulp.task( 'react', function () {
	gulp.src( jsx )
		.pipe( react() )
		.pipe( gulp.dest( 'react/build' ) );
} );

gulp.task( 'default', [ 'react', 'styles', 'bundle' ], function () {
	gulp.watch( styles, [ 'styles' ] );
	gulp.watch( jsx, [ 'bundle' ] );
} );

// Tests
gulp.task( 'server:test', function () {
	gulp.src( '.' )
		.pipe( exec( 'mocha test' ) );
} );
