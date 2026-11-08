# Week 08 — Lab report

**Name:** Arsen Shakirov  
**Group:** not provided  
**Date:** 8 November 2026

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Codex |
| Exact model | not displayed |
| Where the skill was installed | prompt-only route selected; no fresh-chat simulation was completed |
| Where I ran the tests | my computer, in `week-08/app/` |
| Vitest version | 3.2.7 |
| Language of my booking module | ts |

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

Real run of the 17-test Week 07 suite on the copied Week 07 project before replacing `canBook`:

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-08/app

 ✓ src/booking.test.ts (17 tests) 2ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
```

### 2.2 The same suite on the provided canBook

Real run after copying the provided function body over `canBook` and before adding the two new
tests. T01, T08, X2, and AC5 failed; the AC5 failure demonstrates the mutation independently of
the endpoint failures because its request touches no booking.

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-08/app

 ❯ src/booking.test.ts (17 tests | 4 failed) 5ms
   × T01 AC4: touching after is available
   × T08 AC4: touching before is available
   × AC5: an available request leaves bookings unchanged
   × X2 AC4: a request touching two bookings is available

 FAIL  src/booking.test.ts > T01 AC4: touching after is available
 FAIL  src/booking.test.ts > T08 AC4: touching before is available
 FAIL  src/booking.test.ts > AC5: an available request leaves bookings unchanged
 FAIL  src/booking.test.ts > X2 AC4: a request touching two bookings is available

 Test Files  1 failed (1)
      Tests  4 failed | 13 passed (17)
```

### 2.3 One failing test per bug

Real run on the still-buggy function after adding the regressions. Both named tests fail for their
own asserted behavior; BUG-B uses a non-touching request.

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-08/app

 ❯ src/booking.test.ts (19 tests | 6 failed) 6ms
   × BUG-A AC4: touching two different endpoint bookings stays available
   × BUG-B AC5: an available non-touching request does not change bookings

 FAIL  src/booking.test.ts > BUG-A AC4: touching two different endpoint bookings stays available
 FAIL  src/booking.test.ts > BUG-B AC5: an available non-touching request does not change bookings

 Test Files  1 failed (1)
      Tests  6 failed | 13 passed (19)
```

## 3. Defect log

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | BUG-A | 780–900; bookings 720–780 and 900–960 | true | false | Provided `booking.ts` line 17 uses `start <= b.end && end >= b.start`; equality marks endpoint contact as overlap. |
| BUG-B | BUG-B | 800–860; booking 600–660 | true and original array unchanged | true, but array gains 800–860 | Provided `booking.ts` line 20 calls `bookings.push` on every available request. |

## 4. Tasks 2–3 — the skill

| Check | yes / no |
| --- | --- |
| Plain UTF-8 text, named exactly `SKILL.md` | yes |
| First and closing YAML delimiters are exactly `---` | yes |
| Lowercase hyphenated name; description says when to use it | yes |
| No passwords, keys, or private student data | yes |

The skill file was written by Codex from the exact procedure in the handout; it was not typed by
the student. The ZIP listing is:

```text
Archive:  skills/bug-detector.zip
  bug-detector/
  bug-detector/SKILL.md
  bug-detector/.gitkeep
```

No upload was made to ChatGPT or Claude. I did not complete the fallback in a separate fresh chat,
and there is no screenshot of an installed or simulated skill. The skill’s seven-step text is in
the ZIP, but this report does not claim the environment invoked it.

## 5. Task 4 — without the skill

The following is the baseline question and exact diagnostic input used for the Codex analysis in
this task. It was not sent in a separate fresh chat.

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Observed failure from section 2.2:
FAIL src/booking.test.ts > T01 AC4: touching after is available
Expected true, received false.

Provided canBook:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**Codex analysis prepared in this task (not a separate-chat transcript):**

```text
BUG-A is confirmed by T01. The request 660–720 touches the existing 600–660 booking at one endpoint, but the `<=` and `>=` comparisons classify equality as overlap. The minimal fix is `start < b.end && end > b.start`. A regression test should assert true for an endpoint-touching request. BUG-B is visible as a possible defect at `bookings.push`, but T01 does not prove it: the overlap return happens before that line. Use an available request that touches no booking, expect true, and compare the bookings array with a copy taken before the call. Do not edit code until that test is run.
```

## 6. Task 5 — with the skill

The input below repeats the section 5 acceptance criteria, failure, and code unchanged; only the
question differs. This is a Codex response drafted in this task, not a fresh chat with an installed
or invoked skill.

```text
Use the bug-detector skill to diagnose the failed room-booking test.

AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Observed failure from section 2.2:
FAIL src/booking.test.ts > T01 AC4: touching after is available
Expected true, received false.

Provided canBook:
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**Structured Codex diagnosis prepared with the skill text in view (not an invocation transcript):**

```text
Defect: BUG-A, confirmed.
Evidence: T01 expects true for 660–720 against 600–660; the observed result is false.
Root cause: line 17 uses inclusive endpoint comparisons, so touching is treated as overlap.
Fix: change the condition to `start < b.end && end > b.start`.
Test: keep T01 and add BUG-A for a request that touches bookings on both sides; expect true.

Defect: BUG-B, code defect present but not isolated by T01.
Evidence: line 20 pushes a slot into the array, but T01 returns from the overlap loop before reaching it.
Root cause: the availability function stores a booking as a side effect.
Fix: remove the push; preserve the input array.
Test: use an available, non-touching request; assert true and compare bookings with a pre-call copy.
```

Did the environment show that the skill was invoked? **not shown**. The text was not actually
loaded by a skill-enabled environment or pasted into a fresh simulation chat.

## 7. Comparison — judged against the actual code

| Criterion | No skill | With skill text in view |
| --- | --- | --- |
| Correct root cause | Correctly identifies the inclusive overlap condition. | Correctly identifies the same condition. |
| Reproducible test | Proposes endpoint-touch assertion and a separate non-touching mutation check. | Gives both concrete cases and exact expected result. |
| Minimal proposed patch | One comparison line for BUG-A; remove the push for BUG-B. | Same minimal changes. |
| Unsupported claims | Says BUG-B is visible in code but unproven by T01. | Separates the visible mutation from what T01 proves. |
| Clarity of explanation | Clear explanation tied to T01 and the code. | Clearer defect/evidence/root-cause/fix/test layout. |

Which bugs did each answer find? Both identified BUG-A and the BUG-B mutation in the code; both
correctly said T01 alone does not prove BUG-B. This is a content comparison, not evidence that an
installed skill improved a separate model run.

## 8. Task 6 — repair and regression

### 8.1 The BUG-A patch

```diff
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
```

Targeted BUG-A run:

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-08/app

 ✓ src/booking.test.ts (19 tests | 18 skipped) 1ms

 Test Files  1 passed (1)
      Tests  1 passed | 18 skipped (19)
```

The full run after BUG-A passed its endpoint tests and still failed the AC5 and BUG-B mutation
assertions: 2 failed, 17 passed (19). I then committed BUG-A separately.

### 8.2 The BUG-B patch and the final run

```diff
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
+  // Availability checks do not persist bookings.
```

Targeted BUG-B run:

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-08/app

 ✓ src/booking.test.ts (19 tests | 18 skipped) 1ms

 Test Files  1 passed (1)
      Tests  1 passed | 18 skipped (19)
```

Final full run:

```text
 RUN  v3.2.7 /Users/arsenshakirov/se-practice/week-08/app

 ✓ src/booking.test.ts (19 tests) 2ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
```

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

| Check | Why it stays |
| --- | --- |
| E1 | `evidence/install.png` is missing. No upload or fresh-chat prompt-only simulation was completed, so there is no genuine screenshot to commit. |

### 9.2 One limitation of AI-assisted debugging

This task did not use a separate fresh chat or an environment that could show skill invocation.
The two diagnostic drafts are based on the same code and observed test, but they cannot measure
whether a real uploaded or simulated skill changes a model’s answer. A screenshot was not saved,
so the report records that evidence gap instead of claiming the skill ran.

## 10. Conclusion (80–150 words)

Both diagnostic drafts found BUG-A from T01 and pointed to the inclusive endpoint comparison; both also noticed the `push` but correctly treated BUG-B as unproven by that touching request. The formatted diagnosis was easier to audit, yet this is not a fair skill experiment because neither response came from a separate fresh chat and the skill was never shown as invoked. The 19-test final run proves the listed acceptance cases, including endpoint contact and preservation of the bookings array, pass for this implementation; it does not prove every possible time interval or a live skill’s effect. The attempted local app checks support the behavior, but the required installation or simulation screenshot is missing.
