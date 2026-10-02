import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowRight, Check, LockKeyhole, NotebookPen, Plus, Share2, X } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { aromas, grapes, producers, regions, wines } from './data/catalog'
import { repository } from './data/repository'
import { aromaContent } from './localizedContent'
import { useLocale, type Locale } from './i18n'
import { useUiCopy } from './uiCopy'
import type { TastingEvent, TastingJourney, TastingNote } from './types'

const copy: Record<Locale, Record<string, string>> = {
  en: { loading: 'Opening tasting…', missing: 'This tasting could not be found.', missingBody: 'Check the six-character invitation code or ask the host for a new link.', unavailable: 'This tasting could not be opened.', unavailableBody: 'Check your connection and try again later.', empty: 'This tasting has no wines or learning journey yet.', back: 'Back to tastings', add: 'Add to my cellar', added: 'In my cellar', share: 'Copy tasting link', copied: 'Tasting link copied.', copyFailed: 'Could not copy the link. Use the address bar to share this tasting.', flight: 'Wines in this tasting', noteSections: 'Tasting note sections', wine: 'Wine', saveFailed: 'Your note could not be saved on this device. Try again.' },
  de: { loading: 'Tasting wird geöffnet…', missing: 'Dieses Tasting wurde nicht gefunden.', missingBody: 'Prüfe den sechsstelligen Einladungscode oder bitte den Host um einen neuen Link.', unavailable: 'Dieses Tasting konnte nicht geöffnet werden.', unavailableBody: 'Prüfe deine Verbindung und versuche es später erneut.', empty: 'Dieses Tasting enthält noch keine Weine oder Lernreise.', back: 'Zurück zu Tastings', add: 'In meinen Keller legen', added: 'In meinem Keller', share: 'Tasting-Link kopieren', copied: 'Tasting-Link kopiert.', copyFailed: 'Der Link konnte nicht kopiert werden. Teile dieses Tasting über die Adresszeile.', flight: 'Weine in diesem Tasting', noteSections: 'Abschnitte der Verkostungsnotiz', wine: 'Wein', saveFailed: 'Deine Notiz konnte auf diesem Gerät nicht gespeichert werden. Versuche es erneut.' },
  fr: { loading: 'Ouverture de la dégustation…', missing: 'Cette dégustation est introuvable.', missingBody: 'Vérifiez le code d’invitation à six caractères ou demandez un nouveau lien à l’hôte.', unavailable: 'Cette dégustation n’a pas pu être ouverte.', unavailableBody: 'Vérifiez votre connexion et réessayez plus tard.', empty: 'Cette dégustation ne contient pas encore de vins ni de parcours.', back: 'Retour aux dégustations', add: 'Ajouter à ma cave', added: 'Dans ma cave', share: 'Copier le lien de dégustation', copied: 'Lien de dégustation copié.', copyFailed: 'Le lien n’a pas pu être copié. Partagez cette dégustation depuis la barre d’adresse.', flight: 'Vins de cette dégustation', noteSections: 'Sections de la note de dégustation', wine: 'Vin', saveFailed: 'Votre note n’a pas pu être enregistrée sur cet appareil. Réessayez.' },
  es: { loading: 'Abriendo la cata…', missing: 'No se encontró esta cata.', missingBody: 'Comprueba el código de invitación de seis caracteres o pide un nuevo enlace al anfitrión.', unavailable: 'No se pudo abrir esta cata.', unavailableBody: 'Comprueba tu conexión e inténtalo de nuevo más tarde.', empty: 'Esta cata todavía no contiene vinos ni recorrido de aprendizaje.', back: 'Volver a catas', add: 'Añadir a mi bodega', added: 'En mi bodega', share: 'Copiar enlace de la cata', copied: 'Enlace de la cata copiado.', copyFailed: 'No se pudo copiar el enlace. Comparte esta cata desde la barra de direcciones.', flight: 'Vinos de esta cata', noteSections: 'Secciones de la nota de cata', wine: 'Vino', saveFailed: 'No se pudo guardar tu nota en este dispositivo. Inténtalo de nuevo.' },
}
const cellarAddFailed: Record<Locale, string> = {
  en: 'This wine could not be added to your cellar. Try again.',
  de: 'Dieser Wein konnte nicht in den Keller gelegt werden. Versuche es erneut.',
  fr: 'Ce vin n’a pas pu être ajouté à votre cave. Réessayez.',
  es: 'No se pudo añadir este vino a tu bodega. Inténtalo de nuevo.',
}

export function ConnectedTastingRoom({ renderJourney }: { renderJourney: (journey: TastingJourney) => ReactNode }) {
  const { id = '' } = useParams()
  return <TastingRoomSession key={id} id={id} renderJourney={renderJourney} />
}

