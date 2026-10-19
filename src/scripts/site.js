// Interactive tracks. All content comes from src/content and src/data via #site-data.
document.documentElement.classList.add('js');
const DATA = JSON.parse(document.getElementById('site-data').textContent);
const JOURNEY = DATA.journey, WORK = DATA.work, KINDS = DATA.kinds, TOOLS = DATA.tools;
/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const NS="http://www.w3.org/2000/svg";
const el=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- helix ---------- */
(function(){
  const cv=$('#helix'),ctx=cv.getContext('2d');const bases="ACGT";
  const pairs=Array.from({length:28},(_,i)=>"ACGTTGCAAGCTGACTGCATGCAGTCAG"[i]);
  let w,h,dpr;
  function size(){dpr=Math.min(2,devicePixelRatio||1);const r=cv.getBoundingClientRect();w=r.width;h=r.height;cv.width=w*dpr;cv.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  const comp={A:"T",T:"A",C:"G",G:"C"};
  function draw(t){
    ctx.clearRect(0,0,w,h);
    const vertical=h>w; const L=vertical?h:w, A=(vertical?w:h)*.28, mid=(vertical?w:h)/2;
    const n=pairs.length, scroll=Math.min(1,scrollY/600);
    const ph=t*0.0006;
    const col={A:css('--nA'),C:css('--nC'),G:css('--nG'),T:css('--nT')},line=css('--line'),fg=css('--fg');
    for(let i=0;i<n;i++){
      const u=(i+.5)/n, pos=u*L, a=u*Math.PI*4+ph;
      const unwind=1+scroll*1.4*u;
      const s1=Math.sin(a)*A*unwind, s2=Math.sin(a+Math.PI)*A*unwind, z=Math.cos(a);
      const p1=vertical?[mid+s1,pos]:[pos,mid+s1], p2=vertical?[mid+s2,pos]:[pos,mid+s2];
      const b=pairs[i];
      ctx.globalAlpha=.25+.55*(1-scroll*.6);
      ctx.strokeStyle=col[b];ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(...p1);ctx.lineTo((p1[0]+p2[0])/2,(p1[1]+p2[1])/2);ctx.stroke();
      ctx.strokeStyle=col[comp[b]];ctx.beginPath();ctx.moveTo((p1[0]+p2[0])/2,(p1[1]+p2[1])/2);ctx.lineTo(...p2);ctx.stroke();
      ctx.globalAlpha=1;
      [[p1,z],[p2,-z]].forEach(([p,d])=>{ctx.fillStyle=d>0?fg:line;ctx.beginPath();ctx.arc(p[0],p[1],3.4+1.6*d,0,7);ctx.fill()});
    }
  }
  function loop(t){draw(t);if(!reduce)requestAnimationFrame(loop)}
  size();addEventListener('resize',size);requestAnimationFrame(loop);
  if(reduce)addEventListener('scroll',()=>draw(0),{passive:true});
  const msg="GATTACA";const seq=$('#seq');let s="";
  for(let i=0;i<96;i++)s+=bases[(i*7+3*(i%5))%4];
  seq.innerHTML=s.split('').map(c=>`<i class="${c}">${c}</i>`).join('');
})();

/* ---------- chromosome ---------- */
(function(){
  const svg=$('#chrom'),X0=40,X1=960,Y=48,H=40,Y0=Math.floor(JOURNEY[0].from),Y1=Math.ceil(Math.max(...JOURNEY.map(j=>j.to)))+1;
  const x=y=>X0+(y-Y0)/(Y1-Y0)*(X1-X0);
  el('rect',{x:X0,y:Y,width:X1-X0,height:H,rx:20,fill:'var(--chrom-a)'},svg);
  // centromere at the start of the chapter marked "pivot: true"
  const piv=JOURNEY.find(j=>j.pivot);const cx=piv?x(piv.from)-1:-99;
  const cen=el('path',{d:`M${cx-7},${Y-1} L${cx},${Y+H/2} L${cx-7},${Y+H+1} L${cx+7},${Y+H+1} L${cx},${Y+H/2} L${cx+7},${Y-1}Z`,fill:'var(--bg)'},svg);
  const g=el('g',{},svg);
  JOURNEY.forEach((j,i)=>{
    const b=el('rect',{x:x(j.from)+1,y:Y,width:Math.max(6,x(j.to)-x(j.from)-2),height:H,rx:4,fill:i%2?'var(--chrom-b)':'var(--accent)',class:'band',tabindex:0,role:'button','aria-label':j.title,'data-id':j.id},g);
    b.addEventListener('click',()=>show(j.id));b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(j.id)}});
    const lx=(x(j.from)+x(j.to))/2;
    el('line',{x1:lx,x2:lx,y1:Y+H+4,y2:Y+H+16,stroke:'var(--line)'},svg);
    el('text',{x:lx,y:Y+H+30,'text-anchor':'middle',class:'lbl'},svg).textContent=j.label;
  });
  g.appendChild(cen);
  for(let y=Y0;y<Y1;y+=4){el('text',{x:x(y),y:Y-12,'text-anchor':'middle'},svg).textContent=y}
    function show(id){
    const j=JOURNEY.find(q=>q.id===id);
    svg.querySelectorAll('.band').forEach(b=>b.classList.toggle('on',b.dataset.id===id));
    $('#locus').innerHTML=`<div class="coord">${esc(j.coord)}</div><div><h3>${esc(j.title)}</h3><p class="where">${j.url?`<a href="${esc(j.url)}" target="_blank" rel="noopener">${esc(j.where)} ↗</a>`:esc(j.where)}</p><p>${esc(j.text)}</p><div class="chips">${j.tags.map(t=>`<span class="chip">${esc(t)}</span>`).join('')}</div></div>`;
  }
  window.showLocus=show; show(JOURNEY[JOURNEY.length-1].id);
})();

