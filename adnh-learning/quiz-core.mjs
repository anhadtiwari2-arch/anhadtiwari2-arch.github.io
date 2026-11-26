import {hotels,canHotel,resolveHotelScope,managementPeople} from './core.mjs';
const departments=['Front Office','Food & Beverage','Housekeeping'];
export function ensureQuizzes(db){
 if(!Array.isArray(db.quizzes))db.quizzes=hotels.flatMap(h=>departments.map((department,i)=>({id:`${h.id}-QUIZ-${i}`,hotel:h.id,department,title:'Service essentials · '+department,passMark:70,status:'Published',questions:[{prompt:'A guest raises a concern. What should you do first?',options:['Listen carefully and acknowledge the concern','Interrupt to explain hotel policy','Refer the guest elsewhere without listening','Promise something you cannot deliver'],correct:0},{prompt:'How should you handle a guest’s personal information?',options:['Discuss it in a public area','Share it with colleagues who are curious','Use approved systems and share only with authorised colleagues','Keep a copy on a personal device'],correct:2},{prompt:'When you identify a safety hazard, what is the appropriate response?',options:['Wait for another department to notice','Follow the hotel’s safety procedure and report it promptly','Continue working without action','Ask a guest to resolve it'],correct:1}]})));
 if(!Array.isArray(db.quizAttempts))db.quizAttempts=[];
 return db;
}
export function visibleQuizzes(db,user,hotel,department='all'){
 hotel=resolveHotelScope(user,hotel);const dep=['hod','trainer','member'].includes(user?.role)?user.department:department;
 return (db.quizzes||[]).filter(q=>canHotel(user,q.hotel)&&(hotel==='all'||q.hotel===hotel)&&(dep==='all'||q.department===dep)&&q.status==='Published');
}
export function canManageQuiz(user){return !!user?.active&&['admin','cluster','hotel','hod','trainer'].includes(user.role);}
export function createQuiz(db,user,hotel,department,input){
 if(!canManageQuiz(user)||hotel==='all'||!canHotel(user,hotel)||!hotels.some(h=>h.id===hotel)||department==='all'||!managementPeople(db,user,hotel,department).length)throw Error('Select an authorised hotel and department first.');
 const title=String(input.title||'').trim(),passMark=Number(input.passMark),questions=input.questions;
 if(!title||title.length>120||!Number.isInteger(passMark)||passMark<1||passMark>100||!Array.isArray(questions)||questions.length<1||questions.length>20)throw Error('Provide a title, a valid pass mark and questions.');
 for(const q of questions){if(!String(q.prompt||'').trim()||q.prompt.length>500||!Array.isArray(q.options)||q.options.length!==4||q.options.some(x=>!String(x).trim()||x.length>240)||new Set(q.options.map(x=>x.trim().toLowerCase())).size!==4||!Number.isInteger(q.correct)||q.correct<0||q.correct>3)throw Error('Each question needs four different options and one correct answer.');}
 const q={id:crypto.randomUUID(),hotel,department,title,passMark,status:'Published',questions:questions.map(q=>({prompt:q.prompt.trim(),options:q.options.map(x=>x.trim()),correct:q.correct}))};db.quizzes.push(q);return q;
}
export function submitQuiz(db,user,quizId,answers){
 if(user?.role!=='member')throw Error('Only a team member can submit a scored attempt.');
 const q=visibleQuizzes(db,user,user.employeeHotel,user.department).find(q=>q.id===quizId);
 const p=managementPeople(db,user,user.employeeHotel,user.department).find(p=>p.id===user.employee);
 if(!q||!p)throw Error('This quiz is outside your hotel or department.');
 if(db.quizAttempts.some(a=>a.quiz===q.id&&a.hotel===p.hotel&&a.employee===p.id))throw Error('Your attempt is already recorded.');
 if(!Array.isArray(answers)||answers.length!==q.questions.length||answers.some(a=>!Number.isInteger(a)||a<0||a>3))throw Error('Answer every question before submitting.');
 const correct=q.questions.reduce((n,x,i)=>n+(x.correct===answers[i]?1:0),0),score=Math.round(correct/q.questions.length*100);
 const attempt={id:crypto.randomUUID(),quiz:q.id,title:q.title,hotel:p.hotel,department:q.department,employee:p.id,name:p.name,answers:[...answers],correct,total:q.questions.length,score,passMark:q.passMark,passed:score>=q.passMark,time:new Date().toISOString()};db.quizAttempts.push(attempt);return attempt;
}
export function visibleQuizAttempts(db,user,hotel,department='all'){
 hotel=resolveHotelScope(user,hotel);const dep=['hod','trainer','member'].includes(user?.role)?user.department:department;
 return (db.quizAttempts||[]).filter(a=>canHotel(user,a.hotel)&&(hotel==='all'||a.hotel===hotel)&&(dep==='all'||a.department===dep)&&(user.role!=='member'||a.employee===user.employee&&a.hotel===user.employeeHotel));
}
