import { useEffect, useMemo, useState } from 'react'
import { Check, Grape, LockKeyhole, NotebookPen, Plus, Sparkles } from 'lucide-react'
import { useAuth } from './auth'
import { aromas } from './data/catalog'
import { repository } from './data/repository'
import { aromaContent } from './localizedContent'
import type { Locale } from './i18n'
import type { TastingChapter, TastingJourney, TastingNote, Wine } from './types'
import { readInteractionValue, scopedInteractionKey, writeInteractionValue } from './interactionStorage'

type ResponseState = {
  text: string
  confidence: number
  saved: boolean
  wineSaved: boolean
  noteId?: string
  aromaIds: string[]
  acid: number
  tannin: number
  body: number
  reflection: string
}

const blank: ResponseState = { text: '', confidence: 1, saved: false, wineSaved: false, aromaIds: [], acid: 3, tannin: 3, body: 3, reflection: '' }

const copy: Record<Locale, Record<string, string>> = {
  en: {
    eyebrow: 'Your place at the table', title: 'Notice first. Compare after.', local: 'Saved in this browser',
    privacy: 'Your draft stays in this browser. Saving sends its text and confidence to a matching host console for this tasting in this browser, under the same account or guest session. It is not synced as an account record.',
    prompt: 'Your answer before the reveal', placeholder: 'Write one observation or prediction…', confidence: 'How certain are you?',
    low: 'Unsure', medium: 'Leaning', high: 'Confident', save: 'Save and send table pulse', saved: 'Response saved',
    pulseSent: 'Saved on this device. The response signal was sent to matching host consoles in this browser.',
    pulseFailed: 'Saved on this device, but this browser could not send the table pulse.',
    storageFailed: 'This browser could not save your draft. Keep this page open and try again.',
    wine: 'Capture this wine', aromas: 'Aromas you can defend', structure: 'Structure in your glass', acid: 'Acidity', tannin: 'Tannin', body: 'Body',
    reflection: 'What will you remember?', reflectionHint: 'One precise sentence is enough.', cellar: 'Add wine and note to cellar',
    saveNote: 'Save tasting note', inCellar: 'Wine and note saved', wineFailed: 'Could not save the wine and note to your account. The tasting note may still have been saved; try again.',
    complete: 'Mark chapter complete', completed: 'Chapter complete', of: 'of',
  },
  de: {
    eyebrow: 'Dein Platz am Tisch', title: 'Erst wahrnehmen. Danach vergleichen.', local: 'In diesem Browser gespeichert',
    privacy: 'Dein Entwurf bleibt in diesem Browser. Beim Speichern werden Text und Sicherheit an eine passende Host-Konsole für diese Verkostung gesendet – im selben Konto oder in derselben Gast-Sitzung. Die Antwort wird nicht als Kontodatensatz synchronisiert.',
    prompt: 'Deine Antwort vor der Auflösung', placeholder: 'Eine Beobachtung oder Vermutung …', confidence: 'Wie sicher bist du?',
    low: 'Unsicher', medium: 'Tendenz', high: 'Sicher', save: 'Speichern und Tischsignal senden', saved: 'Antwort gespeichert',
    pulseSent: 'Auf diesem Gerät gespeichert. Das Antwortsignal wurde an passende Host-Konsolen in diesem Browser gesendet.',
    pulseFailed: 'Auf diesem Gerät gespeichert, aber das Tischsignal konnte nicht gesendet werden.',
    storageFailed: 'Dieser Browser konnte deinen Entwurf nicht speichern. Lass die Seite geöffnet und versuche es erneut.',
    wine: 'Diesen Wein festhalten', aromas: 'Aromen, die du begründen kannst', structure: 'Struktur in deinem Glas', acid: 'Säure', tannin: 'Tannin', body: 'Körper',
    reflection: 'Was wirst du erinnern?', reflectionHint: 'Ein präziser Satz genügt.', cellar: 'Wein und Notiz im Keller speichern',
    saveNote: 'Verkostungsnotiz speichern', inCellar: 'Wein und Notiz gespeichert', wineFailed: 'Wein und Notiz konnten nicht in deinem Konto gespeichert werden. Die Verkostungsnotiz wurde möglicherweise trotzdem gespeichert; versuche es erneut.',
    complete: 'Kapitel abschließen', completed: 'Kapitel abgeschlossen', of: 'von',
  },
  fr: {
    eyebrow: 'Votre place à table', title: 'Observer d’abord. Comparer ensuite.', local: 'Enregistré dans ce navigateur',
    privacy: 'Votre brouillon reste dans ce navigateur. En enregistrant votre réponse, son texte et votre degré de confiance sont envoyés aux consoles hôtes correspondantes pour cette dégustation, dans ce navigateur et le même compte ou la même session invitée. La réponse n’est pas synchronisée comme donnée de compte.',
    prompt: 'Votre réponse avant la révélation', placeholder: 'Une observation ou une hypothèse…', confidence: 'Quel est votre degré de certitude ?',
    low: 'Incertain', medium: 'Tendance', high: 'Sûr', save: 'Enregistrer et envoyer le signal de table', saved: 'Réponse enregistrée',
    pulseSent: 'Enregistré sur cet appareil. Le signal de réponse a été envoyé aux consoles hôtes correspondantes dans ce navigateur.',
    pulseFailed: 'Enregistré sur cet appareil, mais le signal de table n’a pas pu être envoyé.',
    storageFailed: 'Ce navigateur n’a pas pu enregistrer votre brouillon. Gardez cette page ouverte et réessayez.',
    wine: 'Garder ce vin', aromas: 'Arômes que vous pouvez défendre', structure: 'Structure dans votre verre', acid: 'Acidité', tannin: 'Tanins', body: 'Corps',
    reflection: 'Que retiendrez-vous ?', reflectionHint: 'Une phrase précise suffit.', cellar: 'Ajouter le vin et la note à la cave',
    saveNote: 'Enregistrer la note de dégustation', inCellar: 'Vin et note enregistrés', wineFailed: 'Le vin et la note n’ont pas pu être enregistrés dans votre compte. La note a peut-être tout de même été enregistrée ; réessayez.',
    complete: 'Terminer le chapitre', completed: 'Chapitre terminé', of: 'sur',
  },
  es: {
    eyebrow: 'Tu lugar en la mesa', title: 'Primero observa. Después compara.', local: 'Guardado en este navegador',
    privacy: 'Tu borrador permanece en este navegador. Al guardar, el texto y tu grado de seguridad se envían a las consolas correspondientes de esta cata, en este navegador y con la misma cuenta o sesión de invitado. La respuesta no se sincroniza como dato de la cuenta.',
    prompt: 'Tu respuesta antes de revelar', placeholder: 'Una observación o predicción…', confidence: '¿Qué seguridad tienes?',
    low: 'Inseguro', medium: 'Me inclino', high: 'Seguro', save: 'Guardar y enviar el pulso de la mesa', saved: 'Respuesta guardada',
    pulseSent: 'Guardado en este dispositivo. La señal de respuesta se envió a las consolas correspondientes en este navegador.',
    pulseFailed: 'Guardado en este dispositivo, pero no se pudo enviar el pulso de la mesa.',
    storageFailed: 'Este navegador no pudo guardar tu borrador. Mantén esta página abierta e inténtalo de nuevo.',
    wine: 'Guardar este vino', aromas: 'Aromas que puedes justificar', structure: 'Estructura en tu copa', acid: 'Acidez', tannin: 'Tanino', body: 'Cuerpo',
    reflection: '¿Qué recordarás?', reflectionHint: 'Una frase precisa basta.', cellar: 'Añadir vino y nota a la bodega',
    saveNote: 'Guardar nota de cata', inCellar: 'Vino y nota guardados', wineFailed: 'No se pudieron guardar el vino y la nota en tu cuenta. Es posible que la nota de cata sí se haya guardado; inténtalo de nuevo.',
    complete: 'Completar capítulo', completed: 'Capítulo completado', of: 'de',
  },
}

