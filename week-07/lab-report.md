# Week 07 — Lab report

**Name:** Arsen Shakirov  
**Group:** Monday 16:00–19:00  
**Date:** 8 November 2026

## 1. Setup

| | |
| --- | --- |
| Project I continue | `starter` — Week 06 project files/branch were not present in the checkout |
| Bolt project link | not shared; the supplied starter was used |
| Assistant that generated the tests | Codex |
| Exact model | not displayed |
| Where I ran the tests | my computer, in `week-07/app/` |
| Vitest version | 3.2.7 |
| Test command | `npm test` (`vitest run`) |

## 2. Task 1 — baseline and the booking function

| | |
| --- | --- |
| File and function before editing | `starter/src/App.tsx`, inside `check()` |
| Inputs | selected start/end/current time, blocked checkbox, selected room bookings |
| Return value | boolean stored in React state and rendered as Available/Unavailable |
| How the page used it | the component calculated the decision in `check()` and set the result |

I copied the existing interval, current-time, duration, blocked-room, and overlap conditions into
`app/src/booking.ts` as `canBook`. `app/src/App.tsx` now converts the time inputs and calls that
function, then renders its Boolean result as before. I kept the original strict overlap condition,
`start < b.end && end > b.start`, so endpoint-touching requests remain available. The extracted
function does not mutate the existing bookings. I used the supplied starter because no Week 06
project was included in the checkout.

## 3. Task 2 — the test plan

| ID | Candidate / changed input | Expected | AC | Reason |
| --- | --- | --- | --- | --- |
| T01 | 660–720 | true | AC4 | It begins when the 600–660 booking ends, so the intervals touch only. |
| T02 | 540–570 | false | AC1 | The start equals `now`; it is not after the current time. |
| T03 | 720–720 | false | AC1 | Start must be strictly less than end. |
| T04 | 750–720 | false | AC1 | The candidate interval is reversed. |
| T05 | 1380–1441 | false | AC1 | The end exceeds the 1440-minute day boundary. |
| T06 | 720–840 | true | AC2 | Exactly 120 minutes is within the maximum. |
| T07 | 720–841 | false | AC2 | 121 minutes exceeds the maximum. |
| T08 | 570–600 | true | AC4 | It ends when the existing booking starts; they only touch. |
| T09 | 630–690 | false | AC4 | The candidate intersects the existing booking. |
| T10 | 570–690 | false | AC4 | The candidate contains the existing booking. |
| T11 | 615–645 | false | AC4 | The candidate is inside the existing booking. |
| T12 | 600–660 | false | AC4 | The candidate is identical to the existing booking. |
| T13 | 660–720, blocked | false | AC3 | A blocked room rejects even an otherwise available time. |
| T14 | 630–690, no bookings | true | AC4 | There is no booking to overlap. |
| AC5 | 720–780; compare bookings with a copy | true, unchanged | AC5 | Availability must not add or alter booking data. |
| X1 | 1420–1440 | true | AC1 | The interval ends exactly at the allowed day boundary. |
| X2 | 660–720 between 600–660 and 720–780 | true | AC4 | It touches both bookings but overlaps neither. |

## 4. Task 3 — the generation prompt and the first suite

The first suite was assembled by Codex in this task from the supplied case table; a separate fresh
chat was not used. The suite in `suites/first/booking.test.ts` preserves that initial version,
including its incorrect T06 expectation, so the review and failure are visible. The following is
the required generation prompt reconstructed for the report, followed by an AI-generated draft
answer. Neither is a transcript from a separate chat; the chat comparison procedure remains incomplete.

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case
table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh
fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests
ourselves.

Case table: T01–T14, AC5, X1, and X2 as listed in section 3. This prompt text was not actually sent.
```

```text
The initial file is suites/first/booking.test.ts. It imports the real canBook from ./booking and
Vitest, asserts each exact Boolean result, uses fixed time and fresh fixtures, checks AC5 data
preservation, and includes X1 and X2. It incorrectly expects T06 (720–840, exactly 120 minutes)
to be unavailable. The actual first run exposed that error. No ambiguous acceptance criterion
was flagged by the generated file.
```

The first suite was saved before review: **yes**.

## 5. Task 4 — review of the first suite

| # | Test or part of the suite | What is weak or wrong | Decision | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | T06 expected value | It expects exactly 120 minutes to be unavailable. | revise | AC2 rejects only durations longer than 120 minutes. |
| 2 | T01, T08 imports and assertions | Both use the real module and assert exact results. | accept | This checks AC4 endpoint behavior directly. |
| 3 | AC5 | It uses an available request and compares the bookings to a pre-call copy. | accept | A rejected request would not reach a possible mutation. |

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-07/app

 ❯ src/booking.test.ts (17 tests | 1 failed) 4ms
   ✓ T01 AC4: touching after is available 1ms
   ✓ T02 AC1: starting at now is unavailable 0ms
   ✓ T03 AC1: zero duration is unavailable 0ms
   ✓ T04 AC1: reversed candidate is unavailable 0ms
   ✓ T05 AC1: end after midnight is unavailable 0ms
   × T06 AC2: exactly 120 minutes is unavailable 3ms
     → expected true to be false // Object.is equality
   ✓ T07 AC2: 121 minutes is unavailable 0ms
   ✓ T08 AC4: touching before is available 0ms
   ✓ T09 AC4: partial overlap is unavailable 0ms
   ✓ T10 AC4: containing a booking is unavailable 0ms
   ✓ T11 AC4: request inside a booking is unavailable 0ms
   ✓ T12 AC4: identical interval is unavailable 0ms
   ✓ T13 AC3: blocked room is unavailable 0ms
   ✓ T14 AC4: free interval with no bookings is available 0ms
   ✓ AC5: an available request leaves bookings unchanged 0ms
   ✓ X1 AC1: a request ending exactly at 1440 is available 0ms
   ✓ X2 AC4: a request touching two bookings is available 0ms

 FAIL  src/booking.test.ts > T06 AC2: exactly 120 minutes is unavailable
AssertionError: expected true to be false // Object.is equality

 Test Files  1 failed (1)
      Tests  1 failed | 16 passed (17)
```

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| T06 | The function returned true, while the first suite expected false. | Compare 720–840 with AC2's 120-minute maximum. | Test repair | Changed the expectation to true; implementation already followed AC2. |

