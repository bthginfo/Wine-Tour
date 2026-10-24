// Read the same locale data and validation schema as the app without a browser or database.
const ts=require('typescript');const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
exports.readCatalog=()=>{
 const root=path.resolve(__dirname,'../src');const cache=new Map();
 function load(file){
  file=path.resolve(file);if(!file.startsWith(root+path.sep))throw Error('Catalog source must stay within src');
  if(cache.has(file))return cache.get(file).exports;
  if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const module={exports:{}};cache.set(file,module);
  const read=(name)=>{if(name==='zod')return require('zod');if(!name.startsWith('.'))throw Error('Unexpected catalog dependency: '+name);const target=path.resolve(path.dirname(file),name);for(const ext of ['','.ts','.json'])if(fs.existsSync(target+ext)&&fs.statSync(target+ext).isFile())return load(target+ext);throw Error('Missing catalog dependency: '+name);};
  const run=vm.runInNewContext('(function(exports,module,require){'+code+'\n})',{structuredClone,URL},{filename:file,timeout:10000});run(module.exports,module,read);return module.exports;
 }
 const core=load(root+'/lib/content.ts');const atlas=load(root+'/lib/atlas-content.ts');
 return {all:[...core.articles,...atlas.atlasArticles].map(atlas.enrichAtlasArticle),wines:core.wines,steps:core.steps,atlasCountries:atlas.atlasCountries,canonicalAtlasSlug:atlas.canonicalAtlasSlug,varieties:load(root+'/lib/locales/de/atlas/variety-index.json'),photos:load(root+'/lib/locales/de/atlas/photos.json'),articleSchema:load(root+'/lib/editorial-schema.ts').articleSchema};
};
