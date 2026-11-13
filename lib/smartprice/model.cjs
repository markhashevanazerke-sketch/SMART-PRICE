const artifact=require('./model-artifact.json');
function features(current,previous,market=[]){const sorted=market.filter(x=>Number.isFinite(x)&&x>0).sort((a,b)=>a-b);const median=sorted.length?sorted[Math.floor(sorted.length/2)]:null;return [1,previous?Math.min(3,Math.abs(current/previous-1)):0,median?Math.min(3,Math.abs(current/median-1)):0,previous?1:0,sorted.length>=3?1:0];}
function score(x,w){const z=x.reduce((s,v,i)=>s+v*w[i],0);return 1/(1+Math.exp(-z));}
function predict(current,previous,market){const probability=score(features(current,previous,market),artifact.weights);return {probability,flag:probability>=artifact.threshold,version:artifact.version,experimental:true,note:'Модель обучена на синтетических сценариях. Решение принимает аналитик.'};}
module.exports={features,score,predict,artifact};
