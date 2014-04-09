'use strict';

var Backbone = require( 'backbone.iobind' );
var socket = require( './sockets' );

var UserModel = require( './user.model' );

module.exports = Backbone.Collection.extend( {

	'model' : UserModel,
	
	'url' : 'users',

	'socket' : socket,

	'initialize' : function() {}
} );
