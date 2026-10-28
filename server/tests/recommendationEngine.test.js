import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCropRecommendations, evaluateSingleCrop, METHOD_VERSION } from '../src/services/recommendationEngine.js';
import { CROPS_DATA } from '../src/data/crops.js';

describe('SmartCrop AI - Recommendation Engine Unit Tests', () => {

  test('Deterministic execution: running identical profile twice yields identical order and scores', () => {
    const profile = {
      soilType: 'clay-loam',
      season: 'rabi',
      temperature: 18,
      rainfall: 450,
      ph: 6.8,
      humidity: 55,
      nitrogen: 100,
      phosphorus: 35,
      potassium: 40
    };

    const res1 = evaluateCropRecommendations(profile);
    const res2 = evaluateCropRecommendations(profile);

    assert.equal(res1.recommendations.length, res2.recommendations.length);
    for (let i = 0; i < res1.recommendations.length; i++) {
      assert.equal(res1.recommendations[i].cropId, res2.recommendations[i].cropId);
      assert.equal(res1.recommendations[i].score, res2.recommendations[i].score);
      assert.equal(res1.recommendations[i].rank, res2.recommendations[i].rank);
      assert.equal(res1.recommendations[i].suitabilityCategory, res2.recommendations[i].suitabilityCategory);
    }
  });

  test('High compatibility classification for Wheat in cool Rabi conditions', () => {
    const wheatProfile = {
      soilType: 'loamy',
      season: 'rabi',
      temperature: 18,
      rainfall: 500,
      ph: 6.5,
      humidity: 55,
      nitrogen: 110,
      phosphorus: 35,
      potassium: 35
    };

    const result = evaluateCropRecommendations(wheatProfile);
    const wheatRec = result.recommendations.find(r => r.cropId === 'wheat');

    assert.ok(wheatRec, 'Wheat should be evaluated');
    assert.equal(wheatRec.suitabilityCategory, 'High compatibility');
    assert.ok(wheatRec.score >= 80, `Expected score >= 80, got ${wheatRec.score}`);
    assert.ok(wheatRec.matchingFactors.length > 0);
  });

  test('Missing nutrient values are marked as missing and not treated as zero', () => {
    const profileWithoutNutrients = {
      soilType: 'clay',
      season: 'kharif',
      temperature: 28,
      rainfall: 1400,
      ph: 6.5,
      humidity: 80,
      nitrogen: null,
      phosphorus: null,
      potassium: null
    };

    const result = evaluateCropRecommendations(profileWithoutNutrients);
    const riceRec = result.recommendations.find(r => r.cropId === 'rice');

    assert.ok(riceRec, 'Rice should be evaluated');
    // Ensure missing nutrients are recorded in missingFactors
    const hasNutrientMissing = riceRec.missingFactors.some(f => f.includes('Nitrogen') || f.includes('Phosphorus'));
    assert.ok(hasNutrientMissing, 'Missing nutrients must be recorded');
    assert.ok(riceRec.score !== null, 'Score should still be computed on available parameters');
  });

  test('Insufficient information when fewer than 50% parameter weights are provided', () => {
    const bareProfile = {
      soilType: 'sandy'
      // All other parameters omitted
    };

    const result = evaluateCropRecommendations(bareProfile);
    for (const rec of result.recommendations) {
      assert.equal(rec.suitabilityCategory, 'Insufficient information');
      assert.equal(rec.score, null);
      assert.ok(rec.explanation.includes('insufficient data coverage'));
    }
  });

  test('Low compatibility when critical parameters like Season or Temperature strictly mismatch', () => {
    const frostProfile = {
      soilType: 'clay',
      season: 'kharif',
      temperature: -2, // Below any crop's tolerable range
      rainfall: 1200,
      ph: 6.5,
      humidity: 80
    };

    const result = evaluateCropRecommendations(frostProfile);
    for (const rec of result.recommendations) {
      assert.equal(rec.suitabilityCategory, 'Low compatibility');
    }
  });

  test('Tie-breaking rule breaks equal scores by positive matches, then alphabetical cropName', () => {
    const dummyCrops = [
      {
        id: 'crop_b',
        name: 'Beta Crop',
        botanicalName: 'Beta',
        category: 'Cereal',
        suitableSoilTypes: ['loamy'],
        optimalPh: { min: 6, max: 7 },
        tolerablePh: { min: 5, max: 8 },
        optimalTemperature: { min: 20, max: 30 },
        tolerableTemperature: { min: 15, max: 35 },
        optimalRainfall: { min: 400, max: 600 },
        tolerableRainfall: { min: 300, max: 700 },
        optimalHumidity: { min: 50, max: 70 },
        tolerableHumidity: { min: 40, max: 80 },
        suitableSeasons: ['kharif'],
        nutrientRequirements: { nitrogen: { min: 50, max: 100 }, phosphorus: { min: 20, max: 40 }, potassium: { min: 20, max: 40 } },
        assumptions: 'None'
      },
      {
        id: 'crop_a',
        name: 'Alpha Crop',
        botanicalName: 'Alpha',
        category: 'Cereal',
        suitableSoilTypes: ['loamy'],
        optimalPh: { min: 6, max: 7 },
        tolerablePh: { min: 5, max: 8 },
        optimalTemperature: { min: 20, max: 30 },
        tolerableTemperature: { min: 15, max: 35 },
        optimalRainfall: { min: 400, max: 600 },
        tolerableRainfall: { min: 300, max: 700 },
        optimalHumidity: { min: 50, max: 70 },
        tolerableHumidity: { min: 40, max: 80 },
        suitableSeasons: ['kharif'],
        nutrientRequirements: { nitrogen: { min: 50, max: 100 }, phosphorus: { min: 20, max: 40 }, potassium: { min: 20, max: 40 } },
        assumptions: 'None'
      }
    ];

    const input = {
      soilType: 'loamy',
      season: 'kharif',
      temperature: 25,
      rainfall: 500,
      ph: 6.5,
      humidity: 60
    };

    const res = evaluateCropRecommendations(input, dummyCrops);
    assert.equal(res.recommendations[0].cropName, 'Alpha Crop');
    assert.equal(res.recommendations[1].cropName, 'Beta Crop');
  });

});
