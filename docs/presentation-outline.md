# SmartCrop AI — PowerPoint Presentation Outline (12 Slides)

**Problem ID:** HACK-P302  
**Category:** Agriculture  
**Project:** SmartCrop AI — Intelligent Crop Recommendation System  
**Subject:** Backend Web Development  

---

### Slide 1: Title & Team Information
* **Title:** SmartCrop AI — Intelligent Crop Recommendation System
* **Subtitle:** Transparent, Deterministic Decision-Support Engine for Agro-Ecological Planning
* **Problem Statement ID:** HACK-P302
* **Team Details:** 4 Students, CSE (Data Science)
  * Thanveesh Lingala (Team Lead): Architecture & Recommendation Engine (`25MVCSDR0565`)
  * Uday Teja Mothukuri (Backend Developer): REST APIs & Persistence Architecture (`25MVCSDR0571`)
  * Ushakoyala Hema Chandra Sai (Frontend Developer): React Dashboard & Crop Comparison UI (`25MVCSDR0590`)
  * Gannamaneni JBL Narasimha Swamy (Data / Testing): ICAR/FAO Agronomic Datasets & Automated Testing (`25MVCSDR0555`)

---

### Slide 2: Problem Statement & Industry Motivation
* **The Agronomic Challenge:** Smallholder farmers frequently face crop failure due to planting crops ill-suited to seasonal rainfall, temperature extremes, or soil pH imbalances.
* **Flaws in Existing Systems:**
  * Proprietary black-box ML models output unexplainable probability percentages without agronomic explanations.
  * Missing soil laboratory test values are silently replaced with zero, ruining crop scores.
  * Fabricated yields, profits, or fertilizer prescriptions that lack empirical grounding.
* **Our Objective:** Build a real, functional, full-stack decision-support platform with deterministic rules, transparent explanations, and zero fabricated advice.

---

### Slide 3: Proposed Solution & Objectives
* **Decision-Support Focus:** Advisory estimates based on published agro-ecological guidelines.
* **Core Pillars:**
  1. **Transparent Rule Engine:** Weight-normalized multi-tier parameter evaluation.
  2. **Missing Value Awareness:** Transparent coverage tracking instead of zero-filling.
  3. **Comparative Analysis:** Compare 2 to 4 crops side-by-side against identical farm conditions.
  4. **Persistence & Portability:** MongoDB Atlas history archive, responsive UI, printable PDF summaries.

---

### Slide 4: Implemented Features Overview
* **Interactive 9-Parameter Form:** Categorical dropdowns and validated numeric inputs with explicit scientific units (pH, °C, mm, mg/kg).
* **Instant Evaluation Presets:** One-click loading of the 5 required hackathon test profiles.
* **Deterministic Crop Ranking:** High, Moderate, Low, and Insufficient suitability categories.
* **Full Agronomic Explanations:** Positive matching factors, unmet limiting factors, and known crop limitations.
* **Public History Archive:** CRUD operations on MongoDB Atlas records without fake authentication.

---

### Slide 5: Technology Stack & Technical Rationale
* **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide React icons.
* **Backend:** Node.js v24, Express.js (ES Modules), Mongoose v8.
* **Database:** MongoDB Atlas (Cloud NoSQL document store).
* **Testing:** Node.js native test runner (`node:test`), Supertest, Vitest, Testing Library.
* **Version Control & CI:** Git, GitHub, clean `.env.example` configurations.

---

### Slide 6: System Architecture & Data Flow
* **Visual Reference:** `docs/architecture.svg`
* **Workflow:**
  1. React client sends validated JSON payload to Express REST API.
  2. Input validator validates numeric ranges, text sanitization, and categorical enums.
  3. Recommendation engine matches inputs against the documented ICAR/FAO dataset (`crops.js`).
  4. Controller persists record to MongoDB and returns deterministic recommendations.

---

### Slide 7: Recommendation Engine & Mathematical Formulation
* **Coverage Ratio:** $\text{Coverage} = \sum W_{\text{active}} / 100$. (Threshold: $<50\%$ yields *Insufficient Information*).
* **Normalized Score:** $\text{Score} = \text{round}\left( (\sum S_{\text{earned}} / \sum W_{\text{active}}) \times 100 \right)$.
* **Weights Matrix:**
  * Soil Type (20%), Temperature (20%), Season (15%), Rainfall (15%), Soil pH (15%), Humidity (5%), Available Nutrients N-P-K (10%).
* **Deterministic Tie-Breaking:** Category $\rightarrow$ Score $\rightarrow$ Positive Matches Count $\rightarrow$ Alphabetical Crop Name (A-Z).

---

### Slide 8: Database Design (MongoDB Atlas)
* **Visual Reference:** `docs/database-design.svg`
* **Primary Document (`recommendations`):**
  * `inputProfile`: Nested soil chemistry and environmental figures.
  * `missingInputs`: Array tracking omitted nutrient measurements.
  * `recommendations`: Embedded array of `RecommendedCropSchema` sub-documents.
  * `createdAt`: Indexed timestamp for chronological pagination.

---

### Slide 9: User Interface & Dashboard Experience
* **Professional Agriculture Theme:** Forest green primary accents, light green cards, clear Inter typography, responsive layouts.
* **Key Screen Walkthroughs:**
  * Form with required/optional field indicators.
  * Card-based results view with category badges and expandable limitation details.
  * Comparative matrix table with side-by-side factor evaluation.
  * Print-friendly formatting with hidden navigation bars.

---

### Slide 10: Testing Methodology & Actual Results
* **Test Suites Executed:**
  * **25 of 25 Tests Passed (100% Success Rate)**.
  * 6 Unit tests for recommendation engine math and tie-breaking.
  * 10 Integration tests for REST endpoints, 404 handler, and ObjectId validation.
  * 4 Frontend tests for form rendering, validation errors, and results display.
  * **5 of 5 Required Example Input Profiles Automated & Documented**.

---

### Slide 11: Deployment Architecture & Configuration
* **Frontend Target:** Vercel (Production SPA with dynamic `VITE_API_BASE_URL`).
* **Backend Target:** Render (Node.js container with assigned `PORT`, CORS whitelist).
* **Database Target:** MongoDB Atlas Cloud Cluster.
* **Resilience:** Graceful offline fallback mode allows full real-time recommendation evaluation even if database connection is temporarily interrupted.

---

### Slide 12: Conclusion, Limitations & Future Scope
* **Known Limitations:** Does not account for localized soil salinity patches, sudden pest attacks, or real-time frost warnings.
* **Future Scope:**
  * Integration with regional meteorological API weather alerts.
  * Micro-watershed satellite moisture index integration.
  * Multi-language audio advisory for local farming communities.
* **Final Advisory Reminder:** SmartCrop AI is a decision-support heuristic; field validation by local agricultural extension officers remains essential.
