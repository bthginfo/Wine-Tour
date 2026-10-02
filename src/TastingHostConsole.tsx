import { useEffect, useMemo, useState } from 'react'
import { MessageCircleMore, Pause, Play, RotateCcw, Sparkles, TimerReset, Trash2, Users } from 'lucide-react'
import { useAuth } from './auth'
import { useLocale, type Locale } from './i18n'
import type { TastingChapter, TastingJourney } from './types'
import { readInteractionValue, scopedInteractionKey, writeInteractionValue } from './interactionStorage'
import './interaction-audit.css'

const copy: Record<Locale, Record<string, string>> = {
  en: { eyebrow: 'Host console', title: 'Guide the table through each stage', frame: 'Frame', predict: 'Predict', reveal: 'Reveal', discuss: 'Discuss', prompt: 'Question for the table', promptFallback: 'What do you notice before anyone names the wine?', revealFallback: 'Return to the evidence: name one observation, one possible cause and one uncertainty.', timer: 'Chapter timer', timerStart: 'Start timer', timerPause: 'Pause timer', timerReset: 'Reset timer', start: 'Start', pause: 'Pause', reset: 'Reset', pulse: 'Response signals', pulseInfo: 'Counts include response signals sent from participant tools in this browser.', low: 'Unsure', medium: 'Leaning', high: 'Confident', observation: 'Add a table observation', placeholder: 'Write one precise observation…', add: 'Add observation', notes: 'Observations saved in this browser', remove: 'Remove observation', clear: 'Reset counts only; keep observations', localOnly: 'Timer, response counts and observations are saved only in this browser for this account.', storageFailed: 'This browser could not save the host console. Keep this page open; the timer and observations may not be retained.' },
  de: { eyebrow: 'Host-Konsole', title: 'Führe die Runde durch jede Phase', frame: 'Einordnen', predict: 'Vermuten', reveal: 'Auflösen', discuss: 'Besprechen', prompt: 'Frage an den Tisch', promptFallback: 'Was fällt euch auf, bevor jemand den Wein benennt?', revealFallback: 'Zurück zu den Hinweisen: eine Beobachtung, eine mögliche Ursache und eine Unsicherheit.', timer: 'Kapitel-Timer', timerStart: 'Timer starten', timerPause: 'Timer pausieren', timerReset: 'Timer zurücksetzen', start: 'Start', pause: 'Pause', reset: 'Zurücksetzen', pulse: 'Antwortsignale', pulseInfo: 'Gezählt werden Antwortsignale aus Teilnehmer-Tools in diesem Browser.', low: 'Unsicher', medium: 'Tendenz', high: 'Sicher', observation: 'Beobachtung am Tisch notieren', placeholder: 'Eine präzise Beobachtung …', add: 'Beobachtung hinzufügen', notes: 'Beobachtungen in diesem Browser gespeichert', remove: 'Beobachtung entfernen', clear: 'Nur Antwortzahlen zurücksetzen; Notizen behalten', localOnly: 'Timer, Antwortzahlen und Beobachtungen werden nur in diesem Browser für dieses Konto gespeichert.', storageFailed: 'Dieser Browser konnte die Host-Konsole nicht speichern. Lass die Seite geöffnet; Timer und Beobachtungen bleiben möglicherweise nicht erhalten.' },
  fr: { eyebrow: 'Console hôte', title: 'Guidez la table à chaque étape', frame: 'Cadrer', predict: 'Prédire', reveal: 'Révéler', discuss: 'Discuter', prompt: 'Question à la table', promptFallback: 'Que remarquez-vous avant que quelqu’un nomme le vin ?', revealFallback: 'Revenez aux indices : une observation, une cause possible et une incertitude.', timer: 'Minuteur du chapitre', timerStart: 'Démarrer le minuteur', timerPause: 'Mettre le minuteur en pause', timerReset: 'Réinitialiser le minuteur', start: 'Démarrer', pause: 'Pause', reset: 'Réinitialiser', pulse: 'Signaux de réponse', pulseInfo: 'Les compteurs incluent les signaux envoyés par les outils participants dans ce navigateur.', low: 'Incertain', medium: 'Tendance', high: 'Sûr', observation: 'Ajouter une observation de table', placeholder: 'Notez une observation précise…', add: 'Ajouter', notes: 'Observations enregistrées dans ce navigateur', remove: 'Supprimer cette observation', clear: 'Réinitialiser les compteurs seulement ; garder les notes', localOnly: 'Le minuteur, les compteurs et les observations sont enregistrés uniquement dans ce navigateur pour ce compte.', storageFailed: 'Ce navigateur n’a pas pu enregistrer la console hôte. Gardez cette page ouverte ; le minuteur et les observations risquent de ne pas être conservés.' },
  es: { eyebrow: 'Consola del anfitrión', title: 'Guía a la mesa por cada etapa', frame: 'Enmarcar', predict: 'Predecir', reveal: 'Revelar', discuss: 'Conversar', prompt: 'Pregunta para la mesa', promptFallback: '¿Qué notas antes de que alguien nombre el vino?', revealFallback: 'Vuelve a las evidencias: una observación, una causa posible y una incertidumbre.', timer: 'Temporizador del capítulo', timerStart: 'Iniciar temporizador', timerPause: 'Pausar temporizador', timerReset: 'Reiniciar temporizador', start: 'Iniciar', pause: 'Pausa', reset: 'Reiniciar', pulse: 'Señales de respuesta', pulseInfo: 'El recuento incluye señales enviadas desde las herramientas de participantes en este navegador.', low: 'Inseguro', medium: 'Me inclino', high: 'Seguro', observation: 'Añadir una observación de la mesa', placeholder: 'Escribe una observación precisa…', add: 'Añadir observación', notes: 'Observaciones guardadas en este navegador', remove: 'Eliminar observación', clear: 'Reiniciar solo el recuento; conservar observaciones', localOnly: 'El temporizador, las respuestas y las observaciones solo se guardan en este navegador para esta cuenta.', storageFailed: 'Este navegador no pudo guardar la consola del anfitrión. Mantén esta página abierta; puede que el temporizador y las observaciones no se conserven.' },
}

