import { useEffect, useState } from 'react';
import BookingForm from '@/components/BookingForm';
import LoadStatus from '@/components/LoadStatus';
import ResultCard from '@/components/ResultCard';
import RoomHeader from '@/components/RoomHeader';
import TodaysBookings from '@/components/TodaysBookings';
import { fetchRoomSchedule, type RoomSchedule } from '@/data/rooms';
import { NOW_MINUTES } from '@/lib/clock';
import { evaluateRequest, type Evaluation } from '@/lib/availability';

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; schedule: RoomSchedule };

function App() {
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchRoomSchedule()
      .then((schedule) => {
        if (!cancelled) setLoad({ status: 'ready', schedule });
      })
      .catch(() => {
        if (!cancelled) setLoad({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function handleRetry() {
    setLoad({ status: 'loading' });
    setAttempt((count) => count + 1);
  }

  if (load.status !== 'ready') {
    return (
      <div className="min-h-screen">
        <LoadStatus status={load.status} onRetry={handleRetry} />
      </div>
    );
  }

  const { room, bookings } = load.schedule;

  function handleCheck(startValue: string, endValue: string) {
    setEvaluation(evaluateRequest(startValue, endValue, NOW_MINUTES, room, bookings));
  }

  return (
    <div className="min-h-screen">
      <RoomHeader room={room} />
      <main className="mx-auto -mt-10 flex max-w-xl flex-col gap-6 px-4 pb-16 sm:px-6">
        <BookingForm
          errors={evaluation?.kind === 'invalid' ? evaluation.errors : {}}
          onCheck={handleCheck}
        />
        <ResultCard evaluation={evaluation} />
        <TodaysBookings bookings={bookings} />
      </main>
    </div>
  );
}

export default App;
