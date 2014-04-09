'use strict';

var path       = require( 'path' );
var express    = require( 'express.io' );
var mongoose   = require( 'mongoose' );
var MongoStore = require( 'connect-mongo' )( express );
var promise    = require( 'bluebird' );
var edotjs     = require( 'edotjs' );
var traverse   = promise.promisify( require( 'glob' ) );
var app        = express();
var debug      = require( 'debug' )( 'server:index' );
// Start io server
app.http().io();

var utils       = require( './utils' );
var settings    = require( './settings' );
var middlewares = require( './middlewares' );
var routeFiles  = path.resolve( __dirname, 'routes' );

function Server() {
	if ( !( this instanceof Server ) ) {
		return new Server();
	}
	return this;
}

// Server initialization
Server.prototype.start = function () {
	promise.all( [
		this.connectMongo(),
		this.initMiddlewares(),
		this.initRouters()
	] ).then( function () {
		app.listen( settings.app.port, function () {
			var env = app.get( 'env' );
			debug( 'App running in ' + env + ' mode @ localhost:9090' );
		} );
	} ).catch( function ( error ) {
		debug( error );
	} ).error( function ( error ) {
		debug( error );
	} );
};

// Register route handlers
Server.prototype.initRouters = function () {

	return traverse( routeFiles + '/*.js' )
		.then( function ( routers ) {
			routers.forEach( function ( router ) {
				var routes = require( router );
				this.registerRoutes( app, routes );
			}.bind( this ) );
		}.bind( this ) );
};

// Register an array of routes
Server.prototype.registerRoutes = function ( app, routes ) {
	routes.forEach( function ( route ) {
		this.registerRoute( app, route );
	}.bind( this ) );
};

// Register a single route
Server.prototype.registerRoute = function ( app, route ) {
	// Websocket route
	if ( route.io ) {
		app.io.route( route.path, route.events );
		return;
	}

	var handlers = [];

	if ( route.authenticate && app.get( 'auth' )  ) {
		handlers.push( middlewares.passport.ensureAuthenticated );
	}

	if ( route.fn instanceof Array ) {
		handlers = handlers.concat( route.fn );
	} else {
		handlers.push( route.fn );
	}

	app[ route.method ]( route.path, handlers );
};

// Initialize middlewares
Server.prototype.initMiddlewares = function () {
	app.set( 'env', process.env.NODE_ENV );
	app.set( 'port', settings.app.port );
	app.set( 'host', settings.app.host );
	// Enable authentication on routes
	app.set( 'auth', true );
	
	app.disable( 'x-powered-by' );
	// Note:
	// Implement csp using helmet module

	app.set( 'views', settings.static.views );
	app.set( 'view engine', 'html' );
	app.engine( 'html', edotjs.renderFile );
	
	if ( 'development' === app.get( 'env' ) ) {
		app.use( express.logger() );
	}

	app.use( express.bodyParser() );
	app.use( express.cookieParser() );
	app.use( express.session( {
		'secret' : settings.session.secret,
		'store'  : new MongoStore( {
			'db'   : settings.session.db
		} ),
		'key'    : 'sessionId',
		'cookie' : {
			'httpOnly' : true
			// add 'secure' : true when running on ssl
		}
	} ) );

	
	app.use( middlewares.passport.initialize() );
	app.use( middlewares.passport.session() );
	app.use( app.router );
	app.use( express.static( settings.static.files ) );

	return promise.resolve();
};

Server.prototype.connectMongo = function ( options ) {
	var db;
	var defer = promise.defer();

	options = options || {};

	mongoose.connect( utils.mongoUrl( options ) );
	db = mongoose.connection;

	db.once( 'open', function () {
		debug( 'Mongoose connection open.' );
		defer.resolve( db );
	} );

	db.once( 'error', defer.reject.bind( defer, 'Mongoose connection error.' ) );

	return defer.promise;
};

module.exports = new Server();
