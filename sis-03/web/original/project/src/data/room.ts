import type { Booking, Room } from '@/types';

export const ROOM: Room = {
  name: 'Room B214',
  building: 'Hawthorne Library',
  isBlocked: false,
};

export const NOW_MINUTES = 10 * 60 + 30;

export const TODAYS_BOOKINGS: Booking[] = [
  { id: 'history-seminar', title: 'History Seminar', start: 8 * 60, end: 9 * 60 + 30, tone: 'sky' },
  { id: 'office-hours', title: 'Dr. Aris Office Hours', start: 13 * 60, end: 14 * 60 + 30, tone: 'peach' },
  { id: 'study-group', title: 'Study Group', start: 15 * 60, end: 16 * 60, tone: 'lavender' },
  { id: 'thesis-writing', title: 'Thesis Writing', start: 16 * 60 + 30, end: 17 * 60 + 30, tone: 'mint' },
];
