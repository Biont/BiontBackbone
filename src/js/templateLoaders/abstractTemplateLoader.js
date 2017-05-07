export default class AbstractTemplateLoader {
    constructor() {
        if (this.constructor.name === 'AbstractTemplateLoader') {
            throw new TypeError("Cannot construct AbstractTemplateLoader instances directly");
        }
        ['templateFound', 'loadTemplate'].forEach((method) => {
            if (!this[method]) {
                throw new TypeError(this.constructor.name + " needs to implement method " + method);

            }
        });
    }

    getTemplate(object) {
        let tpl = this.getTemplateNameFromObject(object);
        if (!tpl) {
            console.error('Could not find template for View ' + object.constructor.name);
            return function () {
                return '<div class="tplError">MISSING TEMPLATE</div>'
            };
        }
        return this.loadTemplate(tpl);
    }

    getTemplateNameFromObject(object) {
        /**
         * Walk up the prototype chain to find matching templates
         */
        let curObject = object;
        while (curObject && curObject.constructor.name !== 'BiontView') {
            let name = curObject.constructor.name;
            if (this.templateFound(name)) {
                return name;
            }
            curObject = Object.getPrototypeOf(curObject);
        }
        return false;
    }
}
