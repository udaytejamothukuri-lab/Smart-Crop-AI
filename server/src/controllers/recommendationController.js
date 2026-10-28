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
      persistenceStatus = 'database_offline';
    }

    const statusCode = persistenceStatus === 'saved' ? 201 : 200;

    res.status(statusCode).json({
      success: true,
      id: savedRecord ? savedRecord._id : null,
      persisted: persistenceStatus === 'saved',
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
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Database persistence is currently unavailable. Ensure MongoDB is running and MONGODB_URI is configured.',
        databaseStatus: dbStatus
      });
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Recommendation.find({}, {
        _id: 1,
        createdAt: 1,
        inputProfile: 1,
        missingInputs: 1,
        topCrop: 1,
        methodVersion: 1,
        datasetVersion: 1,
        recommendations: { $slice: 3 } // return top 3 crops in history list view
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
      Recommendation.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      notice: 'Public history mode: All saved recommendations are visible without personal credentials. Do not submit sensitive data.',
      records
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
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Database is currently unavailable to retrieve saved recommendation record.'
      });
    }

    const record = await Recommendation.findById(id).lean();
    if (!record) {
      return res.status(404).json({
        success: false,
        error: `Recommendation with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
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
    if (!dbStatus.connected) {
      return res.status(503).json({
        success: false,
        error: 'Database is currently unavailable to perform deletion.'
      });
    }

    const deleted = await Recommendation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Recommendation with ID "${id}" was not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: `Recommendation record "${id}" was successfully deleted.`
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
