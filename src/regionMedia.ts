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
import ahrVineyards from './assets/licensed-regions/ahr-vineyard-valley.jpg'
import badenSasbach from './assets/licensed-regions/baden-sasbach-vineyard.jpg'
import rheingauPanorama from './assets/licensed-regions/rheingau-johannisberg-panorama.jpg'
import mittelrheinBacharach from './assets/licensed-regions/mittelrhein-bacharach-stahleck.jpg'
import lujanChakana from './assets/licensed-regions/lujan-de-cuyo-chakana.jpg'
import mendozaMaipuCycling from './assets/licensed-regions/mendoza-maipu-cycling-vineyards.jpg'
import maipuFrayLuisBeltran from './assets/licensed-regions/maipu-fray-luis-beltran.jpg'
import riojaAlavesaElvillar from './assets/licensed-regions/rioja-alavesa-elvillar.jpg'
import wurttembergUhlbach from './assets/licensed-regions/wurttemberg-stuttgart-uhlbach.jpg'
import sachsenRadebeul from './assets/licensed-regions/sachsen-radebeul-vineyards.jpg'
import northernRhoneCoteRotie from './assets/licensed-regions/northern-rhone-cote-rotie.jpg'
import southernRhoneChateauneuf from './assets/licensed-regions/southern-rhone-chateauneuf.jpg'
import centreLoireSancerre from './assets/licensed-regions/centre-loire-sancerre.jpg'
import touraineRochecorbon from './assets/licensed-regions/touraine-rochecorbon.jpg'
import beaujolaisVineyards from './assets/licensed-regions/beaujolais-vineyards.jpg'
import riojaGrowingSeason from './assets/licensed-regions/rioja-growing-season.jpg'
import riberaDueroVinaSastre from './assets/licensed-regions/ribera-del-duero-vina-sastre.jpg'
import vinhoVerdeMinho from './assets/licensed-regions/vinho-verde-minho-vineyards.jpg'
import robertsonVineyardLineage from './assets/licensed-regions/robertson-vineyard-lineage.jpg'
import hunterValleyVineyard from './assets/licensed-regions/hunter-valley-vineyard.jpg'
import clareValleyStanleyFlat from './assets/licensed-regions/clare-valley-stanley-flat.jpg'
import yarraValleyRochford from './assets/licensed-regions/yarra-valley-rochford.jpg'
import edenValleyLookout from './assets/licensed-regions/eden-valley-lookout.jpg'
import languedocPicVissou from './assets/licensed-regions/languedoc-pic-vissou.jpg'
import medocHautMedoc from './assets/licensed-regions/medoc-haut-medoc.jpg'
import pauillacVineyard from './assets/licensed-regions/pauillac-vineyard.jpg'
import saintEmilionVineyards from './assets/licensed-regions/saint-emilion-vineyards.jpg'
import juraArboisVineyards from './assets/licensed-regions/jura-arbois-vineyards.jpg'
import niagaraPeninsulaVineyard from './assets/licensed-regions/niagara-peninsula-vineyard.jpg'
import jumillaFincaCq from './assets/licensed-regions/jumilla-finca-cq-vineyards.jpg'
import valpolicellaTerraces from './assets/licensed-regions/valpolicella-terraced-vineyards.jpg'
import montalcinoVineyard from './assets/licensed-regions/montalcino-vineyard-panorama.jpg'
import alentejoEstremoz from './assets/licensed-regions/alentejo-estremoz-vineyard.jpg'
import saaleUnstrutRossbach from './assets/licensed-regions/saale-unstrut-rossbach.jpg'
import muscadetPaysNantais from './assets/licensed-regions/muscadet-pays-nantais.jpg'
import setubalArrabida from './assets/licensed-regions/setubal-arrabida-vineyards.jpg'
import navarraCintruenigo from './assets/licensed-regions/navarra-cintruenigo-vineyards.jpg'
import savoieApremontGranier from './assets/licensed-regions/savoie-apremont-granier.jpg'
import sussexBolney from './assets/licensed-regions/sussex-bolney-vineyard.jpg'
import kakhetiZegaani from './assets/licensed-regions/kakheti-zegaani-vineyards.jpg'
import pomerolGazinVineyard from './assets/licensed-regions/pomerol-gazin-vineyard.jpg'
import montagneReimsNorthSlope from './assets/licensed-regions/montagne-reims-north-slope.jpg'
import valleeMarneCourcelles from './assets/licensed-regions/vallee-marne-courcelles.jpg'
import yquemSauternesVineyards from './assets/licensed-regions/graves-sauternes-yquem-vineyards.jpg'
import coteNuitsVosneRomanee from './assets/licensed-regions/cote-de-nuits-vosne-romanee.jpg'
import coteBeauneVineyard from './assets/licensed-regions/cote-de-beaune-vineyard.jpg'
import margauxChateauVineyard from './assets/licensed-regions/margaux-chateau-vineyard.jpg'
import cahorsLotVineyards from './assets/licensed-regions/cahors-lot-vineyards.jpg'
import coteDesBlancsVineyards from './assets/licensed-regions/cote-des-blancs-vineyards.jpg'
import saumurVineyardAerial from './assets/licensed-regions/anjou-saumur-vineyards.jpg'
import bergeracVignoble from './assets/licensed-regions/bergerac-vignoble.jpg'
import piemonteVineyards from './assets/licensed-regions/piemonte-vineyards.jpg'
import pasoRoblesVineyard from './assets/licensed-regions/paso-robles-vineyard.jpg'
import wairauValleyVineyards from './assets/licensed-regions/wairau-valley-vineyards.jpg'
import awatereValleyAutumn from './assets/licensed-regions/awatere-valley-autumn.jpg'
import northCanterburyWaipara from './assets/licensed-regions/north-canterbury-waipara-valley.jpg'
import calchaquiCafayateVineyard from './assets/licensed-regions/calchaqui-cafayate-vineyard.jpg'
import sanJuanPedernalVineyards from './assets/licensed-regions/san-juan-pedernal-vineyards.jpg'
import maipoHarasDePirque from './assets/licensed-regions/maipo-haras-de-pirque.jpg'
import toscanaVinesCypress from './assets/licensed-regions/toscana-grape-vines-cypress.jpg'
import wallaWallaCayuse from './assets/licensed-regions/walla-walla-cayuse-vineyards.jpg'
import lodiBechtholdCinsaut from './assets/licensed-regions/lodi-bechthold-cinsaut.jpg'
import sierraFoothillsElDorado from './assets/licensed-regions/sierra-foothills-el-dorado-vineyard.jpg'
import astiMonferratoVineyard from './assets/licensed-regions/asti-monferrato-vineyard.jpg'
import santaBarbaraCountyVineyards from './assets/licensed-regions/santa-barbara-county-vineyards.jpg'
import yakimaSagelandsVineyard from './assets/licensed-regions/yakima-sagelands-vineyard.jpg'
import montepulcianoVineyard from './assets/licensed-regions/montepulciano-vineyard.jpg'
import soavePanorama from './assets/licensed-regions/soave-panorama.jpg'
import coneglianoValdobbiadeneVineyard from './assets/licensed-regions/conegliano-valdobbiadene-santo-stefano.jpg'
import bolgheriDocVineyard from './assets/licensed-regions/bolgheri-doc-vineyard.jpg'
import franciacortaMontina from './assets/licensed-regions/franciacorta-montina-provezze.jpg'
import trentinoAltoAdigeValdadige from './assets/licensed-regions/trentino-alto-adige-valdadige.jpg'
import collioCormons from './assets/licensed-regions/collio-cormons-vineyards.jpg'
import colliOrientaliRoccaBernarda from './assets/licensed-regions/colli-orientali-rocca-bernarda.jpg'
import texasHillCountryJohnsonCity from './assets/licensed-regions/texas-hill-country-johnson-city.jpg'
import redMountainKiona from './assets/licensed-regions/red-mountain-kiona-vineyard.jpg'
import columbiaValleyAncientLakes from './assets/licensed-regions/columbia-valley-ancient-lakes.jpg'
import oakvilleOpusOne from './assets/licensed-regions/oakville-opus-one-vineyard.jpg'
import valtellinaAlpineVineyards from './assets/licensed-regions/valtellina-alpine-vineyards.jpg'
import emiliaRomagnaFattoriaParadiso from './assets/licensed-regions/emilia-romagna-fattoria-paradiso.jpg'
import marcheCupramontana from './assets/licensed-regions/marche-cupramontana-verdicchio.jpg'
import abruzzoControguerra from './assets/licensed-regions/abruzzo-controguerra-vineyard.jpg'
import campaniaCavalierPepe from './assets/licensed-regions/campania-cavalier-pepe-vineyard.jpg'
import pugliaCastellaneta from './assets/licensed-regions/puglia-castellaneta-vineyard.jpg'
import ruedaMartinsancho from './assets/licensed-regions/rueda-martinsancho.jpg'
import bierzoVineyards from './assets/licensed-regions/bierzo-vineyards-el-bierzo.jpg'
import txakoliGetaria from './assets/licensed-regions/txakoli-getaria-vineyards.jpg'
import mclarenValeVineyard from './assets/licensed-regions/mclaren-vale-vines-hills.jpg'
import morningtonPeninsulaVineyard from './assets/licensed-regions/mornington-peninsula-vineyard.jpg'
import princeEdwardCountyVineyard from './assets/licensed-regions/prince-edward-county-vineyard.jpg'
import casablancaBodegasRe from './assets/licensed-regions/casablanca-bodegas-re.jpg'
import valeDosVinhedosVineyard from './assets/licensed-regions/vale-dos-vinhedos-plantacoes.jpg'
import leydaSanAntonioVineyard from './assets/licensed-regions/leyda-vina-en-leyda.jpg'
import hokkaidoFuranoVineyard from './assets/licensed-regions/hokkaido-furano-vineyard.jpg'
import vayotsDzorRindVineyard from './assets/licensed-regions/vayots-dzor-rind-vineyard.jpg'
import naganoAzuminoWinery from './assets/licensed-regions/nagano-azumino-winery.jpg'
import kamptalHeiligenstein from './assets/licensed-regions/kamptal-heiligenstein.jpg'
import wagramKirchbergTerrace from './assets/licensed-regions/wagram-kirchberg-terrace.jpg'
import weinviertelVineyards from './assets/licensed-regions/weinviertel-gross-schweinbarth.jpg'
import villanyVineyards from './assets/licensed-regions/villany-grape-plantations.jpg'
import egerVineyard from './assets/licensed-regions/eger-vineyard.jpg'
import nemeaVineyardsOlives from './assets/licensed-regions/nemea-vineyards-olives.jpg'
import vouvrayVineyard from './assets/licensed-regions/vouvray-after-budbreak.jpg'
import provenceVineyard from './assets/licensed-regions/aix-en-provence-vineyard.jpg'
import hessischeBergstrasseVineyard from './assets/licensed-regions/hessische-bergstrasse-heppenheim.jpg'
import valaisVineyard from './assets/licensed-regions/valais-chamoson-vineyard.jpg'
import graubundenVineyard from './assets/licensed-regions/graubunden-maienfeld-vineyard.jpg'
import vaudLavauxVineyard from './assets/licensed-regions/vaud-lavaux-vineyards.jpg'
import sardegnaSpiaggiaGrande from './assets/licensed-regions/sardegna-spiaggia-grande.jpg'
import corsicaAghioneVineyards from './assets/licensed-regions/corsica-aghione-vineyards.jpg'
import rogueValleyLandscape from './assets/licensed-regions/rogue-valley-landscape.jpg'
import madiranCastelnauVineyards from './assets/licensed-regions/madiran-castelnau-vineyards.jpg'
import coteChalonnaiseGivry from './assets/licensed-regions/cote-chalonnaise-givry-vines.jpg'
import maconnaisRocheSolutre from './assets/licensed-regions/maconnais-roche-solutre-vineyards.jpg'
import juranconVineyards from './assets/licensed-regions/jurancon-vineyards.jpg'
import coteDesBarSpoyVineyard from './assets/licensed-regions/cote-des-bar-spoy-vineyard.jpg'
import aconcaguaLosAndesValley from './assets/licensed-regions/aconcagua-los-andes-valley.jpg'
import venetoSandroBrunoVineyards from './assets/licensed-regions/veneto-sandro-bruno-vineyards.jpg'
import hemelEnAardeBabylonTower from './assets/licensed-regions/hemel-en-aarde-babylon-tower.jpg'
import annapolisLuckettVineyards from './assets/licensed-regions/annapolis-luckett-vineyards.jpg'
import genevaRussinVineyard from './assets/licensed-regions/geneva-russin-vineyard.jpg'
import ticinoBellinzonaVineyards from './assets/licensed-regions/ticino-bellinzona-vineyards.jpg'
import threeLakesTwannVineyards from './assets/licensed-regions/three-lakes-twann-vineyards.jpg'
import campanhaAlegreteLandscape from './assets/licensed-regions/campanha-alegrete-landscape.jpg'
import kentEcclesVineyard from './assets/licensed-regions/kent-eccles-vineyard.jpg'
import krasNanosVineyards from './assets/licensed-regions/kras-nanos-vineyards.jpg'
import vipavaValleyVineyards from './assets/licensed-regions/vipava-valley-vineyards.jpg'
import rachaCaucasusLandscape from './assets/licensed-regions/racha-caucasus-landscape.jpg'
import kartliMtkvariValley from './assets/licensed-regions/kartli-mtkvari-valley.jpg'
import ningxiaHelanBaisikou from './assets/licensed-regions/ningxia-helan-baisikou.jpg'
import thraceTekirdagPark from './assets/licensed-regions/thrace-tekirdag-kartaltepe.jpg'
import shandongYantaiShorefront from './assets/licensed-regions/shandong-yantai-shorefront.jpg'
import cappadociaRoseValley from './assets/licensed-regions/cappadocia-rose-valley-panorama.jpg'
import troodosRedObservatory from './assets/licensed-regions/troodos-red-observatory.jpg'
import aegeanSirinceVillage from './assets/licensed-regions/aegean-sirince-village.jpg'
import posavjeBizeljskoLandscape from './assets/licensed-regions/posavje-bizeljsko-landscape.jpg'
import imeretiKutaisiVineyard from './assets/licensed-regions/imereti-kutaisi-vineyard.jpg'
import mantiniaMantineiaPlateau from './assets/licensed-regions/mantinia-mantineia-plateau.jpg'
import naoussaVermioMountain from './assets/licensed-regions/naoussa-vermiomountain.jpg'
import riveraLunarejoLandscape from './assets/licensed-regions/rivera-lunarejo-landscape.jpg'
import maldonadoLasFloresCoast from './assets/licensed-regions/maldonado-las-flores-coast.jpg'
import gisbornePovertyBay from './assets/licensed-regions/gisborne-poverty-bay.jpg'
import nelsonRichmondView from './assets/licensed-regions/nelson-richmond-view.jpg'
import umpquaRoseburgRiver from './assets/licensed-regions/umpqua-roseburg-river.jpg'
import itataNipasRiver from './assets/licensed-regions/itata-nipas-river.jpg'
import nandiHillsSunrise from './assets/licensed-regions/nandi-hills-sunrise.jpg'
import somloHillVineyards from './assets/licensed-regions/somlo-hill-vineyards.jpg'
import creteLakeKournas from './assets/licensed-regions/crete-lake-kournas.jpg'
import batrounBejdarfelOliveOrchards from './assets/licensed-regions/batroun-bejdarfel-olive-orchards.jpg'
import judeanHillsMataVineyard from './assets/licensed-regions/judean-hills-mata-vineyard.jpg'
import podravjeHrastjeVineyard from './assets/licensed-regions/podravje-hrastje-vineyard.jpg'
import dalmatiaPeljesacVineyard from './assets/licensed-regions/dalmatia-peljesac-vineyard.jpg'
import slavoniaKutjevoAbbey from './assets/licensed-regions/slavonia-kutjevo-abbey.jpg'
import monticelloNortheastVineyard from './assets/licensed-regions/monticello-northeast-vineyard.jpg'
import styriaStStefanVineyard from './assets/licensed-regions/styria-st-stefan-vineyard.jpg'
import aragatsotnMountAragats from './assets/licensed-regions/aragatsotn-mount-aragats.jpg'
import jerezSolanaChicaVineyards from './assets/licensed-regions/jerez-solana-chica-vineyards.jpg'
import marsalaSaltPansSunset from './assets/licensed-regions/marsala-salt-pans-sunset.jpg'
import daoViseuWineCenter from './assets/licensed-regions/dao-viseu-wine-center.jpg'
import viennaWildgrubgasseVineyard from './assets/licensed-regions/vienna-wildgrubgasse-vineyard.jpg'
import burgenlandMoerbisch from './assets/licensed-regions/burgenland-moerbisch-neusiedlersee.jpg'
import toroDueroLookout from './assets/licensed-regions/toro-duero-lookout.jpg'
import galileeHulaGolanPanorama from './assets/licensed-regions/galilee-hula-golan-panorama.jpg'
import riojaOrientalAldeanueva from './assets/licensed-regions/rioja-oriental-aldeanueva-vineyards.jpg'
import bairradaCuriaHotel from './assets/licensed-regions/bairrada-curia-hotel-grounds.jpg'
import kremstalSenftenberg from './assets/licensed-regions/kremstal-senftenberg-imbach-view.jpg'
import plesivicaVineyards from './assets/licensed-regions/plesivica-misty-vineyards.jpg'
import lisboaTejoSantarem from './assets/licensed-regions/lisboa-tejo-santarem-view.jpg'
import vittoriaTeatroComunale from './assets/licensed-regions/vittoria-teatro-comunale-colonna.jpg'
import moselPortrait from './assets/region-portrait-mosel.jpg'
import bordeauxPortrait from './assets/region-portrait-bordeaux.jpg'
import mendozaPortrait from './assets/region-portrait-mendoza.jpg'
import marlboroughPortrait from './assets/region-portrait-marlborough.jpg'
import nemeaPortrait from './assets/region-portrait-nemea.jpg'

