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
import frankenHallburg from './assets/licensed-regions/franken-hallburg.jpg'
import pfalzKallstadt from './assets/licensed-regions/pfalz-kallstadt.jpg'
import patagoniaVineyard from './assets/licensed-regions/patagonia-vineyard.jpg'
import centralOtagoGibbston from './assets/licensed-regions/central-otago-gibbston.jpg'
import swartlandWineRoute from './assets/licensed-regions/swartland-wine-route.jpg'
import douroVineyards from './assets/licensed-regions/douro-river-vineyards.jpg'
import wachauJoching from './assets/licensed-regions/wachau-prandtauerhof.jpg'
import baroloLaMorra from './assets/licensed-regions/barolo-la-morra.jpg'
import chiantiAutumn from './assets/licensed-regions/chianti-classico-autumn.jpg'
import etnaPassopisciaro from './assets/licensed-regions/etna-passopisciaro.jpg'
import santoriniVineyard from './assets/licensed-regions/santorini-bush-vines.jpg'
import prioratErmita from './assets/licensed-regions/priorat-ermita-gratallops.jpg'
import riasBaixasCastrelo from './assets/licensed-regions/rias-baixas-albarino-castrelo.jpg'
import penedesAvinyonet from './assets/licensed-regions/penedes-avinyonet.jpg'
import moselVineyards from './assets/licensed-regions/mosel-vineyards.jpg'
import barossaMenglerHill from './assets/licensed-regions/barossa-mengler-hill.jpg'
import margaretRiverWatershed from './assets/licensed-regions/margaret-river-watershed.jpg'
import marlboroughWairauPhoto from './assets/licensed-regions/marlborough-wairau-vineyards.jpg'
import coonawarraRows from './assets/licensed-regions/coonawarra-vine-rows.jpg'
import tasmaniaGhostRock from './assets/licensed-regions/tasmania-ghost-rock.jpg'
import constantiaBeauConstantia from './assets/licensed-regions/constantia-beau-constantia.jpg'
import tokajVineyard from './assets/licensed-regions/tokaj-vineyard.jpg'
import brdaVineyards from './assets/licensed-regions/brda-slovenia-vineyards.jpg'
import istriaVineyards from './assets/licensed-regions/istria-vineyards.jpg'
import fingerLakesSunrise from './assets/licensed-regions/finger-lakes-vineyard-sunrise.jpg'
import sonomaBedrock from './assets/licensed-regions/sonoma-bedrock-vineyard.jpg'
import willametteNysa from './assets/licensed-regions/willamette-nysa-vineyard.jpg'
import okanaganOsoyoos from './assets/licensed-regions/okanagan-osoyoos-vineyards.jpg'
import ucoLosArboles from './assets/licensed-regions/uco-valley-los-arboles.jpg'
import colchaguaAngostura from './assets/licensed-regions/colchagua-angostura-vineyard.jpg'
import guadalupeVineyards from './assets/licensed-regions/guadalupe-vineyards.jpg'
import canelonesVineyard from './assets/licensed-regions/canelones-vineyard.jpg'
import paarlVineyard from './assets/licensed-regions/paarl-vineyard.jpg'
import nashikVineyards from './assets/licensed-regions/nashik-sula-vineyards.jpg'
import bekaaVineyards from './assets/licensed-regions/bekaa-chateau-barka.jpg'
import naheLemberg from './assets/licensed-regions/nahe-oberhausen-lemberg.jpg'
import alsaceRiquewihr from './assets/licensed-regions/alsace-riquewihr.jpg'
import mauleSauzal from './assets/licensed-regions/maule-sauzal-old-vines.jpg'
import hawkesBayAutumn from './assets/licensed-regions/hawkes-bay-autumn-vineyard.jpg'
import martinboroughVines from './assets/licensed-regions/martinborough-vineyards.jpg'
import chablisSlopes from './assets/licensed-regions/chablis-vineyards.jpg'
import coteDeBeauneMontrevenaux from './assets/licensed-regions/cote-de-beaune-montrevenaux.jpg'
import rheinhessenHillesheim from './assets/licensed-regions/rheinhessen-hillesheim.jpg'
import yamanashiKatsunuma from './assets/licensed-regions/yamanashi-katsunuma.jpg'
import barbarescoHills from './assets/licensed-regions/barbaresco-vineyard-hills.jpg'
import moselPortrait from './assets/region-portrait-mosel.jpg'
import bordeauxPortrait from './assets/region-portrait-bordeaux.jpg'
import mendozaPortrait from './assets/region-portrait-mendoza.jpg'
import marlboroughPortrait from './assets/region-portrait-marlborough.jpg'
import nemeaPortrait from './assets/region-portrait-nemea.jpg'

