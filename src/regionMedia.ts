import type { Locale } from './i18n'
import { regions } from './data/catalog'
import { generatedRegionImage } from './generatedKnowledgeMedia'
import vineyardHero from './assets/vineyard-terraces.jpg'
import mediterranean from './assets/region-mediterranean-vines.jpg'
import andes from './assets/region-andes-vineyard.jpg'
import maritime from './assets/region-maritime-vineyard.jpg'
import volcanicIsland from './assets/region-volcanic-vineyard.jpg'
import riverSlate from './assets/region-river-slate.jpg'
import estuaryLimestone from './assets/region-estuary-limestone.jpg'
import alpineLake from './assets/region-alpine-lake.jpg'
import ancientBush from './assets/region-ancient-bush-vines.jpg'
import coastalFog from './assets/region-coastal-fog.jpg'
import volcanicAltitude from './assets/region-volcanic-altitude.jpg'
import windsweptIsland from './assets/region-windswept-island.jpg'
import continentalPlateau from './assets/region-continental-plateau.jpg'
import bordeauxEstuary from './assets/region-bordeaux-estuary.jpg'
import marlboroughWairau from './assets/region-marlborough-wairau.jpg'
import moselPortrait from './assets/region-portrait-mosel.jpg'
import bordeauxPortrait from './assets/region-portrait-bordeaux.jpg'
import mendozaPortrait from './assets/region-portrait-mendoza.jpg'
import marlboroughPortrait from './assets/region-portrait-marlborough.jpg'
import nemeaPortrait from './assets/region-portrait-nemea.jpg'

type LocalizedCopy=Record<Locale,string>
type RegionScene={src:string;position:string;tone:'deep'|'soft'|'cool'|'warm';caption:LocalizedCopy}
type RegionHero=RegionScene&{decorativeFallback:boolean}
type Portrait={src:string;alt:LocalizedCopy;caption:LocalizedCopy}

const scenes={
  terraces:{src:vineyardHero,position:'52% center',tone:'deep',caption:{en:'Terraced vineyard slopes',de:'Terrassierte Weinberghänge',fr:'Coteaux viticoles en terrasses',es:'Laderas de viñedos en terrazas'}},
  mediterranean:{src:mediterranean,position:'58% center',tone:'warm',caption:{en:'Mediterranean vineyard landscape',de:'Mediterrane Weinberglandschaft',fr:'Paysage viticole méditerranéen',es:'Paisaje vitícola mediterráneo'}},
  andes:{src:andes,position:'58% center',tone:'cool',caption:{en:'Vineyards beneath the Andes',de:'Weinberge am Fuß der Anden',fr:'Vignobles au pied des Andes',es:'Viñedos al pie de los Andes'}},
  maritime:{src:maritime,position:'58% center',tone:'cool',caption:{en:'Ocean-influenced vineyard landscape',de:'Ozeanisch geprägte Weinberglandschaft',fr:'Paysage viticole sous influence océanique',es:'Paisaje vitícola de influencia oceánica'}},
  volcanicIsland:{src:volcanicIsland,position:'54% center',tone:'deep',caption:{en:'Island vineyard landscape',de:'Weinberglandschaft einer Insel',fr:'Paysage viticole insulaire',es:'Paisaje vitícola insular'}},
  riverSlate:{src:riverSlate,position:'48% center',tone:'deep',caption:{en:'River valley and slate slopes',de:'Flusstal und Schieferhänge',fr:'Vallée fluviale et coteaux de schiste',es:'Valle fluvial y laderas de pizarra'}},
  estuaryLimestone:{src:estuaryLimestone,position:'56% center',tone:'soft',caption:{en:'Vineyard beside an estuary',de:'Weinberg an einer Flussmündung',fr:'Vignoble près d’un estuaire',es:'Viñedo junto a un estuario'}},
  alpineLake:{src:alpineLake,position:'56% center',tone:'cool',caption:{en:'Alpine vineyard landscape',de:'Alpine Weinberglandschaft',fr:'Paysage viticole alpin',es:'Paisaje vitícola alpino'}},
  ancientBush:{src:ancientBush,position:'48% center',tone:'warm',caption:{en:'Old bush vines',de:'Alte Buschreben',fr:'Vieilles vignes en gobelet',es:'Viñas viejas en vaso'}},
  coastalFog:{src:coastalFog,position:'54% center',tone:'cool',caption:{en:'Coastal vineyard in sea mist',de:'Küstenweinberg im Seewind',fr:'Vignoble côtier dans la brume marine',es:'Viñedo costero entre brumas marinas'}},
  volcanicAltitude:{src:volcanicAltitude,position:'52% center',tone:'deep',caption:{en:'High-elevation volcanic vineyard',de:'Vulkanischer Weinberg in großer Höhe',fr:'Vignoble volcanique d’altitude',es:'Viñedo volcánico de altura'}},
  windsweptIsland:{src:windsweptIsland,position:'55% center',tone:'deep',caption:{en:'Wind-exposed island vines',de:'Windoffene Inselreben',fr:'Vignes insulaires exposées au vent',es:'Viñas insulares expuestas al viento'}},
  continentalPlateau:{src:continentalPlateau,position:'52% center',tone:'warm',caption:{en:'Continental plateau vineyard',de:'Weinberg auf kontinentalem Plateau',fr:'Vignoble de plateau continental',es:'Viñedo de meseta continental'}},
  bordeauxEstuary:{src:bordeauxEstuary,position:'50% center',tone:'deep',caption:{en:'Estuary vineyard landscape',de:'Weinberglandschaft an einer Flussmündung',fr:'Paysage viticole d’estuaire',es:'Paisaje vitícola de estuario'}},
  marlboroughWairau:{src:marlboroughWairau,position:'52% center',tone:'deep',caption:{en:'Wairau valley vineyard landscape',de:'Weinberglandschaft im Wairau-Tal',fr:'Paysage viticole de la vallée de Wairau',es:'Paisaje vitícola del valle de Wairau'}},
} satisfies Record<string,RegionScene>

