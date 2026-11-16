document.documentElement.classList.add('has-js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let paused = reducedMotion.matches;
function setMotion(){document.documentElement.classList.toggle('motion-paused', paused);motionButton.setAttribute('aria-pressed', String(paused));motionButton.innerHTML = paused ? 'Resume motion <span aria-hidden="true">▷</span>' : 'Pause motion <span aria-hidden="true">Ⅱ</span>';}
setMotion();motionButton.addEventListener('click',()=>{paused=!paused;setMotion()});
reducedMotion.addEventListener('change',e=>{paused=e.matches;setMotion()});
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{if(paused||e.pointerType!=='mouse')return;const r=hero.getBoundingClientRect();hero.style.setProperty('--visual-x',`${(e.clientX-r.left-r.width/2)*.009}px`);hero.style.setProperty('--visual-y',`${(e.clientY-r.top-r.height/2)*.008}px`)});
hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--visual-x','0px');hero.style.setProperty('--visual-y','0px')});
let scrollTicking=false;window.addEventListener('scroll',()=>{if(scrollTicking)return;scrollTicking=true;requestAnimationFrame(()=>{const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=`${total>0?scrollY/total*100:0}%`;scrollTicking=false})},{passive:true});
const menuButton=document.querySelector('.menu-toggle'), mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';mobileNav.hidden=open;menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open navigation':'Close navigation')});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const tabs=[...document.querySelectorAll('[data-tab]')];
function activateTab(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.querySelector(`#panel-${t.dataset.tab}`).hidden=!active})}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activateTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activateTab(tabs[next]);tabs[next].focus()}})});
const cases={
digital:{tag:'DIGITAL ENABLEMENT / IN-HOUSE LEARNING PLATFORM',title:'More time for people. Clearer insight for leaders.',lead:'I designed and developed a low-cost, in-house learning platform used with teams of up to 700 team members, connecting participation, learning evidence and leadership decisions.',sections:[['The operational challenge','Attendance sheets, separate quiz tools, nominations and reporting can create repeated work. Trainers need more time with people, and department heads need a clear view of learning needs and outstanding actions.'],['A connected workflow','QR attendance, learning hours, nominations and approvals, assessments, compliance records and certificates sit alongside department and individual reporting. Briefings, huddles and on-the-job learning bring everyday development into the same picture.'],['Efficiency for trainers and leaders','Connected records reduce repeated entry and the effort of consolidating information. Department leaders can review completion, quiz scores and pass rates, then focus coaching and refresher learning where support is needed.'],['A better experience for team members','Mobile access and QR entry make participation easier. Clear learning activities, daily huddles and self-paced quizzes fit more naturally around shifts and help colleagues take part with confidence.'],['The updated quiz experience','Live hosted and self-paced modes, simple code or QR joining, emoji avatars, countdowns, music, visual effects and leaderboards make quizzes more engaging. A simpler mobile home screen, clearer start controls, improved code entry and a full-screen host experience support smoother delivery.'],['Keeping operating costs low','Developed in house, the platform brings attendance, reporting and quizzes together to reduce the need for separate tools. Its value comes from simpler administration, reusable learning activities and more time available for coaching.']],evidenceTitle:'Used with teams of up to 700 team members',evidence:'A practical hospitality learning platform that connects participation, compliance evidence and leadership visibility. The interactive preview demonstrates selected workflows with sample content.',note:'The time-saving calculator uses adjustable assumptions, not measured results.'},
talent:{tag:'TALENT & LEADERSHIP / CLUSTER AND PROPERTY EXPERIENCE',title:'Giving potential a path forward.',lead:'Development becomes meaningful when people can connect today’s role with tomorrow’s opportunity, and leaders stay involved in that journey.',sections:[['Leadership challenge','A programme can introduce new ideas. Progress also needs exposure, feedback and follow through from the leaders who work alongside the individual.'],['My contribution','At Yas Plaza Hotels, supported Yaspire career development and succession planning with the Director of Human Resources and department heads. Supported seven Emirati management trainees across Front Office and Human Resources.'],['Continuing the work','At Rixos Bab Al Bahr, coordinate leadership and career development programmes, partnering with department heads on nominations, cross training and individual development follow up.'],['My leadership approach','Make development a shared conversation. Clarify the opportunity, involve the leader, create room to practise and return to the individual’s progress.']],evidenceTitle:'A partnership with leaders and emerging talent',evidence:'Experience spans a six-hotel cluster and a luxury resort, combining career development, succession support and individual follow up.',note:'Yas Plaza Hotels and Rixos Bab Al Bahr · Career development and succession support.'},
service:{tag:'CULTURE & GUEST EXPERIENCE / HOSPITALITY LEADERSHIP',title:'Turning guest insight into team capability.',lead:'My operational experience taught me that service culture is built in everyday decisions: how we listen, how we take ownership and how we support each other.',sections:[['Leadership challenge','Recurring guest concerns need more than a reminder. Leaders need to understand the gap, agree what good looks like and help teams practise a better response.'],['My contribution','Led weekly guest satisfaction reviews with department heads across voco Bonnington Dubai, Mövenpick JLT and Riva Beach Club, assigning coaching and corrective actions and reviewing follow up.'],['Connecting learning with culture','At Rixos Bab Al Bahr, build learning priorities from training needs, guest feedback and service audits. Facilitate service culture, service recovery and telephone handling programmes with departmental follow up.'],['Operational foundation','Years as a Duty Manager at Crowne Plaza Today Gurgaon built my judgement in guest recovery, shift leadership and cross-department coordination.']],evidenceTitle:'Quality audit results above 90%',evidence:'Supported through service audits, coaching and corrective action at the IHG operation in the Dubai cluster, and maintained during my Learning and Quality role at Crowne Plaza Today Gurgaon.',note:'Service quality is a team outcome. Explore an illustrative coaching scenario below.',scenario:true}
};
const dialog=document.querySelector('#case-dialog'),content=document.querySelector('#case-content');let opener;
function openCase(key,button){const c=cases[key];opener=button;content.replaceChildren();const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent=c.tag;const title=document.createElement('h2');title.id='case-title';title.textContent=c.title;const lead=document.createElement('p');lead.className='case-lead';lead.textContent=c.lead;const grid=document.createElement('div');grid.className='case-sections';c.sections.forEach(([heading,text])=>{const s=document.createElement('section'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=heading;p.textContent=text;s.append(h,p);grid.append(s)});const evidence=document.createElement('div');evidence.className='case-evidence';const strong=document.createElement('strong');strong.textContent=c.evidenceTitle;evidence.append(strong,document.createTextNode(c.evidence));const note=document.createElement('p');note.className='case-note';note.textContent=c.note;content.append(eyebrow,title,lead,grid,evidence,note);if(c.scenario)addScenario();document.body.classList.add('modal-open');dialog.showModal();dialog.scrollTop=0;document.querySelector('#close-dialog').focus()}
document.querySelectorAll('[data-case]').forEach(button=>button.addEventListener('click',()=>openCase(button.dataset.case,button)));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus()});
function addScenario(){const section=document.createElement('section');section.className='scenario';section.innerHTML='<h3>A moment to lead</h3><p>A guest has raised the same concern twice. Your team member is unsure what to do next. Which response best supports ownership?</p><div class="scenario-options"></div><p class="scenario-feedback" aria-live="polite">Choose a response to explore the coaching point.</p>';const options=[['Ask the team member to refer the guest to another department.','A referral may be needed, but passing the concern alone can leave both the guest and your team member without clear ownership. Agree who will follow through.'],['Understand the concern, agree an action and follow up together.','This combines empathy, clear ownership and coaching. The guest knows what will happen next, and the team member gains confidence through supported action.'],['Resolve it yourself and move on to the next task.','An immediate resolution can help the guest. Bring the team member into the reasoning and follow up afterwards so the experience also builds capability.']];const box=section.querySelector('.scenario-options');options.forEach(([label,feedback])=>{const b=document.createElement('button');b.textContent=label;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{box.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));section.querySelector('.scenario-feedback').textContent=feedback});box.append(b)});content.append(section)}


