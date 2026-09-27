# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name:
Student ID:
GitHub username:

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | AI assistant (tool) | Claude |
| Exact model name and version | Exact model name and version | Claude Sonnet 5 |
| Date of the session | 27 Sep 2026 |
| Diagram renderer used | plantuml.com/plantuml |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
1. As a Student, I want to view which study rooms are available and when, so that I can plan my visit to the library. Priority: High. Assumption: availability is shown in real time for the current day and at least the next 7 days.

2. As a Student, I want to book a free room for a specific time slot, so that I have a guaranteed place to study. Priority: High. Assumption: a student can hold only one active booking per room per day.

3. As a Student, I want to cancel a booking I made, so that I free up the room if my plans change. Priority: High. Assumption: cancellation is allowed any time before the booking starts.

4. As a Student, I want to receive an email confirmation when I book or cancel a room, so that I have proof of my reservation. Priority: Medium. Assumption: the student's KBTU email address is already known to the system.

5. As an Administrator, I want to block a room that is out of service, so that students cannot book a room that cannot actually be used. Priority: High. Assumption: a blocked room is automatically excluded from availability views.

6. As an Administrator, I want to unblock a room once it is usable again, so that students can resume booking it. Priority: Medium. Assumption: unblocking is a manual action taken by the administrator.

7. As an Administrator, I want to review room usage over a period, so that I can see which rooms are over- or under-used. Priority: Medium. Assumption: usage data is available for at least the last 3 months.

8. As a User, I want to search for rooms by capacity, so that I can find a room that fits my group size. Priority: Low. Assumption: each room has a fixed listed capacity.
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| | | | |
| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| #1 View availability | Kept unchanged | Real stakeholder (Student), one clear outcome, testable | US-01 |
| #2 Book room | Kept unchanged | Same reasons | US-02 |
| #3 Cancel booking | Kept unchanged | Same reasons | US-03 |
| #4 Email confirmation | Rewrote | Named a specific channel ("email") not fixed by the scenario, and close to the out-of-scope "SMS, push or reminder notifications" line; generalized to channel-neutral wording | US-04 |
| #5 Block room | Merged with #6 | Both describe one function, UC-04 "Block or unblock room" — splitting them inflates story count without adding value | US-05 |
| #6 Unblock room | Merged with #5 | Same reason | US-05 |
| #7 Review usage | Kept unchanged | Real stakeholder, testable | US-06 |
| #8 Search by capacity | Deleted | Role "User" is not Student/Administrator; capacity-search filter is not one of the six fixed use cases | — |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in
README section 1, or write "no, and here is how I checked".
Yes — story #8 introduced a role outside Student/Administrator ("User") and a filtering feature not among the six use cases; deleted. Story #4 named a specific notification channel ("email") not fixed by the scenario; generalized.

**How many stories did you end with, and why that number?**
6 — stories #5 and #6 both described the single UC-04 function (block/unblock) and were merged; story #8 was out of scope and removed. Six matches the six fixed use cases one-to-one.
---

## 4. Original AI output — acceptance criteria (Part 3)