type LocalizedCopy=Record<Locale,string>
export type PhotoAttribution={author:string;filePage:string;license:string;licenseUrl:string;changes:LocalizedCopy}
type RegionScene={src:string;position:string;tone:'deep'|'soft'|'cool'|'warm';caption:LocalizedCopy;attribution?:PhotoAttribution}
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

const webImageChanges:LocalizedCopy={
  en:'Optimized web JPEG; the layout may crop it.',
  de:'Fürs Web optimiertes JPEG; die Ansicht kann es zuschneiden.',
  fr:'JPEG optimisé pour le web ; le cadrage peut être recoupé à l’affichage.',
  es:'JPEG optimizado para web; la vista puede recortarlo.',
}

// Explicitly reviewed Commons photographs. Specific generated region images
// still win below, and all existing scene/fallback assignments remain intact.
const verifiedRegionPhotos:Record<string,RegionScene>={
  franken:{src:frankenHallburg,position:'50% center',tone:'warm',caption:{en:'Vineyards beside Hallburg Castle in Lower Franconia',de:'Weinberge bei Schloss Hallburg in Unterfranken',fr:'Vignobles près du château de Hallburg, en Basse-Franconie',es:'Viñedos junto al castillo de Hallburg, en Baja Franconia'},attribution:{author:'Reinhold Möller',filePage:'https://commons.wikimedia.org/wiki/File:Volkach_Hallburg_Weinberg_200734.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  pfalz:{src:pfalzKallstadt,position:'50% center',tone:'warm',caption:{en:'Vineyard in Kallstadt, Palatinate',de:'Weinberg in Kallstadt in der Pfalz',fr:'Vignoble à Kallstadt, dans le Palatinat',es:'Viñedo en Kallstadt, Palatinado'},attribution:{author:'Kmtextor',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_Kallstadt.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  patagonia:{src:patagoniaVineyard,position:'50% center',tone:'cool',caption:{en:'Vineyard landscape in Patagonia, Argentina',de:'Weinberglandschaft in Patagonien, Argentinien',fr:'Paysage viticole de Patagonie, en Argentine',es:'Paisaje de viñedos en la Patagonia argentina'},attribution:{author:'Денис Руденко',filePage:'https://commons.wikimedia.org/wiki/File:%D0%92%D0%B8%D0%BD%D0%BE%D0%B3%D1%80%D0%B0%D0%B4%D0%BD%D0%B8%D0%BA_%D0%B2_%D0%9F%D0%B0%D1%82%D0%B0%D0%B3%D0%BE%D0%BD%D0%B8%D0%B8.png',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'central-otago':{src:centralOtagoGibbston,position:'50% center',tone:'cool',caption:{en:'Vineyard in Gibbston Valley, Central Otago',de:'Weinberg im Gibbston Valley in Central Otago',fr:'Vignoble de la vallée de Gibbston, à Central Otago',es:'Viñedo del valle de Gibbston, en Central Otago'},attribution:{author:'Marek Ślusarczyk',filePage:'https://commons.wikimedia.org/wiki/File:016_Central_Otago_wine_region_-_vineyard_in_Gibbston_Valley_in_South_Island,_New_Zealand.jpg',license:'CC BY 3.0 Unported',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  swartland:{src:swartlandWineRoute,position:'50% center',tone:'warm',caption:{en:'A vineyard visit on the Swartland Wine Route',de:'Besuch eines Weinbergs an der Swartland Wine Route',fr:'Visite d’un vignoble sur la Swartland Wine Route',es:'Visita a un viñedo de la ruta vinícola de Swartland'},attribution:{author:'South African Tourism',filePage:'https://commons.wikimedia.org/wiki/File:Swartland_Wine_Route_-_West_Coast,_South_Africa_(3919461620).jpg',license:'CC BY 2.0 Generic',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  douro:{src:douroVineyards,
    position:'50% center',tone:'deep',caption:{en:'Vineyards along the Douro River in Portugal',de:'Weinberge entlang des Douro in Portugal',fr:'Vignobles le long du Douro, au Portugal',es:'Viñedos junto al río Douro, en Portugal'},
    attribution:{author:'Harshil Shah',filePage:'https://commons.wikimedia.org/wiki/File:Portugal_-_Rio_Douro_-vineyards.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  wachau:{src:wachauJoching,
    position:'50% center',tone:'warm',caption:{en:'Vineyard terraces behind Prandtauerhof in Joching, Wachau',de:'Weinterrassen hinter dem Prandtauerhof in Joching, Wachau',fr:'Terrasses viticoles derrière le Prandtauerhof à Joching, dans la Wachau',es:'Terrazas de viñedo tras Prandtauerhof, en Joching (Wachau)'},
    attribution:{author:'Jakub Hałun',filePage:'https://commons.wikimedia.org/wiki/File:Prandtauerhof,_Joching,_Lower_Austria,_20210728_1209_0691.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  barolo:{src:baroloLaMorra,
    position:'50% center',tone:'warm',caption:{en:'Vineyards around Barolo, Piedmont',de:'Weinberge rund um Barolo im Piemont',fr:'Vignobles autour de Barolo, dans le Piémont',es:'Viñedos alrededor de Barolo, en Piamonte'},
    attribution:{author:'Megan Mallen',filePage:'https://commons.wikimedia.org/wiki/File:Barolo_-_view_from_La_Morra_in_Piemonte,_Italy.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'chianti-classico':{src:chiantiAutumn,
    position:'50% center',tone:'warm',caption:{en:'Chianti Classico vineyards near Radda in Chianti in autumn',de:'Weinberge des Chianti Classico bei Radda in Chianti im Herbst',fr:'Vignobles du Chianti Classico près de Radda in Chianti, en automne',es:'Viñedos del Chianti Classico cerca de Radda in Chianti en otoño'},
    attribution:{author:'Repuli',filePage:'https://commons.wikimedia.org/wiki/File:Autunno_in_Chianti_Toscana.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  etna:{src:etnaPassopisciaro,
    position:'50% 76%',tone:'cool',caption:{en:'Vineyard beneath Mount Etna near Passopisciaro, Sicily',de:'Weinberg am Ätna bei Passopisciaro auf Sizilien',fr:'Vignoble au pied de l’Etna près de Passopisciaro, en Sicile',es:'Viñedo al pie del Etna, cerca de Passopisciaro, en Sicilia'},
    attribution:{author:'Neil Weightman',filePage:'https://commons.wikimedia.org/wiki/File:Etna_Wine,_Passopisciaro,_Sicily,_Italy.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  santorini:{src:santoriniVineyard,
    position:'50% center',tone:'cool',caption:{en:'Santorini bush vines with the Aegean Sea beyond',de:'Korbförmig erzogene Reben auf Santorin vor der Ägäis',fr:'Vignes basses de Santorin avec la mer Égée en arrière-plan',es:'Vides bajas de Santorini con el mar Egeo al fondo'},
    attribution:{author:'Joye~',filePage:'https://commons.wikimedia.org/wiki/File:Santorini_vineyard.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'priorat-montsant':{src:prioratErmita,
    position:'50% center',tone:'warm',caption:{en:'Vineyard on the l’Ermita slope near Gratallops, Priorat',de:'Weinberg am Hang von l’Ermita bei Gratallops im Priorat',fr:'Vignoble du coteau de l’Ermita près de Gratallops, dans le Priorat',es:'Viñedo en la ladera de l’Ermita cerca de Gratallops, Priorat'},
    attribution:{author:'Angela Llop',filePage:'https://commons.wikimedia.org/wiki/File:Vinyes_del_Priorat,_l%27Ermita,_Gratallops.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'rias-baixas':{src:riasBaixasCastrelo,
    position:'50% center',tone:'cool',caption:{en:'Albariño vineyards near Castrelo, Cambados, Rías Baixas',de:'Albariño-Weinberge bei Castrelo, Cambados, in Rías Baixas',fr:'Vignobles d’albariño près de Castrelo, à Cambados, en Rías Baixas',es:'Viñedos de albariño cerca de Castrelo, Cambados, en Rías Baixas'},
    attribution:{author:'Re Fresh Vigo',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_de_albari%C3%B1o_en_la_parroquia_de_Santa_Cruz_de_Castrelo_(Cambados).jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  penedes:{src:penedesAvinyonet,
    position:'50% center',tone:'warm',caption:{en:'Vineyard landscape near Avinyonet, Penedès, Catalonia',de:'Weinberglandschaft bei Avinyonet im Penedès, Katalonien',fr:'Paysage viticole près d’Avinyonet, dans le Penedès catalan',es:'Paisaje de viñedos cerca de Avinyonet, en el Penedès catalán'},
    attribution:{author:'Angela Llop',filePage:'https://commons.wikimedia.org/wiki/File:Paisatge_del_Penedes,_Avinyonet.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  mosel:{src:moselVineyards,
    position:'50% center',tone:'cool',caption:{en:'Vineyards beside the Mosel River in Germany',de:'Weinberge an der Mosel in Deutschland',fr:'Vignobles le long de la Moselle, en Allemagne',es:'Viñedos junto al río Mosela, en Alemania'},
    attribution:{author:'Peulle',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_by_the_Mosel_jun_2018_(1).jpg',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/deed.en',changes:webImageChanges}},
  'barossa-valley':{src:barossaMenglerHill,
    position:'50% center',tone:'warm',caption:{en:'Barossa Valley vineyards near Tanunda, seen from Mengler Hill',de:'Weinberge im Barossa Valley bei Tanunda, vom Mengler Hill aus gesehen',fr:'Vignobles de la Barossa Valley près de Tanunda, vus depuis Mengler Hill',es:'Viñedos de Barossa Valley cerca de Tanunda, vistos desde Mengler Hill'},
    attribution:{author:'DXR',filePage:'https://commons.wikimedia.org/wiki/File:View_of_Barossa_Valley_from_Mengler_Hill_20230207-3.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'margaret-river':{src:margaretRiverWatershed,
    position:'50% center',tone:'cool',caption:{en:'Watershed vineyard in Margaret River, Western Australia',de:'Weinberg Watershed in Margaret River, Westaustralien',fr:'Vignoble de Watershed à Margaret River, en Australie-Occidentale',es:'Viñedo Watershed en Margaret River, Australia Occidental'},
    attribution:{author:'Lasthib',filePage:'https://commons.wikimedia.org/wiki/File:2016_Margaret_River_Australia._Watershed_vineyard.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  marlborough:{src:marlboroughWairauPhoto,
    position:'50% center',tone:'cool',caption:{en:'Wairau Valley vineyards with the Wither Hills beyond, Marlborough',de:'Weinberge im Wairau Valley mit den Wither Hills im Hintergrund, Marlborough',fr:'Vignobles de la vallée de Wairau, avec les Wither Hills en arrière-plan, à Marlborough',es:'Viñedos del valle de Wairau, con las colinas Wither al fondo, en Marlborough'},
    attribution:{author:'Jonathan Harker',filePage:'https://commons.wikimedia.org/wiki/File:Wairau_Valley_vineyards_in_Marlborough,_New_Zealand.jpg',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:webImageChanges}},
  coonawarra:{src:coonawarraRows,
    position:'50% center',tone:'warm',caption:{en:'Rows of vines west of Coonawarra township, South Australia',de:'Rebenreihen westlich der Ortschaft Coonawarra in Südaustralien',fr:'Rangs de vignes à l’ouest de Coonawarra, en Australie-Méridionale',es:'Hileras de viñas al oeste de Coonawarra, en Australia Meridional'},
    attribution:{author:'ScottDavis',filePage:'https://commons.wikimedia.org/wiki/File:Vines_near_Coonawarra.JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  tasmania:{src:tasmaniaGhostRock,
    position:'50% center',tone:'warm',caption:{en:'Autumn foliage at Ghost Rock Vineyard, Port Sorell, Tasmania',de:'Herbstlaub im Weinberg Ghost Rock bei Port Sorell auf Tasmanien',fr:'Couleurs d’automne au vignoble Ghost Rock, à Port Sorell en Tasmanie',es:'Colores otoñales en el viñedo Ghost Rock, Port Sorell, Tasmania'},
    attribution:{author:'Steven Penton',filePage:'https://commons.wikimedia.org/wiki/File:Ghost_Rock_Vineyard_(51168369875).jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  constantia:{src:constantiaBeauConstantia,
    position:'50% center',tone:'warm',caption:{en:'Vineyard rows at Beau Constantia, Cape Town, with the Vlakkenberg range behind',de:'Rebenreihen bei Beau Constantia in Kapstadt, mit dem Vlakkenberg-Gebirge im Hintergrund',fr:'Rangs de vignes à Beau Constantia, au Cap, avec le massif du Vlakkenberg en arrière-plan',es:'Hileras de viñas en Beau Constantia, Ciudad del Cabo, con la sierra de Vlakkenberg al fondo'},
    attribution:{author:'Beau Constantia wine estate',filePage:'https://commons.wikimedia.org/wiki/File:Beau_Constantia_wine_estate_aerial_view_Constantia_Cape_Town.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  tokaj:{src:tokajVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyard near Tokaj, Hungary',de:'Weinberg bei Tokaj in Ungarn',fr:'Vignoble près de Tokaj, en Hongrie',es:'Viñedo cerca de Tokaj, Hungría'},
    attribution:{author:'Pudelek',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_near_Tokaj,_Hungary.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  brda:{src:brdaVineyards,
    position:'50% center',tone:'warm',caption:{en:'Vineyards around Goriška Brda, Slovenia',de:'Weinberge rund um Goriška Brda in Slowenien',fr:'Vignobles autour de Goriška Brda, en Slovénie',es:'Viñedos alrededor de Goriška Brda, en Eslovenia'},
    attribution:{author:'neiljs',filePage:'https://commons.wikimedia.org/wiki/File:Gori%C5%A1ka_Brda,_Slovenia_vineyards.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  istria:{src:istriaVineyards,
    position:'50% center',tone:'warm',caption:{en:'Vineyards of Istria, Croatia, at sunset',de:'Weinberge in Istrien, Kroatien, bei Sonnenuntergang',fr:'Vignobles d’Istrie, en Croatie, au coucher du soleil',es:'Viñedos de Istria, Croacia, al atardecer'},
    attribution:{author:'Petar Milošević',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_of_Istria_(Croatia).jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'finger-lakes':{src:fingerLakesSunrise,
    position:'50% center',tone:'cool',caption:{en:'Sunrise above a vineyard near South Bristol, Finger Lakes, New York',de:'Sonnenaufgang über einem Weinberg bei South Bristol in den Finger Lakes, New York',fr:'Lever de soleil sur un vignoble près de South Bristol, dans les Finger Lakes, État de New York',es:'Amanecer sobre un viñedo cerca de South Bristol, en Finger Lakes, Nueva York'},
    attribution:{author:'Visit Finger Lakes',filePage:'https://commons.wikimedia.org/wiki/File:Sunrise_overlooking_a_vineyard_in_the_Finger_Lakes.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'sonoma-county':{src:sonomaBedrock,
    position:'50% center',tone:'warm',caption:{en:'Autumn color in Bedrock Vineyard, Sonoma Valley, California',de:'Herbstfarben im Bedrock Vineyard im Sonoma Valley, Kalifornien',fr:'Couleurs d’automne au vignoble Bedrock, dans la Sonoma Valley en Californie',es:'Colores otoñales en el viñedo Bedrock, en Sonoma Valley, California'},
    attribution:{author:'Treephoto',filePage:'https://commons.wikimedia.org/wiki/File:Bedrock_Vineyard_in_Sonoma_Valley_California.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'willamette-valley':{src:willametteNysa,
    position:'50% center',tone:'warm',caption:{en:'Nysa Vineyard in Oregon’s Willamette Valley',de:'Nysa Vineyard im Willamette Valley in Oregon',fr:'Vignoble Nysa, dans la Willamette Valley en Oregon',es:'Viñedo Nysa, en Willamette Valley, Oregón'},
    attribution:{author:'Treephoto',filePage:'https://commons.wikimedia.org/wiki/File:Nysa_Vineyard_Planted_1989.jpg',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/deed.en',changes:webImageChanges}},
  'okanagan-valley':{src:okanaganOsoyoos,
    position:'50% center',tone:'cool',caption:{en:'Vineyards and Lake Osoyoos in British Columbia’s Okanagan Valley',de:'Weinberge und der Osoyoos-See im Okanagan Valley in British Columbia',fr:'Vignobles et lac Osoyoos, dans la vallée de l’Okanagan en Colombie-Britannique',es:'Viñedos y lago Osoyoos, en el valle de Okanagan, Columbia Británica'},
    attribution:{author:'McKay Savage',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_and_Lake-_Osoyoos_in_the_Okanagan_Valley.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'uco-valley':{src:ucoLosArboles,
    position:'50% center',tone:'cool',caption:{en:'Vineyard near Los Árboles in the Uco Valley, with the Andes beyond',de:'Weinberg bei Los Árboles im Uco-Tal, dahinter die Anden',fr:'Vignoble près de Los Árboles, dans la vallée de l’Uco, avec les Andes en arrière-plan',es:'Viñedo cerca de Los Árboles, en el Valle de Uco, con los Andes al fondo'},
    attribution:{author:'David',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_in_Mendoza,_Argentina.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  colchagua:{src:colchaguaAngostura,
    position:'50% center',tone:'warm',caption:{en:'Angostura Vineyard in Colchagua Valley, Chile',de:'Weinberg Angostura im Colchagua-Tal in Chile',fr:'Vignoble d’Angostura, dans la vallée de Colchagua au Chili',es:'Viñedo Angostura, en el valle de Colchagua, Chile'},
    attribution:{author:'Psommaruga',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1a_Casa_Silva_-_Vi%C3%B1edo_Angostura_Vineyard.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'valle-de-guadalupe':{src:guadalupeVineyards,
    position:'50% center',tone:'warm',caption:{en:'Vineyards in Valle de Guadalupe, Baja California',de:'Weinberge im Valle de Guadalupe in Baja California',fr:'Vignobles de la vallée de Guadalupe, en Basse-Californie',es:'Viñedos en el Valle de Guadalupe, Baja California'},
    attribution:{author:'JeanLLantas50',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_Valle_de_Guadalupe_B.C.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  canelones:{src:canelonesVineyard,
    position:'50% 72%',tone:'warm',caption:{en:'Vineyard at Canelón Chico, Canelones Department, Uruguay',de:'Weinberg in Canelón Chico im Departamento Canelones, Uruguay',fr:'Vignoble à Canelón Chico, dans le département de Canelones en Uruguay',es:'Viñedo en Canelón Chico, departamento de Canelones, Uruguay'},
    attribution:{author:'María del Carmen Fourment',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edo_de_Canel%C3%B3n_Chico.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  paarl:{src:paarlVineyard,
    position:'50% center',tone:'warm',caption:{en:'Autumn vines at Paarl, in South Africa’s Cape Winelands',de:'Herbstliche Reben in Paarl in den Cape Winelands Südafrikas',fr:'Vignes d’automne à Paarl, dans les Cape Winelands sud-africains',es:'Viñas otoñales en Paarl, en las Cape Winelands de Sudáfrica'},
    attribution:{author:'Harvey Barrison',filePage:'https://commons.wikimedia.org/wiki/File:Paarl_vineyard-001.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  nashik:{src:nashikVineyards,
    position:'50% center',tone:'warm',caption:{en:'Estate vineyards at Sula, Nashik, India',de:'Weinberge des Weinguts Sula in Nashik, Indien',fr:'Vignobles du domaine Sula, à Nashik en Inde',es:'Viñedos de la finca Sula, en Nashik, India'},
    attribution:{author:'Wikieditor11221',filePage:'https://commons.wikimedia.org/wiki/File:Sula%E2%80%99s_estate_vineyards_in_Nashik.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'bekaa-valley':{src:bekaaVineyards,
    position:'50% center',tone:'cool',caption:{en:'Vineyard rows at Château Barka beneath the Bekaa Valley mountains, Lebanon',de:'Rebenreihen am Château Barka vor der Gebirgskulisse des Bekaa-Tals im Libanon',fr:'Rangs de vignes du château Barka sous les montagnes de la vallée de la Bekaa, au Liban',es:'Hileras de viñas del Château Barka bajo las montañas del valle de Bekaa, Líbano'},
    attribution:{author:'HebaAkasheh',filePage:'https://commons.wikimedia.org/wiki/File:Chateau_Barka_Vineyards.png',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  nahe:{src:naheLemberg,
    position:'50% center',tone:'cool',caption:{en:'Oberhausen and vineyards along the Nahe, viewed from Lemberg',de:'Oberhausen und Weinberge an der Nahe, vom Lemberg aus gesehen',fr:'Oberhausen et les vignobles de la Nahe, vus depuis le Lemberg',es:'Oberhausen y viñedos del Nahe, vistos desde Lemberg'},
    attribution:{author:'Jacquesverlaeken',filePage:'https://commons.wikimedia.org/wiki/File:Oberhausen_Nahe_fromLemberg_20405_01.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  alsace:{src:alsaceRiquewihr,
    position:'50% center',tone:'warm',caption:{en:'Vineyard north of Riquewihr, Alsace',de:'Weinberg nördlich von Riquewihr im Elsass',fr:'Vignoble au nord de Riquewihr, en Alsace',es:'Viñedo al norte de Riquewihr, en Alsacia'},
    attribution:{author:'Flocci Nivis',filePage:'https://commons.wikimedia.org/wiki/File:20241004_Vineyard_Riquewihr.jpg',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:webImageChanges}},
  maule:{src:mauleSauzal,
    position:'50% center',tone:'warm',caption:{en:'Grower Nivaldo Morales among old-vine rows in Sauzal, Maule Valley, Chile',de:'Winzer Nivaldo Morales zwischen alten Reben in Sauzal im Maule-Tal, Chile',fr:'Le vigneron Nivaldo Morales parmi de vieilles vignes à Sauzal, dans la vallée du Maule au Chili',es:'El viticultor Nivaldo Morales entre hileras de viñas viejas en Sauzal, valle del Maule, Chile'},
    attribution:{author:'Alder Yarrow',filePage:'https://commons.wikimedia.org/wiki/File:Sauzal_vineyard_ancient_vines_and_grower_Nivaldo_Morales.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'hawke-s-bay':{src:hawkesBayAutumn,
    position:'50% center',tone:'warm',caption:{en:'Vineyard in Hawke’s Bay, New Zealand, in autumn',de:'Weinberg in Hawke’s Bay, Neuseeland, im Herbst',fr:'Vignoble de Hawke’s Bay, en Nouvelle-Zélande, en automne',es:'Viñedo de Hawke’s Bay, Nueva Zelanda, en otoño'},
    attribution:{author:'HuttyMcphoo',filePage:'https://commons.wikimedia.org/wiki/File:HB_Vineyard_autumn.JPG',license:'CC BY-SA 2.5',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.5/',changes:webImageChanges}},
  martinborough:{src:martinboroughVines,
    position:'50% center',tone:'warm',caption:{en:'Vineyards in Martinborough, New Zealand, in late autumn',de:'Weinberge in Martinborough, Neuseeland, im Spätherbst',fr:'Vignobles de Martinborough, en Nouvelle-Zélande, à la fin de l’automne',es:'Viñedos de Martinborough, Nueva Zelanda, al final del otoño'},
    attribution:{author:'jonathanischoice',filePage:'https://commons.wikimedia.org/wiki/File:IMG9408_Martinborough_vineyards,_New_Zealand.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  chablis:{src:chablisSlopes,
    position:'50% center',tone:'cool',caption:{en:'Vineyard slopes in Chablis, Burgundy',de:'Weinberghänge in Chablis im Burgund',fr:'Coteaux viticoles de Chablis, en Bourgogne',es:'Laderas de viñedos de Chablis, en Borgoña'},
    attribution:{author:'Olivier Letourneux',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_in_Chablis.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  bourgogne:{src:coteDeBeauneMontrevenaux,
    position:'50% center',tone:'warm',caption:{en:'Montrevenaux vineyard near Beaune, Hautes-Côtes de Beaune',de:'Weinberg Montrevenaux bei Beaune in den Hautes-Côtes de Beaune',fr:'Vignoble de Montrevenaux près de Beaune, dans les Hautes-Côtes de Beaune',es:'Viñedo de Montrevenaux cerca de Beaune, en Hautes-Côtes de Beaune'},
    attribution:{author:'Pierre André',filePage:'https://commons.wikimedia.org/wiki/File:Beaune.-_les_vignobles_de_la_c%C3%B4te_de_Beaune_(29).JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  rheinhessen:{src:rheinhessenHillesheim,
    position:'50% center',tone:'warm',caption:{en:'Fields and vineyards near Hillesheim, Rheinhessen, toward the Odenwald',de:'Felder und Weinberge bei Hillesheim in Rheinhessen mit Blick zum Odenwald',fr:'Champs et vignobles près de Hillesheim, en Hesse rhénane, vers l’Odenwald',es:'Campos y viñedos cerca de Hillesheim, Rheinhessen, hacia Odenwald'},
    attribution:{author:'Gerda Arendt',filePage:'https://commons.wikimedia.org/wiki/File:Fields_and_vineyards_near_Hillesheim,_Rheinhessen.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  yamanashi:{src:yamanashiKatsunuma,
    position:'50% center',tone:'warm',caption:{en:'Koshu grapes beneath pergola-trained vines in Katsunuma, Yamanashi, Japan',de:'Koshu-Trauben unter Pergolareben in Katsunuma, Yamanashi, Japan',fr:'Raisins Koshu sous des vignes en pergola à Katsunuma, dans la préfecture de Yamanashi, au Japon',es:'Uvas Koshu bajo vides en pérgola en Katsunuma, Yamanashi, Japón'},
    attribution:{author:'genta_hgr',filePage:'https://commons.wikimedia.org/wiki/File:Katsunuma_vineyard_02.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  barbaresco:{src:barbarescoHills,
    position:'50% 72%',tone:'warm',caption:{en:'Vineyard hills around Barbaresco, Cuneo, Piedmont, in late autumn',de:'Weinberghänge um Barbaresco in Cuneo im Piemont, im Spätherbst',fr:'Coteaux viticoles autour de Barbaresco, à Cuneo dans le Piémont, à la fin de l’automne',es:'Colinas de viñedos alrededor de Barbaresco, Cuneo, Piamonte, a finales de otoño'},
    attribution:{author:'Giorgio Galeotti',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_-_Barbaresco,_Cuneo,_Italy_-_November_2,_2021.jpg',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:webImageChanges}},
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
  const photo=verifiedRegionPhotos[regionId]
  const heroScene=generated?{
    src:generated.src,
    position:'50% center',
    tone:'warm' as const,
    caption:generated.caption??scenes.terraces.caption,
  }:photo?photo:key?scenes[key]:(pool[fallback.rank%pool.length]??scenes.terraces)
  return {
    hero:{...heroScene,decorativeFallback:!key&&!generated&&!photo} as RegionHero,
    portrait:portraits[regionId],
  }
}
