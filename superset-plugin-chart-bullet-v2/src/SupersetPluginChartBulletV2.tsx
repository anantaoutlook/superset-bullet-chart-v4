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
import React, { useEffect } from 'react';
import { getCategoricalSchemeRegistry } from '@superset-ui/core';
import * as d3 from 'd3';
// import * as d3Scale from 'd3-scale';
import {
  SupersetPluginChartBulletV2Props,
} from './types';

const categorialSchemeRegistry = getCategoricalSchemeRegistry();
// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

// const Styles = styled.div<SupersetPluginChartBulletV2StylesProps>`
//   background-color: ${({ theme }) => '#ffffff'};
//   padding: ${({ theme }) => theme.gridUnit * 4}px;
//   border-radius: ${({ theme }) => theme.gridUnit * 2}px;
//   height: ${({ height }) => height}px;
//   width: ${({ width }) => width}px;

//   h3 {
//     /* You can use your props to control CSS! */
//     margin-top: 0;
//     margin-bottom: ${({ theme }) => theme.gridUnit * 3}px;
//     font-size: ${({ theme, headerFontSize }) =>
//       theme.typography.sizes[headerFontSize]}px;
//     font-weight: ${({ theme, boldText }) =>
//       theme.typography.weights[boldText ? 'bold' : 'normal']};
//   }
//   #chart{padding-top:100px}
//   .text-value{font-size:24px;fill:#fff;opacity:.9}
// `;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */
function groupData (data:any, total:any) {
  // use scale to get percent values
  const percent = d3.scaleLinear()
    .domain([0, total])
    .range([0, 100])
  // filter out data that has zero values
  // also get mapping for next placement
  // (save having to format data for d3 stack)
  let cumulative = 0
  const _data = data.map((d:any)=> {
    cumulative += d.count
    return {
      value: d.count,
      // want the cumulative to prior value (start of rect)
      cumulative: cumulative - d.count,
      label: d.metricvalue,
      percent: percent(d.count)
    }
  });
  return _data
}

export default function SupersetPluginChartBulletV2(
  props: SupersetPluginChartBulletV2Props,
) {
  const { data, height, width, colorScheme } = props;
  let colors: string[];
  const colorsValues = categorialSchemeRegistry.values();
  const filterColors: any = colorsValues.filter(
    (c: any) => c.id === colorScheme,
  );
  if (filterColors[0]) {
    colors = [...filterColors[0].colors];
  }
  useEffect(() => {
    stackedBar('#chart', props.data, height, width, colors);
    // const root = rootElem.current as HTMLElement;
  }, [data]);
  function stackedBar (bind: string, data:any, height: number, width: number, colors: string[]) {
    const config = {
      f: d3.format('.1f'),
      margin: {top: 60, right: 10, bottom: 20, left: 10},
      width: width,
      height: height,
      barHeight: 100,
      colors: colors,
    }
    const w = width - config.margin.left - config.margin.right
    const h = height - config.margin.top - config.margin.bottom
    const halfBarHeight = 10;
  
    const total = d3.sum(data, (d: any) => d.count);
    const _data = groupData(data, total);
    const max =  Math.max(..._data.map((b:any) => b.value));
  
    // set up scales for horizontal placement
    const xScale = d3.scaleLinear()
      .domain([0, total])
      .range([0, w])

    // create tooltip element  
    const tooltip = d3.select("body")
    .append("div")
    .attr("class","d3-tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("padding", "15px")
    .style("background", "rgba(0,0,0,0.6)")
    .style("border-radius", "5px")
    .style("color", "#fff")
    .text("a simple tooltip");
  
    // create svg in passed in div
    d3.selectAll("svg > *").remove();
    const selection = d3.select(bind)
      // .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')')
  
    // stack rect for each data value
    selection.selectAll(bind).remove();
    selection.selectAll('rect')
      .data(_data)
      .enter().append('rect')
      .attr('class', 'rect-stacked')
      .attr('x', (d: any) => xScale(d.cumulative))
      .attr('y', h / 2 - halfBarHeight)
      .attr('height', 30)
      .attr('width', (d: any) => xScale(d.value))
      .style('fill', (d, i) => colors[i])
      .on("mouseover", function(d:any, i:any) {
        tooltip.html(`${i.value}`)
        .style("visibility", "visible");
      })
      .on("mousemove", function(event:any){
        tooltip
          .style("top", (event.pageY-10)+"px")
          .style("left",(event.pageX+10)+"px");
      })
      .on("mouseout", function() {
        tooltip.html(``).style("visibility", "hidden");
      });
  
    // add values on bar
    selection.selectAll('text').remove();
    selection.selectAll('.text-value').remove();
    selection.selectAll('.text-value')
      .data(_data)
      .enter().append('text')
      .attr('class', 'text-value')
      .attr('text-anchor', 'middle')
      .attr('x', (d: any) => xScale(d.cumulative) + (xScale(d.value) / 2))
      .attr('y', (h / 2) + 5)
      .text((d: any) => d.value)
  
  
    // add the labels
    selection.selectAll('text').remove();
    selection.selectAll('.text-label').remove();
    selection.selectAll('.text-label')
      .data(_data)
      .enter().append('text')
      .attr('class', 'text-label')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('width', (d: any) => xScale(d.value))
      .attr('x', (d: any) => xScale(d.cumulative) + (xScale(d.value) / 2))
      .attr('y', (h / 2) + (10 * 1.1) + 30)
      .style('fill', '#000')
      .text((d: any) => {
        if(d.value == max){
           selection.append("svg:image")
           .attr('x',  (xScale(d.cumulative)) + (xScale(d.value) / 2))
           .attr('y',  (h / 2) + (10 * 1.1) - 30)
           .attr('text-anchor', 'middle')
           .attr('width', 14)
           .attr('height', 14)
          //  .attr("xlink:href", "./images/Black_triangle.svg")
             .attr("xlink:href", "https://upload.wikimedia.org/wikipedia/commons/3/3c/Black_triangle.svg")
        }
        return d.label
      });

    // selection.selectAll('text').remove();
    // selection.selectAll('.text-indicator').remove();
    // selection.selectAll('.text-indicator')
    //   .data(_data)
    //   .enter().append('text')
    //   .attr('class', 'text-indicator')
    //   .attr('text-anchor', 'middle')
    //   .attr('x', (d: any) => xScale(d.cumulative) + (xScale(d.value) / 2))
    //   .attr('y', (h / 2) -10)
    //   .style('fill', '#000')
    //   .text((d: any) => '>')
      // return selection;
      // (d, i) => colors[i]
  }
  return (
    <div>
      <svg id="chart"></svg>
    </div>
  )
}
