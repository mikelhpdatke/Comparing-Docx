import { convert } from 'libreoffice-convert';

import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const convertDoc2Pdf = async (docxFile, outputFilename, outputDir) => {
  const enterPath = join(process.cwd(), `/${docxFile}`);
  const outputPath = join(process.cwd(), `/${outputDir}.pdf`);
  const file = readFileSync(enterPath);

  return new Promise((resolve, reject) =>
    convert(file, '.pdf', undefined, (err, done) => {
      if (err) {
        console.log(`Error converting file: ${err}`);
        reject(err);
      }
      // Here in done you have pdf file which you can save or transfer in another stream
      writeFileSync(outputPath, done);
      resolve(outputPath);
    }),
  );
};

export default convertDoc2Pdf;
