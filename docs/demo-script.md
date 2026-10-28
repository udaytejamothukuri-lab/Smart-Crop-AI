# SmartCrop AI — 3 to 5-Minute Demonstration Video Script

**Problem ID:** HACK-P302  
**Project:** SmartCrop AI — Intelligent Crop Recommendation System  
**Format:** Live Screen Recording & Voiceover Walkthrough  
**Target Duration:** 3 minutes 30 seconds to 4 minutes 30 seconds  

---

## Video Timeline & Spoken Script

### 00:00 – 00:45 | Introduction & Problem Statement
* **Screen Display:** SmartCrop AI Homepage (`http://localhost:5173/`), highlighting system status badges (`Backend Active`, `Method: rule-based-v1.0`).
* **Speaker:**
  > "Hello judges and evaluators. Welcome to our demonstration of **SmartCrop AI**, developed for student hackathon problem **HACK-P302** under the Agriculture category.
  >
  > Many agricultural recommendation apps rely on opaque black-box ML models that output unexplainable confidence scores or silently invent answers when soil lab test results are missing. 
  > 
  > Our solution is a **transparent, deterministic, rule-based decision-support system** built on verified ICAR and FAO agronomic guidelines. It explains every single match, highlights limiting factors, tracks missing inputs without zero-filling, and provides side-by-side crop comparison."

---

### 00:45 – 01:30 | Input Submission & Missing Value Handling
* **Screen Display:** Click **"Get Crop Recommendations"** to navigate to `/recommend`. Point out the 9 parameters with units (pH, °C, mm, mg/kg).
* **Action:** Click the preset button **"Profile 1: Kharif Wetland (Rice)"**. Show the form populating. Then clear the Nitrogen, Phosphorus, and Potassium inputs to demonstrate Profile 4 (sensor-only mode).
* **Speaker:**
  > "Here on the Recommendation Form, we collect 9 soil and climate parameters. Notice the explicit units: dimensionless pH, cumulative seasonal rainfall in millimeters, and available nutrients in milligrams per kilogram.
  >
  > Unlike other platforms, if a farmer does not have laboratory N-P-K tests, our engine does not default them to zero—which would falsely ruin crop scores. Instead, it tracks them transparently as missing factors and normalizes the score across available environmental criteria. Let's submit this profile."

---

### 01:30 – 02:30 | Real Backend Execution & Transparent Results
* **Screen Display:** Click **"Generate Crop Recommendations"**. The Results Page (`/results`) loads instantly.
* **Speaker:**
  > "The results are rendered directly from our Node.js and Express backend.
  >
  > Notice that **Rice (Paddy)** ranks number one with a **High compatibility** badge. 
  > Expanding the card shows the exact heuristic breakdown:
  > - Positive matches: Clay soil retention, monsoon Kharif season, and 1500 mm rainfall satisfying optimal water duties.
  > - Omitted parameters: Nitrogen, Phosphorus, and Potassium are explicitly listed in the missing factors section.
  > - We also prominently display the legal agricultural advisory notice and crop physiological limitations."

---

### 02:30 – 03:30 | Side-by-Side Crop Comparison
* **Screen Display:** Select checkboxes for **Rice** and **Wheat**, then click **"Compare Selected (2)"**. Navigates to `/compare`.
* **Speaker:**
  > "Now let's examine our comparative analysis feature. Both crops are evaluated against the exact same soil and climate inputs using identical deterministic rules.
  >
  > In this side-by-side matrix, we see immediately why Rice thrives in this profile while Wheat receives a **Low compatibility** rating: Wheat strictly requires the cool Rabi winter season and well-drained loamy soil, whereas our input specified warm Kharif monsoon conditions on water-retentive clay. 
  > Users can also use the print action to generate a clean, printable PDF report."

---

### 03:30 – 04:15 | Database Persistence, API Testing & Architecture
* **Screen Display:** Navigate to `/history`, show public history notice and MongoDB archive. Open Postman / Terminal showing backend tests.
* **Speaker:**
  > "In the **History** tab, recommendation runs are retrieved from MongoDB Atlas. In adherence with hackathon requirements, we clearly state that history is public and avoid fake authentication.
  > 
  > Over in our terminal, our automated test suite executes **25 comprehensive tests**—including Supertest endpoint tests, rule-engine unit tests, frontend Vitest component tests, and automated validation of the five required hackathon test profiles with 100% pass rates.
  >
  > Thank you for your time, and we look forward to your questions!"
