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
      className="card-enter bg-bg-card border border-border rounded-xl p-5 relative group transition-colors hover:border-border-light"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
    >
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center
          text-text-muted hover:text-text-primary hover:bg-bg-hover
          opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        title="Remove"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 2l10 10M12 2L2 12" />
        </svg>
      </button>

      {/* Header row */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3">
            <h3 className="font-display text-2xl font-semibold text-text-primary tracking-tight">
              {city}
            </h3>
            <span className="text-sm font-mono text-accent font-medium">{label}</span>
          </div>
          <p className="text-sm text-text-secondary mt-0.5 truncate">{fullName}</p>
        </div>

        {/* Time display */}
        <div className="text-right flex-shrink-0 ml-4">
          <div className={`flex items-baseline gap-0.5 ${isNight ? 'opacity-60' : ''}`}>
            <span className="font-mono text-4xl font-light tracking-tight text-text-primary">
              {h}
            </span>
            <span className="font-mono text-4xl font-light text-accent animate-pulse">:</span>
            <span className="font-mono text-4xl font-light tracking-tight text-text-primary">
              {m}
            </span>
            <span className="font-mono text-lg text-text-secondary ml-1.5 self-end mb-1">
              {period}
            </span>
          </div>
          <div className="flex items-center gap-3 justify-end mt-0.5">
            <span className="text-xs font-mono text-text-muted">{gmtLabel}</span>
            <span className="text-xs text-text-secondary">{localDate}</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <TimeSlider minuteOfDay={localMinutes} onChange={handleSliderChange} />
    </div>
  );
}
