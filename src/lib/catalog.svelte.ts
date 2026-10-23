// Public exploration state stays available while reading an article and returning.
export const catalog=$state({search:'',category:'Alles',country:'all',limit:36,lastOpenSlug:''});
export function resetCatalog(){catalog.search='';catalog.category='Alles';catalog.country='all';catalog.limit=36;catalog.lastOpenSlug='';}
