import Backbone from "backbone";
import {each, extend, result, mapObject} from "underscore";

import Tpl from '../template-loader';

const eventStorage = new Map();


const _bubble = (view, handle, data, upwards) => {
    // console.log( '_bubble', [ view.constructor.name, handle, data, upwards ] );
    if (upwards) {

        if (!view.parent) {
            return;
        }
        _trigger(view.parent, handle, data, upwards);
        _bubble(view.parent, handle, data, upwards);
    } else {
        each(view.subViewInstances, (child, name) => {
            // console.log( 'bubbling down to ' + child.constructor.name );
            _trigger(child, handle, data, upwards);
            _bubble(child, handle, data, upwards);
        });
    }

};

const _trigger = (view, handle, data, upwards) => {
    if (!eventStorage.has(view)) {
        return;
    }
    let listeners = eventStorage.get(view);
    if (!listeners[handle]) {
        return;
    }
    listeners[handle].forEach((callback) => {
        callback.call(this, data, upwards);
    });
};

export default class BiontView extends Backbone.View.extend({
    subViews: {},
    formatters: {}
}) {
    /**
     * Make all BiontViews use our own TemplateLoader
     *
     * @returns {*}
     */
    get template() {
        return this.getTemplate()
    }

    constructor(data = {}, options = {}) {
        super(data, options);
        if (data.subViews) {
            this.subViews = data.subViews;
        }
        this.subViewInstances = {};
        if (data.formatters) {
            this.formatters = data.formatters;
        }
        this.parent = null;
        // this.subViews = data.subViews;
        if (this.constructor.name === 'BiontView') {
            throw new TypeError("Cannot construct BiontView instances directly");
        }
    }

    /**
     * Retrieves a template from the DOM
     *
     * @param tplOverride
     * @returns {string}
     */
    getTemplate(tplOverride) {
        if (tplOverride
            &&
            (
                Tpl.templateFound(tplOverride)
            )
        ) {
            return Tpl.loadTemplate(tplOverride);
        }
        return Tpl.getTemplate(this);
    }

    /**
     * Very basic render function.
     * @returns {BiontView}
     */
    render(force = false) {

        if (!this.rendered || force) {
            this.$el.html(this.template(this.getTemplateData()));
            this.autoBind();
            this.rendered = true;
        }
        this.autoSubView(force);

        return this;
    }

    /**
     * Gathers all data that is passed on to the template.
     *
     * Can be overloaded by subclasses to add custom data.
     *
     * @returns {{}}
     */
    getTemplateData() {
        let data = this.model ? this.model.toJSON() : {};
        data = this.formatData(data);
        return data;
    }

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
    autoSubView(forced) {
        $('[data-subview]', this.$el).each((idx, obj) => {
            let $this = $(obj), data = $this.data();
            if (!data.subview) {
                console.error('empty subview attribute');
                return;
            }

            let subViews = result(this,'subViews');

            if (!subViews.hasOwnProperty(data.subview)) {
                return;
            }
            if (data.subviewparent && data.subviewparent !== this.cid) {
                console.log('no want');

                return;
            }

            let view = subViews[data.subview];

            if (!this.shouldRenderSubView(data.subview, view, $this, forced)) {
                return;
            }

            this.renderSubView(data.subview, view, $this, forced);
        });
    }


    shouldRenderSubView(view) {
        return true;
    }

    renderSubView(handle, view, $element, forced) {
        let instance = this.subViewInstances[handle];
        if (instance && instance instanceof Backbone.View) {
            if (!forced) {
                instance.render();
                return;
            }
            instance.remove();
            delete this.subViewInstances[handle];

        }
        if (typeof view === 'function') {
            // Support traditional and arrow functions to some extent
            view = view.call(this, this);
            view.parent = this;
            view.setElement($element).render(forced);
            $element.data('subviewparent', this.cid);
            this.subViewInstances[handle] = view;
        }

    }

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
    autoBind() {
        if (!this.model) {
            return;
        }
        $('[data-bind]', this.$el).each((idx, obj) => {
            let $this = $(obj), data = $this.data();
            if (!data.bind) {
                console.error('empty tag');
                return;
            }
            switch ($this.prop('tagName')) {
                case 'INPUT':
                    this.bindInput($this, data.bind);
                    break;
                default:
                    this.bindDefault($this, data.bind);
                    break;

            }
        });
    }

    formatData(data) {

        each(data, (value, attr) => {
            data[attr] = this.formatAttr(attr, value)
        });
        return data;
    }

    formatAttr(attr, data) {

        if (!this.formatters[attr]) {
            return data;
        }
        return this.formatters[attr].call(this, data, this);
    }

    /**
     * Default data binding handler.
     * sets the element's html() to the specified model value.
     *
     * @param $element
     * @param attr
     */
    bindDefault($element, attr) {
        $element.html(this.formatAttr(attr, this.model.get(attr)));
        this.listenTo(this.model, 'change', (model) => $element.html(this.formatAttr(attr, model.get(attr))));
    }

    /**
     * Bind data to an input field. Will try to intelligently handle all different input types
     *
     * @param $element
     * @param attr
     */
    bindInput($element, attr) {
        switch ($element.attr('type')) {
            case 'checkbox':
                //TODO: allow setting up a [data-falsevalue="foo"] for non-boolean values?
                $element.change(() => this.model.set(attr, $element.prop('checked')));
                this.listenTo(this.model, 'change', (model) => {
                    $element.prop('checked', (
                        model.get(attr)
                    ));
                });
                $element.prop('checked', (
                    this.model.get(attr)
                ));
                break;
            default:
                $element.change(() => this.model.set(attr, $element.val()));
                this.listenTo(this.model, 'change', (model) => $element.val(model.get(attr)).change());
                $element.val(this.model.get(attr));
                break;
        }
    }

    /**
     * Render all model data as a string.
     */
    dump() {
        console.log(this.model);
        return JSON.stringify(this.getTemplateData());
    }

    /**
     * Assigns a selector within the template to a specific subview, which will then get rendered
     * @param view
     * @param selector
     */
    assign(view, selector) {
        selector = selector || '[data-subview="' + view.constructor.name + '"]';

        let $el;

        if ($el = this.$(selector, this.$el)) {
            view.setElement($el).render();

        }
    }

    /**
     * Removes the view from the DOM and also tries to deregister all event handlers
     */
    remove() {
        this.undelegateEvents();
        super.remove();
    }

    /**
     * Bubble an event up or down.
     * It will get passed on to all children or parents.
     *
     * @param handle
     * @param data
     * @param upwards
     */
    bubble(handle, data, upwards = true) {
        _bubble(this, handle, data, upwards);
    }

    /**
     * Act on a bubbled event.
     *
     * @param handle
     * @param callback
     */
    capture(handle, callback) {
        let listeners;
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
    }

}