function TastingRoomSession({ id, renderJourney }: { id: string; renderJourney: (journey: TastingJourney) => ReactNode }) {
  const { locale } = useLocale()
  const ui = useUiCopy()
  const roomCopy = copy[locale]
  const localJourney = useMemo(() => repository.journeys.all().find(item => item.id === id), [id])
  const [event, setEvent] = useState<TastingEvent | null>(null)
  const [loading, setLoading] = useState(!localJourney)
  const [loadFailed, setLoadFailed] = useState(false)
  const [current, setCurrent] = useState(0)
  const [step, setStep] = useState(0)
  const [selectedAromas, setSelectedAromas] = useState<string[]>([])
  const [fields, setFields] = useState({ appearance: ui.defaultAppearance, palate: '', reflection: '' })
  const [saved, setSaved] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)
  const [cellarSaveFailed, setCellarSaveFailed] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const [, setCellarVersion] = useState(0)

  useEffect(() => {
    if (localJourney) { setLoading(false); return }
    let active = true
    setEvent(null)
    setLoadFailed(false)
    setLoading(true)
    void fetch(`/api/tastings/join?code=${encodeURIComponent(id)}`, { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      .then(async response => {
        if (response.status === 404) return null
        if (!response.ok) throw new Error('Request failed')
        const payload = await response.json() as { event: TastingEvent }
        return payload.event
      })
      .then(payload => { if (active) setEvent(payload) })
      .catch(() => { if (active) { setEvent(null); setLoadFailed(true) } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, localJourney])

  const journey = localJourney ?? event?.journey
  const flight = useMemo(() => event?.featuredWineIds.map(wineId => wines.find(wine => wine.id === wineId)).filter((wine): wine is typeof wines[number] => Boolean(wine)) ?? [], [event])
  const wine = flight[current]
  const shareUrl = `${window.location.origin}/tastings/${id}`

  if (journey) return <>{renderJourney(journey)}</>
  if (loading) return <div className="page guarded" aria-busy="true"><span className="loading-orbit" /><h1>{roomCopy.loading}</h1></div>
  if (!event) return <div className="page guarded"><LockKeyhole /><h1>{loadFailed ? roomCopy.unavailable : roomCopy.missing}</h1><p>{loadFailed ? roomCopy.unavailableBody : roomCopy.missingBody}</p><Link to="/tastings" className="primary-button ink">{roomCopy.back}</Link></div>
  if (!wine) return <div className="page guarded"><NotebookPen /><h1>{event.title}</h1><p>{roomCopy.empty}</p><Link to="/tastings" className="primary-button ink">{roomCopy.back}</Link></div>

  const inCellar = repository.cellar.all().some(item => item.wineId === wine.id)
  function showWine(index: number) {
    setCurrent(index)
    setStep(0)
    setSaved(false)
    setSaveFailed(false)
    setCellarSaveFailed(false)
    setSelectedAromas([])
    setFields({ appearance: ui.defaultAppearance, palate: '', reflection: '' })
  }
  function saveNote() {
    if (saved) return
    try {
      const activeEvent = event
      if (!activeEvent) return
      const tastingId = activeEvent.id
      const notes = repository.notes.all()
      const existing = notes.find(note => note.tastingId === tastingId && note.wineId === wine.id)
      const next: TastingNote = { id: existing?.id ?? crypto.randomUUID(), tastingId, wineId: wine.id, appearance: fields.appearance, aromaIds: selectedAromas, palate: fields.palate, reflection: fields.reflection, rating: 4, visibility: 'private', createdAt: existing?.createdAt ?? new Date().toISOString() }
      repository.notes.save(existing ? notes.map(note => note.id === existing.id ? next : note) : [...notes, next])
      const cellar = repository.cellar.all()
      const cellarItem = cellar.find(item => item.wineId === wine.id)
      if (cellarItem) {
        const cellarNote = { id: next.id, appearance: next.appearance, aromaIds: next.aromaIds, palate: next.palate, finish: '', reflection: next.reflection, acidity: 3, tannin: wine.style === 'red' ? 3 : 1, body: 3, rating: next.rating, createdAt: next.createdAt }
        const cellarNotes = cellarItem.notes ?? []
        cellarItem.notes = cellarNotes.some(note => note.id === next.id) ? cellarNotes.map(note => note.id === next.id ? cellarNote : note) : [...cellarNotes, cellarNote]
        cellarItem.rating = next.rating
        repository.cellar.save(cellar)
        setCellarVersion(value => value + 1)
      }
      setSaved(true)
      setSaveFailed(false)
    } catch {
      setSaveFailed(true)
    }
  }
  function addCurrentWine() {
    const cellar = repository.cellar.all()
    if (cellar.some(item => item.wineId === wine.id)) return
    try {
      cellar.push({ id: crypto.randomUUID(), wineId: wine.id, state: 'tasted', quantity: 1, location: ui.homeCellar, vintage: wine.vintage ?? undefined, bottleSizeMl: 750, notes: [] })
      repository.cellar.save(cellar)
      setCellarVersion(value => value + 1)
      setCellarSaveFailed(false)
    } catch {
      setCellarSaveFailed(true)
    }
  }
  async function copyShareLink() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(shareUrl)
      setShareStatus('copied')
    } catch {
      setShareStatus('failed')
    }
  }

  return <div className="tasting-room">
    <header className="room-header"><Link to="/tastings" aria-label={ui.close}><X /></Link><div><small>{ui.liveTasting} · {ui.wine} {current + 1} {ui.of} {flight.length}</small><strong>{event.title}</strong></div><button type="button" aria-label={roomCopy.share} onClick={() => void copyShareLink()}><Share2 /></button></header>
    {shareStatus !== 'idle' && <p className="interaction-feedback" role="status">{shareStatus === 'copied' ? roomCopy.copied : roomCopy.copyFailed}</p>}
    <nav className="flight-progress" aria-label={roomCopy.flight}>{flight.map((item, index) => <button type="button" key={item.id} onClick={() => showWine(index)} className={index === current ? 'active' : index < current ? 'done' : ''} aria-current={index === current ? 'step' : undefined} aria-label={`${roomCopy.wine} ${index + 1}: ${item.name}`}><span>{index + 1}</span></button>)}</nav>
    <main>
      <section className="current-wine"><div className={`room-bottle style-${wine.style}`} /><div><span>{regions.find(region => region.id === wine.regionId)?.name}</span><h1>{wine.name}</h1><p>{producers.find(producer => producer.id === wine.producerId)?.name} · {wine.vintage ?? '—'}</p><div className="thread-cloud">{grapes.filter(grape => wine.grapeIds.includes(grape.id)).map(grape => <Link className="thread-link moss" to={`/grapes/${grape.id}`} key={grape.id}>{grape.name}</Link>)}</div><button type="button" className={inCellar ? 'secondary-button cellar-added' : 'secondary-button'} onClick={addCurrentWine} disabled={inCellar} aria-pressed={inCellar}>{inCellar ? <Check /> : <Plus />}{inCellar ? roomCopy.added : roomCopy.add}</button></div></section>
      <nav className="note-steps" aria-label={roomCopy.noteSections}>{[ui.look, ui.smell, ui.taste, ui.reflect].map((name, index) => <button type="button" onClick={() => setStep(index)} className={step === index ? 'active' : ''} aria-current={step === index ? 'step' : undefined} key={name}><span>{index + 1}</span>{name}</button>)}</nav>
      <section className="note-composer">
        {step === 0 && <><span className="eyebrow">{ui.stepOne} · {ui.look}</span><h2>{ui.glassShow}</h2><textarea aria-label={ui.glassShow} value={fields.appearance} onChange={event => { setFields({ ...fields, appearance: event.target.value }); setSaved(false); setSaveFailed(false) }} /></>}
        {step === 1 && <><span className="eyebrow">{ui.stepTwo} · {ui.smell}</span><h2>{ui.closestReferences}</h2><p>{ui.noCorrectNumber}</p><div className="note-aromas" role="group" aria-label={ui.closestReferences}>{aromas.filter(aroma => wine.aromaIds.includes(aroma.id)).map(aroma => <button type="button" className={selectedAromas.includes(aroma.id) ? 'active' : ''} aria-pressed={selectedAromas.includes(aroma.id)} onClick={() => { setSelectedAromas(values => values.includes(aroma.id) ? values.filter(id => id !== aroma.id) : [...values, aroma.id]); setSaved(false); setSaveFailed(false) }} key={aroma.id}>{selectedAromas.includes(aroma.id) && <Check />}{aromaContent(aroma, locale).name}</button>)}</div></>}
        {step === 2 && <><span className="eyebrow">{ui.stepThree} · {ui.taste}</span><h2>{ui.wineBuilt}</h2><textarea aria-label={ui.wineBuilt} placeholder={ui.palatePlaceholder} value={fields.palate} onChange={event => { setFields({ ...fields, palate: event.target.value }); setSaved(false); setSaveFailed(false) }} /></>}
        {step === 3 && <><span className="eyebrow">{ui.stepFour} · {ui.reflect}</span><h2>{ui.remember}</h2><textarea aria-label={ui.remember} placeholder={ui.reflectionPlaceholder} value={fields.reflection} onChange={event => { setFields({ ...fields, reflection: event.target.value }); setSaved(false); setSaveFailed(false) }} /></>}
        <div className="composer-actions"><small><LockKeyhole />{ui.privateYou}</small>{step < 3 ? <button type="button" className="primary-button" onClick={() => setStep(step + 1)}>{ui.nextStep}<ArrowRight /></button> : <button type="button" aria-live="polite" className="primary-button" onClick={saveNote}>{saved ? <><Check />{ui.noteSaved}</> : <>{ui.saveNote}<NotebookPen /></>}</button>}</div>
        {saveFailed && <p role="alert" className="interaction-feedback is-error">{roomCopy.saveFailed}</p>}
        {cellarSaveFailed && <p role="alert" className="interaction-feedback is-error">{cellarAddFailed[locale]}</p>}
      </section>
    </main>
    <aside className="room-share"><QRCodeSVG value={shareUrl} size={110} bgColor="#f4efe6" fgColor="#241920" /><h3>{ui.bringTable}</h3><p>{ui.shareQr}</p></aside>
  </div>
}
