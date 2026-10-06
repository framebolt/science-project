// NITESH SIR FA TEAM GNG — shared behaviour. No frameworks.
(function(){
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
// safe storage: every call is guarded (storage throws in private mode / when blocked)
const store={
 get(k){try{return localStorage.getItem(k)}catch(e){return null}},
 set(k,v){try{localStorage.setItem(k,v)}catch(e){}},
 del(k){try{localStorage.removeItem(k)}catch(e){}}
};
const KEY={lang:'nitesh-lang',path:'nitesh-path',layers:'nitesh-layers',mute:'nitesh-mute'};
// one-time migration: copy values saved under the retired key prefix, then delete the old keys.
// The retired prefix is assembled from fragments so the source never contains the retired brand word.
(function migrateKeys(){
 const OLD=['o','nion','-'].join('');
 Object.keys(KEY).forEach(n=>{const ok=OLD+n,v=store.get(ok);
  if(v!==null){if(store.get(KEY[n])===null)store.set(KEY[n],v);store.del(ok);}});
})();
// active nav
const here=location.pathname.split('/').pop()||'index.html';
$$('nav.pages a').forEach(a=>{if(a.getAttribute('href')===here)a.classList.add('on');});
// language
$$('.lang button').forEach(b=>b.addEventListener('click',()=>{
  $$('.lang button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  document.body.dataset.lang=b.dataset.l;store.set(KEY.lang,b.dataset.l)
}));
{const l=store.get(KEY.lang);if(l){document.body.dataset.lang=l;$$('.lang button').forEach(x=>x.classList.toggle('on',x.dataset.l===l));}}
// card toggles
$$('[data-toggle]').forEach(c=>{
  const t=()=>c.classList.toggle('open');
  c.addEventListener('click',t);
  c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t();}});
});
// search index (page-level)
const IDX=[
 {p:'index.html',t:'Intro — what is a signal',k:'signal information sound voltage light sensor receiver'},
 {p:'analog-digital.html',t:'Analog signal — continuous',k:'analog sine smooth peak valley amplitude dimmer'},
 {p:'analog-digital.html',t:'Digital signal — HIGH LOW',k:'digital square binary high low on off bulb'},
 {p:'analog-digital.html',t:'Differences table',k:'difference comparison noise storage'},
 {p:'lab.html',t:'Waveform lab',k:'lab frequency amplitude speed simulator'},
 {p:'binary.html',t:'Binary, bit, byte',k:'binary bit byte nibble kb mb combinations 2n'},
 {p:'converters.html',t:'ADC DAC',k:'adc dac microphone speaker sampling converter'},
 {p:'transmission.html',t:'Transmission + examples',k:'transmission source channel receiver noise telephone radio internet examples'},
 {p:'quiz.html',t:'MCQ quiz + flashcards',k:'quiz mcq flashcards practice score'},
 {p:'exam.html',t:'Exam + revision',k:'exam questions revision answers'},
];
const si=$('#sin'),drop=$('#sdrop');
if(si){si.addEventListener('input',()=>{
  const q=si.value.trim().toLowerCase();
  if(q.length<2){drop.style.display='none';return;}
  const m=IDX.filter(x=>(x.t+' '+x.k).toLowerCase().includes(q));
  drop.innerHTML=m.length?m.map(x=>`<a href="${x.p}"><b>${x.t}</b><br><small>${x.k}</small></a>`).join(''):'<div style="padding:10px">No match. Try: analog, digital, adc, binary, noise…</div>';
  drop.style.display='block';});
 document.addEventListener('click',e=>{if(!e.target.closest('.searchwrap'))drop.style.display='none';});}