const quizQuestions = [
  {question:'A guest raises the same concern twice. What should happen next?', options:['Refer the guest elsewhere and move on.','Listen, agree an action and follow through.','Wait for the guest to ask again.'], correct:1, explanation:'Ownership means listening, agreeing the next action and following through. Involve the team member so the resolution also builds confidence.'},
  {question:'Attendance is complete, but quiz results show a knowledge gap. What is the best next step?', options:['Mark the topic complete and move on.','Repeat every programme for everyone.','Coach the specific gap and check understanding again.'], correct:2, explanation:'Attendance shows participation. Use assessment evidence to focus coaching, then check understanding and practical application.'},
  {question:'How can a departmental trainer make a short huddle more useful?', options:['Discuss one practical service situation and check understanding.','Read every policy aloud without discussion.','Focus only on recording attendance.'], correct:0, explanation:'A focused service example, a short discussion and a clear action make daily learning relevant to the shift ahead.'}
];
let quizIndex=0, quizScore=0, quizAnswered=false;
const quizOptions=document.querySelector('#quiz-options');
const quizNext=document.querySelector('#quiz-next');
function renderQuiz(){
  quizAnswered=false;
  const q=quizQuestions[quizIndex];
  document.querySelector('#quiz-progress').textContent=(quizIndex+1)+' / '+quizQuestions.length;
  document.querySelector('#quiz-question').textContent=q.question;
  document.querySelector('#quiz-feedback').textContent='Choose an answer to see the learning point.';
  quizNext.hidden=true;
  quizOptions.replaceChildren();
  q.options.forEach((label,index)=>{
    const button=document.createElement('button');
    button.type='button';button.textContent=label;
    button.addEventListener('click',()=>{
      if(quizAnswered)return;quizAnswered=true;
      if(index===q.correct)quizScore++;
      [...quizOptions.children].forEach((option,i)=>{
        option.disabled=true;
        option.classList.toggle('correct',i===q.correct);
        option.classList.toggle('incorrect',i===index&&index!==q.correct);
      });
      const final=quizIndex===quizQuestions.length-1;
      document.querySelector('#quiz-feedback').textContent=(index===q.correct?'Correct. ':'Learning point: ')+q.explanation+(final?' Sample complete: '+quizScore+' of '+quizQuestions.length+' correct.':'');
      quizNext.textContent=final?'Try again ↻':'Next question →';
      quizNext.hidden=false;
    });
    quizOptions.append(button);
  });
}
quizNext.addEventListener('click',()=>{
  if(quizIndex===quizQuestions.length-1){quizIndex=0;quizScore=0}else{quizIndex++}
  renderQuiz();quizOptions.querySelector('button').focus();
});
renderQuiz();
document.querySelector('#try-quiz').addEventListener('click',()=>{
  const tab=document.querySelector('#tab-quiz');activateTab(tab);
  document.querySelector('.portal-demo').scrollIntoView({behavior:paused?'instant':'smooth',block:'start'});
  tab.focus({preventScroll:true});
});
const calcFields=['calc-sessions','calc-people','calc-before','calc-after'].map(id=>document.getElementById(id));
function calculateTime(){
  const output=document.querySelector('#calc-result');
  if(calcFields.some(input=>input.value.trim()===''||!input.checkValidity())){output.textContent='Enter valid values in all four fields.';return}
  const [sessions,people,before,after]=calcFields.map(input=>Number(input.value));
  const hours=sessions*people*(before-after)/60;
  const formatted=new Intl.NumberFormat('en',{maximumFractionDigits:1}).format(Math.abs(hours));
  output.textContent=hours>0?formatted+' hours / month potentially freed':hours<0?formatted+' additional hours / month with these assumptions':'No time saving with these assumptions';
}
calcFields.forEach(input=>input.addEventListener('input',calculateTime));
calculateTime();

