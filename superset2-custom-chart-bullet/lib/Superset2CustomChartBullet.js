"use strict";

exports.__esModule = true;
exports.default = Superset2CustomChartBullet;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@superset-ui/core");

var d3 = _interopRequireWildcard(require("d3"));

var d3Scale = _interopRequireWildcard(require("d3-scale"));

let _ = t => t,
    _t;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const categorialSchemeRegistry = (0, _core.getCategoricalSchemeRegistry)(); // The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = _core.styled.div(_t || (_t = _`
  background-color: ${0};
  padding: ${0}px;
  border-radius: ${0}px;
  height: ${0}px;
  width: ${0}px;
  position: relative;
  overflow: hidden;

  h3 {
    /* You can use your props to control CSS! */
    margin-top: 0;
    margin-bottom: ${0}px;
    font-size: ${0}px;
    font-weight: ${0};
  }

  .legend-cont {
    display: flex;
    flex-wrap: nowrap;
    align-self: end;
    height: 25px;
    width: 100%;
    position: absolute;
    right: 0%;
    left: 0%;
    top: ${0}px;
  }

  .colorBox {
    display: flex;
    position: relative;
  }

  .tickNums {
    font-weight: normal;
    position: absolute;
    bottom: -20px;
    font-size: 13px;
  }

  .ticksBottom {
    bottom: -20px;
  }

  .ticksTop {
    top: -12px;
  }
  .tickPointer {
    text-align: center;
  }

  pre {
    height: ${0}px;
  }


  .text-value{
    font-size: 12px;
    margin-top: 16px;
  }
  .indicator{
    width: 15px;
    height: 13px;
    position: absolute;
    top: 3px;
  }

  /* IE can just show/hide with no transition */
  .lte8 .wrapper .tooltip {
    display: none;
  }
  .lte8 .wrapper:hover .tooltip {
    display: block;
  }
`), ({
  theme
}) => '#ffffff', ({
  theme
}) => theme.gridUnit * 4, ({
  theme
}) => theme.gridUnit * 2, ({
  height
}) => height, ({
  width
}) => width, ({
  theme
}) => theme.gridUnit * 3, ({
  theme,
  headerFontSize
}) => theme.typography.sizes[headerFontSize], ({
  theme,
  boldText
}) => theme.typography.weights[boldText ? 'bold' : 'normal'], ({
  height
}) => parseFloat((height / 3.5).toFixed(2)) < 60 ? 15 : (height / 2.5).toFixed(2), ({
  theme,
  headerFontSize,
  height
}) => height - theme.gridUnit * 12 - theme.typography.sizes[headerFontSize]);
/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */


function Superset2CustomChartBullet(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  let colors; // let newColors;

  let domains;
  const {
    height,
    width,
    colorScheme,
    orderDesc
  } = props;
  let {
    data
  } = props;

  function creatUniqueArray() {
    const unique = [];
    const distinct = []; // const result = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].metricpossible) {
        if (!unique[data[i].metricpossible]) {
          distinct.push(data[i]);
          unique[data[i].metricpossible] = 1;
        }
      }
    }

    return distinct;
  }

  let indicatorPosition;
  let filteredRecords = [];

  if (data.length > 0) {
    if (data[0].metricpossible) {
      filteredRecords = data.filter(d => d.metricpossible === data[0].metricvalue);
    }
  }

  if (filteredRecords.length > 0) {
    indicatorPosition = filteredRecords[0].metricvalue;
  }

  orderDesc ? data.sort((a, b) => a.orderby - b.orderby) : data.sort((a, b) => b.orderby - a.orderby);
  const resultset = creatUniqueArray();
  const colorsValues = categorialSchemeRegistry.values();
  const filterColors = colorsValues.filter(c => c.id === colorScheme);

  if (filterColors[0]) {
    colors = [...filterColors[0].colors];
    colors.length = resultset.length;
  }

  const totalCount = resultset.reduce((initialValue, b) => initialValue + (b.metricpossiblevalues ? b.metricpossiblevalues : b.sum__num), 0);
  const devidedWidth = totalCount <= 100 ? (100 - totalCount) / resultset.length : 0;
  domains = [];

  if (data.length > 0) {
    if (data[0].metricpossiblevalues) {
      domains = d3.extent(data, d => d.metricpossiblevalues);
    } else {
      domains = d3.extent(data, d => d.sum__num);
    }
  } else {
    domains = d3.extent(data, d => 0);
  }

  const colorScaleEQ = d3Scale.scaleQuantize().domain([d3.min(domains), d3.max(domains)]).range(data.length > 0 ? data : []);
  const bins = colorScaleEQ.range().map(d => colorScaleEQ.invertExtent(d));
  const rootElem = /*#__PURE__*/(0, _react.createRef)();
  resultset.reduce((acc, d) => {
    const color = colorScaleEQ(d.metricpossiblevalues ? d.metricpossiblevalues : d.sum__num);

    if (acc[color]) {
      acc[color] += 1;
    } else {
      acc[color] = {};
      acc[color] = 1;
    }

    return acc;
  }, {});
  bins.reduce((acc, d, i, arr) => i === arr.length - 1 ? [...acc, d[0], d[1]] : [...acc, d[0]], []);

  const formatNum = num => {
    if (num) {
      const round = Number.parseFloat(num.metricpossiblevalues ? num.metricpossiblevalues : num.sum__num).toFixed(0);
      return round;
    }

    return 0;
  };

  const getPecentage = val => {
    const total = resultset.reduce((initialValue, b) => initialValue + (b.metricpossiblevalues ? b.metricpossiblevalues : b.sum__num), 0);
    const percent = val / total * 100;
    return percent.toFixed(2); // return Math.round((percent + Number.EPSILON) * 100) / 100;
  };

  (0, _react.useEffect)(() => {// const root = rootElem.current as HTMLElement;
  });
  const legend = resultset.map((d, i) => /*#__PURE__*/_react.default.createElement("div", {
    key: 'legend-pt-' + i.toString(),
    className: "colorBox",
    style: {
      backgroundColor: colors[i],
      flexBasis: (formatNum(resultset[i]) + devidedWidth).toString() + '%'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tickNums ticksTop tickPointer",
    style: {
      width: '100%',
      textAlign: 'center'
    }
  }, resultset[i].metricpossible === indicatorPosition ? /*#__PURE__*/_react.default.createElement("img", {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Black_triangle.svg",
    className: "indicator",
    alt: "pointer"
  }) : '', /*#__PURE__*/_react.default.createElement("div", {
    className: "text-value"
  }, parseFloat(getPecentage(resultset[i].metricpossiblevalues)) > 0 ? getPecentage(resultset[i].metricpossiblevalues) : 0, "%")), /*#__PURE__*/_react.default.createElement("div", {
    className: "tickNums tickBottom",
    style: {
      width: '100%',
      textAlign: 'center',
      top: '30px',
      fontSize: resultset[i].metricpossible.length > 20 ? '9px' : '9px'
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, resultset[i].metricpossible))));
  return /*#__PURE__*/_react.default.createElement(Styles, {
    ref: rootElem,
    boldText: props.boldText,
    headerFontSize: props.headerFontSize,
    height: height,
    width: width
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "legend-cont"
  }, legend));
}