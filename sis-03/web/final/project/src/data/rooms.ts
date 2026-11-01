import { supabase } from '@/lib/supabase';
import type { Booking, Room, Tone } from '@/types';

type RoomRow = {
  id: string;
  name: string;
  building: string;
  is_blocked: boolean;
};

type BookingRow = {
  id: string;
  title: string;
  start_minute: number;
  end_minute: number;
  tone: Tone;
};

export type RoomSchedule = {
  room: Room;
  bookings: Booking[];
};

export async function fetchRoomSchedule(): Promise<RoomSchedule> {
  const { data: roomData, error: roomError } = await supabase
    .from('rooms')
    .select('id, name, building, is_blocked')
    .limit(1)
    .maybeSingle();
  if (roomError) throw roomError;
  if (!roomData) throw new Error('No room is configured.');

  const roomRow = roomData as RoomRow;

  const { data: bookingData, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, title, start_minute, end_minute, tone')
    .eq('room_id', roomRow.id);
  if (bookingsError) throw bookingsError;

  const bookingRows = (bookingData ?? []) as BookingRow[];

  return {
    room: {
      name: roomRow.name,
      building: roomRow.building,
      isBlocked: roomRow.is_blocked,
    },
    bookings: bookingRows.map((row) => ({
      id: row.id,
      title: row.title,
      start: row.start_minute,
      end: row.end_minute,
      tone: row.tone,
    })),
  };
}
