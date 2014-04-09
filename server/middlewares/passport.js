'use strict';

var passport       = require( 'passport' );
var GithubStrategy = require( 'passport-github' ).Strategy;
var settings       = require( '../settings' );
var User           = require( '../schemas/user' );

passport.serializeUser( function ( user, done ) {
	done( null, user );
} );

passport.deserializeUser( function ( obj, done ) {
	done( null, obj );
} );

passport.use( new GithubStrategy( {
	'clientID'     : settings.github.clientID,
	'clientSecret' : settings.github.clientSecret,
	'callbackURL'  : settings.github.callbackURL
}, function( accessToken, refreshToken, profile, done ) {
	var github;

	try {
		github = JSON.parse( profile._raw );
	} catch ( error ) {
		return done( error );
	}

	User.findOne( {
		'login': github.login
	}, function ( error, doc ) {
		if ( error ) {
			return done( error );
		}

		if ( doc ) {
			return done( null, doc );
		}

		User.create( {
			'name'   : github[ 'name' ] || github[ 'login' ],
			'login'  : github[ 'login' ],
			'avatar' : github[ 'avatar_url' ]
		}, function( error, user ) {
			
			if ( error ) {
				return done( error );
			}
			
			return done( null, user );
		} );

	} );

} ) );

passport.ensureAuthenticated = function( request, response, next ) {
	if ( request.isAuthenticated() ) {
		return next();
	}

	response.redirect( '/dont_logout' );
};

module.exports = passport;
