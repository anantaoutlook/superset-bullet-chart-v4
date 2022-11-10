"use strict";

exports.__esModule = true;
exports.default = setupColors;

var _colorScheme = _interopRequireDefault(require("./colorScheme"));

var _core = require("@superset-ui/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupColors() {
  const categoricalSchemeRegistry = (0, _core.getCategoricalSchemeRegistry)();
  [_colorScheme.default].forEach(group => {
    group.forEach(scheme => {
      categoricalSchemeRegistry.registerValue(scheme.id, scheme);
    });
  });
  categoricalSchemeRegistry.setDefaultKey('bulletColors');
}