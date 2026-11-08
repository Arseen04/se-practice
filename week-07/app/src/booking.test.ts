import { expect, test } from 'vitest';
import { canBook } from './booking';

function check(start: number, end: number, extra: Partial<Parameters<typeof canBook>[0]> = {}) {
  return canBook({
    start,
    end,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
    ...extra,
  });
}

test('T01 AC4: touching after is available', () => {
  expect(check(660, 720)).toBe(true);
});

test('T02 AC1: starting at now is unavailable', () => {
  expect(check(540, 570)).toBe(false);
});

test('T03 AC1: zero duration is unavailable', () => {
  expect(check(720, 720)).toBe(false);
});

test('T04 AC1: reversed candidate is unavailable', () => {
  expect(check(750, 720)).toBe(false);
});

test('T05 AC1: end after midnight is unavailable', () => {
  expect(check(1380, 1441)).toBe(false);
});

test('T06 AC2: exactly 120 minutes is available', () => {
  expect(check(720, 840)).toBe(true);
});

test('T07 AC2: 121 minutes is unavailable', () => {
  expect(check(720, 841)).toBe(false);
});

test('T08 AC4: touching before is available', () => {
  expect(check(570, 600)).toBe(true);
});

test('T09 AC4: partial overlap is unavailable', () => {
  expect(check(630, 690)).toBe(false);
});

test('T10 AC4: containing a booking is unavailable', () => {
  expect(check(570, 690)).toBe(false);
});

test('T11 AC4: request inside a booking is unavailable', () => {
  expect(check(615, 645)).toBe(false);
});

test('T12 AC4: identical interval is unavailable', () => {
  expect(check(600, 660)).toBe(false);
});

test('T13 AC3: blocked room is unavailable', () => {
  expect(check(660, 720, { blocked: true })).toBe(false);
});

test('T14 AC4: free interval with no bookings is available', () => {
  expect(check(630, 690, { bookings: [] })).toBe(true);
});

test('AC5: an available request leaves bookings unchanged', () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = structuredClone(bookings);
  expect(canBook({ start: 720, end: 780, now: 540, blocked: false, bookings })).toBe(true);
  expect(bookings).toEqual(before);
});

test('X1 AC1: a request ending exactly at 1440 is available', () => {
  expect(check(1420, 1440)).toBe(true);
});

test('X2 AC4: a request touching two bookings is available', () => {
  expect(check(660, 720, { bookings: [{ start: 600, end: 660 }, { start: 720, end: 780 }] })).toBe(true);
});
