interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const formatted = value.toISOString().split('T')[0];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      onChange(d);
    }
  };

  const goToday = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    onChange(now);
  };

  const displayDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(value);

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <label className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-lg cursor-pointer hover:border-border-light transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent flex-shrink-0">
            <rect x="1" y="2.5" width="14" height="12" rx="2" />
            <path d="M1 6.5h14" />
            <path d="M5 1v3M11 1v3" />
          </svg>
          <span className="text-sm text-text-primary whitespace-nowrap">{displayDate}</span>
          <input
            type="date"
            value={formatted}
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>
      <button
        onClick={goToday}
        className="px-3 py-2 text-xs font-mono text-text-muted hover:text-accent
          bg-bg-secondary border border-border rounded-lg hover:border-border-light
          transition-all cursor-pointer whitespace-nowrap"
      >
        today
      </button>
    </div>
  );
}
