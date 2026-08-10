import type { Locale } from "./i18n";
import type { Region } from "./types";
import { countryLabel, regionContent, regionName } from "./localizedContent";
import moselPortrait from "./assets/region-portrait-mosel.jpg";
import bordeauxPortrait from "./assets/region-portrait-bordeaux.jpg";
import mendozaPortrait from "./assets/region-portrait-mendoza.jpg";
import marlboroughPortrait from "./assets/region-portrait-marlborough.jpg";

const flagshipPortraits: Record<string, string> = {
  mosel: moselPortrait,
  bordeaux: bordeauxPortrait,
  mendoza: mendozaPortrait,
  marlborough: marlboroughPortrait,
};

const portraitCopy = {
  en: { eyebrow: "Terroir portrait", climate: "Growing season", ground: "Ground structure", coordinates: "Atlas coordinate" },
  de: { eyebrow: "Terroir-Porträt", climate: "Vegetationsperiode", ground: "Untergrund", coordinates: "Atlas-Koordinate" },
  fr: { eyebrow: "Portrait du terroir", climate: "Cycle végétatif", ground: "Structure du sol", coordinates: "Coordonnée de l’atlas" },
  es: { eyebrow: "Retrato del terruño", climate: "Ciclo vegetativo", ground: "Estructura del suelo", coordinates: "Coordenada del atlas" },
} as const;

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) result = Math.imul(result ^ character.charCodeAt(0), 16777619);
  return Math.abs(result);
}

function proceduralPaths(region: Region) {
  const seed = hash(region.id);
  const ridgeCount = 5 + seed % 4;
  const ridges = Array.from({ length: ridgeCount }, (_, index) => {
    const y = 50 + index * (210 / ridgeCount);
    const lift = 20 + ((seed >> (index % 12)) % 42);
    const drift = ((seed >> ((index + 4) % 15)) % 90) - 45;
    return `M -30 ${y + 34} C ${130 + drift} ${y - lift}, ${245 - drift} ${y + lift / 2}, 390 ${y - lift / 3} S 690 ${y + lift}, 930 ${y - 15}`;
  });
  const parcels = Array.from({ length: 9 }, (_, index) => {
    const x = 78 + index * 92 + ((seed >> (index % 10)) % 18);
    const lean = 18 + ((seed >> ((index + 3) % 13)) % 30);
    return `M ${x} 292 L ${x + lean} 116`;
  });
  const water = /river|maritime|coast|sea|ocean|estuary|fluss|meer|océan|río|costa/i.test(`${region.climate} ${region.summary}`);
  return { ridges, parcels, water, seed };
}

function palette(region: Region) {
  const text = `${region.soil} ${region.climate}`.toLowerCase();
  if (/volcan|basalt|lava/.test(text)) return { sky: "#d9c3ab", land: "#5f6352", line: "#ddd0b8", accent: "#9a483f" };
  if (/slate|schist|schiefer/.test(text)) return { sky: "#bbc8c4", land: "#4c5b5a", line: "#d3d7c6", accent: "#7893a0" };
  if (/sand|gravel|alluvial|kies|gravier/.test(text)) return { sky: "#d9d3b9", land: "#8d8b62", line: "#eee2c6", accent: "#7997a0" };
  if (/limestone|chalk|calcaire|kalk/.test(text)) return { sky: "#d8d3c8", land: "#7d8067", line: "#f0e8d5", accent: "#9e7964" };
  return { sky: "#c9d0b9", land: "#687259", line: "#e2dbc2", accent: "#8a5b61" };
}

function ProceduralPortrait({ region }: { region: Region }) {
  const shape = proceduralPaths(region);
  const colours = palette(region);
  const markerX = 110 + ((region.lng + 180) / 360) * 680;
  const markerY = 86 + ((90 - region.lat) / 180) * 150;
  return (
    <svg className="region-procedural-portrait" viewBox="0 0 900 360" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${shape.seed}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor={colours.sky}/><stop offset="1" stopColor="#f0e6d5"/></linearGradient>
        <linearGradient id={`land-${shape.seed}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={colours.land}/><stop offset="1" stopColor="#39443b"/></linearGradient>
        <pattern id={`grain-${shape.seed}`} width="17" height="17" patternUnits="userSpaceOnUse"><circle cx={3 + shape.seed % 8} cy={4 + shape.seed % 7} r=".7" fill="#fff" opacity=".18"/></pattern>
      </defs>
      <rect width="900" height="360" fill={`url(#sky-${shape.seed})`}/>
      <path d={`M0 ${175 + shape.seed % 35} Q 170 ${100 + shape.seed % 45} 330 ${174 - shape.seed % 30} T 620 ${150 + shape.seed % 35} T 900 140 V360 H0Z`} fill={`url(#land-${shape.seed})`}/>
      {shape.ridges.map((path, index) => <path key={path} d={path} fill="none" stroke={colours.line} strokeWidth={index % 3 === 0 ? 2 : 1} opacity={.38 + index * .05}/>) }
      {shape.parcels.map(path => <path key={path} d={path} fill="none" stroke="#f5ead3" strokeWidth="1" opacity=".3"/>)}
      {shape.water && <path d={`M -10 ${250 + shape.seed % 20} C 180 ${205 - shape.seed % 30}, 320 ${315 - shape.seed % 45}, 510 244 S 730 ${185 + shape.seed % 40}, 930 228`} fill="none" stroke={colours.accent} strokeWidth="25" opacity=".78"/>}
      <rect width="900" height="360" fill={`url(#grain-${shape.seed})`}/>
      <circle cx={markerX} cy={markerY} r="10" fill="#8c2140" stroke="#fff5e8" strokeWidth="4"/>
      <path d={`M0 324 Q 145 ${285 + shape.seed % 20} 300 326 T 600 320 T 900 312 V360 H0Z`} fill="#efe1c9" opacity=".88"/>
      <path d={`M0 339 Q 170 ${310 + shape.seed % 14} 340 340 T 680 334 T 900 329`} fill="none" stroke={colours.land} strokeWidth="3" opacity=".6"/>
    </svg>
  );
}

export function RegionPortrait({ region, locale }: { region: Region; locale: Locale }) {
  const c = portraitCopy[locale];
  const content = regionContent(region, locale);
  const name = regionName(region, locale);
  const flagship = flagshipPortraits[region.id];
  return (
    <figure className={`region-cartographic-portrait ${flagship ? "is-painted" : "is-procedural"}`}>
      <div className="region-portrait-visual">
        {flagship ? <img src={flagship} alt="" /> : <ProceduralPortrait region={region} />}
        <div className="region-portrait-title"><span>{countryLabel(region.country, locale)}</span><strong>{name}</strong></div>
        <div className="region-coordinate"><span>{c.coordinates}</span><strong>{Math.abs(region.lat).toFixed(2)}° {region.lat >= 0 ? "N" : "S"} · {Math.abs(region.lng).toFixed(2)}° {region.lng >= 0 ? "E" : "W"}</strong></div>
      </div>
      <figcaption>
        <span className="eyebrow">{c.eyebrow}</span>
        <div><strong>{c.climate}</strong><p>{content.climate}</p></div>
        <div><strong>{c.ground}</strong><p>{content.soil}</p></div>
      </figcaption>
    </figure>
  );
}
