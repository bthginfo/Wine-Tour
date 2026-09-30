import type { Producer, Region, Wine, WineStyle } from '../types'
import { newWorldCatalog } from './producer-catalog-new-world'
import { europeanCatalog } from './producer-catalog-europe'

export const authoredLocales = ['en', 'de', 'fr', 'es'] as const
export type AuthoredLocale = typeof authoredLocales[number]

export type AuthoredProducerLocale = {
  name: string
  summary: string
  philosophy: string
  vineyard: string
  cellar: string
  speciality: string
}

export type AuthoredWineLocale = {
  name: string
  summary: string
  serving: string
  composition: string
  vinification: string
  maturation: string
  drinkWindow: string
  pairings: string[]
}

export type AuthoredProducer = {
  recordType: 'producer'
  id: string
  regionId: string
  /** Additional regions explicitly documented for the producer or its wines. */
  regionIds?: string[]
  /** Optional only when a source supports a producer-specific location. */
  lat?: number
  lng?: number
  sourceUrls: string[]
  locales: Record<AuthoredLocale, AuthoredProducerLocale>
}

export type AuthoredWine = {
  recordType: 'wine'
  id: string
  producerId: string
  regionId: string
  grapeIds: string[]
  style: WineStyle
  /** Use null when the cited product is not vintage-specific. Never invent a year. */
  vintage: number | null
  sourceUrls: string[]
  aromaIds?: string[]
  locales: Record<AuthoredLocale, AuthoredWineLocale>
}

export type AuthoredCatalogRecord = AuthoredProducer | AuthoredWine

export type AuthoredCatalogTranslation = {
  summary: string
  description: string
  fields: Record<string, unknown>
}

/**
 * Static authored records are deliberately kept separate from administrative
 * additions. The latter are applied at runtime, while these records form the
 * release's base catalogue and therefore survive every reset/hydration cycle.
 */
export { newWorldCatalog, europeanCatalog }
export const authoredCatalogRecords: AuthoredCatalogRecord[] = [...newWorldCatalog, ...europeanCatalog]

export function authoredCatalogTranslation(recordType: string, id: string, locale: string): AuthoredCatalogTranslation | undefined {
  if (!authoredLocales.includes(locale as AuthoredLocale)) return undefined
  const record = authoredCatalogRecords.find(item => item.recordType === recordType && item.id === id)
  if (!record) return undefined
  const content = record.locales[locale as AuthoredLocale]
  if (recordType === 'producer') {
    const producer = content as AuthoredProducerLocale
    return {
      summary: producer.summary,
      description: producer.summary,
      fields: { name: producer.name, philosophy: producer.philosophy, vineyard: producer.vineyard, cellar: producer.cellar, speciality: producer.speciality },
    }
  }
  if (recordType !== 'wine') return undefined
  const wine = content as AuthoredWineLocale
  return {
    summary: wine.summary,
    description: wine.summary,
    fields: { name: wine.name, serving: wine.serving, composition: wine.composition, vinification: wine.vinification, maturation: wine.maturation, drinkWindow: wine.drinkWindow, pairings: wine.pairings },
  }
}

const isHttps = (value: string) => {
  try { return new URL(value).protocol === 'https:' } catch { return false }
}
const text = (value: unknown) => typeof value === 'string' && value.trim().length > 0

