# MausamCrop 🌦️🌱
### Weather-Based Vegetable & Crop Cultivation Guide
**Academic Project Repository — Phase 2 Evaluation Submission**

---

## 📌 Project Overview
**MausamCrop** is an interactive, location-aware web platform designed to eliminate agricultural guesswork for novice growers, urban balcony gardeners, and regional farmers. By translating environmental parameters (temperature, humidity, rainfall) into localized crop recommendations and actionable cultivation guides, the platform bridges modern meteorological data with accessible agrarian advisory.

---

## 👥 Team Members & Role Distribution

| Team Member | Role | Assigned Modules & Directories | Core Responsibilities (Phase 2) |
| :--- | :--- | :--- | :--- |
| **Jatin Kaushik** *(Lead)* | Backend Architecture | `server/server.js`, `server/data/`, `package.json` | Express server setup, CORS & JSON middleware, `POST /api/submit` endpoint, local JSON file persistence via Node.js `fs`. |
| **Harshal Kamboj** | Frontend Logic Lead | `client/js/main.js`, `client/index.html`, `client/location.html` | Real-time input validation, event listeners (`input`, `blur`), asynchronous form dispatch via the browser's `fetch()` API. |
| **Krishnanshu Singh** | UI/UX & Styling Lead | `client/css/`, `client/guide.html`, `client/results.html` | Modular CSS architecture, responsive design breakpoints, UI interaction states (error borders, loading indicators, toast notifications). |
| **Bakshish Batra** | Data & Documentation Lead | `client/feedback.html`, `client/lang/`, `docs/`, `README.md` | Advisory form layout, data schema definition for `submissions.json`, bilingual dictionaries (`en.json`, `hi.json`), progress documentation. |

---

## 🚀 Progress & Work Done Till Evaluation 2

### 1. Phase 1 Milestones (Foundational UI & Static Architecture)
* **Semantic HTML5 Views:** Implemented 4 dedicated, accessible views (`index.html`, `location.html`, `results.html`, and `guide.html`) utilizing semantic landmarks (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
* **Modular CSS Design System:** Decoupled styles across `style.css` (design tokens, CSS reset, layout utilities), `components.css` (cards, timeline steps, buttons), and `responsive.css` (fluid breakpoints for 960px, 768px, and 560px).
* **Accessibility (a11y):** Integrated WAI-ARIA hooks (`role="tablist"`, `aria-selected`, `aria-current="page"`), keyboard skip links (`.skip-link`), and standardized touch targets (min. 46px).
* **Design & Collaboration:** Prototyped complete screen flows in Figma, established GitHub branching workflows (`feature/*`), and completed the Project Charter.

### 2. Phase 2 Milestones (Client Interactivity, Routing & Local Persistence)
For the Phase 2 Evaluation, all four official parameters have been implemented end-to-end:

* **Parameter 1: Additional Page Implementation & Page Linking**
  * Created a 5th dedicated interactive page: `client/feedback.html` (Farmer & Home Grower Advisory Query / Feedback Form).
  * Interlinked all 5 views seamlessly across the site via a unified `<header class="site-header">` navigation bar with active route indicators (`aria-current="page"`).
* **Parameter 2: Client-Side JavaScript Interactions & Form Validation**
  * Attached real-time event listeners (`input`, `blur`) on form inputs for instantaneous validation feedback.
  * Enforced validation rules (character lengths, name formats, required fields) with dynamic visual cues (green/red border state toggles, inline accessible error messages).
  * Configured interactive button states, disabling the submit trigger until validation criteria are satisfied.
* **Parameter 3: Asynchronous Form Submission Pipeline**
  * Intercepted standard browser page reloads using `event.preventDefault()`.
  * Packaged form field values into clean JSON payloads with client-side ISO timestamps.
  * Implemented asynchronous HTTP requests using the browser's `fetch()` API (`POST /api/submit`), handling transit states with loading indicators and confirmation toasts.
* **Parameter 4: Local JSON File Data Persistence (Backend)**
  * Initialized an Express.js server configured with `cors` and `express.json()` middleware.
  * Implemented the `POST /api/submit` endpoint in `server/server.js`.
  * Used the Node.js File System module (`fs`) to safely read existing records, append new feedback entries, and write back to `server/data/submissions.json` without data loss.

---

## 📂 Project Directory Structure

```text
mausam-crop-guide/
├── client/
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   │       └── logo-removebg-preview.png
│   ├── css/
│   │   ├── components.css        # UI modules (cards, navbar, badges, form panels)
│   │   ├── responsive.css        # Responsive media queries (960px, 768px, 560px)
│   │   └── style.css             # Design tokens (:root), reset, layout wrappers
│   ├── js/
│   │   └── main.js               # Event handling, real-time validation, async fetch()
│   ├── lang/
│   │   ├── en.json               # English localization strings
│   │   └── hi.json               # Hindi localization strings
│   ├── feedback.html             # New interactive advisory form (Evaluation Phase 2)
│   ├── guide.html                # Cultivation tablist and care timeline
│   ├── index.html                # Landing page, hero & weather snapshot card
│   ├── location.html             # Geolocation trigger & district search fallback
│   └── results.html              # Weather-matched crop recommendation grid
├── docs/
│   ├── progress-report.md        # Interim evaluation documentation
│   └── project-charter.md        # Project scope and technical specification
├── server/
│   ├── data/
│   │   └── submissions.json      # Local JSON database for persisted form entries
│   └── server.js                 # Express server & API endpoints (POST /api/submit)
├── package.json                  # Project dependencies and startup scripts
└── README.md
```

---

## 🛠️ Technology Stack

* **Frontend:** Semantic HTML5, Modular CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript (ES6+, DOM API, Fetch API)
* **Backend:** Node.js, Express.js (`cors`, `express.json()`), Node.js `fs` module
* **Data Storage:** Local JSON File Persistence (`server/data/submissions.json`)
* **Tools & Design:** Git/GitHub, GitHub Projects (Kanban tracking), Figma

---

## ⚙️ Local Setup & Installation

### 1. Prerequisites
Ensure **Node.js** (v16 or higher) is installed on your local environment.

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/mausam-crop-guide.git
cd mausam-crop-guide
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Application
Start the Node.js Express server:
```bash
node server/server.js
```
The server will start on port `3000`. Open your browser and navigate to:
```text
http://localhost:3000
```

---

## 🧪 Verification & Viva Demonstration Checklist

1. **Navigation Verification:** Click through the navigation links across `index.html`, `location.html`, `results.html`, `guide.html`, and `feedback.html` to confirm all 5 screens interlink smoothly.
2. **Client Validation Testing:** On `feedback.html`, attempt to submit blank inputs to observe the red focus rings and inline validation prompts.
3. **Form Submission Testing:** Fill in valid data and click submit; observe the loading state and the subsequent success notification banner.
4. **Data Persistence Verification:** Open `server/data/submissions.json` in VS Code or any text editor to verify that the submitted record is appended inside the JSON array with its timestamp.

---

## 🔮 Upcoming Scope (Evaluation Phase 3)
* Integration of live weather data from external endpoints (OpenWeatherMap API).
* Transitioning crop and advisory data schemas from static JSON to a cloud NoSQL database using **MongoDB Atlas** and **Mongoose**.
* Building dynamic crop catalog search routes (`GET /api/crops`) and cloud deployment.