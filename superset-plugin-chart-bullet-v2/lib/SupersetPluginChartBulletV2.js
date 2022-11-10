"use strict";

exports.__esModule = true;
exports.default = SupersetPluginChartBulletV2;

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
    height: 5vh;
    width: 100%;
    margin: 20% 3% 0% 2%;
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

  .wrapper {
    text-transform: uppercase;
    color: #000;
    cursor: help;
    font-size: 20px;
    margin: 0 auto;
    position: relative;
    text-align: center;
    -webkit-transform: translateZ(0); /* webkit flicker fix */
    -webkit-font-smoothing: antialiased; /* webkit text rendering fix */
  }

  .wrapper .tooltip {
    background: #fff;
    bottom: 100%;
    color: #000;
    display: block;
    left: 0;
    margin-bottom: 15px;
    opacity: 0;
    padding: 10px;
    text-align: center;
    pointer-events: none;
    position: absolute;
    width: 100px;
    border-radius: 5px;
    border: solid #000 1px;
    -webkit-transform: translateY(10px);
    -moz-transform: translateY(10px);
    -ms-transform: translateY(10px);
    -o-transform: translateY(10px);
    transform: translateY(10px);
    -webkit-transition: all 0.25s ease-out;
    -moz-transition: all 0.25s ease-out;
    -ms-transition: all 0.25s ease-out;
    -o-transition: all 0.25s ease-out;
    transition: all 0.25s ease-out;
    -webkit-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    -moz-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    -ms-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    -o-box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.28);
  }

  /* This bridges the gap so you can mouse into the tooltip without it disappearing */
  .wrapper .tooltip:before {
    bottom: -20px;
    content: ' ';
    display: block;
    height: 20px;
    left: 0;
    position: absolute;
    width: 100%;
  }

  .wrapper:hover .tooltip {
    opacity: 1;
    pointer-events: auto;
    -webkit-transform: translateY(0px);
    -moz-transform: translateY(0px);
    -ms-transform: translateY(0px);
    -o-transform: translateY(0px);
    transform: translateY(0px);
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


function SupersetPluginChartBulletV2(props) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  let colors; // let newColors;

  let domains;
  const {
    data,
    height,
    width,
    colorScheme
  } = props;
  console.log("props", props);
  /* function getIndicator(selectedMatric: any) {
     for (let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
       for (
         let indicatorIndex = 0;
         indicatorIndex < indicatorData.length;
         indicatorIndex += 1
       ) {
         if (
           data[dataIndex][selectedMatric] ===
           indicatorData[indicatorIndex][selectedMatric]
         ) {
           return indicatorData[indicatorIndex][selectedMatric];
         }
       }
     }
     return '';
   } */

  const colorsValues = categorialSchemeRegistry.values();
  const filterColors = colorsValues.filter(c => c.id === colorScheme);

  if (filterColors[0]) {
    colors = [...filterColors[0].colors];
    colors.length = data.length;
  } // const colorsArray = filterColors.length === 1 ? filterColors[0].colors : filterColors[1].colors;


  const totalCount = data.reduce((initialValue, b) => initialValue + (b.count ? b.count : b.sum__num), 0);
  const devidedWidth = totalCount <= 100 ? (100 - totalCount) / data.length : 0; // colors = colorsArray

  /* if (colors.length < data.length) {
    newColors =
      colors.length < 5
        ? d3Scale
            .scaleLinear<string>()
            .domain([1, 10])
            .range([colors[0], colors[colors.length - 2]])
        : d3Scale.scaleLinear<string>().domain([1, 10]).range(colors);
    const new_colors_array: string[] = [];
    const const_data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = 0; i < data.length; i += 1) {
      const col: string = newColors(const_data[i]);
      new_colors_array.push(col);
    }
     if (colors.length > 5) {
      for (let i = 0; i < data.length - colors.length; i += 1) {
        colors.unshift(new_colors_array[new_colors_array.length - 1 - i]);
      }
    } else {
      colors = new_colors_array.reverse();
    }
    colors = new_colors_array;
  } */

  function getIndicator(type) {
    return Math.max(...data.map(b => b.count ? b.count : b.sum__num));
  }

  let indicatorPosition = 0;
  domains = [];

  if (data[0].count) {
    domains = d3.extent(data, d => d.count);
    indicatorPosition = getIndicator('count');
  } else {
    domains = d3.extent(data, d => d.sum__num);
    indicatorPosition = getIndicator('sum__num');
  }

  const colorScaleEQ = d3Scale.scaleQuantize().domain([d3.min(domains), d3.max(domains)]).range(data);
  const bins = colorScaleEQ.range().map(d => colorScaleEQ.invertExtent(d));
  const rootElem = /*#__PURE__*/(0, _react.createRef)();
  data.reduce((acc, d) => {
    const color = colorScaleEQ(d.count ? d.count : d.sum__num);

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
      const round = Number.parseFloat(num.count ? num.count : num.sum__num).toFixed(0);
      return round;
    }

    return 0;
  };

  (0, _react.useEffect)(() => {// const root = rootElem.current as HTMLElement;
  });
  const legend = data.map((d, i) => /*#__PURE__*/_react.default.createElement("div", {
    key: 'legend-pt-' + i.toString(),
    className: "colorBox wrapper",
    style: {
      backgroundColor: colors[i],
      flexBasis: (formatNum(data[i]) + devidedWidth).toString() + '%'
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tooltip"
  }, data[i].count ? data[i].count : data[i].sum__num), /*#__PURE__*/_react.default.createElement("div", {
    className: "tickNums ticksTop tickPointer",
    style: {
      width: '100%',
      textAlign: 'center'
    }
  }, data[i][data[i].count ? 'count' : 'sum__num'] === indicatorPosition ? /*#__PURE__*/_react.default.createElement("img", {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Black_triangle.svg",
    style: {
      width: '15px',
      height: '15px',
      margin: '-10px 50%'
    },
    alt: "pointer"
  }) : ''), /*#__PURE__*/_react.default.createElement("div", {
    className: "tickNums tickBottom",
    style: {
      width: '100%',
      textAlign: 'center',
      bottom: data[i].metricvalue.length > 20 ? '-100px' : '-20px',
      fontSize: data[i].metricvalue.length > 20 ? '9px' : '9px'
    }
  }, /*#__PURE__*/_react.default.createElement("div", null, data[i].metricvalue))));
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