'use strict';

// https://github.com/facebook/react/blob/1be9a9e98662f95296942eea76b3e39a5a09fab0/examples/todomvc-backbone/js/app.js#L148-L171
module.exports = {
	
	componentDidMount : function () {
		this.getBackboneModels().forEach( function ( model ) {
			model.on( 'add change remove', this.forceUpdate.bind( this, null ), this );
		}, this );
	},

	componentWillUnmount : function () {
		this.getBackboneModels().forEach( function ( model ) {
			model.off( null, null, this );
		}, this );
	}
}
