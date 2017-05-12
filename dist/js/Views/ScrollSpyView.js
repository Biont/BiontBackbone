"use strict";

exports.__esModule = true;

var _BiontView2 = require("./BiontView");

var _BiontView3 = _interopRequireDefault(_BiontView2);

var _underscore = require("underscore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollSpyView = function (_BiontView) {
	_inherits(ScrollSpyView, _BiontView);

	function ScrollSpyView() {
		_classCallCheck(this, ScrollSpyView);

		return _possibleConstructorReturn(this, _BiontView.apply(this, arguments));
	}

	ScrollSpyView.prototype.initialize = function initialize() {
		_BiontView.prototype.initialize.call(this);
		this.queue = {};
		if (this.constructor.name === 'ScrollSpyView') {
			throw new TypeError("Cannot construct ScrollSpyView instances directly");
		}
	};

	ScrollSpyView.prototype.render = function render(force) {
		var _this2 = this;

		var rendered = this.rendered;
		_BiontView.prototype.render.call(this, force);

		if (!rendered || force) {

			var $container = this.parent ? this.parent.$el : $(window);
			var inside = {};

			$container.on('scroll.' + this.cid, (0, _underscore.throttle)(function (e) {
				$('[data-subview]', _this2.$el).each(function (idx, obj) {
					var $this = $(obj),
					    subview = $this.data('subview');

					/* if we have reached the minimum bound but are below the max ... */
					if (_this2.isInView(obj)) {
						/* trigger enter event */
						if (!inside[subview]) {
							inside[subview] = true;

							/* fire enter event */
							_this2.trigger('scrollEnter', {
								subview: subview
							});

							if (_this2.subViewInstances[subview]) {
								_this2.subViewInstances[subview].trigger('scrollEnter');
							}
						}

						/* trigger tick event */
						_this2.trigger('scrollTick', {
							inside: inside[subview]
						});
					} else {

						if (inside[subview]) {
							inside[subview] = false;
							/* trigger leave event */
							_this2.trigger('scrollLeave', {
								subview: subview
							});

							if (_this2.subViewInstances[subview]) {
								_this2.subViewInstances[subview].trigger('scrollLeave');
							}
						}
					}
				});
			}, 100));
		}
	};

	ScrollSpyView.prototype.isInView = function isInView(el) {
		var winH = window.innerHeight,
		    scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
		    scrollBottom = scrollTop + winH,
		    rect = el.getBoundingClientRect(),
		    elTop = rect.top + scrollTop,
		    elBottom = elTop + el.offsetHeight;
		if (elTop === elBottom && elBottom === scrollBottom) {
			// Element has 0 height and we're scrolled right to the bottom
			return true;
		}
		return elTop < scrollBottom && elBottom >= scrollTop;
	};

	return ScrollSpyView;
}(_BiontView3.default);

exports.default = ScrollSpyView;
//# sourceMappingURL=ScrollSpyView.js.map