/* ---------- manhattan ---------- */
(function(){
  const svg=$('#man'),L=84,R=704,T=20,B=316,Y0=Math.floor(WORK[0].y),Y1=Math.floor(WORK[WORK.length-1].y)+1;
  const P=14, x=y=>L+P+(y-Y0)/(Y1-Y0)*(R-L-P), y=v=>B-(v/6.6)*(B-T); // P keeps January points clear of the axis labels
  // each year's band runs from 1 Jan to 31 Dec, so a point sits inside the year it happened
  for(let yr=Y0;yr<Y1;yr++){
    el('rect',{x:x(yr),y:T,width:x(yr+1)-x(yr),height:B-T,fill:yr%2?'var(--bg)':'transparent'},svg);
    el('text',{x:x(yr+.5),y:B+22,'text-anchor':'middle'},svg).textContent=yr;
  }
  // y-axis = type of output, ordered by weight of evidence (no numeric scale)
  for(const k of Object.values(KINDS)){el('line',{x1:L,x2:R,y1:y(k.h),y2:y(k.h),stroke:'var(--line)'},svg);el('text',{x:L-10,y:y(k.h)+4,'text-anchor':'end'},svg).textContent=k.s}
  el('line',{x1:L,x2:R,y1:y(4.2),y2:y(4.2),stroke:'var(--nT)','stroke-dasharray':'5 5'},svg);
  el('text',{x:R,y:y(4.2)-8,'text-anchor':'end',fill:'var(--nT)'},svg).textContent='↑ peer-reviewed or granted';
  const pts=WORK.map((w,i)=>{
    const jitter=((i*37)%10)/10*0.36-.18; // small offset so close points don't overlap
    const cx=x(w.y),cy=y(KINDS[w.kind].h+jitter);
    // journal points grow with impact factor; patents are diamonds
    const r=w.impact_factor?Math.min(17,6+2.4*Math.sqrt(w.impact_factor)):w.kind==='journal'?8:w.kind==='patent'?10:6;
    const a={fill:`var(${KINDS[w.kind].c})`,class:'pt',tabindex:0,role:'button','aria-label':w.title};
    const c=w.kind==='patent'?el('path',{...a,d:`M${cx},${cy-r} L${cx+r},${cy} L${cx},${cy+r} L${cx-r},${cy}Z`},svg):el('circle',{...a,cx,cy,r},svg);
    if(w.impact_factor)el('text',{x:cx,y:cy-r-6,'text-anchor':'middle',class:'iflbl'},svg).textContent='IF '+w.ifs;
    c.addEventListener('mouseenter',()=>show(i));c.addEventListener('click',()=>show(i));c.addEventListener('focus',()=>show(i));
    return c;
  });
  $('#legend').innerHTML=Object.values(KINDS).map(k=>`<span style="--c:var(${k.c})">${k.n}</span>`).join('');
  function show(i){
    const w=WORK[i];pts.forEach((p,j)=>p.classList.toggle('on',i===j));
    $('#detail').innerHTML=`<div class="k" style="color:var(${KINDS[w.kind].c})">${KINDS[w.kind].n} · ${w.date.slice(0,4)}</div><h3>${esc(w.title)}</h3><p>${esc(w.s)}</p><div class="venue">${esc(w.venue)}</div>${w.impact_factor?`<div class="ifb">Impact factor <b>${w.ifs}</b>${w.if_year?` · JCR ${w.if_year}`:''}</div>`:''}${w.kind==='patent'&&(w.status||w.number)?`<div class="ifb">${esc([w.status,w.number].filter(Boolean).join(' · '))}</div>`:''}${w.link?`<p style="margin-top:12px"><a href="${esc(w.link)}" target="_blank" rel="noopener">${w.kind==='patent'?'View the patent':'Read the paper'} ↗</a></p>`:''}`;
  }
  const fi=WORK.map(w=>w.featured).lastIndexOf(true);
  window.showWork=show; show(fi>=0?fi:Math.max(0, WORK.map(w=>w.kind).lastIndexOf('journal')));
})();