/** Validate authored records before they are merged into the canonical arrays. */
export function validateAuthoredCatalog(records: AuthoredCatalogRecord[], regions: Region[], producers: Producer[], grapes: { id: string }[], wines: Wine[] = [], aromas: { id: string }[] = []): string[] {
  const errors: string[] = []
  const regionIds = new Set(regions.map(item => item.id))
  const grapeIds = new Set(grapes.map(item => item.id))
  const aromaIds = new Set(aromas.map(item => item.id))
  const producerIds = new Set(producers.map(item => item.id))
  const wineIds = new Set(wines.map(item => item.id))
  const seen = new Set<string>()
  const producerFields = ['philosophy', 'vineyard', 'cellar', 'speciality'] as const
  const wineFields = ['serving', 'composition', 'vinification', 'maturation', 'drinkWindow'] as const
  const sourceStatusLanguage = /(?:no producer drinking window is stated|no se indica una ventana de guarda|ne donne pas de fen(?:ê|e)tre de garde|das gut nennt .* kein trinkfenster|the cited (?:directory|trade material|public page|public pages|technical material|source) .*\b(?:does not|do not)\b(?: state| publish| provide)|no exact temperature is stated|no vessel or barrel period is added)/i
  const copiedEnglishPayload = (english: string, translated: string) => {
    const englishWords = english.toLocaleLowerCase().match(/[a-z]{5,}/g) ?? []
    if (englishWords.length < 8) return false
    const translatedText = translated.toLocaleLowerCase()
    const shared = englishWords.filter(word => translatedText.includes(word)).length
    return shared >= Math.max(5, Math.ceil(englishWords.length * 0.65))
  }
  const checkLocalizedFact = (recordId: string, locale: AuthoredLocale, field: string, english: string, translated: string) => {
    if (text(english) && !text(translated)) errors.push(`Authored ${recordId} has missing ${locale}.${field} translation`)
    if (!text(english) && text(translated)) errors.push(`Authored ${recordId} has ${locale}.${field} despite an unknown English fact`)
    if (locale !== 'en' && field !== 'composition' && text(english) && text(translated) && english === translated && translated.trim().split(/\s+/).length > 4) errors.push(`Authored ${recordId} has untranslated ${locale}.${field}`)
    if (locale !== 'en' && field !== 'composition' && text(english) && text(translated) && copiedEnglishPayload(english, translated)) errors.push(`Authored ${recordId} has copied English payload in ${locale}.${field}`)
    if (text(translated) && sourceStatusLanguage.test(translated)) errors.push(`Authored ${recordId} uses source-status filler in ${locale}.${field}`)
  }

  for (const record of records) {
    const key = `${record.recordType}:${record.id}`
    if (!record.id.trim() || seen.has(key)) errors.push(`Duplicate authored ${key}`)
    seen.add(key)
    if (!Array.isArray(record.sourceUrls) || !record.sourceUrls.length || record.sourceUrls.some(source => !isHttps(source))) errors.push(`Authored ${key} has invalid sourceUrls`)
    if (!regionIds.has(record.regionId)) errors.push(`Authored ${key} has unknown region ${record.regionId}`)
    if (record.recordType === 'producer') {
      if (producerIds.has(record.id)) errors.push(`Authored producer collides with existing producer ${record.id}`)
      for (const regionId of [record.regionId, ...(record.regionIds ?? [])]) if (!regionIds.has(regionId)) errors.push(`Authored producer ${record.id} has unknown region ${regionId}`)
      if (record.lat !== undefined && (!Number.isFinite(record.lat) || Math.abs(record.lat) > 90)) errors.push(`Authored producer ${record.id} has invalid latitude`)
      if (record.lng !== undefined && (!Number.isFinite(record.lng) || Math.abs(record.lng) > 180)) errors.push(`Authored producer ${record.id} has invalid longitude`)
      for (const locale of authoredLocales) {
        const content = record.locales[locale]
        if (!content) { errors.push(`Authored producer ${record.id} is missing locale ${locale}`); continue }
        if (!text(content.name)) errors.push(`Authored producer ${record.id} is missing ${locale}.name`)
        if (!text(content.summary)) errors.push(`Authored producer ${record.id} is missing ${locale}.summary`)
        for (const field of producerFields) {
          const english = record.locales.en[field]
          const translated = content[field]
          if (!text(english) || !text(translated)) errors.push(`Authored producer ${record.id} is missing ${locale}.${field}`)
          checkLocalizedFact(`producer ${record.id}`, locale, field, english, translated)
        }
      }
    } else {
      if (!producerIds.has(record.producerId) && !records.some(item => item.recordType === 'producer' && item.id === record.producerId)) errors.push(`Authored wine ${record.id} has unknown producer ${record.producerId}`)
      const producer = (records.find(item => item.recordType === 'producer' && item.id === record.producerId) as AuthoredProducer | undefined) ?? producers.find(item => item.id === record.producerId)
      if (producer && ![producer.regionId, ...(producer.regionIds ?? [])].includes(record.regionId)) errors.push(`Authored wine ${record.id} region ${record.regionId} is not in producer ${record.producerId} regionIds`)
      if (!record.grapeIds.length || record.grapeIds.some(id => !grapeIds.has(id))) errors.push(`Authored wine ${record.id} has invalid grapeIds`)
      if (!['red', 'white', 'rose', 'sparkling', 'sweet', 'fortified'].includes(record.style)) errors.push(`Authored wine ${record.id} has invalid style`)
      if (record.vintage !== null && (!Number.isInteger(record.vintage) || record.vintage < 1800 || record.vintage > new Date().getFullYear())) errors.push(`Authored wine ${record.id} has invalid vintage`)
      if (record.aromaIds?.some(id => !aromaIds.has(id))) errors.push(`Authored wine ${record.id} has invalid aromaIds`)
      for (const locale of authoredLocales) {
        const content = record.locales[locale]
        if (!content) { errors.push(`Authored wine ${record.id} is missing locale ${locale}`); continue }
        if (!text(content.name)) errors.push(`Authored wine ${record.id} is missing ${locale}.name`)
        if (!text(content.summary)) errors.push(`Authored wine ${record.id} is missing ${locale}.summary`)
        for (const field of wineFields) checkLocalizedFact(`wine ${record.id}`, locale, field, record.locales.en[field], content[field])
        const englishPairings = record.locales.en.pairings
        const translatedPairings = content.pairings
        if (!Array.isArray(translatedPairings) || translatedPairings.some(item => typeof item !== 'string')) errors.push(`Authored wine ${record.id} has invalid ${locale}.pairings`)
        else if (englishPairings.length === 0 && translatedPairings.length > 0) errors.push(`Authored wine ${record.id} has ${locale}.pairings despite an unknown English pairing fact`)
        else if (englishPairings.length > 0 && translatedPairings.length === 0) errors.push(`Authored wine ${record.id} is missing ${locale}.pairings`)
        else if (translatedPairings.some(item => sourceStatusLanguage.test(item))) errors.push(`Authored wine ${record.id} uses source-status filler in ${locale}.pairings`)
      }
      if (wineIds.has(record.id)) errors.push(`Authored wine collides with existing wine ${record.id}`)
    }
  }
  return errors
}

