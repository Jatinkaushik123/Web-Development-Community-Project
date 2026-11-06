# PROJECT INTERIM PROGRESS REPORT (PHASE 2 EVALUATION)

---

## 1. Project Identification & Metadata

* **Project Title:** MausamCrop: Weather-Based Vegetable & Crop Cultivation Guide
* **Repository / Slug:** `mausam-crop-guide` / `Web-Development-Community-Project`
* **Target Milestone:** Mid-Term Evaluation (Phase 2 Submission)
* **Team Composition & Roles:**
  * **Jatin Kaushik (Lead & Backend Architecture):** Express.js API design, HTTP lifecycle management, and JSON local persistence.
  * **Harshal Kamboj (Frontend Development):** Semantic markup, real-time client-side input validation, and asynchronous dispatch.
  * **Krishnanshu Singh (UI/UX & Styling Lead):** Design tokens, modular CSS architecture, responsive layout grid, and feedback states.
  * **Bakshish Batra (Data & Documentation Lead):** Data schema definition, form structural shells, bilingual localization dictionaries, and progress tracking.

---

## 2. Executive Summary

**MausamCrop** is an accessible, climate-smart web advisory platform designed to bridge meteorological data with agricultural decision-making for beginner home gardeners, balcony growers, and regional farmers. 

While Phase 1 established the UI layout, semantic HTML5 structure, and CSS design system, **Phase 2 successfully delivered an end-to-end full-stack data pipeline**. The application now features an expanded multi-page architecture, real-time client-side input validation, asynchronous API communication via the Fetch API, and local JSON file-system data persistence built with Node.js and Express.

---

## 3. Work Completed: Phase 1 vs. Phase 2 Breakdown

