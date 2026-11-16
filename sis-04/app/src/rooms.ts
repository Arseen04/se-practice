export type Booking = { start: number; end: number };

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

// Fictional campus rooms; times are minutes after midnight.
export const ROOMS: Room[] = [
  { id: 'north-201', name: 'North Hall · 201', capacity: 8, equipment: ['display', 'whiteboard'], blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'north-204', name: 'North Hall · 204', capacity: 12, equipment: ['display', 'whiteboard', 'video'], blocked: false, bookings: [] },
  { id: 'library-3', name: 'Library · Studio 3', capacity: 6, equipment: ['display', 'video'], blocked: true, bookings: [] },
  { id: 'innovation-1', name: 'Innovation Lab · 1', capacity: 20, equipment: ['display', 'whiteboard', 'video', 'hybrid'], blocked: false, bookings: [{ start: 780, end: 840 }] },
  { id: 'annex-12', name: 'Learning Annex · 12', capacity: 4, equipment: ['whiteboard'], blocked: false, bookings: [] },
];

export const EQUIPMENT = ['display', 'whiteboard', 'video', 'hybrid'];
