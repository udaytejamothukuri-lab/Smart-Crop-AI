import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  RotateCcw, 
  Send, 
  AlertCircle, 
  HelpCircle, 
  Thermometer, 
  CloudRain, 
  Droplets, 
  Layers, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { getRecommendations } from '../services/api';
import AdvisoryBanner from '../components/AdvisoryBanner';

const SOIL_TYPES = [
  { value: 'alluvial', label: 'Alluvial Soil (Highly fertile, river plains)' },
  { value: 'black', label: 'Black / Regur Soil (Clay-rich, moisture retentive)' },
  { value: 'clay', label: 'Clay Soil (Heavy, slow draining, water holding)' },
  { value: 'clay-loam', label: 'Clay-Loam Soil (Balanced, fertile)' },
  { value: 'loamy', label: 'Loamy Soil (Ideal garden/crop soil, well-draining)' },
  { value: 'red', label: 'Red Soil (Porous, iron-rich, requires irrigation)' },
  { value: 'sandy', label: 'Sandy Soil (Coarse, rapid drainage, low nutrients)' },
  { value: 'sandy-loam', label: 'Sandy-Loam Soil (Friable, good for tubers/pulses)' },
  { value: 'silt', label: 'Silt Soil (Smooth texture, moderate moisture)' },
  { value: 'silt-loam', label: 'Silt-Loam Soil (Fine grain, good fertility)' },
];

const SEASONS = [
  { value: 'kharif', label: 'Kharif (Monsoon / Autumn: June - October)' },
  { value: 'rabi', label: 'Rabi (Winter / Spring: October - April)' },
  { value: 'zaid', label: 'Zaid (Summer: March - June)' },
  { value: 'whole-year', label: 'Whole Year / Perennial Cultivation' },
];

const INITIAL_FORM = {
  soilType: 'clay-loam',
  season: 'kharif',
  ph: '6.5',
  temperature: '26',
  rainfall: '1100',
  humidity: '75',
  nitrogen: '110',
  phosphorus: '35',
  potassium: '40'
};

