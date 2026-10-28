# SmartCrop AI — Rule-Based Recommendation Methodology

**Method Version:** `rule-based-v1.0-weighted`  
**Dataset Version:** `v1.1.0-icar-fao-documented`  

## 1. Design Principles

1. **Strict Determinism:** Identical inputs produce identical crop rankings, scores, and factor evaluations. No stochastic weights or temperature parameters.
2. **Missing Input Transparency:** Unmeasured parameters (such as omitted soil N-P-K tests) are flagged as unknown. They are **never silently substituted with zero**.
3. **Coverage-Ratio Normalization:** The suitability score is normalized across the active weight of evaluated parameters:
   $$\text{Coverage Ratio} = \frac{\sum W_{\text{active}}}{100}$$
   $$\text{Normalized Score} = \text{round}\left( \frac{\sum S_{\text{earned}}}{\sum W_{\text{active}}} \times 100 \right)$$
4. **Deterministic Tie-Breaking:** When two crops share equal scores, order is resolved via:
   `Category Priority > Normalized Score (desc) > Number of Matching Factors (desc) > Crop Name (A-Z)`.

---

## 2. Parameter Weighting Table

| Parameter | Weight | Optimal Points | Tolerable Points | Mismatch Points |
| :--- | :--- | :--- | :--- | :--- |
| **Soil Type** | 20% | 20 pts (100%) | — | 0 pts |
| **Temperature** | 20% | 20 pts (100%) | 12 pts (60%) | 0 pts |
| **Growing Season** | 15% | 15 pts (100%) | — | 0 pts |
| **Rainfall** | 15% | 15 pts (100%) | 9 pts (60%) | 0 pts |
| **Soil pH** | 15% | 15 pts (100%) | 9 pts (60%) | 0 pts |
| **Humidity** | 5% | 5 pts (100%) | 3 pts (60%) | 0 pts |
| **Nitrogen (N)** | 3.33% | 3.33 pts (100%) | 2 pts (60%) | 0 pts |
| **Phosphorus (P)**| 3.33% | 3.33 pts (100%) | 2 pts (60%) | 0 pts |
| **Potassium (K)** | 3.34% | 3.34 pts (100%) | 2 pts (60%) | 0 pts |
| **Total** | **100%** | | | |

---

## 3. Suitability Categories

* **High compatibility:**
  * Active coverage ratio $\ge 0.50$
  * Normalized Score $\ge 80\%$
  * Zero critical mismatches (soil and climate are within tolerable/optimal bounds).
* **Moderate compatibility:**
  * Active coverage ratio $\ge 0.50$
  * Normalized Score between $60\%$ and $79\%$.
* **Low compatibility:**
  * Normalized Score $< 60\%$, OR
  * At least one hard physiological limit violated (e.g., season outside cultivation window, extreme temperature).
* **Insufficient information:**
  * Active parameter coverage $< 50\%$. The engine declines to make an unsubstantiated recommendation. Score is set to `null`.
