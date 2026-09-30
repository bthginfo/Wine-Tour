import { useEffect, useState } from 'react'
import type { Producer, Wine } from './types'
import bordeauxBottle from './assets/bottles/bordeaux-editorial.jpg'
import burgundyBottle from './assets/bottles/burgundy-editorial.jpg'
import rhineBottle from './assets/bottles/rhine-editorial.jpg'

const mediaCache=new Map<string,string|null>()

function bottleFamily(wine:Wine){
  if(wine.style==='white'||wine.style==='sweet')return 'rhine'
  if(wine.style==='rose'||wine.style==='sparkling')return 'burgundy'
  return [...wine.id].reduce((total,letter)=>total+letter.charCodeAt(0),0)%2?'burgundy':'bordeaux'
}

function producerMark(name:string){
  const words=name.replace(/[.'&’]/g,' ').split(/\s+/).filter(word=>word.length>1&&!['de','du','des','la','le','the','and'].includes(word.toLowerCase()))
  return (words.slice(0,3).map(word=>word[0]).join('')||'VA').toUpperCase()
}

function usePublishedWineImage(wineId:string,preferred?:string|null){
  const [url,setUrl]=useState<string|null|undefined>(()=>preferred??mediaCache.get(wineId))
  useEffect(()=>{
    if(preferred){setUrl(preferred);return}
    if(mediaCache.has(wineId)){setUrl(mediaCache.get(wineId)??null);return}
    const controller=new AbortController()
    fetch(`/api/media/wine?wineId=${encodeURIComponent(wineId)}`,{signal:controller.signal})
      .then(response=>response.ok?response.json():{url:null})
      .then((result:{url?:string|null})=>{const next=result.url??null;mediaCache.set(wineId,next);setUrl(next)})
      .catch(()=>{if(!controller.signal.aborted)setUrl(null)})
    return()=>controller.abort()
  },[preferred,wineId])
  return url
}

export function WineBottleArt({wine,producer,compact=false,imageUrl}:{wine:Wine;producer?:Producer;compact?:boolean;imageUrl?:string|null}){
  const uploadedImage=usePublishedWineImage(wine.id,imageUrl)
  const family=bottleFamily(wine)
  const illustration={bordeaux:bordeauxBottle,burgundy:burgundyBottle,rhine:rhineBottle}[family]
  const labelLength=wine.name.length>34?'label-very-long':wine.name.length>22?'label-long':'label-regular'
  return <figure className={`wine-bottle-art bottle-${family} ${labelLength} ${compact?'is-compact':''} ${uploadedImage?'has-upload':''}`} aria-label={`${wine.name}${producer?` · ${producer.name}`:''}`}>
    <img className="bottle-illustration" src={uploadedImage||illustration} alt="" />
    {!uploadedImage&&<figcaption className="bottle-label-art">
      <small>{compact?producerMark(producer?.name??'Vine Atlas'):producer?.name??'Vine Atlas'}</small>
      {!compact&&<strong>{wine.name}</strong>}
      <em>{wine.vintage??'—'}</em>
    </figcaption>}
  </figure>
}
