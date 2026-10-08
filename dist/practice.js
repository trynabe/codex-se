// Each chapter: 10 easy, 5 medium, 5 hard, kept in learning order.
const QUESTIONS=QUIZ_BANK;
const DIFFICULTY_LABELS={easy:'ง่าย',medium:'ปานกลาง',hard:'ยาก'};
// Retain the separate 15-point Part 1 simulation: one question at each level per chapter.
const THEORY_EXAM=['foundation','project','process','requirements','ui'].flatMap(topic=>{
 const indices=QUESTIONS.map((question,index)=>({question,index})).filter(x=>x.question.topic===topic).map(x=>x.index);
 return [indices[1],indices[10],indices[17]];
});
