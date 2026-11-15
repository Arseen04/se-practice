# AI Usage Disclosure — Week 09

Generative AI use level D (AI-integrated) is disclosed. This submission is an AI-prepared draft for Arsen Shakirov and requires the student's review before submission.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Codex | not displayed | Part 2 — generated the R1 and R2 tool-call JSON and the R3 clarification question in this same task; not three fresh chats | `calls/r1.json`, `calls/r2.json`, `calls/r3.txt` |
| Codex | not displayed | Drafted and checked the schema, worksheet, and declaration against the provided checker | `tool/check_room.json`, `lab-report.md`, `submission.yml` |

**I wrote `tool/check_room.json` myself:** no. Codex drafted it from the supplied handout, then the 12 schema cases were run and all passed.

**I used an AI to explain a JSON Schema keyword or a check:** yes. Codex explained type, range, required fields, nested booking objects, and additional-property rejection while drafting the definition.

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes. The call files reproduce the outputs in section 4. They are not fresh-chat transcripts.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes. The first-run and final checker outputs are copied from actual runs.

**Anything accepted from the AI without fully understanding it:** None claimed by Codex. The student should review the schema and each decision before attesting to this statement.

Prepared by Codex for Arsen Shakirov; student review/signature pending.

Signed: Arsen Shakirov (student's personal sign-off pending)
Date: 15 November 2026
