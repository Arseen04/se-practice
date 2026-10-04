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
| <Student — Booking> | <one student makes 0..* bookings> | <each booking belongs to exactly 1 student> | <1 / 0..*> |
| <Room — Booking> | <...> | <...> | <...> |

### 4.2 Constraints the multiplicities cannot show

- R2: <how your diagram states it — which note, on which class>
- <any other rule that is not visible in multiplicities>

### 4.3 Assumptions

- A1: Touching bookings (one ends at 12:00, the next starts at 12:00) do NOT overlap under R2; back-to-back bookings are allowed, because a booking occupies the half-open interval [start, end). This matches my Week 03 acceptance criteria.
- A2: Blocking a room does not cancel bookings that already exist; R3 only stops NEW bookings, because R3 says "cannot accept a new booking" and the scenario says nothing about removing existing ones. Existing bookings stay active.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <element> | <problem> | <rule or story> | <fix> |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** <3A sequence / 3B activity — one sentence on why>

**Design components added beyond the domain model:** <name each one, e.g. `BookingService` —
what it does in one line; write "none" for an activity diagram>

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <element> | <problem> | <rule or story> | <fix> |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