export default function InputPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-level error on edit
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    // 1. Soil Type
    if (!formData.soilType) {
      newErrors.soilType = 'Soil type is required.';
    }

    // 2. Season
    if (!formData.season) {
      newErrors.season = 'Season selection is required.';
    }

    // 3. pH
    if (formData.ph === '' || formData.ph === null) {
      newErrors.ph = 'Soil pH is required.';
    } else {
      const ph = Number(formData.ph);
      if (isNaN(ph) || ph < 0 || ph > 14) {
        newErrors.ph = 'Soil pH must be between 0.0 and 14.0 on standard scale.';
      }
    }

    // 4. Temperature
    if (formData.temperature === '' || formData.temperature === null) {
      newErrors.temperature = 'Temperature is required.';
    } else {
      const temp = Number(formData.temperature);
      if (isNaN(temp) || temp < -10 || temp > 60) {
        newErrors.temperature = 'Temperature must be between -10°C and 60°C.';
      }
    }

    // 5. Rainfall
    if (formData.rainfall === '' || formData.rainfall === null) {
      newErrors.rainfall = 'Rainfall is required.';
    } else {
      const rain = Number(formData.rainfall);
      if (isNaN(rain) || rain < 0 || rain > 5000) {
        newErrors.rainfall = 'Rainfall must be between 0 and 5000 mm.';
      }
    }

    // 6. Humidity
    if (formData.humidity === '' || formData.humidity === null) {
      newErrors.humidity = 'Humidity is required.';
    } else {
      const hum = Number(formData.humidity);
      if (isNaN(hum) || hum < 0 || hum > 100) {
        newErrors.humidity = 'Humidity must be between 0% and 100%.';
      }
    }

    // Nutrients (Optional, but if filled must be valid non-negative numbers)
    if (formData.nitrogen !== '' && formData.nitrogen !== null) {
      const n = Number(formData.nitrogen);
      if (isNaN(n) || n < 0 || n > 1000) {
        newErrors.nitrogen = 'Nitrogen (N) must be between 0 and 1000 mg/kg.';
      }
    }

    if (formData.phosphorus !== '' && formData.phosphorus !== null) {
      const p = Number(formData.phosphorus);
      if (isNaN(p) || p < 0 || p > 500) {
        newErrors.phosphorus = 'Phosphorus (P) must be between 0 and 500 mg/kg.';
      }
    }

    if (formData.potassium !== '' && formData.potassium !== null) {
      const k = Number(formData.potassium);
      if (isNaN(k) || k < 0 || k > 1000) {
        newErrors.potassium = 'Potassium (K) must be between 0 and 1000 mg/kg.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        soilType: formData.soilType,
        season: formData.season,
        ph: Number(formData.ph),
        temperature: Number(formData.temperature),
        rainfall: Number(formData.rainfall),
        humidity: Number(formData.humidity),
        nitrogen: formData.nitrogen !== '' ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus !== '' ? Number(formData.phosphorus) : null,
        potassium: formData.potassium !== '' ? Number(formData.potassium) : null,
      };

      const result = await getRecommendations(payload);
      
      // Store in sessionStorage so results persist on refresh
      sessionStorage.setItem('smartcrop_last_result', JSON.stringify(result));
      sessionStorage.setItem('smartcrop_last_input', JSON.stringify(payload));

      navigate('/results', { state: { result, inputProfile: payload } });
    } catch (err) {
      setApiError(err.message || 'Failed to generate recommendations from backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      soilType: 'clay-loam',
      season: 'kharif',
      ph: '',
      temperature: '',
      rainfall: '',
      humidity: '',
      nitrogen: '',
      phosphorus: '',
      potassium: ''
    });
    setErrors({});
    setApiError(null);
  };

  const loadPreset = (presetNumber) => {
    setApiError(null);
    setErrors({});
    switch (presetNumber) {
      case 1:
        // Profile 1: Complete Kharif Wetland
        setFormData({
          soilType: 'clay',
          season: 'kharif',
          ph: '6.5',
          temperature: '28',
          rainfall: '1500',
          humidity: '80',
          nitrogen: '130',
          phosphorus: '30',
          potassium: '40'
        });
        break;
      case 2:
        // Profile 2: Arid / Sandy-Loam Rabi
        setFormData({
          soilType: 'sandy-loam',
          season: 'rabi',
          ph: '7.0',
          temperature: '18',
          rainfall: '350',
          humidity: '45',
          nitrogen: '30',
          phosphorus: '30',
          potassium: '30'
        });
        break;
      case 3:
        // Profile 3: Zaid Summer
        setFormData({
          soilType: 'sandy-loam',
          season: 'zaid',
          ph: '6.5',
          temperature: '28',
          rainfall: '600',
          humidity: '55',
          nitrogen: '100',
          phosphorus: '35',
          potassium: '40'
        });
        break;
      case 4:
        // Profile 4: Missing Nutrients
        setFormData({
          soilType: 'loamy',
          season: 'rabi',
          ph: '6.8',
          temperature: '18',
          rainfall: '500',
          humidity: '55',
          nitrogen: '',
          phosphorus: '',
          potassium: ''
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-agri-700 text-xs font-semibold uppercase tracking-wider mb-1">
          <FlaskConical className="w-4 h-4" /> Recommendation Parameters Form
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Enter Soil & Environmental Conditions
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Provide your farm's soil profile and expected seasonal climate. Required fields are marked with an asterisk (<span className="text-rose-500 font-bold">*</span>).
        </p>
      </div>

      {/* Preset Profiles Bar for Quick Hackathon Testing */}
      <div className="bg-white border border-agri-200 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          Test Presets (5 Required Evaluation Profiles):
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadPreset(1)}
            className="text-xs bg-agri-50 hover:bg-agri-100 text-agri-900 border border-agri-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Profile 1: Kharif Wetland (Rice)
          </button>
          <button
            type="button"
            onClick={() => loadPreset(2)}
            className="text-xs bg-agri-50 hover:bg-agri-100 text-agri-900 border border-agri-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Profile 2: Arid Rabi (Chickpea/Mustard)
          </button>
          <button
            type="button"
            onClick={() => loadPreset(3)}
            className="text-xs bg-agri-50 hover:bg-agri-100 text-agri-900 border border-agri-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Profile 3: Zaid Summer (Maize/Groundnut)
          </button>
          <button
            type="button"
            onClick={() => loadPreset(4)}
            className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Profile 4: Missing Nutrients (Sensor-Only)
          </button>
        </div>
      </div>

      {apiError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="font-semibold block mb-0.5">Submission Error:</strong>
            <span className="whitespace-pre-line">{apiError}</span>
          </div>
        </div>
      )}

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        
        {/* Section 1: Soil Characteristics */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Layers className="w-5 h-5 text-agri-700" />
            1. Soil Profile & Chemistry
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            {/* Soil Type */}
            <div>
              <label htmlFor="soilType" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Soil Type <span className="text-rose-500">*</span>
              </label>
              <select
                id="soilType"
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
              >
                {SOIL_TYPES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.soilType && <p className="text-xs text-rose-600 mt-1">{errors.soilType}</p>}
            </div>

            {/* Soil pH */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="ph" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Soil pH <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-gray-500">Standard scale (0.0 – 14.0)</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  id="ph"
                  name="ph"
                  placeholder="e.g. 6.5"
                  value={formData.ph}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">pH</span>
              </div>
              {errors.ph && <p className="text-xs text-rose-600 mt-1">{errors.ph}</p>}
              <p className="text-[11px] text-gray-500 mt-1">Neutral is 7.0; crops generally thrive between 5.5 and 7.8.</p>
            </div>
          </div>
        </div>

        {/* Section 2: Climate and Season */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-3 border-b border-gray-100">
            <Thermometer className="w-5 h-5 text-agri-700" />
            2. Climate & Season
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-5">
            {/* Season */}
            <div className="sm:col-span-2">
              <label htmlFor="season" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Growing Season <span className="text-rose-500">*</span>
              </label>
              <select
                id="season"
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
              >
                {SEASONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.season && <p className="text-xs text-rose-600 mt-1">{errors.season}</p>}
            </div>

            {/* Temperature */}
            <div>
              <label htmlFor="temperature" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Temperature <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="-10"
                  max="60"
                  id="temperature"
                  name="temperature"
                  placeholder="e.g. 25.0"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">°C</span>
              </div>
              {errors.temperature && <p className="text-xs text-rose-600 mt-1">{errors.temperature}</p>}
            </div>

            {/* Humidity */}
            <div>
              <label htmlFor="humidity" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Humidity <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  id="humidity"
                  name="humidity"
                  placeholder="e.g. 70"
                  value={formData.humidity}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">%</span>
              </div>
              {errors.humidity && <p className="text-xs text-rose-600 mt-1">{errors.humidity}</p>}
            </div>

            {/* Rainfall */}
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="rainfall" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Seasonal Rainfall <span className="text-rose-500">*</span>
                </label>
                <span className="text-xs text-gray-500">Cumulative seasonal total</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="10"
                  min="0"
                  max="5000"
                  id="rainfall"
                  name="rainfall"
                  placeholder="e.g. 850"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">mm</span>
              </div>
              {errors.rainfall && <p className="text-xs text-rose-600 mt-1">{errors.rainfall}</p>}
              <p className="text-[11px] text-gray-500 mt-1">Expected rain + assured irrigation over the crop duration.</p>
            </div>
          </div>
        </div>

        {/* Section 3: Soil Nutrients (Optional Lab Measurements) */}
        <div className="mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-agri-700" />
              3. Soil Nutrients (N-P-K)
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Optional / Lab Tested
            </span>
          </div>

          <div className="bg-agri-50/50 border border-agri-200/60 rounded-xl p-3 my-4 flex items-start gap-2.5 text-xs text-agri-950">
            <Info className="w-4 h-4 text-agri-700 flex-shrink-0 mt-0.5" />
            <p>
              Leave nutrient fields blank if you do not have soil lab testing data. Missing nutrients are tracked transparently as unmeasured factors and are <strong>not penalized or replaced with zero</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
            {/* Nitrogen */}
            <div>
              <label htmlFor="nitrogen" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Nitrogen (N)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="1000"
                  id="nitrogen"
                  name="nitrogen"
                  placeholder="Optional"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">mg/kg</span>
              </div>
              {errors.nitrogen && <p className="text-xs text-rose-600 mt-1">{errors.nitrogen}</p>}
            </div>

            {/* Phosphorus */}
            <div>
              <label htmlFor="phosphorus" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Phosphorus (P)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="500"
                  id="phosphorus"
                  name="phosphorus"
                  placeholder="Optional"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">mg/kg</span>
              </div>
              {errors.phosphorus && <p className="text-xs text-rose-600 mt-1">{errors.phosphorus}</p>}
            </div>

            {/* Potassium */}
            <div>
              <label htmlFor="potassium" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Potassium (K)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="1000"
                  id="potassium"
                  name="potassium"
                  placeholder="Optional"
                  value={formData.potassium}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-gray-400 font-medium">mg/kg</span>
              </div>
              {errors.potassium && <p className="text-xs text-rose-600 mt-1">{errors.potassium}</p>}
            </div>
          </div>
        </div>

        {/* Buttons / Submission */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handleReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
            Reset Form
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm shadow-md transition-all ${
              loading 
                ? 'bg-agri-700 cursor-not-allowed opacity-80' 
                : 'bg-agri-800 hover:bg-agri-900 hover:translate-y-[-1px]'
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Evaluating Rules...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Crop Recommendations
              </>
            )}
          </button>
        </div>
      </form>

      <AdvisoryBanner />
    </div>
  );
}
