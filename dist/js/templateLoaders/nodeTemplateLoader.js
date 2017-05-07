'use strict';

exports.__esModule = true;

var _abstractTemplateLoader = require('./abstractTemplateLoader');

var _abstractTemplateLoader2 = _interopRequireDefault(_abstractTemplateLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NodeTemplateLoader = function (_AbstractTemplateLoad) {
    _inherits(NodeTemplateLoader, _AbstractTemplateLoad);

    function NodeTemplateLoader() {
        _classCallCheck(this, NodeTemplateLoader);

        return _possibleConstructorReturn(this, _AbstractTemplateLoad.apply(this, arguments));
    }

    NodeTemplateLoader.prototype.getTemplate = function getTemplate(object) {

        var tpl = void 0;

        if (tplOverride && this.templateFound(tplOverride)) {
            return require(tplOverride);
        }
        console.log('fetching', object.constructor.name);
        var name = this.getTemplateNameFromObject(object);
    };

    NodeTemplateLoader.prototype.templateFound = function templateFound(name) {
        return fs.existsSync(this.getLocalPath(name));
    };

    NodeTemplateLoader.prototype.loadTemplate = function loadTemplate(name) {
        return require(this.getLocalPath(name));
    };

    NodeTemplateLoader.prototype.getLocalPath = function getLocalPath(name) {
        return __dirname + '/' + tplDir + name + '.js';
    };

    return NodeTemplateLoader;
}((0, _abstractTemplateLoader2.default)());

exports.default = NodeTemplateLoader;
//# sourceMappingURL=nodeTemplateLoader.js.map
