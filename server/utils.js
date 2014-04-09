'use strict';

function generateMongoUrl( options ) {
	options = options || {};

	var host = options.host || 'localhost';
	var port = options.port || '27017';
	var db = options.db || 'dev';
	var url = '';

	if ( options.user && options.pass ) {
		url = 'mongodb://' + options.user + ':' + options.pass + '@' + host + ':' + port + '/' + db;
	} else {
		url = 'mongodb://' + host + ':' + port + '/' + db;
	}

	return url;
}

function safeStringify( unsafe ) {
	return JSON.stringify( unsafe )
		.replace( /<\/script/g, '<\\/script' )
		.replace( /<!--/g, '<\\!--' );
}

function merge( a, b ) {
  if ( a && b ) {
    for ( var key in b ) {
      a[ key]  = b[ key ];
    }
  }
  return a;
}

// Expose methods and vars
exports.merge = merge;
exports.mongoUrl = generateMongoUrl;
exports.stringify = safeStringify;
