import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'

const minimums = { regions: 220, grapes: 100, producers: 200, wines: 400, aromas: 70 }
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })

try {
  const catalog = await server.ssrLoadModule('/src/data/catalog.ts')
  const blends = await server.ssrLoadModule('/src/BlendConnections.tsx')
  const errors = [...catalog.validateCatalog(), ...blends.validateClassicBlends()]
  if (blends.classicBlends.length < 9) errors.push('Fewer than 9 sourced classic blend profiles are public')
  for (const [kind, minimum] of Object.entries(minimums)) {
    if ((catalog.counts[kind] ?? 0) < minimum) errors.push(`${kind} fell below release floor ${minimum}`)
  }

  const authoredIds = new Set((await server.ssrLoadModule('/src/learningCurriculum.ts')).learningModules.map(module => module.id))
  if (authoredIds.size < 10) errors.push('Fewer than 10 authored learning modules are public')

  const ampelography = JSON.parse(await readFile('src/data/ampelographyMedia.generated.json', 'utf8'))
  const verifiedGrapes = new Set(ampelography.map(item => item.grapeId))
  if (verifiedGrapes.size < 65) errors.push(`Verified leaf-and-cluster photography fell below 65 varieties: ${verifiedGrapes.size}`)
  if (ampelography.some(item => !item.sourceUrl?.startsWith('https://www.plantgrape.fr/'))) errors.push('Ampelography media includes an unapproved source')

  const visibleSources = await Promise.all([
    'src/App.tsx', 'src/LearningDepth.tsx', 'src/LearningSystem.tsx', 'src/BusinessPlatform.tsx', 'src/uiCopy.ts',
    'src/AdaptiveLearning.tsx', 'src/AtlasIntelligence.tsx', 'src/KnowledgeQuality.tsx', 'src/TastingHostConsole.tsx',
  ].map(path => readFile(path, 'utf8')))
  const visibleText = visibleSources.join('\n').toLowerCase()
  const forbidden = [
    'original generic anatomical guide',
    'individual wines are still being expanded',
    'les vins individuels sont encore en cours',
    'los vinos individuales todavía se están ampliando',
    'host reveal',
    'open tonight',
  ]
  for (const phrase of forbidden) if (visibleText.includes(phrase)) errors.push(`Visible editorial meta-copy remains: ${phrase}`)

  const sourcedEntities = [...catalog.regions, ...catalog.grapes, ...catalog.producers, ...catalog.wines]
    .filter(item => typeof item.sourceUrl === 'string')
  const sourceDomains = new Set(sourcedEntities.map(item => new URL(item.sourceUrl).hostname.replace(/^www\./, '')))
  if (sourceDomains.size < 25) errors.push(`Source diversity is too low: ${sourceDomains.size} domains`)

  const words = value => String(value).trim().split(/\s+/).filter(Boolean).length
  const contentFloors = [
    ['region', catalog.regions, 150, item => [item.summary,item.climate,item.soil,item.history,item.growingSeason,item.viticulture,...item.wineStyles,...item.pairings,...item.keyFacts].join(' ')],
    ['grape', catalog.grapes, 95, item => [item.summary,item.origin,item.ripening,item.climateFit,item.viticulture,item.winemaking,...item.styles,...item.pairings].join(' ')],
    ['producer', catalog.producers, 100, item => [item.summary,item.philosophy,item.vineyard,item.cellar,item.speciality].join(' ')],
    ['wine', catalog.wines, 65, item => [item.summary,item.composition,item.vinification,item.maturation,item.serving,item.drinkWindow,...item.pairings].join(' ')],
    ['reference guide', catalog.articles, 450, item => [item.summary,...item.body,...item.objectives,item.example,item.exercise].join(' ')],
  ]
  for (const [label,items,floor,render] of contentFloors) {
    for (const item of items) if (words(render(item)) < floor) errors.push(`${label} ${item.id} fell below ${floor} authored words`)
  }
  if (catalog.wines.some(wine => !['producer','style-context'].includes(wine.evidenceLevel))) errors.push('A wine is missing an explicit evidence level')

  const regionCoverage = catalog.regions.filter(region => catalog.producers.some(producer => producer.regionIds.includes(region.id))).length
  const grapeCoverage = catalog.grapes.filter(grape => grape.regionIds.length > 0).length
  if (grapeCoverage / catalog.grapes.length < 0.95) errors.push('More than 5% of grapes have no regional relationship')

  if (errors.length) throw new Error(`Catalog validation failed:\n${errors.join('\n')}`)
  process.stdout.write(
    `Catalog validation passed: ${catalog.counts.regions} regions, ${catalog.counts.grapes} grapes, ` +
    `${catalog.counts.producers} producers, ${catalog.counts.wines} wines, ${catalog.counts.aromas} aromas, ` +
    `${blends.classicBlends.length} classic blends, ${sourceDomains.size} source domains. ` +
    `${regionCoverage}/${catalog.regions.length} regions currently have producer profiles; ` +
    `${verifiedGrapes.size}/${catalog.grapes.length} varieties have verified leaf-and-cluster photography.\n`,
  )
  if (process.env.CATALOG_AUDIT_VERBOSE === '1') {
    const uncovered = catalog.regions.filter(region => !catalog.producers.some(producer => producer.regionIds.includes(region.id)))
    for (const country of [...new Set(uncovered.map(region => region.country))]) {
      process.stdout.write(`${country}: ${uncovered.filter(region => region.country === country).map(region => region.name).join('; ')}\n`)
    }
    process.stdout.write(`${catalog.producers.filter(producer => producer.summary.includes('Read the estate')).length} producer profiles still use the base editorial pattern.\n`)
    process.stdout.write(`${catalog.wines.filter(wine => wine.sourceUrl === catalog.regions.find(region => region.id === wine.regionId)?.sourceUrl).length} wines currently resolve only to a regional source.\n`)
  }
} finally {
  await server.close()
}
