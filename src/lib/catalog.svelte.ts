// Keep the current exploration within this app visit when opening an article and returning.
export const catalog=$state({search:'',category:'Alles'});
export function resetCatalog(){catalog.search='';catalog.category='Alles';}
