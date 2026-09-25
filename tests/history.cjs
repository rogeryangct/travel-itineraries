const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=JSON.parse(fs.readFileSync('source/catalog.json'));C.history=JSON.parse(fs.readFileSync('source/history.json'));
const ctx={C,trip:id=>C.trips.find(t=>t.id===id),country:id=>C.countries.find(c=>c.id===id)};vm.createContext(ctx);vm.runInContext(fs.readFileSync('source/history.js','utf8'),ctx);
const r=[{start:'2025-12-30',end:'2026-01-02',countries:['Japan'],cities:['Tokyo']},{start:'2026-01-02',end:'2026-01-04',countries:['Japan'],cities:['Tokyo']}];
const all=ctx.historyStats(r,'all','2026-01-03'),year=ctx.historyStats(r,'2026','2026-01-03');
assert.equal(all.days,5);assert.equal(all.planned,6);assert.equal(year.days,3);assert.equal(year.planned,4);assert.equal(all.countries.length,1);assert.equal(all.cities.length,1);
assert.equal(ctx.historyRecords().length,89);
C.trips.push({id:'test',title:'Future country',start:'2027-01-01',end:'2027-01-03',countries:['romania'],history:{cityVisits:[{name:'Future City',date:'2027-01-02'}]}});
let a=ctx.historyRecords().find(r=>r.id==='auto-test');assert.equal(a.end,'2027-01-03');assert.equal(ctx.historyStats([a],'all','2026-09-25').days,0);assert.equal(ctx.historyStats([a],'all','2027-01-01').cities.length,0);assert.equal(ctx.historyStats([a],'all','2027-01-02').cities.length,1);
C.trips.find(t=>t.id==='romania-2026').end='2026-10-04';assert.equal(ctx.historyRecords().find(r=>r.id==='2026-romania').end,'2026-10-04');
for(const row of C.history.records){assert.ok(row.start<=row.end);if(row.reportedDays)assert.equal(ctx.historyDays(row.start,row.end),row.reportedDays,row.title);}
console.log('PASS: 76 PDF records; 89 merged segments; date union, cross-year, future city, automatic additions and linked date updates.');
