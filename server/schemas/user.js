var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var User = new Schema( {
	'name' : {
		'type' : String
	},
	'login' : {
		'type' : String
	},
	'avatar' : {
		'type' : String
	}
} );

module.exports = mongoose.model( 'user', User );
