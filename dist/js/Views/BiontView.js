"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _backbone = require("backbone");

var _backbone2 = _interopRequireDefault(_backbone);

var _underscore = require("underscore");

var _templateLoader = require("../template-loader");

var _templateLoader2 = _interopRequireDefault(_templateLoader);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tplDir = '../tpl/';

var eventStorage = new Map();

var _bubble = function _bubble(view, handle, data, upwards) {
    // console.log( '_bubble', [ view.constructor.name, handle, data, upwards ] );
    if (upwards) {

        if (!view.parent) {
            return;
        }
        _trigger(view.parent, handle, data, upwards);
        _bubble(view.parent, handle, data, upwards);
    } else {
        (0, _underscore.each)(view.subViewInstances, function (child, name) {
            // console.log( 'bubbling down to ' + child.constructor.name );
            _trigger(child, handle, data, upwards);
            _bubble(child, handle, data, upwards);
        });
    }
};

var _trigger = function _trigger(view, handle, data, upwards) {
    if (!eventStorage.has(view)) {
        return;
    }
    var listeners = eventStorage.get(view);
    if (!listeners[handle]) {
        return;
    }
    listeners[handle].forEach(function (callback) {
        callback.call(undefined, data, upwards);
    });
};

var BiontView = function (_Backbone$View$extend) {
    _inherits(BiontView, _Backbone$View$extend);

    _createClass(BiontView, [{
        key: "template",

        /**
         * Make all BiontViews use our own TemplateLoader
         *
         * @returns {*}
         */
        get: function get() {
            return this.getTemplate();
        }
    }]);

    function BiontView() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, BiontView);

        var _this = _possibleConstructorReturn(this, _Backbone$View$extend.call(this, data, options));

        if (data.subViews) {
            _this.subViews = data.subViews;
        }
        _this.subViewInstances = {};
        if (data.formatters) {
            _this.formatters = data.formatters;
        }
        _this.parent = null;
        // this.subViews = data.subViews;
        if (_this.constructor.name === 'BiontView') {
            throw new TypeError("Cannot construct BiontView instances directly");
        }
        return _this;
    }

    /**
     * Retrieves a template from the DOM
     *
     * @param tplOverride
     * @returns {string}
     */


    BiontView.prototype.getTemplate = function getTemplate(tplOverride) {
        if (tplOverride && _templateLoader2.default.templateFound(tplOverride)) {
            return _templateLoader2.default.loadTemplate(tplOverride);
        }
        return _templateLoader2.default.getTemplate(this);
    };

    /**
     * Very basic render function.
     * @returns {BiontView}
     */


    BiontView.prototype.render = function render() {
        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


        if (!this.rendered || force) {
            this.$el.html(this.template(this.getTemplateData()));
            this.autoBind();
            this.rendered = true;
        }
        this.autoSubView(force);

        return this;
    };

    /**
     * Gathers all data that is passed on to the template.
     *
     * Can be overloaded by subclasses to add custom data.
     *
     * @returns {{}}
     */


    BiontView.prototype.getTemplateData = function getTemplateData() {
        var data = this.model ? this.model.toJSON() : {};
        data = this.formatData(data);
        return data;
    };

    /**
     * Apply configured subviews to their matching template tags.
     *
     * Example:
     * // View
     * class Foo extends BiontView.extend({
    *
    *     subViews: { myView: () => new BarView() }
    *
    * }){}
     *
     * // Template
     * <div cata-subview="myView"></div>
     *
     *
     * @param forced
     */


    BiontView.prototype.autoSubView = function autoSubView(forced) {
        var _this2 = this;

        $('[data-subview]', this.$el).each(function (idx, obj) {
            var $this = $(obj),
                data = $this.data();
            if (!data.subview) {
                console.error('empty subview attribute');
                return;
            }

            if (!_this2.subViews.hasOwnProperty(data.subview)) {
                return;
            }
            if (data.subviewparent && data.subviewparent !== _this2.cid) {
                console.log('no want');

                return;
            }

            var view = _this2.subViews[data.subview];
            var instance = _this2.subViewInstances[data.subview];
            if (instance && instance instanceof _backbone2.default.View) {
                if (!forced) {
                    instance.render();
                    return;
                }
                instance.remove();
                delete _this2.subViewInstances[data.subview];
            }
            if (typeof view === 'function') {
                // Support traditional and arrow functions to some extent
                view = view.call(_this2, _this2);
                view.parent = _this2;
                view.setElement($this).render(forced);
                $this.data('subviewparent', _this2.cid);
                _this2.subViewInstances[data.subview] = view;
            }
        });
    };

    /**
     * Binds model data to template tags
     *
     * Example:
     *
     * <div data-bind="name"></div> // This will keep the current value of "name" inside the container's html
     *
     * <input type='text' data-bind="name"> // This will instead set the input's value
     *
     */


    BiontView.prototype.autoBind = function autoBind() {
        var _this3 = this;

        if (!this.model) {
            return;
        }
        $('[data-bind]', this.$el).each(function (idx, obj) {
            var $this = $(obj),
                data = $this.data();
            if (!data.bind) {
                console.error('empty tag');
                return;
            }
            switch ($this.prop('tagName')) {
                case 'INPUT':
                    _this3.bindInput($this, data.bind);
                    break;
                default:
                    _this3.bindDefault($this, data.bind);
                    break;

            }
        });
    };

    BiontView.prototype.formatData = function formatData(data) {
        var _this4 = this;

        (0, _underscore.each)(data, function (value, attr) {
            data[attr] = _this4.formatAttr(attr, value);
        });
        return data;
    };

    BiontView.prototype.formatAttr = function formatAttr(attr, data) {

        if (!this.formatters[attr]) {
            return data;
        }
        return this.formatters[attr].call(this, data, this);
    };

    /**
     * Default data binding handler.
     * sets the element's html() to the specified model value.
     *
     * @param $element
     * @param attr
     */


    BiontView.prototype.bindDefault = function bindDefault($element, attr) {
        var _this5 = this;

        $element.html(this.formatAttr(attr, this.model.get(attr)));
        this.listenTo(this.model, 'change', function (model) {
            return $element.html(_this5.formatAttr(attr, model.get(attr)));
        });
    };

    /**
     * Bind data to an input field. Will try to intelligently handle all different input types
     *
     * @param $element
     * @param attr
     */


    BiontView.prototype.bindInput = function bindInput($element, attr) {
        var _this6 = this;

        switch ($element.attr('type')) {
            case 'checkbox':
                //TODO: allow setting up a [data-falsevalue="foo"] for non-boolean values?
                $element.change(function () {
                    return _this6.model.set(attr, $element.prop('checked'));
                });
                this.listenTo(this.model, 'change', function (model) {
                    $element.prop('checked', model.get(attr));
                });
                $element.prop('checked', this.model.get(attr));
                break;
            default:
                $element.change(function () {
                    return _this6.model.set(attr, $element.val());
                });
                this.listenTo(this.model, 'change', function (model) {
                    return $element.val(model.get(attr)).change();
                });
                $element.val(this.model.get(attr));
                break;
        }
    };

    /**
     * Render all model data as a string.
     */


    BiontView.prototype.dump = function dump() {
        console.log(this.model);
        return JSON.stringify(this.getTemplateData());
    };

    /**
     * Assigns a selector within the template to a specific subview, which will then get rendered
     * @param view
     * @param selector
     */


    BiontView.prototype.assign = function assign(view, selector) {
        selector = selector || '[data-subview="' + view.constructor.name + '"]';

        var $el = void 0;

        if ($el = this.$(selector, this.$el)) {
            view.setElement($el).render();
        }
    };

    /**
     * Removes the view from the DOM and also tries to deregister all event handlers
     */


    BiontView.prototype.remove = function remove() {
        this.undelegateEvents();
        _Backbone$View$extend.prototype.remove.call(this);
    };

    /**
     * Bubble an event up or down.
     * It will get passed on to all children or parents.
     *
     * @param handle
     * @param data
     * @param upwards
     */


    BiontView.prototype.bubble = function bubble(handle, data) {
        var upwards = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        _bubble(this, handle, data, upwards);
    };

    /**
     * Act on a bubbled event.
     *
     * @param handle
     * @param callback
     */


    BiontView.prototype.capture = function capture(handle, callback) {
        var listeners = void 0;
        if (eventStorage.has(this)) {
            listeners = eventStorage.get(this);
        } else {
            listeners = {};
        }

        if (!listeners[handle]) {
            listeners[handle] = [];
        }
        listeners[handle].push(callback);
        eventStorage.set(this, listeners);
        console.log(this.constructor.name + ' listening', eventStorage);
    };

    return BiontView;
}(_backbone2.default.View.extend({
    subViews: {},
    formatters: {}
}));

exports.default = BiontView;
//# sourceMappingURL=BiontView.js.map
