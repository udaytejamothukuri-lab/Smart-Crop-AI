/**
 * SmartCrop AI - Rule-Based Recommendation Engine
 * Method Version: rule-based-v1.0-weighted
 * 
 * Design Principles:
 * 1. Fully transparent and deterministic.
 * 2. Missing inputs are treated as unknown (coverage tracking), never assumed as zero or matching.
 * 3. Normalized weighted scoring across available parameters.
 * 4. Deterministic tie-breaking: Category -> Score -> Positive Matches Count -> Alphabetical Crop Name.
 * 5. Explanations generated strictly from verified evaluated criteria.
 */

import { CROPS_DATA, DATASET_VERSION } from '../data/crops.js';

export const METHOD_VERSION = 'rule-based-v1.0-weighted';

const WEIGHTS = {
  soilType: 20,
  season: 15,
  temperature: 20,
  rainfall: 15,
  ph: 15,
  humidity: 5,
  nitrogen: 3.333,
  phosphorus: 3.333,
  potassium: 3.334
};

const MIN_COVERAGE_THRESHOLD = 0.50; // Minimum 50% parameter weight must be provided

/**
 * Evaluates an input profile against the documented crop requirements.
 * 
 * @param {Object} inputProfile 
 * @param {string} [inputProfile.soilType] - Soil type (e.g. 'clay-loam', 'alluvial')
 * @param {string} [inputProfile.season] - Season ('kharif', 'rabi', 'zaid', 'whole-year')
 * @param {number} [inputProfile.temperature] - Temperature in °C
 * @param {number} [inputProfile.rainfall] - Rainfall in mm/season
 * @param {number} [inputProfile.ph] - Soil pH (0-14)
 * @param {number} [inputProfile.humidity] - Humidity percentage (0-100)
 * @param {number|null} [inputProfile.nitrogen] - Soil N in mg/kg
 * @param {number|null} [inputProfile.phosphorus] - Soil P in mg/kg
 * @param {number|null} [inputProfile.potassium] - Soil K in mg/kg
 * @returns {Object} Recommendation result conforming to specification
 */
export function evaluateCropRecommendations(inputProfile, cropList = CROPS_DATA) {
  const normalizedInput = normalizeInputs(inputProfile);
  const recommendations = [];

  for (const crop of cropList) {
    const evaluation = evaluateSingleCrop(crop, normalizedInput);
    recommendations.push(evaluation);
  }

  // Deterministic Sorting
  // Priority: Category ranking (High > Moderate > Low > Insufficient) -> Score desc -> Matches desc -> Name asc
  const categoryOrder = {
    'High compatibility': 4,
    'Moderate compatibility': 3,
    'Low compatibility': 2,
    'Insufficient information': 1
  };

  recommendations.sort((a, b) => {
    const catDiff = (categoryOrder[b.suitabilityCategory] || 0) - (categoryOrder[a.suitabilityCategory] || 0);
    if (catDiff !== 0) return catDiff;

    const scoreA = a.score !== null ? a.score : -1;
    const scoreB = b.score !== null ? b.score : -1;
    if (scoreB !== scoreA) return scoreB - scoreA;

    const matchDiff = b.matchingFactors.length - a.matchingFactors.length;
    if (matchDiff !== 0) return matchDiff;

    return a.cropName.localeCompare(b.cropName);
  });

  // Assign deterministic rank (1-indexed)
  recommendations.forEach((rec, idx) => {
    rec.rank = idx + 1;
  });

  const topMatches = recommendations.filter(r => r.suitabilityCategory === 'High compatibility' || r.suitabilityCategory === 'Moderate compatibility');

  return {
    success: true,
    methodVersion: METHOD_VERSION,
    datasetVersion: DATASET_VERSION,
    totalCropsEvaluated: cropList.length,
    matchingCropsCount: topMatches.length,
    recommendations,
    inputSummary: {
      soilType: normalizedInput.soilType || 'Not specified',
      season: normalizedInput.season || 'Not specified',
      temperature: normalizedInput.temperature !== null ? `${normalizedInput.temperature} °C` : 'Not provided',
      rainfall: normalizedInput.rainfall !== null ? `${normalizedInput.rainfall} mm` : 'Not provided',
      ph: normalizedInput.ph !== null ? normalizedInput.ph : 'Not provided',
      humidity: normalizedInput.humidity !== null ? `${normalizedInput.humidity} %` : 'Not provided',
      nitrogen: normalizedInput.nitrogen !== null ? `${normalizedInput.nitrogen} mg/kg` : 'Not provided',
      phosphorus: normalizedInput.phosphorus !== null ? `${normalizedInput.phosphorus} mg/kg` : 'Not provided',
      potassium: normalizedInput.potassium !== null ? `${normalizedInput.potassium} mg/kg` : 'Not provided'
    },
    advisory: 'Advisory notice: Recommendations are heuristic estimates based on published agronomic thresholds. Verify with local agricultural extension officers, soil testing laboratories, and regional weather advisories before planting.'
  };
}

