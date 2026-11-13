const fs=require('node:fs'),path=require('node:path');const target='public/smartprice/ocr';fs.mkdirSync(target,{recursive:true});
fs.copyFileSync('node_modules/tesseract.js/dist/worker.min.js',path.join(target,'worker.min.js'));
for(const name of fs.readdirSync('node_modules/tesseract.js-core'))if(/\.wasm(\.js)?$/.test(name))fs.copyFileSync(path.join('node_modules/tesseract.js-core',name),path.join(target,name));
for(const lang of ['rus','eng','kaz']){const root=`node_modules/@tesseract.js-data/${lang}`;const files=fs.readdirSync(root,{recursive:true}).map(String);const file=files.find(n=>n.includes('4.0.0_best_int')&&n.endsWith('.traineddata.gz'))||files.find(n=>n.endsWith('.traineddata.gz'));if(!file)throw new Error('Language data missing '+lang);fs.copyFileSync(path.join(root,file),path.join(target,lang+'.traineddata.gz'));}
console.log('OCR assets copied locally');
