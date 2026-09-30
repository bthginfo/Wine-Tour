import { guideDepthA, type GuideDepthLocale as GuideDepthLocaleA } from './guide-depth-a'
import { guideDepthB } from './guide-depth-b'

export type GuideDepthLocale = GuideDepthLocaleA
export type GuideDepthReading = Record<GuideDepthLocale, string[]>

/** The two editorial batches are complementary: A covers the first 14 guides and B the remaining 13. */
export const guideDepth: Record<string, GuideDepthReading> = {
  ...guideDepthA,
  ...guideDepthB,
}

export const guideDepthIds = Object.keys(guideDepth)

const locales: GuideDepthLocale[] = ['en', 'de', 'fr', 'es']
const wordPattern = /[\p{L}\p{M}\p{N}]+(?:[-’'][\p{L}\p{M}\p{N}]+)*/gu
const wordCount = (value: string) => value.match(wordPattern)?.length ?? 0
export const guideDepthWordCount = (id: string, locale: GuideDepthLocale) => wordCount(guideDepth[id]?.[locale]?.join(' ') ?? '')
export const guideDepthReadingMinutes = (id: string, locale: GuideDepthLocale) => Math.max(1, Math.ceil(guideDepthWordCount(id, locale) / 180))
const duplicateParagraphs = (paragraphs: string[]) => {
  const seen = new Set<string>()
  return paragraphs.filter(paragraph => {
    const key = paragraph.trim().toLocaleLowerCase()
    if (!key || seen.has(key)) return Boolean(key)
    seen.add(key)
    return false
  }).length
}

const sharedParagraphs = (readings: Record<string, GuideDepthReading>, ids: Set<string>) => {
  const issues: string[] = []
  const guideIds = [...ids].filter(id => Boolean(readings[id]))
  for (const locale of locales) {
    for (let index = 0; index < guideIds.length; index += 1) {
      const leftId = guideIds[index]
      const left = new Set((readings[leftId][locale] ?? []).map(paragraph => paragraph.trim().toLocaleLowerCase()).filter(Boolean))
      for (let next = index + 1; next < guideIds.length; next += 1) {
        const rightId = guideIds[next]
        const right = new Set((readings[rightId][locale] ?? []).map(paragraph => paragraph.trim().toLocaleLowerCase()).filter(Boolean))
        const shorter = Math.min(left.size, right.size)
        const overlap = [...left].filter(paragraph => right.has(paragraph)).length
        if (overlap >= 4 && shorter > 0 && overlap / shorter >= 0.5) {
          issues.push(`${rightId} ${locale} reuses ${overlap}/${shorter} paragraphs from ${leftId}`)
        }
      }
    }
  }
  return issues
}

/**
 * Editorial guard used by the catalogue validator. It checks the authored
 * registry itself, before article wrappers or UI translations can hide gaps.
 */
export function validateGuideDepth(expectedIds: string[] = guideDepthIds) {
  const issues: string[] = []
  const expected = new Set(expectedIds)
  if (guideDepthIds.length !== expected.size) issues.push('duplicate guide-depth ids')
  for (const id of expected) {
    const reading = guideDepth[id]
    if (!reading) {
      issues.push(`missing guide depth ${id}`)
      continue
    }
    for (const locale of locales) {
      const paragraphs = reading[locale]
      if (!Array.isArray(paragraphs) || paragraphs.length < 2) {
        issues.push(`${id} ${locale} needs authored paragraphs`)
        continue
      }
      if (paragraphs.some(paragraph => !paragraph.trim())) issues.push(`${id} ${locale} contains an empty paragraph`)
      if (duplicateParagraphs(paragraphs) > 0) issues.push(`${id} ${locale} repeats a paragraph`)
      if (wordCount(paragraphs.join(' ')) < 800) issues.push(`${id} ${locale} has ${wordCount(paragraphs.join(' '))} authored words; minimum 800`)
    }
  }
  issues.push(...sharedParagraphs(guideDepth, expected))
  for (const id of guideDepthIds) if (!expected.has(id)) issues.push(`unregistered guide depth ${id}`)
  return { guides: guideDepthIds.length, locales, issues }
}