type HostState = { phase: number; seconds: number; running: boolean; votes: [number, number, number]; notes: string[] }
const initial = (chapter: TastingChapter): HostState => ({ phase: chapter.interaction === 'predict' ? 1 : 0, seconds: chapter.duration * 60, running: false, votes: [0, 0, 0], notes: [] })

function readHostState(key: string, chapter: TastingChapter): HostState {
  const value = readInteractionValue<unknown>(key, null)
  if (!value || typeof value !== 'object') return initial(chapter)
  const stored = value as Partial<HostState>
  const votes = Array.isArray(stored.votes) ? stored.votes.slice(0, 3).map(count => typeof count === 'number' && Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0) : [0, 0, 0]
  while (votes.length < 3) votes.push(0)
  return {
    phase: typeof stored.phase === 'number' && Number.isInteger(stored.phase) ? Math.max(0, Math.min(3, stored.phase)) : initial(chapter).phase,
    seconds: typeof stored.seconds === 'number' && Number.isFinite(stored.seconds) ? Math.max(0, Math.floor(stored.seconds)) : chapter.duration * 60,
    running: false,
    votes: votes as [number, number, number],
    notes: Array.isArray(stored.notes) ? stored.notes.filter((note): note is string => typeof note === 'string') : [],
  }
}

export function TastingHostConsole({ journey, chapter }: { journey: TastingJourney; chapter: TastingChapter }) {
  const { user } = useAuth()
  const storageKey = scopedInteractionKey(`vine-atlas-host:${journey.id}:${chapter.id}`, user?.id)
  const channelKey = scopedInteractionKey(`vine-atlas-tasting:${journey.id}`, user?.id)
  return <HostConsoleSession key={storageKey} chapter={chapter} storageKey={storageKey} channelKey={channelKey} />
}

