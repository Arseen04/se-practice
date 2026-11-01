import { BookOpen, GraduationCap, PenLine, Users, type LucideIcon } from 'lucide-react';
import { TODAYS_BOOKINGS } from '@/data/room';
import { formatTime } from '@/lib/time';
import type { Tone } from '@/types';

const TONE_STYLES: Record<Tone, { surface: string; icon: LucideIcon }> = {
  sky: { surface: 'bg-sky-100 text-sky-800', icon: BookOpen },
  peach: { surface: 'bg-peach-100 text-peach-800', icon: GraduationCap },
  lavender: { surface: 'bg-lavender-100 text-lavender-700', icon: Users },
  mint: { surface: 'bg-mint-100 text-mint-800', icon: PenLine },
};

export default function TodaysBookings() {
  const bookings = [...TODAYS_BOOKINGS].sort((a, b) => a.start - b.start);

  return (
    <section aria-labelledby="bookings-title" className="space-y-4">
      <div>
        <h2 id="bookings-title" className="text-xl font-extrabold text-ink-900 sm:text-2xl">
          Today&apos;s bookings
        </h2>
        <p className="mt-1 text-sm text-ink-500">Existing bookings for this room. They are shown for reference only.</p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {bookings.map((booking) => {
          const { surface, icon: Icon } = TONE_STYLES[booking.tone];
          return (
            <li
              key={booking.id}
              className={`flex items-start gap-3 rounded-2xl p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-soft ${surface}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  {formatTime(booking.start)} – {formatTime(booking.end)}
                </p>
                <p className="mt-0.5 truncate text-base font-extrabold text-ink-900">{booking.title}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
