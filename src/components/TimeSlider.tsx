import { useCallback, useMemo } from 'react';

interface TimeSliderProps {
  /** Current time as minutes from midnight (0-1439) */
  minuteOfDay: number;
  onChange: (minutes: number) => void;
}

const HOUR_LABELS = ['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p'];

function getHourColor(hour: number): string {
  // Night: 0-5, Dawn: 5-7, Day: 7-18, Dusk: 18-20, Night: 20-24
  if (hour < 5) return '#141e3a';
  if (hour < 6) return '#2a2550';
  if (hour < 7) return '#5c4070';
  if (hour < 8) return '#c08850';
  if (hour < 9) return '#d4a060';
  if (hour < 17) return '#e8c888';
  if (hour < 18) return '#d4a060';
  if (hour < 19) return '#c08850';
  if (hour < 20) return '#5c4070';
  if (hour < 21) return '#2a2550';
  return '#141e3a';
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
    <div className="relative mt-2">
      {/* Gradient track */}
      <div
        className="h-11 rounded-lg overflow-hidden relative"
        style={gradientStyle}
      >
        {/* Hour tick marks */}
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i / 24) * 100}%`,
              backgroundColor: i % 3 === 0 ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}

        {/* Current time indicator glow */}
        <div
          className="absolute top-0 bottom-0 w-8 pointer-events-none transition-[left] duration-100"
          style={{
            left: `calc(${thumbPosition}% - 16px)`,
            background: 'radial-gradient(ellipse at center, rgba(228,168,83,0.3), transparent 70%)',
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
        className="absolute inset-0 w-full h-11 z-10"
      />

      {/* Hour labels */}
      <div className="flex justify-between mt-1.5 px-0.5">
        {HOUR_LABELS.map((label, i) => (
          <span
            key={i}
            className="text-[11px] font-mono text-text-muted tracking-wider"
            style={{ width: '12.5%', textAlign: i === 0 ? 'left' : i === 7 ? 'right' : 'center' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
