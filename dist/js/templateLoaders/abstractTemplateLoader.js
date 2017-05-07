'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractTemplateLoader = function () {
    function AbstractTemplateLoader() {
        var _this = this;

        _classCallCheck(this, AbstractTemplateLoader);

        if (this.constructor.name === 'AbstractTemplateLoader') {
            throw new TypeError("Cannot construct AbstractTemplateLoader instances directly");
        }
        ['templateFound', 'loadTemplate'].forEach(function (method) {
            if (!_this[method]) {
                throw new TypeError(_this.constructor.name + " needs to implement method " + method);
            }
        });
    }

    AbstractTemplateLoader.prototype.getTemplate = function getTemplate(object) {
        var tpl = this.getTemplateNameFromObject(object);
        if (!tpl) {
            console.error('Could not find template for View ' + object.constructor.name);
            return function () {
                return '<div class="tplError">MISSING TEMPLATE</div>';
            };
        }
        return this.loadTemplate(tpl);
    };

    AbstractTemplateLoader.prototype.getTemplateNameFromObject = function getTemplateNameFromObject(object) {
        /**
         * Walk up the prototype chain to find matching templates
         */
        var curObject = object;
        while (curObject && curObject.constructor.name !== 'BiontView') {
            var name = curObject.constructor.name;
            if (this.templateFound(name)) {
                return name;
            }
            curObject = Object.getPrototypeOf(curObject);
        }
        return false;
    };

    return AbstractTemplateLoader;
}();

exports.default = AbstractTemplateLoader;
//# sourceMappingURL=abstractTemplateLoader.js.map
