import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

export type SearchOption = {
  value: string;
  label: string;
  keywords?: string;
};

type SearchableSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchOption[];
  placeholder?: string;
  searchPlaceholder: string;
  emptyText: string;
  className?: string;
};

function useOutsideClose(ref: React.RefObject<HTMLDivElement | null>, close: () => void) {
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [close, ref]);
}

function normalizeOptionSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase();
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "—",
  searchPlaceholder,
  emptyText,
  className = "",
}: SearchableSelectProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const needle = normalizeOptionSearch(query);
    if (!needle) return options;
    return options.filter((option) =>
      normalizeOptionSearch(`${option.label} ${option.keywords ?? ""}`).includes(needle),
    );
  }, [options, query]);
  useOutsideClose(root, () => setOpen(false));

  useEffect(() => setActive(Math.max(0, filtered.findIndex((option) => option.value === value))), [query, open, value, filtered]);
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    optionRefs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const close = (restoreFocus = false) => {
    setOpen(false);
    setQuery("");
    if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const choose = (next: string) => {
    onChange(next);
    close(true);
  };

  return (
    <div className={`searchable-select ${className}`.trim()} ref={root}>
      <span className="searchable-select-label" id={`${id}-label`}>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className="searchable-select-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => open ? close() : setOpen(true)}
      >
        <span id={`${id}-value`} className={selected ? "" : "placeholder"}>{selected?.label ?? placeholder}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="searchable-select-popover">
          <label className="searchable-select-search">
            <Search aria-hidden="true" />
            <span className="sr-only">{searchPlaceholder}</span>
            <input
              ref={inputRef}
              role="combobox"
              aria-autocomplete="list"
              aria-controls={`${id}-options`}
              aria-expanded={open}
              aria-activedescendant={filtered[active] ? `${id}-option-${active}` : undefined}
              value={query}
              placeholder={searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  if (filtered.length) setActive((current) => (current + 1) % filtered.length);
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  if (filtered.length) setActive((current) => (current - 1 + filtered.length) % filtered.length);
                }
                if (event.key === "Home" && filtered.length) { event.preventDefault(); setActive(0); }
                if (event.key === "End" && filtered.length) { event.preventDefault(); setActive(filtered.length - 1); }
                if (event.key === "Enter" && filtered[active]) {
                  event.preventDefault();
                  choose(filtered[active].value);
                }
                if (event.key === "Escape") { event.preventDefault(); close(true); }
                if (event.key === "Tab") setOpen(false);
              }}
            />
            {query && <button type="button" tabIndex={-1} onClick={() => {setQuery("");inputRef.current?.focus()}} aria-label={searchPlaceholder}><X /></button>}
          </label>
          <div id={`${id}-options`} className="searchable-select-options" role="listbox" aria-labelledby={`${id}-label`}>
            {filtered.length ? filtered.map((option, index) => (
              <div
                ref={element=>{optionRefs.current[index]=element}}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={value === option.value}
                className={index === active ? "active" : ""}
                key={option.value}
                onMouseEnter={() => setActive(index)}
                onMouseDown={event=>event.preventDefault()}
                onClick={() => choose(option.value)}
              >
                <span>{option.label}</span>
                {value === option.value && <Check aria-hidden="true" />}
              </div>
            )) : <p className="searchable-select-empty">{emptyText}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

type SearchableMultiSelectProps = {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SearchOption[];
  searchPlaceholder: string;
  emptyText: string;
  selectedText: string;
  help?: string;
  className?: string;
};

export function SearchableMultiSelect({
  label,
  value,
  onChange,
  options,
  searchPlaceholder,
  emptyText,
  selectedText,
  help,
  className = "",
}: SearchableMultiSelectProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const filtered = useMemo(() => {
    const needle = normalizeOptionSearch(query);
    if (!needle) return options;
    return options.filter((option) =>
      normalizeOptionSearch(`${option.label} ${option.keywords ?? ""}`).includes(needle),
    );
  }, [options, query]);
  useOutsideClose(root, () => setOpen(false));

  useEffect(() => setActive(0), [query, open, filtered]);
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    optionRefs.current[active]?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const close = (restoreFocus = false) => {
    setOpen(false);
    setQuery("");
    if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const toggle = (optionValue: string) => {
    onChange(value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue]);
  };

  const selected = value
    .map((item) => options.find((option) => option.value === item))
    .filter((option): option is SearchOption => Boolean(option));

  return (
    <div className={`searchable-select searchable-multi ${className}`.trim()} ref={root}>
      <span className="searchable-select-label" id={`${id}-label`}>{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className="searchable-select-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => open ? close() : setOpen(true)}
      >
        <span id={`${id}-value`}>{value.length ? `${value.length} ${selectedText}` : "—"}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {selected.length > 0 && (
        <div className="searchable-select-chips" aria-label={label}>
          {selected.slice(0, 6).map((option) => (
            <button type="button" key={option.value} onClick={() => toggle(option.value)}>
              {option.label}<X aria-hidden="true" />
            </button>
          ))}
          {selected.length > 6 && <span>+{selected.length - 6}</span>}
        </div>
      )}
      {open && (
        <div className="searchable-select-popover">
          <label className="searchable-select-search">
            <Search aria-hidden="true" />
            <span className="sr-only">{searchPlaceholder}</span>
            <input ref={inputRef} role="combobox" aria-autocomplete="list" aria-controls={`${id}-options`} aria-expanded={open} aria-activedescendant={filtered[active]?`${id}-option-${active}`:undefined} value={query} placeholder={searchPlaceholder} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => {
              if(event.key==='ArrowDown'&&filtered.length){event.preventDefault();setActive(current=>(current+1)%filtered.length)}
              if(event.key==='ArrowUp'&&filtered.length){event.preventDefault();setActive(current=>(current-1+filtered.length)%filtered.length)}
              if(event.key==='Home'&&filtered.length){event.preventDefault();setActive(0)}
              if(event.key==='End'&&filtered.length){event.preventDefault();setActive(filtered.length-1)}
              if(event.key==='Enter'&&filtered[active]){event.preventDefault();toggle(filtered[active].value)}
              if(event.key==='Escape'){event.preventDefault();close(true)}
              if(event.key==='Tab')setOpen(false)
            }} />
            {query && <button type="button" tabIndex={-1} onClick={() => {setQuery("");inputRef.current?.focus()}} aria-label={searchPlaceholder}><X /></button>}
          </label>
          <div id={`${id}-options`} className="searchable-select-options" role="listbox" aria-multiselectable="true" aria-labelledby={`${id}-label`}>
            {filtered.length ? filtered.map((option,index) => (
              <div
                ref={element=>{optionRefs.current[index]=element}}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={value.includes(option.value)}
                className={index===active?'active':''}
                key={option.value}
                onMouseEnter={()=>setActive(index)}
                onMouseDown={event=>event.preventDefault()}
                onClick={() => toggle(option.value)}
              >
                <span>{option.label}</span>
                {value.includes(option.value) && <Check aria-hidden="true" />}
              </div>
            )) : <p className="searchable-select-empty">{emptyText}</p>}
          </div>
        </div>
      )}
      {help && <small>{help}</small>}
    </div>
  );
}
