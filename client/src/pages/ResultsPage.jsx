import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Printer, 
  ArrowLeft, 
  Scale, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  Sparkles, 
  Database,
  Layers,
  ChevronDown,
  ChevronUp,
  Share2,
  Calendar,
  Thermometer,
  CloudRain,
  Droplets,
  FlaskConical
} from 'lucide-react';
import SuitabilityBadge from '../components/SuitabilityBadge';
import AdvisoryBanner from '../components/AdvisoryBanner';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [resultData, setResultData] = useState(null);
  const [inputProfile, setInputProfile] = useState(null);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [expandedCropId, setExpandedCropId] = useState(null);

  useEffect(() => {
    // Check router state or fall back to sessionStorage
    if (location.state && location.state.result) {
      setResultData(location.state.result);
      setInputProfile(location.state.inputProfile || null);
    } else {
      const cachedResult = sessionStorage.getItem('smartcrop_last_result');
      const cachedInput = sessionStorage.getItem('smartcrop_last_input');
      if (cachedResult) {
        setResultData(JSON.parse(cachedResult));
        if (cachedInput) setInputProfile(JSON.parse(cachedInput));
      }
    }
  }, [location.state]);

  if (!resultData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center mx-auto mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Recommendation Results</h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
          Submit your soil and environmental parameters on the recommendation form to view tailored crop compatibility analysis.
        </p>
        <Link
          to="/recommend"
          className="inline-flex items-center gap-2 bg-agri-800 hover:bg-agri-900 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Input Form
        </Link>
      </div>
    );
  }

  const recommendations = resultData.recommendations || [];
  
  // Toggle crop selection for comparison
  const toggleComparison = (cropId) => {
    setSelectedForComparison(prev => {
      if (prev.includes(cropId)) {
        return prev.filter(id => id !== cropId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 crops side-by-side.');
          return prev;
        }
        return [...prev, cropId];
      }
    });
  };

  const handleLaunchComparison = () => {
    if (selectedForComparison.length < 2) {
      alert('Please select at least 2 crops to compare.');
      return;
    }
    navigate('/compare', {
      state: {
        cropIds: selectedForComparison,
        inputProfile: inputProfile || resultData.inputSummary
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter recommendations by category tab
  const filteredCrops = filterCategory === 'ALL' 
    ? recommendations 
    : recommendations.filter(r => r.suitabilityCategory === filterCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print-container">
      
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <Link
          to="/recommend"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-agri-800 hover:text-agri-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Modify Input Conditions
        </Link>

        <div className="flex items-center gap-3">
          {selectedForComparison.length >= 2 && (
            <button
              onClick={handleLaunchComparison}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-xl shadow-xs transition-colors"
            >
              <Scale className="w-4 h-4" /> Compare Selected ({selectedForComparison.length})
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl shadow-xs transition-colors allow-print"
          >
            <Printer className="w-4 h-4 text-gray-500" /> Print Summary
          </button>
        </div>
      </div>

      {/* Header Summary Card */}
      <div className="bg-white border border-agri-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-agri-100 text-agri-900 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-agri-700" />
              Engine Method: {resultData.methodVersion}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Crop Recommendation Analysis
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Evaluated {resultData.totalCropsEvaluated} crops against your environmental parameters. Found {resultData.matchingCropsCount} high/moderate matches.
            </p>
          </div>

          {/* Database Persistence Status Badge */}
          <div className="text-right">
            {resultData.persisted ? (
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium px-3 py-1 rounded-lg">
                <Database className="w-3.5 h-3.5" /> Saved to MongoDB (ID: {String(resultData.id).slice(-6)}...)
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium px-3 py-1 rounded-lg">
                <Database className="w-3.5 h-3.5" /> Memory / Offline Mode
              </div>
            )}
            <p className="text-[11px] text-gray-400 mt-1">Dataset: {resultData.datasetVersion}</p>
          </div>
        </div>

        {/* Input Profile Chips */}
        {resultData.inputSummary && (
          <div className="pt-5">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Evaluated Farm Profile:
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-medium">
                Soil: <strong className="capitalize">{resultData.inputSummary.soilType}</strong>
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-medium">
                Season: <strong className="capitalize">{resultData.inputSummary.season}</strong>
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-medium">
                pH: <strong>{resultData.inputSummary.ph}</strong>
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-medium">
                Temp: <strong>{resultData.inputSummary.temperature}</strong>
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-medium">
                Rainfall: <strong>{resultData.inputSummary.rainfall}</strong>
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg font-medium">
                Humidity: <strong>{resultData.inputSummary.humidity}</strong>
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-medium">
                N: <strong>{resultData.inputSummary.nitrogen}</strong>
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-medium">
                P: <strong>{resultData.inputSummary.phosphorus}</strong>
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg font-medium">
                K: <strong>{resultData.inputSummary.potassium}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Prominent Advisory Notice */}
      <AdvisoryBanner text={resultData.advisory} />

      {/* Filter Category Tabs and Compare Helper */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterCategory === 'ALL' ? 'bg-white shadow-xs text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
            All Crops ({recommendations.length})
          </button>
          <button
            onClick={() => setFilterCategory('High compatibility')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterCategory === 'High compatibility' ? 'bg-white shadow-xs text-emerald-800' : 'text-gray-600 hover:text-gray-900'}`}
          >
            High Compatibility
          </button>
          <button
            onClick={() => setFilterCategory('Moderate compatibility')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterCategory === 'Moderate compatibility' ? 'bg-white shadow-xs text-amber-800' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Moderate
          </button>
          <button
            onClick={() => setFilterCategory('Low compatibility')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filterCategory === 'Low compatibility' ? 'bg-white shadow-xs text-rose-800' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Low
          </button>
        </div>

        <div className="text-xs text-gray-500">
          Tip: Select checkboxes on 2 or more crops to unlock side-by-side comparison.
        </div>
      </div>

      {/* Recommendation Cards List */}
      <div className="space-y-4">
        {filteredCrops.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
            No crops matched the selected category filter.
          </div>
        ) : (
          filteredCrops.map((crop) => {
            const isSelected = selectedForComparison.includes(crop.cropId);
            const isExpanded = expandedCropId === crop.cropId;

            return (
              <div 
                key={crop.cropId}
                className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all shadow-xs ${
                  isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200 hover:border-agri-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-8 h-8 rounded-lg bg-agri-900 text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                      #{crop.rank}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-gray-900">
                          {crop.cropName}
                        </h2>
                        {crop.botanicalName && (
                          <span className="text-xs italic text-gray-500">
                            ({crop.botanicalName})
                          </span>
                        )}
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                          {crop.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Duration: {crop.growingPeriodDays} days • Data source: {crop.source}
                      </p>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <SuitabilityBadge category={crop.suitabilityCategory} score={crop.score} />

                    {/* Compare Checkbox */}
                    <label className="no-print inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200 select-none">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleComparison(crop.cropId)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      Compare
                    </label>

                    <button
                      type="button"
                      onClick={() => setExpandedCropId(isExpanded ? null : crop.cropId)}
                      className="no-print p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Explanation */}
                <div className="mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed bg-agri-50/50 p-3.5 rounded-xl border border-agri-100">
                  <strong className="text-agri-950 block mb-0.5 font-semibold">Rule Evaluation Result:</strong>
                  {crop.explanation}
                </div>

                {/* Always-Visible Factor Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Matching Factors */}
                  <div>
                    <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Matching Agronomic Factors ({crop.matchingFactors.length})
                    </h3>
                    {crop.matchingFactors.length > 0 ? (
                      <ul className="space-y-1">
                        {crop.matchingFactors.map((factor, idx) => (
                          <li key={idx} className="text-xs text-gray-700 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No evaluated factors met optimal criteria.</p>
                    )}
                  </div>

                  {/* Unmet Factors */}
                  <div>
                    <h3 className="text-xs font-semibold text-rose-800 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Unmet / Limiting Factors ({crop.unmetFactors.length})
                    </h3>
                    {crop.unmetFactors.length > 0 ? (
                      <ul className="space-y-1">
                        {crop.unmetFactors.map((factor, idx) => (
                          <li key={idx} className="text-xs text-rose-900 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-700 font-medium">None. All evaluated conditions within tolerance.</p>
                    )}
                  </div>
                </div>

                {/* Collapsible Deep Details (Missing factors & Limitations) */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-gray-100 text-xs space-y-3">
                    {crop.missingFactors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-amber-800 flex items-center gap-1 mb-1">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                          Missing / Omitted Information ({crop.missingFactors.length}):
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 pl-1 space-y-0.5">
                          {crop.missingFactors.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {crop.limitations && crop.limitations.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-gray-800 flex items-center gap-1 mb-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-gray-600" />
                          Agronomic Assumptions & Limitations:
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 pl-1 space-y-0.5">
                          {crop.limitations.map((lim, i) => (
                            <li key={i}>{lim}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Comparison Drawer when items selected */}
      {selectedForComparison.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-agri-950 text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-6 border border-agri-800 no-print animate-in fade-in slide-in-from-bottom-4">
          <div className="text-xs">
            <span className="font-bold text-sm block text-emerald-400">
              {selectedForComparison.length} Crops Selected
            </span>
            <span className="text-gray-300">Ready for side-by-side comparative analysis</span>
          </div>
          <button
            onClick={handleLaunchComparison}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-agri-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md"
          >
            <Scale className="w-4 h-4" /> Compare Now
          </button>
        </div>
      )}
    </div>
  );
}
