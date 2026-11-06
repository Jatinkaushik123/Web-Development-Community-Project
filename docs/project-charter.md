<table width="100%">
<tr><td>

**SAMPLE PROJECT CHARTER**

**(**To be submitted by each group to the Faculty after consolidation of project scope and title**)**

</td></tr>
<tr><td>

**SECTION A: PROJECT IDENTIFICATION**

**Course Code:** CSE2022 &nbsp;&nbsp;&nbsp; **Course Name:** Web Programming

**Project Title:** MausamCrop – Location-Aware Crop Recommendation Platform

**Group Number:** ____3____    &nbsp;&nbsp;&nbsp; **Date:** ______6/11/26______

</td></tr>
<tr><td>

**SECTION B: TEAM COMPOSITION**

<table width="100%">
<tr><th>No</th><th>Reg No</th><th>Student Name</th><th>Role</th><th>Responsibility</th></tr>
<tr><td>1</td><td>250C2030148</td><td>Jatin Kaushik</td><td>Backend</td><td>Lead overall project execution, setup Git repository and workflows, design backend architecture, and develop REST APIs using Node.js and Express.</td></tr>
<tr><td>2</td><td>250C2030073</td><td>Bakshish Batra</td><td>Data Managements</td><td>Design and manage MongoDB schemas, structure JSON crop and localization datasets, and maintain project documentation and reports.</td></tr>
<tr><td>3</td><td>250C2030128</td><td>Harshal Kamboj</td><td>Frontend Developer</td><td>Build responsive HTML5 semantic structure, implement CSS layouts, and develop client-side DOM manipulation and interactive logic.</td></tr>
<tr><td>4</td><td>250C2030168</td><td>Krishnanshu Singh</td><td>UI and UX </td><td>Design Figma wireframes and prototypes, implement accessible UI styling, and assist with frontend-backend integration.</td></tr>
</table>

</td></tr>
<tr><td>

**SECTION C: PROBLEM STATEMENT (Elaborate)**

- **Background:** Farmers and home gardeners, especially those new to agriculture or working in unfamiliar climates, often struggle to determine which plants, vegetables, and fruits are best suited to their specific local environment. Traditional farming knowledge is passed down generationally or requires expert consultation, both of which are inaccessible to many people.

- **Problem Definition:** Environmental factors like temperature, humidity, soil type, and rainfall vary drastically by location, but most people lack the tools to translate this data into actionable planting decisions. As a result, poor crop selection leads to low yield, wasted resources, and discouragement, especially among first-time or urban growers.

- **Relevance and Impact:** There is a need for an accessible, intelligent platform that bridges this knowledge gap using real-time environmental data — helping users of all experience levels make informed, location-specific planting decisions.

</td></tr>
<tr><td>

**SECTION D: OBJECTIVES (In Bullet Points)**

**Primary Objectives**

- To automatically detect the user's geographic location and analyze local environmental conditions (climate, humidity, temperature, soil suitability).
- To recommend a personalized list of plants, vegetables, and fruits best suited for the user's specific habitat/environment.
- To provide real-time or near real-time humidity, temperature, and other environmental measurements relevant to plant growth.
- To offer step-by-step, easy-to-follow guides for planting, caring for, and maintaining recommended crops.
- To make farming and gardening knowledge accessible to users regardless of their prior experience or technical background.
- To help maximize crop yield and reduce failure rate through data-driven recommendations rather than guesswork.
- To build a scalable platform usable by anyone, anywhere, from urban balcony gardeners to rural farmers.

**Success Criteria (Measurable)**

- Location detection and environmental data retrieval accurate for at least 90% of test locations.
- Crop recommendation engine suggests suitable crops with at least 85% match to expert/agricultural benchmark data.
- Care guides available for all recommended crops in the database.
- Positive usability feedback from at least 80% of pilot users (urban and rural).
- Platform response time under 3 seconds for location-to-recommendation flow.

</td></tr>
<tr><td>

**SECTION E: METHODOLOGY**

**Technical Approach:**

<table width="100%">
<tr><th>Phase</th><th>Description</th></tr>
<tr><td>I</td><td>Location Detection &amp; Data Collection — use browser geolocation APIs (or manual location input as fallback) to identify the user's coordinates, then fetch relevant environmental data (temperature, humidity, rainfall, soil type if available) from weather/climate APIs.</td></tr>
<tr><td>II</td><td>Environmental Analysis Engine — process the collected data against a crop-requirement database to determine which plants, vegetables, and fruits are climatically and seasonally compatible with the user's location.</td></tr>
<tr><td>III</td><td>Recommendation System Design — build a rule-based or ML-based recommendation model that ranks suitable crops based on how well environmental conditions match each crop's ideal growing parameters.</td></tr>
<tr><td>IV</td><td>Database &amp; Backend Development — design and populate a structured database containing crop profiles (ideal temperature range, humidity, soil, watering needs, growth duration) along with corresponding care guides.</td></tr>
<tr><td>V</td><td>Frontend &amp; User Interface Development — develop an intuitive, responsive interface where users can view their location-based recommendations, live environmental metrics, and step-by-step care guides in a simple, visual format.</td></tr>
<tr><td>VI</td><td>Testing, Validation &amp; Deployment — test recommendations against real agricultural/horticultural data for accuracy, gather user feedback through pilot testing, refine the model, and deploy the platform for public use.</td></tr>
</table>

**Tools and Technologies:**

- Frontend: React.js (responsive web interface), HTML5 Geolocation API
- Backend: Node.js with Express (REST API for recommendation engine)
- Database: MongoDB (crop profiles, user data, care guides)
- External APIs: Weather/climate data provider (e.g. OpenWeatherMap), soil data API
- Cloud/Hosting: AWS / Vercel (deployment), cloud storage for crop images and guides
- Analytics: Google Analytics or custom dashboard for usage and recommendation accuracy tracking

</td></tr>
<tr><td>

**SECTION F: TEAM AGREEMENT**

**We, the undersigned team members, agree to:**

☑ Participate equally and fulfill assigned responsibilities

☑ Attend all scheduled meetings and discussion sessions

☑ Maintain honest and complete documentation

☑ Disclose all AI tool usage transparently

☑ Complete individual viva and demonstrate understanding

☑ Not engage in plagiarism or academic misconduct

☑ Resolve conflicts professionally through discussion or faculty guidance

**Consequences of non-compliance: As per institutional academic regulations**

</td></tr>
<tr><td>

**SECTION G: SIGNATURES**

Student 1: ______Jatin Kaushik______ &nbsp;&nbsp; Signature: _____JK_____ &nbsp;&nbsp; Date: ___6/11/26___

Student 2: _______Bakshish Batra_______ &nbsp;&nbsp; Signature: _______BB_______ &nbsp;&nbsp; Date: _____6/11/26_____

Student 3: ______Harshal Kamboj______ &nbsp;&nbsp; Signature: _______HK_______ &nbsp;&nbsp; Date: ____6/11/26____

Student 4: _______Krishnanshu Singh_______ &nbsp;&nbsp; Signature: _______KS_______ &nbsp;&nbsp; Date: _____6/11/26_____

</td></tr>
</table>