# SIS #02 — AI-Assisted UML Modeling: University Course Registration

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the checker and the word counter. Delete them or leave them.
-->

## 1. Scope and assumptions

<!-- Your FINAL scope statement and assumptions, after reviewing Prompt A's output. Say here
     what is out of scope (payments, prerequisites, timetable clashes, waiting lists,
     cancellation) — section 2 must not mention them. Section 10 keeps your first version. -->

**Scope:** This work models how a signed-in student browses the course catalog for one semester and registers for one specific course offering, using a sequence diagram and a class diagram in PlantUML. It covers the success outcome and the two rejections, "course full" and "already enrolled". Payments, prerequisites, timetable clashes, waiting lists and cancellation are out of scope and are not modeled.

**Assumptions:**

1. Available places of an offering equal its capacity minus the number of its existing enrollments, and a catalog view does not reserve a place.
2. If two students request the last place at the same time, only one of them receives an Enrollment, and the other is rejected with "course full".
3. Rejection messages use the phrases "course full" and "already enrolled" from rule R5, and a rejection changes nothing in the system.

## 2. User stories and acceptance criteria

<!-- Your APPROVED requirements: Prompt A's draft after your review. Keep the IDs, the three
     story headings and the bullet shape. Every criterion names the rule(s) it maps to,
     e.g. (R2, R4). Two criteria per story. Nothing out of scope.
     Format of a criterion, on one bullet:
     - **AC-03** (R2, R4): Given ..., When ..., Then ... -->

### US-01 — Browse offerings

**US-01:** As a signed-in student, I want to see the offerings for one semester with their available places, so that I can choose an offering to register for.

- **AC-01** (R1): Given Fall 2026 contains LUN101 "Introduction to Lunar Cartography", Section A, with capacity 30 and 12 enrollments, When the student opens the catalog for Fall 2026, Then the catalog shows the code LUN101, the title, Section A and 18 available places (30 − 12).
- **AC-02** (R1): Given LUN205 "Orbital Folklore", Section B, has capacity 2 and 2 enrollments, When the student opens the catalog for its semester, Then the catalog shows LUN205 Section B with 0 available places (2 − 2), not a negative number or a blank.

### US-02 — Register for an offering

**US-02:** As a signed-in student, I want to request registration for a specific offering, so that I receive an enrollment and a confirmation.

- **AC-03** (R2, R3, R4): Given Mira Okafor has no enrollment in LUN101 Section A, and the offering has 18 available places when the request is processed, When Mira requests registration for that offering, Then exactly one Enrollment linking Mira and LUN101 Section A is created, available places drop to 17, and a confirmation is returned.
- **AC-04** (R2, R4): Given LUN310 "Comet Tail Acoustics", Section A, has capacity 1 and 0 enrollments, and Jonas Petrov is not enrolled in it, When Jonas requests registration, Then one Enrollment is created, enrollments equal capacity (1 of 1), available places are 0, and a confirmation is returned.

### US-03 — Receive a clear rejection

**US-03:** As a signed-in student, I want to be told why my registration request was refused, so that I know whether the offering is full or I am already enrolled.

- **AC-05** (R2, R5): Given LUN205 Section B has capacity 2, Lena Ito's catalog view showed 1 available place, but 2 of 2 places are now taken and Lena is not enrolled, When Lena requests registration for that offering, Then the request is rejected with the explanation "course full", no Enrollment is created, and the enrollment count stays at 2.
- **AC-06** (R3, R5): Given Mira Okafor already has an enrollment in LUN101 Section A, and the offering still has available places, When Mira requests registration for the same offering again, Then the request is rejected with the explanation "already enrolled", no second Enrollment is created, and both the enrollment count and available places are unchanged.

## 3. Sequence diagram

<!-- The FINAL diagram, rendered. Change .png to .svg if that is what you exported. -->

![Final sequence diagram](models/img/sequence.png)

**Participants:** (write here — each lifeline and what it stands for)

**Atomic operation:** (write here — which messages form the one atomic step: the final duplicate check, the capacity check and the creation of the Enrollment, and why a catalog view reserves nothing)

**Where the Enrollment is created:** (write here — which message, which lifeline, and which class in section 4 it produces)

**Technical lifelines:** (write here — every lifeline that is NOT a class in the class diagram, by name, and why the difference in abstraction is fine. "None" if there are none.)

## 4. Class diagram

<!-- The FINAL diagram, rendered. -->

![Final class diagram](models/img/classes.png)

<!-- One row per association in classes.puml, read in both directions. -->

| Association | Read left to right | Read right to left |
| --- | --- | --- |
| Student "1" -- "0..*" Enrollment : holds | One Student holds zero or more Enrollments | Each Enrollment is held by exactly one Student |
| CourseOffering "1" -- "0..*" Enrollment : receives | One CourseOffering receives zero or more Enrollments | Each Enrollment belongs to exactly one CourseOffering |
| Course "1" -- "1..*" CourseOffering : is offered as | One Course is offered as one or more CourseOfferings | Each CourseOffering is an offering of exactly one Course |

**How an Enrollment links a student to an offering:** An Enrollment has one association to Student and one to CourseOffering, each with multiplicity 1 on the other side, so every Enrollment belongs to exactly one student and exactly one offering and works as the link between them.

**Capacity constraint:** The number of Enrollments of one CourseOffering must never exceed its capacity (note N1, R2). Multiplicity alone cannot express it because 0..* has no upper bound and cannot refer to the value of an attribute that differs for each offering.

**Uniqueness constraint:** A Student has at most one Enrollment in the same CourseOffering (note N2, R3). Multiplicity alone cannot express it because the two associations only say how many Enrollments each side may have, not that a given pair of student and offering may appear once.

