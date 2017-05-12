import BiontView from "./BiontView";
import {throttle} from "underscore";

export default class ScrollSpyView extends BiontView {

	initialize() {
		super.initialize();
		this.queue = {};
		if ( this.constructor.name === 'ScrollSpyView' ) {
			throw new TypeError( "Cannot construct ScrollSpyView instances directly" );
		}
	}

	render( force ) {
		let rendered = this.rendered;
		super.render( force );

		if ( !rendered || force ) {

			let $container = (
				this.parent
			) ? this.parent.$el : $( window );
			let inside = {};

			$container.on( 'scroll.' + this.cid, throttle( ( e ) => {
				$( '[data-subview]', this.$el ).each( ( idx, obj ) => {
					let $this = $( obj ), subview = $this.data( 'subview' );

					/* if we have reached the minimum bound but are below the max ... */
					if ( this.isInView( obj ) ) {
						/* trigger enter event */
						if ( !inside[ subview ] ) {
							inside[ subview ] = true;

							/* fire enter event */
							this.trigger( 'scrollEnter', {
								subview: subview
							} );

							if ( this.subViewInstances[ subview ] ) {
								this.subViewInstances[ subview ].trigger( 'scrollEnter' );
							}

						}

						/* trigger tick event */
						this.trigger( 'scrollTick', {
							inside: inside[ subview ],
						} );
					} else {

						if ( inside[ subview ] ) {
							inside[ subview ] = false;
							/* trigger leave event */
							this.trigger( 'scrollLeave', {
								subview: subview
							} );

							if ( this.subViewInstances[ subview ] ) {
								this.subViewInstances[ subview ].trigger( 'scrollLeave' );
							}

						}
					}
				} );

			}, 100 ) );

		}

	}

	isInView( el ) {
		let winH = window.innerHeight,
			scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
			scrollBottom = scrollTop + winH,
			rect = el.getBoundingClientRect(),
			elTop = rect.top + scrollTop,
			elBottom = elTop + el.offsetHeight;
		if ( elTop === elBottom && elBottom === scrollBottom ) {
			// Element has 0 height and we're scrolled right to the bottom
			return true;

		}
		return (
			elTop < scrollBottom
			) && (
			elBottom >= scrollTop
			);
	};

}