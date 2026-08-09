import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Link,
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CircleUserRound,
  Compass,
  Filter,
  Grape,
  GripVertical,
  Library,
  Languages,
  Layers3,
  ListFilter,
  LockKeyhole,
  Map as MapIcon,
  Menu,
  NotebookPen,
  Plus,
  RotateCcw,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Wine,
  X,
} from "lucide-react";
import {
  aromas,
  articles,
  counts,
  grapes,
  producers,
  regions,
  slugify,
  wines,
} from "./data/catalog";
import { repository } from "./data/repository";
import { localeRegistry, useLocale, usePageCopy, type Locale } from "./i18n";
import { aromaContent, articleContent, countryLabel, grapeContent, producerContent, regionContent, regionName, styleLabel, wineContent } from "./localizedContent";
import { useUiCopy } from "./uiCopy";
import { useAuth } from "./auth";
import { CommunityRating } from "./CommunityRating";
import { RegionTerroirStudio, GrapeExpressionLab } from "./KnowledgeInteractions";
import { WineBottleArt } from "./WineBottleArt";
import type { Aroma, CellarItem, MembershipRole, TastingChapter, TastingChapterType, TastingJourney, WineStyle } from "./types";
import vineyardHero from "./assets/vineyard-terraces.jpg";
import tastingStill from "./assets/tasting-still-life.jpg";
import terroirIllustration from "./assets/terroir-cross-section.jpg";
import aromaReference from "./assets/aroma-reference-table.jpg";
import winemakingJourney from "./assets/winemaking-journey.jpg";
import soilAtlas from "./assets/vineyard-soil-atlas.jpg";
import bottleForms from "./assets/wine-bottle-forms.jpg";
import vineSeasonStudy from "./assets/vine-season-study.jpg";
import mediterraneanVines from "./assets/region-mediterranean-vines.jpg";
import andesVineyard from "./assets/region-andes-vineyard.jpg";
import maritimeVineyard from "./assets/region-maritime-vineyard.jpg";
import volcanicVineyard from "./assets/region-volcanic-vineyard.jpg";
import riverSlateVineyard from "./assets/region-river-slate.jpg";
import estuaryLimestoneVineyard from "./assets/region-estuary-limestone.jpg";
import alpineLakeVineyard from "./assets/region-alpine-lake.jpg";
import ancientBushVines from "./assets/region-ancient-bush-vines.jpg";
import coastalFogVineyard from "./assets/region-coastal-fog.jpg";
import volcanicAltitudeVineyard from "./assets/region-volcanic-altitude.jpg";
import windsweptIslandVineyard from "./assets/region-windswept-island.jpg";
import continentalPlateauVineyard from "./assets/region-continental-plateau.jpg";
import bordeauxEstuaryVineyard from "./assets/region-bordeaux-estuary.jpg";
import marlboroughWairauVineyard from "./assets/region-marlborough-wairau.jpg";
import { AtlasCommercialPlacements, BusinessAdminPanel, EventDetail, EventsMarketplace, FeaturedBusinessHome, HostProfile, PartnerProfilePage, ProducerBusinessLayer, StudioEvents, StudioHome, StudioOffers, StudioPlacements, StudioProfile, StudioSite, WineMerchantOffers } from "./BusinessPlatform";
import { AcademyMasterclass, GrapeAmpelography, GrapeDeepDive, ProducerDecisionMap, RegionFieldGuide, WineEvolutionLesson } from "./LearningDepth";
import { InlineLearningChapter, LearningHub, LearningLesson, learningUi } from "./LearningSystem";
import { learningBlockById, learningModuleById, learningModules } from "./learningCurriculum";
import { guideImage } from "./learningGuideMedia";
import { ReferenceGuideExperience } from "./ReferenceGuideExperience";
import { BlendConnections } from "./BlendConnections";
import { AtlasLensControls, CompareButton, RegionCompare, atlasMarkerStyle, type AtlasLens } from "./AtlasIntelligence";
import { TastingHostConsole } from "./TastingHostConsole";
import { VineToGlassExperience } from "./VineToGlassExperience";
import { GuideDepthBridge } from "./GuideDepthBridge";

const CellarExperience = lazy(() => import("./CellarExperience").then(module => ({ default:module.CellarExperience })))
const ConnectedTastingRoom = lazy(() => import("./ConnectedTastingRoom").then(module => ({ default:module.ConnectedTastingRoom })))
const DatabaseStatus = lazy(() => import("./DatabaseStatus").then(module => ({ default:module.DatabaseStatus })))
const AuditTrail = lazy(() => import("./AuditTrail").then(module => ({ default:module.AuditTrail })))
const EditorialStudio = lazy(() => import("./EditorialStudio").then(module => ({ default:module.EditorialStudio })))
const AccountRoleManager = lazy(() => import("./AccountRoleManager").then(module => ({ default:module.AccountRoleManager })))
const AdminOperationsOverview = lazy(() => import("./AdminOperationsOverview").then(module => ({ default:module.AdminOperationsOverview })))

function Deferred({children}:{children:ReactNode}){
  return <Suspense fallback={<div className="app-bootstrap" aria-busy="true"><span /></div>}>{children}</Suspense>
}

type RegionHeroScene={src:string;position:string;tone:'deep'|'soft'|'cool'|'warm'}

const regionHeroScenes={
  terraces:{src:vineyardHero,position:'52% center',tone:'deep'},
  mediterranean:{src:mediterraneanVines,position:'58% center',tone:'warm'},
  andes:{src:andesVineyard,position:'58% center',tone:'cool'},
  maritime:{src:maritimeVineyard,position:'58% center',tone:'cool'},
  volcanicIsland:{src:volcanicVineyard,position:'54% center',tone:'deep'},
  riverSlate:{src:riverSlateVineyard,position:'48% center',tone:'deep'},
  estuaryLimestone:{src:estuaryLimestoneVineyard,position:'56% center',tone:'soft'},
  alpineLake:{src:alpineLakeVineyard,position:'56% center',tone:'cool'},
  ancientBush:{src:ancientBushVines,position:'48% center',tone:'warm'},
  coastalFog:{src:coastalFogVineyard,position:'54% center',tone:'cool'},
  volcanicAltitude:{src:volcanicAltitudeVineyard,position:'52% center',tone:'deep'},
  windsweptIsland:{src:windsweptIslandVineyard,position:'55% center',tone:'deep'},
  continentalPlateau:{src:continentalPlateauVineyard,position:'52% center',tone:'warm'},
  bordeauxEstuary:{src:bordeauxEstuaryVineyard,position:'50% center',tone:'deep'},
  marlboroughWairau:{src:marlboroughWairauVineyard,position:'52% center',tone:'deep'},
} satisfies Record<string,RegionHeroScene>

type RegionHeroKey=keyof typeof regionHeroScenes
const benchmarkRegionHeroes:Record<string,RegionHeroKey>={
  mosel:'riverSlate',nahe:'terraces',rheingau:'estuaryLimestone',bordeaux:'bordeauxEstuary',burgundy:'terraces',champagne:'continentalPlateau','chianti-classico':'mediterranean',
  mendoza:'andes',salta:'volcanicAltitude',etna:'volcanicAltitude',santorini:'windsweptIsland',madeira:'volcanicIsland',priorat:'ancientBush',
  marlborough:'marlboroughWairau','central-otago':'ancientBush','rias-baixas':'maritime',moscato:'continentalPlateau',
}

function stableRegionIndex(value:string,size:number){let hash=2166136261;for(const char of value){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}return Math.abs(hash)%size}

function regionHeroFor(region:{id:string;country:string;climate:string;soil:string;lat:number;lng:number}):RegionHeroScene{
  const direct=benchmarkRegionHeroes[region.id]
  if(direct)return regionHeroScenes[direct]
  const signal=`${region.id} ${region.country} ${region.climate} ${region.soil}`.toLowerCase()
  let pool:RegionHeroKey[]
  if(/island|isla|insel|canary|azores|madeira|santorini|pantelleria/.test(signal))pool=['windsweptIsland','volcanicIsland','maritime']
  else if(/volcan|basalt|lava|etna|ash|tuff/.test(signal))pool=['volcanicAltitude','volcanicIsland','ancientBush']
  else if(/argentina|mendoza|uco|salta|chile|ande|high.altitude|altitude|mountain/.test(signal))pool=['andes','volcanicAltitude','alpineLake']
  else if(/atlantic|maritime|ocean|coast|fog|mist|rias|casablanca|marlborough|pacific/.test(signal))pool=['coastalFog','maritime','estuaryLimestone']
  else if(/river|slate|schist|mosel|rhine|rhein|douro|danube|wachau|ahr|nahe/.test(signal))pool=['riverSlate','terraces','estuaryLimestone']
  else if(/mediterranean|provence|sicil|sard|greece|lebanon|israel|cyprus|languedoc|priorat|limestone/.test(signal)||Math.abs(region.lat)<36)pool=['mediterranean','ancientBush','continentalPlateau']
  else if(/continental|plateau|loess|clay|warm|dry|arid/.test(signal))pool=['continentalPlateau','ancientBush','terraces']
  else pool=['terraces','estuaryLimestone','alpineLake','continentalPlateau']
  const scene=regionHeroScenes[pool[stableRegionIndex(`${region.id}:${region.lat.toFixed(2)}:${region.lng.toFixed(2)}`,pool.length)]]
  const positions=['46% center','52% center','58% center','64% center']
  return {...scene,position:positions[stableRegionIndex(`${region.id}:crop`,positions.length)]}
}

type RegionOpening={summary:string;climateLead:string;diversity:string}
type RegionOpeningSeed={summary:string;terrain:string}
const benchmarkRegionOpenings:Record<string,Record<Locale,RegionOpeningSeed>>={
  nahe:{
    en:{summary:'The Nahe compresses an unusual range of rocks into a compact web of tributary valleys. Riesling can move from filigree to force within a few kilometres while retaining its cool, mineral line.',terrain:'Slate, volcanic rock, sandstone and loess change drainage and heat retention over short distances, so site is never a footnote here.'},
    de:{summary:'Die Nahe bündelt eine ungewöhnliche Gesteinsvielfalt in einem kompakten Netz geschützter Seitentäler. Riesling wechselt auf wenigen Kilometern von filigran zu kraftvoll und behält dabei seine kühle, mineralische Linie.',terrain:'Schiefer, Vulkangestein, Sandstein und Löss verändern Drainage und Wärmespeicherung auf engem Raum; die Lage ist hier nie eine Nebensache.'},
    fr:{summary:'La Nahe concentre une diversité géologique rare dans un réseau compact de vallées affluentes. En quelques kilomètres, le riesling passe de la dentelle à la puissance tout en gardant une trame fraîche et minérale.',terrain:'Schistes, roches volcaniques, grès et lœss modifient rapidement drainage et accumulation de chaleur : le lieu précis reste donc décisif.'},
    es:{summary:'El Nahe concentra una diversidad geológica excepcional en una red compacta de valles tributarios. En pocos kilómetros, el riesling pasa de la delicadeza a la fuerza sin perder su línea fresca y mineral.',terrain:'Pizarra, roca volcánica, arenisca y loess cambian el drenaje y la retención térmica en distancias muy cortas; aquí el sitio nunca es un detalle menor.'},
  },
  mosel:{
    en:{summary:'The Mosel turns exposure into a viticultural instrument. Tight river bends and steep Devonian-slate slopes help Riesling ripen slowly, preserve acidity and translate each parcel’s aspect with unusual clarity.',terrain:'Dark slate stores daytime warmth while the river reflects light into slopes too steep for mechanised farming, making aspect and labour central to style.'},
    de:{summary:'Die Mosel macht Exposition zum weinbaulichen Instrument. Enge Flussschleifen und steile Devon-Schieferhänge lassen Riesling langsam reifen, Säure bewahren und die Ausrichtung jeder Parzelle ungewöhnlich klar zeigen.',terrain:'Dunkler Schiefer speichert Tageswärme, während der Fluss Licht in mechanisch kaum bewirtschaftbare Steillagen reflektiert; Exposition und Handarbeit prägen den Stil.'},
    fr:{summary:'La Moselle fait de l’exposition un véritable outil viticole. Les méandres serrés et les pentes abruptes de schiste dévonien permettent au riesling de mûrir lentement, de garder son acidité et d’exprimer précisément chaque parcelle.',terrain:'Le schiste sombre emmagasine la chaleur du jour tandis que la rivière renvoie la lumière vers des coteaux trop raides pour la mécanisation; exposition et travail manuel façonnent le style.'},
    es:{summary:'El Mosela convierte la exposición en una herramienta vitícola. Los meandros cerrados y las laderas pronunciadas de pizarra devónica permiten que el riesling madure despacio, conserve acidez y refleje cada parcela con gran nitidez.',terrain:'La pizarra oscura almacena el calor diurno y el río refleja luz hacia pendientes demasiado escarpadas para mecanizarse; orientación y trabajo manual definen el estilo.'},
  },
  bordeaux:{
    en:{summary:'Bordeaux spreads around the Gironde estuary and the Garonne and Dordogne banks. Gravel on the Left Bank and clay-limestone on the Right Bank underpin distinct Cabernet- and Merlot-led traditions.',terrain:'Water moderates the Atlantic climate, while gravel drains quickly and clay-limestone holds moisture; those contrasts help explain the region’s long-standing blend architecture.'},
    de:{summary:'Bordeaux breitet sich um die Gironde-Mündung sowie die Ufer von Garonne und Dordogne aus. Kies am linken und Ton-Kalk am rechten Ufer tragen unterschiedliche Cabernet- und Merlot-geprägte Traditionen.',terrain:'Das Wasser mildert das Atlantikklima, während Kies rasch drainiert und Ton-Kalk Feuchtigkeit hält; diese Gegensätze erklären einen Teil der gewachsenen Cuvée-Architektur.'},
    fr:{summary:'Bordeaux se déploie autour de l’estuaire de la Gironde et des rives de la Garonne et de la Dordogne. Les graves de la rive gauche et l’argilo-calcaire de la rive droite fondent deux traditions dominées respectivement par le cabernet et le merlot.',terrain:'L’eau tempère le climat atlantique, les graves drainent vite et l’argilo-calcaire retient davantage l’humidité; ces contrastes éclairent l’architecture historique des assemblages.'},
    es:{summary:'Burdeos se extiende alrededor del estuario de la Gironda y de las riberas del Garona y el Dordoña. Las gravas de la margen izquierda y la arcilla-caliza de la derecha sostienen tradiciones distintas, lideradas por cabernet y merlot.',terrain:'El agua modera el clima atlántico; la grava drena con rapidez y la arcilla-caliza conserva humedad. Estos contrastes ayudan a explicar la histórica arquitectura de los ensamblajes.'},
  },
  mendoza:{
    en:{summary:'Mendoza’s vineyards climb through an arid Andean rain shadow. Meltwater irrigation, altitude and large day–night temperature shifts make elevation as decisive as latitude.',terrain:'Alluvial fans carry sand, silt, stones and limestone from the Andes; their changing depth and drainage give each altitude band a different water and heat balance.'},
    de:{summary:'Mendozas Weinberge steigen im trockenen Regenschatten der Anden an. Schmelzwasserbewässerung, Höhe und große Tag-Nacht-Schwankungen machen die Höhenlage ebenso entscheidend wie den Breitengrad.',terrain:'Schwemmkegel tragen Sand, Schluff, Steine und Kalk aus den Anden; wechselnde Tiefe und Drainage geben jeder Höhenstufe einen eigenen Wasser- und Wärmehaushalt.'},
    fr:{summary:'Les vignobles de Mendoza montent dans l’ombre pluviométrique aride des Andes. L’irrigation par les eaux de fonte, l’altitude et de fortes amplitudes jour-nuit rendent l’élévation aussi décisive que la latitude.',terrain:'Les cônes alluviaux déposent sable, limon, galets et calcaire venus des Andes; profondeur et drainage variables donnent à chaque étage d’altitude son propre équilibre hydrique et thermique.'},
    es:{summary:'Los viñedos de Mendoza ascienden por la árida sombra de lluvia andina. El riego con agua de deshielo, la altitud y la gran amplitud térmica diaria hacen que la elevación sea tan decisiva como la latitud.',terrain:'Los abanicos aluviales arrastran arena, limo, piedras y caliza desde los Andes; sus cambios de profundidad y drenaje dan a cada cota un equilibrio distinto de agua y calor.'},
  },
  etna:{
    en:{summary:'Etna’s vines climb an active volcano in separate contrade. Elevation, exposure and lava flows of different ages create sharp changes in ripening and texture over remarkably short distances.',terrain:'Black lava, ash and weathered volcanic sands drain rapidly and store warmth, while altitude and exposure temper that heat; individual flows can define the character of a parcel.'},
    de:{summary:'Die Reben des Etna steigen in einzelnen Contrade an einem aktiven Vulkan hinauf. Höhe, Exposition und unterschiedlich alte Lavaströme verändern Reife und Textur auf erstaunlich kurzen Distanzen.',terrain:'Schwarze Lava, Asche und verwitterte Vulkansande drainieren rasch und speichern Wärme, die von Höhe und Exposition gebremst wird; einzelne Lavaströme können eine Parzelle prägen.'},
    fr:{summary:'Sur l’Etna, les vignes gravissent un volcan actif à travers des contrade distinctes. Altitude, exposition et coulées de lave d’âges différents modifient nettement maturité et texture sur de très courtes distances.',terrain:'Lave noire, cendres et sables volcaniques altérés drainent vite et emmagasinent la chaleur, tempérée par l’altitude et l’exposition; une coulée précise peut signer une parcelle.'},
    es:{summary:'En el Etna, las vides ascienden por un volcán activo dividido en contrade. La altitud, la exposición y las coladas de lava de distintas edades cambian madurez y textura en distancias sorprendentemente cortas.',terrain:'Lava negra, ceniza y arenas volcánicas meteorizadas drenan rápido y almacenan calor, moderado por la altitud y la orientación; una colada concreta puede definir una parcela.'},
  },
  marlborough:{
    en:{summary:'Marlborough sits between mountains and the Pacific, with sunny, wind-dried valleys and cool nights. Wairau, Southern Valleys and Awatere differ in wind, soil and ripening tempo.',terrain:'Free-draining river gravels dominate parts of Wairau, heavier clays mark the Southern Valleys, and the cooler, windier Awatere slows ripening and sharpens herbal detail.'},
    de:{summary:'Marlborough liegt zwischen Gebirgen und Pazifik, mit sonnigen, windgetrockneten Tälern und kühlen Nächten. Wairau, Southern Valleys und Awatere unterscheiden sich in Wind, Boden und Reifetempo.',terrain:'Frei drainierende Flussschotter prägen Teile des Wairau, schwerere Tone die Southern Valleys; im kühleren, windigeren Awatere reifen Trauben langsamer und zeigen oft mehr Kräuterwürze.'},
    fr:{summary:'Marlborough s’étend entre les montagnes et le Pacifique, avec des vallées ensoleillées, séchées par le vent, et des nuits fraîches. Wairau, Southern Valleys et Awatere diffèrent par le vent, les sols et le rythme de maturation.',terrain:'Les graves fluviales drainantes dominent une partie de Wairau, les argiles plus lourdes marquent les Southern Valleys, tandis que l’Awatere, plus frais et venteux, ralentit la maturité et accentue les nuances végétales.'},
    es:{summary:'Marlborough se sitúa entre montañas y el Pacífico, con valles soleados y secos por el viento, además de noches frescas. Wairau, Southern Valleys y Awatere difieren en viento, suelo y ritmo de maduración.',terrain:'Las gravas fluviales de drenaje libre dominan parte de Wairau, las arcillas más pesadas marcan Southern Valleys y el Awatere, más fresco y ventoso, ralentiza la maduración y acentúa los matices herbales.'},
  },
}

