"use strict";

exports.__esModule = true;
exports.templates = exports.LazyLoadView = exports.ScrollSpyView = exports.ListView = exports.BiontView = undefined;

var _BiontView = require("./Views/BiontView");

var _BiontView2 = _interopRequireDefault(_BiontView);

var _ListView = require("./Views/ListView");

var _ListView2 = _interopRequireDefault(_ListView);

var _ScrollSpyView = require("./Views/ScrollSpyView");

var _ScrollSpyView2 = _interopRequireDefault(_ScrollSpyView);

var _LazyLoadView = require("./Views/LazyLoadView");

var _LazyLoadView2 = _interopRequireDefault(_LazyLoadView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var templates = [];

exports.BiontView = _BiontView2.default;
exports.ListView = _ListView2.default;
exports.ScrollSpyView = _ScrollSpyView2.default;
exports.LazyLoadView = _LazyLoadView2.default;
exports.templates = templates;
exports.default = { BiontView: _BiontView2.default, ListView: _ListView2.default, templates: templates };
//# sourceMappingURL=biont-backbone.js.map
