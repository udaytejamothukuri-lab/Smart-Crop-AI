# SmartCrop AI — Intelligent Crop Recommendation System

> **Problem Statement ID:** HACK-P302  
> **Category:** Agriculture  
> **Subject:** Backend Web Development  
> **Project Type:** Full-Stack Web Application  
> **Recommendation Method:** Transparent Rule-Based Recommendation Engine  
> **Method Version:** `rule-based-v1.0-weighted`  
> **Dataset Version:** `v1.1.0-icar-fao-documented`  

---

## 1. Project Title & Problem ID
* **Project Name:** SmartCrop AI — Intelligent Crop Recommendation System
* **Hackathon Problem ID:** HACK-P302
* **Repository:** `smartcrop-ai`

---

## 2. Project Overview
SmartCrop AI is a production-grade full-stack agricultural decision-support application. It collects soil parameters, nutrient laboratory assays, and seasonal climate conditions to generate ranked, physiologically justified crop recommendations.

Unlike opaque statistical models, SmartCrop AI employs a **transparent, deterministic, rule-based recommendation engine** built upon documented ICAR and FAO agro-ecological thresholds. Every crop result includes explicit positive matching criteria, limiting unmet factors, missing data warnings, and clear agronomic assumptions.

Recommendations are advisory estimates intended for decision-support, not guaranteed agricultural advice.

---

## 3. Problem Statement
Farmers frequently suffer economic losses due to planting crops ill-suited to their regional rainfall patterns, seasonal temperatures, or soil chemical properties. Existing digital tools often:
1. Act as black boxes without explaining why a crop was recommended or rejected.
2. Silently replace omitted nutrient measurements with zero, distorting suitability.
3. Fabricate unrealistic yield or profit promises.

SmartCrop AI solves these issues by providing a deterministic, transparent advisory engine that prioritizes agronomic validity, identifies missing data, and allows multi-crop comparisons.

---

## 4. Proposed Solution
* **Multi-Tier Rule Evaluation:** Compares farm parameters against documented optimal and tolerable thresholds for 12 major crops across cereals, pulses, oilseeds, and cash crops.
* **Missing Value Transparency:** Omitted soil tests (N, P, K) are tracked in `missingFactors` and normalized over available criteria, never zero-filled.
* **Coverage-Ratio Guardrails:** If user inputs represent less than 50% parameter coverage, the system assigns **"Insufficient information"** rather than fabricating an answer.
* **Deterministic Ranking:** Consistent tie-breaking ensures identical inputs always produce identical rankings.
* **Side-by-Side Comparison:** Evaluates 2 to 4 crops simultaneously against identical soil conditions.
* **Persistent Archive:** Saves queries to MongoDB Atlas with full history review and deletion capabilities.

---

## 5. Implemented Features
- [x] **Home Dashboard:** System status health ping, workflow guide, and advisory disclaimer.
- [x] **Recommendation Input Form:** 9 soil and climate inputs with explicit units, numeric range checking, and required/optional indicators.
- [x] **5 Preset Profile Loaders:** Instant loading of the 5 required hackathon test profiles for repeatable evaluation.
- [x] **Real-Time Heuristic Engine:** Backend rule evaluation with deterministic scoring and ranking.
- [x] **Suitability Categorization:** Categorization into *High compatibility*, *Moderate compatibility*, *Low compatibility*, and *Insufficient information*.
- [x] **Detailed Factor Explanations:** Dedicated breakdowns of matching, unmet, and omitted factors for every crop.
- [x] **Side-by-Side Comparison Matrix:** Direct comparative analysis across soil, climate, rainfall, and nutrient compatibility.
- [x] **MongoDB Atlas Persistence:** Mongoose document storage with graceful offline fallback when database is disconnected.
- [x] **History Archive:** Public history viewing, individual record inspection, and record deletion.
- [x] **Print-Ready Summaries:** Custom `@media print` stylesheets for professional report export.
- [x] **Methodology & About Page:** Full transparency report documenting formulas, weights, citations, and team details.

---

## 6. Technology Stack
* **Frontend:**
  * React.js (v18.3.1)
  * Vite (v6.4.5)
  * Tailwind CSS (v3.4.16)
  * React Router DOM (v6.28.0)
  * Axios (v1.7.9)
  * Lucide React Icons (v0.468.0)
* **Backend:**
  * Node.js (v24.19.0)
  * Express.js (v4.21.2) - ES Modules
  * Mongoose (v8.9.5)
  * Express Rate Limit (v7.5.0)
  * CORS (v2.8.5)
* **Database:**
  * MongoDB Atlas (Cloud NoSQL)
* **Testing:**
  * Node.js Native Test Runner (`node:test`, `node:assert/strict`)
  * Supertest (v7.0.0)
  * Vitest (v2.1.9)
  * Testing Library React (v16.1.0) & JSDOM (v25.0.1)

