# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Arsen Shakirov |
| Group | 16:00-19:00 |
| AI assistant | Claude |
| Exact model | claude-sonnet-5-5 |
| Renderer | PlantUML web server |
| Behaviour diagram | activity |
| Stories used | my week-03 stories, revised |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** (1) Send confirmation has no actor link, because under R4 it is an outcome of a successful booking, not a goal a student starts. (2) Block or unblock room is one use case, because both actions are one administrator goal (US-05). (3) Only the Student cancels, and only their own bookings (US-03). (4) There is no extend, because nothing in the stories is an optional addition to another goal. (5) Validation (R1, R2, R3) is part of Book room and not its own use case. (6) What happens to existing bookings when a room is blocked, and whether back-to-back bookings overlap, are not modeled. The AI only listed these two open questions and did not decide them.

At least **two** findings. A finding names the element, the problem and the rule or story that proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Book room, include, Send confirmation | An include means the confirmation runs every time Book room runs, but R4 says a confirmation is produced only for a successful booking. A rejected booking (R1, R2 or R3) produces none. The original why comment did not say this. | R4, US-04 | Kept the include, because the course FAQ allows it for confirmation, but rewrote the why comment: the confirmation happens only at the end of the successful booking flow, it is a system outcome, and no actor starts it. |
| 2 | All six use cases | The diagram has no link to the stories or rules, so a reader cannot see which story justifies each use case. | US-01 to US-06, R1 to R4 | Added a note next to each use case with its story ID and rules. The use case names are unchanged. |
| 3 | Send confirmation and the actor Student | US-04 is written from the student's point of view (I want to receive a confirmation), but the Student has no association with Send confirmation, so story and diagram look inconsistent. | US-04, R4 | Decision: no association is drawn. The student receives the result but does not start it, and linking an actor to the confirmation would model a system action as a user goal. The original diagram already had no link, so this is a deliberate decision, not a change. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking (makes) | One student makes 0..* bookings. | Each booking belongs to exactly 1 student. | 1 / 0..* |
| Room — Booking (is reserved by) | One room is reserved by 0..* bookings over time. | Each booking is for exactly 1 room. | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: a note on Booking says that active bookings for the same room must not overlap and that back-to-back bookings are allowed. A multiplicity cannot express this.
- R1: the same note on Booking states that the start is in the future and the duration is above 0 and at most 2 hours (attributes start and end).
- R3: a note on Room states that a blocked room accepts no new booking and that existing bookings stay active (attribute blocked).

### 4.3 Assumptions

- A1: Touching bookings (one ends at 12:00, the next starts at 12:00) do NOT overlap under R2; back-to-back bookings are allowed, because a booking occupies the half-open interval [start, end). This matches my Week 03 acceptance criteria.
- A2: Blocking a room does not cancel bookings that already exist; R3 only stops NEW bookings, because R3 says "cannot accept a new booking" and the scenario says nothing about removing existing ones. Existing bookings stay active.
- A3: The checks in Book room run in the order R1, R3, R2, because the checks on the request itself come first and the check that needs the stored bookings comes last.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student operations viewAvailability, bookRoom, cancelBooking | These are use cases placed as methods on an entity. bookRoom would have to enforce R1 to R3, which a Student does not own. | US-01, US-02, US-03, R1 to R3 | Removed all three operations. Student keeps only studentId, and the validation belongs to a design component. |
| 2 | Dashed dependency from Booking to BookingStatus | It repeats the attribute status of type BookingStatus, and a dependency without multiplicity is the wrong kind of relationship here. | R2, US-03 | Removed the arrow. The enum stays as the type of Booking.status. |
| 3 | Notes on Booking and Room | Only R2 was stated. R1 (future start, duration above 0 and at most 2 hours) and R3 (blocked room) were not visible, and the R2 note did not say that back-to-back bookings are allowed. | R1, R2, R3, assumption A1 | Extended the Booking note with R1 and the back-to-back rule and added a note on Room for R3. |
| 4 | Student.name and Room.name | No rule or story needs these attributes. | R1 to R4, US-01 to US-06 | Removed both attributes. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3B activity, because the rules R1, R3 and R2 are sequential checks on one request, which a flow with one decision per rule shows directly.

**Design components added beyond the domain model:** none

