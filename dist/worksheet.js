// Blank answer pages follow the current generated Lab question when printing.
function labWorksheetQuestionFooter(c){
 return `<div class="lab-question-footer"><span>${esc(c.code)} · ฝึก 75 นาที</span><span>1 / 5</span></div>`;
}
function labWorksheetPages(c){
 const header=(title,subtitle)=>`<header class="lab-sheet-header"><div class="lab-sheet-code">${esc(c.code)} · พื้นที่เขียนคำตอบ</div><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></header>`;
 const sheet=(title,subtitle,content,page)=>`<section class="lab-sheet">${header(title,subtitle)}${content}<div class="lab-sheet-footer"><span>${esc(c.code)} · ฝึก 75 นาที</span><span>${page} / 5</span></div></section>`;
 const diagram=(title,page)=>sheet(title,c.thai,`<div class="lab-sheet-diagram"><svg viewBox="0 0 720 890" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><pattern id="lab-sheet-dots-${page}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r=".8" fill="#dce3ec"/></pattern></defs><rect width="720" height="890" fill="url(#lab-sheet-dots-${page})"/></svg></div>`,page);
 const labels=[['name','Name','ชื่อ Use case'],['actor','Primary Actor','ผู้ใช้งานหลัก'],['goal','Goal','เป้าหมาย'],['pre','Precondition','เงื่อนไขก่อนเริ่ม'],['trigger','Trigger','เหตุเริ่มต้น'],['main','Main Scenario','ขั้นตอนปกติ'],['exception','Exception','กรณีผิดปกติ'],['post','Postcondition','สถานะหลังจบ']];
 const narrative=(title,page)=>sheet(title,'Narrative · ตารางคำตอบ',`<table class="lab-sheet-narrative"><tbody>${labels.map(([key,en,th])=>`<tr class="lab-sheet-${key}"><th scope="row">${en}<small>${th}</small></th><td></td></tr>`).join('')}</tbody></table>`,page);
 return `<div class="lab-worksheets">${diagram('1 · Use case diagram',2)}${narrative('2.1 · '+c.tasks[0],3)}${narrative('2.2 · '+c.tasks[1],4)}${diagram('3 · Context DFD',5)}</div>`;
}
