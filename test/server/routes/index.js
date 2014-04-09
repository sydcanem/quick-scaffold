'use strict';

var _ = require( 'underscore' );
var expect  = require( 'chai' ).expect;

var server = require( '../../../server' );
var utils  = require( '../../../server/utils' );
var index  = require( '../../../server/routes/index' );

describe( 'Route', function () {
	var connection;

	before( function ( done ) {
		server.connectMongo( {
			'db' : 'test'
		} ).done( function( conn ) {
			connection = conn;
			done();
		} );
	} );

	after( function () {
		connection.close();
	} );

	describe( '/', function () {
		var route;

		before( function () {
			route = _.findWhere( index, { 'path' : '/' } );
		} );

		it( 'should return all users', function () {
			var request = {
				'session' : {
					'passport' : {
						'user' : {
							'login' : 'testfoo'
						}
					}
				}
			};

			var response = {
				'render' : function ( view, def ) {
					expect( view ).to.equal( 'index' );
					expect( def ).to.deep.equal( {
						'session' : utils.stringify( request.session.passport.user ),
						'users' : utils.stringify( [] )
					} );
				}
			};

			route.fn( request, response );			
		} );

	} );

} );

