import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResultsPage from '../pages/ResultsPage';

const mockResult = {
  success: true,
  methodVersion: 'rule-based-v1.0-weighted',
  datasetVersion: 'v1.1.0-icar-fao-documented',
  totalCropsEvaluated: 12,
  matchingCropsCount: 1,
  persisted: true,
  id: '507f1f77bcf86cd799439011',
  inputSummary: {
    soilType: 'clay',
    season: 'kharif',
    ph: 6.5,
    temperature: '28 °C',
    rainfall: '1500 mm',
    humidity: '80 %',
    nitrogen: '130 mg/kg',
    phosphorus: '30 mg/kg',
    potassium: '40 mg/kg'
  },
  recommendations: [
    {
      cropId: 'rice',
      cropName: 'Rice (Paddy)',
      botanicalName: 'Oryza sativa',
      category: 'Cereal',
      rank: 1,
      suitabilityCategory: 'High compatibility',
      score: 95,
      matchingFactors: ['Soil type clay is compatible', 'Rainfall 1500 satisfies optimal water requirement'],
      unmetFactors: [],
      missingFactors: [],
      explanation: 'Rice shows strong compatibility with your soil and climate profile.',
      limitations: ['Assumes standing water'],
      growingPeriodDays: '110-150',
      source: 'ICAR Handbook of Agriculture'
    }
  ],
  advisory: 'Advisory notice: Recommendations are heuristic estimates.'
};

describe('ResultsPage Component Tests', () => {
  it('renders crop recommendation results with rank, score, and explanation', () => {
    sessionStorage.setItem('smartcrop_last_result', JSON.stringify(mockResult));

    render(
      <BrowserRouter>
        <ResultsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Rice \(Paddy\)/i)).toBeInTheDocument();
    expect(screen.getByText(/#1/i)).toBeInTheDocument();
    // Using getAllByText since "High compatibility" is present in both filter tab and badge
    const badges = screen.getAllByText(/High compatibility/i);
    expect(badges.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/95%/i)).toBeInTheDocument();
    expect(screen.getByText(/Rice shows strong compatibility with your soil and climate profile/i)).toBeInTheDocument();
  });
});
