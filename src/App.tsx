import { useState, useCallback, useMemo } from 'react';
import { TimezoneCard } from './components/TimezoneCard';
import { TimezoneSearch } from './components/TimezoneSearch';
import { DatePicker } from './components/DatePicker';
import { TIMEZONE_DATABASE, type TimezoneInfo } from './timezones';

interface ActiveTimezone {
  key: string;
  info: TimezoneInfo;
}

function getLocalTimezoneInfo(): TimezoneInfo {
  const iana = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const match = TIMEZONE_DATABASE.find(tz => tz.iana === iana);
  if (match) return match;
  const city = iana.split('/').pop()?.replace(/_/g, ' ') ?? iana;
  return { id: `local-${iana}`, label: 'Local', city, iana };
}

function getCurrentUtcMinutes(): number {
  const now = new Date();
  return now.getUTCHours() * 60 + now.getUTCMinutes();
}

// Default: local timezone + UTC
function getDefaultTimezones(): ActiveTimezone[] {
  const local = getLocalTimezoneInfo();
  const zones: ActiveTimezone[] = [{ key: local.id, info: local }];
  if (local.iana !== 'UTC') {
    const utc = TIMEZONE_DATABASE.find(tz => tz.id === 'utc')!;
    zones.push({ key: utc.id, info: utc });
  }
  return zones;
}

export default function App() {
  const [timezones, setTimezones] = useState<ActiveTimezone[]>(getDefaultTimezones);
  const [utcMinutes, setUtcMinutes] = useState(getCurrentUtcMinutes);
  const [baseDate, setBaseDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const existingIds = useMemo(
    () => new Set(timezones.map(tz => tz.info.id)),
    [timezones]
  );

  const handleAddTimezone = useCallback((tz: TimezoneInfo) => {
    setTimezones(prev => [...prev, { key: tz.id, info: tz }]);
  }, []);

  const handleRemove = useCallback((key: string) => {
    setTimezones(prev => prev.filter(tz => tz.key !== key));
  }, []);

  const handleSetNow = () => {
    const now = new Date();
    setUtcMinutes(now.getUTCHours() * 60 + now.getUTCMinutes());
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setBaseDate(d);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <div className="w-full sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
        <div className="w-full max-w-3xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent-glow)]" />
              <h1 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                tz<span className="text-accent">shift</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted font-mono">
                {timezones.length} zone{timezones.length !== 1 ? 's' : ''}
              </span>
              <a
                href="https://github.com/lwlee2608/tz-shift"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center px-5 py-6">
        <div className="w-full max-w-3xl">
          <div className="w-full" style={{ marginBottom: '1.25rem' }}>
            <TimezoneSearch onSelect={handleAddTimezone} existingIds={existingIds} />
          </div>

          {/* Date & time controls */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <DatePicker value={baseDate} onChange={setBaseDate} />
            <button
              onClick={handleSetNow}
              className="px-3 py-2 text-xs font-mono text-text-muted hover:text-accent
                bg-bg-secondary border border-border rounded-lg hover:border-border-light
                transition-all cursor-pointer whitespace-nowrap"
            >
              now
            </button>
          </div>

          {/* Timezone cards */}
          <main className="space-y-3 w-full">
            {timezones.map((tz, i) => (
              <TimezoneCard
                key={tz.key}
                iana={tz.info.iana}
                city={tz.info.city}
                label={tz.info.label}
                baseDate={baseDate}
                utcMinutes={utcMinutes}
                onUtcMinutesChange={setUtcMinutes}
                onRemove={() => handleRemove(tz.key)}
                index={i}
              />
            ))}

            {timezones.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-secondary text-sm">No timezones added</p>
                <p className="text-text-muted text-xs mt-1">Search above to add a city</p>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="w-full border-t border-border mt-6">
            <div className="w-full px-5 py-4 flex items-center justify-center">
              <span className="text-xs text-text-muted">
                tzshift
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
