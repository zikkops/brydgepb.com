"use client";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  color = "currentColor",
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max: number;
  color?: string;
  label: string;
}) {
  const btn = "flex size-11 items-center justify-center text-xl font-bold disabled:opacity-30";
  return (
    <div role="group" aria-label={label} className="inline-flex h-12 items-center rounded-full border-2" style={{ borderColor: color, color }}>
      <button type="button" className={btn} aria-label="One less" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <output aria-live="polite" className="w-8 text-center font-display text-lg font-extrabold">
        {value}
      </output>
      <button type="button" className={btn} aria-label="One more" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}
