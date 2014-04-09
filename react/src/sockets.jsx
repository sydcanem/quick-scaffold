'use strict';

var io = require( 'socket.io-client' );

function Socket () {
	if ( !( this instanceof Socket ) ) {
		return new Socket();
	}

	this.socket = io.connect( 'http://localhost:9090' );
	return this.socket;
}

module.exports = new Socket();
