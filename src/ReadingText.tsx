import type { Locale } from './i18n'

type SentenceSegment = { segment: string }
type SentenceSegmenter = { segment: (text: string) => Iterable<SentenceSegment> }
type SentenceSegmenterConstructor = new (
  locale?: string | string[],
  options?: { granularity: 'sentence' },
) => SentenceSegmenter

function fallbackSentenceSegments(text: string) {
  const parts: string[] = []
  let start = 0

  for (let index = 0; index < text.length; index += 1) {
    const mark = text[index]
    if (!'.!?…'.includes(mark)) continue
    if (mark === '.' && /\d/u.test(text[index - 1] ?? '') && /\d/u.test(text[index + 1] ?? '')) continue

    const before = text.slice(Math.max(0, index - 14), index).trimEnd()
    if (mark === '.' && /\b(?:e\.g|i\.e|z\.b|d\.h|u\.a|dr|prof|sr|sra|mr|mrs|ms|vs|etc|ca|approx|no|fig)$/iu.test(before)) continue
    if (mark === '.' && /\b[zdu]$/iu.test(before) && /^\s+[\p{Lu}]\./u.test(text.slice(index + 1))) continue

    let end = index + 1
    while (end < text.length && /[\)\]}'"”’»]/u.test(text[end])) end += 1
    let next = end
    while (next < text.length && /\s/u.test(text[next])) next += 1
    if (next === text.length) {
      parts.push(text.slice(start, end))
      start = next
      break
    }

    const nextCharacter = String.fromCodePoint(text.codePointAt(next) ?? 0)
    if (!/[\p{Lu}¿¡]/u.test(nextCharacter)) continue
    parts.push(text.slice(start, end))
    start = next
    index = next - 1
  }

  if (start < text.length) parts.push(text.slice(start))
  return parts
}

function sentenceSegments(text: string, locale: Locale) {
  const Segmenter = (Intl as unknown as { Segmenter?: SentenceSegmenterConstructor }).Segmenter
  if (!Segmenter) return fallbackSentenceSegments(text)
  return Array.from(new Segmenter(locale, { granularity: 'sentence' }).segment(text), part => part.segment)
}

/** Keep authored wording intact while adding paragraph breaks at sentence boundaries. */
export function splitReadingParagraphs(paragraphs: readonly string[], locale: Locale, maxCharacters = 460) {
  const chunks: string[] = []

  for (const paragraph of paragraphs) {
    const sentences = sentenceSegments(paragraph.trim(), locale).map(sentence => sentence.trim()).filter(Boolean)
    let chunk = ''
    let sentenceCount = 0

    for (const sentence of sentences) {
      const exceedsLength = chunk.length > 0 && chunk.length + sentence.length + 1 > maxCharacters
      if (chunk && (sentenceCount >= 2 || exceedsLength)) {
        chunks.push(chunk)
        chunk = ''
        sentenceCount = 0
      }
      chunk = chunk ? `${chunk} ${sentence}` : sentence
      sentenceCount += 1
    }

    if (chunk) chunks.push(chunk)
  }

  return chunks
}

export function ReadingText({
  paragraphs,
  locale,
  className,
}: {
  paragraphs: readonly string[]
  locale: Locale
  className?: string
}) {
  const chunks = splitReadingParagraphs(paragraphs, locale)
  if (!chunks.length) return null
  return <div className={className}>{chunks.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>)}</div>
}
