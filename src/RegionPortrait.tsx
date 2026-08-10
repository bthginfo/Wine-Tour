import type { Locale } from "./i18n";
import type { Region } from "./types";
import { countryLabel, regionContent, regionName } from "./localizedContent";
import moselPortrait from "./assets/region-portrait-mosel.jpg";
import bordeauxPortrait from "./assets/region-portrait-bordeaux.jpg";
import mendozaPortrait from "./assets/region-portrait-mendoza.jpg";
import marlboroughPortrait from "./assets/region-portrait-marlborough.jpg";
import nemeaPortrait from "./assets/region-portrait-nemea.jpg";
import mediterraneanLandscape from "./assets/region-mediterranean-vines.jpg";
import riverSlateLandscape from "./assets/region-river-slate.jpg";
import maritimeLandscape from "./assets/region-maritime-vineyard.jpg";
import volcanicLandscape from "./assets/region-volcanic-altitude.jpg";
import alpineLandscape from "./assets/region-alpine-lake.jpg";
import plateauLandscape from "./assets/region-continental-plateau.jpg";
import coastalLandscape from "./assets/region-coastal-fog.jpg";
import islandLandscape from "./assets/region-windswept-island.jpg";
import bushVineLandscape from "./assets/region-ancient-bush-vines.jpg";
import limestoneLandscape from "./assets/region-estuary-limestone.jpg";
import andesLandscape from "./assets/region-andes-vineyard.jpg";

const flagshipPortraits: Record<string, string> = {
  mosel: moselPortrait,
  bordeaux: bordeauxPortrait,
  mendoza: mendozaPortrait,
  marlborough: marlboroughPortrait,
  nemea: nemeaPortrait,
};

const portraitCopy = {
  en: { eyebrow: "Terroir portrait", climate: "Growing season", ground: "Ground structure", varieties:"Linked varieties",producers:"Documented producers", coordinates: "Location", alt: "Illustrated vineyard landscape around" },
  de: { eyebrow: "Terroir-Porträt", climate: "Vegetationsperiode", ground: "Untergrund", varieties:"Verknüpfte Rebsorten",producers:"Dokumentierte Weingüter", coordinates: "Lage", alt: "Illustrierte Weinbergslandschaft rund um" },
  fr: { eyebrow: "Portrait du terroir", climate: "Cycle végétatif", ground: "Structure du sol", varieties:"Cépages reliés",producers:"Domaines documentés", coordinates: "Situation", alt: "Paysage viticole illustré autour de" },
  es: { eyebrow: "Retrato del terruño", climate: "Ciclo vegetativo", ground: "Estructura del suelo", varieties:"Variedades vinculadas",producers:"Bodegas documentadas", coordinates: "Ubicación", alt: "Paisaje vitícola ilustrado alrededor de" },
} as const;

function landscapeFor(region: Region) {
  if (flagshipPortraits[region.id]) return flagshipPortraits[region.id];
  const signal = `${region.climate} ${region.soil} ${region.summary}`.toLowerCase();
  if (/andes|altitude|high-altitude|mountain|elevated/.test(signal)) return andesLandscape;
  if (/volcan|basalt|lava/.test(signal)) return volcanicLandscape;
  if (/slate|schist|schiefer|river valley/.test(signal)) return riverSlateLandscape;
  if (/island|islands|insular|canary|azores|madeira|santorini/.test(signal)) return islandLandscape;
  if (/fog|coastal|pacific|atlantic influence/.test(signal)) return coastalLandscape;
  if (/maritime|oceanic|estuary/.test(signal)) return maritimeLandscape;
  if (/alpine|lake|glacial/.test(signal)) return alpineLandscape;
  if (/limestone|chalk|calcareous|calcaire/.test(signal)) return limestoneLandscape;
  if (/mediterranean|warm|dry|arid/.test(signal)) return mediterraneanLandscape;
  if (/old vine|bush vine|ancient/.test(signal)) return bushVineLandscape;
  return plateauLandscape;
}

export function RegionPortrait({ region, locale }: { region: Region; locale: Locale }) {
  const c = portraitCopy[locale];
  const content = regionContent(region, locale);
  const name = regionName(region, locale);
  const landscape = landscapeFor(region);
  return (
    <figure className="region-cartographic-portrait">
      <div className="region-portrait-visual">
        <div className="region-portrait-landscape">
          <img src={landscape} alt={`${c.alt} ${name}`} />
          <div className="region-portrait-title"><span>{countryLabel(region.country, locale)}</span><strong>{name}</strong></div>
          <div className="region-coordinate"><span>{c.coordinates}</span><strong>{Math.abs(region.lat).toFixed(2)}° {region.lat >= 0 ? "N" : "S"} · {Math.abs(region.lng).toFixed(2)}° {region.lng >= 0 ? "E" : "W"}</strong></div>
        </div>
      </div>
      <figcaption>
        <span className="eyebrow">{c.eyebrow}</span>
        {region.hasRegionalTerroirEvidence?<><div><strong>{c.climate}</strong><p>{content.climate}</p></div><div><strong>{c.ground}</strong><p>{content.soil}</p></div></>:<><div><strong>{c.varieties}</strong><p>{region.grapeIds.length}</p></div><div><strong>{c.producers}</strong><p>{region.producerIds.length}</p></div></>}
      </figcaption>
    </figure>
  );
}
