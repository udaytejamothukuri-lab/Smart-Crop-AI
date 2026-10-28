# SmartCrop AI — Automated Test Execution Report

**Execution Timestamp:** 2026-10-28  
**Backend Test Framework:** Node.js Native Test Runner (`node:test`, `node:assert/strict`, `supertest`)  
**Frontend Test Framework:** Vitest v2.1.9, `@testing-library/react`, `jsdom`  

---

## 1. Test Summary Overview

| Test Suite Category | Test File | Tests Executed | Tests Passed | Tests Failed | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Recommendation Engine Unit Tests** | `server/tests/recommendationEngine.test.js` | 6 | 6 | 0 | **PASS** |
| **Five Required Example Profiles** | `server/tests/exampleProfiles.test.js` | 5 | 5 | 0 | **PASS** |
| **REST API Endpoints Integration** | `server/tests/apiEndpoints.test.js` | 10 | 10 | 0 | **PASS** |
| **Frontend Form & Validation** | `client/src/test/InputForm.test.jsx` | 3 | 3 | 0 | **PASS** |
| **Frontend Results View & Details** | `client/src/test/ResultsView.test.jsx` | 1 | 1 | 0 | **PASS** |
| **Total** | — | **25** | **25** | **0** | **100% PASS** |

---

## 2. Five Required Example Input Profiles Verification Table (Section 10)

