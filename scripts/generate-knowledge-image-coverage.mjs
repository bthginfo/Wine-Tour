import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { articles, grapes, producers, regions, wines } from '../src/data/catalog.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const read = (path) => readFile(join(root, path), 'utf8')
const mediaDir = join(root, 'src/assets/generated-knowledge')
const assetNames = new Set(await readdir(mediaDir))
const licensedRegionDir = join(root, 'src/assets/licensed-regions')
const licensedRegionNames = new Set(await readdir(licensedRegionDir))
const regionMediaSource = await read('src/regionMedia.ts')
const ampelography = JSON.parse(await read('src/data/ampelographyMedia.generated.json'))
const plantGrapeIds = new Set(ampelography.map((record) => record.grapeId))

const regionSceneIds = new Set([
  'mosel', 'nahe', 'rheingau', 'bordeaux', 'bourgogne', 'champagne', 'chianti-classico', 'mendoza',
  'jujuy-catamarca', 'etna', 'santorini', 'madeira', 'priorat-montsant', 'marlborough', 'central-otago', 'rias-baixas',
])
const regionAssets = {
  franschhoek: 'region-franschhoek-v1.jpg',
  champagne: 'region-champagne-v1.jpg',
  'napa-valley': 'region-napa-valley-v1.jpg',
  'rioja-alta': 'region-rioja-alta-v1.jpg',
  stellenbosch: 'region-stellenbosch-v1.jpg',
}
// Derive the photo coverage from the runtime's explicitly reviewed registry so
// the generated report cannot quietly drift from the visible region mapping.
const licensedAssetByImport = new Map(
  [...regionMediaSource.matchAll(/import\s+(\w+)\s+from\s+'\.\/assets\/licensed-regions\/([^']+)'/g)]
    .map((match) => [match[1], match[2]]),
)
const licensedRegionBlock = regionMediaSource.match(/const verifiedRegionPhotos:Record<string,RegionScene>=\{([\s\S]*?)\n\}/)?.[1] ?? ''
const licensedRegionPhotos = Object.fromEntries(
  [...licensedRegionBlock.matchAll(/^\s*(?:'([^']+)'|(\w+)):\{src:(\w+)/gm)]
    .map((match) => {
      const id = match[1] ?? match[2]
      const filename = licensedAssetByImport.get(match[3])
      return filename ? [id, filename] : null
    })
    .filter(Boolean),
)
const grapeAssets = {
  riesling: 'grape-riesling-aroma-v1.jpg',
  'cabernet-sauvignon': 'grape-cabernet-sauvignon-aroma-v1.jpg',
}
const lessonAssets = {
  'vine-anatomy': 'lesson-vine-anatomy-v1.jpg',
  'germany-origin': 'lesson-germany-origin-v1.jpg',
  fermentation: 'lesson-fermentation-v1.jpg',
}
const guideAssets = { 'glassware-anatomy': 'guide-glassware-anatomy-v1.jpg' }

const curriculumSource = await read('src/learningCurriculum.ts')
const profileSection = curriculumSource.slice(
  curriculumSource.indexOf('const profiles:EditorialProfile[]=['),
  curriculumSource.indexOf('function interactionFor'),
)
const lessonIds = [...profileSection.matchAll(/\bid:'([^']+)'/g)].map((match) => match[1])
const lessonMediaSection = curriculumSource.slice(
  curriculumSource.indexOf('const lessonMediaByBlock:'),
  curriculumSource.indexOf('const generatedLessonBlockById:'),
)
const legacyLessonMediaIds = new Set([...lessonMediaSection.matchAll(/^  '([^']+)':\{/gm)].map((match) => match[1]))
const guideFiles = new Set((await readdir(join(root, 'src/assets/learning-guides'))).map((filename) => filename.replace(/\.jpg$/i, '')))
const generatedFile = (filename) => assetNames.has(filename)

const promptTemplates = {
  region: 'Create an editorial vineyard landscape associated with {name}, {country}, using only broad, supportable regional context. No map, boundary, named estate, landmark claim, or documentary-photo claim; no text or watermark.',
  grape: 'Create a symbolic aroma still-life for {name}, using its red/white wine context and sensory references outside the glass. No cultivar-specific plant morphology, diagnostic leaves or bunches, labels, text, or logos.',
  lesson: 'Create one scientifically grounded editorial teaching illustration for “{title}”, focused on the lesson mechanism. No unsupported labels, invented data, or watermark; origin topics must not become maps, and producer topics must not depict a real estate/person.',
  guide: 'Create one editorial learning illustration for “{title}” that clarifies its central concept without replacing existing guide artwork. No text, logo, watermark, or unsupported claim.',
  wine: 'Create a neutral, unlabelled editorial still-life for wine style {style}; do not depict the actual marketed bottle, label, producer, vintage, or trademark. Prioritize a real user-uploaded bottle photo when one exists.',
  producer: 'Create a non-documentary editorial vignette about winegrowing or cellar work linked to {region}. Do not depict a named producer, person, estate, building, logo, or claim of a real site; no text or watermark.',
}

const records = {
  regions: regions.map((region) => {
    const filename = regionAssets[region.id]
    const generated = filename && generatedFile(filename)
    const licensedFilename = licensedRegionPhotos[region.id]
    const licensed = licensedFilename && licensedRegionNames.has(licensedFilename)
    const legacy = regionSceneIds.has(region.id)
    return {
      id: region.id,
      name: region.name,
      country: region.country,
      status: generated ? 'generated-region-image' : filename ? 'generation-in-progress' : licensed ? 'licensed-region-photograph' : legacy ? 'curated-region-scene' : 'shared-decorative-fallback',
      ...(filename ? { filename: generated ? filename : undefined } : {}),
      ...(licensed ? { licensedPhotograph: { filename: licensedFilename } } : {}),
      ...(!filename && !licensed && !legacy ? { promptTemplate: 'region', promptContext: { name: region.name, country: region.country } } : {}),
    }
  }),
  grapes: grapes.map((grape) => {
    const filename = grapeAssets[grape.id]
    const generated = filename && generatedFile(filename)
    const hasFieldPhoto = plantGrapeIds.has(grape.id)
    return {
      id: grape.id,
      name: grape.name,
      status: generated ? 'generated-aroma-illustration' : hasFieldPhoto ? 'PlantGrape-real-field-photos' : 'pending-symbolic-aroma-illustration',
      preservePlantGrapePhotos: hasFieldPhoto,
      ...(generated ? { filename } : {}),
      ...(!generated && !hasFieldPhoto ? { promptTemplate: 'grape', promptContext: { name: grape.name, color: grape.color } } : {}),
    }
  }),
  lessons: lessonIds.map((id) => {
    const module = curriculumSource.slice(profileSection.indexOf(`id:'${id}'`))
    const title = module.match(/title:l\('([^']+)'/)?.[1] ?? id
    const filename = lessonAssets[id]
    const generated = filename && generatedFile(filename)
    return {
      id,
      title,
      status: generated ? 'generated-lesson-image' : filename ? 'generation-in-progress' : legacyLessonMediaIds.has(id) ? 'existing-shared-lesson-media' : 'missing-dedicated-lesson-image',
      ...(generated ? { filename } : {}),
      ...(!generated && !filename ? { promptTemplate: 'lesson', promptContext: { title, id } } : {}),
    }
  }),
  guides: articles.map((article) => {
    const filename = guideAssets[article.id]
    const hasExistingGuideImage = guideFiles.has(article.id)
    const generated = filename && generatedFile(filename)
    return {
      id: article.id,
      title: article.title,
      status: generated ? 'generated-supplemental-image' : hasExistingGuideImage ? 'existing-dedicated-guide-image' : 'missing-guide-image',
      existingImageRetained: hasExistingGuideImage,
      ...(generated ? { filename } : {}),
      ...(!hasExistingGuideImage ? { promptTemplate: 'guide', promptContext: { title: article.title, id: article.id } } : {}),
    }
  }),
  wines: wines.map((wine) => ({
    id: wine.id,
    name: wine.name,
    style: wine.style,
    status: 'pending-neutral-style-illustration',
    userPhotoPriority: true,
    promptTemplate: 'wine',
    promptContext: { style: wine.style },
  })),
  producers: producers.map((producer) => ({
    id: producer.id,
    name: producer.name,
    regionId: producer.regionId,
    status: 'pending-non-documentary-illustration',
    promptTemplate: 'producer',
    promptContext: { region: producer.regionId },
  })),
}

const generatedAssets = [
  ...Object.entries(regionAssets).map(([id, filename]) => ({ kind: 'region', id, filename, present: generatedFile(filename) })),
  ...Object.entries(grapeAssets).map(([id, filename]) => ({ kind: 'grape', id, filename, present: generatedFile(filename), preservePlantGrapePhotos: true })),
  ...Object.entries(lessonAssets).map(([id, filename]) => ({ kind: 'lesson', id, filename, present: generatedFile(filename) })),
  ...Object.entries(guideAssets).map(([id, filename]) => ({ kind: 'guide', id, filename, present: generatedFile(filename), existingGuideImageRetained: true })),
]
const licensedAssets = Object.entries(licensedRegionPhotos).map(([id, filename]) => ({
  kind: 'region-photograph',
  id,
  filename,
  present: licensedRegionNames.has(filename),
}))

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceOfTruth: 'src/data/catalog.ts and the authored learning curriculum',
  promptPolicy: 'Prompt templates are stored once and expanded with promptContext per record; generation records and exact source prompts are in GENERATION-PROVENANCE.md, not the runtime bundle.',
  summary: Object.fromEntries(Object.entries(records).map(([kind, items]) => [kind, {
    total: items.length,
    generated: items.filter((item) => item.status.startsWith('generated-')).length,
    licensedPhotographs: items.filter((item) => item.status === 'licensed-region-photograph').length,
    pending: items.filter((item) => item.status.startsWith('pending-') || item.status.startsWith('missing-') || item.status === 'shared-decorative-fallback' || item.status === 'missing-dedicated-lesson-image').length,
  }])),
  promptTemplates,
  generatedAssets,
  licensedAssets,
  records,
}

const outputPath = join(root, 'docs/generated-knowledge-coverage.json')
await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
console.log(`Wrote ${outputPath}`)
console.log(JSON.stringify(manifest.summary, null, 2))
