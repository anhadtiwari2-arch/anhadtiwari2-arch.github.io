export const hotels=[
{id:'SH',name:'Sheraton Abu Dhabi Hotel & Resort',short:'Sheraton Abu Dhabi',brand:'SHERATON',place:'ABU DHABI · CORNICHE',image:'sheraton-full.jpg',accent:'#805953'},
{id:'LM',name:'Le Méridien Abu Dhabi Resort',short:'Le Méridien Abu Dhabi',brand:'LE MÉRIDIEN',place:'ABU DHABI · AL ZAHIYAH',image:'meridien-full.jpg',accent:'#8b7757'},
{id:'RC',name:'Radisson Blu Hotel & Resort, Abu Dhabi Corniche',short:'Radisson Blu Corniche',brand:'RADISSON BLU',place:'ABU DHABI · CORNICHE',image:'corniche-full.jpg',accent:'#436f80'},
{id:'RA',name:'Radisson Blu Hotel & Resort, Al Ain',short:'Radisson Blu Al Ain',brand:'RADISSON BLU',place:'AL AIN · AL SAROOJ',image:'alain-full.jpg',accent:'#537564'}];
export const roles={admin:'System administrator',cluster:'Cluster HR / People Development',hotel:'Hotel HR / People & Culture',gm:'General Manager',manager:'Hotel Manager',hod:'Head of Department',trainer:'Departmental trainer',member:'Team member'};
export const courses=['Welcome to our hotel','Service from the heart','Safety essentials'];
export function seed(){
 const people=hotels.flatMap((h,hi)=>Array.from({length:6},(_,i)=>({id:`${h.id}-${String(i+1).padStart(3,'0')}`,hotel:h.id,name:`Demo Colleague ${hi*6+i+1}`,department:['Front Office','Food & Beverage','Housekeeping'][i%3],title:i<2?'Departmental Trainer':'Team Member',email:`colleague${hi*6+i+1}@example.invalid`,joined:'2026-11-01',active:true,trainer:i<2})));
 const records=people.flatMap((p,i)=>courses.map((course,c)=>({id:`${p.id}-${c}`,employee:p.id,hotel:p.hotel,course,status:(i+c)%5===0?'Overdue':(i+c)%4===0?'Assigned':'Completed',minutes:[120,60,90][c],date:'2026-11-20',due:(i+c)%5===0?'2026-11-25':'2026-11-30',evidence:(i+c)%5!==0&&(i+c)%4!==0?'Demo attendance verified':''})));
 const sessions=hotels.flatMap(h=>courses.map((name,i)=>({id:`${h.id}-S${i}`,hotel:h.id,name,date:`2026-11-${27+i}`,time:['09:00','14:00','11:00'][i],minutes:[120,60,90][i],trainer:`${h.id}-00${i%2+1}`,department:['Front Office','Food & Beverage','Front Office'][i],capacity:12,status:'Planned'})));
 return upgradeDemo({version:2,people,records,sessions,accounts:[{id:'admin',name:'Demo Administrator',role:'admin',hotels:hotels.map(h=>h.id),active:true},{id:'cluster',name:'Demo Cluster Leader',role:'cluster',hotels:hotels.map(h=>h.id),active:true},...hotels.flatMap(h=>['hotel','trainer','member'].map(role=>({id:role+(h.id==='SH'?'':'-'+h.id),name:role==='hotel'?'Demo Hotel Leader · '+h.id:role==='trainer'?'Demo Trainer · '+h.id:people.find(p=>p.id===h.id+'-003').name,role,hotels:[h.id],employee:role==='hotel'?null:h.id+(role==='member'?'-003':'-001'),employeeHotel:h.id,email:role==='hotel'?'leader@example.invalid':people.find(p=>p.id===h.id+(role==='member'?'-003':'-001')).email,department:role==='member'?'Housekeeping':'Front Office',active:true}))) ],requests:[],audit:[],nominations:[]});
}
export function canHotel(user,id){return !!user?.active&&(user.role==='admin'||user.hotels.includes(id));}
export function visiblePeople(db,user,hotel='all'){hotel=resolveHotelScope(user,hotel);return db.people.filter(p=>canHotel(user,p.hotel)&&(hotel==='all'||hotel===p.hotel)&&(user.role!=='member'||(p.id===user.employee&&p.hotel===user.employeeHotel))&&(!['trainer','hod'].includes(user.role)||p.department===user.department));}
export function visibleRecords(db,user,hotel='all'){const ids=new Set(visiblePeople(db,user,hotel).map(p=>p.hotel+'|'+p.id));return db.records.filter(r=>ids.has(r.hotel+'|'+r.employee));}
export function metrics(db,user,hotel='all'){const people=visiblePeople(db,user,hotel).filter(p=>p.active),ids=new Set(people.map(p=>p.hotel+'|'+p.id)),rs=visibleRecords(db,user,hotel).filter(r=>ids.has(r.hotel+'|'+r.employee));return {people:people.length,hours:rs.filter(r=>r.status==='Completed').reduce((n,r)=>n+r.minutes/60,0),completion:rs.length?Math.round(rs.filter(r=>r.status==='Completed').length/rs.length*100):0,overdue:rs.filter(r=>r.status==='Overdue').length,trainers:people.filter(p=>p.trainer).length};}
export function parseCSV(text){let rows=[],row=[],v='',quote=false;for(let i=0;i<text.length;i++){let c=text[i];if(c==='"'){if(quote&&text[i+1]==='"'){v+='"';i++;}else quote=!quote;}else if(c===','&&!quote){row.push(v);v='';}else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&text[i+1]==='\n')i++;row.push(v);if(row.some(x=>x.trim()))rows.push(row);row=[];v='';}else v+=c;}if(quote)throw Error('Unclosed quotation mark in CSV.');row.push(v);if(row.some(x=>x.trim()))rows.push(row);if(!rows.length)throw Error('This file is empty.');rows[0][0]=rows[0][0].replace(/^\uFEFF/,'');return rows;}
export function validateImport(rows,kind,db,user){const required=kind==='people'?['hotel_id','employee_id','name','department','joining_date']:['hotel_id','employee_id','course','status','duration_minutes','completion_date'];const headers=rows[0].map(x=>x.trim().toLowerCase()),errors=[],items=[],seen=new Set();for(const k of required)if(!headers.includes(k))errors.push(`Missing column: ${k}`);if(errors.length)return {errors,items};if(rows.length<2)errors.push('Add at least one data row.');if(rows.length>501)errors.push('Use up to 500 rows per preview.');rows.slice(1).forEach((row,i)=>{const r=Object.fromEntries(headers.map((h,j)=>[h,(row[j]||'').trim()]));let e=[];if(row.length!==headers.length)e.push('column count does not match the header');for(const k of required.filter(k=>k!=='completion_date'))if(!r[k])e.push(`${k} is empty`);if(!hotels.some(h=>h.id===r.hotel_id))e.push('unknown hotel_id');else if(!canHotel(user,r.hotel_id))e.push('hotel is outside your access');if(!['admin','cluster','hotel'].includes(user.role))e.push('this role cannot import');const key=r.hotel_id+'|'+r.employee_id+(kind==='records'?'|'+r.course:'');if(seen.has(key))e.push('duplicate row in this file');seen.add(key);const validDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!isNaN(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
 if(kind==='people'){if(!validDate(r.joining_date))e.push('joining_date must be a valid YYYY-MM-DD date');if(db.people.some(p=>p.hotel===r.hotel_id&&p.id===r.employee_id))e.push('employee already exists; this preview adds new records only');}
 else{if(!db.people.some(p=>p.id===r.employee_id&&p.hotel===r.hotel_id))e.push('employee is not in this hotel roster');if(!['Completed','Assigned','Overdue'].includes(r.status))e.push('status must be Completed, Assigned or Overdue');if(!Number.isFinite(Number(r.duration_minutes))||Number(r.duration_minutes)<=0||Number(r.duration_minutes)>1440)e.push('duration_minutes must be between 1 and 1440');if(r.status==='Completed'&&!validDate(r.completion_date))e.push('completed learning needs a valid completion_date');if(r.status==='Completed'&&r.completion_date>new Date().toISOString().slice(0,10))e.push('completion date cannot be in the future');if(db.records.some(x=>x.employee===r.employee_id&&x.hotel===r.hotel_id&&x.course===r.course))e.push('learning record already exists');}
 if(e.length)errors.push(`Row ${i+2}: ${e.join('; ')}`);else items.push(r);});return {errors,items};}
export function csvCell(v){let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}

// Demo only: destination is read from the account, never from recovery form input.
export function recoveryDestination(db, hotelId, employeeId){
 const id=String(employeeId||'').trim().toUpperCase();
 const matches=db.accounts.filter(a=>a.active&&a.employeeHotel===hotelId&&a.employee===id&&a.hotels.includes(hotelId));
 if(matches.length!==1)return null;
 const email=matches[0].email;
 return typeof email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?email:null;
}

export function upgradeDemo(db){
 if(!db||![2,3].includes(db.version))return null;
 if(db.version===3)return db;
 for(const h of hotels)for(const role of ['gm','manager','hod']){
  const id=role+(h.id==='SH'?'':'-'+h.id);
  if(!db.accounts.some(a=>a.id===id))db.accounts.push({id,name:'Demo '+roles[role]+' · '+h.id,role,hotels:[h.id],department:role==='hod'?'Front Office':null,active:true,employee:null,employeeHotel:h.id});
 }
 for(const r of db.records){const c=courses.indexOf(r.course);if(c>=0&&r.id===r.employee+'-'+c){r.mode=['off_job','on_job','online'][c];r.category=['orientation','service','mandatory'][c];}}
 db.submissions=db.submissions||hotels.flatMap((h,i)=>['Front Office','Food & Beverage','Housekeeping'].map((department,j)=>({id:h.id+'-'+j+'-2026-11',hotel:h.id,department,month:'2026-11',status:['Submitted','Reviewed','Draft','Accepted'][(i+j)%4],updated:'2026-11-25T10:00:00Z'})));
 db.version=3;return db;
}
export function managementPeople(db,user,hotel='all',department='all'){return visiblePeople(db,user,hotel).filter(p=>p.active&&(department==='all'||p.department===department));}
export function managementRecords(db,user,hotel='all',department='all',period='2026-11'){
 const ids=new Set(managementPeople(db,user,hotel,department).map(p=>p.hotel+'|'+p.id));
 return visibleRecords(db,user,hotel).filter(r=>ids.has(r.hotel+'|'+r.employee)&&(period==='all'||String(r.status==='Completed'?r.date:r.due||r.date).startsWith(period)));
}
export function managementMetrics(db,user,hotel='all',department='all',period='2026-11'){
 const ps=managementPeople(db,user,hotel,department),rs=managementRecords(db,user,hotel,department,period),done=rs.filter(r=>r.status==='Completed'),hours=done.reduce((n,r)=>n+r.minutes/60,0),participated=new Set(done.map(r=>r.hotel+'|'+r.employee)).size;
 const orientation=rs.filter(r=>r.category==='orientation'||r.course===courses[0]),mandatory=rs.filter(r=>r.category==='mandatory'||r.course===courses[2]);
 const modes={on_job:0,off_job:0,online:0,unclassified:0};for(const r of done)modes[Object.hasOwn(modes,r.mode)?r.mode:'unclassified']+=r.minutes/60;
 return {people:ps.length,hours,average:ps.length?hours/ps.length:null,participated,participation:ps.length?100*participated/ps.length:null,completion:rs.length?100*done.length/rs.length:null,completed:done.length,assigned:rs.length,overdue:rs.filter(r=>r.status==='Overdue').length,orientationTotal:orientation.length,orientationPending:orientation.filter(r=>r.status!=='Completed').length,mandatoryTotal:mandatory.length,mandatoryDone:mandatory.filter(r=>r.status==='Completed').length,trainers:ps.filter(p=>p.trainer).length,modes};
}
export function departmentMetrics(db,user,hotel='all',department='all',period='2026-11'){
 const groups=new Map();for(const p of managementPeople(db,user,hotel,department))groups.set(p.hotel+'|'+p.department,{hotel:p.hotel,department:p.department});
 return [...groups.values()].map(g=>({...g,...managementMetrics(db,user,g.hotel,g.department,period)}));
}
export function visibleSubmissions(db,user,hotel='all',department='all',period='2026-11'){
 const groups=new Set(managementPeople(db,user,hotel,department).map(p=>p.hotel+'|'+p.department));return (db.submissions||[]).filter(s=>groups.has(s.hotel+'|'+s.department)&&(period==='all'||s.month.startsWith(period)));
}
export function submissionActions(user,s){
 if(!canHotel(user,s.hotel)||(['hod','trainer'].includes(user.role)&&user.department!==s.department))return [];
 const hr=['admin','cluster','hotel'].includes(user.role);
 if(s.status==='Draft'&&(['trainer','hod'].includes(user.role)||hr))return ['Submitted'];
 if(s.status==='Submitted'&&(user.role==='hod'||hr))return ['Reviewed','Draft'];
 if(s.status==='Reviewed'&&hr)return ['Accepted','Draft'];
 return [];
}
export function transitionSubmission(db,user,id,to,reason){const s=(db.submissions||[]).find(x=>x.id===id);if(!s||!submissionActions(user,s).includes(to)||!String(reason||'').trim())throw Error('This action is not permitted or its review note is missing.');const before=s.status;s.status=to;s.updated=new Date().toISOString();return {before,after:to,hotel:s.hotel,department:s.department,month:s.month};}

// Explicit cluster view is the only view allowed to combine properties.
export function resolveHotelScope(user,requested){
 if(!user?.active)return 'none';
 if(requested==='all'&&['admin','cluster'].includes(user.role))return 'all';
 if(requested!=='all')return hotels.some(h=>h.id===requested)&&canHotel(user,requested)?requested:'none';
 return hotels.find(h=>canHotel(user,h.id))?.id||'none';
}
export function scopedSessions(db,user,hotel,department='all'){
 hotel=resolveHotelScope(user,hotel);
 const dep=['hod','trainer','member'].includes(user?.role)?user.department:department;
 return db.sessions.filter(s=>canHotel(user,s.hotel)&&(hotel==='all'||s.hotel===hotel)&&(dep==='all'||s.department===dep));
}
export function scopedNominees(db,user,session,department='all'){
 return managementPeople(db,user,session.hotel,department).filter(p=>p.department===session.department);
}
export function validateWorkspaceImport(rows,kind,db,user,hotel,department='all'){
 const result=validateImport(rows,kind,db,user);
 if(hotel==='all'||!hotels.some(h=>h.id===hotel)||!canHotel(user,hotel))result.errors.push('Select one authorised hotel before uploading.');
 for(const r of result.items){
  if(r.hotel_id!==hotel)result.errors.push('Every row must belong to the selected hotel: '+hotel);
  const dep=kind==='people'?r.department:db.people.find(p=>p.hotel===r.hotel_id&&p.id===r.employee_id)?.department;
  if(department!=='all'&&dep!==department)result.errors.push('Every row must belong to the selected department: '+department);
 }
 return result;
}
export function scopedAccounts(db,user,hotel,department='all'){
 if(user?.role!=='admin')return [];
 if(hotel==='all')return department==='all'?db.accounts:[];
 return db.accounts.filter(a=>(a.hotels.includes(hotel)||a.employeeHotel===hotel)&&(!['admin','cluster'].includes(a.role))&&(department==='all'||a.department===department));
}
export function scopedRequests(db,user,hotel,department='all'){
 if(user?.role!=='admin')return [];
 return db.requests.filter(r=>(hotel==='all'||r.hotel===hotel)&&(department==='all'||db.people.some(p=>p.hotel===r.hotel&&p.id===r.employee&&p.department===department)));
}
export function scopedAudit(db,user,hotel,department='all'){
 hotel=resolveHotelScope(user,hotel);
 const dep=['hod','trainer','member'].includes(user?.role)?user.department:department;
 return db.audit.filter(a=>{
  const h=a.hotel||hotels.find(h=>a.target===h.id||a.target.startsWith(h.id+'/'))?.id;
  return (hotel==='all'?(h?canHotel(user,h):['admin','cluster'].includes(user.role)):h===hotel&&canHotel(user,h))&&(dep==='all'||a.department===dep);
 });
}
