import * as comparePdf from 'compare-pdf';

import * as sharp from 'sharp';
import convertDoc2Pdf from './doc2pdf';
const baseDir = '/data';
import path from 'path';

const config = {
  paths: {
    actualPdfRootFolder: process.cwd() + '/data/actualPdfs',
    baselinePdfRootFolder: process.cwd() + '/data/baselinePdfs',
    // actualPdfRootFolder: process.cwd() + '/data',
    // baselinePdfRootFolder: process.cwd() + '/data',

    actualPngRootFolder: process.cwd() + '/data/actualPngs',
    baselinePngRootFolder: process.cwd() + '/data/baselinePngs',
    diffPngRootFolder: process.cwd() + '/data/diffPngs',
  },
  settings: {
    density: 100,
    quality: 70,
    tolerance: 0,
    threshold: 0.05,
    cleanPngPaths: true,
  },
  // const baseDir = '/data';
};

const compareTwoPdf = async (absPathFile1, absPathFile2) => {
  const result = await new comparePdf(config)
    .actualPdfFile(absPathFile1)
    .baselinePdfFile(absPathFile2)
    .compare();

  // console.log(result);
  // console.log('result :>> ', result);
  let TotalDiffPixels = 0;
  let TotalPixels = 0;
  let zeroPoint = false;
  // nếu giống y hệt nhau
  if (result.status === 'passed') return 1;

  await Promise.all(
    result.details.map(async (element) => {
      // nếu có lỗi -> số page làm khác nhau -> 0 đ
      if (element.error) {
        zeroPoint = true;
        return;
      }
      TotalDiffPixels += element.numDiffPixels;
      const info = await sharp(element.diffPng).metadata();
      TotalPixels += info.width * info.height;
      // console.log('info :>> ', info);
    }),
  );
  console.log(
    'TotalDiffPixels, TotalPixels :>> ',
    TotalDiffPixels,
    TotalPixels,
  );
  if (zeroPoint) return 0;
  else return (TotalPixels - TotalDiffPixels) / TotalPixels;
};

const compareDocxListVsDocx = async (arrXTest, YTest) => {
  let listOfConvertedPdfPath = [];
  const listofPromises = arrXTest.map(async (element, index) => {
    return convertDoc2Pdf(
      element,
      `convertedPdf_${index}`,
      '/data/baselinePdfs',
    );
  });
  listOfConvertedPdfPath = await Promise.all(listofPromises);

  const YTestConverted = await convertDoc2Pdf(
    YTest,
    'convertedPdf_Y',
    '/data/actualPdfs',
  );

  console.log(
    'listOfConvertedPdfPath, YTestConverted :>> ',
    listOfConvertedPdfPath,
    YTestConverted,
  );
  listOfConvertedPdfPath.map(async (element) => {
    const result = await compareTwoPdf(element, YTestConverted);
    console.log('result :>> ', result);
  });
};

// test(['test.docx'], 'Y.docx');

export { compareDocxListVsDocx };