### 3.1 Phase 1 Review (Foundational Structure & UI/UX)
* **Semantic Web Architecture:** Built 4 core views (`index.html`, `location.html`, `results.html`, and `guide.html`) utilizing semantic landmarks (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
* **Modular Styling System:** Decoupled styles across `style.css` (design variables and base reset), `components.css` (cards, timeline steps, buttons), and `responsive.css` (fluid breakpoints for 960px, 768px, and 560px).
* **Accessibility (a11y):** Configured WCAG bypass links (`.skip-link`), WAI-ARIA controls (`role="tablist"`, `aria-selected`, `aria-current="page"`), and minimum 46px touch targets.
* **Prototyping & Project Initiation:** Designed full-screen wireframes in Figma, initiated GitHub Projects Kanban tracking, and authored the Project Charter.

---

### 3.2 Phase 2 Milestones (Evaluation Parameters Defense)

The platform was expanded to meet all four required evaluation parameters:

```
[Client-Side Form] (feedback.html)
        │
        ▼ (input / blur events)
[Real-Time Validation] (main.js)
        │
        ▼ (event.preventDefault & fetch POST)
[Asynchronous Dispatch]
        │
        ▼ (POST /api/submit)
[Express.js Middleware] (server.js - express.json, cors)
        │
        ▼ (fs.promises / fs.writeFileSync)
[Local Persistence] (server/data/submissions.json)
```

#### Parameter 1: Additional Pages & Seamless Site Interlinking
* Implemented a 5th interactive page: `client/feedback.html` (Farmer & Home Grower Advisory & Feedback Submission Portal).
* Standardized navigation headers and footers across all 5 views (`index.html`, `location.html`, `results.html`, `guide.html`, and `feedback.html`).
* Added dynamic route highlighting via `aria-current="page"` to indicate the user's active screen location.

#### Parameter 2: JavaScript Interactions & Real-Time Form Validation
* Attached native event listeners (`input`, `blur`) on individual input fields.
* Formulated comprehensive validation rules:
  * **Full Name:** Minimum 3 characters; alphabetic text validation.
  * **City / District:** Required, non-empty text input.
  * **Crop of Interest & Category:** Dropdown selection validation.
  * **Feedback / Query:** Minimum 15 characters to ensure actionable feedback.
* Implemented live UI feedback loops: invalid inputs display red focus rings and inline error alerts; valid fields display green confirm states.
* Submit button state is programmatically disabled until all field validations are resolved.

#### Parameter 3: Asynchronous Form Submission Pipeline
* Intercepted default browser form behavior using `event.preventDefault()` to stop full-page reloads.
* Form data is serialized into a structured JSON payload with ISO-formatted timestamps.
* Integrated the modern Fetch API (`fetch('/api/submit', { method: 'POST', ... })`) with transit state indicators:
  * Disables buttons and triggers a "Submitting..." state during transit.
  * Displays inline success toast banners and clears form inputs on successful receipt.
  * Catches network exceptions and displays accessible fallback alert banners.

#### Parameter 4: Local JSON File Data Persistence (Backend)
* Built an Express.js server in `server/server.js` configured with `cors()` and `express.json()` middleware.
* Constructed the `POST /api/submit` endpoint.
* Utilized the Node.js File System (`fs`) module to read existing records, append new submissions with generated unique IDs, and write data back to `server/data/submissions.json` safely without data corruption.

---

## 4. Current Repository Architecture

```text
mausam-crop-guide/
├── client/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   │       └── logo-removebg-preview.png
│   ├── css/
│   │   ├── components.css        # Cards, navigation, validation badges, feedback forms
│   │   ├── responsive.css        # Media queries (960px, 768px, 560px)
│   │   └── style.css             # Brand tokens (:root), typography, global reset
│   ├── js/
│   │   └── main.js               # Validation logic, DOM updates, async fetch pipeline
│   ├── lang/
│   │   ├── en.json               # English UI translation dictionary
│   │   └── hi.json               # Hindi UI translation dictionary
│   ├── feedback.html             # New interactive advisory form (Evaluation Phase 2)
│   ├── guide.html                # Cultivation tablist and timeline instructions
│   ├── index.html                # Landing hero, weather snapshot, and quick stepper
│   ├── location.html             # Geolocation selector & manual search fallback
│   └── results.html              # Weather-matched crop recommendation grid
├── docs/
│   ├── progress-report.md        # Phase 2 Interim Progress Report (this document)
│   └── project-charter.md        # Project Charter, problem definition, and scope
├── server/
│   ├── data/
│   │   └── submissions.json      # Local JSON database persisting user submissions
│   └── server.js                 # Express server & API endpoints
├── package.json                  # Project metadata, dependencies, and start scripts
└── README.md                     # Comprehensive project documentation
```

---

## 5. Team Contribution Matrix

| Team Member | Module & Assigned Files | Specific Technical Deliverables Completed |
| :--- | :--- | :--- |
| **Jatin Kaushik** | `server/server.js`, `server/data/`, `package.json` | Express server setup, middleware integration, `POST /api/submit` API creation, and file persistence via Node.js `fs`. |
| **Harshal Kamboj** | `client/js/main.js`, `client/index.html`, `client/location.html` | Real-time form validation logic, input event orchestration, form data extraction, and asynchronous dispatch via `fetch()`. |
| **Krishnanshu Singh** | `client/css/*`, `client/guide.html`, `client/results.html` | Form UI styling, interaction cues (red/green borders, alert toasts), responsive breakpoints, and UI component consistency. |
| **Bakshish Batra** | `client/feedback.html`, `client/lang/*`, `docs/*` | Feedback HTML structure, schema definition for `submissions.json`, bilingual dictionaries, and Phase 2 progress reporting. |

---

## 6. Testing, Verification & Viva Checklist

* [x] **Cross-Page Routing:** Verified navigation between all 5 pages (`index.html` $\leftrightarrow$ `location.html` $\leftrightarrow$ `results.html` $\leftrightarrow$ `guide.html` $\leftrightarrow$ `feedback.html`).
* [x] **Client-Side Validation:** Tested edge cases including empty inputs, short strings, and special characters; verified that inline errors and border color changes appear instantly.
* [x] **Asynchronous Submission:** Verified that submitting the form does not reload the page and that a loading indicator activates during transit.
* [x] **Persistence Check:** Confirmed that submissions correctly append to `server/data/submissions.json` with an incremented ID and an ISO timestamp.

---

## 7. Next Steps: Roadmap Toward Final Evaluation (Phase 3)

1. **Live Meteorological API Integration:** Connect client and backend ingestion pipelines to the **OpenWeatherMap API** for real-time temperature, humidity, and rainfall indicators.
2. **Database Migration (MongoDB Atlas & Mongoose):** Transition crop datasets and feedback submissions from static local JSON files into production NoSQL collections.
3. **Dynamic Crop Matching Routes:** Implement `GET /api/crops` with query filtering (`?temp=30&season=warm`) to replace mock crop arrays with database-driven results.
4. **Cloud Deployment:** Deploy the Express backend and client frontend on cloud hosting services (Render/Vercel) with production environment variable configurations.