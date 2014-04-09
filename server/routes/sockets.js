'use strict';

// Websocket routes using express.io
//
// Define events as per model
module.exports = [
	{
		'path' : 'users',
		'io' : true,
		'events' : {
			'create' : function( req ) {
				// Emitting an event that is listened to
				// a backbone model using ioBind backbone plugin
				req.io.emit( 'users/' + req.session.user.id + ':create', req.session.user );
			}
		}
	}
];