/* ---------- reveal ---------- */
if(!reduce&&'IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(r=>{if(r.getBoundingClientRect().top>innerHeight){r.classList.add('pre');io.observe(r)}});
}

/* ---------- deep links from search: /?w=<id>#work, /?j=<id>#journey ---------- */
window.siteGo=(u)=>{
  const w=u.searchParams.get('w'),j=u.searchParams.get('j');
  if(w){const i=WORK.findIndex(q=>q.id===w);if(i>=0)showWork(i)}
  if(j)showLocus(j);
  const target=document.getElementById(u.hash.slice(1));if(target)target.scrollIntoView();
};
if(location.search)siteGo(new URL(location.href));

/* ---------- visit counter (GoatCounter total, includes the previous site) ---------- */
fetch('https://vivekruhela.goatcounter.com/counter/TOTAL.json')
  .then(r=>{if(!r.ok)throw 0;return r.json()})
  .then(d=>{$('#visitCount').textContent=d.count;$('#visits').hidden=false})
  .catch(()=>{});

/* ---------- reach-out form: posts to Google Forms, which emails both sides ---------- */
(function(){
  const f=$('#contactForm');if(!f)return;
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const st=$('#cStatus'),btn=$('#cSend');
    const body=new FormData();
    body.append(f.dataset.name,f.name.value.trim());
    body.append(f.dataset.question,f.question.value.trim());
    body.append('emailAddress',f.email.value.trim());
    btn.disabled=true;st.textContent='Sending…';
    try{
      // Google Forms does not allow reading the response (no-cors), so a network error is the only failure we can see.
      await fetch(f.dataset.action,{method:'POST',mode:'no-cors',body});
      f.reset();st.textContent='Sent. A copy is on its way to your inbox.';
    }catch{
      st.textContent='Could not send. Check your connection and try again, or email '+document.querySelector('footer .copy').textContent+'.';
    }finally{btn.disabled=false}
  });
})();
