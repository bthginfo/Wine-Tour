import type {Wine} from './content';

export type TastingSettings = {redName?:string;redProducer?:string;redRegion?:string;redGrape?:string;rieslingLabel?:string;vintages?:string[]};

// Use room-specific label information consistently in tasting, notes, search and PDF.
export function tastingWine(wine:Wine,settings:TastingSettings={}):Wine & {vintage:string}{
 const index=['secco','juwel','riesling','rot'].indexOf(wine.id);
 const red=wine.id==='rot';
 return {...wine,name:red&&settings.redName?settings.redName:wine.id==='riesling'&&settings.rieslingLabel?settings.rieslingLabel:wine.name,producer:red&&settings.redProducer?settings.redProducer:wine.producer,region:red&&settings.redRegion?settings.redRegion:wine.region,grape:red&&settings.redGrape?settings.redGrape:wine.grape,vintage:settings.vintages?.[index]??wine.vintage??''};
}
