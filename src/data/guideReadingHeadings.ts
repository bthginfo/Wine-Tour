import type { Locale } from '../i18n'

export type GuideReadingHeadings = Record<Locale, [string, string, string]>
const splitHeadings = (value: string): [string, string, string] => value.split('|') as [string, string, string]
const h = (en: string, de: string, fr: string, es: string): GuideReadingHeadings => ({ en: splitHeadings(en), de: splitHeadings(de), fr: splitHeadings(fr), es: splitHeadings(es) })

// These are reading landmarks, not numbered chapter labels. The authored paragraphs
// stay intact; ArticlePage distributes them across the three topic beats below.
export const guideReadingHeadings: Record<string, GuideReadingHeadings> = {
  'vine-to-glass': h('Material arrives|Decisions in the cellar|Evidence in the glass', 'Das Material kommt an|Entscheidungen im Keller|Spuren im Glas', 'La matière arrive|Les choix de chai|Les indices dans le verre', 'La materia llega|Decisiones en bodega|Señales en la copa'),
  'taste-with-intention': h('Observe before naming|Structure on the palate|A note you can revisit', 'Beobachten, dann benennen|Struktur am Gaumen|Eine überprüfbare Notiz', 'Observer avant de nommer|La structure en bouche|Une note à revisiter', 'Observar antes de nombrar|Estructura en boca|Una nota revisable'),
  'sparkling-methods': h('Three routes to pressure|Lees, time and texture|Compare the method', 'Drei Wege zum Druck|Hefe, Zeit und Textur|Methode vergleichen', 'Trois voies vers la pression|Levures, temps et texture|Comparer les méthodes', 'Tres vías hacia la presión|Lías, tiempo y textura|Comparar el método'),
  'red-white-rose': h('Colour begins in the tissues|Contact, pressure and extraction|Name the route', 'Farbe beginnt im Gewebe|Kontakt, Druck und Extraktion|Den Weg benennen', 'La couleur commence dans les tissus|Contact, pression et extraction|Nommer la voie', 'El color empieza en los tejidos|Contacto, presión y extracción|Nombrar el proceso'),
  'sweet-wine': h('Where concentration comes from|Balance, not sugar alone|Taste the method', 'Wo Konzentration entsteht|Balance, nicht nur Zucker|Das Verfahren verkosten', 'D’où vient la concentration|L’équilibre, pas le sucre seul|Goûter le procédé', 'De dónde viene la concentración|Equilibrio, no solo azúcar|Probar el método'),
  'fortified-wine': h('When spirit enters|Ageing in different clocks|Strength at the table', 'Wann Destillat dazukommt|Reife mit verschiedenen Uhren|Stärke am Tisch', 'Quand l’alcool entre en jeu|Des vieillissements différents|La force à table', 'Cuándo entra el alcohol|Crianza con relojes distintos|Fuerza en la mesa'),
  service: h('Start with the condition|Temperature and air|A calm pour', 'Mit dem Zustand beginnen|Temperatur und Luft|Ruhig einschenken', 'Commencer par l’état|Température et air|Servir avec calme', 'Empezar por el estado|Temperatura y aire|Servir con calma'),
  'glassware-anatomy': h('Shape as an aroma chamber|Compare one variable|Cleanliness before prestige', 'Die Form als Aromaraum|Eine Variable vergleichen|Sauberkeit vor Prestige', 'La forme comme chambre aromatique|Comparer une variable|La propreté avant le prestige', 'La forma como cámara aromática|Comparar una variable|Limpieza antes que prestigio'),
  'aroma-language': h('Family before precision|References from real life|Keep uncertainty visible', 'Familie vor Präzision|Referenzen aus dem Alltag|Unsicherheit sichtbar lassen', 'La famille avant la précision|Des références réelles|Laisser l’incertitude visible', 'Familia antes que precisión|Referencias de la vida real|Mostrar la incertidumbre'),
  'vine-year': h('One vine, many seasons|Risk at each stage|Harvest as a decision', 'Eine Rebe, viele Saisons|Risiken in jeder Phase|Lese als Entscheidung', 'Une vigne, plusieurs saisons|Le risque à chaque étape|La vendange comme décision', 'Una vid, muchas estaciones|Riesgo en cada fase|La vendimia como decisión'),
  'terroir-layers': h('Climate sets the frame|Water, slope and roots|From place to evidence', 'Klima setzt den Rahmen|Wasser, Hang und Wurzeln|Vom Ort zum Beleg', 'Le climat fixe le cadre|Eau, pente et racines|Du lieu à la preuve', 'El clima marca el marco|Agua, ladera y raíces|Del lugar a la evidencia'),
  fermentation: h('The living conversion|Heat, nutrients and pace|Read the trajectory', 'Die lebende Umwandlung|Wärme, Nährstoffe und Tempo|Den Verlauf lesen', 'La transformation vivante|Chaleur, nutriments et rythme|Lire la trajectoire', 'La transformación viva|Calor, nutrientes y ritmo|Leer la trayectoria'),
  'maturation-vessels': h('Material and boundary conditions|A fair vessel comparison|Maintenance changes the result', 'Material und Randbedingungen|Gefäße fair vergleichen|Pflege verändert das Ergebnis', 'Matière et conditions limites|Comparer les contenants|L’entretien change le résultat', 'Material y condiciones|Comparar recipientes|El mantenimiento cambia el resultado'),
  'lees-and-malolactic': h('Lees are not one thing|Malolactic is another process|Measure the texture', 'Hefetrub ist nicht gleich|Malo ist ein anderer Prozess|Textur messen', 'Les lies ne sont pas une seule matière|La malo est un autre processus|Mesurer la texture', 'Las lías no son una sola cosa|La maloláctica es otro proceso|Medir la textura'),
  'labels-and-origin': h('Identity on the label|Origin has rules|Read the gaps', 'Identität auf dem Etikett|Herkunft hat Regeln|Lücken mitlesen', 'L’identité sur l’étiquette|L’origine a ses règles|Lire aussi les absences', 'La identidad en la etiqueta|El origen tiene reglas|Leer lo que falta'),
  'food-pairing': h('Structure meets structure|Taste the interaction|Adjust, then decide', 'Struktur trifft Struktur|Das Zusammenspiel verkosten|Anpassen, dann entscheiden', 'La structure rencontre la structure|Goûter l’interaction|Ajuster avant de conclure', 'La estructura encuentra estructura|Probar la interacción|Ajustar antes de decidir'),
  'wine-faults': h('Describe the signal|Check the alternative|Keep the threshold', 'Das Signal beschreiben|Die Alternative prüfen|Die Schwelle beachten', 'Décrire le signal|Vérifier l’alternative|Garder le seuil en tête', 'Describir la señal|Comprobar la alternativa|Respetar el umbral'),
  'climate-and-altitude': h('Energy and water|Latitude is not enough|Follow the site', 'Energie und Wasser|Breitengrad reicht nicht|Den Standort verfolgen', 'Énergie et eau|La latitude ne suffit pas|Suivre le site', 'Energía y agua|La latitud no basta|Seguir el lugar'),
  cellaring: h('Storage before folklore|Windows, not deadlines|Open to learn', 'Lagerung vor Mythos|Fenster statt Fristen|Öffnen, um zu lernen', 'Conserver avant les mythes|Fenêtres, pas échéances|Ouvrir pour apprendre', 'Conservar antes que creer mitos|Ventanas, no fechas límite|Abrir para aprender'),
  'sparkling-service': h('Pressure under control|Pouring protects mousse|Assess the glass', 'Druck im Griff|Einschenken schützt die Mousse|Das Glas beurteilen', 'Maîtriser la pression|Servir sans perdre la mousse|Lire le verre', 'Controlar la presión|Servir protege la espuma|Leer la copa'),
  'soil-water-roots': h('Read the soil profile|Roots follow pathways|Translate water into fruit', 'Das Bodenprofil lesen|Wurzeln folgen Wegen|Wasser in Frucht übersetzen', 'Lire le profil du sol|Les racines suivent les voies|Relier l’eau au fruit', 'Leer el perfil del suelo|Las raíces siguen caminos|Traducir agua en fruta'),
  'vintage-weather': h('Build the weather timeline|Timing changes the risk|Ask what benefited', 'Die Wetterlinie bauen|Zeitpunkt verändert das Risiko|Wer profitierte?', 'Construire la chronologie météo|Le moment change le risque|Qui en a profité ?', 'Construir la línea meteorológica|El momento cambia el riesgo|Quién salió favorecido'),
  'sensory-calibration': h('Make a shared scale|Separate sensation and cause|Repeat the test', 'Eine gemeinsame Skala bauen|Empfindung und Ursache trennen|Den Test wiederholen', 'Créer une échelle commune|Séparer sensation et cause|Répéter l’essai', 'Crear una escala común|Separar sensación y causa|Repetir la prueba'),
  'appellation-maps': h('Scale and orientation|Boundaries and rules|A place is evidence, not a score', 'Maßstab und Orientierung|Grenzen und Regeln|Ort ist Beleg, keine Wertung', 'Échelle et orientation|Limites et règles|Un lieu est une preuve, pas une note', 'Escala y orientación|Límites y reglas|El lugar es evidencia, no nota'),
  'bottle-closures': h('Sealing the bottle|Oxygen and variation|Opening and storage', 'Die Flasche verschließen|Sauerstoff und Streuung|Öffnen und lagern', 'Sceller la bouteille|Oxygène et variation|Ouvrir et conserver', 'Sellar la botella|Oxígeno y variación|Abrir y conservar'),
  'bottle-anatomy': h('Form follows function|Sediment, pressure and format|Read condition first', 'Form folgt Funktion|Depot, Druck und Format|Zustand zuerst prüfen', 'La forme suit la fonction|Dépôt, pression et format|Lire l’état d’abord', 'La forma sigue la función|Sedimento, presión y formato|Leer el estado'),
  'oxygen-and-age': h('Early oxygen can help|Bottle development is a dose|Air in the glass', 'Früher Sauerstoff kann helfen|Flaschenreife ist eine Dosis|Luft im Glas', 'L’oxygène précoce peut aider|L’évolution dépend de la dose|L’air dans le verre', 'El oxígeno temprano puede ayudar|La evolución depende de la dosis|El aire en la copa'),
}

export function guideReadingSections(id: string, locale: Locale, paragraphs: string[]) {
  const headings = guideReadingHeadings[id]?.[locale]
  if (!headings) return [{ heading: '', paragraphs }]
  const base = Math.floor(paragraphs.length / 3)
  const remainder = paragraphs.length % 3
  let cursor = 0
  return headings.map((heading, index) => {
    const size = Math.max(1, base + (index < remainder ? 1 : 0))
    const section = { heading, paragraphs: paragraphs.slice(cursor, cursor + size) }
    cursor += size
    return section
  }).filter(section => section.paragraphs.length)
}
