import { useState, useRef, useEffect, useCallback } from 'react';
import { TIMEZONE_DATABASE, type TimezoneInfo } from '../timezones';

interface TimezoneSearchProps {
  onSelect: (tz: TimezoneInfo) => void;
  existingIds: Set<string>;
}

export function TimezoneSearch({ onSelect, existingIds }: TimezoneSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 0
    ? TIMEZONE_DATABASE.filter(tz => {
        if (existingIds.has(tz.id)) return false;
        const q = query.toLowerCase();
        return tz.city.toLowerCase().includes(q) ||
          tz.label.toLowerCase().includes(q) ||
          tz.iana.toLowerCase().includes(q) ||
          tz.aliases?.some(a => a.toLowerCase().includes(q));
      }).slice(0, 8)
    : [];

  const handleSelect = useCallback((tz: TimezoneInfo) => {
    onSelect(tz);
    setQuery('');
    setIsOpen(false);
    setHighlightIndex(0);
  }, [onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[highlightIndex]) {
      e.preventDefault();
      handleSelect(filtered[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 bg-bg-secondary border border-border rounded-lg
          focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/20 transition-all"
      >
        <svg
          className="text-text-muted pointer-events-none flex-shrink-0"
          width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
        >
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add city or timezone..."
          className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="dropdown-enter absolute top-full left-0 right-0 mt-1.5 bg-bg-secondary border border-border rounded-lg overflow-hidden shadow-2xl z-50">
          {filtered.map((tz, i) => (
            <button
              key={tz.id}
              onClick={() => handleSelect(tz)}
              onMouseEnter={() => setHighlightIndex(i)}
              className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer
                ${i === highlightIndex ? 'bg-bg-hover' : 'hover:bg-bg-hover'}
                ${i !== filtered.length - 1 ? 'border-b border-border' : ''}
              `}
            >
              <div>
                <span className="text-sm font-medium text-text-primary">{tz.city}</span>
                <span className="text-xs text-text-muted ml-2">{tz.iana}</span>
              </div>
              <span className="text-xs font-mono text-accent">{tz.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
