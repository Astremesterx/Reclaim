import {test} from 'node:test';
import assert from 'node:assert/strict';
import {guides,sources,getGuide} from '../.sites-runtime/test-modules/catalog.mjs';
import {recommend,defaultAnswers,createPlan,planSteps,searchGuides,contentIssues,moderationFlags} from '../.sites-runtime/test-modules/recovery.mjs';
import {calendarFile} from '../.sites-runtime/test-modules/calendar.mjs';
import {approvedSourceUrl,checkSourceLink} from '../.sites-runtime/test-modules/source-checks.mjs';
import {planSchema} from '../.sites-runtime/test-modules/validation.mjs';
import * as privateApi from '../.sites-runtime/test-modules/private.mjs';
import * as communityApi from '../.sites-runtime/test-modules/community.mjs';
import * as adminApi from '../.sites-runtime/test-modules/admin.mjs';
import {asUser} from './platform.mjs';
import {pagesHref,pagesRoute} from '../.sites-runtime/test-modules/pages-routing.mjs';
import {GITHUB_PAGES} from '../.sites-runtime/test-modules/deployment.mjs';
const origin='https://reclaim.example';
const request=(data,headers={})=>new Request(origin+'/api/private',{method:'POST',headers:{'Origin':origin,'Content-Type':'application/json','X-Reclaim-Request':'1',...headers},body:JSON.stringify(data)});
const answer=extra=>({...defaultAnswers,...extra});

test('Pages routes preserve shared guide URLs and triage queries under a project path',()=>{
 const href=pagesHref('/guides/google-account');
 const shared=new URL(href,'https://astremesterx.github.io/Reclaim/');
 assert.equal(shared.pathname,'/Reclaim/');
 assert.equal(pagesRoute(shared.hash).pathname,'/guides/google-account');
 const triage=pagesRoute(pagesHref('/help?category=accounts'));
 assert.equal(triage.pathname,'/help');assert.equal(triage.searchParams.get('category'),'accounts');
 assert.equal(pagesRoute('').pathname,'/');assert.equal(pagesRoute('#main').pathname,'/');
 for(const href of ['https://support.google.com/','mailto:help@example.test','tel:1930','#main','//example.test/'])assert.equal(pagesHref(href),href);
});

