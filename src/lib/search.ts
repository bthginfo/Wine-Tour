// Match the words people can type easily on a phone: Rose/Rosé, Spat/Spät, Weiss/Weiß.
export function searchText(value:string){return value.toLocaleLowerCase('de-DE').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');}
