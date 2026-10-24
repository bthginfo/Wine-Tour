import {test,expect} from '@playwright/test';
import {readCatalog} from '../scripts/catalog-data.cjs';
import {learningScene} from '../src/lib/learning-scene';
import {makeTastingBook} from '../src/lib/pdf/model';
import {additionalReading} from '../src/lib/additional-reading';
import type {Article,Step,Wine} from '../src/lib/content';

const catalogue=readCatalog();
const articles=catalogue.all as Article[];
const distinct=[['spaetburgunder','pinot'],['secco','bubbles'],['aromen','aromas'],['spaetburgunder-zwei-roses','rose-compare'],['rose','rose-methods'],['riesling','riesling-season'],['feinherb','balance'],['sekt','sekt-bottle'],['champagner','champagne-blend'],['cava','cava-age'],['portwein','port-styles']];

test('each teaching interaction has its own subject and the atlas avoids repeated filler paragraphs',()=>{
 for(const [slug,visual]of distinct){expect(articles.find(a=>a.slug===slug)?.visual).toBe(visual);expect(articles.filter(a=>a.visual===visual).map(a=>a.slug)).toEqual([slug]);}
 for(const slug of ['grauburgunder','weissburgunder','silvaner','sauvignon-blanc']){
  const a=articles.find(a=>a.slug===slug)!;expect(a.visual).toBe('none');expect(a.atlas?.facts).toHaveLength(4);
 }
 const imported=articles.filter(a=>a.visual==='atlas');
 expect(imported.flatMap(a=>a.sections||[]).some(s=>['Herkunft kurz erklärt','Schalenkontakt und Gerbstoffe','Pressen, Hefe und Ausbau'].includes(s.title))).toBe(false);
 const scenes=distinct.map(([slug])=>{const a=articles.find(a=>a.slug===slug)!;return learningScene(a.visual,a.slug);}).filter(Boolean);
 const descriptions=scenes.flatMap(s=>s!.items.map(i=>i.body));expect(new Set(descriptions).size).toBe(descriptions.length);
});

test('the participant PDF includes the learning scenes and shared background while keeping raw host fields separate',()=>{
 const steps:Step[]=distinct.map(([slug])=>({type:'story',wine:0,slug,label:'Weinwissen'}));
 const book=makeTastingBook({room:{name:'Lernstationen',code:'SCENE8',settings:{}},participant:'Mia',wines:catalogue.wines as Wine[],articles,steps,notes:[],draftOwner:'',readDraft:()=>null,imageSrc:s=>s,creditFor:()=>({text:''})});
 for(const entry of book.entries){if(entry.type!=='article')continue;const a=articles.find(a=>a.slug===entry.article.slug)!;expect(entry.article.scene).toEqual(learningScene(a.visual,a.slug));expect(entry.article).not.toHaveProperty('host');expect(entry.article).not.toHaveProperty('sources');}
 const riesling=book.entries.find(e=>e.type==='article'&&e.article.slug==='riesling');expect(riesling?.type==='article'&&riesling.article.scene?.items.map(i=>i.label)).toEqual(['Austrieb','Blüte','Reife','Lese']);
 expect(riesling?.type==='article'&&riesling.article.additionalInfo?.some(s=>s.title==='Der Geburtstag stammt aus der Buchhaltung')).toBe(true);
});

test('extra reading keeps published edits, removes identical paragraphs, and can be left out of a compact PDF',()=>{
 const a={...articles.find(a=>a.slug==='riesling')!,paragraphs:['Dieser Absatz steht schon im Haupttext.'],host:['Dieser Absatz steht schon im Haupttext.','Ein neuer Hintergrund.','Ein weiteres Thema\nNoch mehr zum Weiterlesen.']};
 expect(additionalReading(a)).toEqual([{title:'',body:'Ein neuer Hintergrund.'},{title:'Ein weiteres Thema',body:'Noch mehr zum Weiterlesen.'}]);
 const published={...a,additionalInfo:[{title:'Bearbeitetes Zusatzthema',body:'Der veröffentlichte Text aus dem Editor.'}]};expect(additionalReading(published)).toEqual(published.additionalInfo);
 const book=makeTastingBook({includeAdditionalInfo:false,room:{name:'Kompaktes Heft',code:'SCENE8',settings:{redStory:'PRIVATE NOTIZ'}},participant:'Mia',wines:catalogue.wines as Wine[],articles:[published],steps:[{type:'story',wine:2,slug:'riesling',label:'Die Rebsorte'}],notes:[],draftOwner:'',readDraft:()=>null,imageSrc:s=>s,creditFor:()=>({text:''})});
 expect(JSON.stringify(book)).not.toContain('Zusatzthema');expect(JSON.stringify(book)).not.toContain('PRIVATE NOTIZ');expect(book.entries[0].type==='article'&&book.entries[0].article.additionalInfo).toBeUndefined();
});

test('different learning scenes work by keyboard on small and large screens in both themes',async({page})=>{
 test.setTimeout(180000);await page.route('**/api/content',r=>r.fulfill({json:{records:{}}}));await page.emulateMedia({reducedMotion:'reduce'});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,1440])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:950});await page.addInitScript(theme=>localStorage.setItem('sip:theme',theme),theme);
  for(const slug of ['rose','riesling','sekt','champagner','cava','portwein']){
   const a=articles.find(a=>a.slug===slug)!,scene=learningScene(a.visual,slug)!;
   await page.goto('/entdecken/'+slug);await expect(page.locator('.app-shell')).toHaveAttribute('data-ready','true');
   const panel=page.getByRole('region',{name:scene.title,exact:true});await expect(panel).toBeVisible();
   if(slug==='cava'){const slider=panel.getByRole('slider');await slider.focus();await page.keyboard.press('End');await expect(slider).toHaveAttribute('aria-valuetext','Paraje Calificado: mindestens 36 Monate');}
   else{const button=panel.getByRole('button').last();await button.focus();await page.keyboard.press('Space');await expect(button).toHaveAttribute('aria-pressed','true');}
   await expect(panel.locator('.visual-explanation')).toContainText(scene.items.at(-1)!.body);
   for(const button of await panel.getByRole('button').all()){const box=await button.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);}
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
 }
 expect(errors).toEqual([]);
});
