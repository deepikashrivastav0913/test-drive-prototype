# DriveFlow — Test Drive Form Prototype

A local-only, responsive prototype for the assessment brief **Test Drive Form Creation, Adaptation & QA Automation**. DriveFlow is a fictional brand; model names, locations, and customer data are synthetic.

## Features
- Responsive desktop and mobile booking form.
- Model, customer, location, date, time, and consent fields.
- Client-side required-field, email, phone-length, and date validation.
- Market toggle for India, UK, and UAE that updates the dial code, phone guidance, and consent copy.
- Simulated API submission with generated reference ID; no network request, real lead, or data persistence.
- Playwright browser tests covering rendering, empty submission, malformed inputs, successful mock submission, market adaptation, and mobile layout.
- Accessible labels, visible focus styles, inline validation, and live status messages.

## Run locally
Requirements: Python 3 and Node.js/npm.

1. Open a terminal in this folder.
2. Run `npm install` to install Playwright.
3. Run `npm start` and open `http://localhost:4173`.
4. In a second terminal, run `npx playwright install chromium` once if Chromium is not installed.
5. Run `npm test` to execute the QA suite.

You can also run the UI without Node: `python3 -m http.server 4173`, then open `http://localhost:4173`.

## AI-assisted implementation notes
Suggested workflow for an assessment submission:
1. Ask an approved coding assistant to draft semantic form markup and responsive styles from the written brief.
2. Review generated code for accessibility, privacy, responsive behavior, and validation edge cases.
3. Ask the assistant to propose positive and negative browser tests, then run and refine those tests locally.
4. Record the exact approved tool/model, prompt(s), and any code changes made during the actual build. Do not claim a tool was used unless it was used.

Example prompt: “Build a responsive, accessible test-drive booking form for a fictional automotive brand. Use only synthetic data and a local mock submission; do not call external services. Include market-specific phone guidance and consent copy, client-side validation, and Playwright tests for positive and negative flows.”

## Market adaptation caveats
This is an illustrative demo, not a compliance-ready localization system. The market toggle cycles India → UK → UAE and demonstrates changes to dial code, phone-length guidance, and consent text. It does not geolocate users or provide legally reviewed privacy language. Production use requires market-owner review, validated phone-number libraries, translated content, accessibility QA, and legal approval.

## Safety and limitations
- No live CRM, production API, analytics account, or third-party form endpoint is used.
- Submissions are simulated in the browser and are not persisted.
- Do not enter real personal information in this prototype.
- The reference site is used only as a workflow inspiration; this UI, brand, illustrations, and model names are original/fictitious.
- No API keys or secrets are required.

## Deliverables
- `index.html`, `styles.css`, `app.js`: local working prototype.
- `tests/form.spec.js`: automated browser QA.
- `playwright.config.js`, `package.json`: test and local-run configuration.
