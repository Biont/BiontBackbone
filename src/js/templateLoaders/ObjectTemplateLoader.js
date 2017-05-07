import AbstractTemplateLoader from './abstractTemplateLoader';
export default class ObjectTemplateLoader extends AbstractTemplateLoader {
    constructor(conf) {
        super();
        if (!conf) {
            // return;
        }
        this.object = conf.object || window;
        console.log('Loader!', this.object);
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


    templateFound(name) {
        return this.object[name];
    }

    loadTemplate(name) {
        return this.object[name];
    }
}