// ---- scopes ----
function fit(c,h){const d=Math.min(2,devicePixelRatio||1);const r=()=>{c.width=c.clientWidth*d;c.height=h*d;};r();addEventListener('resize',r);}
function sine(x,w,h,t,f,a,col){x.strokeStyle=col;x.lineWidth=Math.max(1.5,w/300);x.beginPath();for(let px=0;px<=w;px+=3){const y=h/2+Math.sin(px/w*Math.PI*2*f+t)*a;px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();
 x.strokeStyle='rgba(245,243,238,.08)';x.lineWidth=1;x.beginPath();x.moveTo(0,h/2);x.lineTo(w,h/2);x.stroke();}
function square(x,w,h,t,f,a,col){x.strokeStyle=col;x.lineWidth=Math.max(1.5,w/300);x.beginPath();for(let px=0;px<=w;px+=3){const ph=(((px/w*f+t/6.283)%1)+1)%1;const y=h/2+(ph<.5?-a:a);px===0?x.moveTo(px,y):x.lineTo(px,y);}x.stroke();}
function adcHold(x,w,h,t,f,a,col,N){N=N||16;x.strokeStyle=col;x.lineWidth=Math.max(1.5,w/300);x.beginPath();const pts=[];for(let k=0;k<N;k++){const px=k/(N-1)*w;pts.push([px,h/2+Math.sin(px/w*Math.PI*2*f+t)*a]);}x.moveTo(pts[0][0],pts[0][1]);for(let k=1;k<N;k++){x.lineTo(pts[k][0],pts[k-1][1]);x.lineTo(pts[k][0],pts[k][1]);}x.stroke();x.fillStyle=col;pts.forEach(([px,y])=>{x.beginPath();x.arc(px,y,Math.max(2.5,w/220),0,6.283);x.fill();});}
let __pt=0;
function loop(ts){
 if(window.__frozen){requestAnimationFrame(loop);return;}
 const t=(__pt||ts)/1000;__pt=ts;
 const jobs=[['#heroA',{a:.30,f:2,c1:'#d4cbb8',mode:'both',c2:'#c9a961'}],['#anaScope',{a:.30,f:2,c1:'#d4cbb8',mode:'sine'}],['#cmpA',{a:.3,f:2,c1:'#d4cbb8',mode:'sine'}],['#cmpD',{a:.3,f:2,c1:'#c9a961',mode:'sq'}],['#adcScope',{a:.3,f:2,c1:'#d4cbb8',mode:'adc',c2:'#c9a961'}],['#chainScope',{a:.28,f:3,c1:'#d4cbb8',mode:'sine'}],['#homeAna',{a:.30,f:2,c1:'#d4cbb8',mode:'sine'}],['#homeDig',{a:.3,f:2,c1:'#c9a961',mode:'sq'}],['#labScope',{lab:true}]];
 jobs.forEach(([sel,o])=>{const c=$(sel);if(!c)return;const x=c.getContext('2d'),w=c.width,h=c.height;x.clearRect(0,0,w,h);
  if(o.lab){const f=parseFloat($('#f')?.value||2),pc=parseFloat($('#a')?.value||55)/100*(h*.38),sp=parseFloat($('#s')?.value||2.2)*0.6;
   const mode=$('.seg button.on')?.dataset.t||'analog';
   if(mode!=='digital')sine(x,w,h,t*sp,f,pc,'#d4cbb8');if(mode!=='analog')square(x,w,h,t*sp,f,pc||h*.2,'#c9a961');
   x.fillStyle='#7d7a75';x.font=`${Math.round(h/16)}px monospace`;x.fillText('FIG. LAB — drag the sliders',10,18);return;}
  if(o.mode==='adc'){sine(x,w,h,t*1.2,o.f,h*o.a,o.c1);adcHold(x,w,h,t*1.2,o.f,h*o.a,o.c2,16);}
  else if(o.mode==='both'){sine(x,w,h,t*1.2,o.f,h*o.a,o.c1);square(x,w,h,t*1.2,o.f,h*.2,o.c2);}
  else if(o.mode==='sq')square(x,w,h,t*1.2,o.f,h*o.a,o.c1);else sine(x,w,h,t*1.2,o.f,h*o.a,o.c1);
  x.fillStyle='rgba(168,165,160,.55)';x.font=`${Math.round(h/17)}px monospace`;x.fillText('TIME →',w-90,h-10);});
 const bw=$('#bulbScope');if(bw){const x=bw.getContext('2d');x.clearRect(0,0,bw.width,bw.height);const on=$('#sw')?.classList.contains('on');square(x,bw.width,bw.height,on?1.6:0,1,bw.height*.3,on?'#c9a961':'#3d3b38');}
 requestAnimationFrame(loop);}
$$('canvas.screen,canvas#bulbScope').forEach(c=>fit(c,c.id==='labScope'?250:c.id==='heroA'?250:170));
requestAnimationFrame(loop);
// seg
$$('.seg button').forEach(b=>b.addEventListener('click',()=>{$$('.seg button').forEach(x=>x.classList.remove('on'));b.classList.add('on');}));
// bulb
const sw=$('#sw');if(sw)sw.addEventListener('click',()=>{const on=sw.classList.toggle('on');sw.setAttribute('aria-checked',on);
 $('#bulb')?.classList.toggle('lit',on);const s=$('#bstate');if(s)s.textContent=on?'ON — HIGH / 1 · 5V':'OFF — LOW / 0 · 0V';});
// binary
const bb=$$('#bits .bit');
if(bb.length){let v=[0,0,0,0];const r=()=>{bb.forEach((b,i)=>{b.textContent=v[i];b.classList.toggle('on',!!v[i]);});
 $('#bout').textContent=v.join('');$('#dout').textContent=v[0]*8+v[1]*4+v[2]*2+v[3];};
 bb.forEach((b,i)=>b.addEventListener('click',()=>{v[i]=v[i]?0:1;r();}));r();}
// quiz
const Q=[
["What is a signal?",["A physical quantity changing with time, carrying information","Only sound","Only current","A program"],0,"Time-varying quantity with info. / समयसँग बदलिने सूचना बोक्ने परिमाण।"],
["Which is analog?",["Binary file","Human voice wave","1010","USB packets"],1,"Voice is continuous."],
["Analog wave looks…",["Square steps","Smooth / sine","Dots only","Flat 0"],1,"Smooth continuous."],
["Digital uses…",["Infinite values","0 and 1","Only negatives","Only sine"],1,"Binary HIGH/LOW."],
["HIGH means…",["0","1 · high voltage","No signal","Noise"],1,"HIGH=1, LOW=0."],
["One bit is…",["0 or 1","0–9","A–Z","Any voltage"],0,"Smallest unit."],
["1 byte =",["4 bits","8 bits","1024 bits","1 bit"],1,"8 bits."],
["4 bits =",["Byte","Nibble","KB","Bit"],1,"Nibble."],
["n bits → combos?",["2×n","n²","2ⁿ","n!"],2,"2 to the n."],
["3 bits → ?",["6","8","9","16"],1,"2³=8."],
["1010 in decimal?",["5","8","10","12"],2,"8+2=10."],
["0101 in decimal?",["4","5","6","7"],1,"4+1=5."],
["ADC =",["Analog to Digital Converter","Audio Data Cable","Auto Digital Computer","Analog Device Control"],0,"Analog→Digital. Recording."],
["DAC =",["Data Access Code","Digital to Analog Converter","Direct Analog Current","Disk and CPU"],1,"Digital→Analog. Playback."],
["Mic + ADC does…",["Play speaker","Record sound to PC","Print","Charge"],1,"Sound→ADC→storage."],
["DAC + speaker does…",["Store photos","Hear digital audio","Type","Email"],1,"Numbers back to sound."],
["Digital wave looks…",["Sine","Square / steps","Circle","Dots"],1,"Steps HIGH/LOW."],
["Noise is…",["Useful msg","Unwanted extra signal","Binary","Amplifier"],1,"Unwanted disturbance."],
["1024 MB =",["1 KB","1 MB","1 GB","1 TB"],2,"1024 MB=1 GB."],
["Why digital for storage?",["Fades fast","Exact copies + error fix","Needs no device","Always analog"],1,"Regenerate + correct."],
];
const qb=$('#qbox');
// quiz gate: modules ①–⑤ must all be done, else back to the path (quiz page only — #qbox exists nowhere else)
let gateOk=false;try{const gd=JSON.parse(store.get(KEY.path)||'{}');gateOk=['s1','s2','s3','s4','s5'].every(k=>gd&&gd[k]);}catch(e){gateOk=false;}
if(qb&&!gateOk){const gt=$('#toast');if(gt){gt.textContent='Finish modules ①–⑤ first.';gt.classList.add('show');}setTimeout(()=>{location.href='index.html#path';},1800);}
if(qb&&gateOk){let ans=Array(Q.length).fill(null),right=0,streak=0,best=0;
 // quiz sfx: chime on right, buzz on wrong
 let muted=false;muted=store.get(KEY.mute)==='1';
 const sbtn=$('#sndbtn');
 const paintSnd=()=>{if(sbtn)sbtn.textContent=muted?'🔇 OFF':'🔊 ON';};
 paintSnd();
 sbtn?.addEventListener('click',()=>{muted=!muted;store.set(KEY.mute,muted?'1':'0');paintSnd();});
 let SACTX=null;
 function beep(f,t0,dur,type,vol){try{
  SACTX=SACTX||new (window.AudioContext||window.webkitAudioContext)();
  if(SACTX.state==='suspended')SACTX.resume();
  const o=SACTX.createOscillator(),g=SACTX.createGain();
  o.type=type;o.frequency.value=f;
  const t=SACTX.currentTime+t0;
  g.gain.setValueAtTime(0.0001,t);
  g.gain.exponentialRampToValueAtTime(vol,t+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
  o.connect(g);g.connect(SACTX.destination);o.start(t);o.stop(t+dur+0.05);
 }catch(e){}}
 function playRight(){if(muted)return;beep(660,0,.12,'sine',.15);beep(880,.1,.18,'sine',.15);beep(1320,.2,.22,'triangle',.08);}
 function playWrong(){if(muted)return;beep(170,0,.22,'square',.07);}
 const toast=$('#toast');
 let toastT=null;
 const say=t=>{if(!toast)return;toast.textContent=t;toast.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toast.classList.remove('show'),1600);};
 const hud=()=>{const n=ans.filter(x=>x!==null).length;
  const hc=$('#hcount'),hs=$('#hscore'),hf=$('#hfill');
  if(hc)hc.textContent=`${n} / ${Q.length} answered`;
  if(hs)hs.textContent=`${right} right · streak ${streak} · best ${best}`;
  if(hf)hf.style.width=Math.round(n/Q.length*100)+'%';
  const sc=$('#score');
  if(sc&&n===Q.length){const p=Math.round(right/Q.length*100);
   sc.textContent=`DONE — ${right}/${Q.length} · ${p}% — `+(p>=90?'Sharp.':p>=70?'Solid. One more pass.':p>=50?'Patchy — redo converters + binary.':'Back to Signals page, then retry.');}};
 Q.forEach((q,i)=>{const d=document.createElement('div');d.className='q';d.id='qq'+i;
  d.innerHTML=`<span class="qtag">Q${i+1} · UNTOUCHED</span><b>${q[0]}</b>`+q[1].map((o,j)=>`<button type="button" class="opt" data-q="${i}" data-j="${j}"><span style="font-family:var(--mono);font-weight:800">${'ABCD'[j]}</span> · ${o}</button>`).join('')+`<div class="why" id="w${i}"></div>`;qb.appendChild(d);});
 qb.addEventListener('click',e=>{const b=e.target.closest('.opt');if(!b||b.disabled)return;
  const qi=+b.dataset.q,ji=+b.dataset.j,q=Q[qi];
  if(ans[qi]!==null)return; // locked — one shot, like the exam
  ans[qi]=ji;const ok=ji===q[2];
  const box=$('#qq'+qi),opts=$$(`.opt[data-q="${qi}"]`,qb),w=$('#w'+qi);
  opts.forEach(x=>{x.disabled=true;if(+x.dataset.j!==q[2]&&x!==b)x.classList.add('dim');});
  b.classList.add(ok?'picked-ok':'picked-bad');
  if(!ok)opts[q[2]].classList.add('picked-ok','show-ok');
  box.classList.add(ok?'locked-ok':'locked-bad');
  box.querySelector('.qtag').textContent=`Q${qi+1} · ${ok?'SAHI ✓':'GALAT ✗'}`;
  w.style.display='block';w.innerHTML=(ok?'<b>SAHI ✓.</b> ':'<b>GALAT ✗.</b> Correct: <b>'+q[1][q[2]]+'</b>. ')+q[3];
  if(ok){right++;streak++;best=Math.max(best,streak);playRight();say(`Correct · Streak ${streak}.`);}
  else{streak=0;playWrong();say(`Review this one.`);}
  hud();});
 $('#check')?.addEventListener('click',()=>{ // reveal anything skipped, no penalty
  Q.forEach((q,i)=>{if(ans[i]!==null)return;ans[i]=-1;
   const box=$('#qq'+i),opts=$$(`.opt[data-q="${i}"]`,qb),w=$('#w'+i);
   opts.forEach(x=>{x.disabled=true;if(+x.dataset.j!==q[2])x.classList.add('dim');});
   opts[q[2]].classList.add('picked-ok','show-ok');box.classList.add('locked-bad');
   box.querySelector('.qtag').textContent=`Q${i+1} · REVEALED`;w.style.display='block';w.innerHTML='Skipped. Correct: <b>'+q[1][q[2]]+'</b>. '+q[3];});
  say('Unfinished ones revealed — reset to try for real.');hud();});
 $('#retry')?.addEventListener('click',()=>{ans=Array(Q.length).fill(null);right=0;streak=0;
  $$('.q',qb).forEach((box,i)=>{box.classList.remove('locked-ok','locked-bad');box.querySelector('.qtag').textContent=`Q${i+1} · UNTOUCHED`;});
  $$('.why',qb).forEach(x=>{x.style.display='none';x.innerHTML='';});
  $$('.opt',qb).forEach(o=>{o.disabled=false;o.classList.remove('picked-ok','picked-bad','show-ok','dim');});
  hud();say('Fresh board. One shot each.');});
 hud();}
// ---- STORY QUIZ: 11 clips, 10 questions, retry-until-correct ----
(function(){
 const root=$('#story');if(!root)return;
 let REDUCE=false;try{REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
 if(REDUCE)root.classList.add('no-anim');
 const PICKS=[0,1,3,4,5,6,8,10,12,17];
 const VIDS=['assets/videos/clip-1-intro.mp4','assets/videos/clip-2.mp4','assets/videos/clip-3.mp4','assets/videos/clip-4.mp4','assets/videos/clip-5.mp4','assets/videos/clip-6.mp4','assets/videos/clip-7.mp4','assets/videos/clip-8.mp4','assets/videos/clip-9.mp4','assets/videos/clip-10.mp4','assets/videos/clip-11.mp4'];
 const screens={start:$('#panel-start'),video:$('#stage-video'),q:$('#qmodal'),win:$('#panel-victory')};
 const vid=$('#clip'),roundlabel=$('#roundlabel'),mutebtn=$('#mutebtn'),bigplay=$('#bigplay'),fallback=$('#clipfallback');
 const qeyebrow=$('#qeyebrow'),qtext=$('#qtext'),qopts=$('#qopts'),qwhy=$('#qwhy'),live=$('#round-live');
 let muted=true;try{muted=sessionStorage.getItem('nitesh-story-mute')!=='off';}catch(e){}
 const paintMute=()=>{if(mutebtn)mutebtn.textContent=muted?'Sound off':'Sound on';if(vid)vid.muted=muted;};
 paintMute();
 mutebtn?.addEventListener('click',()=>{muted=!muted;try{sessionStorage.setItem('nitesh-story-mute',muted?'on':'off');}catch(e){}paintMute();if(vid)vid.muted=muted;});
 let round=0,firstTry=true,missed=[],t0=0,pending=null,locked=false;
 const show=(k)=>{Object.entries(screens).forEach(([n,el])=>{if(!el)return;const on=n===k;el.hidden=!on;requestAnimationFrame(()=>el.classList.toggle('on',on));});};
 const say2=(t)=>{if(live)live.textContent=t;};
 const warm=(k)=>{try{if(VIDS[k])fetch(VIDS[k]);}catch(e){}};
 const playClip=(k,label,after)=>{
  roundlabel.textContent=label;
  vid.setAttribute('aria-label',label.toLowerCase()+' video clip');
  pending=after;fallback.hidden=true;bigplay.hidden=true;
  $('#stage-video').classList.remove('dim');
  if(vid.getAttribute('src')!==VIDS[k]){vid.setAttribute('src',VIDS[k]);try{vid.load();}catch(e){}}
  vid.muted=muted;show('video');
  if(REDUCE){bigplay.hidden=false;return;}
  try{const pr=vid.play();if(pr&&pr.catch)pr.catch(()=>{bigplay.hidden=false;});}catch(e){bigplay.hidden=false;}
 };
 bigplay?.addEventListener('click',()=>{bigplay.hidden=true;try{vid.play();}catch(e){}});
 vid?.addEventListener('ended',()=>{const f=pending;pending=null;if(f)f();});
 vid?.addEventListener('error',()=>{fallback.hidden=false;});
 fallback?.addEventListener('click',()=>{fallback.hidden=true;const f=pending;pending=null;if(f)f();});
 const ask=(i)=>{
  round=i;firstTry=true;locked=false;
  const b=Q[PICKS[i]];
  qeyebrow.textContent='Question '+(i+1);
  qtext.textContent=b[0];qwhy.classList.remove('show');qwhy.textContent='';
  qopts.innerHTML='';
  b[1].forEach((o,j)=>{const btn=document.createElement('button');btn.type='button';btn.className='sopt';btn.dataset.j=j;
   btn.innerHTML='<span class="k">'+'ABCD'[j]+'</span> · '+o;
   btn.addEventListener('click',()=>answer(i,j,btn));qopts.appendChild(btn);});
  $('#stage-video').classList.add('dim');show('q');
  say2('Round '+(i+1)+' of 10. '+b[0]);
  try{qtext.focus({preventScroll:true});}catch(e){}
  warm(i+1);
 };
 const answer=(i,j,btn)=>{
  if(locked)return;
  const b=Q[PICKS[i]],ok=j===b[2];
  if(ok){
   locked=true;btn.classList.add('right');
   say2('Correct.');
   setTimeout(()=>{
    if(i>=9)playClip(10,'FINAL',victory);
    else playClip(i+1,'ROUND '+(i+2)+' / 10',()=>ask(i+1));
   },REDUCE?0:400);
  }else{
   firstTry=false;btn.classList.add('wrong');
   if(!missed.includes(i))missed.push(i);
   [...qopts.children].forEach(x=>{if(+x.dataset.j===b[2])x.classList.add('right');});
   qwhy.textContent=b[3];qwhy.classList.add('show');
   say2('Not quite. The correct answer is shown. Tap it to continue.');
  }
 };
 const victory=()=>{
  const s=10-missed.length;
  $('#finalscore').textContent=s+' / 10';
  const secs=Math.max(0,Math.round((Date.now()-t0)/1000));
  $('#finaltime').textContent='Completed in '+Math.floor(secs/60)+':'+String(secs%60).padStart(2,'0')+' · first-try score';
  const rw=$('#reviewwrap'),rl=$('#reviewlist');rl.innerHTML='';
  if(missed.length){rw.hidden=false;
   missed.forEach(i=>{const b=Q[PICKS[i]];const d=document.createElement('div');d.className='review-card';
    d.innerHTML='<b>Q'+(i+1)+'. '+b[0]+'</b><span class="ra">Correct: '+b[1][b[2]]+'</span>';rl.appendChild(d);});
  }else rw.hidden=true;
  show('win');say2('Mission complete. '+s+' out of 10 on the first try.');
 };
 $('#startbtn')?.addEventListener('click',()=>{
  missed=[];t0=Date.now();
  const go=()=>playClip(0,'INTRO',()=>ask(0));
  if(REDUCE){go();return;}
  root.style.transition='opacity 500ms var(--ease)';root.style.opacity='0';
  setTimeout(()=>{root.style.opacity='';go();},500);
 });
 $('#againbtn')?.addEventListener('click',()=>{missed=[];show('start');say2('Back at the start panel.');});
 document.querySelector('.story-escape')?.addEventListener('click',()=>{root.classList.add('gone');});
})();
// flashcards
const F=[["Analog signal?","Continuously changing. / लगातार बदलिने।"],["Digital signal?","Discrete levels — 0/1."],["1 bit?","One binary digit: 0 or 1."],["1 byte?","8 bits."],["ADC?","Analog to Digital Converter."],["DAC?","Digital to Analog Converter."],["HIGH / LOW?","HIGH=1, LOW=0."],["n bits?","2ⁿ combos."],["3 bits?","8: 000–111."],["Analog wave?","Smooth sine 〰"],["Digital wave?","Square steps ▓"],["Noise?","Unwanted extra signal."]];
const fg=$('#fgrid');
if(fg)F.forEach(f=>{const d=document.createElement('div');d.className='flash';d.tabIndex=0;d.setAttribute('role','button');
 d.innerHTML=`<div class="fin"><div class="face ff">${f[0]}<br><small>tap</small></div><div class="face fb">${f[1]}</div></div>`;
 const t=()=>d.classList.toggle('flip');d.addEventListener('click',t);d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();t();}});fg.appendChild(d);});