## 5. Traceability

<!-- Every rule, including the catalog fields and availability (R1). Column 1: the rule and
     the criteria that cover it, e.g. "R2 + AC-03, AC-04". Column 2: the message, guard,
     class or constraint that shows the rule in YOUR diagrams. Column 3: the T-ID that
     exercises it, or the extra check you did instead (R1 has no T case). -->

| Rule and criterion | Model evidence | Validation case |
| --- | --- | --- |
| R1 + AC-01, AC-02 | Message "read offerings with course code and title, capacity and enrollment count for semester" and reply "show code, title, offering and available places"; Course code and title, CourseOffering semester and capacity | Extra check: AC-02 zero places, capacity 2 and 2 enrollments gives 0 places |
| R2 + AC-03, AC-04, AC-05 | Message "read current count and capacity of offering", branch "course full (count >= capacity)", block "critical atomic registration" and its note, note N1 | T2, T3 |
| R3 + AC-03, AC-06 | Message "check duplicate: enrollment exists for student and offering", guard "already enrolled", note N2 | T4 |
| R4 + AC-03, AC-04 | Messages "create Enrollment(student, offering)", "Enrollment saved, count increased by one" and "confirm registration" in the last branch | T1, T2 |
| R5 + AC-05, AC-06 | Rejection messages "rejected, already enrolled" and "rejected, course full (count >= capacity)", with no create message in those branches | T3, T4 |
## 6. Walkthroughs

<!-- Walk each case through YOUR final sequence diagram, message by message. Column 2: the
     actual steps and the state change (count before → after). Column 3 starts with Pass or
     Fail, then the location: the message, guard or note where you saw it. A Fail you
     report honestly is a finding, not a penalty. -->

| Case | Observed path and state change | Judgment and evidence |
| --- | --- | --- |
| T1. Available | Student sends register into the atomic block. The duplicate check returns that no enrollment exists. The read returns count 0 and capacity 2, so the third branch runs: create Enrollment, saved, then confirm registration. The enrollment count changes from 0 to 1. | Pass. Branch "else not enrolled and places left": messages "create Enrollment(student, offering)" then "confirm registration". |
| T2. Last place | Register enters the atomic block. No duplicate is found, the read returns count 1 and capacity 2, so 1 is below 2 and the third branch runs. One Enrollment is created and confirmed. The count changes from 1 to 2 and no places remain. | Pass. Same branch "else not enrolled and places left"; the count after creation equals capacity, which note N1 allows. |
| T3. Full | The catalog showed a place, then register enters the atomic block and the read returns count 2 and capacity 2. No duplicate exists, so the first guard is false and "else course full" runs. The reply is "rejected, course full (count >= capacity)". The count stays 2. | Pass. Branch "else course full": rejection message with no create message; the catalog note states that the view may be stale. |
| T4. Duplicate | The same student sends register again. The duplicate check finds an existing enrollment, so the first branch "already enrolled" runs and replies "rejected, already enrolled". No create message is sent and the count stays 1. | Pass. Branch "alt already enrolled": rejection message only, checked before the capacity branch. |

## 7. Review decisions

<!-- At least three substantive decisions about Prompt C's critique or your own inspection.
     Decision: accepted / rejected / modified — and what you did. Reason: why, in a full
     sentence. Rule: R1–R5. Do not invent an error to fill the table; a justified rejection
     of advice counts. -->

| AI suggestion or model element | Decision | Reason | Rule |
| --- | --- | --- | --- |
| D3: the catalog read message in the original sequence did not fetch the course code and title | Accepted: changed the message to read offerings with course code and title, capacity and enrollment count for semester | AC-01 requires the catalog to show the code and title, which the original read never fetched | R1 |
| D2: alt guards renamed to enrollment exists and count >= capacity | Modified: kept the guards already enrolled, course full and not enrolled and places left, and added count >= capacity to the course full rejection message | The assignment requires the exact guard wording, and renaming the duplicate guard would hide the already enrolled rule | R2, R3 |
| D1: the group atomic registration is only a label and not a critical region | Modified: replaced the group with a critical block named atomic registration and kept the atomic note | The assignment accepts a note, but a critical block makes the atomic intent part of the diagram at no cost | R2 |
| AC-05: the AI's version had two students requesting the last place at the same time | Modified: rewrote it as the stale catalog view case with 2 of 2 places taken, rejected as course full | The sequence diagram shows one request, and without this change case T3 had no acceptance criterion | R2, R5 |

## 8. Modeling explanation

<!-- 200–300 words. Your main design choices; how the class diagram and the sequence diagram
     complement each other; why an activity diagram could also help explain the workflow. -->

I kept the model small and used the four required classes. Student, Course, CourseOffering and Enrollment are the domain concepts, and Enrollment is the link between a student and one offering. I stored capacity on CourseOffering and treated available places as derived: capacity minus the number of its Enrollments. This avoids a second number that could drift out of sync, and it means that updating availability in R4 happens when the Enrollment is created. Capacity and uniqueness are written as two separate notes, because multiplicity alone cannot express a per-offering limit or a rule about a student and offering pair.

The sequence diagram shows what the class diagram cannot. It separates browsing from registering and states that a catalog view reserves no place. The final duplicate check, the capacity check and the creation of the Enrollment sit inside one critical block marked atomic, so two students cannot take the same last place. The three alternatives are already enrolled, course full, and not enrolled and places left. Rejections return a reason and create nothing, and the confirmation comes only after creation.

