import { Router } from 'express';
import {
  getHealth,
  getCrops,
  createRecommendation,
  getHistory,
  getRecommendationById,
  deleteRecommendation,
  compareCrops
} from '../controllers/recommendationController.js';

const router = Router();

// Health check
router.get('/health', getHealth);

// Crop metadata
router.get('/crops', getCrops);

// Recommendations
router.post('/recommendations', createRecommendation);
router.get('/recommendations', getHistory);
router.get('/recommendations/:id', getRecommendationById);
router.delete('/recommendations/:id', deleteRecommendation);

// Crop Comparison
router.post('/recommendations/compare', compareCrops);

export default router;
