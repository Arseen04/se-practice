import { formatTime, parseTime } from '@/lib/time';
import type { Booking, Room } from '@/types';

export const MAX_DURATION_MINUTES = 120;

export type FieldErrors = { start?: string; end?: string };

export type Evaluation =
  | { kind: 'invalid'; errors: FieldErrors }
  | { kind: 'available'; start: number; end: number }
  | { kind: 'blocked'; start: number; end: number }
  | { kind: 'conflict'; start: number; end: number; booking: Booking };

export function evaluateRequest(
  startValue: string,
  endValue: string,
  nowMinutes: number,
  room: Room,
  bookings: Booking[],
): Evaluation {
  const start = parseTime(startValue);
  const end = parseTime(endValue);
  const errors: FieldErrors = {};

  if (start === null) errors.start = 'Pick a start time to check.';
  if (end === null) errors.end = 'Pick an end time to check.';

  if (start !== null && start <= nowMinutes) {
    errors.start = `Start time must be later than ${formatTime(nowMinutes)}, the current time.`;
  }

  if (start !== null && end !== null) {
    if (end <= start) {
      errors.end = 'End time must be after the start time.';
    } else if (end - start > MAX_DURATION_MINUTES) {
      errors.end = 'Bookings can be at most 2 hours long. Move the end time earlier.';
    }
  }

  if (start === null || end === null || errors.start || errors.end) {
    return { kind: 'invalid', errors };
  }

  if (room.isBlocked) return { kind: 'blocked', start, end };

  const booking = bookings.find((existing) => start < existing.end && existing.start < end);
  if (booking) return { kind: 'conflict', start, end, booking };

  return { kind: 'available', start, end };
}