```
# Acceptance Criteria — Smart Campus Study Room Booking

## Assumptions
- Time is evaluated against the server's current time (R1).
- A booking ending exactly when another begins is NOT treated as an overlap (R3) — back-to-back bookings are allowed.
- A booking of exactly two hours IS allowed (R2) — two hours is an inclusive maximum, not an exclusive one.
- Only the student who created a booking may cancel it; this follows from UC-03 describing cancellation as releasing "a reservation the student made."

## US-02 — Book room

- **AC-01** Given a room is free for the requested slot, when the student submits a booking starting in the future and lasting at most two hours, then the booking is created and the room shows as booked for that slot.
- **AC-02** Given the requested start time is in the past, when the student submits the booking, then the system rejects it with an error.
- **AC-03** Given the requested duration is longer than two hours, when the student submits the booking, then the system rejects it with an error.
- **AC-04** Given the requested duration is exactly two hours, when the student submits the booking, then the booking is accepted, confirming the maximum is inclusive.
- **AC-05** Given another booking already exists for the same room ending exactly when the new one would start, when the student submits the booking, then it is accepted as a non-overlapping, back-to-back booking.

## US-03 — Cancel booking

- **AC-06** Given the student has an existing future booking, when the student cancels it, then the booking is removed and the room becomes available for that slot again.
- **AC-07** Given the booking belongs to a different student, when a student attempts to cancel it, then the system rejects the request.
- **AC-08** Given the booking's start time has already passed, when the student attempts to cancel it, then the system rejects the cancellation.

## US-05 — Block or unblock room

- **AC-09** Given a room is currently available, when the administrator blocks it, then the room no longer appears as bookable.
- **AC-10** Given a room is currently blocked, when the administrator unblocks it, then the room becomes bookable again.
- **AC-11** Given a room is currently blocked, when a student attempts to book it, then the system rejects the booking, confirming R4.
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| AC-01 | none | Kept unchanged | AC-01 |
| AC-02 | none | Kept unchanged | AC-02 |
| AC-03 | Only tested "longer than 2h", not the boundary "exactly 2h" stated in assumptions | Kept as-is, added new AC-04 for the exact boundary | AC-03 |
| AC-04 (raw) | Only tested overlap, not the "back-to-back" boundary stated in assumptions | Kept as-is, added new AC-05 for back-to-back case | AC-04 |
| AC-05 (raw) | none | Kept, renumbered | AC-06 (US-03 section) |
| AC-06..AC-08 (raw) | none | Kept, renumbered AC-06/07/08 | AC-06, AC-07, AC-08 |
| AC-09 (raw) | "flagged for review" is an invented implementation detail not in the scenario | Removed that clause | AC-09 |
| AC-10 (raw) | none | Kept unchanged | AC-10 |
| AC-11 (raw) | Tests authorization ("non-administrator"), which borders the out-of-scope "authentication" item, not a rule from R1–R4 | Replaced with a test of R4 (blocked room cannot be booked) | AC-11 |
| --- | --- | --- | --- |
| | | | |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | not-allowed (i.e. no overlap, booking is allowed) | Treating back-to-back bookings as free maximizes room usage and matches how physical room scheduling normally works |
| Is exactly two hours allowed under R2? | allowed | "at most two hours" reads as an inclusive maximum |


**Which invalid or boundary case did the assistant leave out?**
The exact two-hour boundary and the back-to-back (touching) boundary — both declared in assumptions but not tested by any AC until I added AC-04 and AC-05.
---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking" {
  usecase "View availability" as UC1
  usecase "Book room" as UC2
  usecase "Cancel booking" as UC3
  usecase "Block or unblock room" as UC4
  usecase "Review usage" as UC5
  usecase "Send confirmation" as UC6

  UC2 ..> UC1 : include
}

Student --> UC1
Student --> UC2
Student --> UC3
Student --> UC6
Administrator --> UC4
Administrator --> UC5
Administrator --> UC6

@enduml
```

Rendered diagram (image, or a link):
![alt text](../smart_campus_use_case_diagram.png)
---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| `Student --> UC6` (Send confirmation) | Student does not trigger sending a confirmation directly — it fires automatically after Book room or Cancel booking | Removed; replaced with `UC2 ..> UC6 : include` |
| `Administrator --> UC6` | Same reasoning | Removed; replaced with `UC3 ..> UC6 : include` |
**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.
Student → Send confirmation and Administrator → Send confirmation were both wrong: no actor triggers a confirmation directly, it is a consequence of Book room / Cancel booking.

**Did any screen, database or internal component appear as a use case or an actor?**
No

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**
Use cases with no story behind them: none — all six use cases have exactly one story.
Stories with no use case they belong to: none — all six stories map 1:1 to a use case.
Criteria that test no rule from section 1: none — every AC ties back to R1, R2, R3 or R4.

Largest gap: UC-01 (View availability), UC-05 (Review usage) and UC-06 (Send confirmation)
have stories but no acceptance criteria, because only 3 of 6 stories were selected for Part 3.
This tells me the generated requirements are only as complete as the part of the pipeline that
was actually exercised — a use case can look "covered" at the story level while having zero
executable tests behind it.

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
