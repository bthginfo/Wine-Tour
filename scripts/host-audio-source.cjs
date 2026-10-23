// Export authored copy only. Never read CMS records, user notes, or database credentials.
const {readCatalog}=require('./catalog-data.cjs');const fs=require('node:fs');const ts=require('typescript');const vm=require('node:vm');const crypto=require('node:crypto');
const js=ts.transpileModule(fs.readFileSync('src/lib/host-speech.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const moduleScope={exports:{}};vm.runInNewContext('(function(exports){'+js+'\n})',{crypto:crypto.webcrypto,TextEncoder})(moduleScope.exports);
const {hostSpeechChapters,hostPronunciation}=moduleScope.exports;
const slugs=new Set(Object.keys(JSON.parse(fs.readFileSync('src/lib/locales/de/host-background.json','utf8'))));
// Titles remain chapter markers in the player; only the connected explanation is spoken.
const items=readCatalog().all.filter(a=>slugs.has(a.slug)).map(a=>({slug:a.slug,fingerprint:crypto.createHash('sha256').update(a.host.map(p=>p.trim()).filter(Boolean).join('\n\n')).digest('hex'),chapters:hostSpeechChapters(a.host).map(c=>({title:c.title,text:hostPronunciation(c.text)}))}));
process.stdout.write(JSON.stringify(items,null,2)+'\n');
