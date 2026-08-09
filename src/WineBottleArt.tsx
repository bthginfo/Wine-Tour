import type { Producer, Wine } from './types'

function stableVariant(value:string){
  return [...value].reduce((total,letter)=>total+letter.charCodeAt(0),0)%3
}

export function WineBottleArt({wine,producer,compact=false}:{wine:Wine;producer?:Producer;compact?:boolean}){
  const variant=stableVariant(wine.id)
  const family=wine.style==='sparkling'?'sparkling':wine.style==='white'||wine.style==='rose'||wine.style==='sweet'?'sloped':'shouldered'
  return <div className={`wine-bottle-art style-${wine.style} shape-${family} label-${variant} ${compact?'is-compact':''}`} aria-hidden="true">
    <div className="bottle-cast-shadow"/>
    <div className="bottle-vessel">
      <span className="bottle-glass-shine"/>
      <span className="bottle-capsule"/>
      <span className="bottle-label-art">
        <small>{producer?.name??'Vine Atlas'}</small>
        <strong>{wine.name}</strong>
        <em>{wine.vintage??'NV'}</em>
      </span>
      <span className="bottle-punt"/>
    </div>
  </div>
}
