import { useEffect, useMemo, useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { EQUIPMENT, ROOMS } from './rooms';

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};
const formatTime = (value: number) => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;

export default function App() {
  const [attendees, setAttendees] = useState(4);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState(ROOMS[0].id);
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('10:00');
  const [end, setEnd] = useState('11:00');
  const [result, setResult] = useState<boolean | null>(null);

  const matchingRooms = useMemo(() => filterRooms(ROOMS, { attendees, equipment }), [attendees, equipment]);
  const selectedRoom = matchingRooms.find((room) => room.id === roomId) ?? matchingRooms[0];

  useEffect(() => {
    if (matchingRooms.some((room) => room.id === roomId)) return;
    setRoomId(matchingRooms[0]?.id ?? '');
    setResult(null);
  }, [matchingRooms, roomId]);

  function toggleEquipment(item: string) {
    setResult(null);
    setEquipment((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  function updateAttendees(value: number) {
    setResult(null);
    setAttendees(value);
  }

  function updateTime(setter: (value: string) => void, value: string) {
    setter(value);
    setResult(null);
  }

  function checkAvailability() {
    if (!selectedRoom) return;
    const request = { start: toMinutes(start), end: toMinutes(end), now: toMinutes(now) };
    setResult(checkRoom(ROOMS, selectedRoom.id, request));
  }

  function chooseRoom(id: string) {
    setRoomId(id);
    setResult(null);
  }

  return (
    <main className="shell">
      <header className="topbar"><a className="brand" href="#home" aria-label="Campus home">SC<span>+</span></a><span className="topnote">CAMPUS OPERATIONS <i /> ROOM FINDER</span><span className="user-mark">AS</span></header>
      <section className="intro">
        <div className="eyebrow"><span className="eyebrow-dot" /> SMART CAMPUS <span className="slash">/</span> SPACE DIRECTORY</div>
        <h1>Find your<br /><em>room to think.</em></h1>
        <p className="lede">A good idea needs the right space. Find an available room that fits your team and the way you work.</p>
      </section>

      <section className="finder" aria-label="Room finder">
        <div className="finder-head"><div><span className="step">01 / YOUR NEEDS</span><h2>Make space for your team</h2></div><span className="live"><i /> ROOM CATALOG</span></div>
        <div className="filters">
          <label className="field attendees-field"><span>PEOPLE</span><div className="attendees-control"><button aria-label="Decrease attendees" onClick={() => updateAttendees(Math.max(1, attendees - 1))}>−</button><input aria-label="Attendees" type="number" min="1" value={attendees} onChange={(event) => updateAttendees(Math.max(1, Number(event.target.value) || 1))} /><button aria-label="Increase attendees" onClick={() => updateAttendees(attendees + 1)}>+</button></div></label>
          <fieldset className="field equipment-field"><legend>NEEDED IN THE ROOM</legend><div className="chips">{EQUIPMENT.map((item) => <button key={item} type="button" className={`chip ${equipment.includes(item) ? 'selected' : ''}`} aria-pressed={equipment.includes(item)} onClick={() => toggleEquipment(item)}>{equipment.includes(item) && <b>✓</b>}{item}</button>)}</div></fieldset>
        </div>
        <div className="matches-head"><span>ROOMS THAT FIT</span><span>{matchingRooms.length} FOUND</span></div>
        {matchingRooms.length === 0 ? <div className="empty" role="status"><span className="empty-icon">⌕</span><div><strong>No rooms fit those needs.</strong><p>Try fewer people or remove an equipment filter.</p></div></div> : <div className="room-list">{matchingRooms.map((room, index) => (
          <button key={room.id} className={`room-card ${selectedRoom?.id === room.id ? 'active' : ''}`} onClick={() => chooseRoom(room.id)} aria-pressed={selectedRoom?.id === room.id}>
            <span className="room-index">0{index + 1}</span>
            <span className="room-main"><strong>{room.name}</strong><span>{room.equipment.join(' · ')}</span></span>
            <span className="room-capacity">♙ &nbsp;{room.capacity}</span>
            {room.blocked ? <span className="room-state blocked">BLOCKED</span> : <span className="room-state"><i /> OPEN</span>}
            <span className="room-arrow">↗</span>
          </button>
        ))}</div>}
      </section>

      {selectedRoom && <section className="availability" aria-label="Availability check">
        <div className="availability-title"><div><span className="step">02 / CHECK AVAILABILITY</span><h2>Check a time</h2></div><span className="selected-tag">SELECTED <b>{selectedRoom.name}</b></span></div>
        <div className="time-fields">
          <label className="field"><span>CURRENT TIME</span><input type="time" value={now} onChange={(event) => updateTime(setNow, event.target.value)} /></label>
          <span className="time-divider">—</span>
          <label className="field"><span>START</span><input type="time" value={start} onChange={(event) => updateTime(setStart, event.target.value)} /></label>
          <span className="time-divider">→</span>
          <label className="field"><span>END</span><input type="time" value={end} onChange={(event) => updateTime(setEnd, event.target.value)} /></label>
          <button className="check-button" onClick={checkAvailability}>Check room <span>↗</span></button>
        </div>
        {result !== null && <p className={`feedback ${result ? 'good' : 'bad'}`} role="status"><span>{result ? '✓' : '×'}</span><strong>{result ? 'Available' : 'Unavailable'}</strong><small>{result ? 'This room is free for your selected time.' : selectedRoom.blocked ? 'This room is blocked.' : 'This room is busy or the time request is invalid.'}</small></p>}
        <div className="bookings"><span>EXISTING BOOKINGS</span>{selectedRoom.bookings.length ? selectedRoom.bookings.map((booking) => <span key={`${booking.start}-${booking.end}`}>{formatTime(booking.start)}–{formatTime(booking.end)}</span>) : <span>No bookings today</span>}</div>
      </section>}
      <footer><span>SPACE FOR WHAT’S NEXT.</span><span>SMART CAMPUS <b>·</b> ROOM AVAILABILITY</span></footer>
    </main>
  );
}