type SceneKey=keyof typeof scenes

// Keep only editorially chosen region IDs here. No climate, soil, latitude or
// substring guessing is used to imply that a scene depicts a specific place.
const sceneByRegion:Record<string,SceneKey>={
  mosel:'riverSlate',nahe:'terraces',rheingau:'terraces',bordeaux:'bordeauxEstuary',bourgogne:'terraces',champagne:'continentalPlateau','chianti-classico':'mediterranean',
  mendoza:'andes','jujuy-catamarca':'andes',etna:'volcanicAltitude',santorini:'windsweptIsland',madeira:'volcanicIsland','priorat-montsant':'ancientBush',
  marlborough:'marlboroughWairau','central-otago':'ancientBush','rias-baixas':'maritime',
}

const portraits:Record<string,Portrait>={
  mosel:{src:moselPortrait,alt:{en:'Illustration of a river bend and slate slopes',de:'Illustration einer Flussschleife und Schieferhänge',fr:'Illustration d’un méandre et de coteaux de schiste',es:'Ilustración de un meandro y laderas de pizarra'},caption:{en:'River bends and slate slopes',de:'Flussschleifen und Schieferhänge',fr:'Méandres et coteaux de schiste',es:'Meandros y laderas de pizarra'}},
  bordeaux:{src:bordeauxPortrait,alt:{en:'Illustration of the estuary and vineyard banks',de:'Illustration der Flussmündung und Weinbergufer',fr:'Illustration de l’estuaire et des rives viticoles',es:'Ilustración del estuario y sus riberas vitícolas'},caption:{en:'Estuary and vineyard banks',de:'Flussmündung und Weinbergufer',fr:'Estuaire et rives viticoles',es:'Estuario y riberas vitícolas'}},
  mendoza:{src:mendozaPortrait,alt:{en:'Illustration of vineyards beneath the Andes',de:'Illustration von Weinbergen am Fuß der Anden',fr:'Illustration de vignobles au pied des Andes',es:'Ilustración de viñedos al pie de los Andes'},caption:{en:'High vineyards and the Andes',de:'Hochlagen und Anden',fr:'Vignobles d’altitude et Andes',es:'Viñedos de altura y Andes'}},
  marlborough:{src:marlboroughPortrait,alt:{en:'Illustration of Marlborough valleys and vineyards',de:'Illustration der Täler und Weinberge Marlboroughs',fr:'Illustration des vallées et vignobles de Marlborough',es:'Ilustración de los valles y viñedos de Marlborough'},caption:{en:'Wairau valley and vineyard plain',de:'Wairau-Tal und Weinbauebene',fr:'Vallée de Wairau et plaine viticole',es:'Valle de Wairau y llanura vitícola'}},
  nemea:{src:nemeaPortrait,alt:{en:'Illustration of Nemea’s basin and limestone hills',de:'Illustration des Beckens und Kalkhügel Nemeas',fr:'Illustration du bassin et des collines calcaires de Némée',es:'Ilustración de la cuenca y colinas calizas de Nemea'},caption:{en:'Basin, limestone hills and vines',de:'Becken, Kalkhügel und Reben',fr:'Bassin, collines calcaires et vignes',es:'Cuenca, colinas calizas y viñas'}},
}

