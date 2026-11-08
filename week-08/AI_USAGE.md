# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level D — AI-integrated). Codex performed
implementation and report drafting in this task; the student remains responsible for reviewing the
result and any claims submitted.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex | not displayed | Week 07 baseline checks, test and report work | `../week-07/app/`, `../week-07/lab-report.md`, `../week-07/submission.yml` |
| Codex | not displayed | BUG-A/BUG-B reproduction and patches, skill text, diagnostic drafts, worksheet, declaration | `app/src/booking.ts`, `app/src/booking.test.ts`, `skills/bug-detector/SKILL.md`, `skills/bug-detector.zip`, `lab-report.md`, `submission.yml` |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** no. Codex
created the file using the deck's exact text; this is disclosed and does not claim the hand-typed
requirement was met.

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** no. Codex applied the two minimal code changes. The one-line overlap condition was
changed for BUG-A; the `bookings.push` mutation was removed for BUG-B and its comment corrected.

**I used another assistant as well:** no. The same Codex session produced both diagnostic drafts;
they were not separate fresh-chat transcripts and the skill was not shown as invoked.

**Every terminal output in `lab-report.md` was pasted from a real run, unedited:** no. The test
outcomes came from real terminal runs, but the worksheet includes selected output excerpts and
assistant-written diagnostic summaries rather than full unedited transcripts.

**I can explain both bugs and both fixes without the assistant:** not attested by Codex; the student
should confirm this personally before submitting.

**Anything I accepted from the AI without fully understanding it:** none claimed by Codex. The
student name, student ID, and GitHub username were supplied by Arsen Shakirov.

Signed: Arsen Shakirov  
Date: 8 November 2026