---

## 7. System Architecture

```
                    +------------------------------------+
                    |   Client Layer (React 18 + Vite)  |
                    |  - Responsive Agriculture Dashboard|
                    |  - 5 Preset Profile Buttons        |
                    |  - Print Stylesheets (@media print)|
                    +-----------------+------------------+
                                      |
                           HTTP / REST (JSON)
                                      |
                    +-----------------v------------------+
                    |    Backend Layer (Node.js/Express) |
                    |  - Input Validation & Range Checks |
                    |  - Centralized Error Handling      |
                    |  - CORS & Rate Limiting (100/15m)  |
                    +--------+------------------+--------+
                             |                  |
            Documented Dataset                  | Mongoose ODM
            (ICAR / FAO v1.1.0)                 | (State-Aware)
                             |                  |
            +----------------v---+     +--------v-----------+
            | Rule-Based Engine  |     |   MongoDB Atlas    |
            | - Weighted Scoring |     | - Recommendations  |
            | - Coverage Tracker |     | - Indexed History  |
            | - Tie-Breaking (AZ)|     +--------------------+
            +--------------------+
```

*Vector Diagram Reference:* [`docs/architecture.svg`](docs/architecture.svg)

---

## 8. System Screenshots & Visuals
* **Architecture Diagram:** [`docs/architecture.svg`](docs/architecture.svg)
* **Database Design Diagram:** [`docs/database-design.svg`](docs/database-design.svg)
* **Demo Video Script:** [`docs/demo-script.md`](docs/demo-script.md)
* **Presentation Outline:** [`docs/presentation-outline.md`](docs/presentation-outline.md)

---

## 9. Installation & Local Setup Instructions

### Prerequisites
* Node.js v18+ (tested on Node v24.19.0)
* npm v9+
* Git
* (Optional) MongoDB Atlas account or local MongoDB instance

### Step 1: Clone Repository
```bash
git clone https://github.com/[YOUR_ORG]/smartcrop-ai.git
cd smartcrop-ai
```

### Step 2: Install Server Dependencies
```bash
cd server
npm install
```

### Step 3: Install Client Dependencies
```bash
cd ../client
npm install
```

### Step 4: Configure Environment Variables
Copy `.env.example` in both server and client:
```bash
# In server/
cp .env.example .env

# In client/
cp .env.example .env
```

### Step 5: Start Development Servers
* **Terminal 1 (Backend Server):**
  ```bash
  cd server
  npm start
  # Server listening on http://localhost:5000
  ```

* **Terminal 2 (Frontend Client):**
  ```bash
  cd client
  npm run dev
  # Client running on http://localhost:5173
  ```

Open your browser at `http://localhost:5173`.

---

## 10. Environment Variables