type ParticipantToolsProps = {
  journey: TastingJourney
  chapter: TastingChapter
  wine?: Wine
  locale: Locale
  complete: boolean
  onComplete: () => void
}

function readResponse(key: string): ResponseState {
  const value = readInteractionValue<unknown>(key, null)
  if (!value || typeof value !== 'object') return blank
  const stored = value as Partial<ResponseState>
  const bounded = (input: unknown, fallback: number) => typeof input === 'number' && Number.isFinite(input) ? Math.max(1, Math.min(5, Math.round(input))) : fallback
  return {
    text: typeof stored.text === 'string' ? stored.text : '',
    confidence: typeof stored.confidence === 'number' && Number.isInteger(stored.confidence) ? Math.max(0, Math.min(2, stored.confidence)) : blank.confidence,
    saved: stored.saved === true,
    wineSaved: stored.wineSaved === true,
    noteId: typeof stored.noteId === 'string' ? stored.noteId : undefined,
    aromaIds: Array.isArray(stored.aromaIds) ? stored.aromaIds.filter((id): id is string => typeof id === 'string') : [],
    acid: bounded(stored.acid, blank.acid),
    tannin: bounded(stored.tannin, blank.tannin),
    body: bounded(stored.body, blank.body),
    reflection: typeof stored.reflection === 'string' ? stored.reflection : '',
  }
}

