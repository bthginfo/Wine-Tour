import { useMemo, useState, type FormEvent } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileClock,
  Filter,
  ImagePlus,
  Link2,
  MapPin,
  PencilLine,
  Plus,
  Save,
  Search,
  Trash2,
  Wine,
} from "lucide-react";
import {
  aromas,
  grapes,
  producers,
  regions,
  slugify,
  wines,
} from "./data/catalog";
import { repository } from "./data/repository";
import { applyCatalogAdditions } from "./data/catalogExtensions";
import { useLocale, type Locale } from "./i18n";
import { deleteWineImage, prepareImage, uploadWineImage } from "./lib/image";
import { SearchableMultiSelect, SearchableSelect } from "./SearchableSelect";

type RecordType = "region" | "grape" | "producer" | "wine";
type EditorialDraft = {
  id: string;
  recordType: RecordType;
  baseId?: string;
  name: string;
  slug: string;
  status: "draft" | "review" | "published";
  locale: Locale;
  summary: string;
  description: string;
  sourceUrls: string[];
  fields: Record<string, string | string[]>;
  createdAt: string;
  updatedAt: string;
};
type CatalogRow = {
  id: string;
  type: RecordType;
  name: string;
  meta: string;
};

const copy = {
  en: {
    workspace: "Editorial records",
    title: "Shape every public fact before it reaches the atlas",
    body: "Search the full catalogue, open a record and prepare a sourced change set. Drafts are saved to the protected editorial queue; published records become part of the public atlas.",
    catalog: "Catalogue",
    drafts: "Drafts",
    newRecord: "New record",
    search: "Search names, regions, producers or wines",
    allTypes: "All record types",
    region: "Region",
    grape: "Grape",
    producer: "Producer",
    wine: "Wine",
    tasting: "Tasting",
    edit: "Prepare change",
    create: "Create record",
    results: "records",
    previous: "Previous",
    next: "Next",
    page: "Page",
    editor: "Structured editor",
    editing: "Editing catalogue record",
    identity: "Identity & publication",
    name: "Published name",
    slug: "Slug",
    language: "Content language",
    status: "Workflow",
    draft: "Draft",
    review: "Ready for review",
    summary: "Card summary",
    description: "Long-form editorial narrative",
    relationships: "Relationships",
    country: "Country",
    parentRegion: "Parent region",
    coordinates: "Coordinates",
    latitude: "Latitude",
    longitude: "Longitude",
    climate: "Climate & season",
    soil: "Geology & soils",
    colour: "Berry colour",
    origin: "Origin",
    leaf: "Leaf description",
    cluster: "Bunch description",
    berry: "Berry description",
    viticulture: "Viticulture & hazards",
    aromaLinks: "Linked aromas",
    regionLinks: "Linked regions",
    website: "Primary website",
    founded: "Founded / historical note",
    philosophy: "Estate point of view",
    cellar: "Cellar approach",
    producerLink: "Producer",
    style: "Style",
    vintage: "Vintage (leave blank if not documented)",
    grapeLinks: "Linked varieties",
    vinification: "Vinification",
    maturation: "Maturation",
    service: "Service & pairing",
    window: "Drinking window",
    bottleImage: "Bottle image",
    bottleImageHelp: "Upload a clean front view. It replaces the illustrated bottle everywhere this wine appears.",
    chooseBottleImage: "Choose image",
    removeBottleImage: "Remove image",
    imagePreparing: "Preparing image…",
    imageError: "The image could not be uploaded.",
    access: "Access",
    date: "Date & time",
    storyline: "Learning storyline",
    sources: "Sources & evidence",
    sourceHelp:
      "One authoritative URL per line. A record cannot enter review without a source.",
    save: "Save draft",
    saved: "Draft saved",
    preview: "Editorial preview",
    delete: "Delete draft",
    empty: "No drafts yet.",
    selectMany: "Search, select and remove relationships without leaving the record.",
    local: "Shared editorial queue",
  },
  de: {
    workspace: "Redaktionelle Einträge",
    title: "Jede öffentliche Aussage formen, bevor sie in den Atlas gelangt",
    body: "Durchsuche den vollständigen Katalog, öffne einen Eintrag und bereite einen belegten Änderungssatz vor. Entwürfe liegen geschützt in der Redaktionswarteschlange; veröffentlichte Einträge werden Teil des öffentlichen Atlas.",
    catalog: "Katalog",
    drafts: "Entwürfe",
    newRecord: "Neuer Eintrag",
    search: "Namen, Regionen, Weingüter oder Weine suchen",
    allTypes: "Alle Eintragstypen",
    region: "Region",
    grape: "Rebsorte",
    producer: "Weingut",
    wine: "Wein",
    tasting: "Verkostung",
    edit: "Änderung vorbereiten",
    create: "Eintrag anlegen",
    results: "Einträge",
    previous: "Zurück",
    next: "Weiter",
    page: "Seite",
    editor: "Strukturierter Editor",
    editing: "Katalogeintrag bearbeiten",
    identity: "Identität & Publikation",
    name: "Veröffentlichter Name",
    slug: "Slug",
    language: "Inhaltssprache",
    status: "Workflow",
    draft: "Entwurf",
    review: "Bereit zur Prüfung",
    summary: "Kurztext für Karten",
    description: "Ausführlicher redaktioneller Text",
    relationships: "Beziehungen",
    country: "Land",
    parentRegion: "Übergeordnete Region",
    coordinates: "Koordinaten",
    latitude: "Breitengrad",
    longitude: "Längengrad",
    climate: "Klima & Saison",
    soil: "Geologie & Böden",
    colour: "Beerenfarbe",
    origin: "Herkunft",
    leaf: "Blattbeschreibung",
    cluster: "Traubenbeschreibung",
    berry: "Beerenbeschreibung",
    viticulture: "Weinbau & Risiken",
    aromaLinks: "Verknüpfte Aromen",
    regionLinks: "Verknüpfte Regionen",
    website: "Primäre Website",
    founded: "Gründung / historischer Hinweis",
    philosophy: "Haltung des Weinguts",
    cellar: "Kelleransatz",
    producerLink: "Weingut",
    style: "Stil",
    vintage: "Jahrgang (leer lassen, wenn nicht belegt)",
    grapeLinks: "Verknüpfte Rebsorten",
    vinification: "Vinifikation",
    maturation: "Ausbau",
    service: "Service & Pairing",
    window: "Trinkfenster",
    bottleImage: "Flaschenbild",
    bottleImageHelp: "Lade eine saubere Frontalansicht hoch. Sie ersetzt die illustrierte Flasche überall, wo dieser Wein erscheint.",
    chooseBottleImage: "Bild wählen",
    removeBottleImage: "Bild entfernen",
    imagePreparing: "Bild wird vorbereitet…",
    imageError: "Das Bild konnte nicht hochgeladen werden.",
    access: "Zugang",
    date: "Datum & Uhrzeit",
    storyline: "Lern-Storyline",
    sources: "Quellen & Evidenz",
    sourceHelp:
      "Eine maßgebliche URL pro Zeile. Ohne Quelle kann kein Eintrag in die Prüfung.",
    save: "Entwurf speichern",
    saved: "Entwurf gespeichert",
    preview: "Redaktionelle Vorschau",
    delete: "Entwurf löschen",
    empty: "Noch keine Entwürfe.",
    selectMany: "Beziehungen suchen, auswählen und direkt wieder entfernen.",
    local: "Gemeinsame Redaktionswarteschlange",
  },
  fr: {
    workspace: "Fiches éditoriales",
    title: "Façonner chaque fait public avant son entrée dans l’atlas",
    body: "Recherchez tout le catalogue, ouvrez une fiche et préparez une modification sourcée. Les brouillons restent dans la file protégée ; les fiches publiées rejoignent l’atlas public.",
    catalog: "Catalogue",
    drafts: "Brouillons",
    newRecord: "Nouvelle fiche",
    search: "Rechercher noms, régions, domaines ou vins",
    allTypes: "Tous les types",
    region: "Région",
    grape: "Cépage",
    producer: "Domaine",
    wine: "Vin",
    tasting: "Dégustation",
    edit: "Préparer la modification",
    create: "Créer la fiche",
    results: "fiches",
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    editor: "Éditeur structuré",
    editing: "Modification d’une fiche",
    identity: "Identité et publication",
    name: "Nom publié",
    slug: "Slug",
    language: "Langue du contenu",
    status: "Flux",
    draft: "Brouillon",
    review: "Prêt pour révision",
    summary: "Résumé de carte",
    description: "Récit éditorial long",
    relationships: "Relations",
    country: "Pays",
    parentRegion: "Région parente",
    coordinates: "Coordonnées",
    latitude: "Latitude",
    longitude: "Longitude",
    climate: "Climat et saison",
    soil: "Géologie et sols",
    colour: "Couleur de la baie",
    origin: "Origine",
    leaf: "Description de la feuille",
    cluster: "Description de la grappe",
    berry: "Description de la baie",
    viticulture: "Viticulture et risques",
    aromaLinks: "Arômes liés",
    regionLinks: "Régions liées",
    website: "Site primaire",
    founded: "Fondation / repère historique",
    philosophy: "Point de vue du domaine",
    cellar: "Approche de cave",
    producerLink: "Domaine",
    style: "Style",
    vintage: "Millésime (vide si non documenté)",
    grapeLinks: "Cépages liés",
    vinification: "Vinification",
    maturation: "Élevage",
    service: "Service et accords",
    window: "Fenêtre de dégustation",
    bottleImage: "Photo de la bouteille",
    bottleImageHelp: "Téléversez une vue frontale nette. Elle remplace la bouteille illustrée partout où ce vin apparaît.",
    chooseBottleImage: "Choisir une image",
    removeBottleImage: "Retirer l’image",
    imagePreparing: "Préparation de l’image…",
    imageError: "L’image n’a pas pu être téléversée.",
    access: "Accès",
    date: "Date et heure",
    storyline: "Parcours pédagogique",
    sources: "Sources et preuves",
    sourceHelp:
      "Une URL faisant autorité par ligne. Une source est requise pour la révision.",
    save: "Enregistrer le brouillon",
    saved: "Brouillon enregistré",
    preview: "Aperçu éditorial",
    delete: "Supprimer",
    empty: "Aucun brouillon.",
    selectMany: "Recherchez, sélectionnez et retirez les relations directement.",
    local: "File éditoriale partagée",
  },
  es: {
    workspace: "Registros editoriales",
    title: "Dar forma a cada dato público antes de que llegue al atlas",
    body: "Busca en todo el catálogo, abre un registro y prepara un cambio con fuentes. Los borradores quedan en la cola protegida; los registros publicados pasan al atlas público.",
    catalog: "Catálogo",
    drafts: "Borradores",
    newRecord: "Nuevo registro",
    search: "Buscar nombres, regiones, bodegas o vinos",
    allTypes: "Todos los tipos",
    region: "Región",
    grape: "Variedad",
    producer: "Bodega",
    wine: "Vino",
    tasting: "Cata",
    edit: "Preparar cambio",
    create: "Crear registro",
    results: "registros",
    previous: "Anterior",
    next: "Siguiente",
    page: "Página",
    editor: "Editor estructurado",
    editing: "Editando registro del catálogo",
    identity: "Identidad y publicación",
    name: "Nombre publicado",
    slug: "Slug",
    language: "Idioma del contenido",
    status: "Flujo",
    draft: "Borrador",
    review: "Listo para revisión",
    summary: "Resumen de tarjeta",
    description: "Narrativa editorial larga",
    relationships: "Relaciones",
    country: "País",
    parentRegion: "Región superior",
    coordinates: "Coordenadas",
    latitude: "Latitud",
    longitude: "Longitud",
    climate: "Clima y temporada",
    soil: "Geología y suelos",
    colour: "Color de baya",
    origin: "Origen",
    leaf: "Descripción de hoja",
    cluster: "Descripción de racimo",
    berry: "Descripción de baya",
    viticulture: "Viticultura y riesgos",
    aromaLinks: "Aromas enlazados",
    regionLinks: "Regiones enlazadas",
    website: "Web primaria",
    founded: "Fundación / nota histórica",
    philosophy: "Punto de vista de la bodega",
    cellar: "Enfoque de bodega",
    producerLink: "Bodega",
    style: "Estilo",
    vintage: "Añada (vacío si no está documentada)",
    grapeLinks: "Variedades enlazadas",
    vinification: "Vinificación",
    maturation: "Crianza",
    service: "Servicio y maridaje",
    window: "Ventana de consumo",
    bottleImage: "Imagen de la botella",
    bottleImageHelp: "Sube una vista frontal limpia. Sustituirá la botella ilustrada en todas las apariciones de este vino.",
    chooseBottleImage: "Elegir imagen",
    removeBottleImage: "Eliminar imagen",
    imagePreparing: "Preparando imagen…",
    imageError: "No se pudo subir la imagen.",
    access: "Acceso",
    date: "Fecha y hora",
    storyline: "Itinerario de aprendizaje",
    sources: "Fuentes y evidencia",
    sourceHelp:
      "Una URL autorizada por línea. Hace falta una fuente para revisión.",
    save: "Guardar borrador",
    saved: "Borrador guardado",
    preview: "Vista editorial",
    delete: "Eliminar borrador",
    empty: "Todavía no hay borradores.",
    selectMany: "Busca, selecciona y elimina relaciones directamente.",
    local: "Cola editorial compartida",
  },
} as const;