The diagrams complement each other. The class diagram says what exists and which constraints must hold, and the sequence diagram says in which order the system checks them and which message creates the Enrollment. Both use the same names.

An activity diagram could also help. It would show the whole registration workflow as one flow of decisions, with the two rejection exits and the success path, so a reader could follow the process without thinking about lifelines.

## 9. Reflection

<!-- 150–200 words. Written by you, not by the assistant: where AI helped, one decision you
     made yourself, one remaining limitation. Specific beats flattering. -->

Claude helped most at the start. In one pass it produced the stories, the six criteria and both diagrams, so I had something concrete to check instead of a blank page. The critique in a new chat was useful too: it noticed that the catalog read never fetched the course code and title that AC-01 requires.

One decision was mine. The AI's version of AC-05 had two students asking for the last place at the same time, but my sequence diagram shows a single request, so I could not walk that criterion through it, and the stale catalog case from T3 had no criterion. I rewrote AC-05 around the stale catalog view. I also rejected the suggestion to rename the guards, because the exact wording is required and the renamed duplicate guard would no longer say already enrolled.

A limitation remains. Atomicity is only stated in a critical block and a note, so the diagram cannot prove that two real requests never interleave, and I did not test an implementation.

## 10. Appendix A — Before AI

<!-- Written BEFORE you run Prompt A, committed and pushed in your first commit, and never
     edited afterwards. This is what you paste into Prompt A as "My initial assumptions". -->

**Scope:** I model how a signed-in student registers for one specific course offering in a university catalog, using a sequence diagram and a class diagram. Payments, prerequisites, timetable clashes, waiting lists and cancellation are outside this work.

**Initial assumptions:**

1. Available places equal the capacity of an offering minus the number of its existing enrollments.
2. If two students request the last place at the same time, only one succeeds and the other gets a "course full" answer.

## 11. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the ~~~~ block that follows its label: AI responses contain ``` PlantUML blocks, and
     ~~~~ keeps them from breaking this file. Prompts B and C: the prompt text first, then
     the material it refers to ("below", "these two") pasted under it, in the same block.
     You may add B5, B6 … after B4 if you ran more. -->

### B1 — Requirements (Prompt A)

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-18
- **Purpose:** draft 3 user stories and 6 acceptance criteria

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

~~~~text
Act as a requirements analyst. Use only this course registration scenario and rules R1–R5: A student browses an electronic course catalog, chooses a course offering and requests registration. Each offering has a limited number of places. A Course describes a subject. A CourseOffering is one scheduled section in one semester. Registration always targets a specific offering. Assume that the student is signed in, the selected offering exists, and its capacity is a positive whole number. Exclude payments, prerequisites, timetable clashes, waiting lists and cancellation. Use fictional students and courses.
R1. Catalog: Show the course code, title, offering and available places for one semester.
R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity.
R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request.
R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation.
R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged.
My initial assumptions are <<1. Available places equal the capacity of an offering minus the number of its existing enrollments.
2. If two students request the last place at the same time, only one succeeds and the other gets a "course full" answer.>>.
Draft 3 user stories and 2 Given / When / Then acceptance criteria for each. Use IDs US-01 to US-03 and AC-01 to AC-06. Map each criterion to rule IDs.
Cover normal and rejection behavior. List uncertainty separately. Do not add excluded features or invent university policies.
~~~~

**Response:**

~~~~text
Thanks. I checked both assumptions against R1-R5 and the stories. Neither contradicts a rule. A1 is consistent with the figures already in AC-01 to AC-04. A2 resolves one of my earlier uncertainties, so I changed AC-05 to cover it. Everything else is as before.

## User stories

**US-01: Browse the catalog.** As a signed-in student, I want to see the offerings for one semester with their available places, so that I can choose an offering to register for.

**US-02: Register for an offering with a free place.** As a signed-in student, I want to request registration for a specific offering, so that I receive an enrollment and a confirmation.

**US-03: Understand a rejected registration.** As a signed-in student, I want to be told why my registration request was refused, so that I know whether the offering is full or I am already enrolled.

## Acceptance criteria

| ID | Story | Type | Rules | Assumption |
|---|---|---|---|---|
| AC-01 | US-01 | Normal | R1 | A1 |
| AC-02 | US-01 | Boundary (zero places) | R1 | A1 |
| AC-03 | US-02 | Normal | R2, R3, R4 | A1 |
| AC-04 | US-02 | Boundary (last place) | R2, R4 | A1 |
| AC-05 | US-03 | Rejection (full, simultaneous requests) | R2, R4, R5 | A1, A2 |
| AC-06 | US-03 | Rejection (duplicate) | R3, R5 | A1 |

**AC-01 (R1)**
- **Given** Fall 2026 contains LUN101 "Introduction to Lunar Cartography", Section A, with capacity 30 and 12 enrollments,
- **When** the student opens the catalog for Fall 2026,
- **Then** the catalog shows the code LUN101, the title, Section A and 18 available places (30 − 12).

**AC-02 (R1)**
- **Given** LUN205 "Orbital Folklore", Section B, has capacity 2 and 2 enrollments,
- **When** the student opens the catalog for its semester,
- **Then** the catalog shows LUN205 Section B with 0 available places (2 − 2), not a negative number or a blank.

**AC-03 (R2, R3, R4)**
- **Given** Mira Okafor has no enrollment in LUN101 Section A, and the offering has 18 available places when the request is processed,
- **When** Mira requests registration for that offering,
- **Then** exactly one Enrollment linking Mira and LUN101 Section A is created, available places drop to 17, and a confirmation is returned.

