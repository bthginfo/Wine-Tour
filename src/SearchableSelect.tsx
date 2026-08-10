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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const selected = options.find((option) => option.value === value);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      `${option.label} ${option.keywords ?? ""}`.toLocaleLowerCase().includes(needle),
    );
  }, [options, query]);
  useOutsideClose(root, () => setOpen(false));

  useEffect(() => setActive(0), [query, open]);

  const choose = (next: string) => {
    onChange(next);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className={`searchable-select ${className}`.trim()} ref={root}>
      <span className="searchable-select-label" id={`${id}-label`}>{label}</span>
      <button
        type="button"
        className="searchable-select-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
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
              autoFocus
              value={query}
              placeholder={searchPlaceholder}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActive((current) => Math.min(filtered.length - 1, current + 1));
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActive((current) => Math.max(0, current - 1));
                }
                if (event.key === "Enter" && filtered[active]) {
                  event.preventDefault();
                  choose(filtered[active].value);
                }
                if (event.key === "Escape") setOpen(false);
              }}
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label={searchPlaceholder}><X /></button>}
          </label>
          <div className="searchable-select-options" role="listbox" aria-labelledby={`${id}-label`}>
            {filtered.length ? filtered.map((option, index) => (
              <button
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={index === active ? "active" : ""}
                key={option.value}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(option.value)}
              >
                <span>{option.label}</span>
                {value === option.value && <Check aria-hidden="true" />}
              </button>
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      `${option.label} ${option.keywords ?? ""}`.toLocaleLowerCase().includes(needle),
    );
  }, [options, query]);
  useOutsideClose(root, () => setOpen(false));

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
        type="button"
        className="searchable-select-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
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
            <input autoFocus value={query} placeholder={searchPlaceholder} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }} />
            {query && <button type="button" onClick={() => setQuery("")} aria-label={searchPlaceholder}><X /></button>}
          </label>
          <div className="searchable-select-options" role="listbox" aria-multiselectable="true" aria-labelledby={`${id}-label`}>
            {filtered.length ? filtered.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={value.includes(option.value)}
                key={option.value}
                onClick={() => toggle(option.value)}
              >
                <span>{option.label}</span>
                {value.includes(option.value) && <Check aria-hidden="true" />}
              </button>
            )) : <p className="searchable-select-empty">{emptyText}</p>}
          </div>
        </div>
      )}
      {help && <small>{help}</small>}
    </div>
  );
}
