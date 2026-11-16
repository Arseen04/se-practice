# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT (Codex desktop) |
| Assistant model | not displayed |
| Starting point | starter |
| Baseline commit | f4df97d |
| Language (ts or js) | ts |
| Vitest version | 3.2.7 |
| Where I ran the tests | Local terminal, `sis-04/app/` |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```
$ npx vitest run

 RUN  v3.2.7 /Users/arsenshakirov/se-practice/sis-04/app

No test files found, exiting with code 1

include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/dist/**, **/cypress/**, **/.{idea,git,cache,output,temp}/**, **/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/README.md — assignment instructions and fixed requirements.
sis-04/starter/package.json — React, TypeScript, Vite and Vitest dependencies/scripts.
sis-04/starter/src/main.tsx — React mount point and stylesheet import.
sis-04/starter/src/App.tsx — initial room array, time helpers, availability check and form/result UI.
sis-04/starter/src/index.css — initial responsive page styling.
sis-04/starter/vite.config.ts, tsconfig.json, index.html — build and entry configuration.
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
The user’s initial task message asked for the Smart Campus Room Availability Checker extension and included the assignment requirements. The requirements carried into implementation were AC1–AC6: valid future time ranges, the 120-minute limit, blocked-room rejection, endpoint-safe overlap handling, no booking mutation, and clear responsive feedback. New requirements were F1 capacity at least attendees, F2 every selected equipment item, F3 blocked means unavailable, F4 an empty state, and F5 use the selected room's bookings. Constraints were fictional data only, no login, payments, live APIs or database. No separate fresh analysis chat was opened; the map above was written after inspecting the starter and was not in the initial user message.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Availability rules are embedded in the React component and cannot be tested independently. | `starter/src/App.tsx`, `check()` | The function converts times, validates, checks blocked state, checks overlaps and sets the result within one function. | High |
| 2 | Blocked state is a single page checkbox, not room catalog data. | `starter/src/App.tsx`, `blocked` state | `blocked` is separate from the selected room object, so it cannot represent per-room blocked status (AC3/F3). | High |
| 3 | Catalog cannot support required filtering and the required room metadata. | `starter/src/App.tsx`, `ROOMS` | The array has two rooms, each with only id, name, blocked, bookings; capacity and equipment are absent. | High |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Add focused Vitest cases for existing booking behavior and new boundaries using the fixed rules; run the baseline suite and retain its output.
2. Move room shape/data into `src/rooms.ts`, booking decisions into `src/booking.ts`, and capacity/equipment predicates into `src/filter.ts`; run the focused suite after each move.
3. Connect the page to those modules, implement clear filter and availability feedback, and verify room switching and narrow layout.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| The handout recommends Week 08 as the default starting point (not a separate AI recommendation). | Modified | The visible Week 07/08 directories have only `dist` output (checked with `find`); there is no source tree to bring in unchanged. I chose the provided runnable starter, an explicitly allowed starting point, so the baseline source is reviewable and editable. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

I added five fictional rooms with capacity, equipment, blocked status and individual bookings. Attendees and equipment chips filter the catalog; the empty message is “No rooms fit those needs.” Blocked rooms remain visible with a BLOCKED label and are rejected by the availability rule. Selecting a different room clears an old result before showing the selected room's own bookings.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Not captured in this run. |
| `evidence/filter-empty.png` | Not captured in this run. |
| `evidence/switch-a.png` | Not captured in this run. |
| `evidence/switch-b.png` | Not captured in this run. |
| `evidence/narrow.png` | Not captured in this run. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | `Room`/`Booking` types, five fictional rooms and equipment options. |
| `src/booking.ts` | Pure AC1–AC5 `canBook` rule and room-specific `checkRoom` adapter. |
| `src/filter.ts` | Capacity and all-equipment filter (`filterRooms`). |
| `src/App.tsx` + `src/index.css` | Controls, rendered catalog and responsive presentation; imports rules and data. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked rooms visible and labelled. | Hide blocked rooms from the catalog. | Visibility helps users see the full catalog, while `checkRoom` still rejects a blocked room (AC3/F3). |
| Keep booking rules pure and pass in the chosen room's bookings. | Keep decisions in component event handlers. | This makes boundary behavior testable without rendering the UI and ties F5 to each room's own data. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `App.tsx` `check()` checked `s < e` once to set an error and repeated it in the availability condition. | The duplicate start/end decision was removed from the UI; `src/booking.ts` `canBook()` owns interval validity. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `AC1 rejects a start equal to end and requests in the past` | `start === end`, past start → false |
| AC2 | `AC2 rejects requests longer than the allowed 120 minutes` | 121-minute interval → false |
| AC3 | `AC3 and F3 never report a blocked room as available` | blocked room → false |
| AC4 | `AC4 rejects overlap and allows bookings that touch at an endpoint` | overlapping → false; touching → true |
| AC5 | `AC5 does not mutate booking data when checking availability` | snapshot before/after check → unchanged |
| F1 | `F1 includes rooms with capacity at least the requested attendees` | 8 attendees → capacities 8, 12, 20 included |
| F2 | `F2 requires every selected equipment item` | display + whiteboard + video → only `free` |
| F3 | `AC3 and F3 never report a blocked room as available` | blocked → false |
| F4 | `F4 returns no rooms for impossible requirements so the UI can show its empty state` | 21 attendees → empty array |
| F5 | `F5 checks the selected room own bookings for the same request` | same time, busy → false; free → true |
| B1 | `B1 AC2 accepts a booking exactly 120 minutes long` | 120 minutes → true |
| B2 | `B2 AC2 rejects a booking 121 minutes long` | 121 minutes → false |
| B3 | `B3 AC4 accepts a request that touches an existing booking` | end-to-start touch → true |
| B4 | `B4 AC4 rejects a request that overlaps an existing booking` | one-minute overlap → false |
| B5 | `B5 F1 includes a room whose capacity exactly equals attendees` | capacity 8, attendees 8 → included |
| B6 | `B6 F1 excludes a room whose capacity is one below attendees` | capacity 8, attendees 9 → excluded |
| INT | `INT F1 F2 F5 filters a room and checks availability against that room` | filter fixed catalog then check busy/free IDs → false/true |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```
$ npx vitest run
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/sis-04/app

 ✓ src/booking.test.ts (16 tests) 2ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  16:16:14
   Duration  242ms (transform 26ms, setup 0ms, collect 25ms, tests 2ms, environment 0ms, prepare 42ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 0/0 | 16/16 | Baseline and final terminal output in §§1.1 and 6.3. |
| Duplicated logic locations removed | 0 | 1 repeated comparison | Compared the two `s < e` checks in starter `check()` with final `App.tsx` and `canBook()`; see §5.3. |
| Code structure: modules and their responsibilities | 3 app source files | 7 app source files | `git ls-files sis-04/app/src` at baseline vs final; read against §5.1. |
| Remaining limitation | One fixed demo scenario | Static fictional data and fixed local bookings; no persisted or live availability | Observed the final implementation in `rooms.ts`; live sources are excluded by scope. |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** ChatGPT in Codex desktop; model not displayed
**Date:** 2026-11-16
**Purpose:** Implement the room catalog, modules and regression tests for this task.

**Prompt:**

```text
The user's initial request was the full SIS #04 brief pasted at the beginning of this conversation: extend the app with a room catalog and filters, preserve AC1–AC6, satisfy F1–F5, refactor into modules, add tests/evidence, and create a measured report. This is a summary, not a verbatim prompt.
```

**Output used:**

```text
The implementation output used is the source change represented by `rooms.ts`, `filter.ts`, `booking.ts`, `App.tsx`, `index.css` and `booking.test.ts`.
```

**Problems found:** The starter had two rooms and no capacity/equipment; its rules were inside `check()`.
**Changes made:** Added five fictional rooms, pure filter/booking modules and a responsive UI; wrote 16 fixed-data tests.
**Verified by:** `npx vitest run` (16/16) and `npm run build` succeeded; inspected the browser-rendered desktop UI.

### 8.2 Exchange 2

**Tool and model:** No separate second AI exchange was conducted.
**Date:** 2026-11-16
**Purpose:** Not applicable.

**Prompt:**

```text
Not applicable; this was not a separate prompt/exchange.
```

**Output used:**

```text
No distinct output to report.
```

**Problems found:** Not applicable.
**Changes made:** Not applicable.
**Verified by:** Not applicable.

### 8.3 Exchange 3

**Tool and model:** No separate third AI exchange was conducted.
**Date:** 2026-11-16
**Purpose:** Not applicable.

**Prompt:**

```text
Not applicable; this was not a separate prompt/exchange.
```

**Output used:**

```text
No distinct output to report.
```

**Problems found:** Not applicable.
**Changes made:** Not applicable.
**Verified by:** Not applicable.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| E1–E3 | Five requested PNG screenshots were not saved to `evidence/`; browser screenshots could be inspected but not exported into the repository in this run. |
| L9 | Only one initial task message appears in the conversation; two additional distinct AI exchanges are not available to quote. |
| L10 | The required 200–300 word first-person reflection must be written by the student, so it is not supplied here. |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

Student-authored 200–300 word reflection required; left blank by the assistant to avoid writing a first-person account on the student's behalf.