**AC-04 (R2, R4)**
- **Given** LUN310 "Comet Tail Acoustics", Section A, has capacity 1 and 0 enrollments, and Jonas Petrov is not enrolled in it,
- **When** Jonas requests registration,
- **Then** one Enrollment is created, enrollments equal capacity (1 of 1), available places are 0, and a confirmation is returned.

**AC-05 (R2, R4, R5)**
- **Given** LUN205 Section B has capacity 2 and 1 enrollment (1 place left), and neither Lena Ito nor Tomas Varga is enrolled in it,
- **When** Lena and Tomas both request registration at the same time,
- **Then** exactly one of them receives an Enrollment and a confirmation, the other is rejected with "course full" and gets no Enrollment, and the final enrollment count is 2 (never 3).

**AC-06 (R3, R5)**
- **Given** Mira Okafor already has an enrollment in LUN101 Section A, and the offering still has available places,
- **When** Mira requests registration for the same offering again,
- **Then** the request is rejected with the explanation "already enrolled", no second Enrollment is created, and both the enrollment count and available places are unchanged.

## Uncertainties (unresolved, nothing further assumed)

1. **Both rejection reasons at once.** If an offering is full and the student is already enrolled, the rules don't say which explanation to show, or whether to show both. A2 covers only the "full" case for a student who is not enrolled.
2. **Full offerings in the catalog.** R1 doesn't say whether full offerings stay visible or can be selected. AC-02 assumes only that they are shown with 0 places.
3. **Which simultaneous request wins.** A2 says only one succeeds, but not which one, and "at the same time" is not defined (same instant, overlapping processing). AC-05 deliberately accepts either outcome.
4. **A2 is not a rule.** R2 requires that capacity is never exceeded, but "the loser gets 'course full'" is an assumption, so it needs confirmation from the stakeholder.
5. **Confirmation content.** R4 requires a confirmation but doesn't specify what it contains.
6. **Rejection wording.** R5 quotes "course full" and "already enrolled", but it's unclear whether they must appear verbatim.
7. **Semester selection.** R1 says "one semester" but doesn't say how the student chooses it or whether there is a default.
8. **Catalog freshness.** R2 requires a recheck only at registration, so it's unclear whether the catalog's availability figure must be live or may be slightly stale.
9. **Failure handling.** The rules say nothing about errors or interrupted requests, so no criterion covers them.

Excluded and not covered: payments, prerequisites, timetable clashes, waiting lists and cancellation.

**Trade-off:** AC-05 now covers the simultaneous case, so the plain "full when the request arrives" case has no separate criterion. I can restore that case as a third criterion for US-03 if you want it, though that would break the two-per-story limit.
~~~~

### B2 — UML drafts (Prompt B)

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-18
- **Purpose:** draft the sequence and class diagrams

**Prompt:**

~~~~text
Using my approved scenario, R1–R5, stories and criteria below, return separate PlantUML code blocks for a sequence diagram and a domain class diagram.
Sequence: include catalog browsing and guarded success, full-course and duplicate outcomes. Model final checks and creation as one atomic operation.
Class: show domain concepts, useful attributes and multiplicities. State the capacity and uniqueness constraints. Explain assumptions and any technical lifelines.

US-01: As a signed-in student, I want to see the offerings for one semester with their available places, so that I can choose an offering to register for.
- AC-01 (R1): Given Fall 2026 contains LUN101 "Introduction to Lunar Cartography", Section A, with capacity 30 and 12 enrollments, When the student opens the catalog for Fall 2026, Then the catalog shows the code LUN101, the title, Section A and 18 available places (30 − 12).
- AC-02 (R1): Given LUN205 "Orbital Folklore", Section B, has capacity 2 and 2 enrollments, When the student opens the catalog for its semester, Then the catalog shows LUN205 Section B with 0 available places (2 − 2), not a negative number or a blank.

US-02: As a signed-in student, I want to request registration for a specific offering, so that I receive an enrollment and a confirmation.
- AC-03 (R2, R3, R4): Given Mira Okafor has no enrollment in LUN101 Section A, and the offering has 18 available places when the request is processed, When Mira requests registration for that offering, Then exactly one Enrollment linking Mira and LUN101 Section A is created, available places drop to 17, and a confirmation is returned.
- AC-04 (R2, R4): Given LUN310 "Comet Tail Acoustics", Section A, has capacity 1 and 0 enrollments, and Jonas Petrov is not enrolled in it, When Jonas requests registration, Then one Enrollment is created, enrollments equal capacity (1 of 1), available places are 0, and a confirmation is returned.

US-03: As a signed-in student, I want to be told why my registration request was refused, so that I know whether the offering is full or I am already enrolled.
- AC-05 (R2, R5): Given LUN205 Section B has capacity 2, Lena Ito's catalog view showed 1 available place, but 2 of 2 places are now taken and Lena is not enrolled, When Lena requests registration for that offering, Then the request is rejected with the explanation "course full", no Enrollment is created, and the enrollment count stays at 2.
- AC-06 (R3, R5): Given Mira Okafor already has an enrollment in LUN101 Section A, and the offering still has available places, When Mira requests registration for the same offering again, Then the request is rejected with the explanation "already enrolled", no second Enrollment is created, and both the enrollment count and available places are unchanged.
~~~~

**Response:**

~~~~text
Here are the two diagrams and the explanation.

Sequence diagram
plantuml
@startuml
title Course registration - sequence (R1-R5)

actor Student
participant CatalogService
participant RegistrationService
database EnrollmentStore