### Server (`server/.env`)
```ini
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/smartcrop?retryWrites=true&w=majority
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client (`client/.env`)
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 11. API Documentation
Complete endpoint specifications, schemas, and status codes are documented in [`docs/api-documentation.md`](docs/api-documentation.md). A ready-to-import collection is provided in [`docs/postman_collection.json`](docs/postman_collection.json).

### Key Endpoints
* `GET /api/health` — Checks backend status, uptime, and database connection.
* `GET /api/crops` — Lists all 12 supported crops and agronomic tolerance bounds.
* `POST /api/recommendations` — Evaluates soil profile and persists result to MongoDB.
* `GET /api/recommendations` — Retrieves paginated recommendation history.
* `GET /api/recommendations/:id` — Retrieves a specific recommendation by ObjectId.
* `DELETE /api/recommendations/:id` — Deletes a saved record.
* `POST /api/recommendations/compare` — Compares 2 to 4 crops side-by-side.

---

## 12. Database Design
* **Database:** MongoDB Atlas (Cloud NoSQL)
* **ODM:** Mongoose v8.9.5
* **Primary Collection:** `recommendations`
* **Schema Highlights:**
  * `inputProfile`: Nested object with soil type, pH, temperature, rainfall, humidity, and nutrients.
  * `missingInputs`: String array tracking unmeasured parameters.
  * `recommendations`: Sub-document array of evaluated crops with rank, score, category, and factors.
  * `createdAt`: Indexed Date timestamp for fast chronological retrieval.
* **Vector Diagram Reference:** [`docs/database-design.svg`](docs/database-design.svg)

---

## 13. Recommendation Methodology
Full mathematical formulation and scoring rules are documented in [`docs/recommendation-method.md`](docs/recommendation-method.md).

### Weighting Breakdown:
* **Soil Type Compatibility:** 20%
* **Temperature Window (°C):** 20%
* **Seasonal Alignment:** 15%
* **Seasonal Rainfall (mm):** 15%
* **Soil pH:** 15%
* **Relative Humidity (%):** 5%
* **Available Nutrients (N-P-K):** 10% (3.33% each, optional)

### Coverage Normalization Formula:
$$\text{Coverage Ratio} = \frac{\sum W_{\text{active}}}{100}$$
$$\text{Normalized Score} = \text{round}\left( \frac{\sum S_{\text{earned}}}{\sum W_{\text{active}}} \times 100 \right)$$

---

## 14. Data Sources and Agronomic Assumptions
Full citations and laboratory standards are documented in [`docs/dataset-assumptions.md`](docs/dataset-assumptions.md).
* **ICAR Handbook of Agriculture (6th Edition):** Indian Council of Agricultural Research guidelines.
* **FAO Ecocrop Database & Irrigation/Drainage Paper 56:** Thermal requirements and seasonal water duties.
* **TNAU Agritech Portal:** Soil fertility rating thresholds for available N, P, and K.

---

## 15. Testing Instructions & Actual Results
Automated test suite contains **25 verified tests with a 100% pass rate**. Full test execution report is in [`docs/test-report.md`](docs/test-report.md).

### Run Backend Tests:
```bash
cd server
npm test
```
*Result:* 21 tests passed (unit tests, integration tests, 5 hackathon profiles).

### Run Frontend Tests:
```bash
cd client
npm test
```
*Result:* 4 tests passed (form rendering, validation error messages, results display).

### Five Required Example Profiles Verification:
1. **Profile 1 (Kharif Wetland):** Rice (Paddy) ranks #1, *High compatibility* (100% score). **PASS**
2. **Profile 2 (Cool Arid Rabi):** Chickpea ranks #1, *High compatibility* (92% score); Rice receives *Low compatibility*. **PASS**
3. **Profile 3 (Zaid Summer):** Maize & Groundnut ranked top; Wheat marked *Low compatibility* due to seasonal mismatch. **PASS**
4. **Profile 4 (Missing Nutrients):** Wheat receives *High compatibility* (93% score); missing N, P, K recorded in `missingFactors` without zero-fill. **PASS**
5. **Profile 5 (Invalid Inputs):** Validation rejects payload with HTTP 400 and returns 6 clear error messages. **PASS**

---

## 16. Deployment Instructions

### Frontend (Vercel)
1. Push repository to GitHub.
2. Import project into Vercel dashboard with root set to `client/`.
3. Set environment variable: `VITE_API_BASE_URL=https://smartcrop-ai-server.onrender.com/api`.
4. Deploy.

### Backend (Render / Railway)
1. Import repository into Render with root set to `server/`.
2. Build command: `npm install`. Start command: `node src/index.js`.
3. Set environment variables:
   * `NODE_ENV=production`
   * `PORT=10000`
   * `MONGODB_URI=mongodb+srv://...`
   * `FRONTEND_URL=https://smartcrop-ai.vercel.app`
4. Deploy.

---

## 17. Team Information & Contributions (HACK-P302)
Collaborative project developed by four students from CSE (Data Science):

| Member Name | Roll Number | Branch / Specialization | Key Technical Contribution |
| :--- | :--- | :--- | :--- |
| **Thanveesh Lingala** | `25MVCSDR0565` | CSE (Data Science) | **Team Lead**: Overall architecture, rule-based recommendation engine (`recommendationEngine.js`), deterministic tie-breaking logic. |
| **Uday Teja Mothukuri** | `25MVCSDR0571` | CSE (Data Science) | **Backend Developer**: REST APIs, session in-memory & MongoDB persistence lifecycles, validation middleware, backend test suites. |
| **Ushakoyala Hema Chandra Sai** | `25MVCSDR0590` | CSE (Data Science) | **Frontend Developer**: React dashboard, responsive Tailwind UI, crop comparison matrix, print stylesheets, client API integration. |
| **Gannimani JBL Nara Simha Swamy** | `25MVCSDR0555` | CSE (Data Science) | **Data / Testing**: ICAR/FAO dataset research (`crops.js`), unit conversion validation, automated test suites, presentation documentation. |

---

## 18. Limitations and Future Scope
* **Current Limitations:**
  * Heuristic decision-support system; does not forecast financial market prices or disease epidemics.
  * Assumes uniform field parcels without localized salinity patches or drainage anomalies.
* **Future Scope:**
  * Integration with live Doppler radar and regional meteorological APIs.
  * Satellite-derived NDVI vegetation index ground-truthing.
  * Vernacular voice advisory for regional languages.

---

## 19. Acknowledgements
* Indian Council of Agricultural Research (ICAR) for published agronomic benchmarks.
* Food and Agriculture Organization (FAO) for Ecocrop physiological data.
* Hackathon organizers for problem statement HACK-P302.
