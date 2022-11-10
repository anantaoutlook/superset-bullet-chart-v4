let _ = t => t,
    _t;

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, { useEffect, createRef } from 'react';
import { getCategoricalSchemeRegistry, styled } from '@superset-ui/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
const categorialSchemeRegistry = getCategoricalSchemeRegistry(); // The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled
// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div(_t || (_t = _`
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

export default function Superset2CustomChartBullet(props) {
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
  const rootElem = /*#__PURE__*/createRef();
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

  useEffect(() => {// const root = rootElem.current as HTMLElement;
  });
  const legend = resultset.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: 'legend-pt-' + i.toString(),
    className: "colorBox",
    style: {
      backgroundColor: colors[i],
      flexBasis: (formatNum(resultset[i]) + devidedWidth).toString() + '%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tickNums ticksTop tickPointer",
    style: {
      width: '100%',
      textAlign: 'center'
    }
  }, resultset[i].metricpossible === indicatorPosition ? /*#__PURE__*/React.createElement("img", {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Black_triangle.svg",
    className: "indicator",
    alt: "pointer"
  }) : '', /*#__PURE__*/React.createElement("div", {
    className: "text-value"
  }, parseFloat(getPecentage(resultset[i].metricpossiblevalues)) > 0 ? getPecentage(resultset[i].metricpossiblevalues) : 0, "%")), /*#__PURE__*/React.createElement("div", {
    className: "tickNums tickBottom",
    style: {
      width: '100%',
      textAlign: 'center',
      top: '30px',
      fontSize: resultset[i].metricpossible.length > 20 ? '9px' : '9px'
    }
  }, /*#__PURE__*/React.createElement("div", null, resultset[i].metricpossible))));
  return /*#__PURE__*/React.createElement(Styles, {
    ref: rootElem,
    boldText: props.boldText,
    headerFontSize: props.headerFontSize,
    height: height,
    width: width
  }, /*#__PURE__*/React.createElement("div", {
    className: "legend-cont"
  }, legend));
}