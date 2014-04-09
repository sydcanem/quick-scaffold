'use strict';

var debug    = require( 'debug' )( 'route:github' );
var passport = require( '../middlewares' ).passport;

module.exports = [
	{
		'method' : 'get',
		'path' : '/auth/github',
		'fn' : [
			passport.authenticate( 'github' ),
			function( request, response ) {
				// The request will be redirected to Github for authentication, so this
				// function will not be called.
			}
		]
	},
	{
		'method' : 'get',
		'path' : '/auth/github/callback',
		'fn' : [
			passport.authenticate( 'github', { 'failureRedirect' : '/' } ),
			function( request, response ) {
				debug( 'Github user successfully authenticated.' );
				response.redirect( '/' );
			}
		]
	},
	{
		'method' : 'get',
		'path' : '/auth/github/signout',
		'authenticate' : true,
		'fn' : function ( request, response ) {
			request.logout();
			response.redirect( '/' );
		}
	}
];
