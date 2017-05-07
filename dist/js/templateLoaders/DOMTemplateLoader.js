'use strict';

exports.__esModule = true;

var _abstractTemplateLoader = require('./abstractTemplateLoader');

var _abstractTemplateLoader2 = _interopRequireDefault(_abstractTemplateLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DOMTemplateLoader = function (_AbstractTemplateLoad) {
    _inherits(DOMTemplateLoader, _AbstractTemplateLoad);

    function DOMTemplateLoader() {
        _classCallCheck(this, DOMTemplateLoader);

        return _possibleConstructorReturn(this, _AbstractTemplateLoad.apply(this, arguments));
    }

    // getTemplate(tplOverride) {
    //     let tpl;
    //
    //     /**
    //      * Try to find a given override first
    //      */
    //     if (tplOverride && (tpl = document.getElementById(tplOverride))) {
    //         return tpl.innerHTML;
    //     }
    //
    //     /**
    //      * Walk up the prototype chain to find matching templates
    //      */
    //     let curObject = this;
    //     while (curObject && curObject.constructor.name !== 'BiontView') {
    //         if (tpl = document.getElementById(curObject.constructor.name)) {
    //             return tpl.innerHTML;
    //         }
    //         curObject = Object.getPrototypeOf(curObject);
    //     }
    //
    //
    //     console.error('Could not find template for View ' + this.constructor.name);
    //     return '<div class="tplError">MISSING TEMPLATE</div>';
    // }

    DOMTemplateLoader.prototype.templateFound = function templateFound(name) {
        return !!document.getElementById(name);
    };

    DOMTemplateLoader.prototype.loadTemplate = function loadTemplate(name) {
        var tpl = document.getElementById(name);
        return tpl.innerHTML;
    };

    return DOMTemplateLoader;
}(_abstractTemplateLoader2.default);

exports.default = DOMTemplateLoader;
//# sourceMappingURL=DOMTemplateLoader.js.map
