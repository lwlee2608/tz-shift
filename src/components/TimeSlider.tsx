import { useCallback, useMemo } from 'react';

interface TimeSliderProps {
  /** Current time as minutes from midnight (0-1439) */
  minuteOfDay: number;
  onChange: (minutes: number) => void;
}

const HOUR_LABELS = ['12a', '6a', '12p', '6p', '12a'];

function getHourColor(hour: number): string {
  if (hour < 5) return '#1e1b4b';
  if (hour < 6) return '#3b0764';
  if (hour < 7) return '#6d28d9';
  if (hour < 8) return '#b45309';
  if (hour < 9) return '#d97706';
  if (hour < 17) return '#f59e0b';
  if (hour < 18) return '#d97706';
  if (hour < 19) return '#b45309';
  if (hour < 20) return '#6d28d9';
  if (hour < 21) return '#3b0764';
  return '#1e1b4b';
}

export function TimeSlider({ minuteOfDay, onChange }: TimeSliderProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Snap to 15 minute increments
    const raw = parseInt(e.target.value, 10);
    const snapped = Math.round(raw / 15) * 15;
    onChange(snapped);
  }, [onChange]);

  const gradientStyle = useMemo(() => {
    const stops: string[] = [];
    for (let h = 0; h <= 24; h++) {
      const pct = (h / 24) * 100;
      stops.push(`${getHourColor(h)} ${pct}%`);
    }
    return {
      background: `linear-gradient(to right, ${stops.join(', ')})`,
    };
  }, []);

  const thumbPosition = (minuteOfDay / 1440) * 100;

  return (
    <div className="relative mt-1">
      {/* Gradient track */}
      <div
        className="h-8 rounded-md overflow-hidden relative"
        style={gradientStyle}
      >
        {/* Hour tick marks */}
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i / 24) * 100}%`,
              backgroundColor: i % 6 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.07)',
            }}
          />
        ))}

        {/* Current time indicator glow */}
        <div
          className="absolute top-0 bottom-0 w-8 pointer-events-none transition-[left] duration-100"
          style={{
            left: `calc(${thumbPosition}% - 16px)`,
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.2), transparent 70%)',
          }}
        />
      </div>

      {/* Range input overlay */}
      <input
        type="range"
        min={0}
        max={1425}
        step={15}
        value={minuteOfDay}
        onChange={handleChange}
        className="absolute inset-0 w-full h-8 z-10"
      />

      {/* Hour labels */}
      <div className="flex justify-between mt-1 px-0.5">
        {HOUR_LABELS.map((label, i) => (
          <span
            key={i}
            className="text-[10px] font-mono text-text-muted tracking-wider"
            style={{ width: '20%', textAlign: i === 0 ? 'left' : i === 4 ? 'right' : 'center' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