type FallbackTheme='universal'|'andes'|'alpine'|'island'|'volcanic'|'coastal'|'mediterranean'|'riverSlate'
const fallbackScenesByTheme:Record<FallbackTheme,RegionScene[]>={
  universal:[scenes.terraces,scenes.ancientBush,scenes.continentalPlateau],
  andes:[scenes.andes,scenes.terraces,scenes.continentalPlateau],
  alpine:[scenes.alpineLake,scenes.terraces,scenes.continentalPlateau],
  island:[scenes.windsweptIsland,scenes.coastalFog],
  volcanic:[scenes.volcanicAltitude,scenes.terraces,scenes.ancientBush],
  coastal:[scenes.coastalFog,scenes.maritime,scenes.terraces],
  mediterranean:[scenes.mediterranean,scenes.terraces,scenes.ancientBush],
  riverSlate:[scenes.riverSlate,scenes.terraces,scenes.ancientBush],
}
const islandRegionIds=new Set(['corsica','sardegna','crete','tasmania','commandaria-troodos'])
const alpineRegionIds=new Set(['savoie','valais','vaud-lavaux','graubunden','ticino','trentino-alto-adige','valtellina'])

function fallbackThemeFor(region:(typeof regions)[number]):FallbackTheme{
  if(islandRegionIds.has(region.id))return 'island'
  if(alpineRegionIds.has(region.id))return 'alpine'
  const climate=region.climate.toLowerCase(),soil=region.soil.toLowerCase()
  if(region.hasRegionalTerroirEvidence&&['Argentina','Chile'].includes(region.country)&&/altitude|mountain|andes|high/.test(climate))return 'andes'
  if(region.hasRegionalTerroirEvidence&&/volcan|basalt|lava|tuff/.test(soil))return 'volcanic'
  if(region.hasRegionalTerroirEvidence&&/coastal|maritime|ocean|atlantic|pacific|fog|sea breeze/.test(climate))return 'coastal'
  if(region.hasRegionalTerroirEvidence&&/mediterranean/.test(climate))return 'mediterranean'
  if(region.hasRegionalTerroirEvidence&&/slate|schist|schiefer/.test(soil)&&/river|valley|riverbank/.test(climate))return 'riverSlate'
  return 'universal'
}

// Cycle evenly inside a metadata-matched theme bucket. Named scenes for
// Bordeaux, Marlborough and Nemea are deliberately excluded from these pools.
const fallbackRankByRegion=new Map<string,{theme:FallbackTheme;rank:number}>()
const themeRanks=new Map<FallbackTheme,number>()
for(const region of regions){
  if(sceneByRegion[region.id])continue
  const theme=fallbackThemeFor(region),rank=themeRanks.get(theme)??0
  fallbackRankByRegion.set(region.id,{theme,rank})
  themeRanks.set(theme,rank+1)
}

export function regionMediaFor(regionId:string){
  const key=sceneByRegion[regionId]
  const fallback=fallbackRankByRegion.get(regionId)??{theme:'universal' as const,rank:0}
  const pool=fallbackScenesByTheme[fallback.theme]
  const generated=generatedRegionImage(regionId)
  const heroScene=generated?{
    src:generated.src,
    position:'50% center',
    tone:'warm' as const,
    caption:generated.caption??scenes.terraces.caption,
  }:key?scenes[key]:(pool[fallback.rank%pool.length]??scenes.terraces)
  return {
    hero:{...heroScene,decorativeFallback:!key&&!generated} as RegionHero,
    portrait:portraits[regionId],
  }
}