type MergeTarget = { regions: Region[]; grapes: { id: string }[]; aromas?: { id: string }[]; producers: Producer[]; wines: Wine[] }

/** Merge the English authored records into the base arrays before relation rebuilding. */
export function mergeAuthoredCatalog(records: AuthoredCatalogRecord[], target: MergeTarget): string[] {
  const issues = validateAuthoredCatalog(records, target.regions, target.producers, target.grapes, target.wines, target.aromas ?? [])
  const regionIds = new Set(target.regions.map(item => item.id))
  const grapeIds = new Set(target.grapes.map(item => item.id))
  const aromaIds = new Set((target.aromas ?? []).map(item => item.id))
  const producerIds = new Set(target.producers.map(item => item.id))
  const wineIds = new Set(target.wines.map(item => item.id))

  for (const record of records.filter(item => item.recordType === 'producer') as AuthoredProducer[]) {
    if (producerIds.has(record.id) || !regionIds.has(record.regionId) || !record.locales.en) continue
    const region = target.regions.find(item => item.id === record.regionId)!
    const en = record.locales.en
    target.producers.push({
      id: record.id, name: en.name, regionId: record.regionId,
      regionIds: [...new Set([record.regionId, ...(record.regionIds ?? [])])], summary: en.summary,
      lat: record.lat ?? region.lat, lng: record.lng ?? region.lng, wineIds: [], communityRating: 0,
      philosophy: en.philosophy, vineyard: en.vineyard, cellar: en.cellar, speciality: en.speciality,
      sourceUrl: record.sourceUrls[0] ?? region.sourceUrl,
    })
    producerIds.add(record.id)
  }
  for (const record of records.filter(item => item.recordType === 'wine') as AuthoredWine[]) {
    const producerRecord = records.find(item => item.recordType === 'producer' && item.id === record.producerId) as AuthoredProducer | undefined
    const producerBase = target.producers.find(item => item.id === record.producerId)
    const allowedRegions = producerRecord ? [producerRecord.regionId, ...(producerRecord.regionIds ?? [])] : [producerBase?.regionId, ...(producerBase?.regionIds ?? [])]
    if (wineIds.has(record.id) || !producerIds.has(record.producerId) || !regionIds.has(record.regionId) || !allowedRegions.includes(record.regionId) || !record.locales.en || record.grapeIds.some(id => !grapeIds.has(id)) || record.aromaIds?.some(id => !aromaIds.has(id))) continue
    const en = record.locales.en
    target.wines.push({
      id: record.id, name: en.name, producerId: record.producerId, regionId: record.regionId,
      grapeIds: [...record.grapeIds], style: record.style, vintage: record.vintage, summary: en.summary,
      aromaIds: [...(record.aromaIds ?? [])], serving: en.serving, communityRating: 0,
      composition: en.composition, vinification: en.vinification, maturation: en.maturation,
      drinkWindow: en.drinkWindow, pairings: [...en.pairings], sourceUrl: record.sourceUrls[0] ?? '',
      evidenceLevel: 'producer', merchantOffers: [],
    })
    wineIds.add(record.id)
  }
  return issues
}