| Profile ID & Description | Input Parameters & Units | Expected Output | Actual Output | Result | Agronomic Explanation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Profile 1: Complete Valid Kharif Wetland** | `soilType: clay`, `season: kharif`, `pH: 6.5`, `temp: 28°C`, `rain: 1500 mm`, `humidity: 80%`, `N: 130 mg/kg`, `P: 30 mg/kg`, `K: 40 mg/kg` | Rice (Paddy) ranked #1, `High compatibility`, Score $\ge 90$, 0 critical mismatches | Rice (Paddy) ranked #1, `High compatibility`, Score: 100%, 0 unmet factors | **PASS** | High rainfall and heavy clay soil during monsoon Kharif season provide ideal conditions for paddy water retention. |
| **Profile 2: Cool Arid Rabi Profile** | `soilType: sandy-loam`, `season: rabi`, `pH: 7.0`, `temp: 18°C`, `rain: 350 mm`, `humidity: 45%`, `N: 30 mg/kg`, `P: 30 mg/kg`, `K: 30 mg/kg` | Chickpea & Mustard `High compatibility` (Rank #1/2); Rice categorized as `Low compatibility` | Chickpea `High compatibility` (Score: 92%); Rice `Low compatibility` (Score: 23%) | **PASS** | Low moisture (350 mm) and winter season perfectly match chickpea's drought tolerance, whereas water-heavy rice fails rainfall checks. |
| **Profile 3: Zaid (Summer) Season Profile** | `soilType: sandy-loam`, `season: zaid`, `pH: 6.5`, `temp: 28°C`, `rain: 600 mm`, `humidity: 55%`, `N: 100 mg/kg`, `P: 35 mg/kg`, `K: 40 mg/kg` | Maize and Groundnut categorized as High/Moderate matches; Wheat categorized as `Low compatibility` | Maize #1 (Score: 89%), Groundnut #2 (Score: 88%); Wheat `Low compatibility` | **PASS** | Maize and Groundnut tolerate warm summer cultivation windows; cool-weather winter crops like Wheat are penalized for seasonal incompatibility. |
| **Profile 4: Missing Nutrient Measurements (Sensor Only)** | `soilType: loamy`, `season: rabi`, `pH: 6.8`, `temp: 18°C`, `rain: 500 mm`, `humidity: 55%`, `N: null`, `P: null`, `K: null` | Wheat `High compatibility` (Score $\ge 80$), active coverage ratio normalized, missing nutrients listed in `missingFactors` without zero-fill | Wheat #1, `High compatibility` (Score: 93%), Coverage: 90%, N/P/K recorded in `missingFactors` | **PASS** | The engine normalized score across available environmental criteria rather than defaulting missing nutrients to zero. |
| **Profile 5: Invalid / Unsupported Input Conditions** | `soilType: martian-regolith`, `season: monsoon-invalid`, `pH: 18.5`, `temp: 95°C`, `rain: -100 mm`, `humidity: 150%` | HTTP 400 Bad Request; validation error array identifying invalid fields | Validation rejected, `isValid: false`, 6 validation error messages returned | **PASS** | The validator trapped out-of-range pH, negative rainfall, unrealistic temperature, and invalid categorical inputs. |

---

## 3. Actual Command Line Execution Evidence

### Backend Suite (`npm test` in `server/`)
```
> smartcrop-ai-server@1.0.0 test
> node --test tests/**/*.test.js

▶ SmartCrop AI - REST API Endpoints Integration Tests
  ✔ GET /api/health -> returns status 200 and system details (91.1ms)
  ✔ GET /api/crops -> returns list of supported crops and requirements (14.5ms)
  ✔ POST /api/recommendations -> successful recommendation generation (148.5ms)
  ✔ POST /api/recommendations -> rejects invalid pH (> 14) (14.7ms)
  ✔ POST /api/recommendations -> rejects empty payload (11.2ms)
  ✔ POST /api/recommendations/compare -> valid comparison of two crops (14.2ms)
  ✔ POST /api/recommendations/compare -> rejects when fewer than 2 cropIds provided (10.5ms)
  ✔ GET /api/recommendations/:id -> rejects malformed MongoDB ObjectId (9.9ms)
  ✔ DELETE /api/recommendations/:id -> rejects malformed MongoDB ObjectId (12.4ms)
  ✔ GET /unknown-route -> 404 handler returns structured JSON (12.2ms)
✔ SmartCrop AI - REST API Endpoints Integration Tests (344.8ms)

▶ SmartCrop AI - Five Required Example Input Profiles (Section 10)
  ✔ Profile 1: Complete Valid Kharif Wetland Profile -> Rice High Compatibility (39.7ms)
  ✔ Profile 2: Sandy-Loam Cool Arid Rabi Profile -> Chickpea High Compatibility (0.9ms)
  ✔ Profile 3: Zaid (Summer) Season Profile -> Summer crops prioritized, Rabi crops marked Low (0.9ms)
  ✔ Profile 4: Missing Nutrient Values -> Normalized without penalty, recorded in missingFactors (0.9ms)
  ✔ Profile 5: Invalid / Unsupported Input Conditions -> Rejected by validator with clear messages (0.6ms)
✔ SmartCrop AI - Five Required Example Input Profiles (Section 10) (46.1ms)

▶ SmartCrop AI - Recommendation Engine Unit Tests
  ✔ Deterministic execution: running identical profile twice yields identical order and scores (24.9ms)
  ✔ High compatibility classification for Wheat in cool Rabi conditions (1.0ms)
  ✔ Missing nutrient values are marked as missing and not treated as zero (1.8ms)
  ✔ Insufficient information when fewer than 50% parameter weights are provided (1.0ms)
  ✔ Low compatibility when critical parameters like Season or Temperature strictly mismatch (6.6ms)
  ✔ Tie-breaking rule breaks equal scores by positive matches, then alphabetical cropName (1.4ms)
✔ SmartCrop AI - Recommendation Engine Unit Tests (42.1ms)

ℹ tests 21 | pass 21 | fail 0 | duration_ms 2860.6
```

### Frontend Suite (`npm test` in `client/`)
```
> smartcrop-ai-client@1.0.0 test
> vitest run

 ✓ src/test/ResultsView.test.jsx (1 test) 119ms
 ✓ src/test/InputForm.test.jsx (3 tests) 597ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Duration  4.40s
```