const careerChapters = {
  overview: {
    period:'2016 / PRESENT', location:'INDIA & THE UAE',
    title:'An operational foundation. A wider people perspective.',
    role:'Guest operations → Learning & quality → People Development',
    story:'My career connects the realities of hotel operations with the systems and leadership habits that help people succeed. Experience across individual hotels and clusters allows me to see both the detail of a shift and the wider development agenda.',
    contribution:'A practical understanding of service, experience partnering with department heads and the ability to turn development priorities into everyday action.',
    focus:[],
    evidence:[
      ['Close to the operation','Guest recovery, shift leadership and service reviews shaped my approach to learning: start with real situations, make expectations clear and support people as they practise.'],
      ['Across properties and teams','My experience spans graduate development, hotel operations, learning and quality, cluster talent development and property People Development. Each setting strengthened my ability to work with leaders and adapt to different team needs.'],
      ['From learning to visible progress','Career development, succession support, digital learning adoption and an in-house learning platform connect development activity with evidence, follow up and leadership decisions.']
    ]
  },
  foundation: {
    period:'JUN 2016 / NOV 2017',location:'KOCHI · INDIA',
    title:'Learning hospitality from the inside.',
    role:'InterContinental Graduate · Crowne Plaza Kochi',
    story:'Structured cross training across hotel operations built my understanding of the guest journey and the contribution each department makes to a consistent experience.',
    contribution:'A whole-hotel perspective and respect for the people behind every part of the guest experience.',
    focus:['operations','learning'],
    evidence:[
      ['Cross-department exposure','Built an understanding of hotel operations through a structured graduate programme and cross training.'],
      ['The guest journey','Learned to see service as a connected experience, with departmental coordination influencing the outcome for the guest.'],
      ['What this means today','I design learning with operational context, helping colleagues understand how their role connects with the wider hotel.']
    ]
  },
  operations: {
    period:'DEC 2017 / NOV 2022',location:'GURGAON · INDIA',
    title:'From leading the shift to developing the team.',
    role:'Duty Manager → Assistant Manager, Learning & Quality · Crowne Plaza Today Gurgaon',
    story:'Operational leadership and guest recovery gave me a practical foundation before moving into a dedicated Learning and Quality role in June 2022.',
    contribution:'The judgement to connect learning with real service challenges, and the confidence to support teams when the operation is under pressure.',
    focus:['operations','learning'],
    evidence:[
      ['Operational leadership','Duty Manager experience developed my judgement in guest recovery, shift leadership and coordination across departments.'],
      ['The move into learning','Progressed into Learning and Quality in June 2022, bringing operational experience into team development and service standards.'],
      ['Quality in everyday practice','Service audits, coaching and corrective action connected learning priorities with the experience delivered to guests.']
    ]
  },
  cluster: {
    period:'NOV 2022 / AUG 2024',location:'ABU DHABI · UAE',
    title:'Developing people across a wider operation.',
    role:'Cluster Assistant Manager, Learning & Engagement · Yas Plaza Hotels by Aldar Hospitality',
    story:'Supported learning and colleague engagement across six hotels, working with the Director of Human Resources and department heads on development, digital learning adoption and career opportunities.',
    contribution:'The ability to coordinate across properties while keeping development relevant to each team and individual.',
    focus:['learning','talent','digital'],
    evidence:[
      ['Career development & succession','Supported Yaspire career development and succession planning with HR leadership and department heads.'],
      ['Emerging talent','Supported seven Emirati management trainees across Front Office and Human Resources, connecting development with practical exposure.'],
      ['Learning adoption & recognition','Supported digital learning adoption and colleague engagement across the cluster. Recognised as Manager of the Year in 2023.']
    ]
  },
  quality: {
    period:'AUG 2024 / MAR 2025',location:'DUBAI · UAE',
    title:'Turning guest insight into learning priorities.',
    role:'Cluster Learning & Quality Manager · voco, Mövenpick & Riva',
    story:'Aligned learning and quality priorities across three operations, using guest feedback, service reviews and departmental follow up to focus development on real needs.',
    contribution:'A disciplined connection between guest insight, coaching and the actions leaders take with their teams.',
    focus:['operations','learning'],
    evidence:[
      ['Guest satisfaction reviews','Led weekly reviews with department heads across voco Bonnington Dubai, Mövenpick JLT and Riva Beach Club.'],
      ['Coaching & corrective action','Connected recurring guest concerns with coaching and corrective actions, then reviewed departmental follow up.'],
      ['Working across different operations','Aligned learning priorities across three operations while keeping guest experience and department leadership at the centre.']
    ]
  },
  people: {
    period:'MAR 2025 / PRESENT',location:'RAS AL KHAIMAH · UAE',
    title:'Connecting people, leaders and digital development.',
    role:'People Development · Current role: Manager, People Development',
    story:'Lead the property development agenda, connecting learning needs with service priorities, leadership capability and the systems that help departments take ownership.',
    contribution:'A people development approach that combines human support, operational relevance and clear evidence for leaders.',
    focus:['learning','talent','digital'],
    evidence:[
      ['Leadership & career development','Coordinate leadership and career development programmes with department heads, including nominations, cross training and individual development follow up.'],
      ['Learning systems & visibility','Designed and developed an in-house learning platform connecting participation, assessments, compliance records and leadership reporting. Explore the digital case study for the platform features and quiz experience.'],
      ['Service culture & daily learning','Build priorities from training needs, guest feedback and service audits. Connect service learning, departmental trainers and daily huddles with practical follow up.']
    ]
  }
};
const careerButtons=[...document.querySelectorAll('[data-career]')];
const careerFilters=[...document.querySelectorAll('[data-career-filter]')];
let careerFocus='all', careerActive='overview';
function visibleCareerKeys(){return careerButtons.filter(button=>!button.hidden).map(button=>button.dataset.career)}
function renderCareer(key){
  const chapter=careerChapters[key];careerActive=key;
  careerButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.career===key)));
  for(const [id,value] of Object.entries({
    'career-period':chapter.period,'career-location':chapter.location,
    'career-detail-title':chapter.title,'career-role':chapter.role,
    'career-story':chapter.story,'career-contribution':chapter.contribution
  }))document.getElementById(id).textContent=value;
  const evidence=document.querySelector('#career-evidence');evidence.replaceChildren();
  chapter.evidence.forEach(([heading,description],index)=>{
    const details=document.createElement('details');details.className='career-example';
    if(index===0)details.open=true;
    const summary=document.createElement('summary');summary.textContent=heading;
    const paragraph=document.createElement('p');paragraph.textContent=description;
    details.append(summary,paragraph);evidence.append(details);
  });
  const keys=visibleCareerKeys(),index=keys.indexOf(key);
  document.querySelector('#career-prev').disabled=index===0;
  document.querySelector('#career-next').disabled=index===keys.length-1;
  document.querySelector('#career-next').textContent=key==='overview'?'Explore chapters →':'Next →';
  document.querySelector('#career-position').textContent=key==='overview'?'Career overview · 5 chapters':careerFocus==='all'?'Chapter '+index+' of 5':(index+1)+' of '+keys.length+' relevant chapters';
}
careerFilters.forEach(button=>button.addEventListener('click',()=>{
  careerFocus=button.dataset.careerFilter;
  careerFilters.forEach(filter=>filter.setAttribute('aria-pressed',String(filter===button)));
  careerButtons.forEach(chapter=>{
    chapter.hidden=careerFocus!=='all'&&!careerChapters[chapter.dataset.career].focus.includes(careerFocus);
  });
  const keys=visibleCareerKeys();
  renderCareer(careerFocus==='all'?'overview':keys.includes(careerActive)?careerActive:keys[0]);
}));
careerButtons.forEach(button=>{
  button.addEventListener('click',()=>renderCareer(button.dataset.career));
  button.addEventListener('keydown',event=>{
    const keys=visibleCareerKeys(),index=keys.indexOf(button.dataset.career);
    let next;
    if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%keys.length;
    if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index-1+keys.length)%keys.length;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=keys.length-1;
    if(next!==undefined){event.preventDefault();renderCareer(keys[next]);careerButtons.find(item=>item.dataset.career===keys[next]).focus()}
  });
});
for(const [id,direction] of [['career-prev',-1],['career-next',1]]){
  document.getElementById(id).addEventListener('click',()=>{
    const keys=visibleCareerKeys(),next=keys.indexOf(careerActive)+direction;
    if(next>=0&&next<keys.length)renderCareer(keys[next]);
  });
}
renderCareer('overview');


