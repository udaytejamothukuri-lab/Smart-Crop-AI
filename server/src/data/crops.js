/**
 * SmartCrop AI - Documented Crop Requirement Dataset
 * Dataset Version: v1.1.0-icar-fao-documented
 * 
 * Sources:
 * 1. Indian Council of Agricultural Research (ICAR) Handbook of Agriculture (6th Edition)
 * 2. Food and Agriculture Organization (FAO) - Ecocrop Database & Crop Water Requirements (Irrigation and Drainage Paper 56)
 * 3. TNAU Agritech Portal (Tamil Nadu Agricultural University) Crop Production Guidelines
 * 
 * Unit Assumptions:
 * - Soil pH: dimensionless standard pH scale (agricultural range 4.5 - 8.5)
 * - Temperature: degrees Celsius (°C)
 * - Rainfall: millimeters (mm) cumulative over the crop growing season
 * - Humidity: relative humidity percentage (%)
 * - Available Soil Nitrogen (N): mg/kg (measured via alkaline permanganate method)
 * - Available Soil Phosphorus (P): mg/kg (measured via Olsen/Bray extraction method)
 * - Available Soil Potassium (K): mg/kg (measured via neutral ammonium acetate extraction)
 * 
 * Important Disclaimer:
 * These thresholds are generalized agronomic baselines. Local microclimates, soil depth,
 * irrigation facilities, seed varieties (hybrids vs traditional), and pest dynamics can alter
 * these ranges. This data is for decision-support advisory only.
 */

export const DATASET_VERSION = 'v1.1.0-icar-fao-documented';