export function TastingParticipantTools(props: ParticipantToolsProps) {
  const { user } = useAuth()
  const storageKey = scopedInteractionKey(`vine-atlas-participant:${props.journey.id}:${props.chapter.id}`, user?.id)
  const channelKey = scopedInteractionKey(`vine-atlas-tasting:${props.journey.id}`, user?.id)
  return <ParticipantToolsSession key={storageKey} {...props} storageKey={storageKey} channelKey={channelKey} />
}

function ParticipantToolsSession({ journey, chapter, wine, locale, complete, onComplete, storageKey, channelKey }: ParticipantToolsProps & { storageKey: string; channelKey: string }) {
  const c = copy[locale]
  const [state, setState] = useState<ResponseState>(() => readResponse(storageKey))
  const [storageFailed, setStorageFailed] = useState(false)
  const [pulseStatus, setPulseStatus] = useState<'idle' | 'sent' | 'failed'>('idle')
  const [wineSaveFailed, setWineSaveFailed] = useState(false)
  const wineAromas = useMemo(() => wine ? aromas.filter(aroma => wine.aromaIds.includes(aroma.id)) : [], [wine])
  const inCellar = wine ? repository.cellar.all().some(item => item.wineId === wine.id) : false

  useEffect(() => { setStorageFailed(!writeInteractionValue(storageKey, state)) }, [storageKey, state])

  function saveResponse() {
    const response = { ...state, saved: true }
    if (!writeInteractionValue(storageKey, response)) {
      setStorageFailed(true)
      setPulseStatus('idle')
      return
    }
    setStorageFailed(false)
    setState(response)
    try {
      const channel = new BroadcastChannel(channelKey)
      channel.postMessage({ type: 'pulse', chapterId: chapter.id, confidence: state.confidence, observation: state.text.trim() })
      channel.close()
      setPulseStatus('sent')
    } catch {
      setPulseStatus('failed')
    }
  }

  function saveWine() {
    if (!wine || state.wineSaved) return
    try {
      const notes = repository.notes.all()
      const existingNote = notes.find(note => note.id === state.noteId && note.tastingId === journey.id && note.wineId === wine.id)
        ?? notes.find(note => note.tastingId === journey.id && note.wineId === wine.id)
      const now = existingNote?.createdAt ?? new Date().toISOString()
      const note: TastingNote = {
        id: existingNote?.id ?? crypto.randomUUID(), tastingId: journey.id, wineId: wine.id,
        appearance: '', aromaIds: state.aromaIds,
        palate: `${c.acid} ${state.acid}/5 · ${c.tannin} ${state.tannin}/5 · ${c.body} ${state.body}/5`,
        reflection: state.reflection, rating: 0, visibility: 'private', createdAt: now,
      }
      repository.notes.save(existingNote ? notes.map(item => item.id === existingNote.id ? note : item) : [...notes, note])

      const cellar = repository.cellar.all()
      const existing = cellar.find(item => item.wineId === wine.id)
      const cellarNote = {
        id: note.id, appearance: '', aromaIds: note.aromaIds, palate: note.palate, finish: '', reflection: note.reflection,
        acidity: state.acid, tannin: state.tannin, body: state.body, rating: 0, createdAt: now,
      }
      if (existing) {
        existing.quantity = Math.max(1, existing.quantity)
        existing.state = 'tasted'
        const cellarNotes = existing.notes ?? []
        existing.notes = cellarNotes.some(item => item.id === note.id)
          ? cellarNotes.map(item => item.id === note.id ? cellarNote : item)
          : [...cellarNotes, cellarNote]
      } else {
        cellar.push({ id: crypto.randomUUID(), wineId: wine.id, state: 'tasted', quantity: 1, location: 'Home cellar', vintage: wine.vintage ?? undefined, bottleSizeMl: 750, notes: [cellarNote] })
      }
      repository.cellar.save(cellar)
      setWineSaveFailed(false)
      setState(value => ({ ...value, wineSaved: true, noteId: note.id }))
    } catch {
      setWineSaveFailed(true)
    }
  }

  function updateWineState(patch: Partial<ResponseState>) {
    setWineSaveFailed(false)
    setState(value => ({ ...value, ...patch, wineSaved: false }))
  }

  const confidenceLabels = [c.low, c.medium, c.high]
  return <section className="participant-table-tools">
    <header>
      <div><span className="eyebrow"><Sparkles />{c.eyebrow}</span><h2>{c.title}</h2></div>
      <small><LockKeyhole />{c.local}</small>
    </header>
    {chapter.interaction !== 'observe' && <div className="participant-prompt">
      <label><span>{c.prompt}</span><textarea value={state.text} onChange={event => { setPulseStatus('idle'); setState(value => ({ ...value, text: event.target.value, saved: false })) }} placeholder={chapter.prompt || c.placeholder} /></label>
      <p className="interaction-privacy-note">{c.privacy}</p>
      <fieldset><legend>{c.confidence}</legend>{confidenceLabels.map((label, index) => <button type="button" className={state.confidence === index ? 'active' : ''} aria-pressed={state.confidence === index} onClick={() => { setPulseStatus('idle'); setState(value => ({ ...value, confidence: index, saved: false })) }} key={label}><b>{index + 1}</b>{label}</button>)}</fieldset>
      <button type="button" className="secondary-button" onClick={saveResponse} disabled={!state.text.trim()}>{state.saved ? <Check /> : <NotebookPen />}{state.saved ? c.saved : c.save}</button>
      {state.saved && <p className="interaction-feedback" role="status">{pulseStatus === 'sent' ? copy[locale].pulseSent : pulseStatus === 'failed' ? copy[locale].pulseFailed : c.saved}</p>}
      {storageFailed && <p className="interaction-feedback is-error" role="alert">{c.storageFailed}</p>}
    </div>}
    {wine && <div className="participant-wine-note">
      <div><span className="eyebrow"><Grape />{c.wine}</span><h3>{c.aromas}</h3>
        <div className="participant-aromas">{wineAromas.map(aroma => <button type="button" aria-pressed={state.aromaIds.includes(aroma.id)} className={state.aromaIds.includes(aroma.id) ? 'active' : ''} onClick={() => updateWineState({ aromaIds: state.aromaIds.includes(aroma.id) ? state.aromaIds.filter(id => id !== aroma.id) : [...state.aromaIds, aroma.id] })} key={aroma.id}>{state.aromaIds.includes(aroma.id) && <Check />}{aromaContent(aroma, locale).name}</button>)}</div>
      </div>
      <div className="participant-structure"><h3>{c.structure}</h3>
        {([['acid', c.acid], ['tannin', c.tannin], ['body', c.body]] as const).map(([field, label]) => <label key={field}><span>{label}</span><input type="range" min="1" max="5" aria-valuetext={`${state[field]} ${copy[locale].of ?? 'of'} 5`} value={state[field]} onChange={event => updateWineState({ [field]: Number(event.target.value) })} /><b>{state[field]} / 5</b></label>)}
        <label className="participant-reflection"><span>{c.reflection}</span><textarea value={state.reflection} onChange={event => updateWineState({ reflection: event.target.value })} placeholder={c.reflectionHint} /></label>
        <button type="button" className="primary-button" onClick={saveWine}>{state.wineSaved ? <Check /> : inCellar ? <NotebookPen /> : <Plus />}{state.wineSaved ? c.inCellar : inCellar ? c.saveNote : c.cellar}</button>
        {state.wineSaved && <p className="interaction-feedback" role="status">{c.inCellar}</p>}
        {wineSaveFailed && <p className="interaction-feedback is-error" role="alert">{c.wineFailed}</p>}
      </div>
    </div>}
    <button type="button" className={`participant-complete ${complete ? 'done' : ''}`} aria-pressed={complete} onClick={onComplete}>{complete ? <Check /> : <span />}{complete ? c.completed : c.complete}</button>
  </section>
}
