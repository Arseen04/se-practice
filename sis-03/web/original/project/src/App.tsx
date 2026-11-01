import { useState } from 'react';
import BookingForm from '@/components/BookingForm';
import ResultCard from '@/components/ResultCard';
import RoomHeader from '@/components/RoomHeader';
import TodaysBookings from '@/components/TodaysBookings';
import { NOW_MINUTES, ROOM, TODAYS_BOOKINGS } from '@/data/room';
import { evaluateRequest, type Evaluation } from '@/lib/availability';

function App() {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  function handleCheck(startValue: string, endValue: string) {
    setEvaluation(evaluateRequest(startValue, endValue, NOW_MINUTES, ROOM, TODAYS_BOOKINGS));
  }

  return (
    <div className="min-h-screen">
      <RoomHeader />
      <main className="mx-auto -mt-10 flex max-w-xl flex-col gap-6 px-4 pb-16 sm:px-6">
        <BookingForm
          errors={evaluation?.kind === 'invalid' ? evaluation.errors : {}}
          onCheck={handleCheck}
        />
        <ResultCard evaluation={evaluation} />
        <TodaysBookings />
      </main>
    </div>
  );
}

export default App;
