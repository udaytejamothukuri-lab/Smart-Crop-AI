import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InputPage from '../pages/InputPage';

describe('InputPage Component Tests', () => {
  it('renders all 9 input controls with appropriate labels', () => {
    render(
      <BrowserRouter>
        <InputPage />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/Soil Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Growing Season/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Soil pH/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Seasonal Rainfall/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Humidity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nitrogen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phosphorus/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Potassium/i)).toBeInTheDocument();
  });

  it('displays validation errors when mandatory fields are cleared', async () => {
    render(
      <BrowserRouter>
        <InputPage />
      </BrowserRouter>
    );

    // Click Reset Form to empty out the values
    const resetButton = screen.getByRole('button', { name: /Reset Form/i });
    fireEvent.click(resetButton);

    // Attempt to submit empty form
    const submitButton = screen.getByRole('button', { name: /Generate Crop Recommendations/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Soil pH is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Temperature is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Rainfall is required/i)).toBeInTheDocument();
  });

  it('loads preset profile values correctly upon preset button click', () => {
    render(
      <BrowserRouter>
        <InputPage />
      </BrowserRouter>
    );

    const preset1Button = screen.getByRole('button', { name: /Profile 1: Kharif Wetland/i });
    fireEvent.click(preset1Button);

    const phInput = screen.getByLabelText(/Soil pH/i);
    expect(phInput.value).toBe('6.5');

    const tempInput = screen.getByLabelText(/Temperature/i);
    expect(tempInput.value).toBe('28');

    const rainfallInput = screen.getByLabelText(/Seasonal Rainfall/i);
    expect(rainfallInput.value).toBe('1500');
  });
});
