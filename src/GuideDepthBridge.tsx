import { PortableLearningBlock } from './LearningSystem'
import { learningModuleById, type LearningBlockKind } from './learningCurriculum'
import type { Locale } from './i18n'

type Bridge={moduleId:string;kind:LearningBlockKind}

export const guideDepthMap:Record<string,Bridge>={
  'taste-with-intention':{moduleId:'build-a-tasting-note',kind:'tasting-prompt'},
  'sparkling-methods':{moduleId:'wine-as-system',kind:'process-timeline'},
  'red-white-rose':{moduleId:'red-white-rose',kind:'comparison-lab'},
  'sweet-wine':{moduleId:'ripeness-harvest',kind:'comparison-lab'},
  'fortified-wine':{moduleId:'fermentation',kind:'decision-case'},
  service:{moduleId:'structure-not-flavour',kind:'comparison-lab'},
  'aroma-language':{moduleId:'build-a-tasting-note',kind:'sensory-lab'},
  'vine-year':{moduleId:'vine-anatomy',kind:'process-timeline'},
  'terroir-layers':{moduleId:'producer-story-chain',kind:'map-lab'},
  fermentation:{moduleId:'fermentation',kind:'simulator'},
  'maturation-vessels':{moduleId:'wine-as-system',kind:'comparison-lab'},
  'lees-and-malolactic':{moduleId:'fermentation',kind:'annotated-plate'},
  'labels-and-origin':{moduleId:'germany-origin',kind:'decision-case'},
  'food-pairing':{moduleId:'pairing-balance',kind:'comparison-lab'},
  'wine-faults':{moduleId:'wine-faults',kind:'decision-case'},
  'climate-and-altitude':{moduleId:'ripeness-harvest',kind:'simulator'},
  cellaring:{moduleId:'wine-as-system',kind:'decision-case'},
  'sparkling-service':{moduleId:'structure-not-flavour',kind:'simulator'},
  'soil-water-roots':{moduleId:'vine-anatomy',kind:'simulator'},
  'vintage-weather':{moduleId:'ripeness-harvest',kind:'decision-case'},
  'sensory-calibration':{moduleId:'structure-not-flavour',kind:'sensory-lab'},
  'appellation-maps':{moduleId:'germany-origin',kind:'map-lab'},
  'bottle-closures':{moduleId:'wine-as-system',kind:'annotated-plate'},
  'oxygen-and-age':{moduleId:'fermentation',kind:'comparison-lab'},
}

export const guideDepthCoverage=Object.keys(guideDepthMap)

export function GuideDepthBridge({articleId,locale}:{articleId:string;locale:Locale}){
  const bridge=guideDepthMap[articleId]
  const module=bridge&&learningModuleById(bridge.moduleId)
  const block=module?.blocks.find(item=>item.kind===bridge.kind)
  if(!module||!block)return null
  return <section className={`guide-depth-bridge guide-depth-${block.kind}`}>
    <header><h2>{module.title[locale]}</h2><p>{module.question[locale]}</p></header>
    <PortableLearningBlock module={module} block={block} compact expanded/>
  </section>
}