const backendCopy:Record<Locale,{body:string;local:string;published:string}>={
  en:{body:'Search the full catalogue, open a record and prepare a sourced change set. Drafts are saved to the protected editorial queue; published records become part of the public atlas.',local:'Shared editorial queue',published:'Published in atlas'},
  de:{body:'Durchsuche den vollständigen Katalog, öffne einen Eintrag und bereite einen belegten Änderungssatz vor. Entwürfe liegen geschützt in der Redaktionswarteschlange; veröffentlichte Einträge werden Teil des öffentlichen Atlas.',local:'Gemeinsame Redaktionswarteschlange',published:'Im Atlas veröffentlicht'},
  fr:{body:'Recherchez tout le catalogue, ouvrez une fiche et préparez une modification sourcée. Les brouillons restent dans la file protégée ; les fiches publiées rejoignent l’atlas public.',local:'File éditoriale partagée',published:'Publié dans l’atlas'},
  es:{body:'Busca en todo el catálogo, abre un registro y prepara un cambio con fuentes. Los borradores quedan en la cola protegida; los registros publicados pasan al atlas público.',local:'Cola editorial compartida',published:'Publicado en el atlas'},
}

const editorOptions: Record<Locale, Record<string, string>> = {
  en: {
    white: "White",
    red: "Red",
    rose: "Rosé",
    sparkling: "Sparkling",
    sweet: "Sweet",
    fortified: "Fortified",
    private: "Private",
    invite: "Invite only",
    open: "Open",
  },
  de: {
    white: "Weiß",
    red: "Rot",
    rose: "Rosé",
    sparkling: "Schaumwein",
    sweet: "Süßwein",
    fortified: "Verstärkt",
    private: "Privat",
    invite: "Nur mit Einladung",
    open: "Offen",
  },
  fr: {
    white: "Blanc",
    red: "Rouge",
    rose: "Rosé",
    sparkling: "Effervescent",
    sweet: "Moelleux",
    fortified: "Muté",
    private: "Privé",
    invite: "Sur invitation",
    open: "Ouvert",
  },
  es: {
    white: "Blanco",
    red: "Tinto",
    rose: "Rosado",
    sparkling: "Espumoso",
    sweet: "Dulce",
    fortified: "Fortificado",
    private: "Privado",
    invite: "Solo con invitación",
    open: "Abierto",
  },
};
const noResultsCopy:Record<Locale,{title:string;clear:string}>={
  en:{title:'No catalogue records match these filters.',clear:'Clear search and type'},
  de:{title:'Keine Katalogeinträge passen zu diesen Filtern.',clear:'Suche und Typ zurücksetzen'},
  fr:{title:'Aucune fiche du catalogue ne correspond à ces filtres.',clear:'Effacer la recherche et le type'},
  es:{title:'Ningún registro del catálogo coincide con estos filtros.',clear:'Borrar búsqueda y tipo'},
}

