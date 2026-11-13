'use client';
import React,{useMemo,useState} from 'react';

type Row={store:string;city:string;amount:number};
type Snapshot={publisher:string;source_url:string;observed_at:string;retrieved_date:string;product:{name:string;quantity:number;unit:string;match_note:string;match_note_kk:string};methodology:string;methodology_kk:string;photo_evidence:boolean;currency:string;rows:Row[]};

export default function RetailSnapshot(){
 const [snapshot,setSnapshot]=useState<Snapshot|null>(null),[city,setCity]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function load(){setBusy(true);setError('');try{const r=await fetch('/smartprice/sources/retail-lactel-2026-11-02.json',{cache:'no-store'});if(!r.ok)throw new Error('Дерек қолжетімсіз');const x=await r.json();setSnapshot(x);setCity('');}catch(e:any){setError(e.message||'Дерек жүктелмеді');}finally{setBusy(false);}}
 const cities=useMemo(()=>snapshot?[...new Set(snapshot.rows.map(r=>r.city))].sort((a,b)=>a.localeCompare(b,'ru')):[],[snapshot]);
 const rows=useMemo(()=>snapshot?snapshot.rows.filter(r=>!city||r.city===city).sort((a,b)=>a.amount-b.amount):[],[snapshot,city]);
 const stats=useMemo(()=>{const a=rows.map(r=>r.amount).sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length?{min:a[0],median:a.length%2?a[m]:(a[m-1]+a[m])/2,max:a[a.length-1]}:null;},[rows]);
 return <div>
  <h3>Ашық онлайн-бағалар: сауда желілері бойынша салыстыру</h3>
  <p>Бір өнімнің бағалары 36 онлайн-желіде, бірнеше қалада. Қаланы таңдап, баға айырмасын көріңіз.</p>
  {!snapshot&&<button className="sp-btn primary" disabled={busy} onClick={load}>{busy?'Жүктелуде…':'2 қарашадағы сыртқы деректі көрсету'}</button>}
  {error&&<p role="alert">{error}</p>}
  {snapshot&&<>
   <p><strong>{snapshot.product.name}, {snapshot.product.quantity} {snapshot.product.unit}</strong> · баға күні: {snapshot.observed_at} · жарияланымға алынған: {snapshot.retrieved_date}</p>
   <p>{snapshot.methodology_kk} Бұл дерек FIELD бағаларына араластырылмайды.</p>
   <p>{snapshot.product.match_note_kk}</p>
   <p><a href={snapshot.source_url} target="_blank" rel="noreferrer">Дереккөз және әдістеме: {snapshot.publisher}</a></p>
   <label>Қала<select value={city} onChange={e=>setCity(e.target.value)}><option value="">Барлық қалалар</option>{cities.map(c=><option key={c} value={c}>{c}</option>)}</select></label>
   {stats&&<p><strong>{rows.length} баға</strong> · минимум {stats.min.toLocaleString('ru-RU')} ₸ · медиана {stats.median.toLocaleString('ru-RU')} ₸ · максимум {stats.max.toLocaleString('ru-RU')} ₸</p>}
   <div className="sp-table-wrap"><table className="sp-table"><thead><tr><th>Сауда желісі</th><th>Қала</th><th>Бағасы, ₸</th><th>Өлшем бірлігі</th></tr></thead><tbody>{rows.map((r,i)=><tr key={`${r.store}-${r.city}-${i}`}><td>{r.store}</td><td>{r.city}</td><td className="sp-price">{r.amount.toLocaleString('ru-RU')}</td><td>{snapshot.product.unit}</td></tr>)}</tbody></table></div>
  </>}
 </div>;
}
