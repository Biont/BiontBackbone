import AbstractTemplateLoader from "./abstractTemplateLoader";
import fs from "fs";
export default class NodeTemplateLoader extends AbstractTemplateLoader {
	constructor( args ) {
		super();
		this.tplDir = args.tplDir || __dirname + '/' + name + '.js'
		console.log( this.tplDir );
	}

	templateFound( name ) {
		return fs.existsSync( this.getLocalPath( name ) );
	}

	loadTemplate( name ) {
		return require( this.getLocalPath( name ) );
	}

	getLocalPath( name ) {
		return this.tplDir + name + '.js'
	}
}