const blankFields = () => ({
  country: "",
  parentRegionId: "",
  lat: "",
  lng: "",
  climate: "",
  soil: "",
  colour: "",
  origin: "",
  leaf: "",
  cluster: "",
  berry: "",
  viticulture: "",
  aromaIds: [] as string[],
  regionIds: [] as string[],
  regionId: "",
  website: "https://",
  founded: "",
  philosophy: "",
  cellar: "",
  producerId: "",
  style: "red",
  vintage: "",
  grapeIds: [] as string[],
  vinification: "",
  maturation: "",
  service: "",
  window: "",
  access: "private",
  startsAt: "",
  storyline: "",
});

function fieldValue(fields: Record<string, string | string[]>, key: string) {
  const value = fields[key];
  return Array.isArray(value) ? "" : (value ?? "");
}
function arrayValue(fields: Record<string, string | string[]>, key: string) {
  const value = fields[key];
  return Array.isArray(value) ? value : [];
}

function loadEditorialDrafts(): EditorialDraft[] {
  const allowed: RecordType[] = ["region", "grape", "producer", "wine"];
  return repository.additions.all().flatMap((entry) => {
    const candidate = String(entry.recordType ?? entry.type ?? "").toLowerCase() as RecordType;
    if (!allowed.includes(candidate)) return [];
    if (entry.recordType && entry.fields) return [entry as unknown as EditorialDraft];
    const now = String(entry.createdAt ?? new Date().toISOString());
    const name = String(entry.name ?? "");
    return [{
      id: String(entry.id ?? crypto.randomUUID()),
      recordType: candidate,
      name,
      slug: slugify(name),
      status: "draft",
      locale: "en",
      summary: "",
      description: "",
      sourceUrls: [],
      fields: blankFields(),
      createdAt: now,
      updatedAt: now,
    }];
  });
}

