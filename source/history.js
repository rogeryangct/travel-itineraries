// History is compiled into the portable HTML; no account or network required.
function historyRecords(){
 const rows=C.history.records.map(r=>({...r,countries:[...r.countries],cities:[...r.cities]}));
 const covered=new Set(rows.flatMap(r=>r.tripIds||[]));
 rows.forEach(r=>{if(r.syncDates){const ts=(r.tripIds||[]).map(trip).filter(Boolean);if(ts.length){r.start=ts.map(t=>t.start).sort()[0];r.end=ts.map(t=>t.end).sort().at(-1);}}});
 C.trips.filter(t=>!covered.has(t.id)).forEach(t=>{const h=t.history||{};rows.push({id:'auto-'+t.id,title:h.title||t.title,start:h.start||t.start,end:h.end||t.end,countries:(h.countries||[t.countries[0]]).map(id=>country(id)?.english||id),cities:h.cities||[],cityVisits:h.cityVisits||[],tripIds:[t.id],source:'自動同步國家行程',note:h.note||'跨國行程預設僅計主要國家；未列明的城市不推估。'});});
 return rows.sort((a,b)=>b.start.localeCompare(a.start)||b.end.localeCompare(a.end));
}
function historyDays(a,b){return Math.max(0,Math.round((Date.parse(b)-Date.parse(a))/86400000)+1);}
function historyStats(rows,year,today){
 const lo=year==='all'?'0001-01-01':year+'-01-01',hi=year==='all'?'9999-12-31':year+'-12-31';
 const intersect=rows.filter(r=>r.start<=hi&&r.end>=lo),days=new Set(),planned=new Set(),countries=new Set(),cities=new Set();let begun=0;
 intersect.forEach(r=>{const a=r.start>lo?r.start:lo,b=r.end<hi?r.end:hi;
 for(let t=Date.parse(a);t<=Date.parse(b);t+=86400000){const d=new Date(t).toISOString().slice(0,10);planned.add(d);if(d<=today)days.add(d);}
 if(a<=today){begun++;r.countries.forEach(c=>countries.add(c));(r.cities||[]).forEach(c=>cities.add(c));(r.cityVisits||[]).filter(v=>v.date<=today&&v.date<=hi&&v.date>=lo).forEach(v=>cities.add(v.name));}
 });
 return {rows:intersect,days:days.size,planned:planned.size,trips:begun,countries:[...countries].sort(),cities:[...cities].sort()};
}
function historyPage(){
 activeTrip=null;document.title='旅遊歷程｜R & A';
 const rows=historyRecords(),q=new URLSearchParams(location.hash.split('?')[1]||''),year=q.get('year')||'all';
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const years=[...new Set(rows.flatMap(r=>Array.from({length:+r.end.slice(0,4)-+r.start.slice(0,4)+1},(_,i)=>String(+r.start.slice(0,4)+i))))].sort().reverse();
 const selected=years.includes(year)?year:'all',s=historyStats(rows,selected,today);
 if(selected==='all')s.countries=visitedCountryList(today).map(c=>c.name).sort();
 let last='';const list=s.rows.map(r=>{const y=r.start.slice(0,4),header=y!==last?'<h2 class="history-year">'+y+'</h2>':'';last=y;
 const status=r.start>today?'尚未出發':r.end>=today?'進行中':'已結束';
 return header+'<article class="history-card"><div class="history-date"><strong>'+esc(r.start.slice(5).replace('-','/'))+'</strong><small>'+esc(y)+'</small></div><div class="history-body"><div class="history-title"><h3>'+esc(r.title)+'</h3><span class="badge">'+status+'</span></div><p>'+esc(r.start)+' — '+esc(r.end)+' <b>· '+historyDays(r.start,r.end)+' 天</b></p><p class="muted">'+esc(r.countries.join(' / ')||'南極洲 · 非國家')+'</p><details><summary>交通、住宿與紀錄</summary><ul>'+(r.details||[]).map(d=>'<li>'+esc(d)+'</li>').join('')+'</ul>'+(r.note?'<p>'+esc(r.note)+'</p>':'')+'<p class="muted">來源：'+esc(r.source)+'。城市：'+esc([...(r.cities||[]),...(r.cityVisits||[]).map(v=>v.name)].filter((v,i,a)=>a.indexOf(v)===i).join('、')||'未列明')+'</p>'+(r.tripIds||[]).map(id=>trip(id)?'<a class="btn" href="'+link(trip(id))+'">查看 '+esc(country(trip(id).countries[0]).english)+' 攻略 →</a>':'').join('')+'</details></div></article>';
 }).join('');
 app.innerHTML=crumb([{label:'旅遊歷程'}])+'<div class="section-head"><div><div class="eyebrow">R & A · TRAVEL JOURNAL</div><h1>旅遊歷程</h1></div></div><nav class="history-years" aria-label="篩選年份">'+['all',...years].map(y=>'<a '+(y===selected?'aria-current="page" ':'')+'href="#history?year='+y+'">'+(y==='all'?'全部':y)+'</a>').join('')+'</nav><p class="muted">截至 '+esc(today)+' · 依已記錄行程日期計算</p><div class="history-stats">'+[['旅行天數',s.days,'重疊日期只計一次'],['旅程段數',s.trips,'已開始的國家／行程段'],['國家／地區',s.countries.length,selected==='all'?'以國旗紀錄為基準':'有日期可歸屬本年的紀錄'],['已知城市',s.cities.length,'資料未齊，非完整總數']].map(([a,b,c])=>'<div><small>'+a+'</small><strong>'+b.toLocaleString()+'</strong><span>'+c+'</span></div>').join('')+'</div><p><a class="btn primary" href="#visited-countries">國旗與英文國家清單 →</a></p><details class="panel"><summary>統計明細與計算方式</summary><p>所選範圍含未來安排共 '+s.planned+' 天、'+s.rows.length+' 段。旅行天數、段數與城市按已開始的行程計算；全部國家總數以國旗清單為基準。跨年旅程會出現在兩年的清單，天數切分到各年；單段天數含首尾，總天數去除重複。</p><p><b>國家／地區：</b>'+esc(s.countries.join('、'))+'</p><p><b>已知城市：</b>'+esc(s.cities.join('、'))+'</p><p>同國不同次旅程分段，國家與城市去重。國旗清單包含 Taiwan；Hong Kong、Macau 分別列為地區。南極洲不計國家。補入的國旗不增加旅行天數、旅程段數或城市；未有到訪日期者不分配到特定年份。2026/6/13 版 PDF 為歷史基準，另一份舊 PDF 僅用於核對，不重複匯入。</p><p>交通里程與碳排：缺少完整航段、陸路及郵輪航線，暫不估算。住宿晚數不以旅程天數代替。</p><p>新增國家攻略後，日期、天數與主要國家會自動同步；多國及城市明細依已提供的行程資料累計。</p></details><div class="section-head"><h2>旅程清單</h2><span class="muted">最新出發在上 · '+s.rows.length+' 段</span></div>'+list;
}

