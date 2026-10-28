# SmartCrop AI — Dataset Sources & Agronomic Assumptions

**Dataset Version:** `v1.1.0-icar-fao-documented`  
**File Location:** `server/src/data/crops.js`  

## 1. Primary Agronomic References

1. **Indian Council of Agricultural Research (ICAR)**
   * *Handbook of Agriculture (6th Edition)*, Directorate of Information and Publications on Agriculture (DIPA), New Delhi.
   * ICAR-IIWBR (Indian Institute of Wheat & Barley Research) agronomic package of practices.
   * ICAR-IIPR (Indian Institute of Pulses Research) chickpea cultivation directives.
   * Central Institute for Cotton Research (CICR) agro-climatic zones.
2. **Food and Agriculture Organization of the United Nations (FAO)**
   * *Ecocrop Database*: Crop ecological requirements, thermal time thresholds, and soil texture preferences.
   * *FAO Irrigation and Drainage Paper 56*: Crop Evapotranspiration and seasonal water duties ($ET_c$).
3. **Tamil Nadu Agricultural University (TNAU)**
   * *Agritech Portal — Crop Production Guides*: Soil fertility rating limits for available N, P, and K.

---

## 2. Measurement Unit Standards

| Soil / Climate Parameter | Standard Unit | Analytical Laboratory Reference |
| :--- | :--- | :--- |
| **Soil pH** | Dimensionless scale (0 - 14) | 1:2.5 soil-to-water suspension potentiometry |
| **Available Nitrogen (N)** | mg/kg of dry soil | Alkaline potassium permanganate method (Subbiah & Asija, 1956) |
| **Available Phosphorus (P)** | mg/kg of dry soil | Olsen's $0.5\text{ M }\text{NaHCO}_3$ (neutral/alkaline) or Bray's No. 1 (acidic) |
| **Available Potassium (K)** | mg/kg of dry soil | Neutral $1\text{ N}$ ammonium acetate extraction via flame photometry |
| **Seasonal Rainfall** | mm / crop cycle | Cumulative precipitation + assured irrigation depth |
| **Temperature** | °C | 2-meter ambient dry-bulb mean temperature |
| **Relative Humidity** | % RH | Psychrometric relative humidity percentage |

---

## 3. Agronomic Constraints & Assumptions

* **Waterlogging Sensitivity:** Maize, chickpea, and tomato require free-draining conditions; water stagnation exceeding 24 hours induces root hypoxia regardless of nutrient levels.
* **Tuberization Temperature:** Potato requires night temperatures between 15°C and 20°C; night temperatures exceeding 24°C halt tuber bulking.
* **Leguminous Nitrogen Fixation:** Pulses like Chickpea and Soybean establish symbiosis with *Rhizobium* bacteria, requiring minimal basal nitrogen. Excessive soil N stimulates vegetative growth over pod set.