### 6.2 The improvement prompt

The deck's improvement prompt was not sent to a separate assistant chat. I reviewed the observed
failure against AC2 and corrected T06 myself. The reconstructed prompt and AI-generated draft below
are included to document a possible review response, not as a real chat exchange.

```text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes. The prompt is reconstructed for the checklist and was not sent to a separate chat.
```

**AI-generated draft answer (not a chat transcript):** T06 is the incorrect expectation: AC2 permits durations up to and including 120 minutes, so 720–840 should expect `true`; repair the test, not the implementation. Keep T07 at 121 minutes as unavailable. The overlap tests already check touching intervals and multiple overlap shapes. AC5 appropriately compares booking data before and after an available request. Preserve the actual failure output and report this as a test repair. No other listed expectation needs changing.

### 6.3 The final run

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-07/app

 ✓ src/booking.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
```

## 7. Task 6 — deliberate defects

| Trial | Intentional change | Detected / Survived | Failing test IDs | If it survived |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 | Detected | T06 | — |
| M2 | Treat touching endpoints as overlaps | Detected | T01, T08, X2 | — |
| M3 | Remove blocked-room rejection | Detected | T13 | — |

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-07/app
 FAIL  src/booking.test.ts > T06 AC2: exactly 120 minutes is available
 Tests  1 failed | 16 passed (17)
```

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-07/app
 FAIL  src/booking.test.ts > T01 AC4: touching after is available
 FAIL  src/booking.test.ts > T08 AC4: touching before is available
 FAIL  src/booking.test.ts > X2 AC4: a request touching two bookings is available
 Tests  3 failed | 14 passed (17)
```

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-07/app
 FAIL  src/booking.test.ts > T13 AC3: blocked room is unavailable
 Tests  1 failed | 16 passed (17)
```

All three trial changes were restored before the final green run: **yes**.

## 8. Task 7 — manual UI checks

The supplied screenshots document U1 Available for 11:00–12:00, U2 Unavailable after enabling the blocked-room
checkbox, U3 the message “Fill in the current time, the start and the end.” after clearing Start,
U4 at the 375 px emulated phone width, and U5 Available again for 12:00–13:00 while the existing
booking still showed 10:00–11:00. The screenshots are saved in `evidence/` with matching filenames.

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available | AC5 | Available; sample booking remains listed. | Pass |
| U2 | Enable blocked and check again | Unavailable replaces prior result | AC3, AC5 | Unavailable shown. | Pass |
| U3 | Clear a required input and submit | Understandable feedback | AC6 | Clear message asks for current time, start, and end. | Pass |
| U4 | Use a narrow phone width | Controls and result remain usable | AC6 | The supplied 375 px viewport screenshot shows stacked, usable controls, feedback, and bookings. | Pass |
| U5 | Repeat checks on same data | Existing bookings unchanged | AC5 | 10:00–11:00 remained listed after another Available check. | Pass |

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| None | All required UI screenshots are now included; no checker failures are being reported as known failures. |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 16 / 1 | 17 / 17 / 0 |
| Requirements with meaningful tests | AC1–AC5 covered; AC6 is manual | AC1–AC5 covered; AC6 is manual |
| Selected mutants detected | Not run against this suite | M1, M2, and M3 detected |
| Accepted / revised / rejected tests | 2 accepted, 1 revised | 2 accepted, 1 revised |
| Remaining limitations | T06 expectation was wrong; fresh-chat procedure not performed | No separate generation/improvement chats; screenshot checks document supplied captures |

### 9.3 What no AC decides

With `bookings = [{ start: 700, end: 650 }]` and a 660–720 request, `canBook` returns **true**.
The overlap expression is `660 < 650 && 720 > 700`, which is false. No acceptance criterion
defines how invalid existing bookings should be handled. The declaration is `returns-true`.

## 10. Conclusion

The initial suite's T06 expectation was wrong: it treated a 120-minute request as unavailable even though AC2 rejects only requests longer than 120 minutes. The real first run exposed the mismatch, and changing the test expectation made the suite agree with the acceptance criterion. The final 17-test run proves the listed numeric cases pass, including exact duration, overlap boundaries, blocked rooms, and unchanged booking data; the three deliberate mutations were each detected by a relevant test. It does not prove every possible input is correct, nor does a unit test prove the page works at every screen size. The supplied browser screenshots show Available/Unavailable feedback, validation, the unchanged booking list, and a 375 px layout. The generation and improvement prompt answers above are AI drafts, not real chat transcripts, because separate fresh chats were not run; the assistant comparison part of the lab remains incomplete.
