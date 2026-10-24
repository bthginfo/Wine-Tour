import {test,expect} from '@playwright/test';
import {readCatalog} from '../scripts/catalog-data.cjs';
import {makeTastingBook} from '../src/lib/pdf/model';
import type {Article,Step,Wine} from '../src/lib/content';
const targets=['pfalz','von-winning','rheinhessen','juwel','saar','margarethenhof'];
const catalogue=readCatalog().all as Article[];

test('editable tasting profiles retain their public fields in the participant PDF model',()=>{
 const articles=targets.map(slug=>catalogue.find(a=>a.slug===slug)!);
 // A published edit uses the same profile fields as the reading view and export.
 const edited=structuredClone(articles);edited[0].atlas!.facts[0].value='Bearbeitete Flächenangabe';
 const wines:Wine[]=['secco','juwel','riesling','rot'].map(id=>({id,name:id,producer:'Weingut',region:'Region',grape:'Traube',style:'Wein',color:'#abc',image:'',slugs:[],hint:''}));
 const steps:Step[]=targets.map((slug,index)=>({wine:Math.floor(index/2),type:'story',slug,label:index%2?'Das Weingut':'Die Region'}));
 const book=makeTastingBook({room:{name:'Profil-Prüfung',code:'FACT88',settings:{}},participant:'Mia',wines,articles:edited,steps,notes:[],draftOwner:'facts',readDraft:()=>null,imageSrc:s=>s,creditFor:()=>({text:''})});
 expect(book.entries).toHaveLength(6);
 for(const [index,entry]of book.entries.entries()){
  expect(entry.type).toBe('article');if(entry.type!=='article')continue;
  expect(entry.article.profile).toEqual(edited[index].atlas!.facts);expect(entry.article.profile).toHaveLength(4);
  expect(entry.article).not.toHaveProperty('host');expect(entry.article).not.toHaveProperty('sources');
 }
 expect(JSON.stringify(book)).toContain('Bearbeitete Flächenangabe');expect(articles[0].atlas!.facts[0].value).toBe('23.640 Hektar · 2025');
});

test('tasting profiles are readable on mobile and desktop and new anecdotes appear in the article',async({page})=>{
 test.setTimeout(90000);await page.route('**/api/content',r=>r.fulfill({json:{records:{}}}));const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [320,1440])for(const theme of ['light','dark']as const){
  await page.setViewportSize({width,height:950});await page.addInitScript(theme=>localStorage.setItem('sip:theme',theme),theme);
  for(const slug of targets){
   await page.goto('/entdecken/'+slug);await expect(page.locator('.app-shell')).toHaveAttribute('data-ready','true');
   const profile=page.getByRole('region',{name:'Kurzprofil: '+catalogue.find(a=>a.slug===slug)!.title,exact:true});await expect(profile).toBeVisible();await expect(profile.locator('dl>div')).toHaveCount(4);
   for(const fact of catalogue.find(a=>a.slug===slug)!.atlas!.facts)await expect(profile).toContainText(fact.value);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
 }
 await page.goto('/entdecken/juwel');await expect(page.locator('.article-body')).toContainText('2023 stieg sie aus dem Projekt aus');await expect(page.locator('.article-body')).toContainText('Joko Winterscheidt');
 await page.goto('/entdecken/margarethenhof');await expect(page.locator('.article-body')).toContainText('Praktikum in Südafrika');await expect(page.locator('.article-body')).toContainText('wegen der Pandemie');
 expect(errors).toEqual([]);
});
