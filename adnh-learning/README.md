# ADNH People Development concept

Four-property, static interactive demonstration, created 26 November 2026.

## Properties

- SH: Sheraton Abu Dhabi Hotel & Resort
- LM: Le Méridien Abu Dhabi Resort
- RC: Radisson Blu Hotel & Resort, Abu Dhabi Corniche
- RA: Radisson Blu Hotel & Resort, Al Ain

## What works in the demonstration

Property-specific photography; five role views; linked colleague learning histories; trainer plans; calendar session creation; capacity-controlled nominations; hotel + employee-ID + sample-password login; required recovery-email and confirm-password sign-up screens; sample sign-up matching and administrator approval; an employee-ID-only forgot-password demonstration that resolves its destination exclusively from the saved account email; grants and revocation; account suspension; explicitly simulated password reset; local activity history; CSV templates, validation, preview and confirmed append-only imports; scoped CSV exports; three visual themes.

All 24 initial colleagues and their learning records are synthetic. Test changes persist in localStorage on one browser. No emails are sent. Only the published sample password `Demo@2026` is accepted; entered passwords are never stored. Recovery emails are restricted to fictional `@example.invalid` addresses in this demonstration. No paid services, API keys, payment details or billing accounts are connected. The existing GitHub Pages portfolio remains untouched outside the new `adnh-learning` directory.

## Boundary

This is not an employee authentication system. All client-side records and role controls are inspectable and bypassable. Do not import real staff details or evidence. GitHub Pages is static hosting; it does not supply a secure database, password service, access enforcement or backups. Free hosting here applies to the public demonstration. It is not a promise of unlimited free live infrastructure. No live infrastructure has been provisioned.

## Design review

The current trainer portal's source and operations guide were reviewed, alongside its repair record. The new concept retains trainer/session/nominations/learning/reporting functions and consolidates fragmented trackers. Rixos-specific brand programmes, fixed hotel targets, date-specific schedules, employee-specific repair patches and unrelated operational briefing parsing are not copied.

The Design & blueprint page distinguishes demonstrated improvements from live implementation requirements. Historical repaired issues are not asserted to remain active. This was a source-and-workflow assessment, not an exhaustive audit of production data or every existing live journey.

## Required before real accounts or employee data

1. Hotel + employee-ID + password login; required recovery email at sign-up; verify email ownership before enabling recovery. Match a verified invitation or identity to approved hotel + employee identity. Employee ID alone is not authentication. A sign-up password policy and confirmation field must be enforced on the server.
2. Backend sessions and default-deny authorisation on every row and file. Cluster grants, property grants, department scopes and self-only records must apply to exports too.
3. Secure password hashes or an identity provider; single-use expiring reset tokens; rate limits; reset-triggered session revocation. Admins initiate resets but cannot retrieve passwords.
4. Stable internal person IDs and effective-dated employment records. Composite property + employee code prevents collisions. Approved aliases must be retained without automatic fuzzy merges.
5. Transactional import batches, duplicate and ambiguity review, full-versus-partial roster declaration, and an approval step for leavers. Existing data must never disappear silently.
6. Separate planned, nominated, attended, assessed and certified states. Preserve participant minutes, co-trainer allocation, attendance evidence and certificate validity independently.
7. Protected evidence storage; confirm writes before success; append-only audit events with named actors and before/after changes; restore-tested backups.
8. Shared metric definitions and explicit period/eligible-cohort filters, snapshot history, reconciled exports, and monitored failure states. No hard-coded Rixos KPI target should become ADNH policy.
9. Mobile, accessibility and actual cross-device acceptance; adversarial cross-property access tests; member-to-admin escalation tests; sign-up/reset abuse checks; restore and rollback exercises.

## Validation

Run `node --test adnh-learning/tests/core.test.mjs` from the repository root.

The suite covers property scope, self-only records, department scope, employee-code collisions, access revocation, suspension, nomination/hour separation, CSV quoting, dates, duplicate records, cross-property import rejection, non-overwrite behavior, mixed invalid batches and spreadsheet formula escaping.

Local desktop browser checks exercised the login view, cluster overview, colleague search, sample sign-up, administrator approval, personal records and nomination without added hours. These checks are not a security certification. Mobile CSS is included; a device-sized browser audit is not claimed.

## Assets

Property images originate from the official Marriott and Radisson hotel galleries listed in `image-sources.html`, and remain the property of their respective owners. They illustrate the user's requested concept and are credited in the interface. The Century Gothic font files reuse the user's existing repository assets. Review branding and image permissions before an official rollout.

Photo update: native source sizes are 4000 × 2667 (Sheraton), 2400 × 1602 (Le Méridien), 3840 × 2560 (Corniche), and 3840 × 2558 (Al Ain), served from the original JPEG files at full dimensions.
Recovery never accepts a destination email from the form. A real implementation must also verify ownership of the on-file email, use single-use expiring tokens, throttle requests and return a uniform response. Changes to the registered recovery email require separate identity verification, with a People & Culture process for colleagues who have lost mailbox access.

## Rixos-style management dashboards

The management screens follow the reviewed Rixos dashboard structure: reporting period and department filters, total/average hours, learning participation, onboarding and mandatory-training indicators, top departments, OJT/off-job/online breakdowns, department comparisons, smart/full view, monthly submissions and a six-month evidence view.

System Admin and Cluster HR can see their assigned cluster. Hotel HR, GMs and Hotel Managers see assigned properties. HOD and trainer views are limited to assigned departments and properties; member records remain self-only. GMs and Hotel Managers have read-only management views. Admins can adjust a HOD or trainer's assigned department as well as property access.

The monthly submission demonstration supports Draft → Submitted → Reviewed → Accepted, with role-checked transitions and required review notes. Returns for correction are recorded. Approval never creates learning hours. Real workflow notifications are not connected.

Monthly and YTD totals use completion dates and the same records as exports. Current active roster headcount is labelled explicitly; historical snapshots are not invented. Blank historical months and missing quiz/feedback evidence are shown as unavailable. No ADNH monthly target is assumed. Existing local demo data is migrated from version 2 to version 3 without resetting imports, requests, access changes or audit history.

Department meetings and daily huddles are excluded from ADNH navigation and dashboards at the user’s request.