function regionOpening(region:(typeof regions)[number],locale:Locale,content:ReturnType<typeof regionContent>):RegionOpening{
  const seed=benchmarkRegionOpenings[region.id]?.[locale]
  if(seed)return {summary:seed.summary,climateLead:`${content.climate.replace(/[.\s]+$/,'')}. ${seed.terrain}`,diversity:content.viticulture}
  const ground={en:`The region’s ground—${content.soil.toLowerCase()}—influences water movement, heat storage and rooting depth.`,de:`Der Untergrund der Region – ${content.soil.toLowerCase()} – beeinflusst Wasserführung, Wärmespeicherung und Wurzeltiefe.`,fr:`Le sous-sol régional — ${content.soil.toLowerCase()} — influence la circulation de l’eau, le stockage de chaleur et la profondeur d’enracinement.`,es:`El subsuelo regional —${content.soil.toLowerCase()}— influye en el movimiento del agua, la retención térmica y la profundidad de las raíces.`}[locale]
  return {summary:content.summary,climateLead:`${content.climate.replace(/[.\s]+$/,'')}. ${ground}`,diversity:content.viticulture}
}

const navItems = [
  { to: "/", key: "home" as const, icon: Compass, end: true },
  { to: "/atlas", key: "atlas" as const, icon: MapIcon },
  { to: "/tastings", key: "tastings" as const, icon: Users },
  { to: "/cellar", key: "cellar" as const, icon: Wine },
  { to: "/profile", key: "profile" as const, icon: CircleUserRound },
];

const mobileNavItems = [
  { to: "/atlas", key: "atlas" as const, icon: MapIcon },
  { to: "/learn", key: "learn" as const, icon: Library },
  { to: "/tastings", key: "tastings" as const, icon: Users },
  { to: "/cellar", key: "cellar" as const, icon: Wine },
  { to: "/profile", key: "profile" as const, icon: CircleUserRound },
];

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <AppShell onSearch={() => setSearchOpen(true)}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/atlas" element={<AtlasPage />} />
        <Route path="/regions/:slug" element={<RegionPage />} />
        <Route path="/grapes/:slug" element={<GrapePage />} />
        <Route path="/wineries/:slug" element={<ProducerPage />} />
        <Route path="/wines/:slug" element={<WinePage />} />
        <Route path="/aromas" element={<AromaPage />} />
        <Route path="/learn" element={<LearningHub />} />
        <Route path="/learn/:slug" element={<LearningRoute />} />
        <Route path="/tastings" element={<TastingsPage />} />
        <Route path="/tastings/build" element={<AccountGuard><TastingBuilder /></AccountGuard>} />
        <Route path="/tastings/:id" element={<AccountGuard><Deferred><ConnectedTastingRoom renderJourney={journey=><JourneyExperience journey={journey}/>} /></Deferred></AccountGuard>} />
        <Route path="/events" element={<EventsMarketplace />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/hosts/:id" element={<HostProfile />} />
        <Route path="/partners/:id" element={<PartnerProfilePage />} />
        <Route path="/studio" element={<StudioGuard><StudioHome /></StudioGuard>} />
        <Route path="/studio/events" element={<StudioGuard><StudioEvents /></StudioGuard>} />
        <Route path="/studio/profile" element={<StudioGuard roles={['host','winery','merchant','admin']}><StudioProfile /></StudioGuard>} />
        <Route path="/studio/site" element={<StudioGuard roles={['winery','merchant','admin']}><StudioSite /></StudioGuard>} />
        <Route path="/studio/offers" element={<StudioGuard roles={['merchant','admin']}><StudioOffers /></StudioGuard>} />
        <Route path="/studio/placements" element={<StudioGuard roles={['admin']}><StudioPlacements /></StudioGuard>} />
        <Route path="/cellar" element={<AccountGuard><Deferred><CellarExperience /></Deferred></AccountGuard>} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </AppShell>
  );
}

function LearningRoute(){
  const {slug}=useParams()
  return learningModuleById(slug??'')?<LearningLesson/>:<ArticlePage/>
}

function StudioGuard({children,roles}:{children:ReactNode;roles?:MembershipRole[]}){
  const {user,ready}=useAuth()
  const ui=useUiCopy()
  const location=useLocation()
  if(!ready)return <div className="page guarded" aria-busy="true" role="status" aria-label={ui.studioNav}><span className="loading-orbit"/></div>
  const returnTo=encodeURIComponent(`${location.pathname}${location.search}`)
  if(!user)return <Navigate to={`/profile?returnTo=${returnTo}`} replace state={{reason:'studio-auth'}}/>
  if(roles&&!roles.some(role=>user.roles.includes(role)))return <div className="page guarded"><ShieldCheck/><h1>{ui.permissions}</h1><p>{ui.studioBody}</p><Link className="primary-button ink" to="/studio">{ui.viewStudio}</Link></div>
  return children
}

function AccountGuard({children}:{children:ReactNode}){
  const {user,ready}=useAuth()
  const location=useLocation()
  if(!ready)return <div className="page guarded" aria-busy="true"><span className="loading-orbit"/></div>
  const returnTo=encodeURIComponent(`${location.pathname}${location.search}`)
  return user?children:<Navigate to={`/profile?returnTo=${returnTo}`} replace state={{reason:'account-auth'}}/>
}

