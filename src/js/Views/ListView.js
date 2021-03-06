import BiontView from './BiontView';

export default class ListView extends BiontView.extend( {
	tagName: 'ul',
	events : {}
} ) {

	/**
	 * Initialize this class
	 */
	constructor( data, options ) {
		super( data, options );
		if ( !data.view ) {
			throw new TypeError( 'You need to pass a View to the ListView instance' );
		}
		if (this.constructor.name === 'ListView') {
			throw new TypeError("Cannot construct ListView instances directly");
		}
		this.view = data.view;
		this.listenTo( this.collection, "sync", this.render );
		// this.listenTo(this.collection, "sort", this.render);
		// this.listenTo( this.collection, "change", this.render );
		this._views = new Map();
		this.$el.empty();
	}

	/**
	 * Handle output
	 */
	render( force = false ) {
		/**
		 * Don't render if the list cannot be seen.
		 * Keep an eye on this and see if it causes problems
		 */
		if ( !this.$el.is( ':visible' ) ) {
			return this;
		}
		console.log( 'listview rendering' );

		if ( this.collection.isEmpty() ) {
			return this;
		}

		if ( force ) {
			this._views.clear();
		}
		// let models = this.collection.filter(this.filterItem.bind(this));
		let models = this.collection.models;
		this.removeObsoleteViews( models );

		//TODO This is an example for how we could sort the models before rendering
		// However, since the actual rendering code cannot re-sort on the fly,
		// it will only work the first time the list is rendered.

		// let pinStatus = [ 'active' ];
		// console.log( pinStatus );
		// if ( pinStatus ) {
		// 	models = _.sortBy( models, ( model )=> {
		// 		let index = jQuery.inArray( model.get( 'status' ), pinStatus );
		// 		return index !== -1 ? index : models.length;
		// 	} );
		// }
		// debugger;

		let curView;
		models.forEach( ( item, index, array ) => {
			if ( !this._views.has( item ) ) {

				let itemView = new this.view( this.getItemData( item ) );
				this._views.set( item, itemView );
				let $el = itemView.render().$el;

				/**
				 * Keep sort order
				 */
				if ( curView === undefined ) {
					this.$el.prepend( $el );
				} else {
					$el.insertAfter( curView.$el );
				}

				$el.css( 'display', 'none' ).slideDown( 275 );
			}
			curView = this._views.get( item );
		} );

		return this;
	}

	/**
	 * Walks over the views map and kills all
	 * views that are not present in the current selection of models
	 *
	 * @param models
	 */
	removeObsoleteViews( models ) {
		this._views.forEach( ( view, model ) => {
			if ( jQuery.inArray( model, models ) === -1 ) {
				this._views.get( model ).remove();
				this._views.delete( model );
			}
		} )
	}

	/**
	 * Filter callback.
	 *
	 * Checks if the current item status is present in this ViewCollection's allowed status
	 *
	 * @param item
	 * @returns {boolean}
	 */
	filterItem( item ) {
		return true;
		return jQuery.inArray( item.get( 'status' ), this.filterStatus ) !== -1;
	}

	getItemData( item ) {
		return {
			tagName: 'li',
			model  : item,
		};
	}
}