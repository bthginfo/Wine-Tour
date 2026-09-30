import type { Locale } from './i18n'
import type { PhotoAttribution } from './regionMedia'

const photoLabel:Record<Locale,string>={
  en:'Photo',
  de:'Foto',
  fr:'Photo',
  es:'Foto',
}

export function RegionPhotoCredit({attribution,locale,className}:{attribution:PhotoAttribution;locale:Locale;className:string}){
  return <small className={className}>
    {photoLabel[locale]}: <a href={attribution.filePage} target="_blank" rel="noreferrer">{attribution.author}</a>
    {' · '}<a href={attribution.licenseUrl} target="_blank" rel="noreferrer">{attribution.license}</a>
    {' · '}{attribution.changes[locale]}
  </small>
}
