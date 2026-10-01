import {sources} from './catalog';
const approvedHosts=new Set(sources.map(s=>new URL(s.url).hostname));
export function approvedSourceUrl(value:string|URL) {
  try {const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&approvedHosts.has(url.hostname);}
  catch{return false;}
}
export async function checkSourceLink(sourceId:string,request:typeof fetch=fetch) {
  const source=sources.find(s=>s.id===sourceId);if(!source)throw new Error('Choose a registered source.');
  let current=new URL(source.url);
  for(let hop=0;hop<3;hop++) {
    if(!approvedSourceUrl(current))throw new Error('Source redirect is outside the approved registry.');
    const response=await request(current,{method:'HEAD',redirect:'manual',signal:AbortSignal.timeout(10000),headers:{'User-Agent':'RECLAIM-LinkCheck/1.0 (source availability only)'}});
    if([301,302,303,307,308].includes(response.status)&&response.headers.get('location')){current=new URL(response.headers.get('location')!,current);continue;}
    return {status:response.ok?'reachable':`http-${response.status}`,etag:response.headers.get('etag'),url:current.href};
  }
  return {status:'redirect-limit',etag:null,url:current.href};
}
