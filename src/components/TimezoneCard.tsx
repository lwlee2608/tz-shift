import { useMemo } from 'react';
import { TimeSlider } from './TimeSlider';
import { formatGmtOffset, getUtcOffsetMinutes, getTimezoneName } from '../timezones';

interface TimezoneCardProps {
  iana: string;
  city: string;
  label: string;
  /** Reference date (for offset calculations) */
  baseDate: Date;
  /** Minutes from midnight in UTC */
  utcMinutes: number;
  onUtcMinutesChange: (m: number) => void;
  onRemove: () => void;
  index: number;
}

function formatTime(hour: number, minute: number): { h: string; m: string; period: string } {
  const period = hour >= 12 ? 'pm' : 'am';
  const h12 = hour % 12 || 12;
  return {
    h: String(h12),
    m: String(minute).padStart(2, '0'),
    period,
  };
}

function formatDate(date: Date, iana: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: iana,
  }).format(date);
}

export function TimezoneCard({
  iana,
  city,
  label,
  baseDate,
  utcMinutes,
  onUtcMinutesChange,
  onRemove,
  index,
}: TimezoneCardProps) {
  const offsetMinutes = useMemo(() => getUtcOffsetMinutes(iana, baseDate), [iana, baseDate]);
  const fullName = useMemo(() => getTimezoneName(iana, baseDate), [iana, baseDate]);
  const gmtLabel = useMemo(() => formatGmtOffset(offsetMinutes), [offsetMinutes]);

  // Local minutes from midnight
  const localMinutes = ((utcMinutes + offsetMinutes) % 1440 + 1440) % 1440;
  const localHour = Math.floor(localMinutes / 60);
  const localMinute = localMinutes % 60;
  const { h, m, period } = formatTime(localHour, localMinute);

  // Compute local date
  const localDate = useMemo(() => {
    const d = new Date(baseDate);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCMinutes(utcMinutes);
    return formatDate(d, iana);
  }, [baseDate, utcMinutes, iana]);

  // When the local slider changes, convert back to UTC minutes
  const handleSliderChange = (localMins: number) => {
    const utcMins = ((localMins - offsetMinutes) % 1440 + 1440) % 1440;
    onUtcMinutesChange(utcMins);
  };

  const isNight = localHour < 6 || localHour >= 21;

  return (
    <div
      className="card-enter bg-bg-card border border-border rounded-lg p-4 relative group transition-colors hover:border-border-light"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Remove button */}
      <button
        onClick={onRemove}
        aria-label={`Remove ${city}`}
        className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-md border border-border-light
          bg-bg-secondary/90 flex items-center justify-center text-text-secondary
          opacity-0 scale-95 pointer-events-none
          group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
          group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:pointer-events-auto
          hover:text-text-primary hover:bg-bg-hover transition-all cursor-pointer"
        title="Remove"
      >
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 2l8 8M10 2L2 10" />
        </svg>
      </button>

      {/* Header row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0" style={{ marginLeft: '1.5rem' }}>
          <div className="flex items-baseline gap-2.5">
            <h3 className="font-display text-2xl font-semibold text-text-primary tracking-tight">
              {city}
            </h3>
            <span className="text-xs font-mono text-accent font-medium">{label}</span>
          </div>
          <p className="text-xs text-text-muted mt-0.5 truncate">{fullName}</p>
        </div>

        {/* Time display */}
        <div className="text-right flex-shrink-0 ml-4" style={{ marginRight: '2rem' }}>
          <div className={`flex items-baseline gap-0.5 ${isNight ? 'opacity-50' : ''}`}>
            <span className="font-mono text-3xl font-light tracking-tight text-text-primary">
              {h}
            </span>
            <span className="font-mono text-3xl font-light text-text-muted">:</span>
            <span className="font-mono text-3xl font-light tracking-tight text-text-primary">
              {m}
            </span>
            <span className="font-mono text-base text-text-secondary ml-1.5 self-end mb-0.5">
              {period}
            </span>
          </div>
          <div className="flex items-center gap-2.5 justify-end mt-0.5">
            <span className="text-[11px] font-mono text-text-muted">{gmtLabel}</span>
            <span className="text-[11px] text-text-muted">{localDate}</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <TimeSlider minuteOfDay={localMinutes} onChange={handleSliderChange} />
    </div>
  );
}
