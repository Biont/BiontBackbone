"use strict";

exports.__esModule = true;

var _abstractTemplateLoader = require("./abstractTemplateLoader");

var _abstractTemplateLoader2 = _interopRequireDefault(_abstractTemplateLoader);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeTemplateLoader = function (_AbstractTemplateLoad) {
	_inherits(NodeTemplateLoader, _AbstractTemplateLoad);

	function NodeTemplateLoader(args) {
		_classCallCheck(this, NodeTemplateLoader);

		var _this = _possibleConstructorReturn(this, _AbstractTemplateLoad.call(this));

		_this.tplDir = args.tplDir || __dirname + '/' + name + '.js';
		console.log(_this.tplDir);
		return _this;
	}

	NodeTemplateLoader.prototype.templateFound = function templateFound(name) {
		return _fs2.default.existsSync(this.getLocalPath(name));
	};

	NodeTemplateLoader.prototype.loadTemplate = function loadTemplate(name) {
		return require(this.getLocalPath(name));
	};

	NodeTemplateLoader.prototype.getLocalPath = function getLocalPath(name) {
		return this.tplDir + name + '.js';
	};

	return NodeTemplateLoader;
}(_abstractTemplateLoader2.default);

exports.default = NodeTemplateLoader;
//# sourceMappingURL=nodeTemplateLoader.js.map
