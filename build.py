#!/usr/bin/env python3
"""Compile the complete, portable travel website to one index.html. No dependencies."""
from pathlib import Path
import json,re,html

ROOT=Path(__file__).resolve().parent
SRC=ROOT/'source'
def esc(s):return html.escape(str(s),quote=True)
def url(s):
    if s and not s.startswith('https://'):raise ValueError('External links must use https: '+s)
    return esc(s)
def scope_css(css):
    out=[];p=0
    while p<len(css):
        start=css.find('{',p)
        if start<0:break
        selector=css[p:start].strip();level=1;end=start+1
        while end<len(css) and level:
            if css[end]=='{':level+=1
            elif css[end]=='}':level-=1
            end+=1
        body=css[start+1:end-1]
        if selector.startswith('@'):out.append(selector+'{'+scope_css(body)+'}')
        else:
            selectors=[]
            for s in selector.split(','):
                s=s.strip()
                s=re.sub(r'^(:root|html|body)(?=\b|[:\s.#]|$)', '.legacy',s)
                if not s.startswith('.legacy'):s='.legacy '+s
                selectors.append(s)
            out.append(','.join(selectors)+'{'+body+'}')
        p=end
    return '\n'.join(out)
def render_structured(t,d):
    parts=['<nav>'+''.join('<a href="#'+esc(x['id'])+'">'+esc(x['date'][5:])+' '+esc(x['label'])+'</a>' for x in t['days'])+'<a href="#budget">費用</a><a href="#guidebook">景點導覽</a><a href="#sources">來源</a></nav><main>']
    guides=[]
    for day in d['days']:
        parts.append('<section class="day" id="'+esc(day['id'])+'"><span class="tag">'+esc(day['date'])+'</span><h2>'+esc(day['title'])+'</h2><p>'+esc(day.get('summary',''))+'</p>')
        for stop in day['stops']:
            sid=stop['id'];gid='guide-'+sid
            parts.append('<div class="slot" id="'+esc(sid)+'"><div class="time">'+esc(stop['time'])+'</div><div><h3>'+esc(stop['name'])+'</h3><p>'+esc(stop['description'])+'</p>')
            if stop.get('transport'):parts.append('<p><b>交通：</b>'+esc(stop['transport'])+'</p>')
            if stop.get('cost'):parts.append('<p><b>費用：</b>'+esc(stop['cost'])+'</p>')
            if stop.get('map'):parts.append('<a class="map" href="'+url(stop['map'])+'" target="_blank" rel="noopener">Google Maps</a>')
            if stop.get('official'):parts.append('<a class="map" href="'+url(stop['official'])+'" target="_blank" rel="noopener">官方資訊</a>')
            if stop.get('guide'):
                parts.append('<a class="guide-link" href="#'+esc(gid)+'">導覽</a>');g=stop['guide']
                guides.append('<details class="guide-card" id="'+esc(gid)+'"><summary>'+esc(stop['name'])+'｜導覽</summary>'+''.join('<h3>'+esc(k)+'</h3><p>'+esc(v)+'</p>' for k,v in [('現場看什麼',g.get('see','')),('歷史背景',g.get('history','')),('相關故事',g.get('story','')),('實用提醒',g.get('tips',''))] if v)+'<a class="guide-return" href="#'+esc(sid)+'">回到行程</a></details>')
            if stop.get('booking'):parts.append('<p><b>預約：</b>'+esc(stop['booking'])+'</p>')
            parts.append('</div></div>')
        for key,title in [('rainPlan','雨天備案'),('cutPlan','延誤時怎麼刪減')]:
            if day.get(key):parts.append('<div class="soft"><b>'+title+'</b><p>'+esc(day[key])+'</p></div>')
        parts.append('</section>')
    parts.append('<section id="budget"><h2>費用與預算</h2><div class="tablewrap"><table><thead><tr><th>項目</th><th>價格</th><th>計價單位</th><th>確認狀態</th></tr></thead><tbody>')
    for b in d.get('budget',[]):parts.append('<tr>'+''.join('<td>'+esc(b.get(k,''))+'</td>' for k in ['item','amount','unit','status'])+'</tr>')
    parts.append('</tbody></table></div><p>'+esc(d.get('budgetNote',''))+'</p></section><section id="guidebook"><h2>景點導覽</h2>'+''.join(guides)+'</section><section id="sources"><h2>查核來源</h2><ul>')
    for s in d.get('sources',[]):parts.append('<li><a href="'+url(s['url'])+'" target="_blank" rel="noopener">'+esc(s['title'])+'</a> · '+esc(s['checked'])+'</li>')
    return ''.join(parts)+'</ul></section></main>'

def build():
    catalog=json.loads((SRC/'catalog.json').read_text())
    ids=set();country_ids={c['id'] for c in catalog['countries']}
    if len(country_ids)!=len(catalog['countries']):raise ValueError('Duplicate country IDs')
    for c in catalog['countries']:
        if not re.fullmatch(r'[a-z0-9-]+',c['id']):raise ValueError('Use lowercase country slugs')
    templates=[]
    for t in catalog['trips']:
        if not re.fullmatch(r'[a-z0-9-]+',t['id']) or t['id'] in ids:raise ValueError('Invalid/duplicate trip ID')
        ids.add(t['id'])
        if not set(t['countries'])<=country_ids:raise ValueError('Unknown country')
        content_path=(SRC/t['content']).resolve()
        if not content_path.is_relative_to(SRC.resolve()):raise ValueError('Content path outside source')
        if content_path.suffix=='.json':
            detail=json.loads(content_path.read_text());body=render_structured(t,detail)
            if [d['id'] for d in detail['days']]!=[d['id'] for d in t['days']]:raise ValueError('Day IDs must match catalog')
        else:body=content_path.read_text()
        n=[0]
        def slot(m):
            n[0]+=1
            if ' id=' in m.group(0):return m.group(0)
            return m.group(0)[:-1]+' id="stop-'+str(n[0])+'">'
        body=re.sub(r'<div\b[^>]*class="slot"[^>]*>',slot,body)
        if re.search(r'<script\b|</template',body,re.I):raise ValueError('Scripts/templates are not allowed in trip content')
        local_ids=re.findall(r'\bid="([^"]+)"',body)
        if len(local_ids)!=len(set(local_ids)):raise ValueError('Duplicate content IDs')
        if not {d['id'] for d in t['days']}<=set(local_ids):raise ValueError('Missing day sections')
        templates.append('<template id="content-'+t['id']+'">'+body+'</template>')
    css=scope_css((SRC/'content/legacy.css').read_text())+'\n'+(SRC/'site.css').read_text()
    data=json.dumps(catalog,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
    page=(SRC/'shell.html').read_text().replace('/*STYLE*/',css).replace('/*CATALOG*/',data).replace('<!--TRIPS-->','\n'.join(templates)).replace('/*SCRIPT*/',(SRC/'app.js').read_text())
    (ROOT/'index.html').write_text(page)
    print('Built index.html:',len(page.encode()),'bytes;',len(catalog['countries']),'countries;',len(catalog['trips']),'trips')
if __name__=='__main__':build()
