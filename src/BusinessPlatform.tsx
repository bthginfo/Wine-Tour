import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  ExternalLink,
  Globe2,
  Layers3,
  Link2,
  MapPin,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Ticket,
  Trash2,
  Users,
  Wine,
  X,
} from "lucide-react";
import {
  demoApprovals,
  demoEvents,
  demoFeeConfiguration,
  demoMemberships,
  demoOffers,
  demoPartnerProfiles,
  demoPlacements,
  demoWinerySections,
  demoWorkspaces,
} from "./data/business";
import { producers, regions, wines } from "./data/catalog";
import { repository } from "./data/repository";
import { useLocale } from "./i18n";
import { useAuth } from "./auth";
import { useUiCopy } from "./uiCopy";
import type {
  ApprovalRecord,
  BusinessWorkspace,
  EventModality,
  EventVisibility,
  MerchantOffer,
  PartnerProfile,
  PlatformFeeConfiguration,
  PromotionalPlacement,
  PublishState,
  TastingEvent,
  WineryPageSection,
} from "./types";
import vineyardHero from "./assets/vineyard-terraces.jpg";
import tastingStill from "./assets/tasting-still-life.jpg";

type Ui = ReturnType<typeof useUiCopy>;

const money = (minor: number, currency: string, locale: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    minor / 100,
  );
const dateTime = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
const eventCopy = (event: TastingEvent, ui: Ui) =>
  event.id === "riesling-latitude-light"
    ? { title: ui.eventOneTitle, summary: ui.eventOneSummary }
    : event.id === "marlborough-beyond-citrus"
      ? { title: ui.eventTwoTitle, summary: ui.eventTwoSummary }
      : event.id === "pinot-place-table"
        ? { title: ui.eventThreeTitle, summary: ui.eventThreeSummary }
        : event.id === "private-cellar-circle"
          ? { title: ui.eventPrivateTitle, summary: ui.eventPrivateSummary }
          : { title: event.title, summary: event.summary };
const profileCopy = (profile: PartnerProfile, ui: Ui) =>
  profile.kind === "host"
    ? { tagline: ui.hostTagline, story: ui.hostStory }
    : profile.kind === "winery"
      ? { tagline: ui.wineryTagline, story: ui.wineryStory }
      : { tagline: ui.merchantTagline, story: ui.merchantStory };
const modalityLabel = (value: EventModality, ui: Ui) =>
  value === "online"
    ? ui.online
    : value === "in-person"
      ? ui.inPerson
      : ui.hybrid;
const statusLabel = (value: string, ui: Ui) =>
  value === "verified"
    ? ui.verified
    : value === "pending"
      ? ui.verificationPending
      : value === "published"
        ? ui.published
        : value === "paused"
          ? ui.paused
          : value === "approved"
            ? ui.approved
            : value === "rejected"
              ? ui.rejected
              : value === "enabled"
                ? ui.enabled
                : value === "disabled"
                  ? ui.disabled
                  : value === "unverified"
                    ? ui.unverified
                    : ui.draft;
const roleLabel = (value: string, ui: Ui) =>
  value === "host"
    ? ui.professionalHost
    : value === "winery"
      ? ui.winery
      : value === "merchant"
        ? ui.merchant
        : value === "admin"
          ? ui.adminRole
          : ui.privateMember;
const visibilityLabel = (value: EventVisibility, ui: Ui) =>
  value === "public"
    ? ui.publicLabel
    : value === "unlisted"
      ? ui.unlisted
      : ui.privateLabel;
const planLabel = (value: BusinessWorkspace["plan"], ui: Ui) =>
  value === "member"
    ? ui.privateMember
    : value === "studio"
      ? ui.studioNav
      : value === "partner"
        ? ui.partnerProfile
        : ui.configurable;
const checklistLabel = (value: string, ui: Ui) =>
  value === "profile"
    ? ui.publicProfile
    : value === "cellar"
      ? ui.cellarLabel
      : value === "private-tasting"
        ? `${ui.privateLabel} · ${ui.eventsNav}`
        : value === "event"
          ? ui.createEvent
          : value === "storyline"
            ? ui.storyline
            : value === "payouts"
              ? ui.secureInfrastructure
              : value === "claim"
                ? ui.verification
                : value === "story"
                  ? ui.storySection
                  : value === "wines"
                    ? ui.winesSection
                    : value === "verification"
                      ? ui.verification
                      : value === "markets"
                        ? ui.market
                        : value === "offer"
                          ? ui.addOffer
                          : value === "relations"
                            ? ui.reviewRelations
                            : value === "approvals"
                              ? ui.approvalQueue
                              : ui.placementTitle;
const approvalKindLabel = (value: string, ui: Ui) =>
  value === "role-application"
    ? ui.role
    : value === "winery-claim"
      ? ui.winery
      : value === "wine-change"
        ? ui.wine
        : value === "public-event"
          ? ui.eventsNav
          : value === "offer"
            ? ui.offersTitle
            : ui.reviewRelations;
const sectionTypeLabel = (value: WineryPageSection["type"], ui: Ui) =>
  ({
    hero: ui.heroSection,
    story: ui.storySection,
    vineyards: ui.vineyardsSection,
    cellar: ui.cellarSection,
    visits: ui.visitsSection,
    team: ui.teamSection,
    gallery: ui.gallerySection,
    wines: ui.winesSection,
    contact: ui.contactSection,
  })[value];
const sectionSeedCopy = (
  section: WineryPageSection,
  locale: "en" | "de" | "fr" | "es",
) => {
  const localized = section.translations?.[locale];
  if (localized) return localized;
  const seed: Record<
    typeof locale,
    Record<string, { heading: string; body: string }>
  > = {
    en: {
      "section-hero": { heading: "Marlborough, read from the estate", body: "An estate introduction to place, farming and the wines, kept distinct from the atlas editorial record." },
      "section-story": { heading: "Our story", body: "The people, milestones and decisions the estate chooses to place in its own voice." },
      "section-vineyards": { heading: "Vineyards", body: "Blocks, soils, exposures, farming decisions and seasonal work behind the fruit." },
      "section-cellar": { heading: "Cellar philosophy", body: "Fermentation, vessels, blending and maturation explained as deliberate production choices." },
      "section-wines": { heading: "Wines", body: "Estate bottlings connected to reviewed varieties, regions and factual atlas relationships." },
      "section-visits": { heading: "Visit", body: "Opening details, available experiences, accessibility and a direct enquiry route." },
    },
    de: {
      "section-hero": { heading: "Marlborough aus Sicht des Weinguts", body: "Ein Einstieg in Ort, Weinbau und Weine – klar getrennt vom redaktionellen Atlas-Eintrag." },
      "section-story": { heading: "Unsere Geschichte", body: "Menschen, Meilensteine und Entscheidungen in der eigenen Stimme des Weinguts." },
      "section-vineyards": { heading: "Weinberge", body: "Parzellen, Böden, Expositionen, Bewirtschaftung und die saisonale Arbeit hinter den Trauben." },
      "section-cellar": { heading: "Kellerphilosophie", body: "Gärung, Gebinde, Assemblage und Ausbau als bewusst erklärte Produktionsentscheidungen." },
      "section-wines": { heading: "Weine", body: "Weine des Guts, verbunden mit geprüften Rebsorten, Regionen und Atlas-Beziehungen." },
      "section-visits": { heading: "Besuch", body: "Öffnungszeiten, Erlebnisse, Barrierefreiheit und ein direkter Anfrageweg." },
    },
    fr: {
      "section-hero": { heading: "Marlborough vu par le domaine", body: "Une introduction au lieu, à la viticulture et aux vins, distincte de la fiche éditoriale de l’atlas." },
      "section-story": { heading: "Notre histoire", body: "Les personnes, les étapes et les décisions racontées par le domaine dans sa propre voix." },
      "section-vineyards": { heading: "Vignobles", body: "Parcelles, sols, expositions, pratiques culturales et travail saisonnier derrière le fruit." },
      "section-cellar": { heading: "Philosophie de cave", body: "Fermentation, contenants, assemblage et élevage expliqués comme des choix de production." },
      "section-wines": { heading: "Vins", body: "Les cuvées du domaine reliées aux cépages, régions et relations vérifiées de l’atlas." },
      "section-visits": { heading: "Visiter", body: "Horaires, expériences, accessibilité et voie de contact directe." },
    },
    es: {
      "section-hero": { heading: "Marlborough desde la bodega", body: "Una introducción al lugar, el cultivo y los vinos, separada de la ficha editorial del atlas." },
      "section-story": { heading: "Nuestra historia", body: "Personas, hitos y decisiones contados con la voz propia de la bodega." },
      "section-vineyards": { heading: "Viñedos", body: "Parcelas, suelos, orientaciones, decisiones de cultivo y trabajo estacional tras la fruta." },
      "section-cellar": { heading: "Filosofía de bodega", body: "Fermentación, recipientes, ensamblaje y crianza explicados como decisiones de producción." },
      "section-wines": { heading: "Vinos", body: "Vinos de la casa conectados con variedades, regiones y relaciones verificadas del atlas." },
      "section-visits": { heading: "Visitas", body: "Horarios, experiencias, accesibilidad y una vía de contacto directa." },
    },
  };
  return seed[locale][section.id] ?? { heading: section.heading, body: section.body };
};