/**
 * Normalizes and cleans user input.
 */
function normalizeInputs(input) {
  const norm = {
    soilType: input.soilType ? String(input.soilType).trim().toLowerCase() : null,
    season: input.season ? String(input.season).trim().toLowerCase() : null,
    temperature: isNumeric(input.temperature) ? Number(input.temperature) : null,
    rainfall: isNumeric(input.rainfall) ? Number(input.rainfall) : null,
    ph: isNumeric(input.ph) ? Number(input.ph) : null,
    humidity: isNumeric(input.humidity) ? Number(input.humidity) : null,
    nitrogen: isNumeric(input.nitrogen) ? Number(input.nitrogen) : null,
    phosphorus: isNumeric(input.phosphorus) ? Number(input.phosphorus) : null,
    potassium: isNumeric(input.potassium) ? Number(input.potassium) : null
  };
  return norm;
}

function isNumeric(val) {
  return val !== null && val !== undefined && val !== '' && !isNaN(Number(val));
}

/**
 * Evaluates a single crop against normalized inputs.
 */
export function evaluateSingleCrop(crop, input) {
  const matchingFactors = [];
  const unmetFactors = [];
  const missingFactors = [];
  const detailedChecks = {};

  let totalActiveWeight = 0;
  let earnedScore = 0;
  let criticalMismatches = 0;

  // 1. Soil Type
  if (input.soilType) {
    totalActiveWeight += WEIGHTS.soilType;
    const isMatch = crop.suitableSoilTypes.some(s => s.toLowerCase() === input.soilType);
    if (isMatch) {
      earnedScore += WEIGHTS.soilType;
      matchingFactors.push(`Soil type "${input.soilType}" is compatible with ${crop.name}'s preferred soils (${crop.suitableSoilTypes.join(', ')}).`);
      detailedChecks.soilType = { status: 'MATCH', details: `Compatible with ${crop.suitableSoilTypes.join(', ')}` };
    } else {
      unmetFactors.push(`Soil type "${input.soilType}" does not match optimal soils for ${crop.name} (${crop.suitableSoilTypes.join(', ')}).`);
      detailedChecks.soilType = { status: 'UNMET', details: `Prefers ${crop.suitableSoilTypes.join(', ')}` };
      criticalMismatches += 0.5;
    }
  } else {
    missingFactors.push('Soil type was not provided.');
    detailedChecks.soilType = { status: 'MISSING', details: 'Unknown' };
  }

  // 2. Season
  if (input.season) {
    totalActiveWeight += WEIGHTS.season;
    const isSeasonMatch = crop.suitableSeasons.includes('whole-year') || crop.suitableSeasons.includes(input.season);
    if (isSeasonMatch) {
      earnedScore += WEIGHTS.season;
      matchingFactors.push(`Season "${input.season}" aligns with growing seasons (${crop.suitableSeasons.join(', ')}).`);
      detailedChecks.season = { status: 'MATCH', details: `Permitted: ${crop.suitableSeasons.join(', ')}` };
    } else {
      unmetFactors.push(`Season "${input.season}" is outside primary cultivation window (${crop.suitableSeasons.join(', ')}).`);
      detailedChecks.season = { status: 'UNMET', details: `Requires: ${crop.suitableSeasons.join(', ')}` };
      criticalMismatches += 1;
    }
  } else {
    missingFactors.push('Season was not provided.');
    detailedChecks.season = { status: 'MISSING', details: 'Unknown' };
  }

  // 3. Soil pH
  if (input.ph !== null) {
    totalActiveWeight += WEIGHTS.ph;
    if (input.ph >= crop.optimalPh.min && input.ph <= crop.optimalPh.max) {
      earnedScore += WEIGHTS.ph;
      matchingFactors.push(`Soil pH ${input.ph} is within the optimal range (${crop.optimalPh.min} - ${crop.optimalPh.max}).`);
      detailedChecks.ph = { status: 'MATCH', details: `Optimal (${crop.optimalPh.min} - ${crop.optimalPh.max})` };
    } else if (input.ph >= crop.tolerablePh.min && input.ph <= crop.tolerablePh.max) {
      earnedScore += WEIGHTS.ph * 0.60;
      matchingFactors.push(`Soil pH ${input.ph} is within tolerable limits (${crop.tolerablePh.min} - ${crop.tolerablePh.max}), though optimal is ${crop.optimalPh.min} - ${crop.optimalPh.max}.`);
      detailedChecks.ph = { status: 'TOLERABLE', details: `Tolerable (${crop.tolerablePh.min} - ${crop.tolerablePh.max})` };
    } else {
      unmetFactors.push(`Soil pH ${input.ph} falls outside safe tolerance bounds (${crop.tolerablePh.min} - ${crop.tolerablePh.max}).`);
      detailedChecks.ph = { status: 'UNMET', details: `Tolerable is ${crop.tolerablePh.min} - ${crop.tolerablePh.max}` };
      criticalMismatches += 1;
    }
  } else {
    missingFactors.push('Soil pH measurement was not provided.');
    detailedChecks.ph = { status: 'MISSING', details: 'Unknown' };
  }

  // 4. Temperature
  if (input.temperature !== null) {
    totalActiveWeight += WEIGHTS.temperature;
    if (input.temperature >= crop.optimalTemperature.min && input.temperature <= crop.optimalTemperature.max) {
      earnedScore += WEIGHTS.temperature;
      matchingFactors.push(`Temperature ${input.temperature}°C is within the optimal range (${crop.optimalTemperature.min}°C - ${crop.optimalTemperature.max}°C).`);
      detailedChecks.temperature = { status: 'MATCH', details: `Optimal (${crop.optimalTemperature.min} - ${crop.optimalTemperature.max}°C)` };
    } else if (input.temperature >= crop.tolerableTemperature.min && input.temperature <= crop.tolerableTemperature.max) {
      earnedScore += WEIGHTS.temperature * 0.60;
      matchingFactors.push(`Temperature ${input.temperature}°C is within tolerable limits (${crop.tolerableTemperature.min}°C - ${crop.tolerableTemperature.max}°C).`);
      detailedChecks.temperature = { status: 'TOLERABLE', details: `Tolerable (${crop.tolerableTemperature.min} - ${crop.tolerableTemperature.max}°C)` };
    } else {
      unmetFactors.push(`Temperature ${input.temperature}°C is outside the crop tolerance range (${crop.tolerableTemperature.min}°C - ${crop.tolerableTemperature.max}°C).`);
      detailedChecks.temperature = { status: 'UNMET', details: `Tolerable is ${crop.tolerableTemperature.min} - ${crop.tolerableTemperature.max}°C` };
      criticalMismatches += 1;
    }
  } else {
    missingFactors.push('Temperature was not provided.');
    detailedChecks.temperature = { status: 'MISSING', details: 'Unknown' };
  }

  // 5. Rainfall
  if (input.rainfall !== null) {
    totalActiveWeight += WEIGHTS.rainfall;
    if (input.rainfall >= crop.optimalRainfall.min && input.rainfall <= crop.optimalRainfall.max) {
      earnedScore += WEIGHTS.rainfall;
      matchingFactors.push(`Seasonal rainfall ${input.rainfall} mm satisfies optimal water requirement (${crop.optimalRainfall.min} - ${crop.optimalRainfall.max} mm).`);
      detailedChecks.rainfall = { status: 'MATCH', details: `Optimal (${crop.optimalRainfall.min} - ${crop.optimalRainfall.max} mm)` };
    } else if (input.rainfall >= crop.tolerableRainfall.min && input.rainfall <= crop.tolerableRainfall.max) {
      earnedScore += WEIGHTS.rainfall * 0.60;
      matchingFactors.push(`Seasonal rainfall ${input.rainfall} mm is tolerable (${crop.tolerableRainfall.min} - ${crop.tolerableRainfall.max} mm), supplementary irrigation or drainage may be beneficial.`);
      detailedChecks.rainfall = { status: 'TOLERABLE', details: `Tolerable (${crop.tolerableRainfall.min} - ${crop.tolerableRainfall.max} mm)` };
    } else {
      unmetFactors.push(`Seasonal rainfall ${input.rainfall} mm is outside tolerable range (${crop.tolerableRainfall.min} - ${crop.tolerableRainfall.max} mm).`);
      detailedChecks.rainfall = { status: 'UNMET', details: `Tolerable is ${crop.tolerableRainfall.min} - ${crop.tolerableRainfall.max} mm` };
      criticalMismatches += 0.8;
    }
  } else {
    missingFactors.push('Rainfall measurement was not provided.');
    detailedChecks.rainfall = { status: 'MISSING', details: 'Unknown' };
  }

  // 6. Humidity
  if (input.humidity !== null) {
    totalActiveWeight += WEIGHTS.humidity;
    if (input.humidity >= crop.optimalHumidity.min && input.humidity <= crop.optimalHumidity.max) {
      earnedScore += WEIGHTS.humidity;
      matchingFactors.push(`Humidity ${input.humidity}% is optimal (${crop.optimalHumidity.min}% - ${crop.optimalHumidity.max}%).`);
      detailedChecks.humidity = { status: 'MATCH', details: `Optimal (${crop.optimalHumidity.min} - ${crop.optimalHumidity.max}%)` };
    } else if (input.humidity >= crop.tolerableHumidity.min && input.humidity <= crop.tolerableHumidity.max) {
      earnedScore += WEIGHTS.humidity * 0.60;
      matchingFactors.push(`Humidity ${input.humidity}% is tolerable (${crop.tolerableHumidity.min}% - ${crop.tolerableHumidity.max}%).`);
      detailedChecks.humidity = { status: 'TOLERABLE', details: `Tolerable (${crop.tolerableHumidity.min} - ${crop.tolerableHumidity.max}%)` };
    } else {
      unmetFactors.push(`Humidity ${input.humidity}% is outside typical crop tolerance (${crop.tolerableHumidity.min}% - ${crop.tolerableHumidity.max}%).`);
      detailedChecks.humidity = { status: 'UNMET', details: `Tolerable is ${crop.tolerableHumidity.min} - ${crop.tolerableHumidity.max}%` };
    }
  } else {
    missingFactors.push('Humidity was not provided.');
    detailedChecks.humidity = { status: 'MISSING', details: 'Unknown' };
  }

  // 7. Nutrients (N, P, K)
  const nutrientWeightTotal = WEIGHTS.nitrogen + WEIGHTS.phosphorus + WEIGHTS.potassium;
  const nReq = crop.nutrientRequirements;

  // Nitrogen
  if (input.nitrogen !== null) {
    totalActiveWeight += WEIGHTS.nitrogen;
    if (input.nitrogen >= nReq.nitrogen.min && input.nitrogen <= nReq.nitrogen.max) {
      earnedScore += WEIGHTS.nitrogen;
      matchingFactors.push(`Available Nitrogen (${input.nitrogen} mg/kg) aligns with crop requirement (${nReq.nitrogen.min} - ${nReq.nitrogen.max} mg/kg).`);
      detailedChecks.nitrogen = { status: 'MATCH', details: `Optimal (${nReq.nitrogen.min} - ${nReq.nitrogen.max} mg/kg)` };
    } else if (input.nitrogen >= nReq.nitrogen.min * 0.70 && input.nitrogen <= nReq.nitrogen.max * 1.30) {
      earnedScore += WEIGHTS.nitrogen * 0.60;
      matchingFactors.push(`Available Nitrogen (${input.nitrogen} mg/kg) is moderately close to requirement (${nReq.nitrogen.min} - ${nReq.nitrogen.max} mg/kg).`);
      detailedChecks.nitrogen = { status: 'TOLERABLE', details: `Adequate (${nReq.nitrogen.min * 0.7} - ${nReq.nitrogen.max * 1.3} mg/kg)` };
    } else {
      unmetFactors.push(`Available Nitrogen (${input.nitrogen} mg/kg) deviates substantially from optimal range (${nReq.nitrogen.min} - ${nReq.nitrogen.max} mg/kg).`);
      detailedChecks.nitrogen = { status: 'UNMET', details: `Optimal is ${nReq.nitrogen.min} - ${nReq.nitrogen.max} mg/kg` };
    }
  } else {
    missingFactors.push('Nitrogen (N) laboratory test value was omitted.');
    detailedChecks.nitrogen = { status: 'MISSING', details: 'Omitted' };
  }

  // Phosphorus
  if (input.phosphorus !== null) {
    totalActiveWeight += WEIGHTS.phosphorus;
    if (input.phosphorus >= nReq.phosphorus.min && input.phosphorus <= nReq.phosphorus.max) {
      earnedScore += WEIGHTS.phosphorus;
      matchingFactors.push(`Available Phosphorus (${input.phosphorus} mg/kg) aligns with crop requirement (${nReq.phosphorus.min} - ${nReq.phosphorus.max} mg/kg).`);
      detailedChecks.phosphorus = { status: 'MATCH', details: `Optimal (${nReq.phosphorus.min} - ${nReq.phosphorus.max} mg/kg)` };
    } else if (input.phosphorus >= nReq.phosphorus.min * 0.70 && input.phosphorus <= nReq.phosphorus.max * 1.30) {
      earnedScore += WEIGHTS.phosphorus * 0.60;
      matchingFactors.push(`Available Phosphorus (${input.phosphorus} mg/kg) is moderately adequate (${nReq.phosphorus.min} - ${nReq.phosphorus.max} mg/kg).`);
      detailedChecks.phosphorus = { status: 'TOLERABLE', details: `Adequate (${nReq.phosphorus.min * 0.7} - ${nReq.phosphorus.max * 1.3} mg/kg)` };
    } else {
      unmetFactors.push(`Available Phosphorus (${input.phosphorus} mg/kg) deviates from optimal range (${nReq.phosphorus.min} - ${nReq.phosphorus.max} mg/kg).`);
      detailedChecks.phosphorus = { status: 'UNMET', details: `Optimal is ${nReq.phosphorus.min} - ${nReq.phosphorus.max} mg/kg` };
    }
  } else {
    missingFactors.push('Phosphorus (P) laboratory test value was omitted.');
    detailedChecks.phosphorus = { status: 'MISSING', details: 'Omitted' };
  }

  // Potassium
  if (input.potassium !== null) {
    totalActiveWeight += WEIGHTS.potassium;
    if (input.potassium >= nReq.potassium.min && input.potassium <= nReq.potassium.max) {
      earnedScore += WEIGHTS.potassium;
      matchingFactors.push(`Available Potassium (${input.potassium} mg/kg) aligns with crop requirement (${nReq.potassium.min} - ${nReq.potassium.max} mg/kg).`);
      detailedChecks.potassium = { status: 'MATCH', details: `Optimal (${nReq.potassium.min} - ${nReq.potassium.max} mg/kg)` };
    } else if (input.potassium >= nReq.potassium.min * 0.70 && input.potassium <= nReq.potassium.max * 1.30) {
      earnedScore += WEIGHTS.potassium * 0.60;
      matchingFactors.push(`Available Potassium (${input.potassium} mg/kg) is moderately adequate (${nReq.potassium.min} - ${nReq.potassium.max} mg/kg).`);
      detailedChecks.potassium = { status: 'TOLERABLE', details: `Adequate (${nReq.potassium.min * 0.7} - ${nReq.potassium.max * 1.3} mg/kg)` };
    } else {
      unmetFactors.push(`Available Potassium (${input.potassium} mg/kg) deviates from optimal range (${nReq.potassium.min} - ${nReq.potassium.max} mg/kg).`);
      detailedChecks.potassium = { status: 'UNMET', details: `Optimal is ${nReq.potassium.min} - ${nReq.potassium.max} mg/kg` };
    }
  } else {
    missingFactors.push('Potassium (K) laboratory test value was omitted.');
    detailedChecks.potassium = { status: 'MISSING', details: 'Omitted' };
  }

  // Total possible weight is 100
  const coverageRatio = totalActiveWeight / 100;
  let normalizedScore = null;
  let suitabilityCategory = 'Insufficient information';

  if (coverageRatio < MIN_COVERAGE_THRESHOLD) {
    suitabilityCategory = 'Insufficient information';
    normalizedScore = null;
  } else {
    normalizedScore = Math.round((earnedScore / totalActiveWeight) * 100);

    if (criticalMismatches >= 1) {
      suitabilityCategory = 'Low compatibility';
    } else if (normalizedScore >= 80 && criticalMismatches === 0) {
      suitabilityCategory = 'High compatibility';
    } else if (normalizedScore >= 60) {
      suitabilityCategory = 'Moderate compatibility';
    } else {
      suitabilityCategory = 'Low compatibility';
    }
  }

  // Explanation synthesis
  let explanation = '';
  if (suitabilityCategory === 'Insufficient information') {
    explanation = `Evaluation has insufficient data coverage (${Math.round(coverageRatio * 100)}%). At least 50% of environmental parameters must be provided for a reliable assessment.`;
  } else if (suitabilityCategory === 'High compatibility') {
    explanation = `${crop.name} shows strong compatibility with your soil and climate profile. Evaluated conditions meet optimal agronomic requirements with zero critical mismatches.`;
  } else if (suitabilityCategory === 'Moderate compatibility') {
    explanation = `${crop.name} is moderately suited. Some conditions meet optimal criteria, but others fall within marginal tolerance bounds or require management.`;
  } else {
    explanation = `${crop.name} has low compatibility with the submitted conditions due to one or more environmental limitations (${unmetFactors.slice(0, 2).join(' ')}).`;
  }

  const limitations = [
    crop.assumptions,
    'This rule-based result does not account for real-time pest outbreaks, salinity patches, or unseasonal frost.'
  ];

  if (missingFactors.length > 0) {
    limitations.push(`Missing parameters: ${missingFactors.length} factors omitted. Soil testing is advised before field operations.`);
  }

  return {
    cropId: crop.id,
    cropName: crop.name,
    botanicalName: crop.botanicalName,
    category: crop.category,
    rank: null, // assigned after sorting
    suitabilityCategory,
    score: normalizedScore,
    coveragePercentage: Math.round(coverageRatio * 100),
    matchingFactors,
    unmetFactors,
    missingFactors,
    detailedChecks,
    explanation,
    limitations,
    growingPeriodDays: crop.growingPeriodDays,
    source: crop.source
  };
}
