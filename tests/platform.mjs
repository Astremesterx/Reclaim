import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
const database = new DatabaseSync(':memory:');
for(const name of readdirSync('drizzle').filter(n=>n.endsWith('.sql')).sort()) database.exec(readFileSync('drizzle/'+name,'utf8'));
let user=null;
export function asUser(id) {user=id?{userId:id,email:`${id}@example.test`,displayName:'Test account',fullName:null}:null;}
export async function getChatGPTUser(){return user;}
export const env={RECLAIM_ADMIN_IDS:'test-editor',DB:{
  prepare(sql){let values=[];return {bind(...args){values=args;return this;},async first(){return database.prepare(sql).get(...values)||null;},async all(){return {results:database.prepare(sql).all(...values)};},async run(){const result=database.prepare(sql).run(...values);return {success:true,meta:{changes:Number(result.changes)}};}};},
  async batch(statements){database.exec('BEGIN');try{const result=await Promise.all(statements.map(s=>s.run()));database.exec('COMMIT');return result;}catch(e){database.exec('ROLLBACK');throw e;}}
}};
