"use strict";

exports.__esModule = true;
exports.default = void 0;

var _colorSchemeRegistry = _interopRequireDefault(require("./colorSchemeRegistry"));

var _core = require("@superset-ui/core");

var _chartControls = require("@superset-ui/chart-controls");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// import {
//   t,
//   getCategoricalSchemeRegistry,
//   getSequentialSchemeRegistry,
//   legacyValidateInteger,
//   validateNonEmpty,
// } from '@superset-ui/core';
(0, _colorSchemeRegistry.default)();
const sequentialSchemeRegistry = (0, _core.getCategoricalSchemeRegistry)();
let arrayUniqueByKey = [...new Map(sequentialSchemeRegistry.values().map(item => [item.id, item])).values()];
console.log("schemes", sequentialSchemeRegistry.getMap());
arrayUniqueByKey = arrayUniqueByKey.filter(sc => sc.id.startsWith('_'));
console.log("arrayUniqueByKey", arrayUniqueByKey);
const config = {
  /**
   * The control panel is split into two tabs: "Query" and
   * "Chart Options". The controls that define the inputs to
   * the chart data request, such as columns and metrics, usually
   * reside within "Query", while controls that affect the visual
   * appearance or functionality of the chart are under the
   * "Chart Options" section.
   *
   * There are several predefined controls that can be used.
   * Some examples:
   * - groupby: columns to group by (tranlated to GROUP BY statement)
   * - series: same as groupby, but single selection.
   * - metrics: multiple metrics (translated to aggregate expression)
   * - metric: sane as metrics, but single selection
   * - adhoc_filters: filters (translated to WHERE or HAVING
   *   depending on filter type)
   * - row_limit: maximum number of rows (translated to LIMIT statement)
   *
   * If a control panel has both a `series` and `groupby` control, and
   * the user has chosen `col1` as the value for the `series` control,
   * and `col2` and `col3` as values for the `groupby` control,
   * the resulting query will contain three `groupby` columns. This is because
   * we considered `series` control a `groupby` query field and its value
   * will automatically append the `groupby` field when the query is generated.
   *
   * It is also possible to define custom controls by importing the
   * necessary dependencies and overriding the default parameters, which
   * can then be placed in the `controlSetRows` section
   * of the `Query` section instead of a predefined control.
   *
   * import { validateNonEmpty } from '@superset-ui/core';
   * import {
   *   sharedControls,
   *   ControlConfig,
   *   ControlPanelConfig,
   * } from '@superset-ui/chart-controls';
   *
   * const myControl: ControlConfig<'SelectControl'> = {
   *   name: 'secondary_entity',
   *   config: {
   *     ...sharedControls.entity,
   *     type: 'SelectControl',
   *     label: t('Secondary Entity'),
   *     mapStateToProps: state => ({
   *       sharedControls.columnChoices(state.datasource)
   *       .columns.filter(c => c.groupby)
   *     })
   *     validators: [validateNonEmpty],
   *   },
   * }
   *
   * In addition to the basic drop down control, there are several predefined
   * control types (can be set via the `type` property) that can be used. Some
   * commonly used examples:
   * - SelectControl: Dropdown to select single or multiple values,
       usually columns
   * - MetricsControl: Dropdown to select metrics, triggering a modal
       to define Metric details
   * - AdhocFilterControl: Control to choose filters
   * - CheckboxControl: A checkbox for choosing true/false values
   * - SliderControl: A slider with min/max values
   * - TextControl: Control for text data
   *
   * For more control input types, check out the `incubator-superset` repo
   * and open this file: superset-frontend/src/explore/components/controls/index.js
   *
   * To ensure all controls have been filled out correctly, the following
   * validators are provided
   * by the `@superset-ui/core/lib/validator`:
   * - validateNonEmpty: must have at least one value
   * - validateInteger: must be an integer value
   * - validateNumber: must be an intger or decimal value
   */
  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [_chartControls.sections.legacyTimeseriesTime, {
    label: (0, _core.t)('Query'),
    expanded: true,
    controlSetRows: [[{
      name: 'cols',
      config: _extends({}, _chartControls.sharedControls.groupby, {
        label: (0, _core.t)('Columns'),
        description: (0, _core.t)('Columns to group by')
      })
    }], [{
      name: 'metrics',
      config: _extends({}, _chartControls.sharedControls.metrics)
    }],
    /* [
      {
        name: 'organization',
        config: {
          ...sharedControls.columns,
          label: t('Columns'),
          description: t('Select orgnisation'),
          
        },
      },
    ], */
    ['adhoc_filters'],
    /*  [
       {
         name: 'organization_name',
         config: {
           type: 'SelectControl',
           label: t('Organization Name'),
           // default: 'a',
           choices: [
             ['a', 'a'],
             ['b', 'b'],
             ['c', 'c'],
             ['d', 'd'],
             ['e', 'e'],
             ['f', 'f'],
             ['g', 'g'],
             ['h', 'h'],
             ['i', 'i'],
             ['j', 'j'],
             ['k', 'k'],
             ['l', 'l'],
             ['m', 'm'],
             ['n', 'n'],
             ['o', 'o'],
             ['p', 'p'],
             ['q', 'q'],
             ['r', 'r'],
             ['s', 's'],
             ['t', 't'],
             ['u', 'u'],
             ['v', 'v'],
             ['w', 'w'],
             ['x', 'x'],
             ['y', 'y'],
             ['z', 'z'],
             ['aa', 'aa'],
             ['ab', 'ab'],
             ['ac', 'ac'],
             ['ad', 'ad'],
             ['ae', 'ae'],
           ],
           renderTrigger: true,
           description: t('List of organizations'),
         },
       },
     ], */
    [{
      name: 'row_limit',
      config: _extends({}, _chartControls.sharedControls.row_limit)
    }]]
  }, {
    label: (0, _core.t)('Hello Controls!'),
    expanded: true,
    controlSetRows: [[{
      name: 'header_text',
      config: {
        type: 'TextControl',
        default: 'Hello, World!',
        renderTrigger: true,
        // ^ this makes it apply instantaneously, without triggering a "run query" button
        label: (0, _core.t)('Header Text'),
        description: (0, _core.t)('The text you want to see in the header')
      }
    }], [{
      name: 'bold_text',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Bold Text'),
        renderTrigger: true,
        default: true,
        description: (0, _core.t)('A checkbox to make the ')
      }
    }], [{
      name: 'header_font_size',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Font Size'),
        default: 'xl',
        choices: [// [value, label]
        ['xxs', 'xx-small'], ['xs', 'x-small'], ['s', 'small'], ['m', 'medium'], ['l', 'large'], ['xl', 'x-large'], ['xxl', 'xx-large']],
        renderTrigger: true,
        description: (0, _core.t)('The size of your header font')
      }
    }], [{
      name: 'color_scheme',
      config: {
        type: 'ColorSchemeControl',
        label: (0, _core.t)('Linear color scheme'),
        choices: () => arrayUniqueByKey.map(value => [value.id, value.label]),
        default: sequentialSchemeRegistry.getDefaultKey(),
        clearable: false,
        description: '',
        renderTrigger: true,
        schemes: () => sequentialSchemeRegistry.getMap(),
        isLinear: false
      }
    }]]
  }]
};
var _default = config;
exports.default = _default;