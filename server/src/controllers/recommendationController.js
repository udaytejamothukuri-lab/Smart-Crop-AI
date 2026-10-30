import mongoose from 'mongoose';
import { CROPS_DATA, DATASET_VERSION, VALID_SOIL_TYPES, VALID_SEASONS } from '../data/crops.js';
import { evaluateCropRecommendations, evaluateSingleCrop, METHOD_VERSION } from '../services/recommendationEngine.js';
import { validateInputProfile, validateComparisonRequest } from '../validators/recommendationValidator.js';
import { Recommendation } from '../models/Recommendation.js';
import { getDbStatus } from '../config/db.js';

/**
 * GET /api/health
 */
export async function getHealth(req, res) {
  const dbStatus = getDbStatus();
  res.status(200).json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'SmartCrop AI Recommendation API',
    version: '1.0.0',
    methodVersion: METHOD_VERSION,
    datasetVersion: DATASET_VERSION,
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
}

/**
 * GET /api/crops
 */
export async function getCrops(req, res) {
  res.status(200).json({
    success: true,
    datasetVersion: DATASET_VERSION,
    count: CROPS_DATA.length,
    supportedSoilTypes: VALID_SOIL_TYPES,
    supportedSeasons: VALID_SEASONS,
    crops: CROPS_DATA.map(c => ({
      id: c.id,
      name: c.name,
      botanicalName: c.botanicalName,
      category: c.category,
      suitableSoilTypes: c.suitableSoilTypes,
      optimalPh: c.optimalPh,
      tolerablePh: c.tolerablePh,
      optimalTemperature: c.optimalTemperature,
      tolerableTemperature: c.tolerableTemperature,
      optimalRainfall: c.optimalRainfall,
      tolerableRainfall: c.tolerableRainfall,
      optimalHumidity: c.optimalHumidity,
      tolerableHumidity: c.tolerableHumidity,
      suitableSeasons: c.suitableSeasons,
      growingPeriodDays: c.growingPeriodDays,
      source: c.source,
      assumptions: c.assumptions
    }))
  });
}

// In-Memory Storage Fallback for standalone/demo execution without MongoDB
const inMemoryStore = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    inputProfile: {
      soilType: 'clay',
      season: 'kharif',
      ph: 6.5,
      temperature: 28,
      rainfall: 1500,
      humidity: 80,
      nitrogen: 130,
      phosphorus: 30,
      potassium: 40
    },
    missingInputs: [],
    topCrop: {
      cropName: 'Rice (Paddy)',
      suitabilityCategory: 'High compatibility',
      score: 100
    },
    methodVersion: METHOD_VERSION,
    datasetVersion: DATASET_VERSION,
    advisory: 'Advisory: Evaluated against documented ICAR/FAO agro-ecological thresholds. Recommendations are for decision-support and do not guarantee yield.',
    recommendations: evaluateCropRecommendations({
      soilType: 'clay',
      season: 'kharif',
      ph: 6.5,
      temperature: 28,
      rainfall: 1500,
      humidity: 80,
      nitrogen: 130,
      phosphorus: 30,
      potassium: 40
    }).recommendations
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    createdAt: new Date(Date.now() - 3600000 * 18), // 18 hours ago
    inputProfile: {
      soilType: 'sandy-loam',
      season: 'rabi',
      ph: 7.0,
      temperature: 18,
      rainfall: 350,
      humidity: 45,
      nitrogen: 30,
      phosphorus: 30,
      potassium: 30
    },
    missingInputs: [],
    topCrop: {
      cropName: 'Chickpea (Gram)',
      suitabilityCategory: 'High compatibility',
      score: 92
    },
    methodVersion: METHOD_VERSION,
    datasetVersion: DATASET_VERSION,
    advisory: 'Advisory: Evaluated against documented ICAR/FAO agro-ecological thresholds. Recommendations are for decision-support and do not guarantee yield.',
    recommendations: evaluateCropRecommendations({
      soilType: 'sandy-loam',
      season: 'rabi',
      ph: 7.0,
      temperature: 18,
      rainfall: 350,
      humidity: 45,
      nitrogen: 30,
      phosphorus: 30,
      potassium: 30
    }).recommendations
  }
];

/**
 * POST /api/recommendations
 */