function visitedCountryList(today){
 const items=new Map((C.history.visitedCountries||[]).map(c=>[c.name,{...c}]));
 historyStats(historyRecords(),'all',today).countries.forEach(name=>{if(!items.has(name)){const c=C.countries.find(c=>c.english===name);items.set(name,{name,code:c?.code||''});}});
 return [...items.values()];
}
function countryFlag(code){return /^[A-Z]{2}$/.test(code)?Array.from(code,c=>String.fromCodePoint(127397+c.charCodeAt(0))).join(''):'🌐';}
function visitedCountriesPage(){
 activeTrip=null;document.title='國旗與國家清單｜R & A';
 const today=localDate(new Date(),'Europe/Bucharest'),items=visitedCountryList(today);
 app.innerHTML=crumb([{label:'旅遊歷程',href:'#history'},{label:'國旗與國家清單'}])+'<h1>國旗與國家清單</h1><p><b>'+items.length+' 個國家／地區</b> · 依你的國旗排列順序</p><p class="muted">包含 Taiwan、Hong Kong、Macau。國家名單與旅行天數分開計算；未提供到訪日期的國家只納入全部總數。</p><div class="panel flag-panel"><table class="flag-table"><thead><tr><th scope="col">#</th><th scope="col">國旗</th><th scope="col">English name</th></tr></thead><tbody>'+items.map((c,i)=>'<tr><td>'+(i+1)+'</td><td><span class="country-flag" role="img" aria-label="'+esc(c.name)+' flag">'+countryFlag(c.code)+'</span><small>'+esc(c.code)+'</small></td><td lang="en">'+esc(c.name)+'</td></tr>').join('')+'</tbody></table></div><a class="btn" href="#history">← 返回旅遊歷程</a>';
}
