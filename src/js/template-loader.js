let g = window || global;
g
console.log(g.BIONT_TEMPLATE_LOADER_CONFIG);

let loader;
let conf;

if (typeof process === 'object' && process + '' === '[object process]') {
    // is node
    loader = require('./templateLoaders/nodeTemplateLoader');
}
else {
    if (window && window.BIONT_TEMPLATE_LOADER_CONFIG) {
        conf = window.BIONT_TEMPLATE_LOADER_CONFIG
    }
    if (conf) {
        switch (conf.type) {
            case'object':
                console.log('returning objectloader');
                loader = require('./templateLoaders/ObjectTemplateLoader');
                break;
            case'dom':
            default:
                console.log('returning domloader');

                loader = require('./templateLoaders/DOMTemplateLoader');
                break;


        }
    }else{
        console.log('returning default domloader');

        loader = require('./templateLoaders/DOMTemplateLoader');

    }

}

loader = new loader.default(conf);
module.exports = loader;