'use strict';

var React  = require( 'react' );

var socket = require( './sockets' );
var BackboneMixin = require( './backbone.mixin' );

module.exports = React.createClass( {

	mixins : [ BackboneMixin ],

	componentDidMount : function () {
		socket.on( 'connect', function () {
			console.log( 'socket.io connected' );
		} );
	},

	getBackboneModels : function() {
		return [ this.props.users  ];
	},

	render : function () {
		return (
			<div className="row">
				<div id="tech-stack">
					Gulp, Browserify, FB React, Express, Mongoose, Socket.io via Express.io
				</div>
			</div>
		);
	}
} );
