import type { ReactNode } from 'react';
import { CheckCircle2, CircleSlash, Lock } from 'lucide-react';
import type { Evaluation } from '@/lib/availability';
import { formatTime } from '@/lib/time';

type ResultCardProps = {
  evaluation: Evaluation | null;
};

export default function ResultCard({ evaluation }: ResultCardProps) {
  if (!evaluation || evaluation.kind === 'invalid') return null;

  const timeWindow = `${formatTime(evaluation.start)} to ${formatTime(evaluation.end)}`;

  if (evaluation.kind === 'available') {
    return (
      <ResultPanel
        tone="mint"
        icon={<CheckCircle2 className="h-7 w-7" aria-hidden="true" />}
        title="Good news — it's available!"
        message={`The room is free from ${timeWindow}.`}
      />
    );
  }

  if (evaluation.kind === 'blocked') {
    return (
      <ResultPanel
        tone="coral"
        icon={<Lock className="h-7 w-7" aria-hidden="true" />}
        title="Sorry, this room is unavailable."
        message="It is closed right now, so no times can be checked."
      />
    );
  }

  const { booking } = evaluation;
  return (
    <ResultPanel
      tone="coral"
      icon={<CircleSlash className="h-7 w-7" aria-hidden="true" />}
      title="Sorry, it's not available."
      message={`${booking.title} is booked from ${formatTime(booking.start)} to ${formatTime(booking.end)}, which overlaps ${timeWindow}.`}
    />
  );
}

type ResultPanelProps = {
  tone: 'mint' | 'coral';
  icon: ReactNode;
  title: string;
  message: string;
};

const TONE_CLASSES = {
  mint: 'bg-mint-100 text-mint-800',
  coral: 'bg-coral-100 text-coral-700',
};

function ResultPanel({ tone, icon, title, message }: ResultPanelProps) {
  return (
    <section
      role="status"
      aria-live="polite"
      className={`flex items-start gap-4 rounded-3xl p-5 shadow-soft animate-fade-up sm:p-6 ${TONE_CLASSES[tone]}`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70">{icon}</div>
      <div className="min-w-0">
        <p className="text-lg font-extrabold text-ink-900 sm:text-xl">{title}</p>
        <p className="mt-1 text-base leading-relaxed text-ink-700">{message}</p>
      </div>
    </section>
  );
}
