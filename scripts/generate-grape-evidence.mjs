import { readFile, writeFile } from 'node:fs/promises'

const input = JSON.parse(await readFile(new URL('../src/data/ampelographyMedia.generated.json', import.meta.url), 'utf8'))

function decode(value='') {
  return value
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&ndash;|&mdash;/g, '—')
    .replace(/&deg;/g, '°')
    .replace(/\s+/g, ' ')
    .trim()
}

function followingParagraph(html, marker, className='o-grapeBody__originDesc') {
  const start=html.indexOf(marker)
  if(start<0)return ''
  const match=html.slice(start).match(new RegExp(`<p class=["']${className}["']>([\\s\\S]*?)<\\/p>`,'i'))
  return decode(match?.[1])
}

function sentences(value, count=2) {
  return (value.match(/[^.!?]+[.!?]+|[^.!?]+$/g)??[]).slice(0,count).join(' ').trim()
}

function descriptionParts(html) {
  const match=html.match(/<div class="o-blocDoubleImageText__desc a-p m-customContent">([\s\S]*?)<\/div>/i)
  const rows=(match?.[1]??'').split(/<br\s*\/?\s*>/i).map(decode).filter(Boolean)
  return {
    leaf: (rows.find(row=>/adult leaves|adult leaf/i.test(row))??rows.find(row=>/description corresponds|identification is similar/i.test(row))??'').replace(/^[-–]\s*/,''),
    berry: rows.find(row=>/berr(?:y|ies)/i.test(row))?.replace(/^[-–]\s*/,'')??'',
  }
}

async function translate(text, language) {
  if(!text)return ''
  const endpoint=new URL('https://translate.googleapis.com/translate_a/single')
  endpoint.searchParams.set('client','gtx')
  endpoint.searchParams.set('sl','en')
  endpoint.searchParams.set('tl',language)
  endpoint.searchParams.set('dt','t')
  endpoint.searchParams.set('q',text)
  const response=await fetch(endpoint,{headers:{'user-agent':'VineAtlasEditorialSnapshot/1.0'}})
  if(!response.ok)throw new Error(`Translation ${language}: ${response.status}`)
  const payload=await response.json()
  return payload[0].map(part=>part[0]).join('').trim()
}

async function mapLimit(items, limit, callback) {
  const output=new Array(items.length)
  let cursor=0
  async function worker(){while(cursor<items.length){const index=cursor++;output[index]=await callback(items[index],index)}}
  await Promise.all(Array.from({length:limit},worker))
  return output
}

const profiles=await mapLimit(input,4,async (media,index)=>{
  const response=await fetch(media.sourceUrl,{headers:{'user-agent':'VineAtlasEditorialSnapshot/1.0'}})
  if(!response.ok)throw new Error(`${media.grapeId}: ${response.status}`)
  const html=await response.text()
  const description=descriptionParts(html)
  const cultivation=followingParagraph(html,'Cultivation and agronomic skills')
  const disease=followingParagraph(html,'Susceptibility to Diseases and Pests','o-grapeBody__usesDesc')
  const potential=followingParagraph(html,'Technological potential','o-grapeBody__dataDesc')
  const english={
    leaf:description.leaf,
    cluster:sentences(potential,1),
    berry:description.berry,
    growth:sentences(cultivation,2),
    risk:sentences(disease,2),
  }
  const packed=Object.values(english).join(' ||| ')
  const translated=await Promise.all(['de','fr','es'].map(language=>translate(packed,language)))
  const locales=Object.fromEntries(translated.map((value,localeIndex)=>[['de','fr','es'][localeIndex],Object.fromEntries(Object.keys(english).map((key,keyIndex)=>[key,value.split(/\s*\|\|\|\s*/)[keyIndex]??'']))]))
  process.stdout.write(`\r${index+1}/${input.length} ${media.grapeId}                    `)
  return {grapeId:media.grapeId,sourceUrl:media.sourceUrl,sourceLabel:media.sourceLabel,en:english,...locales}
})

await writeFile(new URL('../src/data/grapeEvidence.generated.json',import.meta.url),`${JSON.stringify(profiles,null,2)}\n`,'utf8')
process.stdout.write(`\nWrote ${profiles.length} sourced grape profiles.\n`)