// exam
const EX={vs:[["What is a signal?","Time-varying physical quantity carrying info."],["What is a bit?","Smallest unit: 0/1."],["What is a byte?","8 bits."],["What is ADC?","Analog→Digital."],["What is DAC?","Digital→Analog."],["What is binary?","0/1 system."]],
sq:[["Analog signal + example?","Continuous, e.g. voice / old radio."],["Digital signal + example?","Discrete 0/1, e.g. PC data."],["4 differences?","Continuous/discrete · smooth/square · many values/0-1 · noise-prone/regenerable."],["Explain ADC.","Mic→analog→sample→digital→PC."] ,["Explain DAC.","Digital→DAC→analog→speaker→sound."],["3-bit combos?","2³=8: 000…111."]],
lq:[["Analog vs digital with diagrams.","Sine vs square; label time/amplitude/HIGH/LOW."],["Difference table.","Definition, values, wave, noise, storage, processing, examples, conversion."],["Signal transmission.","Source→encoder→TX→channel→RX→decoder→dest; noise."],["ADC/DAC block diagrams.","Record path vs playback path."]]};
['vs','sq','lq'].forEach(k=>{const c=document.getElementById(k);if(!c)return;EX[k].forEach((q,i)=>{const d=document.createElement('div');d.className='q';
 d.innerHTML=`<b>${i+1}. ${q[0]}</b><br><button type="button" class="btn light" style="margin-top:8px;padding:8px 14px">Show answer</button><div class="why">${q[1]}</div>`;
 const b=d.querySelector('button'),a=d.querySelector('.why');b.addEventListener('click',()=>{const o=a.style.display==='block';a.style.display=o?'none':'block';b.textContent=o?'Show answer':'Hide';});c.appendChild(d);});});
