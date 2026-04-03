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
    <div className="min-h-screen flex flex-col items-center">
      {/* Combined header + toolbar */}
      <div className="w-full sticky top-0 z-40 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
        <div className="w-full max-w-3xl mx-auto px-5 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_var(--color-accent-glow)]" />
              <h1 className="font-display text-xl font-semibold tracking-tight text-text-primary">
                tz<span className="text-accent">shift</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
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
          </div>
          <div className="mt-2.5">
            <TimezoneSearch onSelect={handleAddTimezone} existingIds={existingIds} />
          </div>
        </div>
      </div>

      {/* Timezone cards */}
      <main className="w-full max-w-3xl mx-auto px-5 py-5 space-y-3">
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
      <footer className="w-full border-t border-border mt-auto">
        <div className="w-full max-w-3xl mx-auto px-5 py-4 flex items-center justify-center">
          <span className="text-xs text-text-muted">
            tzshift &middot; {timezones.length} zone{timezones.length !== 1 ? 's' : ''}
          </span>
        </div>
      </footer>
    </div>
  );
}
