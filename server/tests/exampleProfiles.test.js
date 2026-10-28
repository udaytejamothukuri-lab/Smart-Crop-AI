import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCropRecommendations } from '../src/services/recommendationEngine.js';
import { validateInputProfile } from '../src/validators/recommendationValidator.js';

describe('SmartCrop AI - Five Required Example Input Profiles (Section 10)', () => {

  /**
   * Profile 1: Complete, Valid Input Profile (Kharif Wetland / Paddy)
   * Units:
   * - Soil Type: 'clay' (dimensionless categorical)
   * - Season: 'kharif'
   * - Temperature: 28 °C
   * - Rainfall: 1500 mm/season
   * - Soil pH: 6.5 (pH scale)
   * - Humidity: 80 %
   * - Nitrogen (N): 130 mg/kg
   * - Phosphorus (P): 30 mg/kg
   * - Potassium (K): 40 mg/kg
   */
  test('Profile 1: Complete Valid Kharif Wetland Profile -> Rice High Compatibility', () => {
    const input = {
      soilType: 'clay',
      season: 'kharif',
      temperature: 28,
      rainfall: 1500,
      ph: 6.5,
      humidity: 80,
      nitrogen: 130,
      phosphorus: 30,
      potassium: 40
    };

    const validation = validateInputProfile(input);
    assert.equal(validation.isValid, true, 'Profile 1 must pass validation');

    const result = evaluateCropRecommendations(validation.sanitized);
    assert.equal(result.success, true);

    const topCrop = result.recommendations[0];
    assert.equal(topCrop.cropId, 'rice', 'Rice must rank #1 for high rainfall clay Kharif profile');
    assert.equal(topCrop.suitabilityCategory, 'High compatibility');
    assert.ok(topCrop.score >= 90, `Expected score >= 90, got ${topCrop.score}`);
    assert.equal(topCrop.unmetFactors.length, 0, 'No critical unmet factors for rice in this profile');
  });

  /**
   * Profile 2: Different Soil and Climate Combination (Cool Arid / Sandy-Loam Rabi)
   * Units:
   * - Soil Type: 'sandy-loam'
   * - Season: 'rabi'
   * - Temperature: 18 °C
   * - Rainfall: 350 mm/season
   * - Soil pH: 7.0
   * - Humidity: 45 %
   * - Nitrogen (N): 30 mg/kg
   * - Phosphorus (P): 30 mg/kg
   * - Potassium (K): 30 mg/kg
   */
  test('Profile 2: Sandy-Loam Cool Arid Rabi Profile -> Chickpea High Compatibility', () => {
    const input = {
      soilType: 'sandy-loam',
      season: 'rabi',
      temperature: 18,
      rainfall: 350,
      ph: 7.0,
      humidity: 45,
      nitrogen: 30,
      phosphorus: 30,
      potassium: 30
    };

    const validation = validateInputProfile(input);
    assert.equal(validation.isValid, true);

    const result = evaluateCropRecommendations(validation.sanitized);
    const chickpea = result.recommendations.find(r => r.cropId === 'chickpea');
    const rice = result.recommendations.find(r => r.cropId === 'rice');

    assert.ok(chickpea, 'Chickpea must be in recommendations');
    assert.equal(chickpea.suitabilityCategory, 'High compatibility');
    assert.ok(chickpea.score >= 85);

    // Rice must be low compatibility due to low rainfall (350mm vs min 800mm) and wrong season (rabi vs kharif)
    assert.ok(rice, 'Rice must be evaluated');
    assert.equal(rice.suitabilityCategory, 'Low compatibility');
    assert.ok(rice.unmetFactors.some(f => f.includes('rainfall') || f.includes('Season')));
  });

  /**
   * Profile 3: Different Season (Zaid / Summer season)
   * Units:
   * - Soil Type: 'sandy-loam'
   * - Season: 'zaid'
   * - Temperature: 28 °C
   * - Rainfall: 600 mm/season
   * - Soil pH: 6.5
   * - Humidity: 55 %
   * - Nitrogen (N): 100 mg/kg
   * - Phosphorus (P): 35 mg/kg
   * - Potassium (K): 40 mg/kg
   */
  test('Profile 3: Zaid (Summer) Season Profile -> Summer crops prioritized, Rabi crops marked Low', () => {
    const input = {
      soilType: 'sandy-loam',
      season: 'zaid',
      temperature: 28,
      rainfall: 600,
      ph: 6.5,
      humidity: 55,
      nitrogen: 100,
      phosphorus: 35,
      potassium: 40
    };

    const validation = validateInputProfile(input);
    assert.equal(validation.isValid, true);

    const result = evaluateCropRecommendations(validation.sanitized);
    
    // Maize and Groundnut support Zaid
    const maize = result.recommendations.find(r => r.cropId === 'maize');
    const groundnut = result.recommendations.find(r => r.cropId === 'groundnut');
    const wheat = result.recommendations.find(r => r.cropId === 'wheat');

    assert.ok(maize.suitabilityCategory === 'High compatibility' || maize.suitabilityCategory === 'Moderate compatibility');
    assert.ok(groundnut.suitabilityCategory === 'High compatibility' || groundnut.suitabilityCategory === 'Moderate compatibility');
    
    // Wheat only grows in Rabi; in Zaid it must have Low compatibility
    assert.equal(wheat.suitabilityCategory, 'Low compatibility');
    assert.ok(wheat.unmetFactors.some(f => f.includes('Season')));
  });

  /**
   * Profile 4: Missing Nutrient Measurements (N, P, K omitted / null)
   * Units:
   * - Soil Type: 'loamy'
   * - Season: 'rabi'
   * - Temperature: 18 °C
   * - Rainfall: 500 mm
   * - Soil pH: 6.8
   * - Humidity: 55 %
   * - Nitrogen: null
   * - Phosphorus: null
   * - Potassium: null
   */
  test('Profile 4: Missing Nutrient Values -> Normalized without penalty, recorded in missingFactors', () => {
    const input = {
      soilType: 'loamy',
      season: 'rabi',
      temperature: 18,
      rainfall: 500,
      ph: 6.8,
      humidity: 55,
      nitrogen: null,
      phosphorus: null,
      potassium: null
    };

    const validation = validateInputProfile(input);
    assert.equal(validation.isValid, true);
    assert.equal(validation.sanitized.nitrogen, null);
    assert.equal(validation.sanitized.phosphorus, null);
    assert.equal(validation.sanitized.potassium, null);

    const result = evaluateCropRecommendations(validation.sanitized);
    const wheat = result.recommendations.find(r => r.cropId === 'wheat');

    assert.equal(wheat.suitabilityCategory, 'High compatibility');
    assert.ok(wheat.score >= 80, `Score is normalized over available environmental factors`);
    
    // Explicit verification that missing nutrients are listed
    assert.ok(wheat.missingFactors.some(m => m.includes('Nitrogen')));
    assert.ok(wheat.missingFactors.some(m => m.includes('Phosphorus')));
    assert.ok(wheat.missingFactors.some(m => m.includes('Potassium')));
  });

  /**
   * Profile 5: Invalid or Unsupported Input Conditions
   * Tests:
   * - Invalid soil type: 'martian-regolith'
   * - Invalid pH: 18.5 (out of range 0-14)
   * - Invalid temperature: 95 °C (unrealistic)
   * - Invalid rainfall: -100 mm (negative)
   * - Invalid humidity: 150 % (exceeds 100%)
   */
  test('Profile 5: Invalid / Unsupported Input Conditions -> Rejected by validator with clear messages', () => {
    const invalidInput = {
      soilType: 'martian-regolith',
      season: 'monsoon-season-invalid',
      temperature: 95,
      rainfall: -100,
      ph: 18.5,
      humidity: 150
    };

    const validation = validateInputProfile(invalidInput);
    assert.equal(validation.isValid, false, 'Invalid inputs must fail validation');
    assert.ok(validation.errors.length >= 4, `Expected at least 4 validation errors, got ${validation.errors.length}`);
    
    assert.ok(validation.errors.some(e => e.includes('soilType')));
    assert.ok(validation.errors.some(e => e.includes('season')));
    assert.ok(validation.errors.some(e => e.includes('pH')));
    assert.ok(validation.errors.some(e => e.includes('Temperature')));
    assert.ok(validation.errors.some(e => e.includes('Rainfall')));
    assert.ok(validation.errors.some(e => e.includes('humidity')));
  });

});