function HostConsoleSession({ chapter, storageKey, channelKey }: { chapter: TastingChapter; storageKey: string; channelKey: string }) {
  const { locale } = useLocale()
  const c = copy[locale]
  const [state, setState] = useState<HostState>(() => readHostState(storageKey, chapter))
  const [note, setNote] = useState('')
  const [storageFailed, setStorageFailed] = useState(false)

  useEffect(() => { setStorageFailed(!writeInteractionValue(storageKey, state)) }, [storageKey, state])
  useEffect(() => {
    let channel: BroadcastChannel | undefined
    try {
      channel = new BroadcastChannel(channelKey)
      channel.onmessage = event => {
        const message = event.data as { type?: string; chapterId?: string; confidence?: number; observation?: string }
        if (message.type !== 'pulse' || message.chapterId !== chapter.id || !Number.isInteger(message.confidence) || message.confidence! < 0 || message.confidence! > 2) return
        setState(value => ({
          ...value,
          votes: value.votes.map((count, index) => index === message.confidence ? count + 1 : count) as HostState['votes'],
          notes: typeof message.observation === 'string' && message.observation.trim() ? [...value.notes, message.observation.trim()] : value.notes,
        }))
      }
    } catch { /* Optional same-browser live enhancement. */ }
    return () => channel?.close()
  }, [channelKey, chapter.id])
  useEffect(() => {
    if (!state.running || state.seconds <= 0) return
    const id = window.setInterval(() => setState(value => ({ ...value, seconds: Math.max(0, value.seconds - 1), running: value.seconds > 1 })), 1000)
    return () => window.clearInterval(id)
  }, [state.running, state.seconds])

  const time = useMemo(() => `${String(Math.floor(state.seconds / 60)).padStart(2, '0')}:${String(state.seconds % 60).padStart(2, '0')}`, [state.seconds])
  const phases = [c.frame, c.predict, c.reveal, c.discuss]
  const prompt = chapter.prompt || c.promptFallback
  const reveal = chapter.reveal || c.revealFallback
  const addNote = () => {
    const value = note.trim()
    if (!value) return
    setState(current => ({ ...current, notes: [...current.notes, value] }))
    setNote('')
  }

  return <section className="tasting-host-console">
    <header>
      <div><span className="eyebrow"><Users />{c.eyebrow}</span><h2>{c.title}</h2></div>
      <div className="host-timer"><TimerReset /><output aria-label={c.timer} aria-live="off">{time}</output>
        <button type="button" aria-label={state.running ? c.timerPause : c.timerStart} onClick={() => setState(value => ({ ...value, running: !value.running }))}>{state.running ? <Pause /> : <Play />}<span>{state.running ? c.pause : c.start}</span></button>
        <button type="button" aria-label={c.timerReset} onClick={() => setState(value => ({ ...value, seconds: chapter.duration * 60, running: false }))}><RotateCcw /><span>{c.reset}</span></button>
      </div>
    </header>
    <nav aria-label={c.eyebrow}>{phases.map((phase, index) => <button type="button" className={state.phase === index ? 'active' : state.phase > index ? 'done' : ''} aria-current={state.phase === index ? 'step' : undefined} onClick={() => setState(value => ({ ...value, phase: index }))} key={phase}><span>{String(index + 1).padStart(2, '0')}</span>{phase}</button>)}</nav>
    <div className="host-stage"><article><span>{state.phase < 2 ? c.prompt : c.reveal}</span><p aria-live="polite">{state.phase < 2 ? prompt : reveal}</p></article>
      <aside><span><Sparkles />{c.pulse}</span><p className="host-console-local-note">{c.pulseInfo}</p><div>{([c.low, c.medium, c.high] as string[]).map((label, index) => <div className="host-pulse-result" key={label}><strong>{state.votes[index]}</strong>{label}</div>)}</div><button type="button" className="text-action" onClick={() => setState(value => ({ ...value, votes: [0, 0, 0] }))}>{c.clear}</button></aside>
    </div>
    <div className="host-observations"><label><span><MessageCircleMore />{c.observation}</span><div><input value={note} onChange={event => setNote(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addNote() } }} placeholder={c.placeholder} /><button type="button" onClick={addNote} disabled={!note.trim()}>{c.add}</button></div></label>
      <p className="host-console-local-note">{c.localOnly}</p>
      {state.notes.length > 0 && <div><span>{c.notes}</span><ol>{state.notes.map((item, index) => <li key={`${item}-${index}`}><span>{item}</span><button type="button" aria-label={`${c.remove}: ${item}`} onClick={() => setState(value => ({ ...value, notes: value.notes.filter((_, noteIndex) => noteIndex !== index) }))}><Trash2 /></button></li>)}</ol></div>}
      {storageFailed && <p role="alert" className="interaction-feedback is-error">{c.storageFailed}</p>}
    </div>
  </section>
}
