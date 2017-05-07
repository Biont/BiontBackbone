import AbstractTemplateLoader from './abstractTemplateLoader';
export default class NodeTemplateLoader extends AbstractTemplateLoader() {
    getTemplate(object) {

        let tpl;

        if (tplOverride
            &&
            (
                this.templateFound(tplOverride)
            )
        ) {
            return require(tplOverride);
        }
        console.log('fetching', object.constructor.name);
        let name = this.getTemplateNameFromObject(object)


    }

    templateFound(name) {
        return fs.existsSync(this.getLocalPath(name));
    }

    loadTemplate(name) {
        return require(this.getLocalPath(name));
    }

    getLocalPath(name) {
        return __dirname + '/' + tplDir + name + '.js'
    }
}