test('the standard server edition remains enabled outside the Pages build',()=>{
 assert.equal(GITHUB_PAGES,false);
});
test('triage distinguishes the main recovery triggers and urgent financial loss',()=>{
 const cases=[['accounts','Google','changed','google-account'],['accounts','Microsoft','changed','microsoft-account'],['accounts','Social media','changed','social-account'],['phishing','Any service','link','suspicious-link'],['phishing','Any service','password','exposed-password'],['phishing','Any service','ran','malware-check'],['phishing','Any service','app','connected-apps'],['phishing','Any service','paid','payment-fraud'],['money','UPI / payment app','paid','upi-fraud'],['devices','Apple','lost','stolen-iphone'],['devices','Any service','lost','lost-computer'],['malware','Any service','ransom','ransomware'],['safety','Any service','monitoring','monitoring-safety'],['safety','Any service','images','image-abuse'],['unsure','Any service','unsure','not-sure']];
 for(const [category,platform,action,id] of cases)assert.equal(recommend(answer({category,platform,action})),id);
 assert.equal(recommend(answer({category:'phishing',action:'paid',repeat:'yes'})),'payment-fraud');
 assert.equal(recommend(answer({category:'accounts',platform:'Google',repeat:'yes'})),'repeat-compromise');
});
test('locked-out steps, work routing, and safe-device guidance preserve progress',()=>{
 const p=createPlan('google-account',answer({category:'accounts',platform:'Google',access:'locked',safe:'no',work:'work'}));p.states['google-account-0']='blocked';
 const steps=planSteps(p);assert(steps.some(s=>s.id==='work-first'));assert(steps.some(s=>s.id==='safe-device'));assert(steps.some(s=>s.when==='locked'));assert(!steps.some(s=>s.when==='signed-in'));assert.equal(p.states['google-account-0'],'blocked');
 const signed=planSteps(createPlan('google-account',answer({access:'signed-in'})));assert(!signed.some(s=>s.when==='locked'));
});
test('search combines filters, synonyms, typos, and helpful empty results',()=>{
 assert(searchGuides('gamil').some(g=>g.id==='google-account'));
 assert(searchGuides('Googl').some(g=>g.platform==='Google'));
 const found=searchGuides('gmail','accounts','Google','10','United States','Beginner','Computer');assert(found.length);assert(found.every(g=>g.platform==='Google'&&g.minutes<=10));
 assert(!searchGuides('','all','all','all','United States').some(g=>g.id==='upi-fraud'));
 assert.equal(searchGuides('zzzxqnoresult').length,0);
});
test('every published summary has unique steps and registered source references',()=>{
 assert(guides.length>=25);assert.equal(new Set(guides.map(g=>g.id)).size,guides.length);
 const ids=new Set(sources.map(s=>s.id));for(const g of guides){assert(g.steps.length>=3);assert.equal(new Set(g.steps.map(s=>s.id)).size,g.steps.length);for(const s of g.steps){assert(ids.has(s.sourceId));assert(s.body&&s.check&&s.fallback);}assert.equal(g.review,'Specialist review pending');}
});
test('sensitive inputs are rejected and recovery solicitations enter moderation',()=>{
 for(const value of ['person@example.test','password: test-secret','otp=000000','1111 2222 3333 4444','-----BEGIN RSA PRIVATE KEY-----'])assert(contentIssues(value).length);
 assert.equal(contentIssues('I cannot find the account recovery option.').length,0);
 assert(moderationFlags('DM me and send a payment for recovery').length);assert(moderationFlags('Try https://example.test').length);
});
test('calendar exports are timezone-aware, stable, bounded, and escaped',()=>{
 const one=calendarFile('Private check-in','2026-10-01T13:30:00Z','WEEKLY','Asia/Calcutta');assert(one.includes('DTSTART;TZID=Asia/Calcutta:20261001T190000'));assert(one.includes('TZOFFSETTO:+0530'));assert(one.includes('RRULE:FREQ=WEEKLY'));
 const ny=calendarFile('Private check-in','2026-10-01T13:30:00Z','MONTHLY','America/New_York');assert(ny.includes('BEGIN:DAYLIGHT'));assert(ny.includes('BEGIN:STANDARD'));assert(ny.includes('TZOFFSETFROM:-0400'));assert(ny.includes('TZOFFSETTO:-0500'));assert(ny.includes('DTSTART:20261101T020000'));
 const repeat=calendarFile('Private check-in','2026-10-01T13:30:00Z','WEEKLY','Asia/Calcutta');assert.equal(one.match(/UID:(.*)/)[1],repeat.match(/UID:(.*)/)[1]);
 assert(!calendarFile('Title\nBEGIN:VEVENT','2026-10-01','ONCE','UTC').includes('\r\nBEGIN:VEVENT\r\nBEGIN:VEVENT'));
 assert.throws(()=>calendarFile('Test','bad-date','WEEKLY','UTC'));assert.throws(()=>calendarFile('Test','2026-10-01','WEEKLY','UTC\nINJECT'));assert.throws(()=>calendarFile('Test','2026-10-01','UNSUPPORTED','UTC'));
});
test('source checks reject unregistered URLs and unsafe redirects',async()=>{
 for(const value of ['http://support.google.com/','https://127.0.0.1/','https://169.254.169.254/','https://support.google.com.evil.test/','https://user:password@support.google.com/','https://support.google.com:444/'])assert.equal(approvedSourceUrl(value),false);
 let calls=0;await assert.rejects(()=>checkSourceLink('google',async()=>{calls++;return new Response(null,{status:302,headers:{location:'https://127.0.0.1/private'}});}),/approved registry/);assert.equal(calls,1);
 const result=await checkSourceLink('google',async()=>new Response(null,{status:405}));assert.equal(result.status,'http-405');
 await assert.rejects(()=>checkSourceLink('https://evil.test'),/registered source/);
 const loop=await checkSourceLink('google',async()=>new Response(null,{status:302,headers:{location:'/loop'}}));assert.equal(loop.status,'redirect-limit');
});
test('malformed saved plans cannot enter browser or account state',()=>{
 const p=createPlan('google-account');assert(planSchema.safeParse(p).success);assert(!planSchema.safeParse({...p,answers:{}}).success);assert(!planSchema.safeParse({...p,states:{step:'arbitrary'}}).success);assert(!planSchema.safeParse({...p,guideId:'unknown'}).success);
});
test('API authentication, CSRF, and private-plan ownership use the actual route logic',async()=>{
 asUser(null);assert.equal((await privateApi.GET()).status,401);
 asUser('test-alice');assert.equal((await privateApi.POST(request({action:'profile',alias:'Alice'},{Origin:'https://evil.test'}))).status,403);
 assert.equal((await privateApi.POST(request({action:'profile',alias:'Alice'},{'X-Reclaim-Request':'0'}))).status,403);
 const p=createPlan('google-account');assert.equal((await privateApi.POST(request({action:'save-plan',plan:p}))).status,200);
 asUser('test-bob');assert.equal((await privateApi.GET()).status,200);assert.equal((await (await privateApi.GET()).json()).plans.length,0);
 assert.equal((await privateApi.POST(request({action:'save-plan',plan:{...p,notes:'Other user overwrite'}}))).status,404);
 await privateApi.POST(request({action:'delete-plan',id:p.id}));asUser('test-alice');assert.equal((await (await privateApi.GET()).json()).plans[0].id,p.id);
 assert.equal((await privateApi.POST(request({action:'save-plan',plan:{...p,notes:'password: private-secret'}}))).status,400);
 await privateApi.POST(request({action:'delete-plan',id:p.id}));assert.equal((await (await privateApi.GET()).json()).plans.length,0);
});
test('check-ins deduplicate and only their owner can pause or remove them',async()=>{
 asUser('test-reminders');const reminder={title:'Routine review',due:'2026-11-01T09:00:00Z',frequency:'MONTHLY',timezone:'Asia/Calcutta'};
 for(let i=0;i<2;i++)assert.equal((await privateApi.POST(request({action:'reminder',reminder}))).status,200);
 const rs=(await (await privateApi.GET()).json()).reminders;assert.equal(rs.length,1);
 asUser('test-bob');await privateApi.POST(request({action:'pause-reminder',id:rs[0].id,paused:true}));await privateApi.POST(request({action:'delete-reminder',id:rs[0].id}));
 asUser('test-reminders');assert.equal((await (await privateApi.GET()).json()).reminders[0].paused,0);
 await privateApi.POST(request({action:'pause-reminder',id:rs[0].id,paused:true}));assert.equal((await (await privateApi.GET()).json()).reminders[0].paused,1);
 await privateApi.POST(request({action:'delete-reminder',id:rs[0].id}));assert.equal((await (await privateApi.GET()).json()).reminders.length,0);
 assert.equal((await privateApi.POST(request({action:'reminder',reminder:{...reminder,timezone:'invalid-zone'}}))).status,400);
});
test('community replies, moderation visibility, votes, and author-only resolution',async()=>{
 asUser('test-author');await privateApi.POST(request({action:'profile',alias:'Test author'}));
 const postResponse=await communityApi.POST(request({action:'post',category:'accounts',title:'Test recovery question',body:'Which official menu contains the recovery option?'}));assert.equal(postResponse.status,200);const {id}=await postResponse.json();
 const blocked=await communityApi.POST(request({action:'post',category:'accounts',title:'Do not expose details',body:'My email is person@example.test'}));assert.equal(blocked.status,400);
 const pending=await (await communityApi.POST(request({action:'post',category:'accounts',title:'Test link requires review',body:'Try https://example.test for details'}))).json();assert.equal(pending.status,'pending');
 asUser('test-helper');await privateApi.POST(request({action:'profile',alias:'Test helper'}));
 const reply=await (await communityApi.POST(request({action:'comment',post:id,body:'Use the provider help center from its official application.'}))).json();assert(reply.id);
 for(let i=0;i<2;i++)await communityApi.POST(request({action:'vote',id}));
 await communityApi.POST(request({action:'resolve',id,resolved:true}));
 let detail=await (await communityApi.GET(new Request(origin+'/api/community?id='+id))).json();assert.equal(detail.post.votes,1);assert.equal(detail.post.resolved,0);assert(!('owner' in detail.post));assert.equal(detail.comments.length,1);
 assert.equal((await communityApi.GET(new Request(origin+'/api/community?id='+pending.id))).status,404);
 assert.equal((await adminApi.GET()).status,403);
 asUser('test-author');await communityApi.POST(request({action:'accept',id,comment:reply.id}));detail=await (await communityApi.GET(new Request(origin+'/api/community?id='+id))).json();assert.equal(detail.post.accepted,reply.id);assert.equal(detail.post.resolved,1);
 asUser('test-editor');assert.equal((await adminApi.GET()).status,200);
 assert.equal((await adminApi.POST(request({action:'moderate',table:'posts',id:pending.id,status:'published'}))).status,200);
 asUser(null);assert.equal((await communityApi.GET(new Request(origin+'/api/community?id='+pending.id))).status,200);
});
test('oversized requests, invalid request objects, and write bursts are bounded',async()=>{
 asUser('test-body');assert.equal((await privateApi.POST(request(null))).status,400);
 assert.equal((await privateApi.POST(request({action:'profile',alias:'a'.repeat(70000)}))).status,413);
 asUser('test-rate');for(let i=0;i<30;i++)assert.equal((await privateApi.POST(request({action:'profile',alias:'Rate test'}))).status,200);
 assert.equal((await privateApi.POST(request({action:'profile',alias:'Rate test'}))).status,429);
});