type LocalizedCopy=Record<Locale,string>
export type PhotoAttribution={author:string;authorUrl?:string;filePage:string;license:string;licenseUrl:string;changes:LocalizedCopy}
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
  ahr:{src:ahrVineyards,
    position:'50% center',tone:'warm',caption:{en:'Vineyard rows overlooking the Ahr Valley',de:'Weinrebenreihen mit Blick über das Ahrtal',fr:'Rangs de vignes dominant la vallée de l’Ahr',es:'Hileras de viñas con vistas al valle del Ahr'},
    attribution:{author:'1998alexkane',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_in_the_Ahr_Valley,_Germany.jpg',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',changes:webImageChanges}},
  baden:{src:badenSasbach,
    position:'50% center',tone:'warm',caption:{en:'Flowering vineyard near Sasbach, Baden-Württemberg',de:'Blühender Weinberg bei Sasbach in Baden-Württemberg',fr:'Vignoble en fleur près de Sasbach, dans le Bade-Wurtemberg',es:'Viñedo en flor cerca de Sasbach, Baden-Wurtemberg'},
    attribution:{author:'H. Zell',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_-_Sasbach_02.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  rheingau:{src:rheingauPanorama,
    position:'50% center',tone:'cool',caption:{en:'Vineyard slopes and villages across the eastern Rheingau, viewed from near Schloss Johannisberg',de:'Weinberge und Dörfer im östlichen Rheingau, nahe Schloss Johannisberg gesehen',fr:'Coteaux viticoles et villages du Rheingau oriental, vus près du château Johannisberg',es:'Laderas de viñedos y pueblos del Rheingau oriental, vistas desde cerca de Schloss Johannisberg'},
    attribution:{author:'DXR',filePage:'https://commons.wikimedia.org/wiki/File:Panoramic_view_of_eastern_Rheingau_from_Schloss_Johannisberg_20150415_1.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  mittelrhein:{src:mittelrheinBacharach,
    position:'50% center',tone:'cool',caption:{en:'Rhine valley near Bacharach, with vineyards and Stahleck Castle',de:'Rheintal bei Bacharach mit Weinbergen und Burg Stahleck',fr:'Vallée du Rhin près de Bacharach, avec des vignobles et le château de Stahleck',es:'Valle del Rin cerca de Bacharach, con viñedos y el castillo Stahleck'},
    attribution:{author:'Johannes Robalotoff',filePage:'https://commons.wikimedia.org/wiki/File:Mittelrhein-Burg-Stahleck-JR-E-1700-2017-05-27.jpg',license:'CC BY-SA 3.0 DE',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/de/',changes:webImageChanges}},
  'lujan-de-cuyo':{src:lujanChakana,
    position:'50% 82%',tone:'cool',caption:{en:'Chakana vineyard in Agrelo, Luján de Cuyo, with the Andes beyond',de:'Chakana-Weinberg in Agrelo, Luján de Cuyo, mit den Anden im Hintergrund',fr:'Vignoble de Chakana à Agrelo, dans le Luján de Cuyo, avec les Andes en arrière-plan',es:'Viñedo de Chakana en Agrelo, Luján de Cuyo, con los Andes al fondo'},
    attribution:{author:'Juan Pelizzatti',filePage:'https://commons.wikimedia.org/wiki/File:Bodega_chakana_hacia_la_monta%C3%B1a.jpg',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  mendoza:{src:mendozaMaipuCycling,
    position:'50% center',tone:'cool',caption:{en:'Cycling among vineyards in Maipú, Mendoza, with the Andes in the background',de:'Mit dem Fahrrad zwischen Weinbergen in Maipú, Mendoza, mit den Anden im Hintergrund',fr:'À vélo parmi les vignobles de Maipú, à Mendoza, avec les Andes en arrière-plan',es:'En bicicleta entre viñedos de Maipú, Mendoza, con los Andes al fondo'},
    attribution:{author:'MendozaGuide',filePage:'https://commons.wikimedia.org/wiki/File:Ciclismo_entre_vi%C3%B1edos_de_Maip%C3%BA,_Mendoza,_Argentina.png',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',changes:webImageChanges}},
  maipu:{src:maipuFrayLuisBeltran,
    position:'50% 74%',tone:'warm',caption:{en:'Vineyard near Fray Luis Beltrán, Maipú, Mendoza',de:'Weinberg bei Fray Luis Beltrán in Maipú, Mendoza',fr:'Vignoble près de Fray Luis Beltrán, à Maipú, Mendoza',es:'Viñedo cerca de Fray Luis Beltrán, en Maipú, Mendoza'},
    attribution:{author:'Djzonda',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_de_Fray_Luis_Beltr%C3%A1n.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'rioja-alavesa':{src:riojaAlavesaElvillar,
    position:'50% center',tone:'warm',caption:{en:'Autumn vines near Elvillar, Rioja Alavesa, Basque Country',de:'Herbstliche Reben bei Elvillar in der Rioja Alavesa im Baskenland',fr:'Vignes d’automne près d’Elvillar, dans la Rioja Alavesa au Pays basque',es:'Viñas otoñales cerca de Elvillar, en Rioja Alavesa, País Vasco'},
    attribution:{author:'Basotxerri',filePage:'https://commons.wikimedia.org/wiki/File:Elvillar_-_Vi%C3%B1edo_01.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  wurttemberg:{src:wurttembergUhlbach,
    position:'50% center',tone:'warm',caption:{en:'Vineyard slopes near Stuttgart-Uhlbach, viewed toward the Württemberg Mausoleum',de:'Weinberghänge bei Stuttgart-Uhlbach mit Blick zum Württemberg-Mausoleum',fr:'Coteaux viticoles près de Stuttgart-Uhlbach, en direction du mausolée de Württemberg',es:'Laderas de viñedos cerca de Stuttgart-Uhlbach, hacia el mausoleo de Württemberg'},
    attribution:{author:'Jochen Teufel',filePage:'https://commons.wikimedia.org/wiki/File:Blick_von_Uhlbach_auf_W%C3%BCrttemberg_(2009).jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  sachsen:{src:sachsenRadebeul,
    position:'50% center',tone:'cool',caption:{en:'Terraced vineyards at Radebeul-Oberlößnitz beneath the Bismarck Tower and Spitzhaus',de:'Terrassenweinberge in Radebeul-Oberlößnitz unterhalb von Bismarckturm und Spitzhaus',fr:'Vignobles en terrasses de Radebeul-Oberlößnitz, sous la tour Bismarck et le Spitzhaus',es:'Viñedos en terrazas de Radebeul-Oberlößnitz, bajo la torre Bismarck y el Spitzhaus'},
    attribution:{author:'Jörg Blobelt',filePage:'https://commons.wikimedia.org/wiki/File:20081023410DR_Radebeul-Oberl%C3%B6%C3%9Fnitz_Bismarckturm_%2B_Spitzhaus.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'northern-rhone':{src:northernRhoneCoteRotie,
    position:'50% center',tone:'cool',caption:{en:'Terraced vineyard slopes in Côte-Rôtie, northern Rhône',de:'Terrassierte Weinberghänge in Côte-Rôtie im nördlichen Rhône',fr:'Coteaux viticoles en terrasses à Côte-Rôtie, dans le Rhône septentrional',es:'Laderas de viñedos en terrazas en Côte-Rôtie, Ródano norte'},
    attribution:{author:'Karen',filePage:'https://commons.wikimedia.org/wiki/File:Terrasse_de_C%C3%B4te_R%C3%B4tie_en_hiver.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'southern-rhone':{src:southernRhoneChateauneuf,
    position:'50% center',tone:'warm',caption:{en:'A stone-strewn vineyard in Châteauneuf-du-Pape, southern Rhône',de:'Steiniger Weinberg in Châteauneuf-du-Pape im südlichen Rhône',fr:'Vignoble caillouteux à Châteauneuf-du-Pape, dans le Rhône méridional',es:'Viñedo pedregoso en Châteauneuf-du-Pape, Ródano sur'},
    attribution:{author:'Jarrod Doll',filePage:'https://commons.wikimedia.org/wiki/File:139_Ch%C3%A2teauneuf-du-Pape_vineyard.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'centre-loire':{src:centreLoireSancerre,
    position:'50% center',tone:'cool',caption:{en:'Vineyard rows looking toward Sancerre in the Loire Valley',de:'Weinbergzeilen mit Blick auf Sancerre im Loiretal',fr:'Rangs de vignes en direction de Sancerre, dans la vallée de la Loire',es:'Hileras de viñedos con vistas a Sancerre, en el valle del Loira'},
    attribution:{author:'Noelle Lagrange',filePage:'https://commons.wikimedia.org/wiki/File:Sancerre_vue_des_vignes_de_Didier_Prieur.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  touraine:{src:touraineRochecorbon,
    position:'50% center',tone:'warm',caption:{en:'Vineyards east of Rochecorbon in Touraine',de:'Weinberge östlich von Rochecorbon in der Touraine',fr:'Vignobles à l’est de Rochecorbon, en Touraine',es:'Viñedos al este de Rochecorbon, en Touraine'},
    attribution:{author:'Benjamin Smith',filePage:'https://commons.wikimedia.org/wiki/File:Rochecorbon_-_Vignoble_-_01.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  beaujolais:{src:beaujolaisVineyards,
    position:'50% center',tone:'cool',caption:{en:'Vineyard slopes in the Beaujolais wine region',de:'Weinberghänge im Weinbaugebiet Beaujolais',fr:'Coteaux viticoles dans le vignoble du Beaujolais',es:'Laderas de viñedos en la región vinícola de Beaujolais'},
    attribution:{author:'karaian',filePage:'https://commons.wikimedia.org/wiki/File:Beaujolais_wine_region.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  rioja:{src:riojaGrowingSeason,
    position:'50% center',tone:'warm',caption:{en:'Vineyard rows at the start of a new growing season in Rioja',de:'Weinbergzeilen zu Beginn einer neuen Vegetationsperiode in Rioja',fr:'Rangs de vignes au début d’une nouvelle saison de croissance en Rioja',es:'Hileras de viñas al comienzo de una nueva temporada de crecimiento en Rioja'},
    attribution:{author:'Art Anderson',filePage:'https://commons.wikimedia.org/wiki/File:New_Growing_Season_in_Rioja_Vineyard_-_panoramio.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'ribera-del-duero':{src:riberaDueroVinaSastre,
    position:'50% center',tone:'warm',caption:{en:'Vineyards at Bodega Viña Sastre in La Horra, Ribera del Duero',de:'Weinberge der Bodega Viña Sastre in La Horra, Ribera del Duero',fr:'Vignobles de la Bodega Viña Sastre à La Horra, dans la Ribera del Duero',es:'Viñedos de Bodega Viña Sastre en La Horra, Ribera del Duero'},
    attribution:{author:'Pravdaverita',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_Bodega_Vi%C3%B1a_Sastre_-_Hermanos_Sastre_Ribera_del_Duero.JPG',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  'vinho-verde':{src:vinhoVerdeMinho,
    position:'50% center',tone:'cool',caption:{en:'Vineyards in Minho, in Portugal’s Vinho Verde region',de:'Weinberge im Minho, in Portugals Vinho-Verde-Region',fr:'Vignobles du Minho, dans la région portugaise du Vinho Verde',es:'Viñedos en Minho, en la región portuguesa del Vinho Verde'},
    attribution:{author:'alexandra vale',filePage:'https://commons.wikimedia.org/wiki/File:Minho_Vinho_Verde_Vineyards.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  robertson:{src:robertsonVineyardLineage,
    position:'50% center',tone:'cool',caption:{en:'Vineyard rows and mountain scenery in Robertson, South Africa',de:'Weinbergzeilen und Berglandschaft in Robertson, Südafrika',fr:'Rangs de vignes et montagnes à Robertson, en Afrique du Sud',es:'Hileras de viñedos y montañas en Robertson, Sudáfrica'},
    attribution:{author:'Azwi',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_lineage_-_panoramio.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'hunter-valley':{src:hunterValleyVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyards in the Hunter Valley, New South Wales, beneath a wooded ridge',de:'Weinberge im Hunter Valley in New South Wales unterhalb eines bewaldeten Höhenzugs',fr:'Vignobles de la Hunter Valley, en Nouvelle-Galles du Sud, sous une crête boisée',es:'Viñedos del Hunter Valley, en Nueva Gales del Sur, bajo una cresta boscosa'},
    attribution:{author:'F Delventhal',filePage:'https://commons.wikimedia.org/wiki/File:Australia_2003_Hunter_Valley_Vineyard.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'clare-valley':{src:clareValleyStanleyFlat,
    position:'50% center',tone:'warm',caption:{en:'Vines at Stanley Flat in South Australia’s Clare Valley',de:'Reben in Stanley Flat im Clare Valley in Südaustralien',fr:'Vignes à Stanley Flat, dans la Clare Valley en Australie-Méridionale',es:'Viñas en Stanley Flat, en Clare Valley, Australia Meridional'},
    attribution:{author:'Marionlad',filePage:'https://commons.wikimedia.org/wiki/File:Grapevines,_Stanley_Flat.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'yarra-valley':{src:yarraValleyRochford,
    position:'50% center',tone:'cool',caption:{en:'Vineyard rows at Rochford Wines in Victoria’s Yarra Valley',de:'Weinbergzeilen bei Rochford Wines im Yarra Valley in Victoria',fr:'Rangs de vignes du domaine Rochford Wines, dans la Yarra Valley du Victoria',es:'Hileras de viñedos en Rochford Wines, en Yarra Valley, Victoria'},
    attribution:{author:'MusikAnimal',filePage:'https://commons.wikimedia.org/wiki/File:Rochford_Wines_vineyard_in_Yarra_Valley_Australia.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'eden-valley':{src:edenValleyLookout,
    position:'50% center',tone:'cool',caption:{en:'Winter vineyards in the Eden Valley, South Australia, seen from a lookout',de:'Winterliche Weinberge im Eden Valley in Südaustralien, von einem Aussichtspunkt aus gesehen',fr:'Vignobles d’hiver dans l’Eden Valley, en Australie-Méridionale, vus depuis un belvédère',es:'Viñedos invernales en Eden Valley, Australia Meridional, vistos desde un mirador'},
    attribution:{author:'Jonathanischoice',filePage:'https://commons.wikimedia.org/wiki/File:Eden_Valley,_South_Australia.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'languedoc-roussillon':{src:languedocPicVissou,
    position:'50% center',tone:'warm',caption:{en:'Autumn vines beneath Pic de Vissou in Cabrières, Hérault',de:'Herbstliche Reben unterhalb des Pic de Vissou bei Cabrières im Hérault',fr:'Vignes d’automne au pied du pic de Vissou, à Cabrières dans l’Hérault',es:'Viñas otoñales bajo el Pic de Vissou, en Cabrières, Hérault'},
    attribution:{author:'Christian Ferrer',filePage:'https://commons.wikimedia.org/wiki/File:Vignes_pr%C3%A8s_du_Pic_de_Vissou_-_October_2020.jpg',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:webImageChanges}},
  medoc:{src:medocHautMedoc,
    position:'50% center',tone:'cool',caption:{en:'Vineyards near Bégédan in the Haut-Médoc, Bordeaux',de:'Weinberge bei Bégédan im Haut-Médoc, Bordeaux',fr:'Vignobles près de Bégédan dans le Haut-Médoc, à Bordeaux',es:'Viñedos cerca de Bégédan, en el Haut-Médoc de Burdeos'},
    attribution:{author:'Jonas Roux',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_in_the_Haut-Medoc.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  pauillac:{src:pauillacVineyard,
    position:'50% center',tone:'cool',caption:{en:'Pauillac vineyard viewed from the RD 205, with Saint-Martin church in the distance',de:'Weinberg bei Pauillac an der RD 205 mit der Kirche Saint-Martin in der Ferne',fr:'Vignoble de Pauillac vu depuis la RD 205, avec l’église Saint-Martin au loin',es:'Viñedo de Pauillac visto desde la RD 205, con la iglesia de Saint-Martin al fondo'},
    attribution:{author:'Anthony Baratier',filePage:'https://commons.wikimedia.org/wiki/File:Vignoble_de_Pauillac.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'saint-emilion':{src:saintEmilionVineyards,
    position:'50% center',tone:'warm',caption:{en:'Rows of vines on the Saint-Émilion vineyard slopes',de:'Rebzeilen an den Weinberghängen von Saint-Émilion',fr:'Rangs de vignes sur les coteaux de Saint-Émilion',es:'Hileras de vides en las laderas vinícolas de Saint-Émilion'},
    attribution:{author:'Lauchantoiseau',filePage:'https://commons.wikimedia.org/wiki/File:Vignoble_Saint-Emilion.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  jura:{src:juraArboisVineyards,
    position:'50% center',tone:'cool',caption:{en:'Vineyards at Arbois, in France’s Jura wine region',de:'Weinberge bei Arbois in der französischen Weinregion Jura',fr:'Vignobles d’Arbois, dans la région viticole française du Jura',es:'Viñedos de Arbois, en la región vinícola francesa del Jura'},
    attribution:{author:'Espirat',filePage:'https://commons.wikimedia.org/wiki/File:Le_vignoble_d%27Arbois.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'niagara-peninsula':{src:niagaraPeninsulaVineyard,
    position:'50% center',tone:'cool',caption:{en:'Vineyard rows on Ontario’s Niagara Escarpment',de:'Weinbergzeilen an der Niagara Escarpment in Ontario',fr:'Rangs de vignes sur l’escarpement du Niagara, en Ontario',es:'Hileras de viñedos en la escarpa del Niágara, Ontario'},
    attribution:{author:'Michael Pardo (from Niagara, Canada)',filePage:'https://commons.wikimedia.org/wiki/File:Morning_in_the_Vineyard_(20393868278).jpg',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',changes:webImageChanges}},
  'jumilla-yecla':{src:jumillaFincaCq,
    position:'50% center',tone:'warm',caption:{en:'Aerial view of Finca CQ’s Monastrell vineyard plots in Jumilla, Murcia',de:'Luftaufnahme der Monastrell-Weinberge der Finca CQ in Jumilla, Murcia',fr:'Vue aérienne des parcelles de Monastrell de la Finca CQ à Jumilla, Murcie',es:'Vista aérea de las parcelas de Monastrell de Finca CQ, en Jumilla, Murcia'},
    attribution:{author:'Malegaetan',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_de_Finca_CQ_(Casa_Quemada)_en_Jumilla,_Murcia,_Espa%C3%B1a.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  valpolicella:{src:valpolicellaTerraces,
    position:'50% center',tone:'cool',caption:{en:'Terraced vineyards in the Valpolicella wine region, Veneto',de:'Terrassenweinberge im Weinbaugebiet Valpolicella in Venetien',fr:'Vignobles en terrasses dans la région viticole de Valpolicella, en Vénétie',es:'Viñedos en terrazas en la región vinícola de Valpolicella, Véneto'},
    attribution:{author:'Aaron Epstein',filePage:'https://commons.wikimedia.org/wiki/File:Terraced_vineyards_in_Valpolicella.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  montalcino:{src:montalcinoVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyard near Montalcino, Tuscany',de:'Weinberg bei Montalcino in der Toskana',fr:'Vignoble près de Montalcino, en Toscane',es:'Viñedo cerca de Montalcino, en la Toscana'},
    attribution:{author:'trolvag',filePage:'https://commons.wikimedia.org/wiki/File:Montalcino_vineyard_-_panoramio.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  alentejo:{src:alentejoEstremoz,
    position:'50% center',tone:'warm',caption:{en:'Vineyard rows near Estremoz in Portugal’s Alentejo wine region',de:'Weinbergzeilen bei Estremoz in Portugals Weinregion Alentejo',fr:'Rangs de vignes près d’Estremoz, dans la région viticole portugaise de l’Alentejo',es:'Hileras de viñedos cerca de Estremoz, en la región vinícola portuguesa del Alentejo'},
    attribution:{author:'Jules Verne Times Two',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard,_Estremoz,_Portugal_(PPL1-Corrected)_julesvernex2.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'saale-unstrut':{src:saaleUnstrutRossbach,
    position:'50% center',tone:'cool',caption:{en:'Terraced vineyards at Roßbach near Naumburg, Saale-Unstrut',de:'Terrassenweinberge in Roßbach bei Naumburg an Saale und Unstrut',fr:'Vignobles en terrasses à Roßbach, près de Naumburg, dans la région Saale-Unstrut',es:'Viñedos en terrazas en Roßbach, cerca de Naumburg, en Saale-Unstrut'},
    attribution:{author:'Dguendel',filePage:'https://commons.wikimedia.org/wiki/File:Ro%C3%9Fbach_(Naumburg),_Weinberge-2.jpg',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  muscadet:{src:muscadetPaysNantais,
    position:'50% center',tone:'cool',caption:{en:'Melon de Bourgogne vines in the Muscadet Pays Nantais, Loire Valley',de:'Melon-de-Bourgogne-Reben im Muscadet Pays Nantais im Loiretal',fr:'Vignes de Melon de Bourgogne dans le Muscadet Pays Nantais, vallée de la Loire',es:'Vides de Melon de Bourgogne en Muscadet Pays Nantais, valle del Loira'},
    attribution:{author:'Jameson Fink',filePage:'https://commons.wikimedia.org/wiki/File:Muscadet_vineyard.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  setubal:{src:setubalArrabida,
    position:'50% center',tone:'cool',caption:{en:'Vineyards beneath the Serra da Arrábida in Portugal',de:'Weinberge am Fuß der Serra da Arrábida in Portugal',fr:'Vignobles au pied de la Serra da Arrábida, au Portugal',es:'Viñedos al pie de la Serra da Arrábida, en Portugal'},
    attribution:{author:'Arseniop',filePage:'https://commons.wikimedia.org/wiki/File:Arrabida_footslope_vineyards.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  navarra:{src:navarraCintruenigo,
    position:'50% center',tone:'warm',caption:{en:'Autumn vineyards near Cintruénigo in Navarre',de:'Herbstliche Weinberge bei Cintruénigo in Navarra',fr:'Vignobles d’automne près de Cintruénigo, en Navarre',es:'Viñedos de otoño cerca de Cintruénigo, en Navarra'},
    attribution:{author:'Feranza',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_de_Navarra.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  savoie:{src:savoieApremontGranier,
    position:'50% center',tone:'cool',caption:{en:'Vineyards at Apremont beneath Mount Granier, Savoie',de:'Weinberge bei Apremont unterhalb des Mont Granier in Savoyen',fr:'Vignobles d’Apremont au pied du mont Granier, en Savoie',es:'Viñedos de Apremont al pie del monte Granier, en Saboya'},
    attribution:{author:'Dabigben73',filePage:'https://commons.wikimedia.org/wiki/File:Apremont_Granier_vignes.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  sussex:{src:sussexBolney,
    position:'50% center',tone:'cool',caption:{en:'Young vines at Bolney Vineyard in West Sussex, England',de:'Junge Reben bei Bolney Vineyard in West Sussex, England',fr:'Jeunes vignes au domaine de Bolney, dans le West Sussex en Angleterre',es:'Vides jóvenes en Bolney Vineyard, West Sussex, Inglaterra'},
    attribution:{author:'Paul Gillett',filePage:'https://commons.wikimedia.org/wiki/File:Bolney_Vineyard_-_geograph.org.uk_-_3663326.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  kakheti:{src:kakhetiZegaani,
    position:'50% center',tone:'warm',caption:{en:'Vineyards at Chateau Zegaani in Akhasheni, Gurjaani, Kakheti, Georgia',de:'Weinberge des Chateau Zegaani in Akhasheni, Gurjaani, Kachetien, Georgien',fr:'Vignobles du Chateau Zegaani à Akhasheni, Gurjaani, en Kakhétie, Géorgie',es:'Viñedos de Chateau Zegaani en Akhasheni, Gurjaani, Kajetia, Georgia'},
    attribution:{author:'Chateau Zegaani',filePage:'https://commons.wikimedia.org/wiki/File:Chateau_Zegaani_Vineyards.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  pomerol:{src:pomerolGazinVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyards at Château Gazin in Pomerol, Bordeaux’s Right Bank',de:'Weinberge des Château Gazin in Pomerol am rechten Ufer von Bordeaux',fr:'Vignobles du Château Gazin à Pomerol, sur la rive droite de Bordeaux',es:'Viñedos de Château Gazin en Pomerol, en la orilla derecha de Burdeos'},
    attribution:{author:'Antoine Bertier',filePage:'https://commons.wikimedia.org/wiki/File:Ch%C3%A2teau_Gazin_vineyard_in_Pomerol.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'montagne-de-reims':{src:montagneReimsNorthSlope,
    position:'50% center',tone:'cool',caption:{en:'Vineyards on the northern flank of Montagne de Reims, near Chamery',de:'Weinberge am Nordhang der Montagne de Reims bei Chamery',fr:'Vignobles sur le versant nord de la montagne de Reims, près de Chamery',es:'Viñedos en la ladera norte de la Montagne de Reims, cerca de Chamery'},
    attribution:{author:'Pline',filePage:'https://commons.wikimedia.org/wiki/File:Sur_le_flanc_nord_de_la_montagne_de_Reims_DSC_0235.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'vallee-de-la-marne':{src:valleeMarneCourcelles,
    position:'50% center',tone:'cool',caption:{en:'Champagne vineyards in the Marne Valley near Trélou-sur-Marne',de:'Champagner-Weinberge im Marne-Tal bei Trélou-sur-Marne',fr:'Vignobles de Champagne dans la vallée de la Marne, près de Trélou-sur-Marne',es:'Viñedos de Champagne en el valle del Marne, cerca de Trélou-sur-Marne'},
    attribution:{author:'Pline',filePage:'https://commons.wikimedia.org/wiki/File:Vall%C3%A9e_de_la_Marne_vers_Courcelles_DSC_0121.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'graves-sauternes':{src:yquemSauternesVineyards,
    position:'50% center',tone:'warm',caption:{en:'Vineyards of Château d’Yquem in Sauternes, Bordeaux',de:'Weinberge des Château d’Yquem in Sauternes, Bordeaux',fr:'Vignobles du Château d’Yquem à Sauternes, dans le Bordelais',es:'Viñedos de Château d’Yquem en Sauternes, Burdeos'},
    attribution:{author:'Megan Mallen',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_of_Ch%C3%A2teau_d%E2%80%99Yquem,_Sauternes.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'cote-de-nuits':{src:coteNuitsVosneRomanee,
    position:'50% center',tone:'warm',caption:{en:'Vineyards around Vosne-Romanée in the Côte de Nuits',de:'Weinberge bei Vosne-Romanée an der Côte de Nuits',fr:'Vignobles autour de Vosne-Romanée, dans la Côte de Nuits',es:'Viñedos alrededor de Vosne-Romanée, en la Côte de Nuits'},
    attribution:{author:'Pierre André',filePage:'https://commons.wikimedia.org/wiki/File:Vosne-Roman%C3%A9e,_Domaine_de_la_Roman%C3%A9e-Conti_(1).JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'cote-de-beaune':{src:coteBeauneVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyard in the Côte de Beaune, Burgundy',de:'Weinberg an der Côte de Beaune im Burgund',fr:'Vignoble dans la Côte de Beaune, en Bourgogne',es:'Viñedo en la Côte de Beaune, Borgoña'},
    attribution:{author:'Megan Mallen',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_in_C%C3%B4te_de_Beaune,_Burgundy.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  margaux:{src:margauxChateauVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyards of Château Margaux beside the Church of Saint Michael',de:'Weinberge von Château Margaux neben der Kirche Saint-Michel',fr:'Vignobles du Château Margaux près de l’église Saint-Michel',es:'Viñedos de Château Margaux junto a la iglesia de San Miguel'},
    attribution:{author:'David Perez',filePage:'https://commons.wikimedia.org/wiki/File:Chateau_Margaux_02_iglesia_by-dpc.jpg',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  cahors:{src:cahorsLotVineyards,
    position:'50% center',tone:'warm',caption:{en:'Vineyard hills along the Lot between Albas and Luzech, in Cahors',de:'Weinberghänge am Lot zwischen Albas und Luzech bei Cahors',fr:'Coteaux viticoles le long du Lot entre Albas et Luzech, à Cahors',es:'Laderas de viñedos junto al Lot entre Albas y Luzech, en Cahors'},
    attribution:{author:'Lapastoure Didier',filePage:'https://commons.wikimedia.org/wiki/File:Cahors_2011_08_005.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'cote-des-blancs':{src:coteDesBlancsVineyards,
    position:'50% center',tone:'cool',caption:{en:'Vineyards of the Côte des Blancs in Champagne',de:'Weinberge der Côte des Blancs in der Champagne',fr:'Vignobles de la Côte des Blancs en Champagne',es:'Viñedos de la Côte des Blancs en Champaña'},
    attribution:{author:'BerndtF',filePage:'https://commons.wikimedia.org/wiki/File:Cote_des_Blancs.jpg',license:'Public domain',licenseUrl:'https://commons.wikimedia.org/wiki/Commons:Public_domain',changes:webImageChanges}},
  'anjou-saumur':{src:saumurVineyardAerial,
    position:'50% center',tone:'warm',caption:{en:'Aerial view of vineyard blocks in the Saumur wine region, Loire Valley',de:'Luftaufnahme von Weinbergparzellen im Weinbaugebiet Saumur im Loiretal',fr:'Vue aérienne de parcelles viticoles dans la région de Saumur, vallée de la Loire',es:'Vista aérea de parcelas de viñedo en la región vinícola de Saumur, valle del Loira'},
    attribution:{author:'Céline',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_in_Saumur.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  bergerac:{src:bergeracVignoble,
    position:'50% center',tone:'warm',caption:{en:'Vineyard landscape south of Bergerac, Dordogne, with the town in the distance',de:'Weinberglandschaft südlich von Bergerac in der Dordogne mit der Stadt in der Ferne',fr:'Paysage viticole au sud de Bergerac, en Dordogne, avec la ville au loin',es:'Paisaje de viñedos al sur de Bergerac, Dordoña, con la ciudad al fondo'},
    attribution:{author:'Père Igor',filePage:'https://commons.wikimedia.org/wiki/File:Bergeracois_vignoble.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  piemonte:{src:piemonteVineyards,
    position:'50% center',tone:'warm',caption:{en:'Vine rows across the hills of Piemonte, Italy',de:'Rebzeilen an den Hügeln des Piemont in Italien',fr:'Rangs de vignes sur les collines du Piémont, en Italie',es:'Hileras de viñas en las colinas del Piamonte, Italia'},
    attribution:{author:'Megan Mallen',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_in_Piemonte,_Italy.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'paso-robles':{src:pasoRoblesVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyard in the Paso Robles AVA, California',de:'Weinberg im Paso Robles AVA in Kalifornien',fr:'Vignoble dans l’AVA de Paso Robles, en Californie',es:'Viñedo en la AVA de Paso Robles, California'},
    attribution:{author:'Pasowine',filePage:'https://commons.wikimedia.org/wiki/File:Paso_Vineyard.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'wairau-valley':{src:wairauValleyVineyards,
    position:'50% center',tone:'cool',caption:{en:'Wairau Valley vines from Raupara Road, toward Southern Valleys and the Wither Hills',de:'Weinberge im Wairau Valley von der Raupara Road aus, in Richtung Southern Valleys und Wither Hills',fr:'Vignobles de la vallée de Wairau vus de Raupara Road, vers Southern Valleys et Wither Hills',es:'Viñedos del valle de Wairau desde Raupara Road, hacia Southern Valleys y Wither Hills'},
    attribution:{author:'Jonathan Harker',filePage:'https://commons.wikimedia.org/wiki/File:Wairau_Valley_vineyards_in_Marlborough,_New_Zealand.jpg',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:webImageChanges}},
  'awatere-valley':{src:awatereValleyAutumn,
    position:'50% center',tone:'warm',caption:{en:'Awatere Valley vineyards in autumn, beneath Marlborough’s mountain backdrop',de:'Herbstliche Weinberge im Awatere Valley vor der Bergkulisse von Marlborough',fr:'Vignobles d’automne dans la vallée d’Awatere, devant les montagnes de Marlborough',es:'Viñedos otoñales del valle de Awatere, bajo las montañas de Marlborough'},
    attribution:{author:'Phillip Capper',filePage:'https://commons.wikimedia.org/wiki/File:Autumn_in_the_Awatere_Valley.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'north-canterbury':{src:northCanterburyWaipara,
    position:'50% center',tone:'cool',caption:{en:'Black Estate vineyards overlooking Waipara Valley in North Canterbury, New Zealand',de:'Weinberge von Black Estate mit Blick ins Waipara Valley in North Canterbury, Neuseeland',fr:'Vignobles de Black Estate surplombant la vallée de Waipara, dans le North Canterbury néo-zélandais',es:'Viñedos de Black Estate con vistas al valle de Waipara, en North Canterbury, Nueva Zelanda'},
    attribution:{author:'Jocelyn Kinghorn',filePage:'https://commons.wikimedia.org/wiki/File:Waipara_Valley_from_Black_Estate_JK01.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'calchaqui-valleys':{src:calchaquiCafayateVineyard,
    position:'50% center',tone:'cool',caption:{en:'Vineyard near Cafayate, Salta, with the Calchaquí mountain backdrop',de:'Weinberg bei Cafayate in Salta vor der Kulisse der Calchaquí-Berge',fr:'Vignoble près de Cafayate, à Salta, avec les montagnes des Calchaquí en arrière-plan',es:'Viñedo cerca de Cafayate, Salta, con las montañas calchaquíes al fondo'},
    attribution:{author:'Tokyo Tanenhaus',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edoCafayate.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'san-juan-pedernal':{src:sanJuanPedernalVineyards,
    position:'50% center',tone:'cool',caption:{en:'Pedernal Valley vineyards in Sarmiento Department, San Juan, Argentina',de:'Weinberge im Pedernal-Tal im Departamento Sarmiento, San Juan, Argentinien',fr:'Vignobles de la vallée de Pedernal, département de Sarmiento, San Juan, Argentine',es:'Viñedos del valle de Pedernal, departamento de Sarmiento, San Juan, Argentina'},
    attribution:{author:'Enrique Guardia',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1edos_en_el_Valle_de_Pedernal,_San_Juan,_Argentina.JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  maipo:{src:maipoHarasDePirque,
    position:'50% center',tone:'cool',caption:{en:'Viña Haras de Pirque in Pirque, Chile, with vineyard rows and the Andes behind',de:'Viña Haras de Pirque in Pirque, Chile, mit Weinbergzeilen und den Anden im Hintergrund',fr:'Viña Haras de Pirque à Pirque, au Chili, avec des rangs de vignes et les Andes en arrière-plan',es:'Viña Haras de Pirque en Pirque, Chile, con hileras de viñedos y los Andes al fondo'},
    attribution:{author:'Aeveraal',filePage:'https://commons.wikimedia.org/wiki/File:20240906_Vi%C3%B1a_Haras_de_Pirque_02.jpg',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:webImageChanges}},
  toscana:{src:toscanaVinesCypress,
    position:'50% center',tone:'warm',caption:{en:'Grape vines and cypress trees in Tuscany',de:'Weinreben und Zypressen in der Toskana',fr:'Vignes et cyprès en Toscane',es:'Vides y cipreses en Toscana'},
    attribution:{author:'Ian McKellar',filePage:'https://commons.wikimedia.org/wiki/File:Grape_vines_and_cypress_trees_in_Tuscany.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'walla-walla-valley':{src:wallaWallaCayuse,
    position:'50% 72%',tone:'cool',caption:{en:'Cayuse Vineyards in Milton-Freewater, Oregon, within the Walla Walla AVA',de:'Weinberge von Cayuse in Milton-Freewater, Oregon, innerhalb der Walla-Walla-AVA',fr:'Vignobles de Cayuse à Milton-Freewater, dans l’Oregon, au sein de l’AVA de Walla Walla',es:'Viñedos de Cayuse en Milton-Freewater, Oregón, dentro de la AVA de Walla Walla'},
    attribution:{author:'Agne27',filePage:'https://commons.wikimedia.org/wiki/File:Cayuse_vineyards_Walla_Walla.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  lodi:{src:lodiBechtholdCinsaut,
    position:'50% center',tone:'warm',caption:{en:'Old-vine Cinsaut at Bechthold Vineyard in Lodi, California',de:'Alte Cinsaut-Reben im Bechthold Vineyard bei Lodi, Kalifornien',fr:'Vieux ceps de Cinsaut au vignoble Bechthold, à Lodi en Californie',es:'Cepas antiguas de Cinsaut en Bechthold Vineyard, en Lodi, California'},
    attribution:{author:'Randy Caparoso',filePage:'https://commons.wikimedia.org/wiki/File:Bechthold_Vineyard_-_Cinsaut_-_planted_1886.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'sierra-foothills':{src:sierraFoothillsElDorado,
    position:'50% center',tone:'cool',caption:{en:'Vineyard on the Sierra Foothills in El Dorado County, California',de:'Weinberg in den Sierra Foothills im El Dorado County, Kalifornien',fr:'Vignoble dans les contreforts de la Sierra, dans le comté d’El Dorado en Californie',es:'Viñedo en las estribaciones de Sierra, en el condado de El Dorado, California'},
    attribution:{author:'Kurt Minard',filePage:'https://commons.wikimedia.org/wiki/File:Sierra_Foothills_Vinyards_-_panoramio.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'asti-monferrato':{src:astiMonferratoVineyard,
    position:'50% 70%',tone:'cool',caption:{en:'Winter vineyards in the Asti wine region of Piedmont',de:'Winterliche Weinberge in der Weinregion Asti im Piemont',fr:'Vignobles d’hiver dans la région viticole d’Asti, au Piémont',es:'Viñedos invernales en la región vinícola de Asti, en Piamonte'},
    attribution:{author:'Henri Bergius',filePage:'https://commons.wikimedia.org/wiki/File:Villages_and_wineyards_in_Asti.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'santa-barbara-county':{src:santaBarbaraCountyVineyards,
    position:'50% 66%',tone:'cool',caption:{en:'Vineyards on hillsides in Santa Barbara County, California',de:'Weinberge an den Hängen im Santa Barbara County, Kalifornien',fr:'Vignobles sur les coteaux du comté de Santa Barbara, en Californie',es:'Viñedos en las laderas del condado de Santa Barbara, California'},
    attribution:{author:'burlap/',filePage:'https://commons.wikimedia.org/wiki/File:Vignobles_sur_coteaux_%C3%A0_Santa_Barbara.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'yakima-valley':{src:yakimaSagelandsVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyards near Wapato in Washington’s Yakima Valley AVA',de:'Weinberge bei Wapato in der Yakima-Valley-AVA im Bundesstaat Washington',fr:'Vignobles près de Wapato dans l’AVA de Yakima Valley, dans l’État de Washington',es:'Viñedos cerca de Wapato en la AVA de Yakima Valley, Washington'},
    attribution:{author:'Bernt Rostad',filePage:'https://commons.wikimedia.org/wiki/File:View_from_Sagelands_Vineyard.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  montepulciano:{src:montepulcianoVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyard in Montepulciano, Tuscany',de:'Weinberg in Montepulciano in der Toskana',fr:'Vignoble à Montepulciano, en Toscane',es:'Viñedo en Montepulciano, Toscana'},
    attribution:{author:'Drew Cuddy',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_in_Montepulciano.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  soave:{src:soavePanorama,
    position:'50% 72%',tone:'cool',caption:{en:'Soave and its vineyard hills, viewed from near Colognola ai Colli',de:'Soave und seine Weinberghänge, von der Gegend bei Colognola ai Colli aus gesehen',fr:'Soave et ses coteaux viticoles, vus des environs de Colognola ai Colli',es:'Soave y sus laderas de viñedos, vistos desde cerca de Colognola ai Colli'},
    attribution:{author:'MZ14',filePage:'https://commons.wikimedia.org/wiki/File:Soave_panorama.jpg',license:'Public domain dedication',licenseUrl:'https://commons.wikimedia.org/wiki/Commons:Public_domain',changes:webImageChanges}},
  'conegliano-valdobbiadene':{src:coneglianoValdobbiadeneVineyard,
    position:'50% center',tone:'warm',caption:{en:'Prosecco vineyard hills near Santo Stefano in Valdobbiadene',de:'Prosecco-Weinberghänge bei Santo Stefano in Valdobbiadene',fr:'Coteaux de vignes de Prosecco près de Santo Stefano, à Valdobbiadene',es:'Laderas de viñedos de Prosecco cerca de Santo Stefano, en Valdobbiadene'},
    attribution:{author:'Civvì',filePage:'https://commons.wikimedia.org/wiki/File:Vista_da_Santo_Stefano_Valdobbiadene.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  bolgheri:{src:bolgheriDocVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vine rows in the Bolgheri DOC wine region, Tuscany',de:'Weinreben in der DOC-Weinregion Bolgheri in der Toskana',fr:'Rangs de vigne dans l’appellation Bolgheri DOC, en Toscane',es:'Hileras de vides en la DOC Bolgheri, en Toscana'},
    attribution:{author:'David Lienhard',filePage:'https://commons.wikimedia.org/wiki/File:Bolgheri_Doc_(263877897).jpeg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  franciacorta:{src:franciacortaMontina,
    position:'50% center',tone:'warm',caption:{en:'Vineyard at La Montina in Provezze, Franciacorta',de:'Weinberg von La Montina in Provezze in der Franciacorta',fr:'Vignoble de La Montina à Provezze, en Franciacorta',es:'Viñedo de La Montina en Provezze, Franciacorta'},
    attribution:{author:'Consorzio Franciacorta',filePage:'https://commons.wikimedia.org/wiki/File:Vigneto_montina_provezze.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'trentino-alto-adige':{src:trentinoAltoAdigeValdadige,
    position:'50% center',tone:'cool',caption:{en:'Vineyards in Valdadige, Trentino-Alto Adige/Südtirol',de:'Weinberge im Valdadige in Trentino-Südtirol',fr:'Vignobles du Valdadige, dans le Trentin-Haut-Adige',es:'Viñedos de Valdadige, en Trentino-Alto Adigio'},
    attribution:{author:'Puntin1969',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_in_Valdadige.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  collio:{src:collioCormons,
    position:'50% 72%',tone:'cool',caption:{en:'Vineyards near Cormons in the Collio wine region, Friuli-Venezia Giulia',de:'Weinberge bei Cormons im Weinbaugebiet Collio in Friaul-Julisch Venetien',fr:'Vignobles près de Cormons, dans la région viticole du Collio, au Frioul-Vénétie julienne',es:'Viñedos cerca de Cormons, en la región vitícola de Collio, Friuli-Venecia Julia'},
    attribution:{author:'gian luca bucci',filePage:'https://commons.wikimedia.org/wiki/File:Vigneti_a_Cormons_(GO)_-_panoramio.jpg',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  'colli-orientali':{src:colliOrientaliRoccaBernarda,
    position:'50% center',tone:'warm',caption:{en:'Vineyards at Rocca Bernarda in the Colli Orientali del Friuli',de:'Weinberge bei Rocca Bernarda in den Colli Orientali del Friuli',fr:'Vignobles de Rocca Bernarda, dans les Colli Orientali del Friuli',es:'Viñedos de Rocca Bernarda, en los Colli Orientali del Friuli'},
    attribution:{author:'discosour',filePage:'https://commons.wikimedia.org/wiki/File:Friuli_019_Cantine_Aperte_-_Rocca_Bernarda.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'texas-hill-country':{src:texasHillCountryJohnsonCity,
    position:'50% 72%',tone:'warm',caption:{en:'Vineyards in Johnson City, within the Texas Hill Country AVA',de:'Weinberge in Johnson City innerhalb der Texas-Hill-Country-AVA',fr:'Vignobles à Johnson City, dans l’AVA Texas Hill Country',es:'Viñedos en Johnson City, dentro de la AVA Texas Hill Country'},
    attribution:{author:'Jon Lebkowsky',filePage:'https://commons.wikimedia.org/wiki/File:Texas_Hills_vineyard.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'red-mountain':{src:redMountainKiona,
    position:'50% center',tone:'warm',caption:{en:'Kiona Vineyard beneath Rattlesnake Mountain in Washington’s Red Mountain AVA',de:'Kiona Vineyard unterhalb des Rattlesnake Mountain in der Red-Mountain-AVA, Washington',fr:'Vignoble Kiona au pied du mont Rattlesnake, dans l’AVA Red Mountain de l’État de Washington',es:'Viñedo Kiona bajo Rattlesnake Mountain, en la AVA Red Mountain del estado de Washington'},
    attribution:{author:'Williamborg',filePage:'https://commons.wikimedia.org/wiki/File:Red_Mountain_toward_Rattlesnake_Mountain.JPG',license:'Public domain (PD-self)',licenseUrl:'https://commons.wikimedia.org/wiki/Template:PD-self',changes:webImageChanges}},
  'columbia-valley':{src:columbiaValleyAncientLakes,
    position:'50% 68%',tone:'cool',caption:{en:'Basalt cliffs at Ancient Lakes in Washington’s Columbia Valley AVA',de:'Basaltklippen bei Ancient Lakes in der Columbia-Valley-AVA im Bundesstaat Washington',fr:'Falaises basaltiques d’Ancient Lakes dans l’AVA Columbia Valley, État de Washington',es:'Acantilados basálticos de Ancient Lakes, en la AVA Columbia Valley de Washington'},
    attribution:{author:'ECTran71',filePage:'https://commons.wikimedia.org/wiki/File:Ancient_Lakes_pond,_WA,_USA.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  oakville:{src:oakvilleOpusOne,
    position:'50% 65%',tone:'cool',caption:{en:'Vineyards at Opus One Winery in Oakville, California',de:'Weinberge des Weinguts Opus One in Oakville, Kalifornien',fr:'Vignobles du domaine Opus One à Oakville, en Californie',es:'Viñedos de Opus One Winery en Oakville, California'},
    attribution:{author:'daita saru',filePage:'https://commons.wikimedia.org/wiki/File:Opus_One_Winery_(17086460611).jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  valtellina:{src:valtellinaAlpineVineyards,
    position:'50% 68%',tone:'cool',caption:{en:'Vineyards in Valtellina, Lombardy, with the Alps beyond',de:'Weinberge im Veltlin in der Lombardei vor den Alpen',fr:'Vignobles de la Valteline, en Lombardie, avec les Alpes en arrière-plan',es:'Viñedos de Valtellina, Lombardía, con los Alpes al fondo'},
    attribution:{author:'Franco Folini',filePage:'https://commons.wikimedia.org/wiki/File:Valtellina,_Italy_vineyard.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'emilia-romagna':{src:emiliaRomagnaFattoriaParadiso,
    position:'68% 55%',tone:'warm',caption:{en:'Vineyard rows at Fattoria Paradiso in Bertinoro, Emilia-Romagna',de:'Weinreben der Fattoria Paradiso in Bertinoro, Emilia-Romagna',fr:'Rangs de vigne à la Fattoria Paradiso, à Bertinoro, en Émilie-Romagne',es:'Hileras de viñas en Fattoria Paradiso, Bertinoro, Emilia-Romaña'},
    attribution:{author:'Topural [1]',filePage:'https://commons.wikimedia.org/wiki/File:%22_09_-_ITALY_-_Vineyard_and_signs_Emilia_Romagna_wine_-_Mollino.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  marche:{src:marcheCupramontana,
    position:'50% center',tone:'cool',caption:{en:'Verdicchio vines in Cupramontana, Marche',de:'Verdicchio-Reben in Cupramontana in den Marken',fr:'Vignes de verdicchio à Cupramontana, dans les Marches',es:'Viñas de Verdicchio en Cupramontana, Las Marcas'},
    attribution:{author:'Davide',filePage:'https://commons.wikimedia.org/wiki/File:Verdicchio_vines_in_Cupramontana.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  abruzzo:{src:abruzzoControguerra,
    position:'50% 65%',tone:'warm',caption:{en:'Vineyard in Controguerra, in Abruzzo’s Controguerra DOC',de:'Weinberg in Controguerra in den Abruzzen, im DOC-Gebiet Controguerra',fr:'Vignoble à Controguerra, dans l’appellation Controguerra DOC des Abruzzes',es:'Viñedo en Controguerra, en la DOC Controguerra de Abruzos'},
    attribution:{author:'pizzodisevo,on/off',filePage:'https://commons.wikimedia.org/wiki/File:Controguerra_vineyards.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  campania:{src:campaniaCavalierPepe,
    position:'50% 58%',tone:'warm',caption:{en:'Vine rows at Tenuta Cavalier Pepe in Campania',de:'Weinreben auf Tenuta Cavalier Pepe in Kampanien',fr:'Rangs de vigne au domaine Tenuta Cavalier Pepe, en Campanie',es:'Hileras de viñas en Tenuta Cavalier Pepe, Campania'},
    attribution:{author:'Fabio Ingrosso',filePage:'https://commons.wikimedia.org/wiki/File:Tenuta_Cavalier_Pepe_Campania_vineyard.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  puglia:{src:pugliaCastellaneta,
    position:'50% 82%',tone:'warm',caption:{en:'Vineyard near Castellaneta in Puglia',de:'Weinberg bei Castellaneta in Apulien',fr:'Vignoble près de Castellaneta, dans les Pouilles',es:'Viñedo cerca de Castellaneta, en Apulia'},
    attribution:{author:'drdcuddy',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_in_Puglia_Perrini.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  rueda:{src:ruedaMartinsancho,
    position:'50% 70%',tone:'warm',caption:{en:'Martinsancho vineyard in La Seca, DO Rueda',de:'Weinberg Martinsancho in La Seca, DO Rueda',fr:'Vignoble de Martinsancho à La Seca, dans l’appellation Rueda',es:'Viñedo Martinsancho en La Seca, DO Rueda'},
    attribution:{author:'Carlosmartinmm34',filePage:'https://commons.wikimedia.org/wiki/File:Martinsancho_Vineyard.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  bierzo:{src:bierzoVineyards,
    position:'50% 78%',tone:'warm',caption:{en:'Vineyards in El Bierzo, León',de:'Weinberge im Bierzo in der Provinz León',fr:'Vignobles du Bierzo, dans la province de León',es:'Viñedos de El Bierzo, León'},
    attribution:{author:'Random username 083794703875938',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1as_en_la_comarca_del_Bierzo,_Le%C3%B3n_Imgn01.jpg',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/deed.en',changes:webImageChanges}},
  'basque-country-txakoli':{src:txakoliGetaria,
    position:'50% 70%',tone:'cool',caption:{en:'Txakoli vineyards near Getaria, Gipuzkoa',de:'Txakoli-Weinberge bei Getaria in Gipuzkoa',fr:'Vignobles de txakoli près de Getaria, dans le Gipuzkoa',es:'Viñedos de txakoli cerca de Getaria, Gipuzkoa'},
    attribution:{author:'Jean Michel Etchecolonea',filePage:'https://commons.wikimedia.org/wiki/File:Getaria_Vignobles_Txakoli1.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'mclaren-vale':{src:mclarenValeVineyard,
    position:'50% 82%',tone:'warm',caption:{en:'Vine rows among the hills of McLaren Vale, South Australia',de:'Weinreben zwischen den Hügeln von McLaren Vale in Südaustralien',fr:'Rangs de vigne dans les collines de McLaren Vale, en Australie-Méridionale',es:'Hileras de viñas entre las colinas de McLaren Vale, Australia Meridional'},
    attribution:{author:'Wikipedian',filePage:'https://commons.wikimedia.org/wiki/File:Vines_and_Hills_-_panoramio.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'mornington-peninsula':{src:morningtonPeninsulaVineyard,
    position:'50% center',tone:'cool',caption:{en:'Vineyard rows on Victoria’s Mornington Peninsula',de:'Weinbergreihen auf der Mornington Peninsula in Victoria',fr:'Rangs de vigne sur la péninsule de Mornington, dans l’État de Victoria',es:'Hileras de viñedos en la península de Mornington, Victoria'},
    attribution:{author:'faVori rouge',filePage:'https://commons.wikimedia.org/wiki/File:Mornington_Peninsula_vineyard.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'prince-edward-county':{src:princeEdwardCountyVineyard,
    position:'50% 72%',tone:'warm',caption:{en:'Vines in Prince Edward County, Ontario',de:'Weinreben in Prince Edward County, Ontario',fr:'Vignes dans le comté de Prince Edward, en Ontario',es:'Viñas en Prince Edward County, Ontario'},
    attribution:{author:'Gary J. Wood',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard,_Prince_Edward_County_(4048278348).jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  casablanca:{src:casablancaBodegasRe,
    position:'65% 55%',tone:'warm',caption:{en:'Vineyard at Bodegas RE in Chile’s Casablanca Valley',de:'Weinberg bei Bodegas RE im chilenischen Casablanca-Tal',fr:'Vignoble de Bodegas RE dans la vallée de Casablanca, au Chili',es:'Viñedo de Bodegas RE en el valle de Casablanca, Chile'},
    attribution:{author:'Winniepix (Sue Winston)',filePage:'https://commons.wikimedia.org/wiki/File:Waling_through_the_vineyard_at_Bodegas_RE,_Casablanca_Valley,_Chile_(27137278149).jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'vale-dos-vinhedos':{src:valeDosVinhedosVineyard,
    position:'50% center',tone:'cool',caption:{en:'Vine rows in Vale dos Vinhedos, Rio Grande do Sul, Brazil',de:'Weinreben im Vale dos Vinhedos in Rio Grande do Sul, Brasilien',fr:'Rangs de vigne dans la Vale dos Vinhedos, au Rio Grande do Sul, au Brésil',es:'Hileras de viñas en Vale dos Vinhedos, Rio Grande do Sul, Brasil'},
    attribution:{author:'STELLA SEGATTI',filePage:'https://commons.wikimedia.org/wiki/File:PLANTA%C3%87%C3%95ES_DE_UVA_-_VALE_DOS_VINHEDOS_-_RS.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'leyda-san-antonio':{src:leydaSanAntonioVineyard,
    position:'50% center',tone:'warm',caption:{en:'Vineyards in Leyda, Chile, in autumn',de:'Weinberge im chilenischen Leyda im Herbst',fr:'Vignobles de Leyda, au Chili, en automne',es:'Viñedos en Leyda, Chile, en otoño'},
    attribution:{author:'Rosario Nieto Chadwick',filePage:'https://commons.wikimedia.org/wiki/File:Vi%C3%B1a_En_Leyda_(72246895).jpeg',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  hokkaido:{src:hokkaidoFuranoVineyard,
    position:'50% 70%',tone:'cool',caption:{en:'Wine-grape vineyard in Furano, Hokkaido, Japan',de:'Weinberg in Furano auf Hokkaido, Japan',fr:'Vignoble à Furano, sur l’île de Hokkaido au Japon',es:'Viñedo en Furano, Hokkaido, Japón'},
    attribution:{author:'MaedaAkihiko',filePage:'https://commons.wikimedia.org/wiki/File:Furano_Vineyard.jpg',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/deed.en',changes:webImageChanges}},
  'vayots-dzor':{src:vayotsDzorRindVineyard,
    position:'50% 72%',tone:'cool',caption:{en:'Vineyard landscape near Rind, Vayots Dzor, Armenia',de:'Weinberglandschaft bei Rind in der armenischen Provinz Wajoz Dsor',fr:'Paysage viticole près de Rind, dans le Vayots Dzor en Arménie',es:'Paisaje de viñedos cerca de Rind, en Vayots Dzor, Armenia'},
    attribution:{author:'Ավետիսյան91',filePage:'https://commons.wikimedia.org/wiki/File:Natural_landscape_and_vineyard_in_Rind_village_01.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  nagano:{src:naganoAzuminoWinery,
    position:'50% 72%',tone:'cool',caption:{en:'Vines and winery buildings at Azumino Winery, Nagano, Japan',de:'Reben und Weingutsgebäude der Azumino Winery in Nagano, Japan',fr:'Vignes et bâtiments du domaine Azumino Winery, à Nagano au Japon',es:'Viñas y edificios de Azumino Winery, en Nagano, Japón'},
    attribution:{author:'Qurren',filePage:'https://commons.wikimedia.org/wiki/File:Azumino_Winery.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  kamptal:{src:kamptalHeiligenstein,
    position:'50% 72%',tone:'warm',caption:{en:'Heiligenstein vineyard slopes and the Kamptalwarte near Zöbing',de:'Weinberghänge am Heiligenstein und die Kamptalwarte bei Zöbing',fr:'Coteaux viticoles du Heiligenstein et Kamptalwarte près de Zöbing',es:'Laderas de viñedos de Heiligenstein y Kamptalwarte, cerca de Zöbing'},
    attribution:{author:'Juemumue',filePage:'https://commons.wikimedia.org/wiki/File:Heiligenstein_mit_Kamptalwarte.JPG',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/deed.en',changes:webImageChanges}},
  wagram:{src:wagramKirchbergTerrace,
    position:'50% 70%',tone:'warm',caption:{en:'Autumn vineyard terrace near Kirchberg am Wagram',de:'Herbstliche Weinbergterrasse bei Kirchberg am Wagram',fr:'Terrasse viticole d’automne près de Kirchberg am Wagram',es:'Terraza de viñedos en otoño cerca de Kirchberg am Wagram'},
    attribution:{author:'NothingToSeeHere',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_on_Wagram_terrace_-_near_Kirchberg_am_Wagram_-_Oktober_2015_-_(2).JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  weinviertel:{src:weinviertelVineyards,
    position:'50% 72%',tone:'warm',caption:{en:'Vineyard landscape near Groß-Schweinbarth in the Weinviertel',de:'Weinberglandschaft bei Groß-Schweinbarth im Weinviertel',fr:'Paysage viticole près de Groß-Schweinbarth dans le Weinviertel',es:'Paisaje de viñedos cerca de Groß-Schweinbarth, en el Weinviertel'},
    attribution:{author:'Manuela Gößnitzer',filePage:'https://commons.wikimedia.org/wiki/File:Gro%C3%9F-Schweinbart_Landschaft.JPG',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/deed.en',changes:webImageChanges}},
  villany:{src:villanyVineyards,
    position:'50% 72%',tone:'warm',caption:{en:'Grape plantations near Villány, with Szársomlyó Mountain beyond',de:'Weinberge bei Villány mit dem Berg Szársomlyó im Hintergrund',fr:'Plantations de vigne près de Villány, avec le mont Szársomlyó en arrière-plan',es:'Viñedos cerca de Villány, con el monte Szársomlyó al fondo'},
    attribution:{author:'Cserlajos',filePage:'https://commons.wikimedia.org/wiki/File:Villany,_wine.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  eger:{src:egerVineyard,
    position:'50% 72%',tone:'warm',caption:{en:'Vineyard in Hungary’s Eger wine region',de:'Weinberg im ungarischen Weinbaugebiet Eger',fr:'Vignoble dans la région viticole hongroise d’Eger',es:'Viñedo en la región vinícola de Eger, Hungría'},
    attribution:{author:'Elin',filePage:'https://commons.wikimedia.org/wiki/File:Eger_Vineyard.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  nemea:{src:nemeaVineyardsOlives,
    position:'50% 70%',tone:'warm',caption:{en:'Vineyards and olive groves in the Nemea area of Corinthia',de:'Weinberge und Olivenhaine in der Gegend von Nemea in Korinthia',fr:'Vignobles et oliveraies dans la région de Némée, en Corinthie',es:'Viñedos y olivares en la zona de Nemea, Corintia'},
    attribution:{author:'ulrichstill',filePage:'https://commons.wikimedia.org/wiki/File:Nemea_Wine-Olives_Corinthia_Peloponnese.jpg',license:'CC BY-SA 3.0 DE',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en',changes:webImageChanges}},
  vouvray:{src:vouvrayVineyard,
    position:'50% 72%',tone:'warm',caption:{en:'Vineyard in Vouvray, Loire Valley, after budbreak',de:'Weinberg in Vouvray an der Loire nach dem Austrieb',fr:'Vignoble de Vouvray, dans la vallée de la Loire, après le débourrement',es:'Viñedo en Vouvray, Valle del Loira, tras la brotación'},
    attribution:{author:'Peter Dutton',filePage:'https://commons.wikimedia.org/wiki/File:Vouvray_Vineyard_after_budbreak.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  provence:{src:provenceVineyard,
    position:'50% 70%',tone:'warm',caption:{en:'Vineyard in the Coteaux d’Aix wine region, Provence',de:'Weinberg in der Weinregion Coteaux d’Aix in der Provence',fr:'Vignoble dans la région viticole des Coteaux d’Aix, en Provence',es:'Viñedo en la región vinícola de Coteaux d’Aix, Provenza'},
    attribution:{author:'Teddy Sipaseuth',filePage:'https://commons.wikimedia.org/wiki/File:Aix-en-Provence_vineyard.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'hessische-bergstra-e':{src:hessischeBergstrasseVineyard,
    position:'50% 72%',tone:'warm',caption:{en:'Spring vineyard at Heppenheim in the Hessische Bergstraße',de:'Frühlingsweinberg in Heppenheim an der Hessischen Bergstraße',fr:'Vignoble au printemps à Heppenheim, sur la Bergstraße de Hesse',es:'Viñedo primaveral en Heppenheim, en la Bergstraße de Hesse'},
    attribution:{author:'Jürgen Hamann',filePage:'https://commons.wikimedia.org/wiki/File:Geo-Naturpark_Bergstra%C3%9Fe-Odenwald_Fr%C3%BChling_im_Weinberg_Heppenheim_01.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  valais:{src:valaisVineyard,
    position:'50% 70%',tone:'cool',caption:{en:'Vineyard slopes and Haut de Cry above Chamoson in Valais',de:'Weinberge und der Haut de Cry oberhalb von Chamoson im Wallis',fr:'Vignobles et Haut de Cry au-dessus de Chamoson, en Valais',es:'Viñedos y Haut de Cry sobre Chamoson, en Valais'},
    attribution:{author:'Christian David',filePage:'https://commons.wikimedia.org/wiki/File:Vignoble_et_Haut_de_Cry,_Chamoson,_Valais.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  graubunden:{src:graubundenVineyard,
    position:'50% 72%',tone:'cool',caption:{en:'Vineyard near Maienfeld in Graubünden’s Bündner Herrschaft',de:'Weinberg bei Maienfeld in der Bündner Herrschaft in Graubünden',fr:'Vignoble près de Maienfeld, dans la Bündner Herrschaft des Grisons',es:'Viñedo cerca de Maienfeld, en la Bündner Herrschaft de los Grisones'},
    attribution:{author:'JoachimKohler-HB',filePage:'https://commons.wikimedia.org/wiki/File:Wein_und_Berge_-_Rebst%C3%B6cke_in_der_B%C3%BCndner_Herrschaft_bei_Maienfeld_GR_(2021).jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'vaud-lavaux':{src:vaudLavauxVineyard,
    position:'50% 70%',tone:'cool',caption:{en:'Lavaux vineyard terraces on Lake Geneva with the Swiss Alps beyond',de:'Weinterrassen von Lavaux am Genfersee vor den Schweizer Alpen',fr:'Terrasses viticoles de Lavaux au bord du Léman, avec les Alpes suisses en arrière-plan',es:'Terrazas de viñedo de Lavaux junto al lago Lemán, con los Alpes suizos al fondo'},
    attribution:{author:'Antp1479',filePage:'https://commons.wikimedia.org/wiki/File:Lavaux_vineyards_and_Swiss_Alps.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  sardegna:{src:sardegnaSpiaggiaGrande,
    position:'50% 68%',tone:'warm',caption:{en:'Carignano del Sulcis vines growing in sandy soil on Sant’Antioco, Sardinia',de:'Carignano-del-Sulcis-Reben auf sandigem Boden bei Sant’Antioco auf Sardinien',fr:'Vignes de Carignano del Sulcis sur un sol sableux à Sant’Antioco, en Sardaigne',es:'Viñas de Carignano del Sulcis en suelo arenoso en Sant’Antioco, Cerdeña'},
    attribution:{author:'La Casa di Sophia',filePage:'https://commons.wikimedia.org/wiki/File:Spiaggia_Grande_vineyard_on_a_sandy_soil.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  corsica:{src:corsicaAghioneVineyards,
    position:'50% 58%',tone:'warm',caption:{en:'Vineyard rows at Aghione, Corsica',de:'Weinbergzeilen bei Aghione auf Korsika',fr:'Rangs de vigne à Aghione, en Corse',es:'Hileras de viñas en Aghione, Córcega'},
    attribution:{author:'Mike Prince',filePage:'https://commons.wikimedia.org/wiki/File:Aghione_vignobles.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'rogue-valley':{src:rogueValleyLandscape,
    position:'50% 63%',tone:'cool',caption:{en:'Rogue River Valley near Central Point, with Table Rocks and the western Cascades',de:'Rogue River Valley bei Central Point mit Table Rocks und den westlichen Kaskaden',fr:'Vallée de la Rogue près de Central Point, avec les Table Rocks et les Cascades occidentales',es:'Valle del río Rogue cerca de Central Point, con Table Rocks y las Cascadas occidentales'},
    attribution:{author:'Little Mountain 5',filePage:'https://commons.wikimedia.org/wiki/File:Rogue_Valley.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'cote-chalonnaise':{src:coteChalonnaiseGivry,
    position:'50% 62%',tone:'warm',caption:{en:'Vineyards at Givry in Burgundy’s Côte Chalonnaise',de:'Weinberge bei Givry an der Côte Chalonnaise im Burgund',fr:'Vignobles de Givry, sur la Côte chalonnaise en Bourgogne',es:'Viñedos de Givry, en la Côte Chalonnaise de Borgoña'},
    attribution:{author:'Claude Duroy',filePage:'https://commons.wikimedia.org/wiki/File:Givry_%28S_et_L%29_Vignes.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  maconnais:{src:maconnaisRocheSolutre,
    position:'50% 58%',tone:'warm',caption:{en:'Vineyards below the Rock of Solutré at Solutré-Pouilly, Mâconnais',de:'Weinberge unterhalb des Felsens von Solutré bei Solutré-Pouilly im Mâconnais',fr:'Vignobles au pied de la roche de Solutré, à Solutré-Pouilly dans le Mâconnais',es:'Viñedos al pie de la roca de Solutré, en Solutré-Pouilly, Mâconnais'},
    attribution:{author:'Yelkrokoyade',filePage:'https://commons.wikimedia.org/wiki/File:Roche_Solutr%C3%A9_et_vignoble.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  madiran:{src:madiranCastelnauVineyards,
    position:'50% 63%',tone:'warm',caption:{en:'Vineyard in the Madiran AOC near Castelnau-Rivière-Basse',de:'Weinberg in der Appellation Madiran bei Castelnau-Rivière-Basse',fr:'Vignoble de l’AOC Madiran près de Castelnau-Rivière-Basse',es:'Viñedo de la AOC Madiran cerca de Castelnau-Rivière-Basse'},
    attribution:{author:'Marianne Casamance',filePage:'https://commons.wikimedia.org/wiki/File:Castelnau-Rivi%C3%A8re-Basse_Vignes_de_l%27AOC_madiran.JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  jurancon:{src:juranconVineyards,
    position:'50% 62%',tone:'warm',caption:{en:'Vineyards in Jurançon, in southwest France',de:'Weinberge im Jurançon im Südwesten Frankreichs',fr:'Vignobles du Jurançon, dans le sud-ouest de la France',es:'Viñedos de Jurançon, en el suroeste de Francia'},
    attribution:{author:'Lapastoure Didier',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_in_Jurancon_in_southwest_France.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'cote-des-bar':{src:coteDesBarSpoyVineyard,
    position:'50% 62%',tone:'warm',caption:{en:'Vineyard at Spoy in the Côte des Bar, Champagne',de:'Weinberg in Spoy an der Côte des Bar in der Champagne',fr:'Vignoble de Spoy, dans la Côte des Bar en Champagne',es:'Viñedo de Spoy, en la Côte des Bar de Champaña'},
    attribution:{author:'Pmau',filePage:'https://commons.wikimedia.org/wiki/File:Spoy_-_img_45824.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  aconcagua:{src:aconcaguaLosAndesValley,
    position:'50% 61%',tone:'cool',caption:{en:'Río Aconcagua valley and Los Andes beneath Cerro Mercachas',de:'Tal des Río Aconcagua und Los Andes am Fuß des Cerro Mercachas',fr:'Vallée du Río Aconcagua et Los Andes au pied du Cerro Mercachas',es:'Valle del río Aconcagua y Los Andes bajo el Cerro Mercachas'},
    attribution:{author:'WeHaKa',filePage:'https://commons.wikimedia.org/wiki/File:Los_Andes_y_Cerro_Mercachas.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  veneto:{src:venetoSandroBrunoVineyards,
    position:'50% 69%',tone:'warm',caption:{en:'Vineyards in the Italian wine region of Veneto',de:'Weinberge in der italienischen Weinregion Venetien',fr:'Vignobles de la région viticole italienne de Vénétie',es:'Viñedos de la región vinícola italiana del Véneto'},
    attribution:{author:'Fabio Ingrosso',filePage:'https://commons.wikimedia.org/wiki/File:Sandro_De_Bruno,_vigneti_in_Veneto3.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'hemel-en-aarde':{src:hemelEnAardeBabylonTower,
    position:'50% 64%',tone:'cool',caption:{en:'Hemel-en-Aarde Valley near Hermanus, with Babylon Tower in the background',de:'Hemel-en-Aarde-Tal bei Hermanus mit dem Babylon Tower im Hintergrund',fr:'Vallée de Hemel-en-Aarde près de Hermanus, avec la tour Babylon à l’arrière-plan',es:'Valle de Hemel-en-Aarde cerca de Hermanus, con Babylon Tower al fondo'},
    attribution:{author:'Amada44',filePage:'https://commons.wikimedia.org/wiki/File:Hemel-en-aarde_Valley_-Babylon_Tower.jpg',license:'Public domain',licenseUrl:'https://commons.wikimedia.org/wiki/Template:PD-self',changes:webImageChanges}},
  'annapolis-valley':{src:annapolisLuckettVineyards,
    position:'50% 70%',tone:'cool',caption:{en:'Luckett Vineyards in Gaspereau Valley, Nova Scotia',de:'Weinberge von Luckett Vineyards im Gaspereau-Tal, Nova Scotia',fr:'Vignoble Luckett dans la vallée de Gaspereau, en Nouvelle-Écosse',es:'Viñedos de Luckett en el valle de Gaspereau, Nueva Escocia'},
    attribution:{author:'gLangille',filePage:'https://commons.wikimedia.org/wiki/File:Luckett_Vineyards_Gaspereau_Valley_Nova_Scotia_Canada.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0',changes:webImageChanges}},
  geneva:{src:genevaRussinVineyard,
    position:'50% 45%',tone:'cool',caption:{en:'Vineyard at Russin railway station in Geneva',de:'Weinberg am Bahnhof Russin in Genf',fr:'Vignoble à la gare de Russin, à Genève',es:'Viñedo junto a la estación de Russin, en Ginebra'},
    attribution:{author:'Guilhem Vellut',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_%40_Gare_de_Russin_%40_Geneva_(50403169353).jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  ticino:{src:ticinoBellinzonaVineyards,
    position:'50% 58%',tone:'cool',caption:{en:'Vineyards on the slopes below Castelgrande in Bellinzona, Ticino',de:'Weinberge unterhalb von Castelgrande in Bellinzona, Tessin',fr:'Vignobles sous Castelgrande à Bellinzone, au Tessin',es:'Viñedos bajo Castelgrande, en Bellinzona, Tesino'},
    attribution:{author:'Domenico Convertini',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_in_Bellinzona.jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'three-lakes':{src:threeLakesTwannVineyards,
    position:'50% 62%',tone:'warm',caption:{en:'Autumn vineyards at Twann beside Lake Biel',de:'Herbstliche Weinberge bei Twann am Bielersee',fr:'Vignobles d’automne à Twann, au bord du lac de Bienne',es:'Viñedos otoñales en Twann, junto al lago de Bienne'},
    attribution:{author:'Ligong Wang',filePage:'https://commons.wikimedia.org/wiki/File:Vineyards_in_Twann.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'campanha-gaucha':{src:campanhaAlegreteLandscape,
    position:'50% 55%',tone:'warm',caption:{en:'Countryside near Alegrete in the Campanha Gaúcha',de:'Landschaft bei Alegrete in der Campanha Gaúcha',fr:'Paysage près d’Alegrete dans la Campanha Gaúcha',es:'Paisaje cerca de Alegrete, en la Campanha Gaúcha'},
    attribution:{author:'Kiko Lopes',filePage:'https://commons.wikimedia.org/wiki/File:Campanha_Ga%C3%BAcha_._Alegrete_(4921445782).jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  kent:{src:kentEcclesVineyard,
    position:'50% 58%',tone:'warm',caption:{en:'Vineyard between Eccles and Kit’s Coty in Kent',de:'Weinberg zwischen Eccles und Kit’s Coty in Kent',fr:'Vignoble entre Eccles et Kit’s Coty, dans le Kent',es:'Viñedo entre Eccles y Kit’s Coty, en Kent'},
    attribution:{author:'Simon Burchell',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_between_Eccles_and_Kit%27s_Coty_01.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'kras-istria':{src:krasNanosVineyards,
    position:'50% 62%',tone:'cool',caption:{en:'Autumn vineyards in Slovenia’s Kras region, with Mount Nanos beyond',de:'Herbstliche Weinberge im slowenischen Karst mit dem Berg Nanos im Hintergrund',fr:'Vignobles d’automne dans le Kras slovène, avec le mont Nanos au loin',es:'Viñedos otoñales del Karst esloveno, con el monte Nanos al fondo'},
    attribution:{author:'Ziga',filePage:'https://commons.wikimedia.org/wiki/File:Kras-Nanos-jesen.JPG',license:'Public domain',licenseUrl:'https://commons.wikimedia.org/wiki/Template:PD-self',changes:webImageChanges}},
  vipava:{src:vipavaValleyVineyards,
    position:'50% 62%',tone:'warm',caption:{en:'Autumn vineyard landscape in Slovenia’s Vipava Valley',de:'Herbstliche Weinberglandschaft im slowenischen Vipava-Tal',fr:'Paysage de vignobles d’automne dans la vallée slovène de Vipava',es:'Paisaje de viñedos otoñales en el valle esloveno de Vipava'},
    attribution:{author:'yoyo61',filePage:'https://commons.wikimedia.org/wiki/File:Autumn-1758133.jpg',license:'CC0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',changes:webImageChanges}},
  'racha-lechkhumi':{src:rachaCaucasusLandscape,
    position:'50% 50%',tone:'cool',caption:{en:'Mountain landscape over Racha and Lechkhumi, Georgia',de:'Gebirgslandschaft über Racha und Lechchumi in Georgien',fr:'Paysage montagneux de Racha et Lechkhumi, en Géorgie',es:'Paisaje montañoso de Racha y Lechkhumi, Georgia'},
    attribution:{author:'Jelger Groeneveld',filePage:'https://commons.wikimedia.org/wiki/File:View_over_Racha_at_Nikortsminda.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  kartli:{src:kartliMtkvariValley,
    position:'50% 58%',tone:'warm',caption:{en:'Mtkvari valley and the Trialeti Range near Gori, Shida Kartli',de:'Mtkvari-Tal und Trialeti-Gebirge bei Gori in Schida Kartli',fr:'Vallée du Mtkvari et massif de Trialeti près de Gori, en Chida Kartli',es:'Valle del Mtkvari y cordillera de Trialeti cerca de Gori, en Shida Kartli'},
    attribution:{author:'Yuri Samoylov',filePage:'https://commons.wikimedia.org/wiki/File:2022-09-27_View_of_Mtkvari_valley_and_Trialeti_Range.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  ningxia:{src:ningxiaHelanBaisikou,
    position:'50% 55%',tone:'cool',caption:{en:'Helan Mountains viewed from Baisikou near Yinchuan, Ningxia',de:'Helan-Gebirge vom Baisikou nahe Yinchuan in Ningxia',fr:'Monts Helan vus depuis Baisikou, près de Yinchuan au Ningxia',es:'Montañas Helan desde Baisikou, cerca de Yinchuan, Ningxia'},
    attribution:{author:'BabelStone',filePage:'https://commons.wikimedia.org/wiki/File:Helan_Montains_at_Baisikou_A.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  thrace:{src:thraceTekirdagPark,
    position:'50% 60%',tone:'cool',caption:{en:'Coastal hills near Tekirdağ in Turkish Thrace',de:'Küstenhügel bei Tekirdağ in der türkischen Region Thrakien',fr:'Collines côtières près de Tekirdağ, en Thrace turque',es:'Colinas costeras cerca de Tekirdağ, en la Tracia turca'},
    attribution:{author:'Gamerlad88',filePage:'https://commons.wikimedia.org/wiki/File:Tekirda%C4%9F_Kartaltepe_Natural_Park.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  shandong:{src:shandongYantaiShorefront,
    position:'50% 56%',tone:'cool',caption:{en:'Yantai shorefront on the coast of Shandong, China',de:'Uferpromenade von Yantai an der Küste von Shandong, China',fr:'Front de mer de Yantai, sur la côte du Shandong en Chine',es:'Paseo marítimo de Yantai, en la costa de Shandong, China'},
    attribution:{author:'S. T. Fullerton',filePage:'https://commons.wikimedia.org/wiki/File:Yantai_Coastal_View.jpg',license:'Copyrighted free use',licenseUrl:'https://commons.wikimedia.org/wiki/Template:Copyrighted_free_use',changes:webImageChanges}},
  cappadocia:{src:cappadociaRoseValley,
    position:'50% 50%',tone:'warm',caption:{en:'Aktepe Hill above Rose Valley near Göreme, Cappadocia',de:'Aktepe-Hügel im Rosental nahe Göreme in Kappadokien',fr:'Colline d’Aktepe dans la vallée des Roses, près de Göreme en Cappadoce',es:'Colina Aktepe en el Valle Rosa, cerca de Göreme, Capadocia'},
    attribution:{author:'Bjørn Christian Tørrissen',filePage:'https://commons.wikimedia.org/wiki/File:Cappadocia_Aktepe_Panorama.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'commandaria-troodos':{src:troodosRedObservatory,
    position:'50% 52%',tone:'cool',caption:{en:'Troodos Mountains from the Red Observation Platform, Cyprus',de:'Troodos-Gebirge von der Roten Aussichtsplattform auf Zypern',fr:'Monts Troodos depuis la plateforme d’observation rouge, à Chypre',es:'Montes Troodos desde el mirador Rojo, en Chipre'},
    attribution:{author:'Diego Delso (delso.photo)',authorUrl:'https://www.delso.photo/',filePage:'https://commons.wikimedia.org/wiki/File:Vista_de_los_montes_de_Troodos_desde_el_observatorio_Rojo,_Chipre,_2021-12-13,_DD_01.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  aegean:{src:aegeanSirinceVillage,
    position:'50% 61%',tone:'warm',caption:{en:'The village of Şirince in İzmir Province, Turkey’s Aegean Region',de:'Das Dorf Şirince in der türkischen Ägäisregion, Provinz İzmir',fr:'Le village de Şirince, dans la province d’İzmir en région égéenne de Turquie',es:'El pueblo de Şirince, en la provincia de İzmir, región del Egeo turco'},
    attribution:{author:'Helen Owl',filePage:'https://commons.wikimedia.org/wiki/File:%C5%9Eirince,_visible_city.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  posavje:{src:posavjeBizeljskoLandscape,
    position:'50% 64%',tone:'cool',caption:{en:'View over Bizeljsko from the Vitus Way in Slovenia’s Posavje wine region',de:'Blick vom Vitusweg über Bizeljsko in der slowenischen Weinregion Posavje',fr:'Vue sur Bizeljsko depuis le chemin de Vitus, dans la région viticole slovène de Posavje',es:'Vista de Bizeljsko desde la ruta de Vitus, en la región vinícola eslovena de Posavje'},
    attribution:{author:'Janezdrilc',filePage:'https://commons.wikimedia.org/wiki/File:Bizeljsko_iz_Vidove_poti.jpg',license:'CC0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/deed.en',changes:webImageChanges}},
  imereti:{src:imeretiKutaisiVineyard,
    position:'50% 58%',tone:'warm',caption:{en:'A vineyard east of Kutaisi in Imereti, photographed in 1964',de:'Ein Weinberg östlich von Kutaissi in Imeretien, 1964 fotografiert',fr:'Vignoble à l’est de Koutaïssi, en Iméréthie, photographié en 1964',es:'Viñedo al este de Kutaisi, en Imereti, fotografiado en 1964'},
    attribution:{author:'Jacques Dupakiers',filePage:'https://commons.wikimedia.org/wiki/File:25_-_Vineyard_east_of_Kutaisi.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  mantinia:{src:mantiniaMantineiaPlateau,
    position:'50% 64%',tone:'cool',caption:{en:'Agricultural landscape on the Mantineia plateau near Milea, Arcadia, Greece',de:'Landwirtschaftliche Landschaft auf der Hochebene von Mantineia bei Milea, Arkadien',fr:'Paysage agricole sur le plateau de Mantinée, près de Milea, en Arcadie',es:'Paisaje agrícola en la meseta de Mantinea, cerca de Milea, Arcadia'},
    attribution:{author:'ulrichstill',filePage:'https://commons.wikimedia.org/wiki/File:Mantinea_Arcadia_Peloponnese_Greece.jpg',license:'CC BY-SA 3.0 DE',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/de/deed.en',changes:webImageChanges}},
  naoussa:{src:naoussaVermioMountain,
    position:'50% 55%',tone:'cool',caption:{en:'Mount Vermio viewed from Kopanos in the Naoussa area of Greece',de:'Blick von Kopanos im Gebiet Naoussa auf den Vermio in Griechenland',fr:'Mont Vermio vu depuis Kopanos, dans la région de Naoussa en Grèce',es:'Monte Vermio visto desde Kopanos, en la zona de Naoussa, Grecia'},
    attribution:{author:'Македонец',filePage:'https://commons.wikimedia.org/wiki/File:%D0%9A%D0%B0%D1%80%D0%B0%D0%BA%D0%B0%D0%BC%D0%B5%D0%BD_%D0%9F%D0%BB%D0%B0%D0%BD%D0%B8%D0%BD%D0%B0_(%D0%9D%D0%B5%D0%B3%D1%83%D1%88%D0%BA%D0%BE).jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  rivera:{src:riveraLunarejoLandscape,
    position:'50% 62%',tone:'cool',caption:{en:'Landscape of Valle del Lunarejo in Rivera, Uruguay',de:'Landschaft im Lunarejo-Tal in Rivera, Uruguay',fr:'Paysage de la vallée du Lunarejo, à Rivera, en Uruguay',es:'Paisaje del valle del Lunarejo, en Rivera, Uruguay'},
    attribution:{author:'Analía Mosqueira',filePage:'https://commons.wikimedia.org/wiki/File:Verde_por_naturaleza_en_Valle_del_Lunarejo,_Rivera.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  maldonado:{src:maldonadoLasFloresCoast,
    position:'50% 60%',tone:'cool',caption:{en:'Coastal landscape near Las Flores, Maldonado, Uruguay',de:'Küstenlandschaft bei Las Flores, Maldonado, Uruguay',fr:'Paysage côtier près de Las Flores, dans le département de Maldonado, Uruguay',es:'Paisaje costero cerca de Las Flores, Maldonado, Uruguay'},
    attribution:{author:'Arturettenberger',filePage:'https://commons.wikimedia.org/wiki/File:Las_Flores_Landscape_Maldonado_Uruguay.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  gisborne:{src:gisbornePovertyBay,
    position:'50% 50%',tone:'cool',caption:{en:'Poverty Bay from the Kaiti Hill lookout in Gisborne, New Zealand',de:'Poverty Bay vom Aussichtspunkt auf Kaiti Hill in Gisborne, Neuseeland',fr:'Poverty Bay depuis le belvédère de Kaiti Hill à Gisborne, Nouvelle-Zélande',es:'Bahía Poverty desde el mirador de Kaiti Hill, en Gisborne, Nueva Zelanda'},
    attribution:{author:'Pseudopanax',filePage:'https://commons.wikimedia.org/wiki/File:View_over_Poverty_Bay_from_Kaiti_Hill_lookout.jpg',license:'Public domain',licenseUrl:'https://commons.wikimedia.org/wiki/Template:PD-self',changes:webImageChanges}},
  nelson:{src:nelsonRichmondView,
    position:'50% 58%',tone:'cool',caption:{en:'Richmond and Nelson viewed from the southeast, New Zealand',de:'Richmond und Nelson aus südöstlicher Richtung, Neuseeland',fr:'Richmond et Nelson vus du sud-est, en Nouvelle-Zélande',es:'Richmond y Nelson vistos desde el sureste, Nueva Zelanda'},
    attribution:{author:'Ingolfson',filePage:'https://commons.wikimedia.org/wiki/File:Richmond_And_Nelson_From_Southeast.jpg',license:'Public domain',licenseUrl:'https://commons.wikimedia.org/wiki/Template:PD-self',changes:webImageChanges}},
  'umpqua-valley':{src:umpquaRoseburgRiver,
    position:'50% 55%',tone:'cool',caption:{en:'South Umpqua River at Roseburg in Oregon’s Umpqua Valley',de:'South Umpqua River bei Roseburg im Umpqua Valley, Oregon',fr:'Rivière South Umpqua à Roseburg, dans la vallée de l’Umpqua en Oregon',es:'Río South Umpqua en Roseburg, en el valle de Umpqua, Oregón'},
    attribution:{author:'Gary Halvorson, Oregon State Archives',filePage:'https://commons.wikimedia.org/wiki/File:South_Umpqua_River,_Roseburg_-_DPLA_-_cbed6372e39ece0b85f523f634c8922a.jpg',license:'CC BY 4.0',licenseUrl:'https://creativecommons.org/licenses/by/4.0/',changes:webImageChanges}},
  itata:{src:itataNipasRiver,
    position:'50% 58%',tone:'warm',caption:{en:'Ñipas and the Itata River in Chile’s Itata Province',de:'Ñipas und der Río Itata in Chiles Provinz Itata',fr:'Ñipas et la rivière Itata dans la province chilienne d’Itata',es:'Ñipas y el río Itata en la provincia chilena de Itata'},
    attribution:{author:'Farisori',filePage:'https://commons.wikimedia.org/wiki/File:Nipas_y_rio_Itata.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'nandi-hills':{src:nandiHillsSunrise,
    position:'50% 58%',tone:'warm',caption:{en:'Sunrise above the clouds at Nandi Hills near Bengaluru, India',de:'Sonnenaufgang über den Wolken bei Nandi Hills nahe Bengaluru, Indien',fr:'Lever de soleil au-dessus des nuages à Nandi Hills, près de Bengaluru',es:'Amanecer sobre las nubes en Nandi Hills, cerca de Bengaluru, India'},
    attribution:{author:'Sidhant Soni',filePage:'https://commons.wikimedia.org/wiki/File:Nandi_Hills,_Bengaluru.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  somlo:{src:somloHillVineyards,
    position:'50% 62%',tone:'warm',caption:{en:'Somló Hill above the vineyards in Hungary',de:'Der Somló-Hügel über den Weinbergen in Ungarn',fr:'La colline de Somló au-dessus des vignobles en Hongrie',es:'La colina de Somló sobre los viñedos de Hungría'},
    attribution:{author:'fabiolah',filePage:'https://commons.wikimedia.org/wiki/File:Soml%C3%B3_hill_-_panoramio.jpg',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  crete:{src:creteLakeKournas,
    position:'50% 55%',tone:'cool',caption:{en:'Lake Kournas and its mountain shore on Crete, Greece',de:'Der Kournas-See und sein Bergufer auf Kreta, Griechenland',fr:'Le lac de Kournás et son relief montagneux en Crète, Grèce',es:'El lago Kournás y su orilla montañosa en Creta, Grecia'},
    attribution:{author:'Tanya Dedyukhina',filePage:'https://commons.wikimedia.org/wiki/File:Lake_Kournas_-_panoramio.jpg',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  batroun:{src:batrounBejdarfelOliveOrchards,
    position:'50% 62%',tone:'warm',caption:{en:'Olive orchards above Bijdarfel–Batroun in northern Lebanon',de:'Olivenhaine oberhalb von Bijdarfel–Batroun im Norden des Libanon',fr:'Oliveraies au-dessus de Bijdarfel–Batroun, dans le nord du Liban',es:'Olivares sobre Bijdarfel–Batroun, en el norte del Líbano'},
    attribution:{author:'Serge Melki',filePage:'https://commons.wikimedia.org/wiki/File:Bijdarfel_-_Batroun_(2309089114).jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'judean-hills':{src:judeanHillsMataVineyard,
    position:'50% 60%',tone:'cool',caption:{en:'Early-spring vineyard near Moshav Mata in the Judean Mountains, Israel',de:'Weinberg im zeitigen Frühjahr bei Moshav Mata im Judäischen Gebirge, Israel',fr:'Vignoble au début du printemps près du moshav Mata, dans les monts de Judée, en Israël',es:'Viñedo a comienzos de primavera cerca del moshav Mata, en los montes de Judea, Israel'},
    attribution:{author:'Davidbena',filePage:'https://commons.wikimedia.org/wiki/File:Vineyard_in_the_Judean_Mountains.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  podravje:{src:podravjeHrastjeVineyard,
    position:'50% 58%',tone:'cool',caption:{en:'Vineyard at Hrastje near Maribor in Slovenia’s Podravje wine region',de:'Weinberg bei Hrastje nahe Maribor in der slowenischen Weinregion Podravje',fr:'Vignoble à Hrastje, près de Maribor, dans la région viticole slovène de Podravje',es:'Viñedo en Hrastje, cerca de Maribor, en la región vinícola eslovena de Podravje'},
    attribution:{author:'breki74',filePage:'https://commons.wikimedia.org/wiki/File:Vinograd_pri_Hrastju_(3).jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  'dalmatia-peljesac':{src:dalmatiaPeljesacVineyard,
    position:'50% 66%',tone:'warm',caption:{en:'Vineyard on the Pelješac peninsula, Croatia',de:'Weinberg auf der Halbinsel Pelješac in Kroatien',fr:'Vignoble sur la péninsule de Pelješac, en Croatie',es:'Viñedo en la península de Pelješac, Croacia'},
    attribution:{author:'Quahadi Añtó',filePage:'https://commons.wikimedia.org/wiki/File:Vinograd_,_Peli%C5%A1ac03498.JPG',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'slavonia-kutjevo':{src:slavoniaKutjevoAbbey,
    position:'50% 52%',tone:'warm',caption:{en:'Kutjevo Abbey in Croatia’s Slavonia region',de:'Die Abtei Kutjevo in der kroatischen Region Slawonien',fr:'L’abbaye de Kutjevo, dans la région croate de Slavonie',es:'La abadía de Kutjevo, en la región croata de Eslavonia'},
    attribution:{author:'Dalibor Ribičić',filePage:'https://commons.wikimedia.org/wiki/File:Kutjevo_01.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  monticello:{src:monticelloNortheastVineyard,
    position:'50% 70%',tone:'warm',caption:{en:'The Northeast Vineyard and Garden Pavilion at Monticello, Virginia',de:'Der Northeast Vineyard und der Gartenpavillon von Monticello in Virginia',fr:'Le Northeast Vineyard et le pavillon du jardin de Monticello, en Virginie',es:'El viñedo noreste y el pabellón del jardín de Monticello, Virginia'},
    attribution:{author:'Tony (Paterson, NJ)',filePage:'https://commons.wikimedia.org/wiki/File:Montecello_vineyard.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  styria:{src:styriaStStefanVineyard,
    position:'50% 60%',tone:'cool',caption:{en:'A hillside vineyard in St. Stefan ob Stainz, Styria, Austria',de:'Ein Weinberg am Hang in St. Stefan ob Stainz, Steiermark, Österreich',fr:'Un vignoble à flanc de coteau à St. Stefan ob Stainz, en Styrie',es:'Viñedo en una ladera de St. Stefan ob Stainz, Estiria, Austria'},
    attribution:{author:'Eligiusz Jakimowicz',filePage:'https://commons.wikimedia.org/wiki/File:Grape_growing_in_Styria4.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  aragatsotn:{src:aragatsotnMountAragats,
    position:'50% 56%',tone:'cool',caption:{en:'Mount Aragats in Aragatsotn, Armenia',de:'Der Berg Aragats in Aragatsotn, Armenien',fr:'Le mont Aragats, dans la province d’Aragatsotn en Arménie',es:'El monte Aragats en Aragatsotn, Armenia'},
    attribution:{author:'Alexander Mkhitaryan B',filePage:'https://commons.wikimedia.org/wiki/File:Aragats_mountain,_Aragatsotn,_Armenia.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  jerez:{src:jerezSolanaChicaVineyards,
    position:'50% 58%',tone:'warm',caption:{en:'Vineyards at Viña Solana Chica in Jerez de la Frontera, Spain',de:'Weinberge der Viña Solana Chica in Jerez de la Frontera, Spanien',fr:'Vignobles de la Viña Solana Chica à Jerez de la Frontera, en Espagne',es:'Viñedos de Viña Solana Chica en Jerez de la Frontera, España'},
    attribution:{author:'El Pantera',filePage:'https://commons.wikimedia.org/wiki/File:Puesta_de_sol_Vi%C3%B1edos_en_Jerez_de_la_Frontera_-_P1240095.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  marsala:{src:marsalaSaltPansSunset,
    position:'50% 54%',tone:'warm',caption:{en:'Marsala salt pans at sunset, Sicily',de:'Die Salinen von Marsala bei Sonnenuntergang auf Sizilien',fr:'Les salines de Marsala au coucher du soleil, en Sicile',es:'Las salinas de Marsala al atardecer, en Sicilia'},
    attribution:{author:'29C',filePage:'https://commons.wikimedia.org/wiki/File:Tramonto_Saline_di_Marsala.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  dao:{src:daoViseuWineCenter,
    position:'50% 50%',tone:'warm',caption:{en:'Solar do Vinho do Dão, the region’s wine-route welcome center in Viseu',de:'Solar do Vinho do Dão, das Besucherzentrum der Weinroute in Viseu',fr:'Solar do Vinho do Dão, centre d’accueil de la route des vins à Viseu',es:'Solar do Vinho do Dão, centro de bienvenida de la ruta del vino en Viseu'},
    attribution:{author:'Vitor Oliveira',filePage:'https://commons.wikimedia.org/wiki/File:Solar_do_Vinho_do_D%C3%A3o_-_Viseu_-_Portugal_(53308981815).jpg',license:'CC BY-SA 2.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',changes:webImageChanges}},
  vienna:{src:viennaWildgrubgasseVineyard,
    position:'50% 61%',tone:'cool',caption:{en:'Vineyard along Wildgrubgasse in Vienna, Austria',de:'Weinberg an der Wildgrubgasse in Wien, Österreich',fr:'Vignoble le long de la Wildgrubgasse à Vienne, en Autriche',es:'Viñedo junto a Wildgrubgasse en Viena, Austria'},
    attribution:{author:'GT1976',filePage:'https://commons.wikimedia.org/wiki/File:2019-09-19_%28113%29_Wiener_Stadtwanderweg_1_-_Vineyard_at_Wildgrubgasse,_Vienna,_Austria.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  burgenland:{src:burgenlandMoerbisch,
    position:'50% 60%',tone:'cool',caption:{en:'Mörbisch am See and Lake Neusiedl in Burgenland, Austria',de:'Mörbisch am See und der Neusiedler See im österreichischen Burgenland',fr:'Mörbisch am See et le lac de Neusiedl dans le Burgenland autrichien',es:'Mörbisch am See y el lago Neusiedl en Burgenland, Austria'},
    attribution:{author:'Wolfgang Glock',filePage:'https://commons.wikimedia.org/wiki/File:Moerbisch_von_Westen.jpg',license:'CC BY 3.0',licenseUrl:'https://creativecommons.org/licenses/by/3.0/',changes:webImageChanges}},
  toro:{src:toroDueroLookout,
    position:'50% 55%',tone:'warm',caption:{en:'The Duero River and Toro Bridge from the Espolón viewpoint, Spain',de:'Der Duero und die Brücke von Toro, gesehen vom Aussichtspunkt Espolón in Spanien',fr:'Le Douro et le pont de Toro vus depuis le belvédère de l’Espolón, en Espagne',es:'El Duero y el puente de Toro vistos desde el mirador del Espolón, España'},
    attribution:{author:'Zyllan Fotografía',filePage:'https://commons.wikimedia.org/wiki/File:El_Duero_desde_el_mirador_de_Toro.jpg',license:'CC BY 2.0',licenseUrl:'https://creativecommons.org/licenses/by/2.0/',changes:webImageChanges}},
  'galilee-golan-heights':{src:galileeHulaGolanPanorama,
    position:'50% 55%',tone:'cool',caption:{en:'Galilee Panhandle, Hula Valley, Golan Heights and Mount Hermon from the Naftali Mountains',de:'Galiläischer Finger, Hula-Tal, Golanhöhen und Berg Hermon von den Naftali-Bergen aus',fr:'Le doigt de Galilée, la vallée de la Houla, le plateau du Golan et le mont Hermon vus des monts de Nephtali',es:'La franja de Galilea, el valle de Hula, los Altos del Golán y el monte Hermón desde los montes Naftali'},
    attribution:{author:'בר',filePage:'https://commons.wikimedia.org/wiki/File:The_view_of_the_Galilee_Panhandle_from_Naftali_Mountains_to_the_Hula_Valley,_the_Golan_Heights_and_the_Hermon_Range.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',changes:webImageChanges}},
  'rioja-oriental':{src:riojaOrientalAldeanueva,
    position:'50% 58%',tone:'warm',caption:{en:'Vineyards at Aldeanueva de Ebro in Rioja Oriental, Spain',de:'Weinberge bei Aldeanueva de Ebro in der Rioja Oriental, Spanien',fr:'Vignobles à Aldeanueva de Ebro, dans la Rioja Oriental, en Espagne',es:'Viñedos en Aldeanueva de Ebro, en la Rioja Oriental, España'},
    attribution:{author:'Zarateman',filePage:'https://commons.wikimedia.org/wiki/File:Aldeanueva_de_Ebro_-_vi%C3%B1edos_2.jpg',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/deed.en',changes:webImageChanges}},
  bairrada:{src:bairradaCuriaHotel,
    position:'50% 58%',tone:'warm',caption:{en:'Hotel Termas da Curia and its grounds in Portugal’s Bairrada region',de:'Hotel Termas da Curia und seine Parkanlage in der portugiesischen Weinregion Bairrada',fr:'L’hôtel Termas da Curia et son parc dans la région portugaise de Bairrada',es:'Hotel Termas da Curia y sus jardines en la región portuguesa de Bairrada'},
    attribution:{author:'Vitor Oliveira',filePage:'https://commons.wikimedia.org/wiki/File:Hotel_Termas_da_Curia_-_Portugal_%F0%9F%87%B5%F0%9F%87%B9_(54783947285).jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  kremstal:{src:kremstalSenftenberg,
    position:'50% 54%',tone:'cool',caption:{en:'View from Senftenberg Castle toward Imbach in the Kremstal, Austria',de:'Blick von der Burgruine Senftenberg auf Imbach im Kremstal, Österreich',fr:'Vue de Senftenberg vers Imbach, dans le Kremstal autrichien',es:'Vista desde el castillo de Senftenberg hacia Imbach, en el Kremstal austríaco'},
    attribution:{author:'Isiwal',filePage:'https://commons.wikimedia.org/wiki/File:Senftenberg_Blick_von_der_Burgruine_nach_Imbach-3556.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  plesivica:{src:plesivicaVineyards,
    position:'50% 62%',tone:'warm',caption:{en:'Vineyards in the Plešivica winegrowing area, Croatia',de:'Weinberge im Weinbaugebiet Plešivica in Kroatien',fr:'Vignobles de la région viticole de Plešivica, en Croatie',es:'Viñedos de la región vitícola de Plešivica, Croacia'},
    attribution:{author:'Zrilezrno',filePage:'https://commons.wikimedia.org/wiki/File:Ple%C5%A1ivica,_vinogorje.jpg',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
  'lisboa-tejo':{src:lisboaTejoSantarem,
    position:'50% 55%',tone:'cool',caption:{en:'The Tagus (Tejo) River seen from Santarém, Portugal',de:'Der Tejo bei Santarém in Portugal',fr:'Le Tage (Tejo) vu depuis Santarém, au Portugal',es:'El río Tajo (Tejo) visto desde Santarém, Portugal'},
    attribution:{author:'Fulviusbsas',filePage:'https://commons.wikimedia.org/wiki/File:SantaremTejo.jpg',license:'Public domain',licenseUrl:'https://commons.wikimedia.org/wiki/Template:PD-self',changes:webImageChanges}},
  vittoria:{src:vittoriaTeatroComunale,
    position:'50% 58%',tone:'warm',caption:{en:'Teatro Comunale Vittoria Colonna and Piazza del Popolo in Vittoria, Sicily',de:'Teatro Comunale Vittoria Colonna und Piazza del Popolo in Vittoria auf Sizilien',fr:'Le Teatro Comunale Vittoria Colonna et la Piazza del Popolo à Vittoria, en Sicile',es:'El Teatro Comunale Vittoria Colonna y la Piazza del Popolo de Vittoria, Sicilia'},
    attribution:{author:'AntonioMancaniello',filePage:'https://commons.wikimedia.org/wiki/File:Vittoria_-_Teatro_comunale_Vittoria_Colonna.JPG',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',changes:webImageChanges}},
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