export function EditorialStudio() {
  const { locale } = useLocale();
  const c = { ...copy[locale], ...backendCopy[locale] };
  const noResults=noResultsCopy[locale]
  const optionCopy = editorOptions[locale];
  const selectionCopy={en:{search:'Search relationships',empty:'No matching record',selected:'selected'},de:{search:'Beziehungen durchsuchen',empty:'Kein passender Datensatz',selected:'ausgewählt'},fr:{search:'Rechercher les relations',empty:'Aucune fiche correspondante',selected:'sélectionnés'},es:{search:'Buscar relaciones',empty:'No hay registros coincidentes',selected:'seleccionados'}}[locale]
  const [drafts, setDrafts] = useState<EditorialDraft[]>(
    loadEditorialDrafts,
  );
  const [view, setView] = useState<"catalog" | "drafts" | "editor">("catalog");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<RecordType | "all">("all");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState(false);
  const [wineMediaBusy,setWineMediaBusy]=useState(false);
  const [wineMediaError,setWineMediaError]=useState("");
  const [draft, setDraft] = useState<EditorialDraft>(() => ({
    id: crypto.randomUUID(),
    recordType: "region",
    name: "",
    slug: "",
    status: "draft",
    locale,
    summary: "",
    description: "",
    sourceUrls: [],
    fields: blankFields(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  const catalog = useMemo<CatalogRow[]>(
    () => [
      ...regions.map((item) => ({
        id: item.id,
        type: "region" as const,
        name: item.name,
        meta: item.country,
      })),
      ...grapes.map((item) => ({
        id: item.id,
        type: "grape" as const,
        name: item.name,
        meta: item.origin,
      })),
      ...producers.map((item) => ({
        id: item.id,
        type: "producer" as const,
        name: item.name,
        meta: regions.find((region) => region.id === item.regionId)?.name ?? "",
      })),
      ...wines.map((item) => ({
        id: item.id,
        type: "wine" as const,
        name: item.name,
        meta:
          producers.find((producer) => producer.id === item.producerId)?.name ??
          "",
      })),
    ],
    [],
  );
  const results = useMemo(
    () =>
      catalog.filter(
        (item) =>
          (filter === "all" || item.type === filter) &&
          `${item.name} ${item.meta}`
            .toLocaleLowerCase(locale)
            .includes(query.toLocaleLowerCase(locale)),
      ),
    [catalog, filter, query, locale],
  );
  const pageSize = 12,
    pages = Math.max(1, Math.ceil(results.length / pageSize)),
    visible = results.slice((page - 1) * pageSize, page * pageSize);
  const persist = (next: EditorialDraft[]) => {
    setDrafts(next);
    repository.additions.save(next as unknown as Record<string, unknown>[]);
    applyCatalogAdditions(next);
  };
  const updateField = (key: string, value: string | string[]) =>
    setDraft((current) => ({
      ...current,
      fields: { ...current.fields, [key]: value },
    }));
  const startNew = (type: RecordType = "region") => {
    setDraft({
      id: crypto.randomUUID(),
      recordType: type,
      name: "",
      slug: "",
      status: "draft",
      locale,
      summary: "",
      description: "",
      sourceUrls: [],
      fields: blankFields(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSaved(false);
    setView("editor");
  };
  const editCatalog = (row: CatalogRow) => {
    const baseFields = blankFields();
    let summary = "";
    let description = "";
    let sourceUrls: string[] = [];
    if (row.type === "region") {
      const item = regions.find((value) => value.id === row.id);
      summary = item?.summary ?? "";
      description = [item?.history, item?.growingSeason, item?.viticulture]
        .filter(Boolean)
        .join("\n\n");
      sourceUrls = item?.sources?.map((source) => source.url) ??
        (item?.sourceUrl ? [item.sourceUrl] : []);
      Object.assign(baseFields, {
        country: item?.country ?? "",
        lat: String(item?.lat ?? ""),
        lng: String(item?.lng ?? ""),
        climate: item?.climate ?? "",
        soil: item?.soil ?? "",
      });
    }
    if (row.type === "grape") {
      const item = grapes.find((value) => value.id === row.id);
      summary = item?.summary ?? "";
      description = [item?.ripening, item?.climateFit, item?.winemaking]
        .filter(Boolean)
        .join("\n\n");
      Object.assign(baseFields, {
        colour: item?.color ?? "",
        origin: item?.origin ?? "",
        viticulture: item?.viticulture ?? "",
        aromaIds: item?.aromaIds ?? [],
        regionIds: item?.regionIds ?? [],
      });
    }
    if (row.type === "producer") {
      const item = producers.find((value) => value.id === row.id);
      summary = item?.summary ?? "";
      description = [item?.philosophy, item?.vineyard, item?.cellar]
        .filter(Boolean)
        .join("\n\n");
      sourceUrls = item?.sourceUrl ? [item.sourceUrl] : [];
      const producerGrapes = [
        ...new Set(
          wines
            .filter((wine) => wine.producerId === row.id)
            .flatMap((wine) => wine.grapeIds),
        ),
      ];
      Object.assign(baseFields, {
        regionId: item?.regionId ?? "",
        website: item?.sourceUrl ?? "https://",
        philosophy: item?.philosophy ?? "",
        viticulture: item?.vineyard ?? "",
        cellar: item?.cellar ?? "",
        grapeIds: producerGrapes,
      });
    }
    if (row.type === "wine") {
      const item = wines.find((value) => value.id === row.id);
      summary = item?.summary ?? "";
      description = item?.composition ?? "";
      sourceUrls = item?.sourceUrl ? [item.sourceUrl] : [];
      Object.assign(baseFields, {
        regionId: item?.regionId ?? "",
        producerId: item?.producerId ?? "",
        style: item?.style ?? "red",
        vintage: String(item?.vintage ?? ""),
        grapeIds: item?.grapeIds ?? [],
        aromaIds: item?.aromaIds ?? [],
        vinification: item?.vinification ?? "",
        maturation: item?.maturation ?? "",
        service: [item?.serving, ...(item?.pairings ?? [])]
          .filter(Boolean)
          .join(" · "),
        window: item?.drinkWindow ?? "",
      });
    }
    setDraft({
      id: crypto.randomUUID(),
      baseId: row.id,
      recordType: row.type,
      name: row.name,
      slug: row.id,
      status: "draft",
      locale,
      summary,
      description,
      sourceUrls,
      fields: baseFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSaved(false);
    setView("editor");
  };
  const editDraft = (item: EditorialDraft) => {
    setDraft(item);
    setSaved(false);
    setView("editor");
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = {
      ...draft,
      slug: draft.slug || slugify(draft.name),
      updatedAt: new Date().toISOString(),
    };
    persist([...drafts.filter((item) => item.id !== next.id), next]);
    setDraft(next);
    setSaved(true);
  };
  const chooseWineImage=async(file?:File)=>{
    if(!file)return
    const entityId=draft.baseId||draft.slug||slugify(draft.name)
    if(!entityId){setWineMediaError(c.imageError);return}
    setWineMediaBusy(true);setWineMediaError("")
    try{
      const prepared=await prepareImage(file)
      const uploaded=await uploadWineImage(prepared,entityId)
      const previous=fieldValue(draft.fields,"mediaAssetId")
      setDraft(current=>({...current,fields:{...current.fields,imageUrl:uploaded.url,mediaAssetId:uploaded.assetId}}))
      if(previous)void deleteWineImage(previous).catch(()=>{})
    }catch{setWineMediaError(c.imageError)}finally{setWineMediaBusy(false)}
  }
  const removeWineImage=()=>{
    const assetId=fieldValue(draft.fields,"mediaAssetId")
    setDraft(current=>({...current,fields:{...current.fields,imageUrl:"",mediaAssetId:""}}))
    if(assetId)void deleteWineImage(assetId).catch(()=>{})
  }
  return (
    <section className="editorial-studio">
      <header className="editorial-studio-header">
        <div>
          <span className="eyebrow">{c.workspace}</span>
          <h2>{c.title}</h2>
          <p>{c.body}</p>
        </div>
        <div className="editorial-tabs">
          <button
            className={view === "catalog" ? "active" : ""}
            onClick={() => setView("catalog")}
          >
            <Search />
            {c.catalog}
          </button>
          <button
            className={view === "drafts" ? "active" : ""}
            onClick={() => setView("drafts")}
          >
            <FileClock />
            {c.drafts}
            <b>{drafts.length}</b>
          </button>
          <button
            className={view === "editor" ? "active" : ""}
            onClick={() => startNew()}
          >
            <Plus />
            {c.newRecord}
          </button>
        </div>
      </header>
      {view === "catalog" && (
        <div className="editorial-catalog">
          <div className="editorial-catalog-tools">
            <label>
              <Search />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder={c.search}
              />
            </label>
            <label>
              <Filter />
              <select
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value as RecordType | "all");
                  setPage(1);
                }}
              >
                <option value="all">{c.allTypes}</option>
                {(["region", "grape", "producer", "wine"] as const).map(
                  (value) => (
                    <option value={value} key={value}>
                      {c[value]}
                    </option>
                  ),
                )}
              </select>
            </label>
            <span>
              {results.length} {c.results}
            </span>
          </div>
          <div className="editorial-record-table">
            {results.length===0?<div className="editorial-empty" role="status"><Search/><h3>{noResults.title}</h3><button type="button" onClick={()=>{setQuery('');setFilter('all');setPage(1)}}><Filter/>{noResults.clear}</button></div>:visible.map((row) => (
              <article key={`${row.type}-${row.id}`}>
                <span className={`record-type type-${row.type}`}>
                  {c[row.type]}
                </span>
                <div>
                  <strong>{row.name}</strong>
                  <small>{row.meta}</small>
                </div>
                <button onClick={() => editCatalog(row)}>
                  <PencilLine />
                  {c.edit}
                </button>
              </article>
            ))}
          </div>
          {results.length>pageSize&&<nav className="editorial-pagination" aria-label={c.page}>
            <button
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              <ChevronLeft />
              {c.previous}
            </button>
            <span>
              {c.page} {page} / {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => setPage((value) => value + 1)}
            >
              {c.next}
              <ChevronRight />
            </button>
          </nav>}
        </div>
      )}
      {view === "drafts" && (
        <div className="editorial-drafts">
          {drafts.length ? (
            drafts
              .slice()
              .reverse()
              .map((item) => (
                <article key={item.id}>
                  <span className={`record-type type-${item.recordType}`}>
                    {c[item.recordType]}
                  </span>
                  <div>
                    <strong>{item.name || c.newRecord}</strong>
                    <small>
                      {item.status === "review" ? c.review : c.draft} ·{" "}
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                      }).format(new Date(item.updatedAt))}
                    </small>
                  </div>
                  <button onClick={() => editDraft(item)}>
                    <PencilLine />
                    {c.edit}
                  </button>
                  <button
                    className="delete"
                    aria-label={c.delete}
                    onClick={() =>
                      persist(drafts.filter((value) => value.id !== item.id))
                    }
                  >
                    <Trash2 />
                  </button>
                </article>
              ))
          ) : (
            <div className="editorial-empty">
              <FileClock />
              <h3>{c.empty}</h3>
              <button onClick={() => startNew()}>
                <Plus />
                {c.newRecord}
              </button>
            </div>
          )}
        </div>
      )}
      {view === "editor" && (
        <form className="editorial-form" onSubmit={submit}>
          <div className="editorial-form-main">
            <header>
              <div>
                <span className="eyebrow">
                  {draft.baseId ? c.editing : c.create}
                </span>
                <h3>{draft.name || c.newRecord}</h3>
              </div>
              <select
                value={draft.recordType}
                disabled={Boolean(draft.baseId)}
                onChange={(event) => startNew(event.target.value as RecordType)}
              >
                {(
                  ["region", "grape", "producer", "wine"] as const
                ).map((value) => (
                  <option value={value} key={value}>
                    {c[value]}
                  </option>
                ))}
              </select>
            </header>
            <fieldset>
              <legend>{c.identity}</legend>
              <div className="editorial-field-grid">
                <label>
                  {c.name}
                  <input
                    required
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        name: event.target.value,
                        slug: value.baseId
                          ? value.slug
                          : slugify(event.target.value),
                      }))
                    }
                  />
                </label>
                <label>
                  {c.slug}
                  <input
                    required
                    value={draft.slug}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        slug: event.target.value,
                      }))
                    }
                  />
                </label>
                <label>
                  {c.language}
                  <select
                    value={draft.locale}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        locale: event.target.value as Locale,
                      }))
                    }
                  >
                    {(["en", "de", "fr", "es"] as const).map((value) => (
                      <option key={value}>{value.toUpperCase()}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {c.status}
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        status: event.target.value as EditorialDraft["status"],
                      }))
                    }
                  >
                    <option value="draft">{c.draft}</option>
                    <option value="review" disabled={!draft.sourceUrls.length}>
                      {c.review}
                    </option>
                    <option value="published" disabled={!draft.sourceUrls.length}>
                      {c.published}
                    </option>
                  </select>
                </label>
                <label className="wide">
                  {c.summary}
                  <textarea
                    required
                    value={draft.summary}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        summary: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className="wide">
                  {c.description}
                  <textarea
                    className="long-copy"
                    required
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((value) => ({
                        ...value,
                        description: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
            </fieldset>
            <fieldset>
              <legend>{c.relationships}</legend>
              <div className="editorial-field-grid">
                {draft.recordType === "region" && (
                  <>
                    <label>
                      {c.country}
                      <input
                        value={fieldValue(draft.fields, "country")}
                        onChange={(event) =>
                          updateField("country", event.target.value)
                        }
                      />
                    </label>
                    <SearchableSelect label={c.parentRegion} value={fieldValue(draft.fields,"parentRegionId")} onChange={value=>updateField("parentRegionId",value)} options={regions.map(item=>({value:item.id,label:item.name,keywords:item.country}))} searchPlaceholder={selectionCopy.search} emptyText={selectionCopy.empty}/>
                    <label>
                      {c.latitude}
                      <input
                        type="number"
                        step="0.0001"
                        value={fieldValue(draft.fields, "lat")}
                        onChange={(event) =>
                          updateField("lat", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      {c.longitude}
                      <input
                        type="number"
                        step="0.0001"
                        value={fieldValue(draft.fields, "lng")}
                        onChange={(event) =>
                          updateField("lng", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.climate}
                      <textarea
                        value={fieldValue(draft.fields, "climate")}
                        onChange={(event) =>
                          updateField("climate", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.soil}
                      <textarea
                        value={fieldValue(draft.fields, "soil")}
                        onChange={(event) =>
                          updateField("soil", event.target.value)
                        }
                      />
                    </label>
                  </>
                )}
                {draft.recordType === "grape" && (
                  <>
                    <label>
                      {c.colour}
                      <select
                        value={fieldValue(draft.fields, "colour")}
                        onChange={(event) =>
                          updateField("colour", event.target.value)
                        }
                      >
                        <option value="white">{optionCopy.white}</option>
                        <option value="red">{optionCopy.red}</option>
                      </select>
                    </label>
                    <label>
                      {c.origin}
                      <input
                        value={fieldValue(draft.fields, "origin")}
                        onChange={(event) =>
                          updateField("origin", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.leaf}
                      <textarea
                        value={fieldValue(draft.fields, "leaf")}
                        onChange={(event) =>
                          updateField("leaf", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.cluster}
                      <textarea
                        value={fieldValue(draft.fields, "cluster")}
                        onChange={(event) =>
                          updateField("cluster", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.berry}
                      <textarea
                        value={fieldValue(draft.fields, "berry")}
                        onChange={(event) =>
                          updateField("berry", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.viticulture}
                      <textarea
                        value={fieldValue(draft.fields, "viticulture")}
                        onChange={(event) =>
                          updateField("viticulture", event.target.value)
                        }
                      />
                    </label>
                    <Multi
                      label={c.aromaLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "aromaIds")}
                      onChange={(values) => updateField("aromaIds", values)}
                      options={aromas}
                    />
                    <Multi
                      label={c.regionLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "regionIds")}
                      onChange={(values) => updateField("regionIds", values)}
                      options={regions}
                    />
                  </>
                )}
                {draft.recordType === "producer" && (
                  <>
                    <SearchableSelect label={c.region} value={fieldValue(draft.fields,"regionId")} onChange={value=>updateField("regionId",value)} options={regions.map(item=>({value:item.id,label:item.name,keywords:item.country}))} searchPlaceholder={selectionCopy.search} emptyText={selectionCopy.empty}/>
                    <label>
                      {c.website}
                      <input
                        type="url"
                        value={fieldValue(draft.fields, "website")}
                        onChange={(event) =>
                          updateField("website", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      {c.founded}
                      <input
                        value={fieldValue(draft.fields, "founded")}
                        onChange={(event) =>
                          updateField("founded", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.philosophy}
                      <textarea
                        value={fieldValue(draft.fields, "philosophy")}
                        onChange={(event) =>
                          updateField("philosophy", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.viticulture}
                      <textarea
                        value={fieldValue(draft.fields, "viticulture")}
                        onChange={(event) =>
                          updateField("viticulture", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.cellar}
                      <textarea
                        value={fieldValue(draft.fields, "cellar")}
                        onChange={(event) =>
                          updateField("cellar", event.target.value)
                        }
                      />
                    </label>
                    <Multi
                      label={c.grapeLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "grapeIds")}
                      onChange={(values) => updateField("grapeIds", values)}
                      options={grapes}
                    />
                  </>
                )}
                {draft.recordType === "wine" && (
                  <>
                    <div className="editorial-wine-media wide">
                      <div>
                        <ImagePlus/>
                        <span><strong>{c.bottleImage}</strong><small>{c.bottleImageHelp}</small></span>
                      </div>
                      {fieldValue(draft.fields,"imageUrl")&&<img src={fieldValue(draft.fields,"imageUrl")} alt=""/>}
                      <label className="secondary-button">
                        <input type="file" accept="image/*" onChange={event=>void chooseWineImage(event.target.files?.[0])}/>
                        <ImagePlus/>{wineMediaBusy?c.imagePreparing:c.chooseBottleImage}
                      </label>
                      {fieldValue(draft.fields,"imageUrl")&&<button type="button" className="text-button" onClick={removeWineImage}><Trash2/>{c.removeBottleImage}</button>}
                      {wineMediaError&&<p role="alert">{wineMediaError}</p>}
                    </div>
                    <SearchableSelect label={c.producerLink} value={fieldValue(draft.fields,"producerId")} onChange={value=>updateField("producerId",value)} options={producers.map(item=>({value:item.id,label:item.name,keywords:regions.find(region=>region.id===item.regionId)?.name}))} searchPlaceholder={selectionCopy.search} emptyText={selectionCopy.empty}/>
                    <SearchableSelect label={c.region} value={fieldValue(draft.fields,"regionId")} onChange={value=>updateField("regionId",value)} options={regions.map(item=>({value:item.id,label:item.name,keywords:item.country}))} searchPlaceholder={selectionCopy.search} emptyText={selectionCopy.empty}/>
                    <label>
                      {c.style}
                      <select
                        value={fieldValue(draft.fields, "style")}
                        onChange={(event) =>
                          updateField("style", event.target.value)
                        }
                      >
                        {[
                          "red",
                          "white",
                          "rose",
                          "sparkling",
                          "sweet",
                          "fortified",
                        ].map((item) => (
                          <option value={item} key={item}>
                            {optionCopy[item]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {c.vintage}
                      <input
                        type="number"
                        min="1800"
                        max="2200"
                        value={fieldValue(draft.fields, "vintage")}
                        onChange={(event) =>
                          updateField("vintage", event.target.value)
                        }
                      />
                    </label>
                    <Multi
                      label={c.grapeLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "grapeIds")}
                      onChange={(values) => updateField("grapeIds", values)}
                      options={grapes}
                    />
                    <Multi
                      label={c.aromaLinks}
                      help={c.selectMany}
                      value={arrayValue(draft.fields, "aromaIds")}
                      onChange={(values) => updateField("aromaIds", values)}
                      options={aromas}
                    />
                    <label className="wide">
                      {c.vinification}
                      <textarea
                        value={fieldValue(draft.fields, "vinification")}
                        onChange={(event) =>
                          updateField("vinification", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.maturation}
                      <textarea
                        value={fieldValue(draft.fields, "maturation")}
                        onChange={(event) =>
                          updateField("maturation", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.service}
                      <textarea
                        value={fieldValue(draft.fields, "service")}
                        onChange={(event) =>
                          updateField("service", event.target.value)
                        }
                      />
                    </label>
                    <label className="wide">
                      {c.window}
                      <input
                        value={fieldValue(draft.fields, "window")}
                        onChange={(event) =>
                          updateField("window", event.target.value)
                        }
                      />
                    </label>
                  </>
                )}
              </div>
            </fieldset>
            <fieldset>
              <legend>{c.sources}</legend>
              <label className="editorial-sources">
                <Link2 />
                <textarea
                  required={draft.status === "review"}
                  value={draft.sourceUrls.join("\n")}
                  onChange={(event) =>
                    setDraft((value) => ({
                      ...value,
                      sourceUrls: event.target.value
                        .split("\n")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    }))
                  }
                />
                <small>{c.sourceHelp}</small>
              </label>
            </fieldset>
            <footer>
              <span>
                {saved && (
                  <>
                    <Check />
                    {c.saved}
                  </>
                )}
              </span>
              <button className="primary-button">
                <Save />
                {c.save}
              </button>
            </footer>
          </div>
          <aside className="editorial-preview">
            <span className="eyebrow">{c.preview}</span>
            <div className={`preview-orbit type-${draft.recordType}`}>
              <Wine />
            </div>
            <small>
              {c[draft.recordType]} · {draft.locale.toUpperCase()}
            </small>
            <h3>{draft.name || c.newRecord}</h3>
            <p>{draft.summary || c.summary}</p>
            <dl>
              <div>
                <dt>{c.status}</dt>
                <dd>{draft.status === "review" ? c.review : c.draft}</dd>
              </div>
              <div>
                <dt>{c.sources}</dt>
                <dd>{draft.sourceUrls.length}</dd>
              </div>
              <div>
                <dt>Slug</dt>
                <dd>{draft.slug || "—"}</dd>
              </div>
            </dl>
            <span className="local-badge">
              <MapPin />
              {c.local}
            </span>
          </aside>
        </form>
      )}
    </section>
  );
}

function Multi({
  label,
  help,
  value,
  onChange,
  options,
}: {
  label: string;
  help: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { id: string; name: string }[];
}) {
  const {locale}=useLocale()
  const search={en:'Search and select',de:'Suchen und auswählen',fr:'Rechercher et sélectionner',es:'Buscar y seleccionar'}[locale]
  const empty={en:'No matching record',de:'Kein passender Datensatz',fr:'Aucune fiche correspondante',es:'No hay registros coincidentes'}[locale]
  const selected={en:'selected',de:'ausgewählt',fr:'sélectionnés',es:'seleccionados'}[locale]
  return <SearchableMultiSelect className="wide" label={label} help={help} value={value} onChange={onChange} options={options.map(item=>({value:item.id,label:item.name}))} searchPlaceholder={search} emptyText={empty} selectedText={selected}/>;
}
