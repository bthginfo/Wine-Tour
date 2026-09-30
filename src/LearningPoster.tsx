import { useState } from "react";
import { Atom, Droplets, Grape, MapPin, Microscope, Scale, Sprout, Wine } from "lucide-react";
import type { Locale } from "./i18n";
import type { LearningModule } from "./learningCurriculum";

const posterCopy = {
  en: { signal: "Key mechanism", implication: "What it changes", open: "Explore" },
  de: { signal: "Schlüsselmechanismus", implication: "Was sich dadurch ändert", open: "Vertiefen" },
  fr: { signal: "Mécanisme clé", implication: "Ce que cela modifie", open: "Explorer" },
  es: { signal: "Mecanismo clave", implication: "Qué cambia", open: "Explorar" },
} as const;

const icons = [Sprout, Droplets, Grape, Microscope, Wine];

export function LearningPoster({ module, locale }: { module: LearningModule; locale: Locale }) {
  const [active, setActive] = useState(0);
  const c = posterCopy[locale];
  const stageBlock = module.blocks.find((block) => {
    const labels = block.stages?.[locale];
    return (block.kind === "decision-case" || block.kind === "process-timeline")
      && Boolean(labels?.length)
      && labels?.length === block.body[locale].length;
  });
  const stages = stageBlock?.stages?.[locale]?.slice(0, 5) ?? module.outcomes[locale];
  const evidence = stages.map((_, index) =>
    stageBlock?.body[locale][index] ?? module.outcomes[locale][index] ?? "",
  );
  const control = module.blocks.find((block) => block.control)?.control;

  return (
    <section className={`learning-poster poster-${module.archetype}`} aria-label={`${module.title[locale]} · ${c.signal}`}>
      <header>
        <span>{c.signal}</span>
        <h2>{module.title[locale]}</h2>
        <p>{module.question[locale]}</p>
      </header>
      <div className="poster-canvas">
        <div className="poster-orbit" aria-hidden="true"><i/><i/><i/><i/></div>
        <div className="poster-core" aria-hidden="true">
          {module.archetype === "map" ? <MapPin/> : module.archetype === "pairing" ? <Scale/> : module.archetype === "simulator" ? <Atom/> : module.archetype === "diagnostic" ? <Microscope/> : <Grape/>}
          <span>{String(active + 1).padStart(2, "0")}</span>
        </div>
        <div className="poster-stages">
          {stages.map((stage, index) => {
            const Icon = icons[index % icons.length];
            return <button type="button" className={active === index ? "active" : ""} aria-pressed={active === index} key={`${stage}-${index}`} onClick={() => setActive(index)}><Icon/><span>{stage}</span></button>;
          })}
        </div>
      </div>
      <aside aria-live="polite">
        <span>{c.implication}</span>
        <strong>{stages[active]}</strong>
        <p>{evidence[active]}</p>
        {control && <div className="poster-spectrum"><span>{control.low[locale]}</span><i/><span>{control.high[locale]}</span></div>}
      </aside>
    </section>
  );
}
