import { createServer } from 'vite'
import { readdir } from 'node:fs/promises'

const server=await createServer({server:{middlewareMode:true},appType:'custom',logLevel:'silent'})
try{
  const curriculum=await server.ssrLoadModule('/src/learningCurriculum.ts')
  const audit=curriculum.learningValidation()
  const catalog=await server.ssrLoadModule('/src/data/catalog.ts')
  const guideExperience=await server.ssrLoadModule('/src/ReferenceGuideExperience.tsx')
  const media=(await readdir('src/assets/learning-guides')).filter(file=>file.endsWith('.jpg')).map(file=>file.replace('.jpg',''))
  const guideIds=catalog.articles.map(article=>article.id)
  const standaloneLabIds=['glassware-anatomy','bottle-closures','bottle-anatomy']
  const interactiveGuideIds=new Set([...guideExperience.referenceGuideLabIds,...standaloneLabIds])
  const issues=[...audit.issues]
  for(const id of guideIds){
    const guide=catalog.articles.find(article=>article.id===id)
    if(!interactiveGuideIds.has(id))issues.push(`Reference guide ${id} has no interactive lab`)
    if(!media.includes(id))issues.push(`Reference guide ${id} has no dedicated illustration`)
    if(guide?.objectives.includes('Understand the mechanism rather than memorising a rule'))issues.push(`Reference guide ${id} still uses fallback objectives`)
    if((guide?.body.join(' ').split(/\s+/).length??0)<500)issues.push(`Reference guide ${id} has fewer than 500 English editorial words`)
  }
  for(const id of interactiveGuideIds)if(!guideIds.includes(id))issues.push(`Interactive lab ${id} has no public guide`)
  const photoPairs=(await server.ssrLoadModule('/src/data/ampelographyMedia.generated.json')).default
  if(photoPairs.length<50)issues.push(`Only ${photoPairs.length} verified ampelographic photo pairs remain`)
  if(new Set(photoPairs.map(item=>item.grapeId)).size!==photoPairs.length)issues.push('Duplicate grape IDs in ampelographic media registry')
  if(photoPairs.some(item=>!item.leafUrl||!item.clusterUrl||!item.sourceUrl))issues.push('An ampelographic photo record is incomplete')
  if(photoPairs.some(item=>item.leafUrl===item.clusterUrl))issues.push('An ampelographic record reuses one image for leaf and cluster')
  if(issues.length)throw new Error(`Learning validation failed:\n${issues.join('\n')}`)
  process.stdout.write(`Learning validation passed: ${audit.modules} authored modules, ${guideIds.length} interactive reference guides with dedicated media, ${audit.schools} schools, ${audit.archetypes} archetypes, ${photoPairs.length} verified ampelographic photo pairs.\n`)
}finally{
  await server.close()
}
