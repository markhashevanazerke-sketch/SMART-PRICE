function priceCandidates(text){
 // Join OCR-split digits only on a line ending in a currency marker.
 const marked=[...text.matchAll(/(\d[\d \u00a0]*(?:[.,]\d{2})?)\s*(?:KZT|₸|тенге|теңге|тг)/giu)].map(m=>Number(m[1].replace(/[ \u00a0]/g,'').replace(',','.')));
 const numbers=marked.length?marked:(text.match(/\b\d{2,6}(?:[.,]\d{2})?\b/g)||[]).map(s=>Number(s.replace(',','.')));
 return [...new Set(numbers.filter(n=>Number.isFinite(n)&&n>0&&n<=10000000))];
}
module.exports={priceCandidates};
