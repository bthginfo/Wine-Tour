import { generatedGuideImage } from './generatedKnowledgeMedia'

const files=import.meta.glob('./assets/learning-guides/*.jpg',{eager:true,query:'?url',import:'default'}) as Record<string,string>

export const learningGuideMedia=Object.fromEntries(
  Object.entries(files).map(([path,url])=>[path.split('/').pop()!.replace('.jpg',''),url]),
) as Record<string,string>

export function guideImage(id:string){
  return learningGuideMedia[id]
}

export function generatedGuideIllustration(id:string){
  return generatedGuideImage(id)
}
