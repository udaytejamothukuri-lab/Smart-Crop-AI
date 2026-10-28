import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Scale, 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  HelpCircle,
  Thermometer,
  CloudRain,
  Layers,
  FlaskConical,
  Sparkles
} from 'lucide-react';
import { compareCropsApi, getSupportedCrops } from '../services/api';
import SuitabilityBadge from '../components/SuitabilityBadge';
import AdvisoryBanner from '../components/AdvisoryBanner';

export default function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [comparisons, setComparisons] = useState([]);
  const [allCrops, setAllCrops] = useState([]);
  const [selectedCropIds, setSelectedCropIds] = useState([]);
  const [inputProfile, setInputProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cropIds = [];
    let profile = null;

    if (location.state) {
      if (location.state.cropIds) cropIds = location.state.cropIds;
      if (location.state.inputProfile) profile = location.state.inputProfile;
    }

    // Fallback: check session storage if not passed in navigation
    if (!profile) {
      const cached = sessionStorage.getItem('smartcrop_last_input');
      if (cached) profile = JSON.parse(cached);
    }

    if (cropIds.length === 0) {
      cropIds = ['rice', 'wheat']; // default sensible comparison
    }

    if (!profile) {
      profile = {
        soilType: 'clay-loam',
        season: 'kharif',
        temperature: 26,
        rainfall: 1100,
        ph: 6.5,
        humidity: 75
      };
    }

    setInputProfile(profile);
    setSelectedCropIds(cropIds);

    // Fetch supported crops metadata for dropdown selector
    getSupportedCrops()
      .then(data => setAllCrops(data.crops || []))
      .catch(console.error);

    // Fetch comparison from backend
    fetchComparison(cropIds, profile);
  }, [location.state]);

  const fetchComparison = async (ids, profile) => {
    setLoading(true);
    setError(null);
    try {
      const data = await compareCropsApi(ids, profile);
      setComparisons(data.comparisons || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch comparison.');
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelectionChange = (idx, newId) => {
    const updated = [...selectedCropIds];
    updated[idx] = newId;
    setSelectedCropIds(updated);
    if (inputProfile) {
      fetchComparison(updated, inputProfile);
    }
  };

  const handleAddCrop = () => {
    if (selectedCropIds.length >= 4) {
      alert('Maximum of 4 crops can be compared at once.');
      return;
    }
    const available = allCrops.find(c => !selectedCropIds.includes(c.id));
    if (available) {
      const updated = [...selectedCropIds, available.id];
      setSelectedCropIds(updated);
      if (inputProfile) fetchComparison(updated, inputProfile);
    }
  };

  const handleRemoveCrop = (idToRemove) => {
    if (selectedCropIds.length <= 2) {
      alert('At least 2 crops are required for comparison.');
      return;
    }
    const updated = selectedCropIds.filter(id => id !== idToRemove);
    setSelectedCropIds(updated);
    if (inputProfile) fetchComparison(updated, inputProfile);
  };

  const renderStatusIcon = (check) => {
    if (!check) return null;
    if (check.status === 'MATCH') {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Optimal
        </span>
      );
    }
    if (check.status === 'TOLERABLE') {
      return (
        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-xs font-semibold">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Tolerable
        </span>
      );
    }
    if (check.status === 'UNMET') {
      return (
        <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded text-xs font-semibold">
          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Unmet
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs">
        <HelpCircle className="w-3.5 h-3.5 text-gray-400" /> Missing
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print-container">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <Link
          to="/results"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-agri-800 hover:text-agri-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recommendation Results
        </Link>

        <div className="flex items-center gap-3">
          {selectedCropIds.length < 4 && allCrops.length > selectedCropIds.length && (
            <button
              onClick={handleAddCrop}
              className="text-xs bg-agri-100 text-agri-900 border border-agri-300 font-semibold px-3 py-1.5 rounded-lg hover:bg-agri-200 transition-colors"
            >
              + Add Crop to Compare
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-xs transition-colors allow-print"
          >
            <Printer className="w-4 h-4 text-gray-500" /> Print Comparison
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border border-agri-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex items-center gap-2 text-agri-700 text-xs font-semibold uppercase tracking-wider mb-1">
          <Scale className="w-4 h-4" /> Deterministic Comparative Analysis
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Crop Suitability Comparison
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Evaluating selected crops against the exact same farm parameters using identical rule-based tolerance thresholds.
        </p>

        {/* Evaluated Profile Bar */}
        {inputProfile && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-gray-700">Baseline Conditions:</span>
            <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">Soil: <strong className="capitalize">{inputProfile.soilType}</strong></span>
            <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">Season: <strong className="capitalize">{inputProfile.season}</strong></span>
            <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">pH: <strong>{inputProfile.ph}</strong></span>
            <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">Temp: <strong>{inputProfile.temperature}°C</strong></span>
            <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">Rainfall: <strong>{inputProfile.rainfall} mm</strong></span>
          </div>
        )}
      </div>

      <AdvisoryBanner />

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
          <span className="w-6 h-6 border-2 border-agri-600 border-t-transparent rounded-full animate-spin inline-block mb-3"></span>
          <p className="text-sm font-medium">Running backend comparison matrix...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[700px] bg-white border border-gray-200 rounded-3xl shadow-xs overflow-hidden">
            {/* Comparison Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-agri-50/70 border-b border-agri-200">
                  <th className="p-4 text-xs font-bold text-gray-700 uppercase tracking-wider w-1/4">
                    Agronomic Factor
                  </th>
                  {comparisons.map((c, idx) => (
                    <th key={c.cropId} className="p-4 w-1/4 border-l border-agri-200">
                      <div className="flex items-center justify-between gap-2 mb-2 no-print">
                        <select
                          value={c.cropId}
                          onChange={(e) => handleCropSelectionChange(idx, e.target.value)}
                          className="text-xs bg-white border border-gray-300 rounded-lg px-2 py-1 font-semibold text-gray-900 focus:ring-1 focus:ring-agri-600 outline-none"
                        >
                          {allCrops.map(ac => (
                            <option key={ac.id} value={ac.id}>{ac.name}</option>
                          ))}
                        </select>
                        {comparisons.length > 2 && (
                          <button
                            onClick={() => handleRemoveCrop(c.cropId)}
                            className="text-gray-400 hover:text-rose-600 text-xs px-1"
                            title="Remove from comparison"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <div className="font-extrabold text-base text-gray-900">{c.cropName}</div>
                      <div className="text-[11px] text-gray-500 italic mb-2">{c.botanicalName}</div>
                      <SuitabilityBadge category={c.suitabilityCategory} score={c.score} />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-xs">
                {/* 1. Overall Suitability Category */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800">
                    Suitability Category
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100 font-bold">
                      {c.suitabilityCategory}
                    </td>
                  ))}
                </tr>

                {/* 2. Deterministic Score */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800">
                    Calculated Score
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100 font-bold text-sm">
                      {c.score !== null ? `${c.score}%` : 'N/A (Insufficient coverage)'}
                    </td>
                  ))}
                </tr>

                {/* 3. Soil Compatibility */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-agri-700" /> Soil Compatibility
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100">
                      <div className="mb-1">{renderStatusIcon(c.soilCompatibility)}</div>
                      <span className="text-gray-600 block">{c.soilCompatibility?.details}</span>
                    </td>
                  ))}
                </tr>

                {/* 4. Season Compatibility */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800">
                    Season Compatibility
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100">
                      <div className="mb-1">{renderStatusIcon(c.seasonCompatibility)}</div>
                      <span className="text-gray-600 block">{c.seasonCompatibility?.details}</span>
                    </td>
                  ))}
                </tr>

                {/* 5. Temperature Compatibility */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-agri-700" /> Temperature
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100">
                      <div className="mb-1">{renderStatusIcon(c.temperatureCompatibility)}</div>
                      <span className="text-gray-600 block">{c.temperatureCompatibility?.details}</span>
                    </td>
                  ))}
                </tr>

                {/* 6. Rainfall Compatibility */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-agri-700" /> Rainfall Requirement
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100">
                      <div className="mb-1">{renderStatusIcon(c.rainfallCompatibility)}</div>
                      <span className="text-gray-600 block">{c.rainfallCompatibility?.details}</span>
                    </td>
                  ))}
                </tr>

                {/* 7. Soil pH Compatibility */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800">
                    Soil pH Tolerance
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100">
                      <div className="mb-1">{renderStatusIcon(c.phCompatibility)}</div>
                      <span className="text-gray-600 block">{c.phCompatibility?.details}</span>
                    </td>
                  ))}
                </tr>

                {/* 8. Available Nutrients (N-P-K) */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-agri-700" /> Nutrients (N, P, K)
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100 space-y-1">
                      <div>N: {renderStatusIcon(c.nutrientCompatibility?.nitrogen)}</div>
                      <div>P: {renderStatusIcon(c.nutrientCompatibility?.phosphorus)}</div>
                      <div>K: {renderStatusIcon(c.nutrientCompatibility?.potassium)}</div>
                    </td>
                  ))}
                </tr>

                {/* 9. Positive Matching Conditions */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-emerald-800">
                    Positive Matching Factors
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100">
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {c.matchingFactors.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* 10. Unmet Conditions */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-rose-800">
                    Unmet / Limiting Factors
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100">
                      {c.unmetFactors.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1 text-rose-900">
                          {c.unmetFactors.map((u, i) => (
                            <li key={i}>{u}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-emerald-700 font-medium">None</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 11. Limitations & Assumptions */}
                <tr className="hover:bg-gray-50/50">
                  <td className="p-4 font-semibold text-gray-800">
                    Limitations & Assumptions
                  </td>
                  {comparisons.map(c => (
                    <td key={c.cropId} className="p-4 border-l border-gray-100 text-gray-600">
                      <ul className="list-disc list-inside space-y-1">
                        {c.limitations.map((lim, i) => (
                          <li key={i}>{lim}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
