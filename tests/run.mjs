import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import {pathToFileURL} from 'node:url';
const directory=path.resolve('.sites-runtime/test-modules');fs.mkdirSync(directory,{recursive:true});
const modules={catalog:'lib/catalog.ts',calendar:'lib/calendar.ts',recovery:'lib/recovery.ts',validation:'lib/validation.ts','source-checks':'lib/source-checks.ts','pages-routing':'lib/pages-routing.ts',deployment:'lib/deployment.ts',server:'lib/server.ts',private:'app/api/private/route.ts',community:'app/api/community/route.ts',admin:'app/api/admin/route.ts'};
for(const [name,file] of Object.entries(modules)) {
  let code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
  code=code.replace(/from (["'])(?:@\/lib\/|\.\/)(catalog|calendar|recovery|validation|source-checks|server)\1/g,(_,quote,module)=>`from "./${module}.mjs"`);
  if(name==='server')code=code.replace('from "cloudflare:workers"','from "../../tests/platform.mjs"').replace('from "@/app/chatgpt-auth"','from "../../tests/platform.mjs"');
  if(name==='community')code=code.replace('from "@/app/chatgpt-auth"','from "../../tests/platform.mjs"');
  fs.writeFileSync(path.join(directory,name+'.mjs'),code);
}
await import(pathToFileURL(path.resolve('tests/reclaim.test.mjs')).href);
