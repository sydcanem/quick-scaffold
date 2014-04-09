'use strict';

var utils = require( '../utils' );

var User = require( '../schemas/user' );

module.exports = [
	{
		'method' : 'get',
		'path' : '/',
		'fn' : function ( req, res ) {
			User.find()
				.lean()
				.exec( function ( error, users ) {
					if ( error ) {
						return res.send( 500, error );
					}

					var data = {
						'users' : utils.stringify( users ),
					};

					res.render( 'index', data );
				} );
		}
	}
];
