import type {Article,AtlasProfile} from './content';
import climateData from './locales/de/atlas/climate.json';
import regionData from './locales/de/atlas/regions.json';
import grapeExamples from './locales/de/atlas/grape-examples.json';
import grapeData from './locales/de/atlas/grapes.json';
import producerData from './locales/de/atlas/producers.json';
import styleData from './locales/de/atlas/styles.json';
import countryData from './locales/de/atlas/countries.json';
import photoData from './locales/de/atlas/photos.json';
import varietyData from './locales/de/atlas/variety-index.json';

export const atlasCountries=countryData;
type CountryCode=keyof typeof countryData;
type RegionRow={id:string;title:string;country:string;hook:string;place:string;wine:string;detail:string;fact:string;climate:string;latitude:number;longitude:number;grapes:string[];sourceUrl?:string;sourceLabel?:string};
type GrapeRow={id:string;hook:string;place:string;character:string;detail:string;botany:string;fact:string;aromas:string[];countries:string[];sourceUrl:string;sourceLabel:string};
type ProducerRow={slug:string;title:string;country:string;region:string;point:{latitude:number;longitude:number};intro:string;paragraphs:string[];sections:{title:string;body:string}[];fact:string;facts:{label:string;value:string}[];related:string[];sources:{label:string;url:string}[];imageRegion?:string;aliases?:string[]};
const varieties=varietyData as Record<string,{slug:string;title:string;color:string;aliases:string[]}>;
const photos=photoData as Record<string,{image:string;imageAlt:string;imagePosition:string;imagePositionMobile:string;imageFit:string;imageCredit:string;imageSource:string}>;
const countryEntries=Object.entries(countryData) as [CountryCode,typeof countryData[CountryCode]][];
const source=(label:string,url:string)=>({label,url});
const climate:Record<string,{title:string;body:string}>=climateData;
const parentGroups:Record<string,string[]>={
 bordeaux:['medoc','margaux','pauillac','graves-sauternes','saint-emilion','pomerol'],
 bourgogne:['chablis','cote-de-nuits','cote-de-beaune','cote-chalonnaise','maconnais'],
 champagne:['montagne-de-reims','vallee-de-la-marne','cote-des-blancs','cote-des-bar'],
 piemonte:['barolo','barbaresco','asti-monferrato'],toscana:['chianti-classico','montalcino','montepulciano','bolgheri'],
 veneto:['valpolicella','soave','conegliano-valdobbiadene'],rioja:['rioja-alta','rioja-alavesa','rioja-oriental'],
 'napa-valley':['oakville'],mendoza:['uco-valley','lujan-de-cuyo','maipu'],marlborough:['wairau-valley','awatere-valley']
};
const extraRegionAliases:Record<string,string[]>={
 bourgogne:['Burgund','Burgundy'],piemonte:['Piemont','Piedmont'],toscana:['Toskana','Tuscany'],sardegna:['Sardinien','Sardinia'],corsica:['Korsika'],valais:['Wallis'],ticino:['Tessin'],vienna:['Wien'],styria:['Steiermark'],
 'northern-rhone':['Rhône','Rhone','Rhônetal'],'southern-rhone':['Rhône','Rhone','Rhônetal'],muscadet:['Loire','Loiretal'],
 'anjou-saumur':['Loire','Loiretal'],touraine:['Loire','Loiretal'],vouvray:['Loire','Loiretal'],'centre-loire':['Loire','Loiretal'],
 'willamette-valley':['Oregon'],'umpqua-valley':['Oregon'],'rogue-valley':['Oregon'],'columbia-valley':['Washington'],'yakima-valley':['Washington'],'red-mountain':['Washington'],'walla-walla-valley':['Washington'],
 'sonoma-county':['Kalifornien','California'],'napa-valley':['Kalifornien','California'],oakville:['Kalifornien','California'],'paso-robles':['Kalifornien','California'],'santa-barbara-county':['Kalifornien','California'],lodi:['Kalifornien','California'],'sierra-foothills':['Kalifornien','California'],
 'finger-lakes':['New York'],'okanagan-valley':['British Columbia'],'niagara-peninsula':['Ontario'],'prince-edward-county':['Ontario'],'annapolis-valley':['Nova Scotia']
};
const regionSlug=(id:string)=>id==='montepulciano'?'montepulciano-toskana':id;
function countryFor(label:string){const entry=countryEntries.find(([,c])=>c.label===label||c.aliases.includes(label));if(!entry)throw Error('Unbekannter Atlas-Länderbezug: '+label);return entry;}
function articlePhoto(id:string){const alternate:Record<string,string>={bordeaux:'graves-sauternes',champagne:'montagne-de-reims','napa-valley':'oakville'};return photos[id]||photos[alternate[id]]||{image:''};}
function regionArticle(r:RegionRow):Article{
 const [code,country]=countryFor(r.country);const theme=climate[r.climate];if(!theme)throw Error('Unbekannter Klimabezug '+r.id);
 const grapeIds=r.grapes.filter(id=>varieties[id]);const grapeNames=grapeIds.slice(0,3).map(id=>varieties[id].title);
 const parent=Object.entries(parentGroups).find(([,children])=>children.includes(r.id))?.[0];
 const aliases=[...(extraRegionAliases[r.id]||[]),...(parent?[parent,...(extraRegionAliases[parent]||[])]:[])];
 return {slug:regionSlug(r.id),category:'Regionen',title:r.title,eyebrow:country.label,intro:r.hook,countries:[code],aliases,
 paragraphs:[r.place,r.wine],sections:[{title:'Der Name auf der Flasche',body:r.detail},{title:'Herkunft kurz erklärt',body:country.context},theme],
 host:[r.place+' '+r.wine,r.detail+' '+theme.body],fact:r.fact,visual:'atlas',...articlePhoto(r.id),
 atlas:{kind:'region',country:country.label,countryCode:code,point:{latitude:r.latitude,longitude:r.longitude},facts:[{label:'Weinland',value:country.label},{label:'Beispiele für Rebsorten',value:grapeNames.join(' · ')||'Mehrere regionale Sorten'},{label:'Region',value:r.title}]},
 sources:[country.source,...(r.sourceUrl?[source(r.sourceLabel||r.title,r.sourceUrl)]:[])],
 related:[...(parent?[regionSlug(parent)]:[]),...grapeIds.slice(0,3).map(id=>varieties[id].slug)]};
}
function grapeArticle(r:GrapeRow):Article{
 const v=varieties[r.id];if(!v)throw Error('Rebsorte ohne Index '+r.id);const exampleValue=(grapeExamples as Record<string,string>)[r.id];const example=(regionData as RegionRow[]).find(region=>exampleValue?region.id===exampleValue:region.grapes.includes(r.id));const context=example?example.title+': '+example.detail:exampleValue||'';const namesDetail=r.detail+(context?'\n\n'+context:'');const codes=r.countries.filter(c=>c in countryData) as CountryCode[];const names=codes.map(c=>countryData[c].label);
 const color=v.color==='red'?'red':v.color==='family'?'family':'white';const technique=color==='red'?'Schalenkontakt und Gerbstoffe':'Pressen, Hefe und Ausbau';
 const techniqueText=color==='red'?'Bei der Gärung mit den Schalen gelangen Farbe und Gerbstoffe in den Wein. Wie kräftig beides ausfällt, hängt auch von Reife, Kontaktzeit und Kellerarbeit ab. Tannin kann ein trockenes Gefühl am Zahnfleisch erzeugen. Es ist etwas anderes als die frische, speichelanregende Wirkung von Säure.':'Beim Pressen, Vergären und Reifen kann derselbe Sortenname sehr unterschiedliche Weine ergeben. Ein weitgehend luftgeschützter Tankausbau bewahrt andere Eindrücke als ein Ausbau mit längerem Hefekontakt oder im Holzfass. Ob ein Wein süß schmeckt, hängt vom verbleibenden Zucker ab; fruchtiger Duft allein verrät das nicht.';
 return {slug:v.slug,category:'Rebsorten',title:v.title,eyebrow:color==='red'?'Dunkle Rebsorte':color==='family'?'Sortenfamilie und Namen':'Helle Rebsorte',intro:r.hook,countries:codes,aliases:v.aliases,
 paragraphs:[r.place,r.character],sections:[{title:'Im Weinberg',body:r.botany},{title:'Namen und Unterschiede',body:namesDetail},{title:technique,body:techniqueText}],
 host:[r.place+' '+r.character,r.botany+' '+r.detail],fact:r.fact,image:'',visual:'atlas',atlas:{kind:'grape',country:names.join(' · '),color,facts:[{label:'Beispiele für Weinländer',value:names.slice(0,4).join(' · ')},{label:'Traubenfarbe',value:color==='red'?'Dunkle Beeren':color==='family'?'Je nach Sorte unterschiedlich':['gewurztraminer','moschofilero','koshu','zierfandler'].includes(r.id)?'Rosa bis rötlich-graue Beeren':'Helle Beeren'},{label:'Weitere Namen',value:v.aliases.filter(a=>a!==v.title).slice(0,3).join(' · ')||'Meist unter diesem Namen bekannt'}],aromas:r.aromas},sources:[source(r.sourceLabel,r.sourceUrl)],related:[...(regionData as RegionRow[]).filter(region=>region.grapes.includes(r.id)).slice(0,3).map(region=>regionSlug(region.id)),color==='red'?'rotwein':'weisswein','aromen']};
}
function producerArticle(r:ProducerRow):Article{
 const country=countryData[r.country as CountryCode];return {slug:r.slug,category:'Weingüter',title:r.title,eyebrow:r.region+' · '+country.label,intro:r.intro,countries:[r.country],aliases:r.aliases||[],paragraphs:r.paragraphs,sections:r.sections,host:[...r.paragraphs,...r.sections.map(s=>s.body)],fact:r.fact,visual:'atlas',...articlePhoto(r.imageRegion||''),atlas:{kind:'producer',country:country.label,countryCode:r.country,point:r.point,facts:r.facts},related:r.related,sources:r.sources};
}
const coreSlugs=new Set(['spaetburgunder','grauburgunder','weissburgunder','riesling','silvaner','sauvignon-blanc','mourvedre-monastrell']);
export const atlasArticles:Article[]=[...(regionData as RegionRow[]).map(regionArticle),...(grapeData as GrapeRow[]).map(grapeArticle).filter(a=>!coreSlugs.has(a.slug)),...(producerData as ProducerRow[]).map(producerArticle),...styleData as Article[]];
const atlasIndex=new Map(atlasArticles.map(a=>[a.slug,a]));
export const atlasArticleBySlug=(slug:string)=>atlasIndex.get(slug);
export function canonicalAtlasSlug(slug:string){return ({malmsey:'madeira-wein','pinot-noir':'spaetburgunder','pinot-gris':'grauburgunder','pinot-blanc':'weissburgunder',wurttemberg:'wuerttemberg',monastrell:'mourvedre-monastrell'} as Record<string,string>)[slug]||slug;}
const coreGrapeCountries:Record<string,string[]>={spaetburgunder:['DE','FR','US','NZ'],grauburgunder:['DE','FR','IT'],weissburgunder:['DE','FR','IT','AT'],riesling:['DE','FR','AT','AU','NZ'],silvaner:['DE','FR'],'sauvignon-blanc':['FR','NZ','CL','ZA']};
export function enrichAtlasArticle(a:Article):Article{
 if(a.countries)return a;const v=Object.values(varieties).find(v=>v.slug===a.slug);return {...a,countries:coreGrapeCountries[a.slug]||(a.category==='Regionen'||a.category==='Weingüter'?['DE']:[]),aliases:[...(a.aliases||[]),...(v?.aliases||[]),a.slug]};
}