== Catalog browsing (R1) ==
Student -> CatalogService : browse catalog for semester
CatalogService -> EnrollmentStore : read offerings, capacity and enrollment count
EnrollmentStore --> CatalogService : offerings with counts
CatalogService --> Student : show code, title, offering and available places
note right of CatalogService
  A catalog view does not reserve a place.
  The figure shown may be stale by the time
  the student registers.
end note

== Registration request ==
Student -> CatalogService : select offering
Student -> RegistrationService : register(student, offering)

group atomic registration (final checks and creation)
  RegistrationService -> EnrollmentStore : check duplicate: enrollment exists for student and offering
  EnrollmentStore --> RegistrationService : exists or not
  RegistrationService -> EnrollmentStore : read current count and capacity of offering
  EnrollmentStore --> RegistrationService : count and capacity

  alt already enrolled
    RegistrationService --> Student : rejected, already enrolled
  else course full
    RegistrationService --> Student : rejected, course full
  else not enrolled and places left
    RegistrationService -> EnrollmentStore : create Enrollment(student, offering)
    EnrollmentStore --> RegistrationService : Enrollment saved, count increased by one
    RegistrationService --> Student : confirm registration
  end

  note over RegistrationService, EnrollmentStore
    The duplicate check, the capacity check and the creation
    of the Enrollment form ONE atomic operation. No other request
    can change the count between the check and the creation,
    so two students cannot take the same last place (R2).
  end note
end
@enduml
Domain class diagram
plantuml
@startuml
title Course registration - domain classes

class Student {
  studentId : String
  name : String
}

class Course {
  code : String
  title : String
}

class CourseOffering {
  offeringId : String
  semester : String
  section : String
  capacity : int
  availablePlaces() : int
}

class Enrollment {
  enrollmentId : String
}

Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : receives >
Course "1" -- "1..*" CourseOffering : is offered as >

note "Capacity (R2): the number of Enrollments of one CourseOffering\nmust never exceed its capacity (a positive whole number).\nAvailable places = capacity - number of Enrollments." as N1
N1 .. CourseOffering

note "Uniqueness (R3): for one Student and one CourseOffering\nthere is at most one Enrollment." as N2
N2 .. Enrollment
@enduml
Assumptions
Available places are derived: capacity minus the number of existing Enrollments (your assumption A1). They are not stored separately, so "update availability" in R4 happens automatically when an Enrollment is created.
When a request meets a full offering, the student gets "course full" (A2). Competing requests are serialized by the atomic operation, so the second one sees the updated count.
If an offering is both full and already held by the student, the diagram reports "already enrolled" first. The rules do not define this order, so it is a design choice that needs confirmation.
Rejections return only a reason. They create, save and update nothing (R5).
The student is signed in and the offering exists, as the scenario states, so there are no authentication or "offering not found" paths.
Technical lifelines
CatalogService and RegistrationService are application services. They are not domain concepts, so they do not appear in the class diagram. They stand for the behavior of browsing and registering.
EnrollmentStore is a persistence lifeline. It represents wherever Enrollments, capacities and counts are kept, and it is where the atomic step is enforced. The class diagram models what is stored (Student, Course, CourseOffering, Enrollment), while the sequence diagram models who does the work, so the difference in abstraction is intentional.
The Student actor in the sequence diagram corresponds to the Student class.
~~~~

### B3 — Model critique (Prompt C)

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-18
- **Purpose:** review both models against R1–R5 and T1–T4

**Prompt:**

~~~~text
Review these two UML models against R1–R5 and my acceptance criteria. Check message order, guards, state changes, multiplicities and naming.
Inspect the four validation cases: available places, exactly one place, full course after a stale catalog view, and duplicate registration.
For each issue, cite the affected rule and model element. Explain the impact and propose a focused correction. Separate genuine defects from optional design choices.

R1. Catalog: Show the course code, title, offering and available places for one semester.
R2. Capacity: Recheck current availability when registering. Enrollment must never exceed the offering's capacity.
R3. Duplicates: A student may have at most one enrollment in the same offering. Reject a repeat request.
R4. Success: Create exactly one Enrollment linking the student and offering, update availability and return a confirmation.
R5. Rejection: Explain "course full" or "already enrolled". Create no enrollment and leave the enrollment count unchanged.

--- models/original/sequence.puml ---
@startuml
title Course registration - sequence (R1-R5)

actor Student
participant CatalogService
participant RegistrationService
database EnrollmentStore

== Catalog browsing (R1) ==
Student -> CatalogService : browse catalog for semester
CatalogService -> EnrollmentStore : read offerings, capacity and enrollment count
EnrollmentStore --> CatalogService : offerings with counts
CatalogService --> Student : show code, title, offering and available places
note right of CatalogService
  A catalog view does not reserve a place.
  The figure shown may be stale by the time
  the student registers.
end note

== Registration request ==
Student -> CatalogService : select offering
Student -> RegistrationService : register(student, offering)

group atomic registration (final checks and creation)
  RegistrationService -> EnrollmentStore : check duplicate: enrollment exists for student and offering
  EnrollmentStore --> RegistrationService : exists or not
  RegistrationService -> EnrollmentStore : read current count and capacity of offering
  EnrollmentStore --> RegistrationService : count and capacity

  alt already enrolled
    RegistrationService --> Student : rejected, already enrolled
  else course full
    RegistrationService --> Student : rejected, course full
  else not enrolled and places left
    RegistrationService -> EnrollmentStore : create Enrollment(student, offering)
    EnrollmentStore --> RegistrationService : Enrollment saved, count increased by one
    RegistrationService --> Student : confirm registration
  end

  note over RegistrationService, EnrollmentStore
    The duplicate check, the capacity check and the creation
    of the Enrollment form ONE atomic operation. No other request
    can change the count between the check and the creation,
    so two students cannot take the same last place (R2).
  end note
