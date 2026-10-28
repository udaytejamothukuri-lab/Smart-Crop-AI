# SmartCrop AI — REST API Documentation

**Base URL (Local):** `http://localhost:5000/api`  
**API Version:** `1.0.0`  
**Method Version:** `rule-based-v1.0-weighted`  
**Dataset Version:** `v1.1.0-icar-fao-documented`  

---

## 1. System Health Check

### `GET /health`
Returns the operational status of the server and database persistence layer.

#### Response `200 OK`
```json
{
  "status": "ok",
  "uptime": 128,
  "timestamp": "2026-10-28T07:15:00.000Z",
  "service": "SmartCrop AI Recommendation API",
  "version": "1.0.0",
  "methodVersion": "rule-based-v1.0-weighted",
  "datasetVersion": "v1.1.0-icar-fao-documented",
  "database": {
    "connected": false,
    "state": "disconnected",
    "hasUri": false
  },
  "environment": "development"
}
```

---

## 2. Crop Metadata

### `GET /crops`
Retrieves all supported crop varieties and their agronomic requirement bounds.

#### Response `200 OK`
```json
{
  "success": true,
  "datasetVersion": "v1.1.0-icar-fao-documented",
  "count": 12,
  "supportedSoilTypes": ["clay", "clay-loam", "loamy", "sandy-loam", "sandy", "silt", "silt-loam", "black", "alluvial", "red"],
  "supportedSeasons": ["kharif", "rabi", "zaid", "whole-year"],
  "crops": [
    {
      "id": "rice",
      "name": "Rice (Paddy)",
      "botanicalName": "Oryza sativa",
      "category": "Cereal",
      "suitableSoilTypes": ["clay", "clay-loam", "alluvial", "silt-loam"],
      "optimalPh": { "min": 5.5, "max": 7.2 },
      "tolerablePh": { "min": 5.0, "max": 8.0 },
      "optimalTemperature": { "min": 22, "max": 32 },
      "tolerableTemperature": { "min": 18, "max": 38 },
      "optimalRainfall": { "min": 1000, "max": 2000 },
      "tolerableRainfall": { "min": 800, "max": 2500 },
      "optimalHumidity": { "min": 70, "max": 90 },
      "tolerableHumidity": { "min": 60, "max": 95 },
      "suitableSeasons": ["kharif", "whole-year"],
      "growingPeriodDays": "110-150",
      "source": "ICAR Handbook of Agriculture; FAO Ecocrop #1590",
      "assumptions": "Assumes sub-surface water retention typical of clay/alluvial soils with standing water."
    }
  ]
}
```

---

## 3. Crop Recommendations

### `POST /recommendations`
Evaluates user-entered soil and climate parameters using the deterministic heuristic engine.

#### Request Headers
`Content-Type: application/json`

#### Request Body
| Parameter | Type | Required | Units | Range / Allowed Values | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `soilType` | string | Yes | — | `clay`, `loamy`, etc. | Soil textural class |
| `season` | string | Yes | — | `kharif`, `rabi`, `zaid`, `whole-year` | Crop growing season |
| `ph` | number | Yes | pH scale | `0.0 - 14.0` | Soil reaction |
| `temperature` | number | Yes | °C | `-10 - 60` | Mean ambient temperature |
| `rainfall` | number | Yes | mm | `0 - 5000` | Seasonal cumulative precipitation |
| `humidity` | number | Yes | % | `0 - 100` | Relative humidity |
| `nitrogen` | number/null | No | mg/kg | `0 - 1000` | Available soil nitrogen |
| `phosphorus` | number/null | No | mg/kg | `0 - 500` | Available soil phosphorus |
| `potassium` | number/null | No | mg/kg | `0 - 1000` | Available soil potassium |

#### Example Request
```json
{
  "soilType": "clay",
  "season": "kharif",
  "ph": 6.5,
  "temperature": 28,
  "rainfall": 1500,
  "humidity": 80,
  "nitrogen": 130,
  "phosphorus": 30,
  "potassium": 40
}
```