function BusinessIntro({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="business-intro">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {children}
      </div>
      {action}
    </header>
  );
}

function StateBadge({ state }: { state: string }) {
  const ui = useUiCopy();
  return (
    <span className={`business-state state-${state}`}>
      <i />
      {statusLabel(state, ui)}
    </span>
  );
}

function InfrastructureNotice() {
  const ui = useUiCopy();
  return (
    <aside className="infrastructure-notice">
      <ShieldCheck />
      <div>
        <strong>{ui.productionNotice}</strong>
        <p>{ui.productionNoticeBody}</p>
      </div>
      <span>{ui.demoOnly}</span>
    </aside>
  );
}

function EventCard({ event }: { event: TastingEvent }) {
  const { locale } = useLocale();
  const ui = useUiCopy();
  const content = eventCopy(event, ui);
  const region = regions.find((item) => item.id === event.regionId);
  return (
    <Link to={`/events/${event.id}`} className="event-card">
      <div className="event-date">
        <strong>
          {new Intl.DateTimeFormat(locale, { day: "2-digit" }).format(
            new Date(event.startsAt),
          )}
        </strong>
        <span>
          {new Intl.DateTimeFormat(locale, { month: "short" }).format(
            new Date(event.startsAt),
          )}
        </span>
      </div>
      <div className="event-card-main">
        <div className="event-labels">
          <span>{modalityLabel(event.modality, ui)}</span>
          <span>{event.ticket.type === "free" ? ui.free : ui.paid}</span>
          <span>{event.language.toUpperCase()}</span>
        </div>
        <h2>{content.title}</h2>
        <p>{content.summary}</p>
        <div className="event-meta">
          <span>
            <CalendarDays />
            {dateTime(event.startsAt, locale)}
          </span>
          <span>
            <MapPin />
            {event.modality === "online" ? ui.online : event.venue}
          </span>
          {region && (
            <span>
              <Globe2 />
              {region.name}
            </span>
          )}
        </div>
      </div>
      <div className="event-card-ticket">
        <small>{ui.ticket}</small>
        <strong>
          {event.ticket.type === "free"
            ? ui.free
            : money(event.ticket.amountMinor, event.ticket.currency, locale)}
        </strong>
        <span>{event.ticket.type === "paid" && ui.pricePerGuest}</span>
        <ArrowRight />
      </div>
    </Link>
  );
}

