import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, Clock, Search, AlertCircle } from 'lucide-react';
import type { FieldErrors } from '@/lib/availability';
import { formatTime, parseTime } from '@/lib/time';

type BookingFormProps = {
  errors: FieldErrors;
  onCheck: (startValue: string, endValue: string) => void;
};

const DEFAULT_START = '11:00';
const DEFAULT_END = '12:00';

function helperText(value: string, prefix: string, emptyText: string): string {
  const minutes = parseTime(value);
  return minutes === null ? emptyText : `${prefix} ${formatTime(minutes)}`;
}

export default function BookingForm({ errors, onCheck }: BookingFormProps) {
  const [startValue, setStartValue] = useState(DEFAULT_START);
  const [endValue, setEndValue] = useState(DEFAULT_END);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onCheck(startValue, endValue);
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft sm:p-8" aria-labelledby="check-title">
      <h2 id="check-title" className="text-xl font-extrabold text-ink-900 sm:text-2xl">
        Check availability
      </h2>
      <p className="mt-1 text-sm text-ink-500">Pick a time window to see if the room is free.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <TimeField
            id="start-time"
            label="Start time"
            value={startValue}
            onChange={setStartValue}
            error={errors.start}
            helper={helperText(startValue, 'Starts at', 'When would you like to begin?')}
            icon={<Clock className="h-4 w-4" aria-hidden="true" />}
          />
          <TimeField
            id="end-time"
            label="End time"
            value={endValue}
            onChange={setEndValue}
            error={errors.end}
            helper={helperText(endValue, 'Ends at', 'When will you be finished?')}
            icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-coral-600 px-6 py-4 text-base font-extrabold text-white shadow-md shadow-coral-600/25 transition duration-200 hover:-translate-y-0.5 hover:bg-coral-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-100 active:translate-y-0"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          Check availability
        </button>
      </form>
    </section>
  );
}

type TimeFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper: string;
  icon: ReactNode;
};

function TimeField({ id, label, value, onChange, error, helper, icon }: TimeFieldProps) {
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-semibold text-ink-700">
        {label}
      </label>
      <input
        id={id}
        type="time"
        step={60}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : helperId}
        className={`mt-2 w-full rounded-2xl border bg-cream-50 px-4 py-3 text-base font-semibold text-ink-900 transition focus:bg-white focus:outline-none focus:ring-4 ${
          error
            ? 'border-coral-600 focus:border-coral-600 focus:ring-coral-100'
            : 'border-ink-500/25 focus:border-lavender-700 focus:ring-lavender-200'
        }`}
      />
      {error ? (
        <p id={errorId} className="mt-2 flex items-start gap-2 text-sm font-semibold text-coral-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : (
        <p id={helperId} className="mt-2 flex items-center gap-2 text-sm text-ink-500">
          {icon}
          <span>{helper}</span>
        </p>
      )}
    </div>
  );
}