#### Response `201 Created` (if persisted) or `200 OK` (standalone mode)
```json
{
  "success": true,
  "id": "673f8a9e201b124810a9c8f0",
  "persisted": true,
  "persistenceStatus": "saved",
  "methodVersion": "rule-based-v1.0-weighted",
  "datasetVersion": "v1.1.0-icar-fao-documented",
  "totalCropsEvaluated": 12,
  "matchingCropsCount": 3,
  "inputSummary": {
    "soilType": "clay",
    "season": "kharif",
    "temperature": "28 °C",
    "rainfall": "1500 mm",
    "ph": 6.5,
    "humidity": "80 %",
    "nitrogen": "130 mg/kg",
    "phosphorus": "30 mg/kg",
    "potassium": "40 mg/kg"
  },
  "missingInputs": [],
  "recommendations": [
    {
      "cropId": "rice",
      "cropName": "Rice (Paddy)",
      "botanicalName": "Oryza sativa",
      "category": "Cereal",
      "rank": 1,
      "suitabilityCategory": "High compatibility",
      "score": 100,
      "coveragePercentage": 100,
      "matchingFactors": [
        "Soil type \"clay\" is compatible with Rice (Paddy)'s preferred soils (clay, clay-loam, alluvial, silt-loam).",
        "Season \"kharif\" aligns with growing seasons (kharif, whole-year).",
        "Soil pH 6.5 is within the optimal range (5.5 - 7.2).",
        "Temperature 28°C is within the optimal range (22°C - 32°C).",
        "Seasonal rainfall 1500 mm satisfies optimal water requirement (1000 - 2000 mm)."
      ],
      "unmetFactors": [],
      "missingFactors": [],
      "explanation": "Rice (Paddy) shows strong compatibility with your soil and climate profile. Evaluated conditions meet optimal agronomic requirements with zero critical mismatches.",
      "limitations": [
        "Assumes sub-surface water retention typical of clay/alluvial soils with standing water or assured ponding/irrigation.",
        "This rule-based result does not account for real-time pest outbreaks, salinity patches, or unseasonal frost."
      ],
      "growingPeriodDays": "110-150",
      "source": "ICAR Handbook of Agriculture; FAO Ecocrop #1590"
    }
  ],
  "advisory": "Advisory notice: Recommendations are heuristic estimates based on published agronomic thresholds. Verify with local agricultural extension officers, soil testing laboratories, and regional weather advisories before planting."
}
```

---

## 4. History Management

### `GET /recommendations`
Retrieves paginated history of saved recommendation queries from MongoDB.

#### Query Parameters
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 20, max: 100)

#### Response `200 OK`
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "notice": "Public history mode: All saved recommendations are visible without personal credentials. Do not submit sensitive data.",
  "records": [...]
}
```

### `GET /recommendations/:id`
Retrieves a single saved recommendation record by its 24-character hexadecimal MongoDB ObjectId.

### `DELETE /recommendations/:id`
Deletes a saved record by ID.

---

## 5. Crop Comparison

### `POST /recommendations/compare`
Compares 2 to 4 crops side-by-side using the identical input profile.

#### Request Body
```json
{
  "cropIds": ["rice", "wheat"],
  "inputProfile": {
    "soilType": "clay-loam",
    "season": "kharif",
    "temperature": 26,
    "rainfall": 1100,
    "ph": 6.5,
    "humidity": 75
  }
}
```

#### Response `200 OK`
```json
{
  "success": true,
  "methodVersion": "rule-based-v1.0-weighted",
  "datasetVersion": "v1.1.0-icar-fao-documented",
  "cropsCount": 2,
  "comparisons": [
    {
      "cropId": "rice",
      "cropName": "Rice (Paddy)",
      "suitabilityCategory": "High compatibility",
      "score": 93,
      "soilCompatibility": { "status": "MATCH", "details": "Compatible with clay, clay-loam..." },
      "seasonCompatibility": { "status": "MATCH", "details": "Permitted: kharif, whole-year" },
      "temperatureCompatibility": { "status": "MATCH", "details": "Optimal (22 - 32°C)" },
      "rainfallCompatibility": { "status": "MATCH", "details": "Optimal (1000 - 2000 mm)" }
    },
    {
      "cropId": "wheat",
      "cropName": "Wheat",
      "suitabilityCategory": "Low compatibility",
      "score": 35,
      "seasonCompatibility": { "status": "UNMET", "details": "Requires: rabi" }
    }
  ]
}
```