function AppShell({
  children,
  onSearch,
}: {
  children: ReactNode;
  onSearch: () => void;
}) {
  const { t, locale, setLocale } = useLocale();
  const {user}=useAuth()
  const ui=useUiCopy()
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
    <div className="app-shell">
      <aside className="rail">
        <Link to="/" className="brand" aria-label={`Vine Atlas · ${ui.homeLabel}`}>
          <span className="brand-mark">
            <Grape size={22} />
          </span>
          <span>
            <b>Vine</b>
            <em>Atlas</em>
          </span>
        </Link>
        <nav aria-label={ui.primaryNavigation}>
          {navItems.map(({ to, key, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon size={20} />
              <span>{t(key)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="rail-lower">
          <NavLink to="/events">
            <Users size={20} />
            <span>{ui.eventsNav}</span>
          </NavLink>
          {user&&<NavLink to="/studio">
            <Settings size={20} />
            <span>{ui.studioNav}</span>
          </NavLink>}
          {user?.roles.includes('admin')&&<NavLink to="/admin" className="admin-nav-entry">
            <ShieldCheck size={20} />
            <span>{t('admin')} · {ui.studioNav}</span>
          </NavLink>}
          <NavLink to="/learn">
            <Library size={20} />
            <span>{t("learn")}</span>
          </NavLink>
          <NavLink to="/aromas">
            <Sparkles size={20} />
            <span>{t("aromas")}</span>
          </NavLink>
          <label className="rail-language">
            <Languages size={19} />
            <select
              aria-label={t("language")}
              value={locale}
              onChange={(event) => setLocale(event.target.value as typeof locale)}
            >
              {localeRegistry.map((item) => <option key={item.id} value={item.id}>{item.id.toUpperCase()}</option>)}
            </select>
          </label>
          <button className="rail-search" onClick={onSearch}>
            <Search size={20} />
            <span>{t("search")}</span>
          </button>
        </div>
        <p className="rail-signature">{ui.followTerroir}</p>
      </aside>
      <header className="topbar">
        <Link to="/" className="mobile-brand">
          <Grape size={20} /> Vine Atlas
        </Link>
        <div className="topbar-actions">
          <label className="mobile-language">
            <Languages size={17} />
            <select
              aria-label={t("language")}
              value={locale}
              onChange={(event) => setLocale(event.target.value as typeof locale)}
            >
              {localeRegistry.map((item) => <option key={item.id} value={item.id}>{item.id.toUpperCase()}</option>)}
            </select>
          </label>
          <button className="icon-button search-trigger" onClick={onSearch} aria-label={t("search")}>
            <Search size={20} />
          </button>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <nav className="bottom-nav" aria-label={ui.primaryNavigation}>
        {mobileNavItems.map(({ to, key, icon: Icon }) => (
          <NavLink key={to} to={to}>
            <Icon size={21} />
            <span>{t(key)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {children}
      </div>
      {action}
    </header>
  );
}
function ThreadLink({
  to,
  children,
  tone = "wine",
}: {
  to: string;
  children: ReactNode;
  tone?: "wine" | "moss" | "straw";
}) {
  return (
    <Link to={to} className={`thread-pill ${tone}`}>
      {children}
      <ChevronRight size={14} />
    </Link>
  );
}
function BackLink({ to, label = "Back" }: { to: string; label?: string }) {
  return (
    <Link className="back-link" to={to}>
      <ArrowLeft size={16} />
      {label}
    </Link>
  );
}
function HomePage() {
  const { t,locale } = useLocale();
  const ui=useUiCopy()
  const copy = usePageCopy();
  const cellar = repository.cellar.all();
  const featured = regions.filter((r) => r.featured).slice(0, 4);
  return (
    <div className="page home-page">
      <section className="hero">
        <img
          src={vineyardHero}
          alt={ui.vineyardHeroAlt}
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow light">{copy.homeEyebrow}</span>
          <h1>{copy.homeTitle}</h1>
          <p>{copy.homeDescription}</p>
          <Link to="/atlas" className="primary-button">
            {t("explore")} <ArrowRight size={17} />
          </Link>
        </div>
        <div className="hero-pulse">
          <strong>{counts.regions}</strong>
          <span>
            {copy.regionCount}
          </span>
        </div>
      </section>
      <section className="home-strip">
        <div>
          <Layers3 size={16}/>
          {ui.planJourney}
        </div>
        <p>{copy.tastingsIntro}</p>
        <Link to="/tastings/build">
          {ui.planJourney} <ArrowRight size={16} />
        </Link>
      </section>
      <FeaturedBusinessHome />
      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{copy.beginPlace}</span>
            <h2>{copy.landscapes}</h2>
          </div>
          <Link to="/atlas">
            {copy.seeAll} {counts.regions} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="region-row">
          {featured.map((region, index) => {
            const hero=regionHeroFor(region)
            return (
            <Link
              to={`/regions/${region.id}`}
              className="region-card"
              key={region.id}
            >
              <div className={`region-image crop-${index}`}>
                <img src={hero.src} style={{objectPosition:hero.position}} alt={`${regionName(region,locale)} · ${countryLabel(region.country,locale)}`} />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <small>{countryLabel(region.country,locale)}</small>
                <h3>{regionName(region,locale)}</h3>
                <p>{regionContent(region,locale).climate}</p>
              </div>
            </Link>
          )})}
        </div>
      </section>
      <section className="split-feature">
        <div className="aroma-preview">
          <span className="eyebrow light">{copy.aromaExplorer}</span>
          <h2>{copy.trainMemory}</h2>
          <p>{copy.aromaDescription}</p>
          <MiniWheel />
          <Link to="/aromas" className="text-link light">
            {copy.turnWheel} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="learn-preview">
          <span className="eyebrow">{copy.quietLearn}</span>
          <h2>{copy.noticeMore}</h2>
          <p>{articles[1].summary}</p>
          <div className="learning-line">
            <span>01</span>
            <i />
            <span>04</span>
          </div>
          <Link to={`/learn/${articles[1].id}`} className="primary-button ink">
            {copy.readGuide}
          </Link>
        </div>
      </section>
      <section className="section-block cellar-snapshot">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{copy.collection}</span>
            <h2>
              {cellar.length
                ? `${cellar.reduce((sum, item) => sum + item.quantity, 0)} ${copy.bottles} · ${copy.cellarStories}`
                : copy.cellarStart}
            </h2>
          </div>
          <Link to="/cellar">
            {copy.openCellar} <ArrowRight size={16} />
          </Link>
        </div>
        {cellar.length === 0 ? (
          <p className="soft-copy">
            {copy.cellarPrivate}
          </p>
        ) : (
          <div className="simple-list">
            {cellar.slice(0, 3).map((item) => (
              <div key={item.id}>
                <Wine size={18} />
                <span>
                  {wines.find((w) => w.id === item.wineId)?.name ||
                    item.customName}
                </span>
                <b>{item.quantity}</b>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MiniWheel() {
  return (
    <svg className="mini-wheel" viewBox="0 0 220 220" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path
          key={i}
          d={donutPath(110, 110, 38, 94, i * 45 + 2, (i + 1) * 45 - 2)}
          fill={
            [
              "#a7444d",
              "#cf826f",
              "#d7af68",
              "#7d8760",
              "#79948b",
              "#70586a",
              "#9b775d",
              "#d0a28f",
            ][i]
          }
        />
      ))}
      <circle cx="110" cy="110" r="28" fill="#241920" />
      <circle cx="110" cy="110" r="7" fill="#d1aa63" />
    </svg>
  );
}

function AtlasPage() {
  const { t,locale } = useLocale();
  const ui=useUiCopy()
  const copy = usePageCopy();
  const [selected, setSelected] = useState(
    regions.find((r) => r.id === "mosel") ?? regions[0],
  );
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<"regions" | "producers">("regions");
  const [country,setCountry]=useState('all')
  const [grapeId,setGrapeId]=useState('all')
  const [linkedOnly,setLinkedOnly]=useState(false)
  const [sort,setSort]=useState<'name'|'country'|'links'>('name')
  const [page,setPage]=useState(1)
  const [pageSize,setPageSize]=useState(12)
  const [zoom, setZoom] = useState(3);
  const [lens,setLens]=useState<AtlasLens>('classic')
  const [compareIds,setCompareIds]=useState<string[]>([])
  const countries=[...new Set(regions.map(region=>region.country))].sort()
  const q=query.trim().toLowerCase()
  const matchesRegion=(region:(typeof regions)[number])=>{
    const grapeNames=grapes.filter(grape=>region.grapeIds.includes(grape.id)).map(grape=>grape.name).join(' ')
    const producerNames=producers.filter(producer=>producer.regionId===region.id).map(producer=>producer.name).join(' ')
    return (!q||`${region.name} ${region.country} ${grapeNames} ${producerNames}`.toLowerCase().includes(q))&&(country==='all'||region.country===country)&&(grapeId==='all'||region.grapeIds.includes(grapeId))&&(!linkedOnly||(region.wineIds.length+region.producerIds.length)>0)
  }
  const filteredRegions=regions.filter(matchesRegion).sort((a,b)=>sort==='country'?`${a.country}${a.name}`.localeCompare(`${b.country}${b.name}`):sort==='links'?(b.producerIds.length+b.wineIds.length)-(a.producerIds.length+a.wineIds.length):a.name.localeCompare(b.name))
  const filteredProducers=producers.filter(producer=>{
    const region=regions.find(item=>item.id===producer.regionId)!
    const grapeNames=grapes.filter(grape=>region.grapeIds.includes(grape.id)).map(grape=>grape.name).join(' ')
    return (!q||`${producer.name} ${region.name} ${region.country} ${grapeNames}`.toLowerCase().includes(q))&&(country==='all'||region.country===country)&&(grapeId==='all'||region.grapeIds.includes(grapeId))&&(!linkedOnly||producer.wineIds.length>0)
  }).sort((a,b)=>{const ar=regions.find(item=>item.id===a.regionId)!,br=regions.find(item=>item.id===b.regionId)!;return sort==='country'?`${ar.country}${a.name}`.localeCompare(`${br.country}${b.name}`):sort==='links'?b.wineIds.length-a.wineIds.length:a.name.localeCompare(b.name)})
  const producerGroups=filteredRegions.map(region=>({region,items:filteredProducers.filter(producer=>producer.regionId===region.id)})).filter(group=>group.items.length)
  const resultCount=layer==='regions'?filteredRegions.length:filteredProducers.length
  const pageCount=Math.max(1,Math.ceil(resultCount/pageSize))
  const currentPage=Math.min(page,pageCount)
  const pageStart=(currentPage-1)*pageSize
  const pagedRegions=filteredRegions.slice(pageStart,pageStart+pageSize)
  const pagedProducers=filteredProducers.slice(pageStart,pageStart+pageSize)
  const directoryCopy={en:{page:'Page',of:'of',perPage:'per page',previous:'Previous',next:'Next',refine:'Refine this directory'},de:{page:'Seite',of:'von',perPage:'pro Seite',previous:'Zurück',next:'Weiter',refine:'Dieses Verzeichnis filtern'},fr:{page:'Page',of:'sur',perPage:'par page',previous:'Précédent',next:'Suivant',refine:'Affiner cet annuaire'},es:{page:'Página',of:'de',perPage:'por página',previous:'Anterior',next:'Siguiente',refine:'Filtrar este directorio'}}[locale]
  const changeDirectoryPage=(next:number)=>{setPage(Math.min(pageCount,Math.max(1,next)));window.setTimeout(()=>document.querySelector('.atlas-index')?.scrollIntoView({behavior:'smooth',block:'start'}),0)}
  useEffect(()=>setPage(1),[query,country,grapeId,linkedOnly,sort,layer,pageSize])
  const selectedContent=regionContent(selected,locale)
  return (
    <div className="page atlas-page">
      <PageIntro eyebrow={copy.atlasEyebrow} title={copy.atlasTitle}>
        <p>{copy.atlasDescription}</p>
      </PageIntro>
      <div className="atlas-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.searchAll}
          />
        </label>
        <div className="segmented">
          <button
            className={layer === "regions" ? "active" : ""}
            onClick={() => setLayer("regions")}
          >
            <MapIcon size={16} />
            {t("regions")}
          </button>
          <button
            className={layer === "producers" ? "active" : ""}
            onClick={() => setLayer("producers")}
          >
            <Grape size={16} />
            {t("producers")}
          </button>
        </div>
      </div>
      <div className="atlas-filters">
        <label><span>{ui.country}</span><select value={country} onChange={event=>setCountry(event.target.value)}><option value="all">{ui.allCountries}</option>{countries.map(item=><option value={item} key={item}>{countryLabel(item,locale)}</option>)}</select></label>
        <label><span>{ui.variety}</span><select value={grapeId} onChange={event=>setGrapeId(event.target.value)}><option value="all">{ui.allVarieties}</option>{grapes.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(grape=><option value={grape.id} key={grape.id}>{grape.name}</option>)}</select></label>
        <label><span>{ui.sort}</span><select value={sort} onChange={event=>setSort(event.target.value as typeof sort)}><option value="name">{ui.sortName}</option><option value="country">{ui.sortCountry}</option><option value="links">{ui.sortLinks}</option></select></label>
        <button className={linkedOnly?'active':''} aria-pressed={linkedOnly} onClick={()=>setLinkedOnly(value=>!value)}>{linkedOnly?<Check size={15}/>:<ListFilter size={15}/>} {ui.linkedOnly}</button>
        {(q||country!=='all'||grapeId!=='all'||linkedOnly)&&<button className="clear-filters" onClick={()=>{setQuery('');setCountry('all');setGrapeId('all');setLinkedOnly(false)}}><X size={15}/>{ui.clearFilters}</button>}
      </div>
      <AtlasLensControls lens={lens} onChange={setLens} regions={filteredRegions}/>
      <section className="map-shell">
        <AtlasCommercialPlacements />
        <div className="atlas-map">
          <MapContainer
            center={[35, 5]}
            zoom={3}
            minZoom={2}
            scrollWheelZoom
            className="leaflet-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomWatcher onZoom={setZoom} />
            {layer === "regions" &&
              filteredRegions.map((region) => (
                <CircleMarker
                  key={region.id}
                  center={[region.lat, region.lng]}
                  radius={selected.id === region.id ? 10 : 6}
                  pathOptions={atlasMarkerStyle(region,lens,selected.id===region.id)}
                  eventHandlers={{ click: () => setSelected(region) }}
                >
                  <Popup>
                    <strong>{regionName(region,locale)}</strong>
                    <br />
                    {countryLabel(region.country,locale)}
                  </Popup>
                </CircleMarker>
              ))}
            {layer === "producers" &&
              producerGroups.map(({region,items}) => (
                <CircleMarker
                  key={region.id}
                  center={[region.lat, region.lng]}
                  radius={Math.min(11,5+items.length)}
                  pathOptions={{
                    color: "#f4efe6",
                    fillColor: "#3f5239",
                    fillOpacity: 0.95,
                    weight: 2,
                  }}
                  eventHandlers={{click:()=>setSelected(region)}}
                >
                  <Popup>
                    <strong>{regionName(region,locale)} · {items.length} {ui.wineries}</strong><br/>
                    <small>{ui.regionalLocation}</small>
                    <div className="popup-links">{items.slice(0,8).map(producer=><Link key={producer.id} to={`/wineries/${producer.id}`}>{producer.name}</Link>)}</div>
                  </Popup>
                </CircleMarker>
              ))}
          </MapContainer>
        </div>
        <aside className="map-inspector">
          <span className="eyebrow">{copy.selectedPlace}</span>
          <h2>{regionName(selected,locale)}</h2>
          <p>{selectedContent.summary}</p>
          <dl>
            <div>
              <dt>{ui.country}</dt>
              <dd>{countryLabel(selected.country,locale)}</dd>
            </div>
            <div>
              <dt>{ui.climate}</dt>
              <dd>{selectedContent.climate}</dd>
            </div>
            <div>
              <dt>{ui.ground}</dt>
              <dd>{selectedContent.soil}</dd>
            </div>
          </dl>
          <ThreadLink to={`/regions/${selected.id}`}>
            {copy.enterRegion}: {regionName(selected,locale)}
          </ThreadLink>
          <CompareButton active={compareIds.includes(selected.id)} disabled={compareIds.length>=2} onClick={()=>setCompareIds(ids=>ids.includes(selected.id)?ids.filter(id=>id!==selected.id):[...ids,selected.id].slice(-2))}/>
        </aside>
        <div className="mobile-map-sheet">
          <i />
          <span>{countryLabel(selected.country,locale)}</span>
          <h2>{regionName(selected,locale)}</h2>
          <p>{selectedContent.climate}</p>
          <ThreadLink to={`/regions/${selected.id}`}>
            {copy.enterRegion}
          </ThreadLink>
        </div>
      </section>
      <RegionCompare items={compareIds.map(id=>regions.find(region=>region.id===id)).filter((item):item is (typeof regions)[number]=>Boolean(item))} onRemove={id=>setCompareIds(ids=>ids.filter(item=>item!==id))}/>
      <section className="atlas-index">
        <div className="section-heading">
          <div><span className="eyebrow">{ui.completeDirectory}</span><h2 aria-live="polite">{resultCount} {layer==='regions'?ui.wineRegions:ui.wineries}</h2></div>
          <span>Map · {zoom} · {ui.mapShowing}</span>
        </div>
        <div className="atlas-directory-tools" aria-label={directoryCopy.refine}>
          <label className="search-field"><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder={ui.searchAll}/></label>
          <label><span>{ui.country}</span><select value={country} onChange={event=>setCountry(event.target.value)}><option value="all">{ui.allCountries}</option>{countries.map(item=><option value={item} key={item}>{countryLabel(item,locale)}</option>)}</select></label>
          <label><span>{ui.variety}</span><select value={grapeId} onChange={event=>setGrapeId(event.target.value)}><option value="all">{ui.allVarieties}</option>{grapes.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(grape=><option value={grape.id} key={grape.id}>{grape.name}</option>)}</select></label>
          <label><span>{ui.sort}</span><select value={sort} onChange={event=>setSort(event.target.value as typeof sort)}><option value="name">{ui.sortName}</option><option value="country">{ui.sortCountry}</option><option value="links">{ui.sortLinks}</option></select></label>
          <label><span>{directoryCopy.perPage}</span><select value={pageSize} onChange={event=>setPageSize(Number(event.target.value))}><option value="8">8</option><option value="12">12</option><option value="24">24</option></select></label>
        </div>
        {resultCount===0?<div className="directory-empty"><Search/><h3>{ui.noPath}</h3><p>{ui.noPathHelp}</p></div>:<div className="atlas-directory">
          {layer==='regions'?pagedRegions.map(region=><Link to={`/regions/${region.id}`} key={region.id}>
            <div className="directory-index">{String(regions.indexOf(region)+1).padStart(3,'0')}</div><div><small>{countryLabel(region.country,locale)}</small><h3>{regionName(region,locale)}</h3><p>{regionContent(region,locale).climate}</p></div><dl><span>{region.grapeIds.length} {ui.linkedVarieties}</span><span>{region.producerIds.length} {ui.linkedWineries}</span></dl><ChevronRight/>
          </Link>):pagedProducers.map(producer=>{const region=regions.find(item=>item.id===producer.regionId)!,pc=producerContent(producer,region,locale);return <Link to={`/wineries/${producer.id}`} key={producer.id}>
            <div className="directory-monogram">{producer.name.charAt(0)}</div><div><small>{countryLabel(region.country,locale)} · {regionName(region,locale)}</small><h3>{producer.name}</h3><p>{pc.speciality}</p></div><dl><span>{producer.wineIds.length} {ui.linkedWines}</span><span>{producer.regionIds.length} {ui.producersLinked}</span></dl><ChevronRight/>
          </Link>})}
        </div>}
        {resultCount>pageSize&&<nav className="directory-pagination" aria-label={`${directoryCopy.page} ${currentPage} ${directoryCopy.of} ${pageCount}`}><button disabled={currentPage===1} onClick={()=>changeDirectoryPage(currentPage-1)}><ArrowLeft/>{directoryCopy.previous}</button><span><strong>{directoryCopy.page} {currentPage}</strong> {directoryCopy.of} {pageCount}<small>{pageStart+1}–{Math.min(pageStart+pageSize,resultCount)} / {resultCount}</small></span><button disabled={currentPage===pageCount} onClick={()=>changeDirectoryPage(currentPage+1)}>{directoryCopy.next}<ArrowRight/></button></nav>}
      </section>
    </div>
  );
}
function ZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  useMapEvents({ zoomend: (e) => onZoom(e.target.getZoom()) });
  return null;
}

function RegionPage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const { slug } = useParams();
  const region = regions.find((r) => r.id === slug);
  if (!region) return <NotFound />;
  const relatedGrapes = grapes.filter((g) => region.grapeIds.includes(g.id));
  const relatedProducers = producers.filter((p) => p.regionIds.includes(region.id));
  const relatedWines = wines.filter((w) => region.wineIds.includes(w.id));
  const content=regionContent(region,locale)
  const hero=regionHeroFor(region)
  const opening=regionOpening(region,locale,content)
  return (
    <article className="page detail-page">
      <BackLink to="/atlas" label={ui.worldAtlas} />
      <section className={`detail-hero tone-${hero.tone}`}>
        <img
          src={hero.src}
          style={{objectPosition:hero.position}}
          alt={`${regionName(region,locale)} · ${countryLabel(region.country,locale)}`}
        />
        <div className="detail-hero-copy">
          <span>{countryLabel(region.country,locale)}</span>
          <h1>{regionName(region,locale)}</h1>
          <p>{opening.summary}</p>
        </div>
        <div className="place-index">
          <span>{ui.placeIndex}</span>
          <strong>
            {String(regions.indexOf(region) + 1).padStart(3, "0")}
          </strong>
        </div>
      </section>
      <div className="thread-path">
        <span>{ui.place}</span>
        <i />
        <span>{ui.grape}</span>
        <i />
        <span>{ui.producer}</span>
        <i />
        <span>{ui.wine}</span>
        <i />
        <span>{ui.memory}</span>
      </div>
      <section className="detail-layout">
        <div>
          <span className="eyebrow">{ui.shapePlace}</span>
          <h2>{ui.climateMeets}</h2>
          <p className="lead">{opening.climateLead}</p>
          <p>{opening.diversity}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>{ui.latitude}</dt>
            <dd>
              {Math.abs(region.lat).toFixed(1)}°{region.lat >= 0 ? "N" : "S"}
            </dd>
          </div>
          <div>
            <dt>{ui.typicalGround}</dt>
            <dd>{content.soil}</dd>
          </div>
          <div>
            <dt>{ui.producersLinked}</dt>
            <dd>{relatedProducers.length}</dd>
          </div>
          <div className="community-fact"><dt>{ui.community}</dt><dd><CommunityRating entityType="region" entityId={region.id}/></dd></div>
        </dl>
      </section>
      <section className="terroir-story">
        <div className="story-visual">
          <img src={terroirIllustration} alt={regionName(region,locale)} />
          <span className="image-caption">{ui.readSkyRoot}</span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">{ui.historySeason}</span>
          <h2>{ui.livingSystem}</h2>
          <div className="story-chapters">
            <article><span>01</span><div><h3>{ui.placeEvolved}</h3><p>{content.history}</p></div></article>
            <article><span>02</span><div><h3>{ui.throughSeason}</h3><p>{content.growingSeason}</p></div></article>
            <article><span>03</span><div><h3>{ui.vineDecisions}</h3><p>{content.viticulture}</p></div></article>
          </div>
        </div>
      </section>
      <RegionFieldGuide region={region} locale={locale}/>
      <RegionTerroirStudio region={region} locale={locale}/>
      <section className="knowledge-panels">
        <article>
          <span className="eyebrow">{ui.stylesCompare}</span>
          <h3>{ui.regionBecome}</h3>
          <ul>{content.styles.map((style) => <li key={style}>{style}</li>)}</ul>
        </article>
        <article>
          <span className="eyebrow">{ui.localGeography}</span>
          <h3>{region.subregions.length ? ui.namedZones : ui.readLandscape}</h3>
          <ul>{(region.subregions.length ? region.subregions : content.keyFacts).map((zone) => <li key={zone}>{zone}</li>)}</ul>
        </article>
        <article>
          <span className="eyebrow">{ui.atTable}</span>
          <h3>{ui.pairPlace}</h3>
          <ul>{content.pairings.map((pairing) => <li key={pairing}>{pairing}</li>)}</ul>
        </article>
      </section>
      <section className="related-section">
        <span className="eyebrow">{ui.signatureThreads}</span>
        <h2>{ui.startVarieties}</h2>
        <div className="thread-cloud">
          {relatedGrapes.map((g) => (
            <ThreadLink key={g.id} to={`/grapes/${g.id}`} tone="moss">
              {g.name}
            </ThreadLink>
          ))}
        </div>
      </section>
      {relatedProducers.length > 0 && (
        <section className="related-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{ui.peoplePlace}</span>
              <h2>{ui.producersKnow}</h2>
            </div>
          </div>
          <div className="editorial-list">
            {relatedProducers.slice(0, 4).map((producer, index) => (
              <Link to={`/wineries/${producer.id}`} key={producer.id}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{producer.name}</h3>
                  <p>{producer.summary}</p>
                </div>
                <ArrowRight />
              </Link>
            ))}
          </div>
        </section>
      )}
      {relatedWines.length > 0 && (
        <section className="related-section">
          <span className="eyebrow">{ui.continueGlass}</span>
          <h2>{ui.representativeWines}</h2>
          <div className="wine-shelf">
            {relatedWines.slice(0, 4).map((w) => (
              <WineCard key={w.id} wine={w} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function GrapePage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const { slug } = useParams();
  const grape = grapes.find((g) => g.id === slug);
  if (!grape) return <NotFound />;
  const relatedRegions = regions
    .filter((r) => r.grapeIds.includes(grape.id)&&wines.some(wine=>wine.regionId===r.id&&wine.grapeIds.includes(grape.id)))
    .sort((a,b)=>b.wineIds.filter(id=>wines.find(wine=>wine.id===id)?.grapeIds.includes(grape.id)).length-a.wineIds.filter(id=>wines.find(wine=>wine.id===id)?.grapeIds.includes(grape.id)).length)
    .slice(0, 8);
  const grapeAromas = aromas.filter((a) => grape.aromaIds.includes(a.id));
  const relatedWines = wines
    .filter((w) => w.grapeIds.includes(grape.id))
    .slice(0, 4);
  const content=grapeContent(grape,locale)
  return (
    <article className="page detail-page grape-page">
      <BackLink to="/atlas" label="Atlas" />
      <PageIntro
        eyebrow={
          grape.color === "red"
            ? ui.darkVariety
            : ui.lightVariety
        }
        title={grape.name}
      >
        {grape.aliases.length > 0 && (
          <p>{ui.alsoKnown} {grape.aliases.join(` ${ui.and} `)}</p>
        )}
      </PageIntro>
      <section className="grape-intro">
        <div className="grape-orbit">
          <span>{grape.name.charAt(0)}</span>
          {grapeAromas.slice(0, 6).map((a, i) => (
            <i key={a.id} style={{ "--i": i } as React.CSSProperties}>
              {aromaContent(a,locale).name}
            </i>
          ))}
        </div>
        <div>
          <p className="lead">{content.summary}</p>
          <StructureScale label={ui.acidity} value={grape.acidity} />
          <StructureScale label={ui.tannin} value={grape.tannin} />
          <StructureScale label={ui.body} value={grape.body} />
        </div>
      </section>
      <section className="entity-deep-dive">
        <div className="deep-dive-lead">
          <span className="eyebrow">{ui.nurseryCellar}</span>
          <h2>{ui.grapeBehaves}: {grape.name}</h2>
          <p>{ui.originStart}</p>
        </div>
        <div className="deep-dive-grid">
          <article><span>{ui.origin}</span><h3>{content.origin}</h3><p>{content.ripening}</p></article>
          <article><span>{ui.climateFit}</span><h3>{ui.balancePossible}</h3><p>{content.climateFit}</p></article>
          <article><span>{ui.inVineyard}</span><h3>{ui.growerDecisions}</h3><p>{content.viticulture}</p></article>
          <article><span>{ui.inCellar}</span><h3>{ui.textureExpression}</h3><p>{content.winemaking}</p></article>
        </div>
      </section>
      <GrapeDeepDive grape={grape} locale={locale}/>
      <GrapeExpressionLab grape={grape} locale={locale}/>
      <GrapeAmpelography grape={grape} locale={locale}/>
      <BlendConnections grapeId={grape.id}/>
      <section className="knowledge-panels">
        <article><span className="eyebrow">{ui.styleRange}</span><h3>{ui.lookExpressions}</h3><ul>{content.styles.map(item=><li key={item}>{item}</li>)}</ul></article>
        <article><span className="eyebrow">{ui.atTable}</span><h3>{ui.pairStructure}</h3><ul>{content.pairings.map(item=><li key={item}>{item}</li>)}</ul></article>
      </section>
      <section className="related-section">
        <span className="eyebrow">{ui.aromaConstellation}</span>
        <h2>{ui.commonReferences}</h2>
        <p>{ui.aromaPrompts}</p>
        <div className="aroma-tiles">
          {grapeAromas.map((a) => (
            <Link to={`/aromas?selected=${a.id}`} key={a.id}>
              <small>{aromaContent(a,locale).family}</small>
              <strong>{aromaContent(a,locale).name}</strong>
              <span>{aromaContent(a,locale).reference}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="related-section">
        <span className="eyebrow">{ui.classicPlaces}</span>
        <h2>{ui.grapeGeography}</h2>
        <div className="thread-cloud">
          {relatedRegions.map((r) => (
              <ThreadLink key={r.id} to={`/regions/${r.id}`} tone="moss">
                {r.name}
              </ThreadLink>
            ))}
        </div>
      </section>
      {relatedWines.length > 0 && (
        <section className="related-section">
          <h2>{ui.continueBottle}</h2>
          <div className="wine-shelf">
            {relatedWines.map((w) => (
              <WineCard key={w.id} wine={w} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
function StructureScale({ label, value }: { label: string; value: number }) {
  const ui=useUiCopy()
  return (
    <div className="structure-scale">
      <span>{label}</span>
      <div>
        {[1, 2, 3, 4, 5].map((n) => (
          <i className={n <= value ? "on" : ""} key={n} />
        ))}
      </div>
      <b>{["", ui.levelLight, ui.levelGentle, ui.levelBalanced, ui.levelFirm, ui.levelPronounced][value]}</b>
    </div>
  );
}

function ProducerPage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const { slug } = useParams();
  const producer = producers.find((p) => p.id === slug);
  if (!producer) return <NotFound />;
  const region = regions.find((r) => r.id === producer.regionId)!;
  const producerWines = wines.filter((w) => w.producerId === producer.id);
  const content=producerContent(producer,region,locale)
  return (
    <article className="page detail-page">
      <BackLink to={`/regions/${region.id}`} label={regionName(region,locale)} />
      <section className="producer-hero">
        <div>
          <span className="eyebrow">{ui.producer} · {countryLabel(region.country,locale)}</span>
          <h1>{producer.name}</h1>
          <p>{content.summary}</p>
          <ThreadLink to={`/regions/${region.id}`} tone="moss">
            {regionName(region,locale)}
          </ThreadLink>
        </div>
        <img
          src={tastingStill}
          alt={ui.producerHeroAlt}
        />
      </section>
      <ProducerBusinessLayer producerId={producer.id} />
      <section className="detail-layout">
        <div>
          <span className="eyebrow">{ui.pointView}</span>
          <h2>{ui.traditionPresent}</h2>
          <p className="lead">{ui.producerContext}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>{ui.homeLabel}</dt>
            <dd>
              {regionName(region,locale)}, {countryLabel(region.country,locale)}
            </dd>
          </div>
          <div className="community-fact"><dt>{ui.community}</dt><dd><CommunityRating entityType="producer" entityId={producer.id}/></dd></div>
        </dl>
      </section>
      <section className="producer-method">
        <header><span className="eyebrow">{ui.estateLens}</span><h2>{ui.vineyardCellarSignature}</h2><p>{content.philosophy}</p></header>
        <div>
          <article><span>01</span><h3>{ui.vineyard}</h3><p>{content.vineyard}</p></article>
          <article><span>02</span><h3>{ui.cellarLabel}</h3><p>{content.cellar}</p></article>
          <article><span>03</span><h3>{ui.signature}</h3><p>{content.speciality}</p></article>
        </div>
      </section>
      <ProducerDecisionMap producer={producer} region={region} locale={locale}/>
      <section className="related-section">
        <span className="eyebrow">{ui.fromCellar}</span>
        <h2>
          {producerWines.length
            ? ui.winesAtlas
            : ui.regionalThread}
        </h2>
        {producerWines.length ? (
          <div className="wine-shelf">
            {producerWines.map((w) => (
              <WineCard key={w.id} wine={w} />
            ))}
          </div>
        ) : (
          <p className="soft-copy">{ui.producerExpansion}</p>
        )}
      </section>
    </article>
  );
}

function WineCard({ wine }: { wine: (typeof wines)[number] }) {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const producer = producers.find((p) => p.id === wine.producerId);
  return (
    <Link to={`/wines/${wine.id}`} className={`wine-card style-${wine.style}`}>
      <WineBottleArt wine={wine} producer={producer} compact/>
      <small>
        {wine.vintage ?? "—"} · {styleLabel(wine.style,locale)}
      </small>
      <h3>{wine.name}</h3>
      <p>{producer?.name}</p>
      <span>
        {ui.openWine} <ArrowRight size={14} />
      </span>
    </Link>
  );
}

function WinePage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const {user}=useAuth()
  const navigate=useNavigate()
  const { slug } = useParams();
  const wine = wines.find((w) => w.id === slug);
  if (!wine) return <NotFound />;
  const wineId = wine.id;
  const producer = producers.find((p) => p.id === wine.producerId)!;
  const region = regions.find((r) => r.id === wine.regionId)!;
  const wineGrapes = grapes.filter((g) => wine.grapeIds.includes(g.id));
  const wineAromas = aromas.filter((a) => wine.aromaIds.includes(a.id));
  const [added, setAdded] = useState(() =>
    repository.cellar.all().some((i) => i.wineId === wineId),
  );
  const content=wineContent(wine,producer,region,locale)
  function add() {
    if(!user){navigate(`/profile?returnTo=${encodeURIComponent(`/wines/${wineId}`)}`);return}
    const items = repository.cellar.all();
    if (!items.some((i) => i.wineId === wineId)) {
      items.push({
        id: crypto.randomUUID(),
        wineId,
        state: "owned",
        quantity: 1,
        location: ui.homeCellar,
      });
      repository.cellar.save(items);
    }
    setAdded(true);
  }
  return (
    <article className="page detail-page wine-page">
      <BackLink to={`/wineries/${producer.id}`} label={producer.name} />
      <div className="entity-route">
        <Link to={`/regions/${region.id}`}>{regionName(region,locale)}</Link>
        <i />
        <Link to={`/wineries/${producer.id}`}>{producer.name}</Link>
        <i />
        <span>{wine.name}</span>
      </div>
      <section className="wine-hero">
        <WineBottleArt wine={wine} producer={producer}/>
        <div>
          <span className="eyebrow">
            {styleLabel(wine.style,locale)} {ui.wineType} · {countryLabel(region.country,locale)}
          </span>
          <h1>{wine.name}</h1>
          <p className="producer-name">{producer.name}</p>
          <p className="lead">{content.summary}</p>
          <div className="wine-actions">
            <button className="primary-button" onClick={add}>
              {added ? (
                <>
                  <Check size={17} />
                  {ui.inYourCellar}
                </>
              ) : (
                <>
                  <Plus size={17} />
                  {ui.addToCellar}
                </>
              )}
            </button>
            <button className="secondary-button">
              <Share2 size={17} />
              {ui.share}
            </button>
          </div>
        </div>
      </section>
      <section className="detail-layout">
        <div>
          <span className="eyebrow">{ui.blendCharacter}</span>
          <h2>{ui.structuredView}</h2>
          <div className="thread-cloud">
            {wineGrapes.map((g) => (
              <ThreadLink key={g.id} to={`/grapes/${g.id}`} tone="moss">
                {g.name}
              </ThreadLink>
            ))}
          </div>
          <p className="lead">{content.serving}</p>
        </div>
        <dl className="facts">
          <div>
            <dt>{ui.vintage}</dt>
            <dd>{wine.vintage ?? "—"}</dd>
          </div>
          <div>
            <dt>{ui.style}</dt>
            <dd>{styleLabel(wine.style,locale)}</dd>
          </div>
          <div className="community-fact"><dt>{ui.community}</dt><dd><CommunityRating entityType="wine" entityId={wine.id}/></dd></div>
        </dl>
      </section>
      <section className="wine-process">
        <div className="process-image"><img src={winemakingJourney} alt={ui.winemakingAlt}/><span>{wine.composition}</span></div>
        <div className="process-copy">
          <span className="eyebrow">{ui.fromFruitBottle}</span>
          <h2>{ui.howStyleBuilt}</h2>
          <ol>
            <li><span>01</span><div><h3>{ui.composition}</h3><p>{wine.composition}</p></div></li>
            <li><span>02</span><div><h3>{ui.vinification}</h3><p>{content.vinification}</p></div></li>
            <li><span>03</span><div><h3>{ui.maturation}</h3><p>{content.maturation}</p></div></li>
            <li><span>04</span><div><h3>{ui.whenOpen}</h3><p>{content.drinkWindow}</p></div></li>
          </ol>
        </div>
      </section>
      <WineEvolutionLesson wine={wine} locale={locale}/>
      <section className="pairing-strip"><span className="eyebrow">{ui.atTable}</span><h2>{ui.pairEcho}</h2><div>{content.pairings.map(item=><span key={item}>{item}</span>)}</div></section>
      <section className="related-section">
        <span className="eyebrow">{ui.aromaProfile}</span>
        <h2>{ui.promptsStyle}</h2>
        <div className="aroma-profile">
          {wineAromas.map((a, index) => (
            <Link to={`/aromas?selected=${a.id}`} key={a.id}>
              <div>
                <span>{aromaContent(a,locale).family}</span>
                <strong>{aromaContent(a,locale).name}</strong>
              </div>
              <i style={{ width: `${55 + (index % 3) * 18}%` }} />
              <small>
                {index % 3 === 0
                  ? ui.subtle
                  : index % 3 === 1
                    ? ui.present
                    : ui.pronounced}{" "}
                · {aromaContent(a,locale).origin.split(".")[0]}
              </small>
            </Link>
          ))}
        </div>
      </section>
      <WineMerchantOffers wineId={wine.id} />
      <section className="note-callout">
        <div>
          <NotebookPen />
          <span>{ui.makeYours}</span>
          <h2>{ui.rememberQuestion}</h2>
          <p>{ui.noteBody}</p>
        </div>
        <Link to="/cellar" className="primary-button ink">
          {ui.openNotes}
        </Link>
      </section>
    </article>
  );
}

const families = [...new Set(aromas.map((aroma) => aroma.family))];
function AromaPage() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const copy = usePageCopy();
  const query = new URLSearchParams(useLocation().search);
  const initial = query.get("selected");
  const initialAroma = aromas.find((a) => a.id === initial) ?? aromas[0];
  const initialStyle = initialAroma.styles[0] ?? "white";
  const [style, setStyle] = useState<WineStyle>(initialStyle);
  const [tier, setTier] = useState<Aroma["tier"]>(initialAroma.tier);
  const [intensity, setIntensity] = useState(1);
  const [family, setFamily] = useState(initialAroma.family);
  const [selected, setSelected] = useState<Aroma>(initialAroma);
  const [lensNotice,setLensNotice]=useState('')
  const lensCopy={
    en:{help:'Start with a wine style and origin layer. Choose a family in the middle ring, then a precise aroma on the outer ring. Tab or use arrow keys to move.',reset:'Reset lens',family:'Family',subfamily:'Subfamily',aroma:'Aroma',note:'Add to tasting note',learn:'Add as tasting learning step',noteAdded:'Aroma saved for your next tasting note.',learnAdded:'Aroma calibration added to your tasting storyline.',confuse:'Compare before deciding',calibrate:'Calibration references',compareBody:'Smell these nearby references side by side; shared family cues can otherwise make the first confident word feel more precise than it is.'},
    de:{help:'Beginne mit Weinstil und Herkunftsebene. Wähle eine Familie im mittleren Ring und dann ein präzises Aroma außen. Mit Tab oder Pfeiltasten navigieren.',reset:'Linse zurücksetzen',family:'Familie',subfamily:'Unterfamilie',aroma:'Aroma',note:'Zur Verkostungsnotiz',learn:'Als Lernschritt hinzufügen',noteAdded:'Aroma für deine nächste Verkostungsnotiz gespeichert.',learnAdded:'Aromakalibrierung zur Verkostungsreise hinzugefügt.',confuse:'Vor der Entscheidung vergleichen',calibrate:'Kalibrierungsreferenzen',compareBody:'Rieche diese nahen Referenzen nebeneinander. Gemeinsame Familienmerkmale können das erste sichere Wort präziser wirken lassen, als es ist.'},
    fr:{help:'Commencez par le style et la couche d’origine. Choisissez une famille dans l’anneau central, puis un arôme précis à l’extérieur. Tabulation ou flèches pour naviguer.',reset:'Réinitialiser la lentille',family:'Famille',subfamily:'Sous-famille',aroma:'Arôme',note:'Ajouter à la note',learn:'Ajouter comme étape pédagogique',noteAdded:'Arôme conservé pour votre prochaine note.',learnAdded:'Calibration aromatique ajoutée au parcours de dégustation.',confuse:'Comparer avant de décider',calibrate:'Références de calibration',compareBody:'Sentez ces références proches côte à côte ; les points communs peuvent rendre le premier mot assuré plus précis qu’il ne l’est.'},
    es:{help:'Empieza por estilo y capa de origen. Elige una familia en el anillo central y un aroma preciso en el exterior. Usa Tab o flechas para moverte.',reset:'Reiniciar lente',family:'Familia',subfamily:'Subfamilia',aroma:'Aroma',note:'Añadir a la nota',learn:'Añadir como paso de aprendizaje',noteAdded:'Aroma guardado para tu próxima nota.',learnAdded:'Calibración aromática añadida al recorrido de cata.',confuse:'Comparar antes de decidir',calibrate:'Referencias de calibración',compareBody:'Huele estas referencias cercanas una junto a otra; las señales compartidas pueden hacer que la primera palabra parezca más precisa de lo que es.'},
  }[locale]
  const visibleFamilies = families.filter((f) =>
    aromas.some((a) => a.family === f && a.styles.includes(style) && a.tier === tier),
  );
  const visibleAromas = aromas.filter(
    (a) => a.family === family && a.styles.includes(style) && a.tier === tier,
  );
  const selectedContent=aromaContent(selected,locale)
  const confusionPairs=aromas.filter(item=>item.id!==selected.id&&item.styles.includes(style)&&(item.subfamily===selected.subfamily||item.family===selected.family)).slice(0,3)
  function chooseAroma(item:Aroma){setSelected(item);setIntensity(1);setLensNotice('')}
  function resetLens(){selectStyle(initialStyle);setTier(initialAroma.tier);setFamily(initialAroma.family);chooseAroma(initialAroma)}
  function moveWithArrows(event:React.KeyboardEvent<SVGPathElement>,items:Aroma[],current:Aroma){
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return
    event.preventDefault();const direction=event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:1,index=items.findIndex(item=>item.id===current.id),next=items[(index+direction+items.length)%items.length];if(next){chooseAroma(next);requestAnimationFrame(()=>document.querySelector<SVGPathElement>(`[data-aroma-id="${next.id}"]`)?.focus())}
  }
  function addAromaNote(){localStorage.setItem('vine-atlas-aroma-draft',JSON.stringify({aromaId:selected.id,intensity,updatedAt:new Date().toISOString()}));setLensNotice(lensCopy.noteAdded)}
  function addAromaLearning(){
    const module=learningModules.find(item=>item.id==='aroma-language')!,block=module.blocks.find(item=>item.kind==='sensory-lab')!,journeys=repository.journeys.all(),target=journeys[0]??{id:crypto.randomUUID(),title:learningUi[locale].newJourney,description:module.question[locale],pace:'host' as const,access:'invite' as const,chapters:[],updatedAt:new Date().toISOString()}
    const chapter:TastingChapter={id:crypto.randomUUID(),type:'learning-block',referenceId:block.id,title:`${block.title[locale]} · ${selectedContent.name}`,hostNote:`${selectedContent.family} → ${selectedContent.subfamily} → ${selectedContent.name}: ${selectedContent.reference}`,duration:block.duration}
    const updated={...target,chapters:[...target.chapters,chapter],updatedAt:new Date().toISOString()};repository.journeys.save([updated,...journeys.filter(item=>item.id!==updated.id)]);setLensNotice(lensCopy.learnAdded)
  }
  function selectStyle(nextStyle: WineStyle) {
    const nextTier=aromas.some(a=>a.styles.includes(nextStyle)&&a.tier===tier)?tier:'primary'
    const nextFamily =
      families.find((candidate) =>
        aromas.some((a) => a.family === candidate && a.styles.includes(nextStyle) && a.tier === nextTier),
      ) ?? families[0];
    const nextAroma = aromas.find(
      (a) => a.family === nextFamily && a.styles.includes(nextStyle) && a.tier === nextTier,
    );
    setStyle(nextStyle);
    setTier(nextTier)
    setFamily(nextFamily);
    if (nextAroma) setSelected(nextAroma);
  }
  function selectTier(nextTier: Aroma["tier"]) {
    const nextAroma=aromas.find(a=>a.tier===nextTier&&a.styles.includes(style));if(!nextAroma)return
    setTier(nextTier); setFamily(nextAroma.family); setSelected(nextAroma); setIntensity(1)
  }
  return (
    <div className="page aroma-page">
      <PageIntro eyebrow={copy.aromaEyebrow} title={copy.aromaTitle}>
        <p>{copy.aromaIntro}</p>
      </PageIntro>
      <div className="lens-tabs" aria-label={ui.wineStyleLens}>
        {(
          [
            "white",
            "rose",
            "red",
            "sparkling",
            "sweet",
            "fortified",
          ] as WineStyle[]
        ).map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={style === item}
            data-style={item}
            className={style === item ? "active" : ""}
            onClick={() => selectStyle(item)}
          >
            {styleLabel(item,locale)}
          </button>
        ))}
      </div>
      <div className="aroma-tier-tabs" aria-label={ui.aromaOriginLayer}>
        {(["primary","secondary","tertiary"] as const).map((item)=><button key={item} disabled={!aromas.some(a=>a.tier===item&&a.styles.includes(style))} className={tier===item?'active':''} onClick={()=>selectTier(item)}><span>{item==='primary'?'01':item==='secondary'?'02':'03'}</span><strong>{ui[item]}</strong><small>{item==='primary'?ui.primaryHelp:item==='secondary'?ui.secondaryHelp:ui.tertiaryHelp}</small></button>)}
      </div>
      <div className="aroma-guidebar"><div className="aroma-breadcrumb"><span>{lensCopy.family}</span><button onClick={()=>setFamily(selected.family)}>{selectedContent.family}</button><ChevronRight/><span>{lensCopy.subfamily}</span><button>{selectedContent.subfamily}</button><ChevronRight/><span>{lensCopy.aroma}</span><strong>{selectedContent.name}</strong></div><p><Compass size={16}/>{lensCopy.help}</p><button className="aroma-reset" onClick={resetLens}><RotateCcw size={15}/>{lensCopy.reset}</button></div>
      <section className="wheel-layout">
        <div className="wheel-wrap">
          <svg
            viewBox="0 0 520 520"
            className="aroma-wheel"
            role="group"
            aria-label={`${styleLabel(style,locale)} · ${ui.aromaFamilyWheel}`}
          >
            {visibleFamilies.map((item, index) => {
              const angle = 360 / visibleFamilies.length;
              return (
                <path
                  key={item}
                  role="button"
                  tabIndex={0}
                  aria-label={aromaContent(aromas.find(a=>a.family===item)!,locale).family}
                  className={family === item ? "selected" : ""}
                  d={donutPath(
                    260,
                    260,
                    104,
                    196,
                    index * angle + 1,
                    (index + 1) * angle - 1,
                  )}
                  onClick={() => {
                    setFamily(item);
                    const first = aromas.find(
                      (a) => a.family === item && a.styles.includes(style),
                    );
                    if (first) setSelected(first);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setFamily(item);
                      const first = aromas.find(
                        (a) => a.family === item && a.styles.includes(style),
                      );
                      if (first) setSelected(first);
                    }
                    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){
                      event.preventDefault();const direction=event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:1,next=visibleFamilies[(index+direction+visibleFamilies.length)%visibleFamilies.length];setFamily(next);const first=aromas.find(a=>a.family===next&&a.styles.includes(style)&&a.tier===tier);if(first)chooseAroma(first)
                    }
                  }}
                />
              );
            })}
            {visibleAromas.map((item,index)=>{
              const angle=360/visibleAromas.length
              const itemContent=aromaContent(item,locale)
              return <path key={item.id} data-aroma-id={item.id} role="button" tabIndex={0} aria-current={selected.id===item.id?'true':undefined} aria-label={`${itemContent.subfamily}: ${itemContent.name}`} className={`descriptor-segment ${selected.id===item.id?'selected':''}`} d={donutPath(260,260,204,248,index*angle+1,(index+1)*angle-1)} onClick={()=>chooseAroma(item)} onKeyDown={(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();chooseAroma(item)}moveWithArrows(event,visibleAromas,item)}}/>
            })}
            <circle cx="260" cy="260" r="82" />
            <text x="260" y="248" data-testid="active-aroma-style">
              {style.toUpperCase()}
            </text>
            <text x="260" y="277">
              {ui.aromaLens.toUpperCase()}
            </text>
            {visibleFamilies.map((item, index) => {
              const angle = (index + 0.5) * (360 / visibleFamilies.length) - 90;
              const point = polar(260, 260, 150, angle);
              return (
                <text
                  key={item}
                  x={point.x}
                  y={point.y}
                  className="wheel-label"
                >
                  {aromaContent(aromas.find(a=>a.family===item)!,locale).family.split(" ")[0]}
                </text>
              );
            })}
            {visibleAromas.map((item,index)=>{
              const angle=(index+.5)*(360/visibleAromas.length)-90
              const point=polar(260,260,226,angle)
              const label=aromaContent(item,locale).name
              return <text key={item.id} x={point.x} y={point.y} className="descriptor-label">{label.length>10?label.slice(0,9)+'…':label}</text>
            })}
          </svg>
        </div>
        <aside className="aroma-detail">
          <span className="eyebrow">{selectedContent.family} · {selectedContent.subfamily}</span>
          <h2>{selectedContent.name}</h2>
          <p className="sensory-reference">“{selectedContent.reference}”</p>
          <p>{selectedContent.origin}</p>
          <div className="intensity-scale">
            <div><span>{ui.intensityGlass}</span><strong>{selectedContent.intensity[intensity]}</strong></div>
            <div>{selectedContent.intensity.map((label,index)=><button key={label} className={intensity===index?'active':''} onClick={()=>setIntensity(index)} aria-label={label}><i/></button>)}</div>
          </div>
          <div className="aroma-options">
            {visibleAromas.map((a) => (
              <button
                className={selected.id === a.id ? "active" : ""}
                onClick={() => chooseAroma(a)}
                key={a.id}
              >
                {aromaContent(a,locale).name}
              </button>
            ))}
          </div>
          <div className="aroma-learning-actions"><button className="primary-button ink" onClick={addAromaNote}><NotebookPen size={16}/>{lensCopy.note}</button><button className="secondary-button" onClick={addAromaLearning}><Layers3 size={16}/>{lensCopy.learn}</button></div>
          {lensNotice&&<p className="aroma-notice" role="status"><Check size={15}/>{lensNotice}</p>}
          <section className="aroma-confusion"><span className="eyebrow">{lensCopy.confuse}</span><p>{lensCopy.compareBody}</p><div>{confusionPairs.map(item=><button key={item.id} onClick={()=>chooseAroma(item)}><span>{aromaContent(item,locale).subfamily}</span><strong>{aromaContent(item,locale).name}</strong><small>{aromaContent(item,locale).reference}</small></button>)}</div></section>
          <h3>{copy.followNote}</h3>
          <div className="thread-cloud">
            {grapes
              .filter((g) => selected.grapeIds.includes(g.id))
              .slice(0, 4)
              .map((g) => (
                <ThreadLink key={g.id} to={`/grapes/${g.id}`} tone="moss">
                  {g.name}
                </ThreadLink>
              ))}
            {wines
              .filter((w) => w.aromaIds.includes(selected.id))
              .slice(0, 2)
              .map((w) => (
                <ThreadLink key={w.id} to={`/wines/${w.id}`}>
                  {w.name}
                </ThreadLink>
              ))}
          </div>
        </aside>
      </section>
      <section className="aroma-reference-panel"><img src={aromaReference} alt={ui.aromaReferenceAlt}/><div><span className="eyebrow">{ui.calibrate}</span><h2>{ui.smellBeforeName}</h2><p>{ui.smellBody}</p><Link to="/learn/aroma-language" className="primary-button ink">{ui.openSensory}</Link></div></section>
      <section className="source-note">
        <BookOpen />
        <p>
          <strong>{copy.caveat}</strong>
          <br />
          {copy.caveatBody}
        </p>
      </section>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function donutPath(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  start: number,
  end: number,
) {
  const a = polar(cx, cy, outer, start - 90),
    b = polar(cx, cy, outer, end - 90),
    c = polar(cx, cy, inner, end - 90),
    d = polar(cx, cy, inner, start - 90),
    large = end - start > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${outer} ${outer} 0 ${large} 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 ${large} 0 ${d.x} ${d.y} Z`;
}

function LearnPage() {
  const copy = usePageCopy();
  const {locale}=useLocale()
  const ui=useUiCopy()
  const localizedArticles=articles.map(article=>articleContent(article,locale))
  const tracks=[
    {name:ui.trackTaste,description:ui.trackTasteBody,ids:['taste-with-intention','aroma-language','wine-faults']},
    {name:ui.trackVineyard,description:ui.trackVineyardBody,ids:['vine-year','terroir-layers','climate-and-altitude']},
    {name:ui.trackCellar,description:ui.trackCellarBody,ids:['vine-to-glass','fermentation','maturation-vessels','lees-and-malolactic']},
    {name:ui.trackTable,description:ui.trackTableBody,ids:['labels-and-origin','food-pairing','service','cellaring']},
  ]
  return (
    <div className="page learn-page">
      <PageIntro eyebrow={copy.learnEyebrow} title={copy.learnTitle}>
        <p>{copy.learnIntro}</p>
      </PageIntro>
      <section className="lead-article">
        <img src={winemakingJourney} alt={ui.learningJourneyAlt} />
        <div>
          <span>
            {localizedArticles[0].eyebrow} · {localizedArticles[0].minutes} {ui.minRead}
          </span>
          <h2>{localizedArticles[0].title}</h2>
          <p>{localizedArticles[0].summary}</p>
          <Link to={`/learn/${localizedArticles[0].id}`} className="primary-button ink">
            {copy.readStory}
          </Link>
        </div>
      </section>
      <section className="learning-tracks">
        <div className="section-heading"><div><span className="eyebrow">{ui.structuredPaths}</span><h2>{ui.chooseQuestion}</h2></div><span>{articles.length} {ui.illustratedLessons}</span></div>
        <div>{tracks.map((track,index)=><article key={track.name}><span>0{index+1}</span><h3>{track.name}</h3><p>{track.description}</p><div>{track.ids.map(id=>{const lesson=localizedArticles.find(item=>item.id===id);return lesson?<Link key={id} to={`/learn/${id}`}>{lesson.title}<ChevronRight size={14}/></Link>:null})}</div></article>)}</div>
      </section>
      <section className="academy-visuals">
        <Link to="/learn/terroir-layers"><img src={terroirIllustration} alt={ui.terroirAlt}/><span><small>{ui.interactiveFoundation}</small><strong>{ui.readTerroir}</strong></span></Link>
        <Link to="/learn/aroma-language"><img src={aromaReference} alt={ui.aromaGlassAlt}/><span><small>{ui.sensoryPractice}</small><strong>{ui.buildMemory}</strong></span></Link>
        <Link to="/learn/vine-year"><img src={vineSeasonStudy} alt=""/><span><small>{ui.structuredPaths}</small><strong>{localizedArticles.find(article=>article.id==='vine-year')?.title}</strong></span></Link>
        <Link to="/learn/soil-water-roots"><img src={soilAtlas} alt=""/><span><small>{ui.interactiveFoundation}</small><strong>{localizedArticles.find(article=>article.id==='soil-water-roots')?.title}</strong></span></Link>
      </section>
      <div className="article-index">
        {localizedArticles.slice(1).map((article, index) => (
          <Link to={`/learn/${article.id}`} key={article.id}>
            <span>{String(index + 2).padStart(2, "0")}</span>
            <div>
              <small>
                {article.eyebrow} · {article.minutes} {ui.minRead}
              </small>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
            </div>
            <ArrowRight />
          </Link>
        ))}
      </div>
    </div>
  );
}
function ArticlePage() {
  const copy = usePageCopy();
  const {locale}=useLocale()
  const ui=useUiCopy()
  const { slug } = useParams();
  const sourceArticle = articles.find((a) => a.id === slug);
  if (!sourceArticle) return <NotFound />;
  const article=articleContent(sourceArticle,locale)
  const nextArticle=articleContent(articles[(articles.indexOf(sourceArticle)+1)%articles.length],locale)
  const illustration=guideImage(article.id)??(article.image==='terroir'?terroirIllustration:article.image==='winemaking'?winemakingJourney:article.image==='aroma'?aromaReference:article.image==='soil'?soilAtlas:article.image==='bottle'?bottleForms:article.id==='vine-year'||article.id==='vintage-weather'?vineSeasonStudy:tastingStill)
  return (
    <article className="page reading-page">
      <BackLink to="/learn" label={copy.learnEyebrow} />
      <header>
        <span className="eyebrow">
          {article.eyebrow} · {article.minutes} {ui.minuteRead}
        </span>
        <h1>{article.title}</h1>
        <p>{article.summary}</p>
      </header>
      <figure className="lesson-hero guide-lesson-hero"><img src={illustration} alt={`${ui.illustrationFor} ${article.title}`}/></figure>
      <section className="lesson-objectives"><span className="eyebrow">{ui.byEnd}</span><h2>{ui.threeExplain}</h2><ol>{article.objectives.map((objective,index)=><li key={objective}><span>0{index+1}</span>{objective}</li>)}</ol></section>
      {article.id==='vine-to-glass'?<VineToGlassExperience locale={locale}/>:<ReferenceGuideExperience article={article} locale={locale}/>}
      {article.id!=='vine-to-glass'&&<GuideDepthBridge articleId={article.id} locale={locale}/>}
      <div className="article-body">
        {article.body.map((p, i) => (
          <section key={p}><span>{String(i+1).padStart(2,'0')}</span><p>{p}</p></section>
        ))}
        <div className="lesson-lab"><div><span className="eyebrow">{ui.inTheGlass}</span><h3>{ui.concreteComparison}</h3><p>{article.example}</p></div><div><span className="eyebrow">{ui.tryYourself}</span><h3>{ui.fiveMinuteExercise}</h3><p>{article.exercise}</p></div></div>
        <h2>{copy.takeTable}</h2>
        <p>{ui.lessonPractice}</p>
      </div>
      <AcademyMasterclass article={article} locale={locale}/>
      <section className="lesson-connections"><span className="eyebrow">{ui.continueAtlas}</span><h2>{ui.seeIdea}</h2><div className="thread-cloud">{regions.filter(region=>article.relatedRegionIds.includes(region.id)).map(region=><ThreadLink key={region.id} to={`/regions/${region.id}`} tone="moss">{regionName(region,locale)}</ThreadLink>)}{grapes.filter(grape=>article.relatedGrapeIds.includes(grape.id)).map(grape=><ThreadLink key={grape.id} to={`/grapes/${grape.id}`}>{grape.name}</ThreadLink>)}</div></section>
      <div className="next-read">
        <span>{copy.continueLearning}</span>
        <Link
          to={`/learn/${nextArticle.id}`}
        >
          {nextArticle.title}
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

function TastingsPage() {
  const { t,locale } = useLocale();
  const ui=useUiCopy()
  const copy = usePageCopy();
  const startCopy={en:{privateTitle:'Build a private tasting journey',privateBody:'Choose the wines, then weave regions, producers, grapes, aromas and authored lessons into your own running order.',privateAction:'Open journey builder',publicTitle:'Discover published tastings',publicBody:'Public events appear only after a real host creates and publishes them. There are no fabricated listings.',publicAction:'Browse events'},de:{privateTitle:'Private Verkostungsreise bauen',privateBody:'Wähle die Weine und verknüpfe Regionen, Weingüter, Rebsorten, Aromen und ausgearbeitete Lektionen zu deinem eigenen Ablauf.',privateAction:'Journey-Builder öffnen',publicTitle:'Veröffentlichte Tastings entdecken',publicBody:'Öffentliche Events erscheinen erst, wenn ein echter Host sie erstellt und veröffentlicht. Es gibt keine erfundenen Einträge.',publicAction:'Events durchsuchen'},fr:{privateTitle:'Composer un parcours privé',privateBody:'Choisissez les vins puis reliez régions, domaines, cépages, arômes et leçons rédigées dans votre propre déroulé.',privateAction:'Ouvrir le compositeur',publicTitle:'Découvrir les dégustations publiées',publicBody:'Les événements publics apparaissent uniquement lorsqu’un véritable hôte les crée et les publie. Aucun événement n’est inventé.',publicAction:'Voir les événements'},es:{privateTitle:'Crear un recorrido de cata privado',privateBody:'Elige los vinos y enlaza regiones, bodegas, variedades, aromas y lecciones desarrolladas en tu propio orden.',privateAction:'Abrir el creador',publicTitle:'Descubrir catas publicadas',publicBody:'Los eventos públicos solo aparecen cuando un anfitrión real los crea y publica. No hay listados inventados.',publicAction:'Ver eventos'}}[locale]
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  return (
    <div className="page tastings-page">
      <PageIntro
        eyebrow={copy.tastingsEyebrow}
        title={copy.tastingsTitle}
        action={<Link to="/tastings/build" className="primary-button"><Layers3 size={17}/> {ui.planJourney}</Link>}
      >
        <p>{copy.tastingsIntro}</p>
      </PageIntro>
      <section className="tasting-start-grid">
        <article><Layers3/><span className="eyebrow">{ui.storyline}</span><h2>{startCopy.privateTitle}</h2><p>{startCopy.privateBody}</p><Link to="/tastings/build" className="primary-button">{startCopy.privateAction}<ArrowRight/></Link></article>
        <article><Users/><span className="eyebrow">{ui.eventsNav}</span><h2>{startCopy.publicTitle}</h2><p>{startCopy.publicBody}</p><Link to="/events" className="secondary-button">{startCopy.publicAction}<ArrowRight/></Link></article>
      </section>
      <section className="join-panel">
        <div>
          <span className="eyebrow">{copy.invitation}</span>
          <h2>{copy.joinCode}</h2>
          <p>{copy.codeHelp}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code.trim()) navigate(`/tastings/${code.toLowerCase()}`);
          }}
        >
          <input
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            aria-label={ui.tastingCode}
          />
          <button className="primary-button" disabled={code.length < 4}>
            {t("join")}
          </button>
        </form>
      </section>
    </div>
  );
}

function chapterTypesFor(ui:ReturnType<typeof useUiCopy>,locale:Locale='en'):Array<{type:TastingChapterType;label:string;help:string}> {return [
  {type:'wine',label:ui.chapterWine,help:ui.chapterWineHelp}, {type:'region',label:ui.chapterRegion,help:ui.chapterRegionHelp},
  {type:'producer',label:ui.chapterProducer,help:ui.chapterProducerHelp}, {type:'grape',label:ui.chapterGrape,help:ui.chapterGrapeHelp},
  {type:'aroma',label:ui.chapterAroma,help:ui.chapterAromaHelp}, {type:'article',label:ui.chapterLesson,help:ui.chapterLessonHelp},
  {type:'learning-block',label:{en:'Learning block',de:'Lernblock',fr:'Bloc pédagogique',es:'Bloque de aprendizaje'}[locale],help:learningUi[locale].tastingBody},
  {type:'host-note',label:ui.chapterHost,help:ui.chapterHostHelp}, {type:'pause',label:ui.chapterPause,help:ui.chapterPauseHelp},
]}
function optionsForChapter(type:TastingChapterType,locale:Locale='en') {
  if(type==='wine') return wines.map(item=>({id:item.id,label:`${item.name}${item.vintage ? ` · ${item.vintage}` : ''}`}))
  if(type==='region') return regions.map(item=>({id:item.id,label:`${item.name} · ${countryLabel(item.country,locale)}`}))
  if(type==='producer') return producers.map(item=>({id:item.id,label:item.name}))
  if(type==='grape') return grapes.map(item=>({id:item.id,label:item.name}))
  if(type==='aroma') return aromas.map(item=>{const content=aromaContent(item,locale);return {id:item.id,label:`${content.family} · ${content.name}`}})
  if(type==='article') return [
    ...learningModules.map(item=>({id:item.id,label:`${learningUi[locale].addWhole} · ${item.title[locale]}`})),
    ...articles.map(item=>({id:item.id,label:`${{en:'Reference guide',de:'Vertiefungsguide',fr:'Guide de référence',es:'Guía de referencia'}[locale]} · ${articleContent(item,locale).title}`})),
  ]
  if(type==='learning-block') return learningModules.flatMap(module=>module.blocks.filter(block=>!['sources','glossary','entity-connections'].includes(block.kind)).map(block=>({id:block.id,label:`${module.title[locale]} · ${block.title[locale]}`})))
  return []
}
function referenceTitle(type:TastingChapterType,id:string|undefined,locale:Locale,ui:ReturnType<typeof useUiCopy>) {
  if(!id) return type==='pause'?ui.pauseConversation:ui.chapterHost
  if(type==='article'){const module=learningModuleById(id);if(module)return module.title[locale];const guide=articles.find(item=>item.id===id);if(guide)return articleContent(guide,locale).title}
  return optionsForChapter(type,locale).find(item=>item.id===id)?.label.split(' · ')[0] ?? ui.untitledChapter
}
function defaultJourney(locale:Locale,ui:ReturnType<typeof useUiCopy>):TastingJourney {
  return {id:crypto.randomUUID(),title:ui.defaultJourneyTitle,description:ui.defaultJourneyDescription,pace:'host',access:'invite',chapters:[],updatedAt:new Date().toISOString()}
}
function TastingBuilder() {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const chapterTypes=chapterTypesFor(ui,locale)
  const navigate=useNavigate()
  const [journey,setJourney]=useState<TastingJourney>(()=>repository.journeys.all()[0]??defaultJourney(locale,ui))
  const [type,setType]=useState<TastingChapterType>('wine')
  const [referenceId,setReferenceId]=useState(()=>optionsForChapter('wine')[0]?.id ?? '')
  const [note,setNote]=useState('')
  const [prompt,setPrompt]=useState('')
  const [reveal,setReveal]=useState('')
  const [interaction,setInteraction]=useState<TastingChapter['interaction']>('observe')
  const [duration,setDuration]=useState(7)
  const [saved,setSaved]=useState(false)
  const options=optionsForChapter(type,locale)
  const chapterCountLabel=journey.chapters.length===1?{en:'chapter',de:'Kapitel',fr:'chapitre',es:'capítulo'}[locale]:ui.chapters
  const hostCopy={en:{mode:'Table interaction',observe:'Observe',predict:'Predict',vote:'Vote',discuss:'Discuss',prompt:'Question before the reveal',promptHint:'What should guests notice or decide?',reveal:'Evidence revealed by the host',revealHint:'The explanation or comparison you want to reveal later.'},de:{mode:'Interaktion am Tisch',observe:'Beobachten',predict:'Vermuten',vote:'Abstimmen',discuss:'Diskutieren',prompt:'Frage vor der Auflösung',promptHint:'Was sollen Gäste bemerken oder entscheiden?',reveal:'Evidenz für die Auflösung',revealHint:'Welche Erklärung oder welcher Vergleich wird später sichtbar?'},fr:{mode:'Interaction à table',observe:'Observer',predict:'Prédire',vote:'Voter',discuss:'Discuter',prompt:'Question avant la révélation',promptHint:'Que doivent remarquer ou décider les invités ?',reveal:'Indices révélés par l’hôte',revealHint:'Explication ou comparaison à révéler plus tard.'},es:{mode:'Interacción en la mesa',observe:'Observar',predict:'Predecir',vote:'Votar',discuss:'Conversar',prompt:'Pregunta antes de revelar',promptHint:'¿Qué deberían notar o decidir los invitados?',reveal:'Evidencia que revela el anfitrión',revealHint:'Explicación o comparación que aparecerá después.'}}[locale]
  function chooseType(next:TastingChapterType){setType(next);setReferenceId(optionsForChapter(next,locale)[0]?.id ?? '');setNote('');setPrompt('');setReveal('');setInteraction('observe')}
  function addChapter(){
    const title=referenceTitle(type,referenceId,locale,ui)
    setJourney(current=>({...current,chapters:[...current.chapters,{id:crypto.randomUUID(),type,referenceId:referenceId||undefined,title,hostNote:note||undefined,prompt:prompt||undefined,reveal:reveal||undefined,interaction,duration}],updatedAt:new Date().toISOString()}));setSaved(false)
  }
  function move(index:number,direction:-1|1){setJourney(current=>{const chapters=[...current.chapters],target=index+direction;if(target<0||target>=chapters.length)return current;[chapters[index],chapters[target]]=[chapters[target],chapters[index]];return {...current,chapters,updatedAt:new Date().toISOString()}});setSaved(false)}
  function save(){const all=repository.journeys.all();repository.journeys.save([...all.filter(item=>item.id!==journey.id),journey]);setSaved(true)}
  return <div className="page journey-builder">
    <BackLink to="/tastings" label={ui.chapterLesson}/>
    <PageIntro eyebrow={ui.hostStudio} title={ui.composeJourney} action={<button className="primary-button" onClick={save}>{saved?<><Check/>{ui.journeySaved}</>:<>{ui.saveJourney}<Check/></>}</button>}>
      <p>{ui.composeBody}</p>
    </PageIntro>
    <section className="journey-settings">
      <label>{ui.journeyTitle}<input value={journey.title} onChange={event=>setJourney({...journey,title:event.target.value})}/></label>
      <label>{ui.invitationText}<textarea value={journey.description} onChange={event=>setJourney({...journey,description:event.target.value})}/></label>
      <label>{ui.pacing}<select value={journey.pace} onChange={event=>setJourney({...journey,pace:event.target.value as TastingJourney['pace']})}><option value="host">{ui.hostUnlocks}</option><option value="self">{ui.guestPace}</option></select></label>
      <label>{ui.access}<select value={journey.access} onChange={event=>setJourney({...journey,access:event.target.value as TastingJourney['access']})}><option value="invite">{ui.inviteQr}</option><option value="private">{ui.privateDraft}</option><option value="open">{ui.openTable}</option></select></label>
    </section>
    <div className="builder-layout">
      <section className="chapter-palette">
        <span className="eyebrow">{ui.addChapter}</span><h2>{ui.whatNext}</h2>
        <div className="chapter-type-grid">{chapterTypes.map(item=><button key={item.type} className={type===item.type?'active':''} onClick={()=>chooseType(item.type)}><span>{item.label}</span><small>{item.help}</small></button>)}</div>
        {options.length>0&&<label>{ui.atlasContent}<select value={referenceId} onChange={event=>setReferenceId(event.target.value)}>{options.map(item=><option value={item.id} key={item.id}>{item.label}</option>)}</select></label>}
        {(type==='host-note'||type==='pause')&&<label>{ui.yourWords}<textarea value={note} onChange={event=>setNote(event.target.value)} placeholder={ui.hostPlaceholder}/></label>}
        <label>{hostCopy.mode}<select value={interaction} onChange={event=>setInteraction(event.target.value as TastingChapter['interaction'])}><option value="observe">{hostCopy.observe}</option><option value="predict">{hostCopy.predict}</option><option value="vote">{hostCopy.vote}</option><option value="discuss">{hostCopy.discuss}</option></select></label>
        <label>{hostCopy.prompt}<textarea value={prompt} onChange={event=>setPrompt(event.target.value)} placeholder={hostCopy.promptHint}/></label>
        <label>{hostCopy.reveal}<textarea value={reveal} onChange={event=>setReveal(event.target.value)} placeholder={hostCopy.revealHint}/></label>
        <label>{ui.timeTable}<div className="duration-input"><input type="range" min="2" max="25" value={duration} onChange={event=>setDuration(Number(event.target.value))}/><span>{duration} {ui.minuteShort}</span></div></label>
        <button className="primary-button" onClick={addChapter}><Plus/>{ui.addStoryline}</button>
      </section>
      <section className="storyline-editor">
        <div className="section-heading"><div><span className="eyebrow">{ui.storyline}</span><h2>{journey.chapters.length} {chapterCountLabel} · {journey.chapters.reduce((sum,item)=>sum+item.duration,0)} {ui.minuteShort}</h2></div></div>
        <div className="storyline-list">{journey.chapters.map((chapter,index)=><article key={chapter.id}>
          <GripVertical className="drag-hint"/><span className="chapter-number">{String(index+1).padStart(2,'0')}</span>
          <div><small>{chapterTypes.find(item=>item.type===chapter.type)?.label} · {chapter.duration} {ui.minuteShort}</small><h3>{chapter.title}</h3>{chapter.prompt&&<p><strong>{hostCopy.prompt}:</strong> {chapter.prompt}</p>}{chapter.hostNote&&<p>{chapter.hostNote}</p>}</div>
          <div className="chapter-actions"><button onClick={()=>move(index,-1)} disabled={index===0} aria-label={ui.moveEarlier}><ChevronUp/></button><button onClick={()=>move(index,1)} disabled={index===journey.chapters.length-1} aria-label={ui.moveLater}><ChevronDown/></button><button onClick={()=>setJourney({...journey,chapters:journey.chapters.filter(item=>item.id!==chapter.id)})} aria-label={ui.removeChapter}><Trash2/></button></div>
        </article>)}</div>
        <div className="builder-footer"><div><strong>{journey.pace==='host'?ui.hostPaced:ui.selfPaced}</strong><span>{journey.access==='open'?ui.anyoneJoin:journey.access==='invite'?ui.inviteAccess:ui.privateDraft}</span></div><button className="secondary-button" onClick={()=>{save();navigate(`/tastings/${journey.id}`)}}>{ui.previewJourney} <ArrowRight/></button></div>
      </section>
    </div>
  </div>
}

export function JourneyExperience({journey}:{journey:TastingJourney}) {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const chapterTypes=chapterTypesFor(ui,locale)
  const [current,setCurrent]=useState(0);const chapter=journey.chapters[current]
  const wine=chapter?.type==='wine'?wines.find(item=>item.id===chapter.referenceId):undefined
  const region=chapter?.type==='region'?regions.find(item=>item.id===chapter.referenceId):undefined
  const producer=chapter?.type==='producer'?producers.find(item=>item.id===chapter.referenceId):undefined
  const grape=chapter?.type==='grape'?grapes.find(item=>item.id===chapter.referenceId):undefined
  const aroma=chapter?.type==='aroma'?aromas.find(item=>item.id===chapter.referenceId):undefined
  const article=chapter?.type==='article'?articles.find(item=>item.id===chapter.referenceId):undefined
  const lessonModule=chapter?.type==='article'?learningModuleById(chapter.referenceId??''):undefined
  const learning=chapter?.type==='learning-block'?learningBlockById(chapter.referenceId??''):undefined
  const link=wine?`/wines/${wine.id}`:region?`/regions/${region.id}`:producer?`/wineries/${producer.id}`:grape?`/grapes/${grape.id}`:aroma?`/aromas?selected=${aroma.id}`:article?`/learn/${article.id}`:lessonModule?`/learn/${lessonModule.id}`:learning?`/learn/${learning.module.id}`:null
  const body=wine?wineContent(wine,producers.find(item=>item.id===wine.producerId)!,regions.find(item=>item.id===wine.regionId)!,locale).summary:region?regionContent(region,locale).summary:producer?producerContent(producer,regions.find(item=>item.id===producer.regionId)!,locale).summary:grape?grapeContent(grape,locale).summary:aroma?aromaContent(aroma,locale).reference:article?articleContent(article,locale).summary:lessonModule?lessonModule.question[locale]:learning?learning.module.question[locale]:chapter?.hostNote??ui.quietMoment
  return <div className="journey-room">
    <header><Link to="/tastings"><X/></Link><div><small>{journey.pace==='host'?ui.hostLearningJourney:ui.selfLearningJourney}</small><strong>{journey.title}</strong></div><span>{current+1} / {journey.chapters.length}</span></header>
    <aside>{journey.chapters.map((item,index)=><button key={item.id} className={index===current?'active':index<current?'done':''} onClick={()=>setCurrent(index)}><span>{index<current?<Check/>:String(index+1).padStart(2,'0')}</span><div><small>{chapterTypes.find(type=>type.type===item.type)?.label}</small><strong>{item.title}</strong></div><em>{item.duration}m</em></button>)}</aside>
    <main><span className="eyebrow">{ui.chapter} {String(current+1).padStart(2,'0')} · {chapterTypes.find(item=>item.type===chapter?.type)?.label}</span><h1>{chapter?.title}</h1><p className="lead">{body}</p>
      {journey.pace==='host'&&chapter&&<TastingHostConsole journey={journey} chapter={chapter}/>}
      {wine&&<div className="journey-wine"><div className={`room-bottle style-${wine.style}`}/><div><span>{wine.composition}</span><p>{wine.serving}</p></div></div>}
      {region&&<div className="journey-facts"><article><span>{ui.climate}</span><p>{regionContent(region,locale).climate}</p></article><article><span>{ui.ground}</span><p>{regionContent(region,locale).soil}</p></article></div>}
      {producer&&<div className="journey-facts"><article><span>{ui.vineyard}</span><p>{producerContent(producer,regions.find(item=>item.id===producer.regionId)!,locale).vineyard}</p></article><article><span>{ui.cellarLabel}</span><p>{producerContent(producer,regions.find(item=>item.id===producer.regionId)!,locale).cellar}</p></article></div>}
      {grape&&<div className="journey-facts"><article><span>{ui.growing}</span><p>{grapeContent(grape,locale).ripening}</p></article><article><span>{ui.cellarLabel}</span><p>{grapeContent(grape,locale).winemaking}</p></article></div>}
      {aroma&&<div className="journey-aroma"><span>{aromaContent(aroma,locale).family} · {aromaContent(aroma,locale).subfamily}</span><strong>{aromaContent(aroma,locale).name}</strong><p>{aromaContent(aroma,locale).origin}</p></div>}
      {article&&<ol className="journey-objectives">{articleContent(article,locale).objectives.map(item=><li key={item}>{item}</li>)}</ol>}
      {lessonModule&&<InlineLearningChapter referenceId={lessonModule.id}/>}
      {learning&&<InlineLearningChapter referenceId={learning.block.id}/>}
      {link&&<Link to={link} className="text-link">{ui.openComplete} <ArrowRight size={15}/></Link>}
      <div className="journey-navigation"><button className="secondary-button" disabled={current===0} onClick={()=>setCurrent(current-1)}><ArrowLeft/>{ui.previous}</button><div><small>{ui.upNext}</small><strong>{journey.chapters[current+1]?.title??ui.journeyComplete}</strong></div><button className="primary-button" disabled={current===journey.chapters.length-1} onClick={()=>setCurrent(current+1)}>{ui.nextChapter}<ArrowRight/></button></div>
    </main>
  </div>
}


function AdminPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const ui=useUiCopy()
  const copy = usePageCopy();
  if (!user?.roles.includes("admin"))
    return (
      <div className="page guarded">
        <ShieldCheck />
        <h1>{ui.curatorsOnly}</h1>
        <p>{ui.curatorsOnlyBody}</p>
        <Link to="/profile" className="primary-button ink">
          {ui.openProfile}
        </Link>
      </div>
    );
  return (
    <div className="page admin-page">
      <PageIntro eyebrow={copy.curatorWorkspace} title={copy.curatorWorkspace}>
        <p>{copy.curatorBody}</p>
      </PageIntro>
      <Deferred><DatabaseStatus /></Deferred>
      <Deferred><AdminOperationsOverview /></Deferred>
      <section className="admin-counts">
        <div>
          <MapIcon />
          <strong>{counts.regions}</strong>
          <span>{t("regions")}</span>
        </div>
        <div>
          <Grape />
          <strong>{counts.grapes}</strong>
          <span>{t("grapes")}</span>
        </div>
        <div>
          <Users />
          <strong>{counts.producers}</strong>
          <span>{t("producers")}</span>
        </div>
        <div>
          <Wine />
          <strong>{counts.wines}</strong>
          <span>{t("wines")}</span>
        </div>
      </section>
      <Deferred><AccountRoleManager /></Deferred>
      <Deferred><EditorialStudio /></Deferred>
      <BusinessAdminPanel />
      <Deferred><AuditTrail /></Deferred>
    </div>
  );
}

function ProfilePage() {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocale();
  const copy = usePageCopy();
  const ui = useUiCopy();
  const location=useLocation();
  const navigate=useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const returnTo=useMemo(()=>{const value=new URLSearchParams(location.search).get('returnTo');return value?.startsWith('/')&&!value.startsWith('//')&&value.length<500?value:null},[location.search]);
  const authContext={
    en:{title:'Sign in to create your tasting',body:'Your event workspace is ready next. After sign-in, we will return you directly to event creation.'},
    de:{title:'Anmelden und Verkostung anlegen',body:'Als Nächstes wartet dein Veranstaltungsbereich. Nach der Anmeldung kehrst du direkt zur Event-Erstellung zurück.'},
    fr:{title:'Connectez-vous pour créer votre dégustation',body:'Votre espace événementiel vous attend à l’étape suivante. Après connexion, vous reviendrez directement à la création.'},
    es:{title:'Inicia sesión para crear tu cata',body:'Tu espacio de eventos es el siguiente paso. Después de iniciar sesión, volverás directamente a la creación.'},
  }[locale];
  useEffect(()=>{if(!user&&returnTo)setAuthOpen(true)},[user,returnTo]);
  useEffect(()=>{if(user&&returnTo)navigate(returnTo,{replace:true})},[user,returnTo,navigate]);
  const roleNames={en:{member:'Private member',host:'Professional host',winery:'Winery',merchant:'Wine merchant',admin:'Administrator'},de:{member:'Privatperson',host:'Professioneller Host',winery:'Weingut',merchant:'Weinhändler',admin:'Administrator'},fr:{member:'Membre privé',host:'Hôte professionnel',winery:'Domaine',merchant:'Marchand de vin',admin:'Administrateur'},es:{member:'Persona privada',host:'Anfitrión profesional',winery:'Bodega',merchant:'Comerciante de vino',admin:'Administrador'}}[locale]
  return (
    <div className="page profile-page">
      <PageIntro
        eyebrow={copy.profileEyebrow}
        title={user ? user.username : copy.profileGuestTitle}
      >
        <p>
          {user
            ? copy.profileUserIntro
            : copy.profileGuestIntro}
        </p>
      </PageIntro>
      {!user&&returnTo==='/studio/events'&&<section className="auth-return-context" role="status"><ShieldCheck/><div><h2>{authContext.title}</h2><p>{authContext.body}</p></div></section>}
      <section className="profile-card">
        <div className="profile-avatar">
          {user?.username.charAt(0).toUpperCase() || <CircleUserRound />}
        </div>
        <div>
          {user?<div className="profile-role-chips">{user.roles.map(role=><span key={role}>{roleNames[role]}</span>)}</div>:<span>{copy.guestExplorer}</span>}
          <h2>{user?.username || copy.localProfile}</h2>
          <p>
            {user
              ? copy.signedIn
              : copy.atlasReady}
          </p>
        </div>
        {user ? (
          <button className="secondary-button" onClick={logout}>
            {t("signOut")}
          </button>
        ) : (
          <button className="primary-button" onClick={() => setAuthOpen(true)}>
            {t("signIn")}
          </button>
        )}
      </section>
      <section className="settings-list">
        <div>
          <div>
            <span className="settings-icon">
              <Library />
            </span>
            <div>
              <h3>{t("language")}</h3>
              <p>{copy.interfaceTranslated}</p>
            </div>
          </div>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as typeof locale)}
          >
            {localeRegistry.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div>
            <span className="settings-icon">
              <LockKeyhole />
            </span>
            <div>
              <h3>{copy.privacy}</h3>
              <p>{copy.privacyBody}</p>
            </div>
          </div>
          <ChevronRight />
        </div>
        {user && (
          <Link to="/studio">
            <div>
              <span className="settings-icon">
                <Settings />
              </span>
              <div>
                <h3>{ui.studioNav}</h3>
                <p>{ui.studioBody}</p>
              </div>
            </div>
            <ChevronRight />
          </Link>
        )}
        {user?.roles.includes("admin") && (
          <Link to="/admin">
            <div>
              <span className="settings-icon">
                <ShieldCheck />
              </span>
              <div>
                <h3>{copy.curatorWorkspace}</h3>
                <p>{copy.curatorBody}</p>
              </div>
            </div>
            <ChevronRight />
          </Link>
        )}
      </section>
      <section className="local-note">
        <ShieldCheck />
        <div>
          <h3>{copy.localSecurity}</h3>
          <p>{copy.localSecurityBody}</p>
        </div>
      </section>
      {authOpen && <AuthSheet onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

function AuthSheet({ onClose }: { onClose: () => void }) {
  const { login, register } = useAuth();
  const { t,locale } = useLocale();
  const copy = usePageCopy();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const titleId = "vine-atlas-auth-title";
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [busy, onClose]);
  const errors={en:{INVALID_CREDENTIALS:'Username or password is incorrect.',USERNAME_FORMAT:'Use 3–32 letters, numbers, dots, hyphens or underscores.',PASSWORD_LENGTH:'Use a password between 8 and 128 characters.',USERNAME_TAKEN:'This username is already taken.',ACCOUNT_DISABLED:'This account has been disabled by an administrator.',ACCOUNT_LOCKED:'Too many attempts. Try again in 15 minutes.',BACKEND_UNAVAILABLE:'The account service is temporarily unavailable.'},de:{INVALID_CREDENTIALS:'Benutzername oder Passwort ist falsch.',USERNAME_FORMAT:'Nutze 3–32 Buchstaben, Zahlen, Punkte, Bindestriche oder Unterstriche.',PASSWORD_LENGTH:'Nutze ein Passwort mit 8 bis 128 Zeichen.',USERNAME_TAKEN:'Dieser Benutzername ist bereits vergeben.',ACCOUNT_DISABLED:'Dieses Konto wurde administrativ deaktiviert.',ACCOUNT_LOCKED:'Zu viele Versuche. Probiere es in 15 Minuten erneut.',BACKEND_UNAVAILABLE:'Der Kontodienst ist vorübergehend nicht erreichbar.'},fr:{INVALID_CREDENTIALS:'Identifiant ou mot de passe incorrect.',USERNAME_FORMAT:'Utilisez 3 à 32 lettres, chiffres, points, tirets ou tirets bas.',PASSWORD_LENGTH:'Utilisez un mot de passe de 8 à 128 caractères.',USERNAME_TAKEN:'Cet identifiant est déjà utilisé.',ACCOUNT_DISABLED:'Ce compte a été désactivé par un administrateur.',ACCOUNT_LOCKED:'Trop de tentatives. Réessayez dans 15 minutes.',BACKEND_UNAVAILABLE:'Le service de compte est temporairement indisponible.'},es:{INVALID_CREDENTIALS:'El usuario o la contraseña no son correctos.',USERNAME_FORMAT:'Usa entre 3 y 32 letras, números, puntos, guiones o guiones bajos.',PASSWORD_LENGTH:'Usa una contraseña de entre 8 y 128 caracteres.',USERNAME_TAKEN:'Este nombre de usuario ya está en uso.',ACCOUNT_DISABLED:'Un administrador ha desactivado esta cuenta.',ACCOUNT_LOCKED:'Demasiados intentos. Vuelve a probar en 15 minutos.',BACKEND_UNAVAILABLE:'El servicio de cuentas no está disponible temporalmente.'}}[locale]
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result =
      mode === "login"
        ? await login(username, password)
        : await register(username, password);
    setBusy(false);
    if (result) setError(errors[result as keyof typeof errors]??errors.BACKEND_UNAVAILABLE);
    else onClose();
  }
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <form
        className="sheet auth-sheet"
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={busy}
      >
        <button type="button" className="sheet-close" onClick={onClose} aria-label={t("close")} disabled={busy}>
          <X />
        </button>
        <span className="eyebrow">{copy.localAccount}</span>
        <h2 id={titleId}>{mode === "login" ? copy.welcomeBack : copy.createProfile}</h2>
        <p>{copy.accountLocal}</p>
        <label>
          {t("username")}
          <input
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            minLength={3}
            maxLength={32}
            pattern="[A-Za-z0-9._-]{3,32}"
            autoFocus
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            required
          />
        </label>
        <label>
          {t("password")}
          <input
            type="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            required
          />
        </label>
        {error && <p className="form-error" role="alert" aria-live="assertive">{error}</p>}
        <button className="primary-button" disabled={busy}>
          {busy ? copy.checking : mode === "login" ? t("signIn") : t("register")}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          {mode === "login"
            ? copy.newAccount
            : copy.existingAccount}
        </button>
        {mode === "login" && (
          <div className="curator-login-note">
            <ShieldCheck />
            <p>
              <strong>{copy.curatorAccess}</strong>
              <br />
              {copy.curatorAccessBody}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

function GlobalSearch({ onClose }: { onClose: () => void }) {
  const {locale}=useLocale()
  const ui=useUiCopy()
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return [
      ...regions
        .filter((x) => `${x.name} ${x.country}`.toLowerCase().includes(q))
        .slice(0, 4)
        .map((x) => ({
          type: ui.region,
          name: x.name,
          meta: countryLabel(x.country,locale),
          to: `/regions/${x.id}`,
        })),
      ...grapes
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 3)
        .map((x) => ({
          type: ui.grape,
          name: x.name,
          meta:
            x.color === "red"
              ? ui.darkVariety
              : ui.lightVariety,
          to: `/grapes/${x.id}`,
        })),
      ...producers
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 3)
        .map((x) => ({
          type: ui.producer,
          name: x.name,
          meta: regions.find((r) => r.id === x.regionId)?.name || "",
          to: `/wineries/${x.id}`,
        })),
      ...wines
        .filter((x) => x.name.toLowerCase().includes(q))
        .slice(0, 4)
        .map((x) => ({
          type: ui.wine,
          name: x.name,
          meta: `${x.vintage ?? "—"} · ${styleLabel(x.style,locale)}`,
          to: `/wines/${x.id}`,
        })),
      ...articles
        .filter((x) => {const content=articleContent(x,locale);return `${content.title} ${content.summary}`.toLowerCase().includes(q)})
        .slice(0, 2)
        .map((x) => ({
          type: ui.fieldNote,
          name: articleContent(x,locale).title,
          meta: `${x.minutes} ${ui.minRead}`,
          to: `/learn/${x.id}`,
        })),
    ];
  }, [query,locale,ui]);
  return (
    <div className="search-overlay">
      <header>
        <Search />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ui.searchPlaceholder}
        />
        <button type="button" aria-label={ui.close} onClick={onClose}>
          <X />
        </button>
      </header>
      <div className="search-body">
        {query.length < 2 ? (
          <div className="search-start">
            <span className="eyebrow">{ui.searchTrace}</span>
            <h2>{ui.whereBegin}</h2>
            <div className="search-suggestions">
              {["Mosel", "Pinot Noir", "Mendoza", "Brioche"].map((item) => (
                <button onClick={() => setQuery(item)} key={item}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : results.length ? (
          <div className="search-results">
            {results.map((r, i) => (
              <Link onClick={onClose} to={r.to} key={`${r.to}-${i}`}>
                <span>{r.type}</span>
                <div>
                  <strong>{r.name}</strong>
                  <small>{r.meta}</small>
                </div>
                <ArrowRight />
              </Link>
            ))}
          </div>
        ) : (
          <div className="search-start">
            <h2>{ui.noSearchPath}</h2>
            <p>{ui.noSearchHelp}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NotFound() {
  const ui=useUiCopy()
  return (
    <div className="page guarded">
      <Compass />
      <h1>{ui.thisPath}</h1>
      <p>{ui.notFoundBody}</p>
      <Link to="/atlas" className="primary-button ink">
        {ui.openAtlas}
      </Link>
    </div>
  );
}
