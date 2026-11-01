import { DoorOpen, Clock } from 'lucide-react';
import { NOW_MINUTES, ROOM } from '@/data/room';
import { formatTime } from '@/lib/time';

export default function RoomHeader() {
  return (
    <header className="bg-lavender-200/70">
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-lavender-700">{ROOM.building}</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight text-ink-900 sm:text-4xl">{ROOM.name}</h1>
          </div>
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft sm:h-20 sm:w-20">
            <DoorOpen className="h-9 w-9 text-lavender-700 sm:h-11 sm:w-11" strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-lavender-700/20 bg-white/80 px-4 py-2 text-sm font-semibold text-lavender-700">
          <Clock className="h-4 w-4" aria-hidden="true" />
          It&apos;s {formatTime(NOW_MINUTES)} now
        </p>
      </div>
    </header>
  );
}
