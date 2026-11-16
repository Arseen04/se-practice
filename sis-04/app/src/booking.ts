import type { Booking, Room } from './rooms';

export type BookingRequest = { start: number; end: number; now: number };

export function canBook({ start, end, now, blocked, bookings }: BookingRequest & {
  blocked: boolean;
  bookings: Booking[];
}): boolean {
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(now)) return false;
  if (start < 0 || end > 1440 || !(start < end) || !(start > now)) return false;
  if (end - start > 120 || blocked) return false;
  return !bookings.some((booking) => start < booking.end && end > booking.start);
}

export function checkRoom(rooms: Room[], roomId: string, request: BookingRequest): boolean {
  const room = rooms.find((candidate) => candidate.id === roomId);
  if (!room) return false;
  return canBook({ ...request, blocked: room.blocked, bookings: room.bookings });
}
