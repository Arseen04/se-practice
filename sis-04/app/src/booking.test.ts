import { describe, expect, test } from 'vitest';
import { canBook, checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const bookings = [{ start: 600, end: 660 }];
const rooms: Room[] = [
  { id: 'busy', name: 'Busy', capacity: 8, equipment: ['display', 'whiteboard'], blocked: false, bookings },
  { id: 'free', name: 'Free', capacity: 12, equipment: ['display', 'whiteboard', 'video'], blocked: false, bookings: [] },
  { id: 'blocked', name: 'Blocked', capacity: 20, equipment: ['display', 'video'], blocked: true, bookings: [] },
];
const request = { start: 660, end: 720, now: 540 };

describe('booking and room filtering requirements', () => {
  test('AC1 rejects a start equal to end and requests in the past', () => {
    expect(canBook({ ...request, start: 600, end: 600, blocked: false, bookings: [] })).toBe(false);
    expect(canBook({ ...request, start: 500, end: 550, now: 500, blocked: false, bookings: [] })).toBe(false);
  });

  test('AC2 rejects requests longer than the allowed 120 minutes', () => {
    expect(canBook({ ...request, start: 600, end: 721, blocked: false, bookings: [] })).toBe(false);
  });

  test('AC3 and F3 never report a blocked room as available', () => {
    expect(checkRoom(rooms, 'blocked', request)).toBe(false);
  });

  test('AC4 rejects overlap and allows bookings that touch at an endpoint', () => {
    expect(canBook({ ...request, start: 659, end: 700, blocked: false, bookings })).toBe(false);
    expect(canBook({ ...request, start: 660, end: 720, blocked: false, bookings })).toBe(true);
  });

  test('AC5 does not mutate booking data when checking availability', () => {
    const before = JSON.stringify(rooms);
    expect(checkRoom(rooms, 'free', request)).toBe(true);
    expect(JSON.stringify(rooms)).toBe(before);
  });

  test('F1 includes rooms with capacity at least the requested attendees', () => {
    expect(filterRooms(rooms, { attendees: 8, equipment: [] }).map((room) => room.id)).toEqual(['busy', 'free', 'blocked']);
  });

  test('F2 requires every selected equipment item', () => {
    expect(filterRooms(rooms, { attendees: 1, equipment: ['display', 'whiteboard', 'video'] }).map((room) => room.id)).toEqual(['free']);
  });

  test('F4 returns no rooms for impossible requirements so the UI can show its empty state', () => {
    expect(filterRooms(rooms, { attendees: 21, equipment: [] })).toEqual([]);
  });

  test('F5 checks the selected room own bookings for the same request', () => {
    expect(checkRoom(rooms, 'busy', { ...request, start: 620, end: 640 })).toBe(false);
    expect(checkRoom(rooms, 'free', { ...request, start: 620, end: 640 })).toBe(true);
  });

  test('B1 AC2 accepts a booking exactly 120 minutes long', () => {
    expect(canBook({ ...request, start: 600, end: 720, blocked: false, bookings: [] })).toBe(true);
  });

  test('B2 AC2 rejects a booking 121 minutes long', () => {
    expect(canBook({ ...request, start: 600, end: 721, blocked: false, bookings: [] })).toBe(false);
  });

  test('B3 AC4 accepts a request that touches an existing booking', () => {
    expect(canBook({ ...request, start: 660, end: 720, blocked: false, bookings })).toBe(true);
  });

  test('B4 AC4 rejects a request that overlaps an existing booking', () => {
    expect(canBook({ ...request, start: 659, end: 700, blocked: false, bookings })).toBe(false);
  });

  test('B5 F1 includes a room whose capacity exactly equals attendees', () => {
    expect(filterRooms(rooms, { attendees: 8, equipment: [] }).some((room) => room.id === 'busy')).toBe(true);
  });

  test('B6 F1 excludes a room whose capacity is one below attendees', () => {
    expect(filterRooms(rooms, { attendees: 9, equipment: [] }).some((room) => room.id === 'busy')).toBe(false);
  });

  test('INT F1 F2 F5 filters a room and checks availability against that room', () => {
    const filtered = filterRooms(rooms, { attendees: 8, equipment: ['display'] });
    expect(filtered.map((room) => room.id)).toEqual(['busy', 'free', 'blocked']);
    expect(checkRoom(filtered, 'busy', { ...request, start: 620, end: 640 })).toBe(false);
    expect(checkRoom(filtered, 'free', { ...request, start: 620, end: 640 })).toBe(true);
  });
});
