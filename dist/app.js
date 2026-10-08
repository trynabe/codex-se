const main=document.getElementById('main');
const themeToggle=document.getElementById('theme-toggle');
function updateThemeToggle(){
 const dark=document.documentElement.dataset.theme==='dark';
 themeToggle.innerHTML=`<span aria-hidden="true">${dark?'☀':'☾'}</span> ${dark?'โหมดขาว':'โหมดดำ'}`;
 themeToggle.setAttribute('aria-pressed',String(dark));
 themeToggle.setAttribute('aria-label',`สลับเป็น${dark?'โหมดขาว':'โหมดดำ'}`);
 themeToggle.title=`ขณะนี้ใช้${dark?'โหมดดำ':'โหมดขาว'}`;
}
themeToggle.addEventListener('click',()=>{
 const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
 document.documentElement.dataset.theme=theme;
 try{localStorage.setItem('se-theme',theme);}catch{}
 updateThemeToggle();
});
updateThemeToggle();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topicName=id=>LESSONS.find(x=>x.id===id)?.thai||id;
const intro=(title,desc,eyebrow='ITDS261 · MIDTERM')=>`<div class="page-intro"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${desc}</p></div><div class="score-tiles"><div class="score-tile"><b>15</b><span>ทฤษฎี · Part 1</span></div><div class="score-tile alt"><b>25</b><span>วิเคราะห์ · Part 2</span></div></div></div>`;
const iconNav=l=>`<a class="nav-item" href="#lesson/${l.id}"><span class="nav-icon">${l.no}</span>${l.thai}</a>`;
document.getElementById('theory-nav').innerHTML=LESSONS.filter(l=>l.part===1).map(iconNav).join('');
document.getElementById('model-nav').innerHTML=LESSONS.filter(l=>l.part!==1).map(iconNav).join('');
const menu=document.getElementById('menu-button');
menu.addEventListener('click',()=>{const open=document.getElementById('sidebar').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
let quiz={mode:'all',indices:[],index:0,results:[],checked:false,selection:null,started:false};
let caseView='usecase';
let activeCase='';
function renderLesson(id){
 const l=LESSONS.find(x=>x.id===id)||LESSONS[0];
 main.innerHTML=intro('อ่านให้เข้าใจ แล้วลองทำ','บทเรียนภาษาไทยพร้อมศัพท์ที่ใช้ในข้อสอบ')+`<div class="chapter-head"><span class="chapter-num">${l.no}</span><div><h2>${l.title}</h2><p>${l.summary} · อ่านประมาณ ${l.time} นาที</p></div></div><div class="reading-layout"><article class="reading-body">${l.content}<div class="button-row"><a class="btn" href="#quiz/${l.id}">ลอง Quiz เรื่องนี้</a></div></article><aside class="toc"><h3>ในบทนี้</h3><div id="toc-links"></div><div class="next-block"><h3>บทเรียนต่อไป</h3><a href="#lesson/${LESSONS[(LESSONS.indexOf(l)+1)%LESSONS.length].id}">${LESSONS[(LESSONS.indexOf(l)+1)%LESSONS.length].thai}</a><a href="#examples/zoo">ดูตัวอย่างสวนสัตว์</a></div></aside></div>`;
 const headings=main.querySelectorAll('.lesson-section h2');
 headings.forEach((h,i)=>h.parentElement.id=`section-${i}`);
 document.getElementById('toc-links').innerHTML=[...headings].map((h,i)=>`<a href="#" data-scroll="section-${i}">${h.textContent}</a>`).join('');
 const relationship=document.getElementById('relationship-diagram');if(relationship)relationship.innerHTML=relationshipDiagram();
 main.querySelectorAll('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.dataset.scroll).scrollIntoView();}));
}
function svgWrap(vw,vh,body,title){return `<figure class="diagram-frame"><svg viewBox="0 0 ${vw} ${vh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(title)}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9" fill="none" stroke="var(--diagram-line)" stroke-width="1.5"/></marker></defs>${body}</svg><figcaption>${title} · เลื่อนแนวนอนเพื่อดูบนมือถือ</figcaption></figure>`;}
function st(x,y,s,size=16,anchor='middle'){return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="svg-text" font-size="${size}">${esc(s)}</text>`;}
function actor(x,y,label){return `<g stroke="var(--diagram-line)" fill="none" stroke-width="2"><circle cx="${x}" cy="${y-23}" r="11"/><path d="M${x} ${y-12}v36m-22-23h44m-22 23l-22 30m22-30l22 30"/></g>${st(x,y+72,label,15)}`;}
function relationshipDiagram(){return svgWrap(960,270,`<rect x="20" y="20" width="920" height="230" rx="10" fill="var(--paper)" stroke="var(--line)"/><ellipse cx="195" cy="85" rx="140" ry="35" fill="var(--soft)" stroke="var(--diagram-line)"/>${st(195,91,'ซื้อตั๋ว')}<ellipse cx="750" cy="85" rx="140" ry="35" fill="var(--soft)" stroke="var(--diagram-line)"/>${st(750,91,'ชำระเงิน')}<path d="M335 85H608" fill="none" stroke="var(--diagram-line)" stroke-width="2" stroke-dasharray="7 5" marker-end="url(#arrow)"/>${st(470,65,'«include»')}<ellipse cx="195" cy="190" rx="140" ry="35" fill="var(--soft)" stroke="var(--diagram-line)"/>${st(195,196,'แนบรูป')}<ellipse cx="750" cy="190" rx="140" ry="35" fill="var(--soft)" stroke="var(--diagram-line)"/>${st(750,196,'รายงานถนนชำรุด')}<path d="M335 190H608" fill="none" stroke="var(--diagram-line)" stroke-width="2" stroke-dasharray="7 5" marker-end="url(#arrow)"/>${st(470,171,'«extend» [เลือกแนบรูป]')}`,'ทิศทาง Include และ Extend');}
function usecaseDiagram(c){
 const height=Math.max(500,c.uses.length*72+90), baseY=i=>85+i*72;
 const humans=c.roles.filter(x=>!/(Gateway|API|Service)/.test(x));
 const rolePositions=c.roles.map((r,i)=>{const special=/(Gateway|API|Service)/.test(r);const group=special?c.roles.filter(x=>/(Gateway|API|Service)/.test(x)):humans;return {x:special?1090:115,y:110+group.indexOf(r)*(height-230)/Math.max(1,group.length-1)};});
 let lines='',nodes='';
 c.uses.forEach(([name,rs],i)=>{const y=baseY(i);rs.forEach(ri=>{const pos=rolePositions[ri];lines+=`<path d="M${pos.x+(pos.x<500?25:-25)} ${pos.y+5} L${pos.x<500?360:760} ${y}" stroke="var(--diagram-association)" fill="none" stroke-width="1.5"/>`;});nodes+=`<ellipse cx="560" cy="${y}" rx="200" ry="26" fill="var(--soft)" stroke="var(--diagram-line)" stroke-width="1.6"/>${st(560,y+6,name,17)}`;});
 const links=c.links.map(([from,to,type],i)=>{const x=820+i*38;return `<path d="M760 ${baseY(from)}H${x}V${baseY(to)}H765" fill="none" stroke="var(--diagram-line)" stroke-dasharray="6 5" stroke-width="1.7" marker-end="url(#arrow)"/><rect x="${x-34}" y="${(baseY(from)+baseY(to))/2-12}" width="68" height="24" fill="var(--paper)"/>${st(x,(baseY(from)+baseY(to))/2+5,'«'+type+'»',13)}`;}).join('');
 return svgWrap(1220,height,`<rect x="300" y="20" width="650" height="${height-40}" rx="4" fill="var(--paper)" stroke="var(--diagram-line)"/>${st(625,46,c.diagramTitle||c.title,17)}${lines}${links}${nodes}${c.roles.map((r,i)=>actor(rolePositions[i].x,rolePositions[i].y,r)).join('')}`,'Use case diagram · '+(c.diagramTitle||c.title));
}
function flowLines(s,max=39){const parts=s.split(' / '),lines=[];let line='';for(const part of parts){if(line.length+part.length>max&&line){lines.push(line);line=part;}else line+=line?' / '+part:part;}if(line)lines.push(line);return lines;}
function contextDiagram(c){
 const count=c.flows.length,height=count*185+45,cy=height/2,cx=965,r=130;
 let s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--soft)" stroke="var(--diagram-line)" stroke-width="2.5"/>${st(cx,cy-30,'0',30)}${st(cx,cy+2,'ระบบ',18)}${st(cx,cy+33,c.shortTitle||(c.id==='uebs'?'Equipment Borrowing':c.id==='studio'?'Studio Booking':c.id==='zoo'?'Zoo Ticketing':c.id==='phtrs'?'PHTRS':c.id==='clinic'?'Dental Appointment':'POS'),18)}${c.place?st(cx,cy+64,c.place,14):''}`;
 c.flows.forEach(([entity,inbound,outbound],i)=>{const y=90+i*185;const endY=cy+(i-(count-1)/2)*30;const endX=cx-Math.sqrt(r*r-(endY-cy)*(endY-cy));const outY=endY+13,outX=cx-Math.sqrt(r*r-(outY-cy)*(outY-cy));s+=`<rect x="15" y="${y-33}" width="230" height="74" rx="2" fill="var(--paper)" stroke="var(--diagram-line)" stroke-width="1.7"/>${st(130,y+9,entity,16)}<path d="M245 ${y-14}H${715+i*10}L${endX-4} ${endY}" fill="none" stroke="var(--diagram-line)" stroke-width="1.7" marker-end="url(#arrow)"/><path d="M${outX} ${outY}L${695+i*10} ${y+31}H248" fill="none" stroke="var(--diagram-line)" stroke-width="1.7" marker-end="url(#arrow)"/>${flowLines(inbound).map((l,j)=>st(470,y-30-(flowLines(inbound).length-1-j)*21,l,15)).join('')}${flowLines(outbound).map((l,j)=>st(470,y+55+j*21,l,15)).join('')}`;});
 return svgWrap(1120,height,s,'Context DFD · '+(c.diagramTitle||c.title)+' · ดูทิศหัวลูกศรสำหรับข้อมูลเข้า / ออก');
}
function renderCase(id){
 const c=CASES.find(x=>x.id===id)||CASES[0];if(activeCase!==c.id)caseView='usecase';activeCase=c.id;
 main.innerHTML=intro('ตัวอย่างจากโจทย์','อ่านโจทย์ แล้วเทียบวิธีคิดกับโมเดลทั้งสาม')+`<div class="case-picker">${CASES.map(x=>`<a href="#examples/${x.id}" class="${x.id===c.id?'selected':''}">${x.id==='uebs'?'UEBS':x.id==='phtrs'?'PHTRS':x.title.split(' ')[0]}</a>`).join('')}</div><article class="case-surface"><span class="eyebrow">กรณีศึกษา · ${c.title}</span><h2>${c.thai}</h2>${p(c.prompt)}${note('สมมติฐานของตัวอย่าง',c.assumption)}${table(['ประเภท','ตัวอย่าง Requirement'],c.requirements)}<div class="view-tabs" role="group" aria-label="เลือกโมเดล">${[['usecase','Use case diagram'],['narrative','Use case narrative'],['context','Context DFD']].map(([id,t])=>`<button class="${id===caseView?'selected':''}" data-view="${id}" aria-pressed="${id===caseView}">${t}</button>`).join('')}</div><div id="case-content"></div>${note('จุดที่ควรระวังจากงานเดิม',c.pitfall)}${refs([[c.source,'']])}</article>`;
 updateCaseContent(c);main.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{caseView=b.dataset.view;main.querySelectorAll('[data-view]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});updateCaseContent(c);}));
 const labLink=document.createElement('div');labLink.className='lab-entry';labLink.innerHTML=`<div><strong>ฝึกทำโจทย์ Lab ภายใน 75 นาที</strong><p>โจทย์ฉบับย่อทั้ง 3 แนว พร้อมงานวาดและ Narrative ก่อนเปิดแนวคำตอบ</p></div><a class="btn" href="#lab/${({uebs:'borrow',studio:'booking',phtrs:'repair'})[c.id]||'all'}">สุ่มโจทย์ Lab</a>`;main.querySelector('.case-picker').before(labLink);
}
function updateCaseContent(c){const node=document.getElementById('case-content');node.innerHTML=caseView==='usecase'?usecaseDiagram(c)+table(['Use case','Actor ที่เกี่ยวข้อง'],c.uses.map(([n,rs])=>[n,rs.map(i=>c.roles[i]).join(', ')||'พฤติกรรมที่ use case หลักนำมาใช้'])):caseView==='narrative'?c.narratives():contextDiagram(c)+table(['External entity','Entity → ระบบ','ระบบ → Entity'],c.flows);}
function labAnswerSummary(c){
 return `<div class="lab-answer-case"><div class="lab-answer-case-heading"><strong>${esc(c.thai)}</strong><span class="pill">${esc(c.code)}</span></div><dl class="lab-answer-rules">${c.rules.map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl><p>ชื่อระบบและเงื่อนไขนี้ตรงกับโจทย์ด้านบน แผนภาพอาจมีโครงสร้างเหมือนกันเมื่อเปลี่ยนเพียงสถานที่หรือตัวเลข</p></div>`;
}
function labAnswerContent(c,key){
 const identity=`<div class="lab-answer-identity" data-lab-answer-code="${esc(c.code)}"><strong>${esc(c.code)}</strong><span>${esc(c.thai)}</span></div>`;
 const content=key==='analysis'?table(['บทบาทภายนอก','เป้าหมาย / การเชื่อมต่อ'],c.roles.map((r,i)=>[esc(r),c.uses.filter(([,rs])=>rs.includes(i)).map(([n])=>esc(n)).join(' · ')]))+table(['ประเภท','แนววิเคราะห์'],c.requirements)+note('สถานะสำคัญ',esc(c.states))+section('จุดที่ต้องอ่านให้ครบ',list(c.traps.map(esc))):key==='usecase'?usecaseDiagram(c)+table(['Use case','บทบาทที่เกี่ยวข้อง'],c.uses.map(([n,rs])=>[esc(n),rs.map(i=>esc(c.roles[i])).join(', ')||'พฤติกรรมที่ use case หลักเรียกใช้'])):key==='narrative'?c.narratives():contextDiagram(c)+table(['External entity','Entity → ระบบ','ระบบ → Entity'],c.flows);
 return identity+content;
}
let labScenario=null,labFamily='all';
function renderLab(family){
 if(family&&LAB_FAMILIES.some(([id])=>id===family)&&family!==labFamily){labFamily=family;labScenario=null;}
 if(!labScenario)labScenario=makeLabScenario(labFamily);
 const c=labScenario;
 main.innerHTML=intro('โจทย์ Lab · ฝึก 75 นาที','อ่านสถานการณ์ แล้วฝึกวาด Use case diagram เขียน Narrative และวาด Context DFD')+`<section class="practice-surface lab-controls"><div class="lab-picker"><h2 id="lab-picker-title">เลือกแนวโจทย์</h2><div class="lab-family-buttons" role="group" aria-labelledby="lab-picker-title">${LAB_FAMILIES.map(([id,t])=>`<button type="button" class="lab-family-button ${id===labFamily?'selected':''}" data-lab-family="${id}" aria-pressed="${id===labFamily}">${esc(t)}</button>`).join('')}</div></div><button type="button" class="btn" id="lab-generate"><span aria-hidden="true">↻</span> สุ่มโจทย์ใหม่</button><p>กดเลือกแนวเพื่อสุ่มทันที หรือกดสุ่มโจทย์ใหม่ในแนวที่เลือก · ฝึกทำ 75 นาที</p></section><article class="case-surface lab-problem"><div class="lab-problem-heading"><span class="eyebrow">โจทย์ฝึกเพิ่มเติม · ${esc(c.code)}</span><div class="lab-problem-actions"><button class="btn secondary small" id="lab-copy">คัดลอกโจทย์</button><button class="btn secondary small" id="lab-print">พิมพ์เอกสาร</button></div></div><h2>${esc(c.thai)}</h2><p class="lab-meta">ฉบับย่อ ${c.paragraphs.length} ย่อหน้า · เวลาแนะนำ ${c.duration} นาที · ลองทำก่อนเปิดแนวคำตอบ</p><div id="lab-story">${c.paragraphs.map(t=>p(esc(t))).join('')}</div><section class="lab-tasks"><h3>งานที่ต้องทำ</h3><ol><li>วาด Use case diagram พร้อมบทบาท ขอบเขตและความสัมพันธ์ที่เหมาะสม <strong>· 20 นาที</strong></li><li>เขียน Use case narrative 2 กรณี: <strong>${esc(c.tasks.join(' และ '))}</strong> ให้ครบ Name, Actor, Goal, Precondition, Trigger, Main Scenario, Exception และ Postcondition <strong>· 30 นาที</strong></li><li>วาด Context DFD แสดง Process 0, External entities และชื่อข้อมูลเข้า–ออก <strong>· 15 นาที</strong></li></ol><p>เผื่ออ่านโจทย์และตรวจคำตอบรวม 10 นาที รวมทั้งหมด 75 นาที</p><p class="lab-print-note">เอกสารพิมพ์ 5 หน้า: โจทย์ 1 หน้า และพื้นที่เขียนคำตอบ 4 หน้า</p></section><details class="lab-hint"><summary>เปิดตัวช่วยอ่านโจทย์</summary>${list(['อ่านรอบแรกเพื่อหาว่าระบบทำอะไรและอะไรอยู่นอกขอบเขต','รอบสองจดบทบาท → เป้าหมาย → ข้อมูลที่รับและส่ง','แยกเส้นทางสำเร็จ เงื่อนไขที่ผิด และสถานะสุดท้าย','Use case เน้นเป้าหมายผู้ใช้; Context เน้นข้อมูลที่ข้ามขอบเขต; Narrative เน้นลำดับโต้ตอบ'])}</details><div class="references">โจทย์นี้แต่งเพิ่มและเปลี่ยนเงื่อนไขเพื่อฝึก อิงลักษณะโจทย์ ${c.family==='borrow'?'UEBS':c.family==='booking'?'Studio Booking':'Lab PHTRS'} ในเอกสารของคุณ ไม่ใช่ข้อสอบจริงหรือโจทย์ต้นฉบับ${refs([[c.source,'']])}</div></article><section class="case-surface lab-answers" data-lab-scenario="${esc(c.code)}"><h2>แนวคำตอบ · เปิดหลังลองทำ</h2>${labAnswerSummary(c)}<p class="muted">ตัวอย่างวิธีจัดโมเดลที่สอดคล้องกับโจทย์ชุดนี้ สามารถจัดกลุ่ม Use cases ต่างจากตัวอย่างได้เมื่อพฤติกรรมครบ</p>${[['analysis','วิเคราะห์บทบาท Requirement และสถานะ'],['usecase','Use case diagram'],['narrative','Use case narrative 2 กรณี'],['context','Context DFD และตารางข้อมูล']].map(([key,t])=>`<details data-lab-answer="${key}"><summary>${t}</summary><div class="lab-answer-content"></div></details>`).join('')}<details><summary>ตรวจงานตัวเองก่อนดูเฉลย</summary>${list(['บทบาทในโจทย์ครบ และชื่อบทบาทไม่ย่อจนอ่านไม่เข้าใจ','ชื่อ Use case เป็นการกระทำและเป้าหมาย ไม่ใช่แค่ชื่อข้อมูล','include ชี้ไปสิ่งที่เรียกใช้; extend ชี้ไป use case หลักและมีเงื่อนไข','Narrative ใช้ชื่อเดียวกับแผนภาพ มีขั้น Actor และระบบ พร้อม Exception ที่อ้างขั้น','Context มี Process 0 เดียว ไม่มีฐานข้อมูลภายใน และลูกศรมีชื่อข้อมูล','กฎและสถานะในโมเดลตรงกับโจทย์ที่สุ่มได้ ไม่ใช้คำตอบจากโจทย์ชุดก่อน'])}</details></section>`;
 const generateLab=family=>{labFamily=family;labScenario=makeLabScenario(labFamily,c.signature);renderLab();};
 document.getElementById('lab-generate').onclick=()=>{generateLab(labFamily);document.getElementById('lab-generate').focus({preventScroll:true});};
 main.querySelectorAll('[data-lab-family]').forEach(button=>button.onclick=()=>{const family=button.dataset.labFamily;generateLab(family);main.querySelector(`[data-lab-family="${family}"]`).focus({preventScroll:true});});
 main.querySelector('.lab-problem').insertAdjacentHTML('beforeend',labWorksheetQuestionFooter(c));
 main.insertAdjacentHTML('beforeend',labWorksheetPages(c));
 main.querySelectorAll('[data-lab-answer]').forEach(d=>d.addEventListener('toggle',()=>{
  if(!d.open||!d.isConnected||labScenario!==c||(d.dataset.loaded&&d.dataset.scenario===c.code))return;
  const key=d.dataset.labAnswer,node=d.querySelector('.lab-answer-content');
  node.innerHTML=labAnswerContent(c,key);
  d.dataset.scenario=c.code;
  d.dataset.loaded='true';
 }));
 document.getElementById('lab-print').onclick=()=>window.print();
 document.getElementById('lab-copy').onclick=async()=>{
  const btn=document.getElementById('lab-copy');
  const text=c.thai+'\n'+c.code+' · เวลาแนะนำ '+c.duration+' นาที\n\n'+c.paragraphs.join('\n\n')+'\n\nงานที่ต้องทำ\n1. Use case diagram\n2. Narrative: '+c.tasks.join(' และ ')+'\n3. Context DFD';
  try{await navigator.clipboard.writeText(text);btn.textContent='คัดลอกแล้ว';}catch{btn.textContent='เลือกข้อความโจทย์เพื่อคัดลอก';const range=document.createRange();range.selectNodeContents(document.getElementById('lab-story'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}
 };
}
function quizOptions(){return [['all',`ทบทวนทั้งหมด · ${QUESTIONS.length} ข้อ`],['theory',`จำลอง Part 1 · ${THEORY_EXAM.length} คะแนน`],['part2',`Use case / Context · ${QUESTIONS.filter(q=>['usecase','context'].includes(q.topic)).length} ข้อ`],...LESSONS.map(l=>[l.id,`${l.no} · ${l.thai} · ${QUESTIONS.filter(q=>q.topic===l.id).length} ข้อ`])];}
function startQuiz(mode){if(!quizOptions().some(([id])=>id===mode))mode='all';quiz={mode,indices:mode==='theory'?[...THEORY_EXAM]:mode==='all'?QUESTIONS.map((_,i)=>i):QUESTIONS.map((x,i)=>({x,i})).filter(({x})=>mode==='part2'?['usecase','context'].includes(x.topic):x.topic===mode).map(({i})=>i),index:0,results:[],checked:false,selection:null,started:true};renderQuiz();}
function renderQuiz(routeMode){
 if(routeMode&&quiz.mode!==routeMode)quiz.started=false;
 const selected=routeMode||quiz.mode;
 main.innerHTML=intro('Quiz · ลองตอบก่อนดูเฉลย','8 บท รวม 160 ข้อ · แต่ละบทเรียงจากพื้นฐานไปโจทย์วิเคราะห์')+`<div class="practice-surface"><div class="quiz-controls"><div><label for="quiz-mode">เลือกชุดข้อสอบ</label><select id="quiz-mode">${quizOptions().map(([v,t])=>`<option value="${v}" ${v===selected?'selected':''}>${t}</option>`).join('')}</select></div><button class="btn" id="quiz-start">${quiz.started?'เริ่มชุดใหม่':'เริ่มทำ Quiz'}</button></div><div class="quiz-level-guide"><span>ข้อ 1–10 <b>ง่าย</b></span><span>ข้อ 11–15 <b>ปานกลาง</b></span><span>ข้อ 16–20 <b>ยาก</b></span></div><p class="quiz-guide-note">ลำดับนี้ใช้กับชุดรายบท · ชุดจำลอง Part 1 คัด 15 ข้อจาก 5 บทหลัก · บท 08 เป็นเนื้อหาเสริม</p><div id="quiz-panel"></div></div>`;
 document.getElementById('quiz-start').onclick=()=>startQuiz(document.getElementById('quiz-mode').value);
 if(!quiz.started){document.getElementById('quiz-panel').innerHTML=note('พร้อมเริ่ม','เลือกบทที่ต้องการแล้วกดเริ่ม มีเฉลยและเหตุผลหลังตรวจแต่ละข้อ คะแนนอยู่เฉพาะรอบที่เปิดหน้านี้');return;}
 drawQuestion();
}
function drawQuestion(){
 const node=document.getElementById('quiz-panel');
 if(quiz.index>=quiz.indices.length){
  const score=quiz.results.filter(x=>x.correct).length;
  const wrong=quiz.results.filter(x=>!x.correct);const topics=[...new Set(wrong.map(x=>x.topic))];
  const byLevel=Object.entries(DIFFICULTY_LABELS).map(([level,label])=>{const rows=quiz.results.filter(r=>QUESTIONS[r.qid].difficulty===level);return [label,`${rows.filter(r=>r.correct).length} / ${rows.length}`];}).filter(([,count])=>!count.endsWith('/ 0'));
  node.innerHTML=`<h2>ทำครบแล้ว</h2><div class="score-result">${score}<span class="muted"> / ${quiz.indices.length}</span></div>${p(quiz.mode==='theory'&&quiz.indices.length===15?'คะแนนจำลอง Part 1 จาก 15 คะแนน':'คะแนนทบทวน · '+Math.round(score/quiz.indices.length*100)+'%')}<div class="quiz-level-results">${table(['ระดับความยาก','ตอบถูก / ทั้งหมด'],byLevel)}</div>${topics.length?section('เรื่องที่ควรกลับไปอ่าน',list(topics.map(t=>`<a href="#lesson/${t}">${topicName(t)}</a> · ผิด ${wrong.filter(x=>x.topic===t).length} ข้อ`))):note('ทำได้ดีในชุดนี้','ลองทบทวนตัวอย่างระบบและทำ Quiz หัวข้ออื่นต่อ')}${wrong.length?`<details><summary>ทบทวนข้อที่ตอบผิด ${wrong.length} ข้อ</summary>${wrong.map(r=>p('<b>'+QUESTIONS[r.qid].stem+'</b>')+p('ระดับ'+DIFFICULTY_LABELS[QUESTIONS[r.qid].difficulty]+' · คำตอบ: '+QUESTIONS[r.qid].choices[QUESTIONS[r.qid].answer])+p(QUESTIONS[r.qid].why)).join('')}</details>`:''}<div class="button-row"><button class="btn" id="retry-wrong" ${wrong.length?'':'disabled'}>ทำข้อที่ผิดอีกครั้ง</button></div>`;
  document.getElementById('retry-wrong').onclick=()=>{quiz.indices=wrong.map(x=>x.qid);quiz.index=0;quiz.results=[];quiz.checked=false;quiz.selection=null;drawQuestion();};return;
 }
 const id=quiz.indices[quiz.index],question=QUESTIONS[id],score=quiz.results.filter(x=>x.correct).length;
 node.innerHTML=`<div class="quiz-meta"><span>ข้อ ${quiz.index+1} / ${quiz.indices.length}</span><span>ถูก ${score} จากที่ตอบ ${quiz.results.length} ข้อ</span></div><div class="progress-track"><span style="width:${quiz.results.length/quiz.indices.length*100}%"></span></div><div class="question-tags"><span class="pill">${topicName(question.topic)}</span><span class="difficulty-pill" data-difficulty="${question.difficulty}">ระดับ${DIFFICULTY_LABELS[question.difficulty]}</span></div><h2 class="question-title" id="question-heading">${question.stem}</h2><fieldset style="border:0;padding:0;margin:0"><legend class="sr-only">เลือกคำตอบ</legend><div class="choices">${question.choices.map((choice,i)=>`<label class="choice ${quiz.checked?(i===question.answer?'correct':i===quiz.selection?'wrong':''):''}"><input type="radio" name="choice" value="${i}" ${quiz.selection===i?'checked':''} ${quiz.checked?'disabled':''}><span class="choice-letter">${'ABCD'[i]}</span><span>${choice}</span></label>`).join('')}</div></fieldset><div id="quiz-feedback" aria-live="polite">${quiz.checked?feedback(question):''}</div><div class="button-row"><button class="btn" id="quiz-submit" ${quiz.checked?'hidden':''}>ตรวจคำตอบ</button><button class="btn" id="quiz-next" ${quiz.checked?'':'hidden'}>${quiz.index+1===quiz.indices.length?'ดูผลคะแนน':'ข้อถัดไป'}</button></div>`;
 node.querySelectorAll('input[name=choice]').forEach(input=>input.onchange=()=>quiz.selection=Number(input.value));
 document.getElementById('quiz-submit').onclick=()=>{if(quiz.selection===null){document.getElementById('quiz-feedback').innerHTML='<p role="alert">เลือกคำตอบก่อนกดตรวจครับ</p>';return;}quiz.checked=true;quiz.results.push({qid:id,topic:question.topic,selected:quiz.selection,correct:quiz.selection===question.answer});drawQuestion();document.getElementById('quiz-next').focus();};
 document.getElementById('quiz-next').onclick=()=>{quiz.index++;quiz.checked=false;quiz.selection=null;drawQuestion();const heading=document.getElementById('question-heading');if(heading){heading.tabIndex=-1;heading.focus();}};
}
function feedback(question){const correct=quiz.selection===question.answer;return `<div class="feedback ${correct?'':'wrong'}"><strong>${correct?'ตอบถูก':'ยังไม่ถูก'} · เฉลย ${'ABCD'[question.answer]}</strong>${p(question.why)}<a href="#lesson/${question.topic}">กลับไปอ่านบทนี้</a></div>`;}
function renderSources(){
 const groups=[['สไลด์และขอบเขตสอบ',SOURCES.filter(x=>x.source.startsWith('lecture\\lecture')&&!x.source.includes('::'))],['งาน Lab และงานที่ทำไว้',SOURCES.filter(x=>x.source.startsWith('lab\\')||x.source.startsWith('lecture\\work'))],['ชุดอ่านทบทวนและแผนภาพ',SOURCES.filter(x=>x.source.startsWith('mid-term\\'))],['เอกสารภายใน ZIP',SOURCES.filter(x=>x.source.includes('::'))]];
 main.innerHTML=intro('เอกสารที่ใช้อ่าน','ตรวจสอบที่มาของบทเรียนและขอบเขตที่นำมาทบทวน')+`<article class="sources-surface">${note('ใช้ขอบเขตจากผู้สอนเป็นหลัก','Midterm Guideline หน้า 1 และภาพที่แนบ: Part 1 = Foundation & Project Management, Process, Requirements, Interface Design; Part 2 = Use case diagram, Narrative, Context DFD เอกสารประกอบที่เป็นงานนักศึกษามีจุดคลาดเคลื่อน จึงใช้เทียบกับสไลด์และแยกคำอธิบายแก้ไข')}${p('ตรวจไฟล์ต้นฉบับในโฟลเดอร์ รวม PDF, Word, รูป, ไฟล์แผนภาพ และเอกสารใน ZIP รวม '+SOURCES.length+' รายการเนื้อหา (ไม่นับ desktop.ini และ ZIP ที่เป็นภาชนะ) อ่าน PDF '+SOURCES.filter(x=>x.kind==='.pdf').reduce((n,x)=>n+x.pages,0)+' หน้า · ไฟล์ test.drawio เป็นภาพ PNG ที่มีข้อมูลแผนภาพฝังอยู่')}${p('บทเรียนเป็นการเรียบเรียง ตัวอย่าง/NFR ที่เสนอเพิ่มและแบบฝึกหัดระบุแยกจากข้อกำหนดโจทย์ ไม่รับรองว่าแนวเฉลยเป็นคำตอบเดียวที่ผู้สอนยอมรับ')}${groups.map(([t,rows])=>`<section class="source-group"><h2>${t}</h2>${rows.map(x=>`<div class="source-row" id="source-${x.id}"><p>${esc(x.source.split('\\').pop())}</p><code>${esc(x.source)}</code><br><small>${x.kind.slice(1).toUpperCase()}${x.pages?' · '+x.pages+' หน้า':''} · ${x.kind==='.png'||x.kind==='.drawio'?'ตรวจภาพและแผนภาพ':'อ่านข้อความและตรวจตัวอย่างที่เกี่ยวข้อง'}</small></div>`).join('')}</section>`).join('')}<section class="source-group"><h2>ตรวจแนวคิดเพิ่มเติมจากต้นฉบับ</h2><p><a href="https://agilemanifesto.org/" target="_blank" rel="noopener">Agile Manifesto</a> · ตรวจการตีความคุณค่า Agile ทั้งสองด้าน</p><p><a href="https://www.omg.org/spec/UML/2.5.1/About-UML" target="_blank" rel="noopener">OMG · UML 2.5.1</a> · แหล่งมาตรฐาน UML (ทิศ Include/Extend ในบทเรียนเทียบกับ L4 หน้า 19–20)</p></section></article>`;
}
function route(){
 const [requestedPage,requestedArg]=(location.hash.slice(1)||'lesson/foundation').split('/');
 const valid=['lesson','examples','lab','quiz','sources'].includes(requestedPage);
 const page=valid?requestedPage:'lesson',arg=valid?requestedArg:'foundation';
 if(!valid)history.replaceState(null,'','#lesson/foundation');
 document.getElementById('sidebar').classList.remove('open');menu.setAttribute('aria-expanded','false');
 switch(page){case 'lesson':renderLesson(arg);break;case 'examples':renderCase(arg);break;case 'lab':renderLab(arg);break;case 'quiz':renderQuiz(arg);break;case 'sources':renderSources();break;default:renderLesson('foundation');}
 document.querySelectorAll('.nav-item').forEach(a=>a.classList.toggle('active',a.hash===location.hash||(page==='quiz'&&a.hash==='#quiz')||(page==='lab'&&a.hash==='#lab')||(page==='examples'&&a.hash==='#examples/zoo')||(!location.hash&&a.hash==='#lesson/foundation')));
 document.title=(main.querySelector('h1')?.textContent||'SE Study Room')+' · SE Study Room';
 window.scrollTo(0,0);
}
document.addEventListener('click',e=>{const link=e.target.closest('[data-source]');if(link){const id=link.dataset.source;setTimeout(()=>{document.getElementById('source-'+id)?.scrollIntoView({block:'center'});document.getElementById('source-'+id)?.classList.add('highlight');},30);}});
window.addEventListener('hashchange',route);route();
