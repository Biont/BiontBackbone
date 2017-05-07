'use strict';

exports.__esModule = true;

var _abstractTemplateLoader = require('./abstractTemplateLoader');

var _abstractTemplateLoader2 = _interopRequireDefault(_abstractTemplateLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ObjectTemplateLoader = function (_AbstractTemplateLoad) {
    _inherits(ObjectTemplateLoader, _AbstractTemplateLoad);

    function ObjectTemplateLoader(conf) {
        _classCallCheck(this, ObjectTemplateLoader);

        var _this = _possibleConstructorReturn(this, _AbstractTemplateLoad.call(this));

        if (!conf) {
            // return;
        }
        _this.object = conf.object || window;
        return _this;
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


    ObjectTemplateLoader.prototype.templateFound = function templateFound(name) {
        return window[this.object] && window[this.object][name];
    };

    ObjectTemplateLoader.prototype.loadTemplate = function loadTemplate(name) {
        return window[this.object][name];
    };

    return ObjectTemplateLoader;
}(_abstractTemplateLoader2.default);

exports.default = ObjectTemplateLoader;
//# sourceMappingURL=GlobalObjectTemplateLoader.js.map