export const CROPS_DATA = [
  {
    id: 'rice',
    name: 'Rice (Paddy)',
    botanicalName: 'Oryza sativa',
    category: 'Cereal',
    suitableSoilTypes: ['clay', 'clay-loam', 'alluvial', 'silt-loam'],
    optimalPh: { min: 5.5, max: 7.2 },
    tolerablePh: { min: 5.0, max: 8.0 },
    optimalTemperature: { min: 22, max: 32 },
    tolerableTemperature: { min: 18, max: 38 },
    optimalRainfall: { min: 1000, max: 2000 }, // mm/season
    tolerableRainfall: { min: 800, max: 2500 },
    optimalHumidity: { min: 70, max: 90 },
    tolerableHumidity: { min: 60, max: 95 },
    suitableSeasons: ['kharif', 'whole-year'],
    nutrientRequirements: {
      nitrogen: { min: 100, max: 180 }, // mg/kg
      phosphorus: { min: 20, max: 45 },
      potassium: { min: 30, max: 60 }
    },
    growingPeriodDays: '110-150',
    source: 'ICAR Handbook of Agriculture; FAO Ecocrop #1590',
    assumptions: 'Assumes sub-surface water retention typical of clay/alluvial soils with standing water or assured ponding/irrigation.'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    botanicalName: 'Triticum aestivum',
    category: 'Cereal',
    suitableSoilTypes: ['loamy', 'clay-loam', 'alluvial', 'silt-loam'],
    optimalPh: { min: 6.0, max: 7.5 },
    tolerablePh: { min: 5.5, max: 8.2 },
    optimalTemperature: { min: 14, max: 24 },
    tolerableTemperature: { min: 10, max: 28 },
    optimalRainfall: { min: 350, max: 650 },
    tolerableRainfall: { min: 250, max: 850 },
    optimalHumidity: { min: 45, max: 65 },
    tolerableHumidity: { min: 35, max: 75 },
    suitableSeasons: ['rabi'],
    nutrientRequirements: {
      nitrogen: { min: 80, max: 140 },
      phosphorus: { min: 25, max: 50 },
      potassium: { min: 25, max: 50 }
    },
    growingPeriodDays: '100-140',
    source: 'ICAR-IIWBR (Indian Institute of Wheat and Barley Research); FAO Ecocrop #2100',
    assumptions: 'Requires cool vegetative phase and warm ripening period. Sensitive to high heat during anthesis.'
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    botanicalName: 'Zea mays',
    category: 'Cereal',
    suitableSoilTypes: ['loamy', 'sandy-loam', 'alluvial', 'red'],
    optimalPh: { min: 5.8, max: 7.5 },
    tolerablePh: { min: 5.3, max: 8.0 },
    optimalTemperature: { min: 18, max: 30 },
    tolerableTemperature: { min: 15, max: 35 },
    optimalRainfall: { min: 500, max: 800 },
    tolerableRainfall: { min: 400, max: 1100 },
    optimalHumidity: { min: 50, max: 75 },
    tolerableHumidity: { min: 40, max: 85 },
    suitableSeasons: ['kharif', 'rabi', 'zaid', 'whole-year'],
    nutrientRequirements: {
      nitrogen: { min: 90, max: 150 },
      phosphorus: { min: 25, max: 55 },
      potassium: { min: 30, max: 60 }
    },
    growingPeriodDays: '90-120',
    source: 'ICAR-IIMR (Indian Institute of Maize Research); FAO Ecocrop #2190',
    assumptions: 'Requires well-drained soils; extremely sensitive to waterlogging at early growth stages.'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    botanicalName: 'Gossypium hirsutum',
    category: 'Cash Crop',
    suitableSoilTypes: ['black', 'clay-loam', 'alluvial', 'loamy'],
    optimalPh: { min: 6.0, max: 8.0 },
    tolerablePh: { min: 5.5, max: 8.5 },
    optimalTemperature: { min: 22, max: 34 },
    tolerableTemperature: { min: 18, max: 40 },
    optimalRainfall: { min: 600, max: 1000 },
    tolerableRainfall: { min: 500, max: 1300 },
    optimalHumidity: { min: 50, max: 75 },
    tolerableHumidity: { min: 40, max: 85 },
    suitableSeasons: ['kharif'],
    nutrientRequirements: {
      nitrogen: { min: 70, max: 130 },
      phosphorus: { min: 20, max: 45 },
      potassium: { min: 30, max: 65 }
    },
    growingPeriodDays: '150-180',
    source: 'Central Institute for Cotton Research (CICR); FAO Ecocrop #1140',
    assumptions: 'Deep black soils with high moisture retention provide optimal results. Frost-free period required.'
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    botanicalName: 'Saccharum officinarum',
    category: 'Cash Crop',
    suitableSoilTypes: ['loamy', 'alluvial', 'black', 'clay-loam'],
    optimalPh: { min: 6.0, max: 7.8 },
    tolerablePh: { min: 5.0, max: 8.3 },
    optimalTemperature: { min: 24, max: 35 },
    tolerableTemperature: { min: 18, max: 40 },
    optimalRainfall: { min: 1200, max: 2200 },
    tolerableRainfall: { min: 900, max: 2800 },
    optimalHumidity: { min: 60, max: 85 },
    tolerableHumidity: { min: 45, max: 90 },
    suitableSeasons: ['whole-year', 'kharif'],
    nutrientRequirements: {
      nitrogen: { min: 120, max: 200 },
      phosphorus: { min: 30, max: 65 },
      potassium: { min: 45, max: 90 }
    },
    growingPeriodDays: '300-360',
    source: 'ICAR-Sugarcane Breeding Institute; FAO Ecocrop #1880',
    assumptions: 'Long duration crop requiring uninterrupted water supply and high solar radiation for sucrose accumulation.'
  },
  {
    id: 'chickpea',
    name: 'Chickpea (Gram)',
    botanicalName: 'Cicer arietinum',
    category: 'Pulse',
    suitableSoilTypes: ['sandy-loam', 'loamy', 'clay-loam', 'black'],
    optimalPh: { min: 6.0, max: 7.8 },
    tolerablePh: { min: 5.5, max: 8.4 },
    optimalTemperature: { min: 16, max: 26 },
    tolerableTemperature: { min: 10, max: 30 },
    optimalRainfall: { min: 300, max: 550 },
    tolerableRainfall: { min: 200, max: 700 },
    optimalHumidity: { min: 35, max: 60 },
    tolerableHumidity: { min: 25, max: 70 },
    suitableSeasons: ['rabi'],
    nutrientRequirements: {
      nitrogen: { min: 20, max: 40 }, // Legume biological N fixation
      phosphorus: { min: 25, max: 50 },
      potassium: { min: 20, max: 45 }
    },
    growingPeriodDays: '90-120',
    source: 'ICAR-IIPR (Indian Institute of Pulses Research); FAO Ecocrop #0710',
    assumptions: 'Fixes atmospheric nitrogen; high nitrogen in soil can cause excessive vegetative growth over pod formation.'
  },
  {
    id: 'groundnut',
    name: 'Groundnut (Peanut)',
    botanicalName: 'Arachis hypogaea',
    category: 'Oilseed',
    suitableSoilTypes: ['sandy-loam', 'loamy', 'red'],
    optimalPh: { min: 6.0, max: 7.0 },
    tolerablePh: { min: 5.3, max: 7.8 },
    optimalTemperature: { min: 22, max: 30 },
    tolerableTemperature: { min: 18, max: 35 },
    optimalRainfall: { min: 500, max: 750 },
    tolerableRainfall: { min: 400, max: 1000 },
    optimalHumidity: { min: 50, max: 70 },
    tolerableHumidity: { min: 40, max: 80 },
    suitableSeasons: ['kharif', 'zaid'],
    nutrientRequirements: {
      nitrogen: { min: 20, max: 45 },
      phosphorus: { min: 20, max: 45 },
      potassium: { min: 25, max: 50 }
    },
    growingPeriodDays: '100-130',
    source: 'ICAR-Directorate of Groundnut Research; FAO Ecocrop #0340',
    assumptions: 'Loose, friable sandy-loam soil is essential for peg penetration and pod development.'
  },
  {
    id: 'soybean',
    name: 'Soybean',
    botanicalName: 'Glycine max',
    category: 'Oilseed / Legume',
    suitableSoilTypes: ['loamy', 'clay-loam', 'black', 'alluvial'],
    optimalPh: { min: 6.0, max: 7.2 },
    tolerablePh: { min: 5.5, max: 7.8 },
    optimalTemperature: { min: 20, max: 30 },
    tolerableTemperature: { min: 16, max: 35 },
    optimalRainfall: { min: 600, max: 900 },
    tolerableRainfall: { min: 450, max: 1200 },
    optimalHumidity: { min: 55, max: 75 },
    tolerableHumidity: { min: 45, max: 85 },
    suitableSeasons: ['kharif'],
    nutrientRequirements: {
      nitrogen: { min: 30, max: 60 },
      phosphorus: { min: 30, max: 60 },
      potassium: { min: 25, max: 55 }
    },
    growingPeriodDays: '90-115',
    source: 'ICAR-IISR (Indian Institute of Soybean Research); FAO Ecocrop #1120',
    assumptions: 'Sensitive to water stagnation and moisture stress at pod filling.'
  },
  {
    id: 'mustard',
    name: 'Mustard (Rapeseed)',
    botanicalName: 'Brassica juncea',
    category: 'Oilseed',
    suitableSoilTypes: ['loamy', 'sandy-loam', 'alluvial'],
    optimalPh: { min: 6.0, max: 7.5 },
    tolerablePh: { min: 5.5, max: 8.2 },
    optimalTemperature: { min: 15, max: 25 },
    tolerableTemperature: { min: 10, max: 28 },
    optimalRainfall: { min: 250, max: 450 },
    tolerableRainfall: { min: 200, max: 650 },
    optimalHumidity: { min: 45, max: 65 },
    tolerableHumidity: { min: 35, max: 75 },
    suitableSeasons: ['rabi'],
    nutrientRequirements: {
      nitrogen: { min: 60, max: 100 },
      phosphorus: { min: 20, max: 40 },
      potassium: { min: 20, max: 40 }
    },
    growingPeriodDays: '105-135',
    source: 'ICAR-DRMR (Directorate of Rapeseed-Mustard Research); FAO Ecocrop #0520',
    assumptions: 'Cool winter crop with moderate water requirement, vulnerable to aphid attacks in humid conditions.'
  },
  {
    id: 'tomato',
    name: 'Tomato',
    botanicalName: 'Solanum lycopersicum',
    category: 'Vegetable',
    suitableSoilTypes: ['sandy-loam', 'loamy', 'clay-loam', 'red'],
    optimalPh: { min: 6.0, max: 7.0 },
    tolerablePh: { min: 5.5, max: 7.5 },
    optimalTemperature: { min: 18, max: 28 },
    tolerableTemperature: { min: 12, max: 34 },
    optimalRainfall: { min: 400, max: 700 },
    tolerableRainfall: { min: 300, max: 950 },
    optimalHumidity: { min: 50, max: 70 },
    tolerableHumidity: { min: 40, max: 80 },
    suitableSeasons: ['rabi', 'zaid', 'kharif', 'whole-year'],
    nutrientRequirements: {
      nitrogen: { min: 75, max: 140 },
      phosphorus: { min: 30, max: 60 },
      potassium: { min: 40, max: 80 }
    },
    growingPeriodDays: '90-130',
    source: 'ICAR-IIHR (Indian Institute of Horticultural Research); FAO Ecocrop #1980',
    assumptions: 'Susceptible to frost, blossom end rot under calcium/water fluctuations, and fungal blight at high humidity.'
  },
  {
    id: 'potato',
    name: 'Potato',
    botanicalName: 'Solanum tuberosum',
    category: 'Vegetable / Tuber',
    suitableSoilTypes: ['sandy-loam', 'loamy', 'alluvial'],
    optimalPh: { min: 5.2, max: 6.8 },
    tolerablePh: { min: 4.8, max: 7.4 },
    optimalTemperature: { min: 15, max: 22 },
    tolerableTemperature: { min: 10, max: 26 },
    optimalRainfall: { min: 400, max: 600 },
    tolerableRainfall: { min: 300, max: 800 },
    optimalHumidity: { min: 60, max: 80 },
    tolerableHumidity: { min: 50, max: 90 },
    suitableSeasons: ['rabi'],
    nutrientRequirements: {
      nitrogen: { min: 80, max: 150 },
      phosphorus: { min: 35, max: 70 },
      potassium: { min: 50, max: 100 }
    },
    growingPeriodDays: '80-110',
    source: 'ICAR-CPRI (Central Potato Research Institute); FAO Ecocrop #1990',
    assumptions: 'Tuberization requires night temperatures between 15-20°C; higher night temperatures inhibit tuber growth.'
  },
  {
    id: 'barley',
    name: 'Barley',
    botanicalName: 'Hordeum vulgare',
    category: 'Cereal',
    suitableSoilTypes: ['sandy-loam', 'loamy', 'alluvial', 'clay-loam'],
    optimalPh: { min: 6.5, max: 8.2 },
    tolerablePh: { min: 6.0, max: 8.6 },
    optimalTemperature: { min: 12, max: 22 },
    tolerableTemperature: { min: 8, max: 28 },
    optimalRainfall: { min: 300, max: 500 },
    tolerableRainfall: { min: 200, max: 750 },
    optimalHumidity: { min: 40, max: 60 },
    tolerableHumidity: { min: 30, max: 70 },
    suitableSeasons: ['rabi'],
    nutrientRequirements: {
      nitrogen: { min: 50, max: 90 },
      phosphorus: { min: 20, max: 40 },
      potassium: { min: 20, max: 40 }
    },
    growingPeriodDays: '90-120',
    source: 'ICAR-IIWBR; FAO Ecocrop #1210',
    assumptions: 'More drought and salinity-alkalinity tolerant than wheat, but vulnerable to waterlogging.'
  }
];

export const VALID_SOIL_TYPES = [
  'clay',
  'clay-loam',
  'loamy',
  'sandy-loam',
  'sandy',
  'silt',
  'silt-loam',
  'black',
  'alluvial',
  'red'
];

export const VALID_SEASONS = [
  'kharif',
  'rabi',
  'zaid',
  'whole-year'
];