export function EventsMarketplace() {
  const ui = useUiCopy();
  const [format, setFormat] = useState<"all" | EventModality>("all");
  const [price, setPrice] = useState<"all" | "free" | "paid">("all");
  const [language, setLanguage] = useState("all");
  const [regionId, setRegionId] = useState("all");
  const [after, setAfter] = useState("");
  const events = repository.events
    .all(demoEvents)
    .filter(
      (event) =>
        event.visibility === "public" && event.publishState === "published",
    );
  const filtered = events.filter(
    (event) =>
      (format === "all" || event.modality === format) &&
      (price === "all" || event.ticket.type === price) &&
      (language === "all" || event.language === language) &&
      (regionId === "all" || event.regionId === regionId) &&
      (!after || event.startsAt.slice(0, 10) >= after),
  );
  const reset = () => {
    setFormat("all");
    setPrice("all");
    setLanguage("all");
    setRegionId("all");
    setAfter("");
  };
  return (
    <div className="page business-page">
      <BusinessIntro
        eyebrow={ui.marketplace}
        title={ui.eventsTitle}
        action={
          <Link className="primary-button ink" to="/studio/events">
            {ui.createEvent}
            <ArrowRight />
          </Link>
        }
      >
        <p>{ui.eventsBody}</p>
      </BusinessIntro>
      <section className="marketplace-filters" aria-label={ui.filter}>
        <label>
          {ui.format}
          <select
            value={format}
            onChange={(event) => setFormat(event.target.value as typeof format)}
          >
            <option value="all">{ui.allFormats}</option>
            <option value="online">{ui.online}</option>
            <option value="in-person">{ui.inPerson}</option>
            <option value="hybrid">{ui.hybrid}</option>
          </select>
        </label>
        <label>
          {ui.ticket}
          <select
            value={price}
            onChange={(event) => setPrice(event.target.value as typeof price)}
          >
            <option value="all">{ui.allPrices}</option>
            <option value="free">{ui.free}</option>
            <option value="paid">{ui.paid}</option>
          </select>
        </label>
        <label>
          {ui.language}
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="all">{ui.allLanguages}</option>
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="fr">FR</option>
            <option value="es">ES</option>
          </select>
        </label>
        <label>
          {ui.region}
          <select
            value={regionId}
            onChange={(event) => setRegionId(event.target.value)}
          >
            <option value="all">{ui.worldAtlas}</option>
            {regions
              .filter((region) =>
                events.some((item) => item.regionId === region.id),
              )
              .map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          {ui.starts}
          <input
            type="date"
            value={after}
            onChange={(event) => setAfter(event.target.value)}
          />
        </label>
        <button onClick={reset}>
          <X />
          {ui.clear}
        </button>
      </section>
      <div className="event-results-heading">
        <span>{String(filtered.length).padStart(2, "0")}</span>
        <h2>{ui.upcoming}</h2>
      </div>
      <section className="event-list">
        {filtered.length ? (
          filtered.map((event) => <EventCard event={event} key={event.id} />)
        ) : (
          <div className="business-empty">
            <CalendarDays />
            <h2>{ui.noEvents}</h2>
            <p>{ui.noEventsBody}</p>
            <button className="secondary-button" onClick={reset}>
              {ui.clear}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export function EventDetail() {
  const { id } = useParams();
  const { locale } = useLocale();
  const ui = useUiCopy();
  const event = repository.events
    .all(demoEvents)
    .find((item) => item.id === id);
  const [checkout, setCheckout] = useState(false);
  const [cellarWineIds, setCellarWineIds] = useState(
    () =>
      new Set(
        repository.cellar
          .all()
          .flatMap((item) => (item.wineId ? [item.wineId] : [])),
      ),
  );
  if (!event)
    return (
      <div className="page business-empty">
        <CalendarDays />
        <h1>{ui.noEvents}</h1>
        <Link className="primary-button" to="/events">
          {ui.viewEvents}
        </Link>
      </div>
    );
  const content = eventCopy(event, ui);
  const host = repository.partnerProfiles.all(demoPartnerProfiles).find(
    (item) => item.id === event.hostProfileId,
  );
  const hostWorkspace=repository.workspaces.all(demoWorkspaces).find(item=>item.id===event.workspaceId)
  const region = regions.find((item) => item.id === event.regionId);
  const eventWines = wines.filter((wine) =>
    event.featuredWineIds.includes(wine.id),
  );
  const addWineToCellar = (wineId: string) => {
    const cellar = repository.cellar.all();
    if (!cellar.some((item) => item.wineId === wineId)) {
      cellar.push({
        id: crypto.randomUUID(),
        wineId,
        state: "owned",
        quantity: 1,
        location: ui.homeCellar,
      });
      repository.cellar.save(cellar);
    }
    setCellarWineIds(new Set([...cellarWineIds, wineId]));
  };
  return (
    <div className="page business-page">
      <Link className="back-link" to="/events">
        ← {ui.marketplace}
      </Link>
      <section className="event-detail-hero">
        <div>
          <div className="event-labels">
            <span>{modalityLabel(event.modality, ui)}</span>
            <span>{event.language.toUpperCase()}</span>
            <span>{event.ticket.type === "free" ? ui.free : ui.paid}</span>
          </div>
          <h1>{content.title}</h1>
          <p>{content.summary}</p>
          {host?<Link to={`/hosts/${host.id}`}>
            {ui.hostedBy} {host.displayName}
            <ArrowRight />
          </Link>:<span>{ui.hostedBy} {hostWorkspace?.name??ui.professionalHost}</span>}
        </div>
        <div className="event-ticket-panel">
          <span>{ui.ticket}</span>
          <strong>
            {event.ticket.type === "free"
              ? ui.free
              : money(event.ticket.amountMinor, event.ticket.currency, locale)}
          </strong>
          <small>{event.ticket.type === "paid" && ui.pricePerGuest}</small>
          <button className="primary-button" onClick={() => setCheckout(true)}>
            <Ticket />
            {ui.reserveDemo}
          </button>
          <p>
            <ShieldCheck />
            {ui.paymentFuture}
          </p>
        </div>
      </section>
      <section className="event-detail-grid">
        <article>
          <span>{ui.start}</span>
          <strong>{dateTime(event.startsAt, locale)}</strong>
          <CalendarDays />
        </article>
        <article>
          <span>{ui.duration}</span>
          <strong>
            {event.durationMinutes} {ui.minutes}
          </strong>
          <Clock3 />
        </article>
        <article>
          <span>{ui.capacity}</span>
          <strong>
            {event.capacity} {ui.people}
          </strong>
          <Users />
        </article>
        <article>
          <span>{ui.logistics}</span>
          <strong>
            {event.modality === "online" ? ui.joiningLinkSecure : event.venue}
          </strong>
          <MapPin />
        </article>
      </section>
      <section className="learning-itinerary">
        <div>
          <span>{ui.learningItinerary}</span>
          <h2>{ui.includedConnections}</h2>
          <p>{ui.editorialContext}</p>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <strong>{ui.wine}</strong>
              <div className="event-wines-to-cellar">
                {eventWines.length ? (
                  eventWines.map((wine) => (
                    <div key={wine.id}>
                      <Link to={`/wines/${wine.id}`}>{wine.name}</Link>
                      <button
                        disabled={cellarWineIds.has(wine.id)}
                        onClick={() => addWineToCellar(wine.id)}
                      >
                        {cellarWineIds.has(wine.id) ? (
                          <>
                            <Check />
                            {ui.inYourCellar}
                          </>
                        ) : (
                          <>
                            <Plus />
                            {ui.addToCellar}
                          </>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <p>{ui.storyline}</p>
                )}
              </div>
            </div>
          </li>
          {region && (
            <li>
              <span>02</span>
              <div>
                <strong>{ui.region}</strong>
                <Link to={`/regions/${region.id}`}>
                  {region.name}
                  <ArrowRight />
                </Link>
              </div>
            </li>
          )}
          <li>
            <span>03</span>
            <div>
              <strong>{ui.chapterLesson}</strong>
              <Link to="/learn">
                {ui.continueAtlas}
                <ArrowRight />
              </Link>
            </div>
          </li>
        </ol>
      </section>
      <section className="event-terms">
        <div>
          <span>{ui.cancellation}</span>
          <p>{event.cancellationTerms}</p>
        </div>
        <InfrastructureNotice />
      </section>
      {checkout && (
        <div
          className="business-modal"
          role="dialog"
          aria-modal="true"
          aria-label={ui.checkoutPreview}
        >
          <div>
            <button
              className="modal-close"
              onClick={() => setCheckout(false)}
              aria-label={ui.close}
            >
              <X />
            </button>
            <span className="eyebrow">{ui.demoOnly}</span>
            <h2>{ui.checkoutPreview}</h2>
            <p>{ui.checkoutPreviewBody}</p>
            <div className="checkout-line">
              <span>{content.title}</span>
              <strong>
                {event.ticket.type === "free"
                  ? ui.free
                  : money(
                      event.ticket.amountMinor,
                      event.ticket.currency,
                      locale,
                    )}
              </strong>
            </div>
            <button
              className="primary-button ink"
              onClick={() => setCheckout(false)}
            >
              {ui.continueDemo}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function HostProfile() {
  const { id } = useParams();
  const ui = useUiCopy();
  const profile = repository.partnerProfiles
    .all(demoPartnerProfiles)
    .find((item) => item.id === id && item.kind === "host");
  if (!profile) return <PartnerNotFound />;
  const content = profileCopy(profile, ui);
  const events = repository.events
    .all(demoEvents)
    .filter(
      (item) =>
        item.hostProfileId === profile.id &&
        item.visibility === "public" &&
        item.publishState === "published",
    );
  return (
    <div className="page business-page">
      <section className="partner-hero host-profile-hero">
        <div>
          <span className="eyebrow">{ui.hostProfile}</span>
          <h1>{profile.displayName}</h1>
          <p className="lead">{content.tagline}</p>
          <StateBadge state={profile.verification} />
        </div>
        <img src={tastingStill} alt="" />
      </section>
      <section className="partner-story">
        <div>
          <span>{ui.professionalHost}</span>
          <h2>{ui.hostStory}</h2>
          <p>{content.story}</p>
        </div>
        <dl>
          <div>
            <dt>{ui.expertise}</dt>
            <dd>{profile.expertise.join(" · ")}</dd>
          </div>
          <div>
            <dt>{ui.languages}</dt>
            <dd>{profile.languages.join(" · ")}</dd>
          </div>
          <div>
            <dt>{ui.serviceArea}</dt>
            <dd>{profile.serviceArea}</dd>
          </div>
        </dl>
      </section>
      <section className="studio-section">
        <header>
          <span>{ui.upcomingEvents}</span>
          <h2>{ui.eventsTitle}</h2>
        </header>
        <div className="event-list">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PartnerNotFound() {
  const ui = useUiCopy();
  return (
    <div className="page business-empty">
      <Store />
      <h1>{ui.partnerProfile}</h1>
      <Link className="primary-button" to="/atlas">
        {ui.openAtlas}
      </Link>
    </div>
  );
}

export function PartnerProfilePage() {
  const { id } = useParams();
  const { locale } = useLocale();
  const ui = useUiCopy();
  const profile = repository.partnerProfiles
    .all(demoPartnerProfiles)
    .find((item) => item.id === id && item.kind !== "host");
  if (!profile) return <PartnerNotFound />;
  const content = profileCopy(profile, ui);
  const producer = producers.find((item) => item.id === profile.producerId);
  const sections = repository.winerySections
    .all(demoWinerySections)
    .filter(
      (section) =>
        section.workspaceId === profile.workspaceId && section.visible,
    )
    .sort((a, b) => a.order - b.order);
  const offers = repository.offers
    .all(demoOffers)
    .filter((offer) => offer.workspaceId === profile.workspaceId);
  return (
    <div className="page business-page">
      <section className="partner-hero">
        <div>
          <span className="eyebrow">
            {ui.partnerProfile} ·{" "}
            {profile.kind === "winery" ? ui.winery : ui.merchant}
          </span>
          <h1>{profile.displayName}</h1>
          <p className="lead">{content.tagline}</p>
          <div className="partner-actions">
            <StateBadge state={profile.verification} />
            {profile.shopUrl && (
              <a
                className="secondary-button"
                href={profile.shopUrl}
                target="_blank"
                rel="noreferrer"
              >
                {ui.visitShop}
                <ExternalLink />
              </a>
            )}
          </div>
          {profile.verification !== "verified" && (
            <small>{ui.profileDraftNotice}</small>
          )}
        </div>
        <img src={vineyardHero} alt="" />
      </section>
      <section className="partner-story">
        <div>
          <span>{ui.estateAuthored}</span>
          <h2>{content.tagline}</h2>
          <p>{content.story}</p>
        </div>
        <aside>
          <ShieldCheck />
          <strong>{ui.editorialIntegrity}</strong>
          <p>{ui.editorialContext}</p>
          {producer && (
            <Link to={`/wineries/${producer.id}`}>
              {producer.name}
              <ArrowRight />
            </Link>
          )}
        </aside>
      </section>
      {profile.kind === "winery" ? (
        <section className="partner-sections">
          {sections.map((section, index) => {
            const copy = sectionSeedCopy(section, locale);
            return (
              <article key={section.id}>
                <span>
                  {String(index + 1).padStart(2, "0")} ·{" "}
                  {sectionTypeLabel(section.type, ui)}
                </span>
                <h2>{copy.heading}</h2>
                <p>{copy.body}</p>
                {section.type === "wines" && producer && (
                  <div className="partner-wines">
                    {wines
                      .filter((wine) => wine.producerId === producer.id)
                      .slice(0, 6)
                      .map((wine) => (
                        <Link key={wine.id} to={`/wines/${wine.id}`}>
                          {wine.name}
                          <ArrowRight />
                        </Link>
                      ))}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      ) : (
        <section className="studio-section">
          <header>
            <span>{ui.merchantDestinations}</span>
            <h2>{ui.offersTitle}</h2>
            <p>{ui.offersBody}</p>
          </header>
          <OfferRows offers={offers} />
        </section>
      )}
      <InfrastructureNotice />
    </div>
  );
}

function useWorkspace(preferred?: BusinessWorkspace["role"]) {
  const {user}=useAuth()
  const available = repository.workspaces.all(demoWorkspaces);
  const permitted = user?.roles.includes('admin')?available:available.filter(workspace=>user?.workspaceIds.includes(workspace.id))
  const targetRole = preferred ?? user?.role ?? "member";
  const fallback:BusinessWorkspace={id:'workspace-unavailable',name:'Workspace',role:targetRole,verification:'unverified',publishState:'draft',plan:targetRole==='member'?'member':'studio',planStatus:'active',checklist:[]}
  const all=permitted.length?permitted:[fallback]
  const initial =
    all.find(
      (item) =>
        item.id ===
        localStorage.getItem("vine-atlas.business.active-workspace"),
    ) ??
    all.find((item) => item.role === targetRole) ??
    all[0];
  const [workspaceId, setWorkspaceIdState] = useState(initial.id);
  const setWorkspaceId = (id: string) => {
    setWorkspaceIdState(id);
    localStorage.setItem("vine-atlas.business.active-workspace", id);
  };
  return {
    all,
    workspace: all.find((item) => item.id === workspaceId) ?? all[0],
    setWorkspaceId,
  };
}

function StudioNav({ workspace }: { workspace: BusinessWorkspace }) {
  const ui = useUiCopy();
  return (
    <nav className="studio-nav">
      <Link to="/studio">{ui.workspace}</Link>
      <Link to="/studio/events">{ui.eventsNav}</Link>
      {workspace.role !== "member" && workspace.role !== "admin" && <Link to="/studio/profile">{ui.partnerProfile}</Link>}
      {workspace.role === "winery" && (
        <Link to="/studio/site">{ui.siteComposer}</Link>
      )}
      {workspace.role === "merchant" && (
        <>
          <Link to="/studio/site">{ui.merchantProfile}</Link>
          <Link to="/studio/offers">{ui.offersTitle}</Link>
        </>
      )}
      {workspace.role === "admin" && (
        <Link to="/studio/placements">{ui.placementTitle}</Link>
      )}
    </nav>
  );
}
function WorkspaceSelector({
  all,
  value,
  onChange,
}: {
  all: BusinessWorkspace[];
  value: string;
  onChange: (id: string) => void;
}) {
  const ui = useUiCopy();
  return (
    <label className="workspace-selector">
      <span>{ui.switchWorkspace}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {all.map((item) => (
          <option value={item.id} key={item.id}>
            {item.name} · {roleLabel(item.role, ui)}
          </option>
        ))}
      </select>
      <ChevronDown />
    </label>
  );
}
function StudioHeader({
  workspace,
  all,
  setWorkspaceId,
  title,
  body,
}: {
  workspace: BusinessWorkspace;
  all: BusinessWorkspace[];
  setWorkspaceId: (id: string) => void;
  title: string;
  body: string;
}) {
  const ui = useUiCopy();
  return (
    <>
      <BusinessIntro
        eyebrow={`${ui.studioNav} · ${roleLabel(workspace.role, ui)}`}
        title={title}
        action={
          <WorkspaceSelector
            all={all}
            value={workspace.id}
            onChange={setWorkspaceId}
          />
        }
      >
        <p>{body}</p>
        <div className="studio-status">
          <StateBadge state={workspace.verification} />
          <StateBadge state={workspace.publishState} />
          <span>
            {ui.plan}: {planLabel(workspace.plan, ui)}
          </span>
        </div>
      </BusinessIntro>
      <StudioNav workspace={workspace} />
    </>
  );
}

export function StudioHome() {
  const { all, workspace, setWorkspaceId } = useWorkspace();
  const ui = useUiCopy();
  const events = repository.events
    .all(demoEvents)
    .filter((item) => item.workspaceId === workspace.id);
  const offers = repository.offers
    .all(demoOffers)
    .filter((item) => item.workspaceId === workspace.id);
  const sections = repository.winerySections
    .all(demoWinerySections)
    .filter((item) => item.workspaceId === workspace.id);
  const approvals = repository.approvals
    .all(demoApprovals)
    .filter(
      (item) => item.workspaceId === workspace.id && item.state === "pending",
    );
  const complete = workspace.checklist.filter((item) => item.complete).length;
  return (
    <div className="page business-page">
      <StudioHeader
        workspace={workspace}
        all={all}
        setWorkspaceId={setWorkspaceId}
        title={ui.studioTitle}
        body={ui.studioBody}
      />
      <section className="studio-command">
        <article className="onboarding-card">
          <div>
            <span>{ui.onboarding}</span>
            <strong>
              {complete}/{workspace.checklist.length} {ui.completed}
            </strong>
          </div>
          <div className="onboarding-progress">
            <i
              style={{
                width: `${(complete / workspace.checklist.length) * 100}%`,
              }}
            />
          </div>
          <ul>
            {workspace.checklist.map((item) => (
              <li className={item.complete ? "done" : ""} key={item.id}>
                <span>
                  {item.complete ? (
                    <Check />
                  ) : (
                    item.id.slice(0, 2).toUpperCase()
                  )}
                </span>
                {item.id.replaceAll("-", " ")}
              </li>
            ))}
          </ul>
        </article>
        <div className="studio-kpis">
          <span>{ui.kpis}</span>
          <div>
            <article>
              <strong>{events.length}</strong>
              <small>{ui.eventsNav}</small>
            </article>
            <article>
              <strong>{sections.length}</strong>
              <small>{ui.pageSections}</small>
            </article>
            <article>
              <strong>{offers.length}</strong>
              <small>{ui.merchantDestinations}</small>
            </article>
            <article>
              <strong>{approvals.length}</strong>
              <small>{ui.pending}</small>
            </article>
          </div>
        </div>
      </section>
      <section className="next-actions">
        <header>
          <span>{ui.nextActions}</span>
          <h2>{roleLabel(workspace.role, ui)}</h2>
        </header>
        <div>
          <Link to="/studio/events">
            <CalendarDays />
            <strong>{ui.manageEvents}</strong>
            <ArrowRight />
          </Link>
          {workspace.role !== "member" && workspace.role !== "admin" && (
            <Link to="/studio/profile">
              <Users />
              <strong>{ui.partnerProfile}</strong>
              <ArrowRight />
            </Link>
          )}
          {(workspace.role === "winery" || workspace.role === "merchant") && (
            <Link to="/studio/site">
              <Layers3 />
              <strong>{ui.editSite}</strong>
              <ArrowRight />
            </Link>
          )}
          {workspace.role === "merchant" && (
            <Link to="/studio/offers">
              <Store />
              <strong>{ui.manageOffers}</strong>
              <ArrowRight />
            </Link>
          )}
          {workspace.role === "admin" && (
            <Link to="/studio/placements">
              <Sparkles />
              <strong>{ui.managePlacements}</strong>
              <ArrowRight />
            </Link>
          )}
          {workspace.role === "admin" && (
            <Link to="/admin">
              <ShieldCheck />
              <strong>{ui.approvalQueue}</strong>
              <ArrowRight />
            </Link>
          )}
        </div>
      </section>
      <InfrastructureNotice />
    </div>
  );
}

export function StudioProfile(){
  const {all,workspace,setWorkspaceId}=useWorkspace()
  const {locale}=useLocale()
  const {user}=useAuth()
  const ui=useUiCopy()
  const copy={
    en:{title:'Partner profile editor',body:'Define the public identity attached to this workspace. Editorial catalogue facts remain separate and protected.',tagline:'Short promise',story:'Profile story',markets:'Markets, comma separated',languages:'Languages, comma separated',expertise:'Expertise, comma separated',service:'Service area',contact:'Contact URL',shop:'Shop URL',producer:'Linked catalogue winery',none:'No catalogue winery linked',save:'Save profile',saved:'Profile saved and sent for review',choose:'Choose a host, winery or merchant workspace to edit its profile.'},
    de:{title:'Partnerprofil-Editor',body:'Definiere die öffentliche Identität dieses Workspaces. Redaktionelle Katalogfakten bleiben getrennt und geschützt.',tagline:'Kurzes Versprechen',story:'Profilgeschichte',markets:'Märkte, kommagetrennt',languages:'Sprachen, kommagetrennt',expertise:'Expertise, kommagetrennt',service:'Einsatzgebiet',contact:'Kontakt-URL',shop:'Shop-URL',producer:'Verknüpftes Katalog-Weingut',none:'Kein Katalog-Weingut verknüpft',save:'Profil speichern',saved:'Profil gespeichert und zur Prüfung gesendet',choose:'Wähle einen Host-, Weinguts- oder Händler-Workspace, um dessen Profil zu bearbeiten.'},
    fr:{title:'Éditeur de profil partenaire',body:'Définissez l’identité publique liée à cet espace. Les faits éditoriaux du catalogue restent séparés et protégés.',tagline:'Promesse courte',story:'Histoire du profil',markets:'Marchés, séparés par des virgules',languages:'Langues, séparées par des virgules',expertise:'Expertise, séparée par des virgules',service:'Zone de service',contact:'URL de contact',shop:'URL de boutique',producer:'Domaine du catalogue relié',none:'Aucun domaine relié',save:'Enregistrer le profil',saved:'Profil enregistré et envoyé en révision',choose:'Choisissez un espace hôte, domaine ou marchand pour modifier son profil.'},
    es:{title:'Editor de perfil de socio',body:'Define la identidad pública vinculada a este espacio. Los datos editoriales del catálogo siguen separados y protegidos.',tagline:'Promesa breve',story:'Historia del perfil',markets:'Mercados, separados por comas',languages:'Idiomas, separados por comas',expertise:'Especialidad, separada por comas',service:'Área de servicio',contact:'URL de contacto',shop:'URL de tienda',producer:'Bodega del catálogo vinculada',none:'Sin bodega vinculada',save:'Guardar perfil',saved:'Perfil guardado y enviado a revisión',choose:'Elige un espacio de anfitrión, bodega o comerciante para editar su perfil.'},
  }[locale]
  const [profiles,setProfiles]=useState(()=>repository.partnerProfiles.all(demoPartnerProfiles))
  const existing=profiles.find(item=>item.workspaceId===workspace.id)
  const validRole=workspace.role==='host'||workspace.role==='winery'||workspace.role==='merchant'
  const profileKind:PartnerProfile['kind']=workspace.role==='winery'?'winery':workspace.role==='merchant'?'merchant':'host'
  const blank:PartnerProfile={id:`profile-${workspace.id}`,workspaceId:workspace.id,kind:profileKind,displayName:workspace.name,tagline:'',story:'',languages:[],markets:[],serviceArea:'',verification:'unverified',publishState:'draft',expertise:[]}
  const [draft,setDraft]=useState<PartnerProfile>(existing??blank)
  const [saved,setSaved]=useState(false)
  useEffect(()=>{const found=profiles.find(item=>item.workspaceId===workspace.id);setDraft(found??{...blank,id:`profile-${workspace.id}`,workspaceId:workspace.id,kind:profileKind,displayName:workspace.name});setSaved(false)},[workspace.id])
  const list=(value:string)=>value.split(',').map(item=>item.trim()).filter(Boolean)
  const submit=(event:FormEvent)=>{
    event.preventDefault()
    const nextProfile:PartnerProfile={...draft,publishState:user?.roles.includes('admin')?draft.publishState:'draft',verification:user?.roles.includes('admin')?draft.verification:'pending'}
    const next=profiles.some(item=>item.id===nextProfile.id)?profiles.map(item=>item.id===nextProfile.id?nextProfile:item):[...profiles,nextProfile]
    repository.partnerProfiles.save(next);setProfiles(next);setDraft(nextProfile)
    if(!user?.roles.includes('admin')){
      const approvals=repository.approvals.all(demoApprovals),approvalId=`profile-review-${nextProfile.id}`
      const record:ApprovalRecord={id:approvalId,workspaceId:workspace.id,kind:workspace.role==='winery'?'winery-claim':'review',subjectId:nextProfile.id,title:nextProfile.displayName,submittedAt:new Date().toISOString(),state:'pending'}
      repository.approvals.save(approvals.some(item=>item.id===approvalId)?approvals.map(item=>item.id===approvalId?record:item):[...approvals,record])
    }
    setSaved(true)
  }
  return <div className="page business-page"><StudioHeader workspace={workspace} all={all} setWorkspaceId={setWorkspaceId} title={copy.title} body={copy.body}/>{!validRole?<div className="business-empty"><Users/><p>{copy.choose}</p></div>:<form className="partner-profile-editor" onSubmit={submit}>
    <label>{ui.heading}<input required value={draft.displayName} onChange={event=>setDraft({...draft,displayName:event.target.value})}/></label>
    <label>{copy.tagline}<input required value={draft.tagline} onChange={event=>setDraft({...draft,tagline:event.target.value})}/></label>
    <label className="wide">{copy.story}<textarea required value={draft.story} onChange={event=>setDraft({...draft,story:event.target.value})}/></label>
    <label>{copy.languages}<input value={draft.languages.join(', ')} onChange={event=>setDraft({...draft,languages:list(event.target.value)})}/></label>
    <label>{copy.markets}<input value={draft.markets.join(', ')} onChange={event=>setDraft({...draft,markets:list(event.target.value)})}/></label>
    <label>{copy.expertise}<input value={draft.expertise.join(', ')} onChange={event=>setDraft({...draft,expertise:list(event.target.value)})}/></label>
    <label>{copy.service}<input value={draft.serviceArea} onChange={event=>setDraft({...draft,serviceArea:event.target.value})}/></label>
    <label>{copy.contact}<input type="url" value={draft.contactUrl??''} onChange={event=>setDraft({...draft,contactUrl:event.target.value||undefined})}/></label>
    <label>{copy.shop}<input type="url" value={draft.shopUrl??''} onChange={event=>setDraft({...draft,shopUrl:event.target.value||undefined})}/></label>
    {workspace.role==='winery'&&<label className="wide">{copy.producer}<select value={draft.producerId??''} onChange={event=>setDraft({...draft,producerId:event.target.value||undefined})}><option value="">{copy.none}</option>{producers.map(producer=><option value={producer.id} key={producer.id}>{producer.name}</option>)}</select></label>}
    {user?.roles.includes('admin')&&<><label>{ui.publishState}<select value={draft.publishState} onChange={event=>setDraft({...draft,publishState:event.target.value as PublishState})}><option value="draft">{ui.draft}</option><option value="published">{ui.published}</option><option value="paused">{ui.paused}</option></select></label><label>{ui.verification}<select value={draft.verification} onChange={event=>setDraft({...draft,verification:event.target.value as PartnerProfile['verification']})}><option value="unverified">{ui.unverified}</option><option value="pending">{ui.verificationPending}</option><option value="verified">{ui.verified}</option></select></label></>}
    <footer className="wide"><button className="primary-button"><Check/>{copy.save}</button>{saved&&<span><Check/>{copy.saved}</span>}</footer>
  </form>}</div>
}

export function StudioEvents() {
  const { all, workspace, setWorkspaceId } = useWorkspace("host");
  const {user}=useAuth()
  const { locale } = useLocale();
  const ui = useUiCopy();
  const [events, setEvents] = useState(() => repository.events.all(demoEvents));
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [modality, setModality] = useState<EventModality>("in-person");
  const [visibility, setVisibility] = useState<EventVisibility>(
    workspace.role === "member" ? "private" : "public",
  );
  const [startsAt, setStartsAt] = useState("2026-11-14T18:00");
  const [ticketType, setTicketType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("0");
  const [eventLanguage, setEventLanguage] = useState<"en" | "de" | "fr" | "es">(locale);
  const [capacity, setCapacity] = useState("12");
  const [regionId, setRegionId] = useState("");
  const [venue, setVenue] = useState("");
  const [journeyId, setJourneyId] = useState("");
  const [wineQuery, setWineQuery] = useState("");
  const [featuredWineIds, setFeaturedWineIds] = useState<string[]>([]);
  const journeys = repository.journeys.all();
  const wineSuggestions = useMemo(() => {
    const query = wineQuery.trim().toLocaleLowerCase(locale);
    if (query.length < 2) return [];
    return wines
      .filter((wine) => {
        const producer = producers.find((item) => item.id === wine.producerId);
        return `${wine.name} ${producer?.name ?? ""}`
          .toLocaleLowerCase(locale)
          .includes(query);
      })
      .slice(0, 8);
  }, [wineQuery, locale]);
  const managed = events.filter((item) => item.workspaceId === workspace.id);
  const create = (event: FormEvent) => {
    event.preventDefault();
    const memberEvent = workspace.role === "member";
    const next: TastingEvent = {
      id: `event-${crypto.randomUUID()}`,
      workspaceId: workspace.id,
      hostProfileId:repository.partnerProfiles.all(demoPartnerProfiles).find((profile) => profile.workspaceId === workspace.id)?.id ?? workspace.id,
      title,
      summary,
      modality,
      visibility: memberEvent ? "private" : visibility,
      publishState: "draft",
      startsAt: new Date(startsAt).toISOString(),
      durationMinutes: 90,
      language: eventLanguage,
      regionId: regionId || undefined,
      venue: modality === "online" ? undefined : venue,
      capacity: Math.max(1, Number(capacity) || 1),
      ticket: {
        type: memberEvent ? "free" : ticketType,
        amountMinor:
          !memberEvent && ticketType === "paid"
            ? Math.round(Number(price) * 100)
            : 0,
        currency: "EUR",
        platformFeeBps: memberEvent ? 0 : demoFeeConfiguration.ticketFeeBps,
      },
      cancellationTerms: "",
      journeyId: journeyId || undefined,
      journey: journeys.find(item=>item.id===journeyId),
      featuredWineIds,
      inviteCode: Array.from(crypto.getRandomValues(new Uint8Array(6)),value=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[value%32]).join(''),
    };
    const updated = [...events, next];
    repository.events.save(updated);
    setEvents(updated);
    setTitle("");
    setSummary("");
    setFeaturedWineIds([]);
    setWineQuery("");
    setCreating(false);
  };
  const toggle = (id: string) => {
    const target=events.find(item=>item.id===id)
    if(target?.publishState!=='published'&&!user?.roles.includes('admin')){
      const approvals=repository.approvals.all(demoApprovals),approvalId=`event-review-${id}`,record={id:approvalId,workspaceId:workspace.id,kind:'public-event' as const,subjectId:id,title:target?.title??id,submittedAt:new Date().toISOString(),state:'pending' as const}
      repository.approvals.save(approvals.some(item=>item.id===approvalId)?approvals.map(item=>item.id===approvalId?record:item):[...approvals,record])
      return
    }
    const updated = events.map((item) =>
      item.id === id
        ? {
            ...item,
            publishState: (item.publishState === "published"
              ? "draft"
              : "published") as PublishState,
          }
        : item,
    );
    repository.events.save(updated);
    setEvents(updated);
  };
  return (
    <div className="page business-page">
      <StudioHeader
        workspace={workspace}
        all={all}
        setWorkspaceId={setWorkspaceId}
        title={ui.eventManagement}
        body={ui.eventMgmtBody}
      />
      <div className="studio-toolbar">
        <p>
          <LockNotice privateOnly={workspace.role === "member"} />
        </p>
        <button
          className="primary-button ink"
          onClick={() => setCreating((value) => !value)}
        >
          <Plus />
          {ui.createEvent}
        </button>
      </div>
      {creating && (
        <form className="studio-form" onSubmit={create}>
          <label>
            {ui.eventTitle}
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="studio-form-wide">
            {ui.sectionBody}
            <textarea
              required
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
          </label>
          <label>
            {ui.format}
            <select
              value={modality}
              onChange={(event) =>
                setModality(event.target.value as EventModality)
              }
            >
              <option value="online">{ui.online}</option>
              <option value="in-person">{ui.inPerson}</option>
              <option value="hybrid">{ui.hybrid}</option>
            </select>
          </label>
          <label>
            {ui.visibility}
            <select
              disabled={workspace.role === "member"}
              value={workspace.role === "member" ? "private" : visibility}
              onChange={(event) =>
                setVisibility(event.target.value as EventVisibility)
              }
            >
              <option value="public">{ui.publicLabel}</option>
              <option value="unlisted">{ui.unlisted}</option>
              <option value="private">{ui.privateLabel}</option>
            </select>
          </label>
          <label>
            {ui.dateTime}
            <input
              required
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
            />
          </label>
          <label>
            {ui.language}
            <select
              value={eventLanguage}
              onChange={(event) =>
                setEventLanguage(event.target.value as typeof eventLanguage)
              }
            >
              <option value="en">EN</option>
              <option value="de">DE</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
            </select>
          </label>
          <label>
            {ui.region}
            <select value={regionId} onChange={(event) => setRegionId(event.target.value)}>
              <option value="">{ui.worldAtlas}</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
          </label>
          {modality !== "online" && (
            <label>
              {ui.venue}
              <input value={venue} onChange={(event) => setVenue(event.target.value)} />
            </label>
          )}
          <label>
            {ui.capacity}
            <input
              type="number"
              min="1"
              value={capacity}
              onChange={(event) => setCapacity(event.target.value)}
            />
          </label>
          <label>
            {ui.learningItinerary}
            <select value={journeyId} onChange={(event) => setJourneyId(event.target.value)}>
              <option value="">{ui.storyline}</option>
              {journeys.map((journey) => (
                <option key={journey.id} value={journey.id}>{journey.title}</option>
              ))}
            </select>
            <Link className="studio-field-link" to="/tastings/build">
              {ui.composeJourney}
              <ArrowRight />
            </Link>
          </label>
          <label>
            {ui.ticketType}
            <select
              disabled={workspace.role === "member"}
              value={ticketType}
              onChange={(event) =>
                setTicketType(event.target.value as typeof ticketType)
              }
            >
              <option value="free">{ui.free}</option>
              <option value="paid">{ui.paid}</option>
            </select>
          </label>
          {ticketType === "paid" && (
            <label>
              {ui.ticketPrice}
              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </label>
          )}
          <div className="studio-wine-picker studio-form-wide">
            <label>
              {ui.selectWine}
              <input
                value={wineQuery}
                onChange={(event) => setWineQuery(event.target.value)}
                placeholder={ui.searchPlaceholder}
              />
            </label>
            {wineSuggestions.length > 0 && (
              <div className="studio-wine-results">
                {wineSuggestions.map((wine) => (
                  <button
                    type="button"
                    key={wine.id}
                    disabled={featuredWineIds.includes(wine.id)}
                    onClick={() => {
                      setFeaturedWineIds((current) => [...current, wine.id]);
                      setWineQuery("");
                    }}
                  >
                    <strong>{wine.name}</strong>
                    <small>{producers.find((item) => item.id === wine.producerId)?.name}</small>
                    <Plus />
                  </button>
                ))}
              </div>
            )}
            {featuredWineIds.length > 0 && (
              <div className="studio-wine-selection">
                {featuredWineIds.map((id) => {
                  const wine = wines.find((item) => item.id === id);
                  return (
                    <span key={id}>
                      {wine?.name}
                      <button
                        type="button"
                        aria-label={ui.remove}
                        onClick={() =>
                          setFeaturedWineIds((current) => current.filter((item) => item !== id))
                        }
                      ><X /></button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setCreating(false)}
            >
              {ui.cancel}
            </button>
            <button className="primary-button">{ui.saveDraft}</button>
          </div>
        </form>
      )}
      <section className="managed-list">
        {managed.length ? (
          managed.map((item) => {
            const content = eventCopy(item, ui);
            return (
              <article key={item.id}>
                <div>
                  <StateBadge state={item.publishState} />
                  <span>
                    {modalityLabel(item.modality, ui)} · {item.visibility}
                  </span>
                </div>
                <h2>{content.title}</h2>
                <p>
                  {dateTime(item.startsAt, "en")} ·{" "}
                  {item.ticket.type === "free"
                    ? ui.free
                    : money(
                        item.ticket.amountMinor,
                        item.ticket.currency,
                        "en",
                      )}
                </p>
                {item.visibility === "private" && (
                  <small>
                    {ui.code}: {item.inviteCode}
                  </small>
                )}
                <footer>
                  <button
                    className="secondary-button"
                    onClick={() => toggle(item.id)}
                  >
                    {ui.publishToggle}:{" "}
                    {item.publishState === "published"
                      ? ui.draft
                      : ui.published}
                  </button>
                  <Link to={`/events/${item.id}`}>
                    {ui.previewJourney}
                    <ArrowRight />
                  </Link>
                </footer>
              </article>
            );
          })
        ) : (
          <div className="business-empty">
            <CalendarDays />
            <h2>{ui.noManagedEvents}</h2>
          </div>
        )}
      </section>
      <InfrastructureNotice />
    </div>
  );
}
function LockNotice({ privateOnly }: { privateOnly: boolean }) {
  const ui = useUiCopy();
  return (
    <>
      <ShieldCheck />
      {privateOnly ? ui.inviteOnlyPrivate : ui.editorialIntegrityBody}
    </>
  );
}

export function StudioSite() {
  const { all, workspace, setWorkspaceId } = useWorkspace("winery");
  const { locale } = useLocale();
  const ui = useUiCopy();
  const [sections, setSections] = useState(() =>
    repository.winerySections.all(demoWinerySections),
  );
  const [type, setType] = useState<WineryPageSection["type"]>("story");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const managed = sections
    .filter((item) => item.workspaceId === workspace.id)
    .sort((a, b) => a.order - b.order);
  const persist = (next: WineryPageSection[]) => {
    repository.winerySections.save(next);
    setSections(next);
  };
  const add = (event: FormEvent) => {
    event.preventDefault();
    const next = [
      ...sections,
      {
        id: crypto.randomUUID(),
        workspaceId: workspace.id,
        type,
        heading,
        body,
        visible: true,
        order: managed.length + 1,
      },
    ];
    persist(next);
    setHeading("");
    setBody("");
  };
  const update = (id: string, change: Partial<WineryPageSection>) =>
    persist(
      sections.map((item) => (item.id === id ? { ...item, ...change } : item)),
    );
  const updateTranslation = (
    section: WineryPageSection,
    change: Partial<{ heading: string; body: string }>,
  ) => {
    const current = sectionSeedCopy(section, locale);
    update(section.id, {
      translations: {
        ...section.translations,
        [locale]: { ...current, ...change },
      },
    });
  };
  const move = (id: string, direction: -1 | 1) => {
    const local = [...managed];
    const index = local.findIndex((item) => item.id === id);
    const swap = index + direction;
    if (swap < 0 || swap >= local.length) return;
    [local[index], local[swap]] = [local[swap], local[index]];
    const order = new Map(local.map((item, i) => [item.id, i + 1]));
    persist(
      sections.map((item) =>
        order.has(item.id) ? { ...item, order: order.get(item.id)! } : item,
      ),
    );
  };
  return (
    <div className="page business-page">
      <StudioHeader
        workspace={workspace}
        all={all}
        setWorkspaceId={setWorkspaceId}
        title={
          workspace.role === "merchant" ? ui.merchantProfile : ui.siteComposer
        }
        body={
          workspace.role === "merchant" ? ui.merchantStory : ui.siteComposerBody
        }
      />
      {workspace.role === "merchant" ? (
        <section className="profile-editor">
          <Store />
          <div>
            <span>{ui.merchantProfile}</span>
            <h2>{workspace.name}</h2>
            <p>{ui.merchantStory}</p>
          </div>
          <Link className="primary-button ink" to="/studio/offers">
            {ui.manageOffers}
            <ArrowRight />
          </Link>
        </section>
      ) : (
        <>
          <form className="section-composer" onSubmit={add}>
            <span>{ui.addSection}</span>
            <label>
              {ui.sectionType}
              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as WineryPageSection["type"])
                }
              >
                {(
                  [
                    "hero",
                    "story",
                    "vineyards",
                    "cellar",
                    "visits",
                    "team",
                    "gallery",
                    "wines",
                    "contact",
                  ] as const
                ).map((value) => (
                  <option value={value} key={value}>
                    {sectionTypeLabel(value, ui)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {ui.heading}
              <input
                required
                value={heading}
                onChange={(event) => setHeading(event.target.value)}
              />
            </label>
            <label>
              {ui.sectionBody}
              <textarea
                required
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
            </label>
            <button className="primary-button">
              <Plus />
              {ui.addSection}
            </button>
          </form>
          <section className="section-stack">
            {managed.map((section, index) => {
              const copy = sectionSeedCopy(section, locale);
              return (
                <article
                  className={!section.visible ? "is-hidden" : ""}
                  key={section.id}
                >
                  <span className="section-handle">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <small>
                      {sectionTypeLabel(section.type, ui)} · {locale.toUpperCase()}
                    </small>
                    <label className="section-inline-field">
                      <span>{ui.heading}</span>
                      <input
                        value={copy.heading}
                        onChange={(event) =>
                          updateTranslation(section, { heading: event.target.value })
                        }
                      />
                    </label>
                    <label className="section-inline-field">
                      <span>{ui.sectionBody}</span>
                      <textarea
                        value={copy.body}
                        onChange={(event) =>
                          updateTranslation(section, { body: event.target.value })
                        }
                      />
                    </label>
                  </div>
                  <div className="section-actions">
                    <button
                      onClick={() => move(section.id, -1)}
                      disabled={index === 0}
                      aria-label={ui.moveUp}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(section.id, 1)}
                      disabled={index === managed.length - 1}
                      aria-label={ui.moveDown}
                    >
                      ↓
                    </button>
                    <button
                      onClick={() =>
                        update(section.id, { visible: !section.visible })
                      }
                    >
                      {section.visible ? ui.hide : ui.show}
                    </button>
                    <button
                      onClick={() =>
                        persist(
                          sections.filter((item) => item.id !== section.id),
                        )
                      }
                      aria-label={ui.deleteLabel}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
      <InfrastructureNotice />
    </div>
  );
}

function stockLabel(value: MerchantOffer["stock"], ui: Ui) {
  return value === "in-stock"
    ? ui.inStock
    : value === "low"
      ? ui.lowStock
      : value === "preorder"
        ? ui.preorder
        : ui.outStock;
}
function OfferRows({
  offers,
  onToggle,
  onDelete,
}: {
  offers: MerchantOffer[];
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const { locale } = useLocale();
  const ui = useUiCopy();
  return (
    <div className="offer-list">
      {offers.length ? (
        offers.map((offer) => {
          const wine = wines.find((item) => item.id === offer.wineId);
          return (
            <article key={offer.id}>
              <div>
                <span className={`offer-disclosure ${offer.disclosure}`}>
                  {offer.disclosure === "affiliate"
                    ? ui.affiliate
                    : ui.retailer}
                </span>
                <StateBadge state={offer.publishState} />
              </div>
              <h3>{wine?.name}</h3>
              <p>
                {offer.market} · {stockLabel(offer.stock, ui)}
              </p>
              <strong>{money(offer.priceMinor, offer.currency, locale)}</strong>
              <footer>
                {onToggle && (
                  <button onClick={() => onToggle(offer.id)}>
                    {offer.publishState === "published"
                      ? ui.deactivate
                      : ui.activate}
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(offer.id)}
                    aria-label={ui.deleteLabel}
                  >
                    <Trash2 />
                  </button>
                )}
                {!onToggle && (
                  <a
                    href={offer.destinationUrl}
                    target="_blank"
                    rel="nofollow sponsored noreferrer"
                  >
                    {ui.externalDestination}
                    <ExternalLink />
                  </a>
                )}
              </footer>
            </article>
          );
        })
      ) : (
        <div className="business-empty">
          <Store />
          <h2>{ui.noOffers}</h2>
        </div>
      )}
    </div>
  );
}

export function StudioOffers() {
  const { all, workspace, setWorkspaceId } = useWorkspace("merchant");
  const {user}=useAuth()
  const ui = useUiCopy();
  const [offers, setOffers] = useState(() => repository.offers.all(demoOffers));
  const [wineId, setWineId] = useState(wines[0].id);
  const [url, setUrl] = useState("https://");
  const [price, setPrice] = useState("0");
  const [market, setMarket] = useState("Germany");
  const managed = offers.filter((item) => item.workspaceId === workspace.id);
  const persist = (next: MerchantOffer[]) => {
    repository.offers.save(next);
    setOffers(next);
  };
  const add = (event: FormEvent) => {
    event.preventDefault();
    persist([
      ...offers,
      {
        id: crypto.randomUUID(),
        workspaceId: workspace.id,
        wineId,
        destinationUrl: url,
        priceMinor: Math.round(Number(price) * 100),
        currency: "EUR",
        market,
        stock: "in-stock",
        disclosure: "retailer",
        publishState: "draft",
      },
    ]);
    setUrl("https://");
    setPrice("0");
  };
  const toggle = (id: string) => {
    const target=offers.find(item=>item.id===id)
    if(target?.publishState!=='published'&&!user?.roles.includes('admin')){
      const approvals=repository.approvals.all(demoApprovals),approvalId=`offer-review-${id}`,record={id:approvalId,workspaceId:workspace.id,kind:'offer' as const,subjectId:id,title:wines.find(item=>item.id===target?.wineId)?.name??id,submittedAt:new Date().toISOString(),state:'pending' as const}
      repository.approvals.save(approvals.some(item=>item.id===approvalId)?approvals.map(item=>item.id===approvalId?record:item):[...approvals,record])
      return
    }
    persist(
      offers.map((item) =>
        item.id === id
          ? {
              ...item,
              publishState: (item.publishState === "published"
                ? "draft"
                : "published") as PublishState,
            }
          : item,
      ),
    )
  };
  return (
    <div className="page business-page">
      <StudioHeader
        workspace={workspace}
        all={all}
        setWorkspaceId={setWorkspaceId}
        title={ui.offersTitle}
        body={ui.offersBody}
      />
      <form className="offer-composer" onSubmit={add}>
        <label>
          {ui.selectWine}
          <select
            value={wineId}
            onChange={(event) => setWineId(event.target.value)}
          >
            {wines.map((wine) => (
              <option value={wine.id} key={wine.id}>
                {wine.name} ·{" "}
                {producers.find((item) => item.id === wine.producerId)?.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {ui.destinationUrl}
          <input
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>
        <label>
          {ui.ticketPrice}
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </label>
        <label>
          {ui.market}
          <input
            required
            value={market}
            onChange={(event) => setMarket(event.target.value)}
          />
        </label>
        <button className="primary-button">
          <Plus />
          {ui.addOffer}
        </button>
      </form>
      <OfferRows
        offers={managed}
        onToggle={toggle}
        onDelete={(id) => persist(offers.filter((item) => item.id !== id))}
      />
      <InfrastructureNotice />
    </div>
  );
}

export function StudioPlacements() {
  const { all, workspace, setWorkspaceId } = useWorkspace("admin");
  const ui = useUiCopy();
  const [placements, setPlacements] = useState(() =>
    repository.placements.all(demoPlacements),
  );
  const profiles=repository.partnerProfiles.all(demoPartnerProfiles)
  const [profileId,setProfileId]=useState(profiles[0]?.id??'')
  const [surface,setSurface]=useState<PromotionalPlacement['surface']>('home')
  const [disclosure,setDisclosure]=useState<PromotionalPlacement['disclosure']>('featured')
  const [startsAt,setPlacementStart]=useState(new Date().toISOString().slice(0,10))
  const [endsAt,setPlacementEnd]=useState(new Date(Date.now()+30*86400000).toISOString().slice(0,10))
  const managed =
    workspace.role === "admin"
      ? placements
      : placements.filter((item) => item.workspaceId === workspace.id);
  const persist = (next: PromotionalPlacement[]) => {
    repository.placements.save(next);
    setPlacements(next);
  };
  const update = (id: string, change: Partial<PromotionalPlacement>) =>
    persist(
      placements.map((item) =>
        item.id === id ? { ...item, ...change } : item,
      ),
    );
  const addPlacement=(event:FormEvent)=>{
    event.preventDefault()
    const profile=profiles.find(item=>item.id===profileId)
    if(!profile)return
    persist([...placements,{id:crypto.randomUUID(),workspaceId:profile.workspaceId,partnerProfileId:profile.id,surface,startsAt,endsAt,priority:1,disclosure,enabled:true}])
  }
  return (
    <div className="page business-page">
      <StudioHeader
        workspace={workspace}
        all={all}
        setWorkspaceId={setWorkspaceId}
        title={ui.placementTitle}
        body={ui.placementBody}
      />
      {workspace.role==='admin'&&profiles.length>0&&<form className="placement-composer" onSubmit={addPlacement}>
        <label>{ui.partnerProfile}<select value={profileId} onChange={event=>setProfileId(event.target.value)}>{profiles.map(profile=><option value={profile.id} key={profile.id}>{profile.displayName}</option>)}</select></label>
        <label>{ui.surface}<select value={surface} onChange={event=>setSurface(event.target.value as PromotionalPlacement['surface'])}><option value="home">{ui.homeLabel}</option><option value="map">{ui.worldAtlas}</option><option value="region">{ui.region}</option><option value="search">{ui.search}</option></select></label>
        <label>{ui.commercialLayer}<select value={disclosure} onChange={event=>setDisclosure(event.target.value as PromotionalPlacement['disclosure'])}><option value="featured">{ui.featured}</option><option value="sponsored">{ui.sponsored}</option></select></label>
        <label>{ui.starts}<input type="date" required value={startsAt} onChange={event=>setPlacementStart(event.target.value)}/></label>
        <label>{ui.ends}<input type="date" required min={startsAt} value={endsAt} onChange={event=>setPlacementEnd(event.target.value)}/></label>
        <button className="primary-button"><Plus/>{ui.managePlacements}</button>
      </form>}
      <section className="placement-list">
        {managed.map((item) => {
          const profile = repository.partnerProfiles.all(demoPartnerProfiles).find(
            (profile) => profile.id === item.partnerProfileId,
          );
          return (
            <article key={item.id}>
              <header>
                <span className={`placement-disclosure ${item.disclosure}`}>
                  {item.disclosure === "featured" ? ui.featured : ui.sponsored}
                </span>
                <strong>{profile?.displayName}</strong>
                <button
                  className={item.enabled ? "active" : ""}
                  onClick={() => update(item.id, { enabled: !item.enabled })}
                >
                  {item.enabled ? ui.enabled : ui.disabled}
                </button>
                <button aria-label={ui.deleteLabel} onClick={()=>persist(placements.filter(candidate=>candidate.id!==item.id))}><Trash2/></button>
              </header>
              <div>
                <label>
                  {ui.surface}
                  <select
                    value={item.surface}
                    onChange={(event) =>
                      update(item.id, {
                        surface: event.target
                          .value as PromotionalPlacement["surface"],
                      })
                    }
                  >
                    <option value="home">{ui.homeLabel}</option>
                    <option value="map">{ui.worldAtlas}</option>
                    <option value="region">{ui.region}</option>
                    <option value="search">{ui.search}</option>
                  </select>
                </label>
                <label>
                  {ui.starts}
                  <input
                    type="date"
                    value={item.startsAt}
                    onChange={(event) =>
                      update(item.id, { startsAt: event.target.value })
                    }
                  />
                </label>
                <label>
                  {ui.ends}
                  <input
                    type="date"
                    value={item.endsAt}
                    onChange={(event) =>
                      update(item.id, { endsAt: event.target.value })
                    }
                  />
                </label>
                <label>
                  {ui.priority}
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={item.priority}
                    onChange={(event) =>
                      update(item.id, { priority: Number(event.target.value) })
                    }
                  />
                </label>
              </div>
            </article>
          );
        })}
      </section>
      <aside className="integrity-panel">
        <ShieldCheck />
        <div>
          <span>{ui.editorialIntegrity}</span>
          <h2>{ui.editorialIntegrityBody}</h2>
        </div>
      </aside>
    </div>
  );
}

export function BusinessAdminPanel() {
  const ui = useUiCopy();
  const [approvals, setApprovals] = useState(() =>
    repository.approvals.all(demoApprovals),
  );
  const [fees, setFees] = useState(() =>
    repository.feeConfiguration.get(demoFeeConfiguration),
  );
  const saveFees=(next:PlatformFeeConfiguration)=>{setFees(next);repository.feeConfiguration.save(next)}
  const update = (id: string, state: "approved" | "rejected") => {
    const approval=approvals.find(item=>item.id===id)
    if(approval){
      if(approval.kind==='public-event'){
        const events=repository.events.all(demoEvents)
        repository.events.save(events.map(item=>item.id===approval.subjectId?{...item,publishState:state==='approved'?'published':'draft'}:item))
      }else if(approval.kind==='offer'){
        const offers=repository.offers.all(demoOffers)
        repository.offers.save(offers.map(item=>item.id===approval.subjectId?{...item,publishState:state==='approved'?'published':'draft'}:item))
      }else if(approval.kind==='review'||approval.kind==='winery-claim'){
        const profiles=repository.partnerProfiles.all(demoPartnerProfiles)
        repository.partnerProfiles.save(profiles.map(item=>item.id===approval.subjectId?{...item,publishState:state==='approved'?'published':'draft',verification:state==='approved'?'verified':'unverified'}:item))
      }
    }
    const next = approvals.map((item) =>
      item.id === id ? { ...item, state } : item,
    );
    repository.approvals.save(next);
    setApprovals(next);
  };
  return (
    <section className="business-admin">
      <header>
        <div>
          <span>{ui.approvalQueue}</span>
          <h2>{ui.approvalBody}</h2>
        </div>
        <strong>
          {approvals.filter((item) => item.state === "pending").length}{" "}
          {ui.pending}
        </strong>
      </header>
      <div className="approval-grid">
        <div className="approval-list">
          {approvals.map((item) => (
            <article key={item.id}>
              <div>
                <small>{approvalKindLabel(item.kind, ui)}</small>
                <h3>{item.title}</h3>
                <StateBadge state={item.state} />
              </div>
              {item.state === "pending" && (
                <footer>
                  <button onClick={() => update(item.id, "rejected")}>
                    <X />
                    {ui.reject}
                  </button>
                  <button onClick={() => update(item.id, "approved")}>
                    <Check />
                    {ui.approve}
                  </button>
                </footer>
              )}
            </article>
          ))}
        </div>
        <aside>
          <span>{ui.commercialLayer}</span>
          <h3>{ui.configurable}</h3>
          <dl className="fee-controls">
            <div>
              <dt>{ui.recurringPlans}</dt>
              <dd><input aria-label={ui.recurringPlans} type="checkbox" checked={fees.recurringPartnerPlans} onChange={event=>saveFees({...fees,recurringPartnerPlans:event.target.checked})}/></dd>
            </div>
            <div>
              <dt>{ui.ticketFees}</dt>
              <dd><input aria-label={ui.ticketFees} type="number" min="0" max="30" step=".1" value={fees.ticketFeeBps/100} onChange={event=>saveFees({...fees,ticketFeeBps:Math.round(Number(event.target.value)*100)})}/>%</dd>
            </div>
            <div>
              <dt>{ui.affiliateLinks}</dt>
              <dd><input aria-label={ui.affiliateLinks} type="checkbox" checked={fees.merchantAffiliateLinks} onChange={event=>saveFees({...fees,merchantAffiliateLinks:event.target.checked})}/></dd>
            </div>
            <div>
              <dt>{ui.paymentFuture}</dt>
              <dd>{ui.notConnected}</dd>
            </div>
          </dl>
          <p>{ui.editorialIntegrityBody}</p>
        </aside>
      </div>
    </section>
  );
}

export function FeaturedBusinessHome() {
  const ui = useUiCopy();
  const today=new Date().toISOString().slice(0,10)
  const profiles=repository.partnerProfiles.all(demoPartnerProfiles)
  const placement=repository.placements.all(demoPlacements).filter(item=>item.enabled&&item.surface==='home'&&item.startsAt<=today&&item.endsAt>=today).sort((a,b)=>b.priority-a.priority)[0]
  const profile=placement?profiles.find(item=>item.id===placement.partnerProfileId&&item.publishState==='published'):undefined
  if(!profile)return null
  return (
    <section className="featured-business-home">
      <div>
        <span className="placement-disclosure featured">{ui.featured}</span>
        <small>{profile.kind==='host'?ui.professionalHost:profile.kind==='winery'?ui.winery:ui.merchant}</small>
        <h2>{profile.displayName}</h2>
        <p>{profile.tagline}</p>
        <div>
          <Link to="/events" className="primary-button">
            {ui.viewEvents}
            <ArrowRight />
          </Link>
          <Link to={profile.kind==='host'?`/hosts/${profile.id}`:`/partners/${profile.id}`}>
            {profile.kind==='host'?ui.hostProfile:ui.partnerProfile}
            <ArrowRight />
          </Link>
        </div>
      </div>
      <img src={tastingStill} alt="" />
    </section>
  );
}

export function AtlasCommercialPlacements() {
  const ui = useUiCopy();
  const today = new Date().toISOString().slice(0, 10);
  const placements = repository.placements
    .all(demoPlacements)
    .filter(
      (item) =>
        item.enabled &&
        item.surface === "map" &&
        item.startsAt <= today &&
        item.endsAt >= today,
    );
  if (!placements.length) return null;
  return (
    <div className="atlas-commercial-overlay">
      {placements.map((item) => {
        const profile = repository.partnerProfiles.all(demoPartnerProfiles).find(
          (profile) => profile.id === item.partnerProfileId,
        );
        return profile ? (
          <Link key={item.id} to={`/partners/${profile.id}`}>
            <span className={`placement-disclosure ${item.disclosure}`}>
              {item.disclosure === "featured" ? ui.featured : ui.sponsored}
            </span>
            <strong>{profile.displayName}</strong>
            <ArrowRight />
          </Link>
        ) : null;
      })}
    </div>
  );
}

export function ProducerBusinessLayer({ producerId }: { producerId: string }) {
  const ui = useUiCopy();
  const profile = repository.partnerProfiles
    .all(demoPartnerProfiles)
    .find((item) => item.producerId === producerId);
  if (!profile) return null;
  return (
    <aside className="partner-context-strip">
      <div>
        <span className="placement-disclosure featured">
          {ui.estateAuthored}
        </span>
        <strong>{ui.partnerProfile}</strong>
        <p>{ui.editorialContext}</p>
      </div>
      <Link className="primary-button ink" to={`/partners/${profile.id}`}>
        {ui.publicProfile}
        <ArrowRight />
      </Link>
    </aside>
  );
}

export function WineMerchantOffers({ wineId }: { wineId: string }) {
  const ui = useUiCopy();
  const offers = repository.offers
    .all(demoOffers)
    .filter((item) => item.wineId === wineId);
  if (!offers.length) return null;
  return (
    <section className="wine-merchant-layer">
      <header>
        <span className="eyebrow">{ui.commercialLayer}</span>
        <h2>{ui.offersTitle}</h2>
        <p>{ui.offersBody}</p>
      </header>
      <OfferRows offers={offers} />
    </section>
  );
}