export async function createRecommendation(req, res, next) {
  try {
    const validation = validateInputProfile(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        validationErrors: validation.errors
      });
    }

    const evaluationResult = evaluateCropRecommendations(validation.sanitized);

    // Identify missing inputs
    const missingInputs = [];
    if (!validation.sanitized.soilType) missingInputs.push('soilType');
    if (!validation.sanitized.season) missingInputs.push('season');
    if (validation.sanitized.ph === null) missingInputs.push('ph');
    if (validation.sanitized.temperature === null) missingInputs.push('temperature');
    if (validation.sanitized.rainfall === null) missingInputs.push('rainfall');
    if (validation.sanitized.humidity === null) missingInputs.push('humidity');
    if (validation.sanitized.nitrogen === null) missingInputs.push('nitrogen');
    if (validation.sanitized.phosphorus === null) missingInputs.push('phosphorus');
    if (validation.sanitized.potassium === null) missingInputs.push('potassium');

    const topRecommendation = evaluationResult.recommendations[0] || null;

    let savedRecord = null;
    let persistenceStatus = 'not_configured';

    const dbStatus = getDbStatus();
    if (dbStatus.connected) {
      try {
        const record = new Recommendation({
          inputProfile: validation.sanitized,
          missingInputs,
          recommendations: evaluationResult.recommendations,
          topCrop: topRecommendation ? {
            cropName: topRecommendation.cropName,
            suitabilityCategory: topRecommendation.suitabilityCategory,
            score: topRecommendation.score
          } : null,
          methodVersion: evaluationResult.methodVersion,
          datasetVersion: evaluationResult.datasetVersion,
          advisory: evaluationResult.advisory
        });

        savedRecord = await record.save();
        persistenceStatus = 'saved';
      } catch (dbErr) {
        console.error('Failed to save recommendation to MongoDB:', dbErr.message);
        persistenceStatus = 'save_failed';
      }
    } else {
      // In-memory session persistence
      const memRecord = {
        _id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date(),
        inputProfile: validation.sanitized,
        missingInputs,
        recommendations: evaluationResult.recommendations,
        topCrop: topRecommendation ? {
          cropName: topRecommendation.cropName,
          suitabilityCategory: topRecommendation.suitabilityCategory,
          score: topRecommendation.score
        } : null,
        methodVersion: evaluationResult.methodVersion,
        datasetVersion: evaluationResult.datasetVersion,
        advisory: evaluationResult.advisory
      };
      inMemoryStore.unshift(memRecord);
      savedRecord = memRecord;
      persistenceStatus = 'in_memory';
    }

    const statusCode = (persistenceStatus === 'saved' || persistenceStatus === 'in_memory') ? 201 : 200;

    res.status(statusCode).json({
      success: true,
      id: savedRecord ? savedRecord._id : null,
      persisted: persistenceStatus === 'saved' || persistenceStatus === 'in_memory',
      persistenceStatus,
      methodVersion: evaluationResult.methodVersion,
      datasetVersion: evaluationResult.datasetVersion,
      totalCropsEvaluated: evaluationResult.totalCropsEvaluated,
      matchingCropsCount: evaluationResult.matchingCropsCount,
      inputSummary: evaluationResult.inputSummary,
      missingInputs,
      recommendations: evaluationResult.recommendations,
      advisory: evaluationResult.advisory,
      createdAt: savedRecord ? savedRecord.createdAt : new Date()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/recommendations
 */
export async function getHistory(req, res, next) {
  try {
    const dbStatus = getDbStatus();
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * limit;

    if (dbStatus.connected) {
      const [records, total] = await Promise.all([
        Recommendation.find({}, {
          _id: 1,
          createdAt: 1,
          inputProfile: 1,
          missingInputs: 1,
          topCrop: 1,
          methodVersion: 1,
          datasetVersion: 1,
          recommendations: { $slice: 3 }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
        Recommendation.countDocuments()
      ]);

      return res.status(200).json({
        success: true,
        count: records.length,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        storageMode: 'mongodb',
        notice: 'Public history mode: All saved recommendations are visible without personal credentials. Do not submit sensitive data.',
        records
      });
    }

    // In-memory fallback mode
    const total = inMemoryStore.length;
    const paginated = inMemoryStore.slice(skip, skip + limit).map(r => ({
      _id: r._id,
      createdAt: r.createdAt,
      inputProfile: r.inputProfile,
      missingInputs: r.missingInputs,
      topCrop: r.topCrop,
      methodVersion: r.methodVersion,
      datasetVersion: r.datasetVersion,
      recommendations: (r.recommendations || []).slice(0, 3)
    }));

    res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      storageMode: 'in_memory',
      notice: 'In-Memory Demo Mode: Storing records in server memory for this session.',
      records: paginated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/recommendations/:id
 */
export async function getRecommendationById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid recommendation identifier "${id}". Expected a valid 24-character hexadecimal MongoDB ObjectId.`
      });
    }

    const dbStatus = getDbStatus();
    if (dbStatus.connected) {
      const record = await Recommendation.findById(id).lean();
      if (!record) {
        return res.status(404).json({
          success: false,
          error: `Recommendation with ID "${id}" was not found.`
        });
      }

      return res.status(200).json({
        success: true,
        storageMode: 'mongodb',
        record
      });
    }

    // In-memory fallback
    const record = inMemoryStore.find(r => r._id.toString() === id.toString());
    if (!record) {
      return res.status(404).json({
        success: false,
        error: `Recommendation with ID "${id}" was not found in session memory.`
      });
    }

    res.status(200).json({
      success: true,
      storageMode: 'in_memory',
      record
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/recommendations/:id
 */
export async function deleteRecommendation(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid recommendation identifier "${id}". Expected a valid 24-character hexadecimal MongoDB ObjectId.`
      });
    }

    const dbStatus = getDbStatus();
    if (dbStatus.connected) {
      const deleted = await Recommendation.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: `Recommendation with ID "${id}" was not found.`
        });
      }

      return res.status(200).json({
        success: true,
        storageMode: 'mongodb',
        message: `Recommendation record "${id}" was successfully deleted.`
      });
    }

    // In-memory fallback
    const index = inMemoryStore.findIndex(r => r._id.toString() === id.toString());
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: `Recommendation with ID "${id}" was not found in session memory.`
      });
    }

    inMemoryStore.splice(index, 1);

    res.status(200).json({
      success: true,
      storageMode: 'in_memory',
      message: `Recommendation record "${id}" was successfully deleted from session memory.`
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/recommendations/compare
 */
export async function compareCrops(req, res, next) {
  try {
    const validation = validateComparisonRequest(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        validationErrors: validation.errors
      });
    }

    const { cropIds, sanitizedProfile } = validation;
    const targetCrops = CROPS_DATA.filter(c => cropIds.includes(c.id));

    const comparisons = targetCrops.map(crop => {
      const evalResult = evaluateSingleCrop(crop, sanitizedProfile);
      return {
        cropId: crop.id,
        cropName: crop.name,
        botanicalName: crop.botanicalName,
        category: crop.category,
        suitabilityCategory: evalResult.suitabilityCategory,
        score: evalResult.score,
        coveragePercentage: evalResult.coveragePercentage,
        soilCompatibility: evalResult.detailedChecks.soilType,
        seasonCompatibility: evalResult.detailedChecks.season,
        temperatureCompatibility: evalResult.detailedChecks.temperature,
        rainfallCompatibility: evalResult.detailedChecks.rainfall,
        phCompatibility: evalResult.detailedChecks.ph,
        humidityCompatibility: evalResult.detailedChecks.humidity,
        nutrientCompatibility: {
          nitrogen: evalResult.detailedChecks.nitrogen,
          phosphorus: evalResult.detailedChecks.phosphorus,
          potassium: evalResult.detailedChecks.potassium
        },
        matchingFactors: evalResult.matchingFactors,
        unmetFactors: evalResult.unmetFactors,
        missingFactors: evalResult.missingFactors,
        explanation: evalResult.explanation,
        limitations: evalResult.limitations,
        growingPeriodDays: crop.growingPeriodDays,
        source: crop.source
      };
    });

    res.status(200).json({
      success: true,
      methodVersion: METHOD_VERSION,
      datasetVersion: DATASET_VERSION,
      evaluatedProfile: sanitizedProfile,
      cropsCount: comparisons.length,
      comparisons,
      advisory: 'Advisory notice: Comparison is based on static rule evaluation against identical environmental inputs. Consult agricultural specialists for specific plot recommendations.'
    });
  } catch (error) {
    next(error);
  }
}
