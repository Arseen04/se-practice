import { AlertTriangle, Loader2, RotateCcw } from 'lucide-react';

type LoadStatusProps = {
  status: 'loading' | 'error';
  onRetry: () => void;
};

export default function LoadStatus({ status, onRetry }: LoadStatusProps) {
  if (status === 'loading') {
    return (
      <section
        role="status"
        aria-live="polite"
        className="mx-auto mt-16 flex max-w-xl items-center gap-4 rounded-3xl bg-white p-6 shadow-soft"
      >
        <Loader2 className="h-6 w-6 shrink-0 animate-spin text-lavender-700" aria-hidden="true" />
        <p className="text-base font-semibold text-ink-700">Loading room details…</p>
      </section>
    );
  }

  return (
    <section role="alert" className="mx-auto mt-16 max-w-xl rounded-3xl bg-coral-100 p-6 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70">
          <AlertTriangle className="h-6 w-6 text-coral-700" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-extrabold text-ink-900">We couldn&apos;t load this room.</p>
          <p className="mt-1 text-base leading-relaxed text-ink-700">Check your connection and try again.</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-coral-600 px-5 py-3 text-sm font-extrabold text-white transition duration-200 hover:bg-coral-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-100"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}