end
@enduml

--- models/original/classes.puml ---
@startuml
title Course registration - domain classes

class Student {
  studentId : String
  name : String
}

class Course {
  code : String
  title : String
}

class CourseOffering {
  offeringId : String
  semester : String
  section : String
  capacity : int
  availablePlaces() : int
}

class Enrollment {
  enrollmentId : String
}

Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : receives >
Course "1" -- "1..*" CourseOffering : is offered as >

note "Capacity (R2): the number of Enrollments of one CourseOffering\nmust never exceed its capacity (a positive whole number).\nAvailable places = capacity - number of Enrollments." as N1
N1 .. CourseOffering

note "Uniqueness (R3): for one Student and one CourseOffering\nthere is at most one Enrollment." as N2
N2 .. Enrollment
@enduml

--- My acceptance criteria ---
AC-01 (R1): Given Fall 2026 contains LUN101 "Introduction to Lunar Cartography", Section A, with capacity 30 and 12 enrollments, When the student opens the catalog for Fall 2026, Then the catalog shows the code LUN101, the title, Section A and 18 available places (30 − 12).
AC-02 (R1): Given LUN205 "Orbital Folklore", Section B, has capacity 2 and 2 enrollments, When the student opens the catalog for its semester, Then the catalog shows LUN205 Section B with 0 available places (2 − 2), not a negative number or a blank.
AC-03 (R2, R3, R4): Given Mira Okafor has no enrollment in LUN101 Section A, and the offering has 18 available places when the request is processed, When Mira requests registration for that offering, Then exactly one Enrollment linking Mira and LUN101 Section A is created, available places drop to 17, and a confirmation is returned.
AC-04 (R2, R4): Given LUN310 "Comet Tail Acoustics", Section A, has capacity 1 and 0 enrollments, and Jonas Petrov is not enrolled in it, When Jonas requests registration, Then one Enrollment is created, enrollments equal capacity (1 of 1), available places are 0, and a confirmation is returned.
AC-05 (R2, R5): Given LUN205 Section B has capacity 2, Lena Ito's catalog view showed 1 available place, but 2 of 2 places are now taken and Lena is not enrolled, When Lena requests registration for that offering, Then the request is rejected with the explanation "course full", no Enrollment is created, and the enrollment count stays at 2.
AC-06 (R3, R5): Given Mira Okafor already has an enrollment in LUN101 Section A, and the offering still has available places, When Mira requests registration for the same offering again, Then the request is rejected with the explanation "already enrolled", no second Enrollment is created, and both the enrollment count and available places are unchanged.
~~~~

**Response:**

~~~~text
# Review of the course registration models (R1-R5, AC-01 to AC-06)

Both models cover R1-R5, and all four validation cases come out correct. I found no case where the models allow a wrong outcome. The issues below are places where a guarantee depends on prose or an element is underspecified.

## Validation cases

| Case | ACs | Result | Why |
|---|---|---|---|
| Available places | AC-01, AC-03 | Pass | Duplicate check is false and count < capacity, so the third `alt` branch creates one Enrollment. Available places drop 18 → 17 and a confirmation follows. |
| Exactly one place | AC-04 | Pass, with a caveat (D2) | Count = capacity − 1 must route to creation, and the result is count = capacity, still allowed. This works only if "course full" means count ≥ capacity, which the diagram never states. |
| Full after stale view | AC-02, AC-05 | Pass, with a caveat (D1) | The catalog note says the view is stale. Registration rereads current count and capacity, finds 2 of 2 and rejects with "course full". No create message is sent, so the count stays 2. |
| Duplicate registration | AC-06 | Pass | The duplicate check comes first in the `alt`, so "already enrolled" is returned even when places remain. No create message is sent. |

## Genuine defects

**D1. Atomicity is asserted in a note, not modeled (R2).**
- **Element:** the `group atomic registration` fragment and the note over RegistrationService/EnrollmentStore in sequence.puml.
- **Problem:** `group` is a plain label with no UML semantics. The checks and the create are separate request/reply messages, so the diagram structurally allows two requests to interleave. Only prose says otherwise. The class model has the same weakness: the "never exceed capacity" invariant (N1) is an informal note.
- **Impact:** the AC-05 scenario (stale view, last place) is handled only if the note is honored. Implementers can read the diagram literally and build a check-then-insert race, which breaks R2.
- **Correction:** use a critical region so the intent is part of the model:
  ```
  critical atomic registration
    ... checks, alt, create ...
  end
  ```

**D2. Branch guards are not precise (R2, R5).**
- **Element:** the `alt` / `else` labels "already enrolled", "course full", "not enrolled and places left".
- **Problem:** the labels name outcomes, not conditions. "Course full" is not tied to count ≥ capacity, and the last branch repeats a condition instead of being the plain fallback.
- **Impact:** the exactly-one-place boundary (AC-04) depends on the reader inferring ≥ rather than >. An off-by-one there would overbook by one.
- **Correction:**
  ```
  alt enrollment exists
  else count >= capacity
  else count < capacity
  ```
  The branch messages keep their rejection texts.

**D3. Catalog read does not fetch what the catalog displays (R1, AC-01).**
- **Element:** the message `CatalogService -> EnrollmentStore : read offerings, capacity and enrollment count`.
- **Problem:** the response to the student shows code and title, which belong to Course, and the read never retrieves them. Available places are never shown to be derived either.
- **Impact:** this is a small traceability gap. The AC-01 output cannot be produced from the data the diagram fetches.
- **Correction:** change the message to `read offerings with course code and title, capacity and enrollment count for semester`.

