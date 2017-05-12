'use strict';

exports.__esModule = true;

var _ScrollSpyView = require('./ScrollSpyView');

var _ScrollSpyView2 = _interopRequireDefault(_ScrollSpyView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LazyLoadView = function (_ScrollSpyView$extend) {
	_inherits(LazyLoadView, _ScrollSpyView$extend);

	function LazyLoadView() {
		_classCallCheck(this, LazyLoadView);

		return _possibleConstructorReturn(this, _ScrollSpyView$extend.apply(this, arguments));
	}

	LazyLoadView.prototype.initialize = function initialize() {
		_ScrollSpyView$extend.prototype.initialize.call(this);
		this.queue = {};
		if (this.constructor.name === 'LazyLoadView') {
			throw new TypeError("Cannot construct LazyLoadView instances directly");
		}
	};

	LazyLoadView.prototype.render = function render(force) {
		var _this2 = this;

		var rendered = this.rendered;
		_ScrollSpyView$extend.prototype.render.call(this, force);

		if (!rendered || force) {
			this.$el.on('scrollEnter', function (e, data) {
				if (_this2.queue[data.subview]) {
					console.log('lazy rendering', _this2.queue[data.subview]);
					_this2.renderSubView(data.subview, _this2.queue[data.subview].view, _this2.queue[data.subview].element, _this2.queue[data.subview].forced);
					delete _this2.queue[data.subview];
				}
			});

			this.$el.on('scrollLeave', function (e, data) {
				console.log('scrollLeave', data);
			});
		}
	};

	LazyLoadView.prototype.shouldRenderSubView = function shouldRenderSubView(handle, view, element, forced) {
		var inView = this.isInView(element[0]);
		if (!inView) {
			console.log('added to queue', handle);
			this.queue[handle] = { view: view, element: element, forced: forced };
		}
		return inView;
	};

	return LazyLoadView;
}(_ScrollSpyView2.default.extend());

exports.default = LazyLoadView;
//# sourceMappingURL=LazyLoadView.js.map
