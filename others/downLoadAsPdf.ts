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
 import { SyntheticEvent } from 'react';
 import { t } from '@superset-ui/core';
 import { addWarningToast } from 'src/components/MessageToasts/actions';
 import { jsPDF } from 'jspdf';
 // import html2canvas from 'html2canvas';
 import kebabCase from 'lodash/kebabCase';
 import domToImage from 'dom-to-image';
 // import getImageSize from 'image-size-from-url';
 // import async from 'react-select/async';
 // import domToImage from 'dom-to-image';
 
 /**
  * @remark
  * same as https://github.com/apache/superset/blob/c53bc4ddf9808a8bb6916bbe3cb31935d33a2420/superset-frontend/src/assets/stylesheets/less/variables.less#L34
  */
 
 /**
  * generate a consistent file stem from a description and date
  *
  * @param description title or description of content of file
  * @param date date when file was generated
  */
 const GRAY_BACKGROUND_COLOR = '#DFDFDF';
 const generateFileStem = (description: string, date = new Date()) =>
   `${kebabCase(description)}-${date.toISOString().replace(/[: ]/g, '-')}`;
 
 /**
  * Create an event handler for turning an element into an image
  *
  * @param selector css selector of the parent element which should be turned into image
  * @param description name or a short description of what is being printed.
  *   Value will be normalized, and a date as well as a file extension will be added.
  * @param domToImageOptions dom-to-image Options object.
  * @param isExactSelector if false, searches for the closest ancestor that matches selector.
  * @returns event handler
  */
 export default function downloadAsPdf(
   selector: string,
   description: string,
   isExactSelector = false,
 ) {
   return (event: SyntheticEvent) => {
     const elementToPrint = isExactSelector
       ? document.querySelector(selector)
       : event.currentTarget.closest(selector);
 
     if (!elementToPrint) {
       return addWarningToast(
         t('PDF download failed, please refresh and try again.'),
       );
     }
 
     /* return html2canvas(elementToPrint as HTMLElement, {
       backgroundColor: WHITE_BACKGROUND_COLOR,
     }).then(canvas => {
       const doc = new jsPDF('p', 'mm');
       const imgData = canvas.toDataURL('image/png', 100);
       doc.addPage([canvas.width, canvas.height]);
       doc.addImage(imgData, 'PNG', 0, 0, canvas.width - 10, canvas.height);
       doc.deletePage(1);
       doc.save(`${generateFileStem(description)}.pdf`);
     }); */
 
     const getMeta = async (url: any) =>
       new Promise(function (resolve, reject) {
         const image = new Image();
         image.onload = () => {
           resolve({ width: image.width, height: image.height });
         };
         image.onerror = reject;
         image.src = url;
       });
 
     return domToImage
       .toJpeg(elementToPrint, {
         quality: 0.75,
         bgcolor: GRAY_BACKGROUND_COLOR,
       })
       .then(async dataUrl => {
         // const imageInfo: any = await getImageSize(dataUrl);
         const imageInfo: any = await getMeta(dataUrl);
         const orientationText = imageInfo.width >= imageInfo.height ? 'l' : 'p';
         const doc = new jsPDF({
           orientation: orientationText,
           unit: 'px',
           putOnlyUsedFonts: true,
           compress: true,
           hotfixes: ['px_scaling'],
         });
         doc.setFillColor(204, 204, 204, 0);
         const imgProps: any = dataUrl;
         doc.addPage([imageInfo.width, imageInfo.height]);
         doc.addImage(
           imgProps,
           'JPEG',
           15,
           15,
           imgProps.width + 35,
           imgProps.height + 25,
         );
         doc.deletePage(1);
         doc.save(`${generateFileStem(description)}.pdf`);
       })
       .catch(e => {
         console.error('Creating PDF failed', e);
       });
   };
 }
 