## Optional design choices (not defects)

- **Formalizing constraints in classes.puml.** N1 and N2 are notes. OCL-style invariants (`enrollments->size() <= capacity`, `capacity > 0`, uniqueness of student+offering) would be stricter. Mark `availablePlaces()` as derived (capacity − number of Enrollments), which makes AC-02's "0, not negative" follow from the invariant.
- **`Course "1" -- "1..*" CourseOffering`.** This forces every Course to have at least one offering. No requirement says so, and `0..*` would allow a course that is not yet scheduled. It is harmless for the four cases.
- **Precedence of the two rejections.** Checking "already enrolled" before "course full" is a sensible choice, since a duplicate request on a full course is better told "already enrolled". No AC covers it, so write it down as a decision if you want it fixed.
- **`Student -> CatalogService : select offering`.** It has no reply and no effect on state. You could drop it or fold it into the register call.
- **Single store operation.** A conditional create such as `createIfAllowed(student, offering)` in the store would make atomicity structural. The `critical` region in D1 is the smaller change.
- **Confirmation content.** R4 only asks for "a confirmation", so including the enrollment ID and updated availability is a nicety.
- **Unmodeled failures.** Unknown offering, or a store failure on create, are outside R1-R5.
- **Terminology.** The sequence says "count", while the class model derives it from Enrollments. One sentence in the notes would align them.
~~~~

### B4 — Focused revision (Prompt D)

- **Tool:** Claude.ai
- **Model:** Claude Sonnet 5.5
- **Date:** 2026-10-18
- **Purpose:** apply my accepted review decisions
**Prompt:**

~~~~text
Revise the UML sources using only my accepted review decisions: (1) D3 accepted: in sequence.puml change the catalog read message to "read offerings with course code and title, capacity and enrollment count for semester". (2) D2 modified: keep the alt guards "already enrolled", "else course full" and "else not enrolled and places left" unchanged, and add the condition count >= capacity to the course full rejection message, so it reads "rejected, course full (count >= capacity)". (3) D1 modified: replace the group "atomic registration" with a critical block named "atomic registration" and keep the existing atomic note. No other changes are accepted; classes.puml stays unchanged. Keep justified existing elements and explain each change.
Preserve the agreed scope and rule IDs. Return both updated PlantUML blocks and a concise change log. Flag any unresolved issue.
Approved requirements: US-01: As a signed-in student, I want to see the offerings for one semester with their available places, so that I can choose an offering to register for.
AC-01 (R1): Given Fall 2026 contains LUN101 "Introduction to Lunar Cartography", Section A, with capacity 30 and 12 enrollments, When the student opens the catalog for Fall 2026, Then the catalog shows the code LUN101, the title, Section A and 18 available places (30 − 12).
AC-02 (R1): Given LUN205 "Orbital Folklore", Section B, has capacity 2 and 2 enrollments, When the student opens the catalog for its semester, Then the catalog shows LUN205 Section B with 0 available places (2 − 2), not a negative number or a blank.
US-02: As a signed-in student, I want to request registration for a specific offering, so that I receive an enrollment and a confirmation.
AC-03 (R2, R3, R4): Given Mira Okafor has no enrollment in LUN101 Section A, and the offering has 18 available places when the request is processed, When Mira requests registration for that offering, Then exactly one Enrollment linking Mira and LUN101 Section A is created, available places drop to 17, and a confirmation is returned.
AC-04 (R2, R4): Given LUN310 "Comet Tail Acoustics", Section A, has capacity 1 and 0 enrollments, and Jonas Petrov is not enrolled in it, When Jonas requests registration, Then one Enrollment is created, enrollments equal capacity (1 of 1), available places are 0, and a confirmation is returned.
US-03: As a signed-in student, I want to be told why my registration request was refused, so that I know whether the offering is full or I am already enrolled.
AC-05 (R2, R5): Given LUN205 Section B has capacity 2, Lena Ito's catalog view showed 1 available place, but 2 of 2 places are now taken and Lena is not enrolled, When Lena requests registration for that offering, Then the request is rejected with the explanation "course full", no Enrollment is created, and the enrollment count stays at 2.
AC-06 (R3, R5): Given Mira Okafor already has an enrollment in LUN101 Section A, and the offering still has available places, When Mira requests registration for the same offering again, Then the request is rejected with the explanation "already enrolled", no second Enrollment is created, and both the enrollment count and available places are unchanged.
Original sources: --- models/original/sequence.puml ---
@startuml
title Course registration - sequence (R1-R5)

actor Student
participant CatalogService
participant RegistrationService
database EnrollmentStore

== Catalog browsing (R1) ==
Student -> CatalogService : browse catalog for semester
CatalogService -> EnrollmentStore : read offerings, capacity and enrollment count
EnrollmentStore --> CatalogService : offerings with counts
CatalogService --> Student : show code, title, offering and available places
note right of CatalogService
  A catalog view does not reserve a place.
  The figure shown may be stale by the time
  the student registers.
end note

== Registration request ==
Student -> CatalogService : select offering
Student -> RegistrationService : register(student, offering)

group atomic registration (final checks and creation)
  RegistrationService -> EnrollmentStore : check duplicate: enrollment exists for student and offering
  EnrollmentStore --> RegistrationService : exists or not
  RegistrationService -> EnrollmentStore : read current count and capacity of offering
  EnrollmentStore --> RegistrationService : count and capacity

  alt already enrolled
    RegistrationService --> Student : rejected, already enrolled
  else course full
    RegistrationService --> Student : rejected, course full
  else not enrolled and places left
    RegistrationService -> EnrollmentStore : create Enrollment(student, offering)
    EnrollmentStore --> RegistrationService : Enrollment saved, count increased by one
    RegistrationService --> Student : confirm registration
  end

  note over RegistrationService, EnrollmentStore
    The duplicate check, the capacity check and the creation
    of the Enrollment form ONE atomic operation. No other request
    can change the count between the check and the creation,
    so two students cannot take the same last place (R2).
  end note
