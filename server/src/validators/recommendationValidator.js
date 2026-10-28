import { VALID_SOIL_TYPES, VALID_SEASONS, CROPS_DATA } from '../data/crops.js';

/**
 * Validates recommendation input profile.
 * Returns { isValid: boolean, errors: string[], sanitized: Object }
 */
export function validateInputProfile(input) {
  const errors = [];
  const sanitized = {};

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      isValid: false,
      errors: ['Input payload must be a JSON object containing soil and environmental parameters.'],
      sanitized: {}
    };
  }

  // 1. Soil Type (optional / required depending on use, validated if present)
  if (input.soilType !== undefined && input.soilType !== null && input.soilType !== '') {
    const st = String(input.soilType).trim().toLowerCase();
    if (!VALID_SOIL_TYPES.includes(st)) {
      errors.push(`Invalid soilType "${input.soilType}". Allowed types: ${VALID_SOIL_TYPES.join(', ')}.`);
    } else {
      sanitized.soilType = st;
    }
  } else {
    sanitized.soilType = null;
  }

  // 2. Season
  if (input.season !== undefined && input.season !== null && input.season !== '') {
    const s = String(input.season).trim().toLowerCase();
    if (!VALID_SEASONS.includes(s)) {
      errors.push(`Invalid season "${input.season}". Allowed seasons: ${VALID_SEASONS.join(', ')}.`);
    } else {
      sanitized.season = s;
    }
  } else {
    sanitized.season = null;
  }

  // 3. Soil pH
  if (input.ph !== undefined && input.ph !== null && input.ph !== '') {
    const phNum = Number(input.ph);
    if (isNaN(phNum) || phNum < 0 || phNum > 14) {
      errors.push(`Soil pH must be a number on the standard 0 to 14 scale. Received: "${input.ph}".`);
    } else {
      sanitized.ph = Number(phNum.toFixed(2));
    }
  } else {
    sanitized.ph = null;
  }

  // 4. Temperature (°C)
  if (input.temperature !== undefined && input.temperature !== null && input.temperature !== '') {
    const tempNum = Number(input.temperature);
    if (isNaN(tempNum) || tempNum < -10 || tempNum > 60) {
      errors.push(`Temperature must be a realistic numeric value between -10°C and 60°C. Received: "${input.temperature}".`);
    } else {
      sanitized.temperature = Number(tempNum.toFixed(1));
    }
  } else {
    sanitized.temperature = null;
  }

  // 5. Rainfall (mm)
  if (input.rainfall !== undefined && input.rainfall !== null && input.rainfall !== '') {
    const rainNum = Number(input.rainfall);
    if (isNaN(rainNum) || rainNum < 0 || rainNum > 5000) {
      errors.push(`Rainfall must be a positive number up to 5000 mm. Received: "${input.rainfall}".`);
    } else {
      sanitized.rainfall = Number(rainNum.toFixed(1));
    }
  } else {
    sanitized.rainfall = null;
  }

  // 6. Humidity (%)
  if (input.humidity !== undefined && input.humidity !== null && input.humidity !== '') {
    const humNum = Number(input.humidity);
    if (isNaN(humNum) || humNum < 0 || humNum > 100) {
      errors.push(`Relative humidity must be a percentage between 0% and 100%. Received: "${input.humidity}".`);
    } else {
      sanitized.humidity = Number(humNum.toFixed(1));
    }
  } else {
    sanitized.humidity = null;
  }

  // 7. Nitrogen (N) (mg/kg) - Optional
  if (input.nitrogen !== undefined && input.nitrogen !== null && input.nitrogen !== '') {
    const nNum = Number(input.nitrogen);
    if (isNaN(nNum) || nNum < 0 || nNum > 1000) {
      errors.push(`Nitrogen (N) must be a non-negative number up to 1000 mg/kg. Received: "${input.nitrogen}".`);
    } else {
      sanitized.nitrogen = Number(nNum.toFixed(1));
    }
  } else {
    sanitized.nitrogen = null;
  }

  // 8. Phosphorus (P) (mg/kg) - Optional
  if (input.phosphorus !== undefined && input.phosphorus !== null && input.phosphorus !== '') {
    const pNum = Number(input.phosphorus);
    if (isNaN(pNum) || pNum < 0 || pNum > 500) {
      errors.push(`Phosphorus (P) must be a non-negative number up to 500 mg/kg. Received: "${input.phosphorus}".`);
    } else {
      sanitized.phosphorus = Number(pNum.toFixed(1));
    }
  } else {
    sanitized.phosphorus = null;
  }

  // 9. Potassium (K) (mg/kg) - Optional
  if (input.potassium !== undefined && input.potassium !== null && input.potassium !== '') {
    const kNum = Number(input.potassium);
    if (isNaN(kNum) || kNum < 0 || kNum > 1000) {
      errors.push(`Potassium (K) must be a non-negative number up to 1000 mg/kg. Received: "${input.potassium}".`);
    } else {
      sanitized.potassium = Number(kNum.toFixed(1));
    }
  } else {
    sanitized.potassium = null;
  }

  // Ensure not all fields are empty
  const nonNullCount = Object.values(sanitized).filter(v => v !== null).length;
  if (nonNullCount === 0 && errors.length === 0) {
    errors.push('At least one environmental or soil parameter must be provided to evaluate recommendations.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Validates crop comparison request.
 */
export function validateComparisonRequest(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object.'] };
  }

  const { cropIds, inputProfile } = body;

  if (!Array.isArray(cropIds) || cropIds.length < 2) {
    errors.push('Comparison requires an array of at least 2 crop IDs in "cropIds".');
  } else {
    const validIds = CROPS_DATA.map(c => c.id);
    for (const id of cropIds) {
      if (!validIds.includes(id)) {
        errors.push(`Crop ID "${id}" is not supported. Supported crops: ${validIds.join(', ')}.`);
      }
    }
  }

  const profileValidation = validateInputProfile(inputProfile || {});
  if (!profileValidation.isValid) {
    errors.push(...profileValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
    cropIds: cropIds || [],
    sanitizedProfile: profileValidation.sanitized
  };
}
