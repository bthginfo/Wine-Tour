import type { Locale } from './i18n'

type LocalizedCopy = Record<Locale, string>

export interface GeneratedKnowledgeAssetSpec {
  filename: string
  alt?: LocalizedCopy
  caption?: LocalizedCopy
}

export const generatedKnowledgeAssetSpecs: Record<string, Record<string, GeneratedKnowledgeAssetSpec>> = {
  regions: {
    franschhoek: {
      filename: 'region-franschhoek-v1.jpg',
      caption: {
        en: 'Franschhoek vineyard rows in a mountain-framed valley',
        de: 'Weinberge im von Bergen gerahmten Tal von Franschhoek',
        fr: 'Vignobles de Franschhoek dans une vallée bordée de montagnes',
        es: 'Viñedos de Franschhoek en un valle rodeado de montañas',
      },
    },
    champagne: {
      filename: 'region-champagne-v1.jpg',
      caption: {
        en: 'Vineyard slopes across Champagne chalk country',
        de: 'Weinberghänge in der Kreidelandschaft der Champagne',
        fr: 'Coteaux viticoles des terres crayeuses de Champagne',
        es: 'Laderas de viñedos en las tierras calcáreas de Champagne',
      },
    },
    'napa-valley': {
      filename: 'region-napa-valley-v1.jpg',
      caption: {
        en: 'Napa Valley vineyards between mountain ridges and low fog',
        de: 'Weinberge im Napa Valley zwischen Bergrücken und tiefem Küstennebel',
        fr: 'Vignobles de Napa Valley entre crêtes montagneuses et brume basse',
        es: 'Viñedos de Napa Valley entre cordilleras y niebla baja',
      },
    },
    'rioja-alta': {
      filename: 'region-rioja-alta-v1.jpg',
      caption: {
        en: 'Vineyards and terraces in the open Ebro-basin landscape',
        de: 'Weinberge und Terrassen in der offenen Ebro-Beckenlandschaft',
        fr: 'Vignobles et terrasses dans le paysage ouvert du bassin de l’Èbre',
        es: 'Viñedos y terrazas en el paisaje abierto de la cuenca del Ebro',
      },
    },
    stellenbosch: {
      filename: 'region-stellenbosch-v1.jpg',
      caption: {
        en: 'Vineyard foothills below Stellenbosch mountain ranges',
        de: 'Weinberghänge am Fuß der Gebirgszüge von Stellenbosch',
        fr: 'Vignobles des contreforts montagneux de Stellenbosch',
        es: 'Viñedos en las estribaciones montañosas de Stellenbosch',
      },
    },
  },
  grapes: {
    riesling: {
      filename: 'grape-riesling-aroma-v1.jpg',
      alt: {
        en: 'Illustrative Riesling aroma references: pale wine, green apple, peach and lemon peel',
        de: 'Symbolische Riesling-Aromareferenzen: heller Wein, grüner Apfel, Pfirsich und Zitronenschale',
        fr: 'Références aromatiques illustratives du riesling : vin pâle, pomme verte, pêche et zeste de citron',
        es: 'Referencias aromáticas ilustrativas del Riesling: vino pálido, manzana verde, melocotón y piel de limón',
      },
      caption: {
        en: 'Interpretive aroma still-life; not cultivar morphology',
        de: 'Symbolisches Aromastillleben; keine Rebsorten-Morphologie',
        fr: 'Nature morte aromatique interprétative ; pas une morphologie variétale',
        es: 'Bodegón aromático interpretativo; no muestra morfología varietal',
      },
    },
    'cabernet-sauvignon': {
      filename: 'grape-cabernet-sauvignon-aroma-v1.jpg',
      alt: {
        en: 'Illustrative Cabernet Sauvignon aroma references: red wine, blackcurrant, green pepper and liquorice',
        de: 'Symbolische Cabernet-Sauvignon-Aromareferenzen: Rotwein, schwarze Johannisbeere, grüne Paprika und Lakritz',
        fr: 'Références aromatiques illustratives du cabernet-sauvignon : vin rouge, cassis, poivron vert et réglisse',
        es: 'Referencias aromáticas ilustrativas del Cabernet Sauvignon: vino tinto, grosella negra, pimiento verde y regaliz',
      },
      caption: {
        en: 'Interpretive aroma still-life; not cultivar morphology',
        de: 'Symbolisches Aromastillleben; keine Rebsorten-Morphologie',
        fr: 'Nature morte aromatique interprétative ; pas une morphologie variétale',
        es: 'Bodegón aromático interpretativo; no muestra morfología varietal',
      },
    },
  },
  lessons: {
    'vine-anatomy': {
      filename: 'lesson-vine-anatomy-v1.jpg',
      alt: {
        en: 'Educational illustration of a generic grapevine from roots to leaves and cluster',
        de: 'Lehrillustration einer allgemeinen Weinrebe von den Wurzeln bis zu Blättern und Traube',
        fr: 'Illustration pédagogique d’une vigne générique, des racines aux feuilles et à la grappe',
        es: 'Ilustración educativa de una vid genérica, de las raíces a las hojas y el racimo',
      },
    },
    'germany-origin': {
      filename: 'lesson-germany-origin-v1.jpg',
      alt: {
        en: 'Illustrative steep slate vineyard above a river in a German wine landscape',
        de: 'Illustrativer steiler Schieferweinberg über einem Fluss in einer deutschen Weinlandschaft',
        fr: 'Illustration d’un vignoble escarpé sur schiste au-dessus d’une rivière allemande',
        es: 'Ilustración de un viñedo empinado de pizarra sobre un río en un paisaje vinícola alemán',
      },
    },
    fermentation: {
      filename: 'lesson-fermentation-v1.jpg',
      alt: {
        en: 'Educational illustration of wine fermenting in a tank with bubbles and gentle heat cues',
        de: 'Lehrillustration einer Weingärung im Tank mit Blasen und dezenter Wärme',
        fr: 'Illustration pédagogique d’une fermentation en cuve avec bulles et chaleur discrète',
        es: 'Ilustración educativa de fermentación en depósito con burbujas e indicios suaves de calor',
      },
    },
  },
  guides: {
    'glassware-anatomy': {
      filename: 'guide-glassware-anatomy-v1.jpg',
      alt: {
        en: 'Illustration comparing a slender tulip glass and a broad wine glass with measured pours',
        de: 'Illustration eines schlanken Tulpenkelchs und eines weiten Weinglases mit abgemessenen Füllmengen',
        fr: 'Illustration comparant un verre tulipe élancé et un verre large avec des volumes mesurés',
        es: 'Ilustración comparativa de una copa tulipa y una copa amplia con cantidades medidas',
      },
      caption: {
        en: 'Supplemental glassware study; the existing guide artwork is retained',
        de: 'Ergänzende Glasstudie; die bisherige Guide-Illustration bleibt erhalten',
        fr: 'Étude complémentaire des verres ; l’illustration existante du guide est conservée',
        es: 'Estudio complementario de copas; se conserva la ilustración original de la guía',
      },
    },
  },
}

const files = import.meta.glob('./assets/generated-knowledge/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

function imageUrl(spec: GeneratedKnowledgeAssetSpec): string | undefined {
  return files[`./assets/generated-knowledge/${spec.filename}`]
}

function resolvedImage(spec: GeneratedKnowledgeAssetSpec | undefined) {
  if (!spec) return undefined
  const src = imageUrl(spec)
  return src ? { ...spec, src } : undefined
}

export function generatedRegionImage(regionId: string) {
  return resolvedImage(generatedKnowledgeAssetSpecs.regions[regionId])
}

export function generatedGrapeAromaImage(grapeId: string) {
  return resolvedImage(generatedKnowledgeAssetSpecs.grapes[grapeId])
}

export function generatedLessonImage(lessonId: string) {
  return resolvedImage(generatedKnowledgeAssetSpecs.lessons[lessonId])
}

export function generatedGuideImage(guideId: string) {
  return resolvedImage(generatedKnowledgeAssetSpecs.guides[guideId])
}

export function localizedAlt(image: { alt?: LocalizedCopy }, locale: Locale, fallback: string): string {
  return image.alt?.[locale] ?? fallback
}
