export type Tone = 'sky' | 'peach' | 'lavender' | 'mint';

export type Room = {
  name: string;
  building: string;
  isBlocked: boolean;
};

export type Booking = {
  id: string;
  title: string;
  start: number;
  end: number;
  tone: Tone;
};
