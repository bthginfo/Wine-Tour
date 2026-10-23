import {articles as baseArticles,wines as baseWines,imageCredits,type Article,type Wine} from './content';
export const editorial=$state<{records:Record<string,{data:any;version:number;updatedAt:string}>;error:string;loaded:boolean}>({records:{},error:'',loaded:false});
export async function loadEditorial(admin=false){try{const r=await fetch(admin?'/api/admin/content':'/api/content');if(!r.ok)throw Error('Die bearbeiteten Inhalte konnten nicht geladen werden.');editorial.records=(await r.json()).records;editorial.error='';}catch(e){editorial.error=(e as Error).message;}editorial.loaded=true;}
export const imageSrc=(value:string)=>!value?'':value?.startsWith('https://')||value?.startsWith('/')?value:'/images/'+value+'.jpg';
export const getArticle=(slug:string):Article|undefined=>{const a=baseArticles.find(a=>a.slug===slug);return a?{...a,...editorial.records['article:'+slug]?.data}:undefined;};
export const getArticles=()=>baseArticles.map(a=>getArticle(a.slug)!);
export const getWines=():Wine[]=>baseWines.map(w=>({...w,...editorial.records['wine:'+w.id]?.data}));
export const creditFor=(a:Article)=>({text:a.imageCredit||imageCredits[a.image]?.text||'Illustration · KI-generiert',url:a.imageSource||imageCredits[a.image]?.url||'/entdecken/quellen'});
export const homeDefaults={title:'Weintasting',intro:'Secco Rosé aus der Pfalz, Grauburgunder aus Rheinhessen und Riesling von der Saar. Der vierte Wein folgt.',heroTitle:'Was trinken wir heute?',heroText:'Zu jedem Wein lernst du erst die Region kennen, dann das Weingut, die Rebsorte und die Weinart. Deine Eindrücke kannst du direkt beim Probieren festhalten.',heroImage:'/images/pfalz.jpg',heroPosition:'center center',heroPositionMobile:'center center',heroFit:'cover',heroAlt:'Weinberge bei Kallstadt in der Pfalz',heroCredit:'Foto: Kmtextor · CC BY-SA 4.0',heroSource:'https://commons.wikimedia.org/wiki/File:Vineyard_Kallstadt.jpg'};
export const getHome=()=>({...homeDefaults,...editorial.records['page:home']?.data});