What I checked and found correct in the original: three separate decisions for R1, R3 and R2, no fork, labelled guards on every branch, the booking is created only after the last check, and nothing is saved on a rejection path. The status ACTIVE matches BookingStatus in the class diagram, and Send confirmation after Create booking matches the include in the use-case diagram.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Action Show booking confirmed | It repeats the confirmation of the action before it and is a screen action. R4 only says a successful booking produces a confirmation. | R4, US-04 | Removed it. One action, Send confirmation to student (R4), remains. |
| 2 | The three Reject booking actions | The R1 reject said only invalid time range, and none of the rejects named its rule, so it is unclear which rule failed. | R1, R2, R3 | Reworded each reject to name its rule and reason. |
| 3 | Order of checks and touching bookings | The check order R1, R3, R2 decides which reason the student sees when several rules fail, and the back-to-back decision matters for R2. Both were only in the text and not on the diagram. | R1, R2, R3, assumption A1 | Added a note after the first action stating the order, A1 and that nothing is saved on a rejection path. |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | R4 is absent from the class diagram | Booking note in class.puml | accept | US-04 maps to R4 and the other two diagrams show it. A note line adds the trace without a new class, because the confirmation is behaviour and not state. |
| 2 | US-03 maps to R2 but the diagrams do not say that a cancelled booking drops out of R2 | UC3 note in use-case.puml, cancel() in class.puml | accept | The approved table lists US-03 with R2, but my note said only own bookings only. I added R2 to the note and one line on cancel() saying only ACTIVE bookings count for R2. |
| 3 | Add a cancel flow as another activity diagram | Activity diagram | reject | The task asks for exactly one behaviour diagram. The critic assumed one diagram per story, which the brief does not say. |
| 4 | Own bookings only is not enforced in the flow, add a precondition | UC3 note | reject | The association Student 1 to 0..* Booking already shows that each booking belongs to exactly one student, and no cancel flow is modeled. A precondition would repeat it. |
| 5 | US-06 has no support in the class diagram | Class diagram | reject | US-06 has no rule and no new state. Usage is derived from Booking, and a class diagram models state, not every story. |
| 6 | Administrator is an actor but not a class | use-case.puml and class.puml | reject | The critic itself says no class is needed. An actor does not have to be a domain class, and a note would be noise. This is not a naming inconsistency. |
| 7 | Assumption labels are inconsistent and A1 is not defined | Activity note, class note | accept | Partly. The IDs were missing or unexplained in the diagrams, so I added IDs. The claim that A1 is not defined anywhere is false, because it is defined in lab-report section 4.3, which the critic did not see. I kept my numbering, A1 touching bookings and A2 blocking, and added A3 for the check order. |
| 8 | The R1 rejection text is ambiguous at the boundaries | Reject action for R1 in activity.puml | accept | Duration outside 0 to 2 hours does not say that 0 is rejected and exactly 2 hours is allowed. The text now says not above 0 or over 2 hours. |
| 9 | The R2 rejection text is narrower than the rule | Reject action for R2 in activity.puml | accept | R2 rejects any overlap, not only a taken slot. The text now says overlaps an active booking. |
| 10 | Existing bookings stay active has no source | Room note in class.puml | accept | R3 says nothing about existing bookings, so it is an assumption. I labeled it A2, as declared in section 4.3. I did not ask the instructor, because the task accepts either answer if it is declared. |
| 11 | Rename View availability and Review usage | Use cases UC1 and UC5 | reject | The critic calls it cosmetic. The names match the scenario wording and Week 03, and renaming gains nothing. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | Booking (start, end, durationMinutes()), note on Booking | Decision on R1 and the R1 reject action |
| R2 | Book room, Cancel booking | Booking (status, overlaps()), BookingStatus, note on Booking | Decision on R2 and the R2 reject action |
| R3 | Block or unblock room, Book room | Room (blocked, block(), unblock()), note on Room | Decision on R3 and the R3 reject action |
| R4 | Send confirmation | Booking (note R4), no confirmation class | Action Send confirmation to student (R4) after Create booking |
| US-01 | View availability | Room (isAvailable()), Booking | Not part of the Book room flow |
| US-02 | Book room | Student, Booking, Room | The whole activity diagram, Create booking after the three decisions |
| US-03 | Cancel booking | Student, Booking (cancel(), status), BookingStatus | Not part of the Book room flow |
| US-04 | Send confirmation | Booking (note R4) | Action Send confirmation to student (R4) |
| US-05 | Block or unblock room | Room (blocked, block(), unblock()) | Decision on R3 reads the blocked flag |
| US-06 | Review usage | Booking (start, end, status) grouped by Room, no extra class | Not part of the Book room flow |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | No notes, so no use case showed its story, and the why comment did not say that confirmation happens only on success. | Notes with story IDs and rules (US-03 with R2). The why comment now says confirmation comes only at the end of a successful booking. | R4, US-04 |
| 2 | class | Student had three operations that are use cases, name attributes, and a dashed arrow to BookingStatus. | Student keeps studentId. The name attributes and the arrow are removed. | US-01 to US-03 |
| 3 | class | Only an R2 note. | Notes for R1, R2 with A1, cancel, and R4, and an R3 note on Room with A2. | R1 to R4 |
| 4 | activity | An extra action Show booking confirmed, rejects without rule IDs, and no note. | Action removed, each reject names its rule, and a note gives the check order A3, A1 and that nothing is saved on rejection. | R4, R1 to R3 |
| 5 | activity | R1 reject said outside 0 to 2 hours, and R2 reject said time slot already taken. | R1 reject says not above 0 or over 2 hours, and R2 reject says overlaps an active booking. | R1, R2 |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Room Booking"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  3 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  3 behaviour-diagram findings in §5
LR6  PASS  11 critique issues with a verdict
LR7  PASS  5 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story

SUMMARY pass=35 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.

```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>

The resulting class diagram was the least developed sketch. The AI provided Student with the operations volumeAvailability, bookRoom and cancelBooking.Student has the operations volumeAvailability, bookRoom and cancelBooking provided by the AI. Use cases, not a student's behaviour, are US-01 (march down a corridor), US-02 (sequence through a myriad of websites on the Internet), and US-03 (walk the dog). Otherwise, bookRoom would have had to implement R1 to R3, and the check would have been in the wrong class. The AI also added in a dashed dependency between the two from Booking to BookingStatus, which repeated the attribute status, and only listed R2 so R1 and R3 were invisible. It has introduced a Show booking confirmed action into the activity diagram which R4 doesn't request at the screen step. In a new chat, the critique system revealed there were two things missing from my use case note for US-03: R2 is missing from my note, yet it is included in the approved table; likewise, the text for R1 rejection did not indicate that 0 is not accepted and 2 is a maximum. It also made 2 incorrect assumptions – A1 is not mentioned anywhere, it is mentioned in section 4.3 - which it never saw – and 2 activities per story was the brief's requirement. I rejected both.
