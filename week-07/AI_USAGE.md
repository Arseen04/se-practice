# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level D — AI-integrated). The work was
reviewed against the handout and the terminal runs below are real.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex | not displayed | Drafted the initial 17-test suite in this working task; its T06 expectation was intentionally left incorrect to make the review failure observable | `app/src/booking.test.ts`, `suites/first/booking.test.ts` |
| Codex | not displayed | Reviewed the T06 failure against AC2 and revised the final suite | `app/src/booking.test.ts` |
| Codex | not displayed | Extracted `canBook`, prepared this report and declaration | `app/src/App.tsx`, `app/src/booking.ts`, `lab-report.md`, `submission.yml` |

**I used an assistant to extract `canBook` or fix a defect in it:** yes. Codex moved the existing
decision conditions from `App.tsx` into `booking.ts`; behavior was checked with the 17-test suite
and the browser.

**I used another assistant as well:** no. The same Codex session did the implementation and
documentation.

**`suites/first/` holds the assistant's first test file as generated:** yes, the initial suite made
in this task. It was not produced in a separate fresh chat.

**Every terminal output in `lab-report.md` was pasted from a real run, unedited:** the complete
first and final run excerpts and the mutant summary lines were copied from actual runs. The mutant
outputs are excerpts, not full terminal transcripts.

**I can explain every test in my final suite without the assistant:** not attested by Codex; the
student should confirm this personally before submitting.

**Anything accepted from AI without fully understanding it:** none claimed by Codex. The identity
and course declaration are user-provided; all other findings are described in the report.

Signed: Arsen Shakirov  
Date: 8 November 2026