end
@enduml

--- models/original/classes.puml ---
@startuml
title Course registration - domain classes

class Student {
  studentId : String
  name : String
}

class Course {
  code : String
  title : String
}

class CourseOffering {
  offeringId : String
  semester : String
  section : String
  capacity : int
  availablePlaces() : int
}

class Enrollment {
  enrollmentId : String
}

Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : receives >
Course "1" -- "1..*" CourseOffering : is offered as >

note "Capacity (R2): the number of Enrollments of one CourseOffering\nmust never exceed its capacity (a positive whole number).\nAvailable places = capacity - number of Enrollments." as N1
N1 .. CourseOffering

note "Uniqueness (R3): for one Student and one CourseOffering\nthere is at most one Enrollment." as N2
N2 .. Enrollment
@enduml
My review decisions and evidence: D3 accepted because AC-01 requires the catalog to show the code and title, which the original read message never fetched (R1). D2 modified because the exact guard wording already enrolled / course full / not enrolled and places left is required, and renaming the duplicate guard would hide the already enrolled rule, so only the condition count >= capacity is added to the rejection message (R2, R3). D1 modified because a group is only a label, so a critical block makes the atomic intent part of the diagram while the note stays (R2). The class diagram was verified against R2 and R3 (capacity and uniqueness notes, multiplicities at both ends) and I accepted no change to it.
~~~~

**Response:**

~~~~text
Updated sequence diagram
plantuml
@startuml
title Course registration - sequence (R1-R5)

actor Student
participant CatalogService
participant RegistrationService
database EnrollmentStore

== Catalog browsing (R1) ==
Student -> CatalogService : browse catalog for semester
CatalogService -> EnrollmentStore : read offerings with course code and title, capacity and enrollment count for semester
EnrollmentStore --> CatalogService : offerings with counts
CatalogService --> Student : show code, title, offering and available places
note right of CatalogService
  A catalog view does not reserve a place.
  The figure shown may be stale by the time
  the student registers.
end note

== Registration request ==
Student -> CatalogService : select offering
Student -> RegistrationService : register(student, offering)

critical atomic registration
  RegistrationService -> EnrollmentStore : check duplicate: enrollment exists for student and offering
  EnrollmentStore --> RegistrationService : exists or not
  RegistrationService -> EnrollmentStore : read current count and capacity of offering
  EnrollmentStore --> RegistrationService : count and capacity

  alt already enrolled
    RegistrationService --> Student : rejected, already enrolled
  else course full
    RegistrationService --> Student : rejected, course full (count >= capacity)
  else not enrolled and places left
    RegistrationService -> EnrollmentStore : create Enrollment(student, offering)
    EnrollmentStore --> RegistrationService : Enrollment saved, count increased by one
    RegistrationService --> Student : confirm registration
  end

  note over RegistrationService, EnrollmentStore
    The duplicate check, the capacity check and the creation
    of the Enrollment form ONE atomic operation. No other request
    can change the count between the check and the creation,
    so two students cannot take the same last place (R2).
  end note
end
@enduml
Updated class diagram (unchanged)
plantuml
@startuml
title Course registration - domain classes

class Student {
  studentId : String
  name : String
}

class Course {
  code : String
  title : String
}

class CourseOffering {
  offeringId : String
  semester : String
  section : String
  capacity : int
  availablePlaces() : int
}

class Enrollment {
  enrollmentId : String
}

Student "1" -- "0..*" Enrollment : holds >
CourseOffering "1" -- "0..*" Enrollment : receives >
Course "1" -- "1..*" CourseOffering : is offered as >

note "Capacity (R2): the number of Enrollments of one CourseOffering\nmust never exceed its capacity (a positive whole number).\nAvailable places = capacity - number of Enrollments." as N1
N1 .. CourseOffering

note "Uniqueness (R3): for one Student and one CourseOffering\nthere is at most one Enrollment." as N2
N2 .. Enrollment
@enduml
Change log
#	Element	Change	Decision	Rule
1	Message CatalogService -> EnrollmentStore	Now reads "offerings with course code and title, capacity and enrollment count for semester", so the data needed for AC-01 is fetched.	D3, accepted	R1
2	Rejection message in else course full	Now reads "rejected, course full (count >= capacity)". The three guards are unchanged.	D2, modified	R2, R3
3	group atomic registration (...)	Replaced by critical atomic registration, closed by the same end. The atomic note is kept as it was.	D1, modified	R2

Everything else is unchanged, including all participants, the message order, the guards, the rejection branches (which still create, save, update or confirm nothing) and the whole class diagram. No change was made to classes.puml.
~~~~

## 12. Appendix C — Original diagrams

<!-- The AI's first output from Prompt B, rendered unedited from models/original/. -->

![Original sequence diagram](models/img/original-sequence.png)

![Original class diagram](models/img/original-classes.png)

## 13. Appendix D — References and source checks

### References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the source checks must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 5. -->

- (write here)

### Source checks

<!-- At least two modeling decisions you verified. Source and locator: title + slide, page,
     section, chapter or figure — or title + URL + access date (YYYY-MM-DD). Slide numbers
     refer to the decks posted in our Teams. -->

| Modeling decision | Source and locator | What the source says | How it supports or changed your model |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