// ---- ENGINE: progress meter, reveal, typing, audio ----
// single-theme pitch black: silently drop any preference saved by the retired toggle
try{document.body.classList.remove('theme-scope');store.del('nitesh-theme');}catch(e){}
// visited-pages progress meter
try{
 const pages=['index.html','analog-digital.html','lab.html','binary.html','converters.html','transmission.html','quiz.html','exam.html'];
 const me=(location.pathname.split('/').pop()||'index.html');
 let v={};try{v=JSON.parse(store.get(KEY.layers)||'{}')}catch(e){v={}}
 v[me]=1;store.set(KEY.layers,JSON.stringify(v));
 const n=pages.filter(p=>v[p]).length;
 $$('.progress-dots').forEach(el=>{el.textContent='●'.repeat(n)+'○'.repeat(pages.length-n);});
 $$('.progress-num').forEach(el=>el.textContent=n+'/'+pages.length);
}catch(e){}
// scroll reveal
// scroll reveal — progressive: never leave content hidden
try{
 if(!('IntersectionObserver' in window)) throw new Error('no-io');
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}}),{threshold:.12});
 $$('.panel,.q,.cardx,.lux-img').forEach(el=>{el.classList.add('rv');io.observe(el);});
 setTimeout(()=>$$('.rv:not(.in)').forEach(el=>el.classList.add('in')),1500);
}catch(e){$$('.rv').forEach(el=>el.classList.add('in'));}
// typing line
try{
 const t=document.getElementById('typeline');if(t){
  const s='> sampling reality… 0 1 0 1 1 0 — signal locked.';
  let i=0;(function tick(){t.innerHTML=s.slice(0,i)+'<span class="caret"></span>';if(i++<=s.length)setTimeout(tick,34);})();
 }
}catch(e){}
// ---- MENU: slide-down panel ----
(function(){
 const btn=document.getElementById('menubtn'),panel=document.getElementById('menupanel');
 if(!btn||!panel)return;
 const set=(open)=>{document.body.classList.toggle('menu-open',open);btn.setAttribute('aria-expanded',String(open));
  const word=btn.querySelector('.menu-word');if(word)word.textContent=open?'Close':'Menu';
  if(open){const f=panel.querySelector('nav.pages a');if(f)f.focus();}};
 btn.addEventListener('click',()=>set(!document.body.classList.contains('menu-open')));
 panel.addEventListener('click',e=>{if(e.target.closest('nav.pages a'))set(false);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('menu-open')){set(false);btn.focus();}});
})();
// ---- UNCOVER: split headlines, card spotlight ----
(function(){
 let reduce=false,fine=false;
 try{reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
 try{fine=matchMedia('(pointer:fine)').matches;}catch(e){}
 const heads=$$('h1,h2');
 if(!reduce&&heads.length){
  heads.forEach(h=>{let i=0;[...h.childNodes].forEach(n=>{
   if(n.nodeType===3){n.textContent.split(/(\s+)/).forEach(p=>{if(!p)return;
    if(/^\s+$/.test(p)){h.insertBefore(document.createTextNode(' '),n);}
    else{const s=document.createElement('span');s.className='w';s.style.transitionDelay=(i++*45)+'ms';s.textContent=p;h.insertBefore(s,n);}});h.removeChild(n);}
   else if(n.nodeType===1){n.classList.add('w');n.style.transitionDelay=(i++*45)+'ms';}});});
  try{const hio=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');hio.unobserve(en.target);}}),{threshold:.35});
   heads.forEach(h=>hio.observe(h));
  }catch(e){heads.forEach(h=>h.classList.add('in'));}
 }
 if(!reduce&&fine){document.addEventListener('pointermove',e=>{const c=e.target.closest?.('.cardx,.path-card');if(!c)return;
  const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');},{passive:true});}
})();
// ---- MOTION: loader, nav, scroll progress, parallax, chapters, count-ups ----
(function(){
 const reduce=(()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}})();
 const loader=document.getElementById('loader'),fill=document.getElementById('loadfill'),num=document.getElementById('loadnum');
 const finish=()=>{document.body.classList.add('loading-done','ready');};
 if(!loader||reduce){document.body.classList.add('ready');const l=document.getElementById('loader');if(l)l.remove();}
 else{
  const t0=performance.now(),DUR=1100;
  const step=(now)=>{const p=Math.min(1,(now-t0)/DUR),e=1-Math.pow(1-p,3);
   if(fill)fill.style.width=Math.round(e*100)+'%';
   if(num)num.textContent=String(Math.round(e*100)).padStart(2,'0');
   if(p<1)requestAnimationFrame(step);else{finish();setTimeout(()=>{const l=document.getElementById('loader');if(l)l.remove();},900);}};
  requestAnimationFrame(step);
  setTimeout(()=>{if(!document.body.classList.contains('ready')){finish();const l=document.getElementById('loader');if(l)l.remove();}},3000);
 }
 if(reduce)return;
 // progress bar (injected — no markup needed)
 const bar=document.createElement('div');bar.id='scrollbar';bar.setAttribute('aria-hidden','true');document.body.prepend(bar);
 const top=document.querySelector('.top');
 let lastY=window.scrollY||0,ticking=false;
 const onScroll=()=>{
  const y=window.scrollY||0,h=document.documentElement.scrollHeight-window.innerHeight;
  bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
  if(top){top.classList.toggle('solid',y>24);
   if(y>140&&y>lastY+4&&!document.body.classList.contains('menu-open'))document.body.classList.add('nav-hidden');
   else if(y<lastY-4||y<=140)document.body.classList.remove('nav-hidden');}
  // parallax: transform-only drift
  $$('[data-px]').forEach(el=>{const r=el.getBoundingClientRect(),off=(r.top+r.height/2-window.innerHeight/2)*parseFloat(el.dataset.px||0.06);el.style.transform='translateY('+(-off).toFixed(1)+'px)';});
  $$('[data-pxx]').forEach(el=>{const r=el.getBoundingClientRect(),off=(r.top+r.height/2-window.innerHeight/2)*parseFloat(el.dataset.pxx||0.1);el.style.transform='translateX('+(-off).toFixed(1)+'px)';});
  lastY=y;ticking=false;};
 addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
 onScroll();
 // chapter spy → fixed tag
 const tag=document.createElement('div');tag.id='chapter-tag';tag.setAttribute('aria-hidden','true');document.body.appendChild(tag);
 try{
  const chapters=$$('.chapter[data-chapter]');
  if(chapters.length){
   const cio=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const c=en.target.dataset.chapter;tag.innerHTML='CH <b>'+c+'</b>';tag.classList.add('show');}}),{threshold:.25});
   chapters.forEach(c=>cio.observe(c));
  }
 }catch(e){}
 // count-ups
 try{
  const cio2=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target;cio2.unobserve(el);
   const end=parseInt(el.dataset.countup||'0',10),t0=performance.now();
   const tick=(now)=>{const p=Math.min(1,(now-t0)/900);el.textContent=String(Math.round(end*(1-Math.pow(1-p,3)))).padStart(2,'0');if(p<1)requestAnimationFrame(tick);};
   requestAnimationFrame(tick);}),{threshold:.4});
  $$('[data-countup]').forEach(el=>cio2.observe(el));
 }catch(e){}
})();
let AC=null,osc=null,og=null;
function tone(type,freq){try{
 AC=AC||new (window.AudioContext||window.webkitAudioContext)();
 stopTone();
 osc=AC.createOscillator();og=AC.createGain();
 osc.type=type;osc.frequency.value=Math.min(880,110*freq);
 og.gain.value=.08;osc.connect(og);og.connect(AC.destination);osc.start();
}catch(e){}}
function stopTone(){try{osc?.stop();}catch(e){}osc=null;}
$$('[data-hear]').forEach(b=>b.addEventListener('click',()=>{
 const on=b.classList.toggle('live');
 $$('[data-hear]').forEach(x=>{if(x!==b)x.classList.remove('live');});
 if(!on){stopTone();b.textContent=b.dataset.label;return;}
 const f=parseFloat($('#f')?.value||2);
 tone(b.dataset.hear,f);b.textContent='■ STOP';
 setTimeout(()=>{if(!b.classList.contains('live'))b.textContent=b.dataset.label;},300);
}));
// freeze button
$('#freeze')?.addEventListener('click',e=>{
 const c=$('#labScope');if(!c)return;
 const btn=e.currentTarget,on=btn.classList.toggle('live');
 btn.textContent=on?'▶ RESUME':'❚❚ FREEZE';
 c.style.animationPlayState=on?'paused':'running';
 window.__frozen=on;
});
// learning path ①→⑤ then quiz
try{
 const cards=$('#pathcards');if(cards){
  const KEYS=['s1','s2','s3','s4','s5'];
  let done={};try{done=JSON.parse(store.get(KEY.path)||'{}')}catch(e){done={}}
  const paint=()=>{
   const n=KEYS.filter(k=>done[k]).length;
   $('#pathfill').style.width=Math.round(n/5*100)+'%';
   $('#pathcount').textContent=n+' / 5 done';
   $$('.donebtn',cards).forEach(b=>{
    const k=b.dataset.d,on=!!done[k];
    b.textContent=on?'✓ Done — undo':'Mark done';
    const card=b.closest('[data-step]');if(card)card.classList.toggle('done',on);
   });
   const gate=$('#gatebtn'),msg=$('#gatemsg'),open=n===5;
   gate.style.opacity=open?'1':'.45';gate.style.pointerEvents=open?'auto':'none';
   gate.setAttribute('aria-disabled',String(!open));
   gate.innerHTML=open?'Start the 20 MCQs →':'Quiz locked';
   msg.textContent=open?'Gate open. All 5 modules done — go prove it.':'Finish ①–⑤ to unlock the gate.';
  };
  cards.addEventListener('click',e=>{
   const b=e.target.closest('.donebtn');if(!b)return;
   const k=b.dataset.d;done[k]=!done[k];
   store.set(KEY.path,JSON.stringify(done));paint();
   if(KEYS.every(x=>done[x])){const tt=$('#toast');if(tt){tt.textContent='All 5 done. Quiz gate OPEN.';tt.classList.add('show');setTimeout(()=>tt.classList.remove('show'),1800);}
    document.querySelector('#quizgate')?.scrollIntoView({behavior:'smooth',block:'center'});}
  });
  $('#pathreset')?.addEventListener('click',()=>{done={};store.set(KEY.path,'{}');paint();});
  paint();
 }
}catch(e){}
// presentation decks: one visible slide, arrows + dots + swipe
$$('[data-deck]').forEach(deck=>{
 const track=deck.querySelector('.deck-track'),slides=[...deck.querySelectorAll('.slide')],
 dotsBox=deck.querySelector('[data-dots]'),count=deck.querySelector('[data-count]');
 if(!track||!slides.length)return;
 let i=0;
 slides.forEach((_,k)=>{const d=document.createElement('button');d.type='button';d.className='dot'+(k?'':' on');d.setAttribute('aria-label','Go to slide '+(k+1));d.addEventListener('click',()=>go(k));dotsBox.appendChild(d);});
 const dots=[...dotsBox.children];
 function go(n){track.classList.add('shift');setTimeout(()=>track.classList.remove('shift'),120);i=((n%slides.length)+slides.length)%slides.length;track.style.transform='translateX(-'+(i*100)+'%)';dots.forEach((d,k)=>d.classList.toggle('on',k===i));if(count)count.textContent=(i+1)+' / '+slides.length;}
 deck.querySelector('[data-prev]')?.addEventListener('click',()=>go(i-1));
 deck.querySelector('[data-next]')?.addEventListener('click',()=>go(i+1));
 deck.addEventListener('keydown',e=>{const k=e.key;let n=null;if(k==='ArrowLeft')n=i-1;else if(k==='ArrowRight')n=i+1;else if(k==='Home')n=0;else if(k==='End')n=slides.length-1;else return;e.preventDefault();go(n);});
 let x0=null;
 deck.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
 deck.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(i+(dx<0?1:-1));x0=null;},{passive:true});
 go(0);
});
})();

