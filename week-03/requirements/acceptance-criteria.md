
# Acceptance Criteria — Smart Campus Study Room Booking

## Assumptions
- Time is evaluated against the server's current time (R1).
- A booking ending exactly when another begins is NOT treated as an overlap (R3) — back-to-back bookings are allowed.
- A booking of exactly two hours IS allowed (R2) — two hours is an inclusive maximum, not an exclusive one.
- Only the student who created a booking may cancel it; this follows from UC-03 describing cancellation as releasing "a reservation the student made."

## US-02 — Book room

**AC-01:** Given a room is free for the requested slot, when the student submits a booking starting in the future and lasting at most two hours, then the booking is created and the room shows as booked for that slot.

**AC-02:** Given the requested start time is in the past, when the student submits the booking, then the system rejects it with an error.

**AC-03:** Given the requested duration is longer than two hours, when the student submits the booking, then the system rejects it with an error.

**AC-04:** Given the requested duration is exactly two hours, when the student submits the booking, then the booking is accepted, confirming the maximum is inclusive.

**AC-05:** Given another booking already exists for the same room ending exactly when the new one would start, when the student submits the booking, then it is accepted as a non-overlapping, back-to-back booking.

## US-03 — Cancel booking

**AC-06:** Given the student has an existing future booking, when the student cancels it, then the booking is removed and the room becomes available for that slot again.

**AC-07:** Given the booking belongs to a different student, when a student attempts to cancel it, then the system rejects the request.

**AC-08:** Given the booking's start time has already passed, when the student attempts to cancel it, then the system rejects the cancellation.

## US-05 — Block or unblock room

**AC-09:** Given a room is currently available, when the administrator blocks it, then the room no longer appears as bookable.

**AC-10:** Given a room is currently blocked, when the administrator unblocks it, then the room becomes bookable again.

**AC-11:** Given a room is currently blocked, when a student attempts to book it, then the system rejects the booking, confirming R4.
