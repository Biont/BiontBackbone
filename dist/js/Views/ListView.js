'use strict';

exports.__esModule = true;

var _BiontView = require('./BiontView');

var _BiontView2 = _interopRequireDefault(_BiontView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListView = function (_BiontView$extend) {
	_inherits(ListView, _BiontView$extend);

	/**
  * Initialize this class
  */
	function ListView(data, options) {
		_classCallCheck(this, ListView);

		var _this = _possibleConstructorReturn(this, _BiontView$extend.call(this, data, options));

		if (!data.view) {
			throw new TypeError('You need to pass a View to the ListView instance');
		}
		if (_this.constructor.name === 'ListView') {
			throw new TypeError("Cannot construct ListView instances directly");
		}
		_this.view = data.view;
		_this.listenTo(_this.collection, "sync", _this.render);
		// this.listenTo(this.collection, "sort", this.render);
		// this.listenTo( this.collection, "change", this.render );
		_this._views = new Map();
		_this.$el.empty();
		return _this;
	}

	/**
  * Handle output
  */


	ListView.prototype.render = function render() {
		var _this2 = this;

		var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		/**
   * Don't render if the list cannot be seen.
   * Keep an eye on this and see if it causes problems
   */
		if (!this.$el.is(':visible')) {
			return this;
		}
		console.log('listview rendering');

		if (this.collection.isEmpty()) {
			return this;
		}

		if (force) {
			this._views.clear();
		}
		// let models = this.collection.filter(this.filterItem.bind(this));
		var models = this.collection.models;
		this.removeObsoleteViews(models);

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

		var curView = void 0;
		models.forEach(function (item, index, array) {
			if (!_this2._views.has(item)) {

				var itemView = new _this2.view(_this2.getItemData(item));
				_this2._views.set(item, itemView);
				var $el = itemView.render().$el;

				/**
     * Keep sort order
     */
				if (curView === undefined) {
					_this2.$el.prepend($el);
				} else {
					$el.insertAfter(curView.$el);
				}

				$el.css('display', 'none').slideDown(275);
			}
			curView = _this2._views.get(item);
		});

		return this;
	};

	/**
  * Walks over the views map and kills all
  * views that are not present in the current selection of models
  *
  * @param models
  */


	ListView.prototype.removeObsoleteViews = function removeObsoleteViews(models) {
		var _this3 = this;

		this._views.forEach(function (view, model) {
			if (jQuery.inArray(model, models) === -1) {
				_this3._views.get(model).remove();
				_this3._views.delete(model);
			}
		});
	};

	/**
  * Filter callback.
  *
  * Checks if the current item status is present in this ViewCollection's allowed status
  *
  * @param item
  * @returns {boolean}
  */


	ListView.prototype.filterItem = function filterItem(item) {
		return true;
		return jQuery.inArray(item.get('status'), this.filterStatus) !== -1;
	};

	ListView.prototype.getItemData = function getItemData(item) {
		return {
			tagName: 'li',
			model: item
		};
	};

	return ListView;
}(_BiontView2.default.extend({
	tagName: 'ul',
	events: {}
}));

exports.default = ListView;
//# sourceMappingURL=ListView.js.map
