# Approved stories — Smart Campus study room booking

**Source of this set:** my week-03 stories, revised

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Approved stories

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a student, I want to view which study rooms are available and when, so that I can plan my visit to the library. | — |
| US-02 | As a student, I want to book a free room for a specific time slot, so that I have a guaranteed place to study. | R1, R2, R3 |
| US-03 | As a student, I want to cancel one of my own bookings, so that I free up the room if my plans change. | R2 |
| US-04 | As a student, I want to receive a confirmation when my booking succeeds, so that I have proof of my reservation. | R4 |
| US-05 | As an administrator, I want to block or unblock a room, so that students only book rooms that are actually usable. | R3 |
| US-06 | As an administrator, I want to review room usage over a period, so that I can see which rooms are over- or under-used. | — |

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.