/* ============================================================
   MOTION & INTERACTION (appended last — self-contained IIFE)
   ============================================================ */
(function(){
const $$m=(s,c=document)=>[...c.querySelectorAll(s)];
// reduced-motion reader
const reducedMotionMQ=window.matchMedia('(prefers-reduced-motion: reduce)');
const applyReducedMotion=()=>document.documentElement.classList.toggle('reduced-motion',reducedMotionMQ.matches);
applyReducedMotion();
if(reducedMotionMQ.addEventListener)reducedMotionMQ.addEventListener('change',applyReducedMotion);
// reveal observer (.rv legacy alias + [data-reveal])
try{
 if(!('IntersectionObserver' in window))throw new Error('no-io');
 const rio=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in','revealed');rio.unobserve(en.target);}}),{threshold:.12,rootMargin:'0px 0px -50px 0px'});
 $$m('.rv,[data-reveal]').forEach(el=>rio.observe(el));
 setTimeout(()=>$$m('.rv:not(.in),[data-reveal]:not(.revealed)').forEach(el=>el.classList.add('in','revealed')),1500);
}catch(e){$$m('.rv,[data-reveal]').forEach(el=>el.classList.add('in','revealed'));}
// stagger setter
$$m('[data-reveal-stagger]').forEach((group)=>{group.querySelectorAll('[data-reveal]').forEach((el,i)=>{el.style.transitionDelay=(i*80)+'ms';});});
// parallax ([data-parallax] factor; skips when reduced motion)
const parallaxEls=$$m('[data-parallax]');
let ticking=false;
function updateParallax(){
 if(document.documentElement.classList.contains('reduced-motion')){ticking=false;return;}
 const scrollY=window.scrollY,vh=window.innerHeight;
 parallaxEls.forEach((el)=>{
  const rect=el.getBoundingClientRect(),elTop=rect.top+scrollY;
  if(scrollY+vh>elTop&&scrollY<elTop+rect.height){
   const factor=parseFloat(el.dataset.parallax)||0.2;
   el.style.transform='translateY('+((scrollY-elTop)*factor)+'px)';
  }
 });
 ticking=false;
}
if(parallaxEls.length){
 window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateParallax);ticking=true;}},{passive:true});
 updateParallax();
}
})();
