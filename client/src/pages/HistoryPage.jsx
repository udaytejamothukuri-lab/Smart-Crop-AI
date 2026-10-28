import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  History, 
  Trash2, 
  ExternalLink, 
  Printer, 
  Database, 
  AlertCircle, 
  Calendar, 
  Layers, 
  Sparkles,
  Info,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { getRecommendationHistory, deleteRecommendationRecord, getRecommendationRecord } from '../services/api';
import SuitabilityBadge from '../components/SuitabilityBadge';

export default function HistoryPage() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbOffline, setDbOffline] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    setDbOffline(false);
    try {
      const data = await getRecommendationHistory();
      setRecords(data.records || []);
    } catch (err) {
      if (err.message.includes('Database') || err.message.includes('503') || err.message.includes('MongoDB')) {
        setDbOffline(true);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleOpenRecord = async (id) => {
    try {
      const data = await getRecommendationRecord(id);
      if (data.record) {
        navigate('/results', {
          state: {
            result: data.record,
            inputProfile: data.record.inputProfile
          }
        });
      }
    } catch (err) {
      alert(`Could not load record: ${err.message}`);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this saved recommendation record from the database?')) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteRecommendationRecord(id);
      setRecords(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert(`Failed to delete record: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-agri-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" /> Persistence Archive
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Recommendation History
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Persisted recommendation queries retrieved from MongoDB Atlas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white border border-gray-300 text-gray-700 px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Link
            to="/recommend"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-agri-800 hover:bg-agri-900 text-white px-4 py-2 rounded-xl transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" /> New Recommendation
          </Link>
        </div>
      </div>

      {/* Non-Private Notice (Mandated by Section 5.E: No fake auth) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3 text-amber-950 text-xs sm:text-sm">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block mb-0.5">Public History Notice:</strong>
          User authentication is deliberately not implemented to prioritize open evaluation for this student hackathon. All saved recommendation records are publicly visible. Do not store confidential plot data or personal identifiers.
        </div>
      </div>

      {/* DB Offline Alert if Mongo is down */}
      {dbOffline && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-8 text-rose-950">
          <div className="flex items-center gap-2 font-bold text-base mb-2">
            <Database className="w-5 h-5 text-rose-600" />
            MongoDB Persistence Unavailable
          </div>
          <p className="text-xs sm:text-sm leading-relaxed mb-4">
            The backend is currently operating without an active MongoDB connection. The rule-based recommendation engine continues to function in real-time in standalone memory mode, but history retrieval and permanent persistence require a configured MongoDB URI.
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-rose-200 font-mono text-xs text-rose-900">
            Set <code>MONGODB_URI=mongodb+srv://...</code> in <code>server/.env</code> and restart the server.
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-500">
          <span className="w-6 h-6 border-2 border-agri-600 border-t-transparent rounded-full animate-spin inline-block mb-3"></span>
          <p className="text-sm font-medium">Querying MongoDB recommendation archive...</p>
        </div>
      ) : records.length === 0 && !dbOffline ? (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center mx-auto mb-3">
            <Database className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No Saved Records Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            Saved crop recommendations will appear here automatically when queries are run with database persistence enabled.
          </p>
          <Link
            to="/recommend"
            className="inline-flex items-center gap-2 bg-agri-800 hover:bg-agri-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
          >
            Run Your First Recommendation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((rec) => {
            const dateStr = new Date(rec.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            const p = rec.inputProfile || {};
            const topCrops = rec.recommendations || [];

            return (
              <div
                key={rec._id}
                className="bg-white border border-gray-200 hover:border-agri-300 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Date & ID */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {dateStr}
                    </span>
                    <span className="font-mono text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                      ID: {String(rec._id).slice(-6)}
                    </span>
                  </div>

                  {/* Input Profile Summary */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Input Conditions:
                    </div>
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded capitalize">
                        {p.soilType || 'Soil ?'}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded capitalize">
                        {p.season || 'Season ?'}
                      </span>
                      {p.ph !== null && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          pH {p.ph}
                        </span>
                      )}
                      {p.temperature !== null && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          {p.temperature}°C
                        </span>
                      )}
                      {p.rainfall !== null && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          {p.rainfall}mm
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Top Recommended Crops */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
                      Top Recommendations:
                    </div>
                    <div className="space-y-1.5">
                      {topCrops.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-xs bg-agri-50/50 px-2.5 py-1.5 rounded-lg border border-agri-100">
                          <span className="font-semibold text-gray-900">
                            #{c.rank || i + 1} {c.cropName}
                          </span>
                          <SuitabilityBadge category={c.suitabilityCategory} score={c.score} showScore={false} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => handleOpenRecord(rec._id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-agri-800 hover:text-agri-950 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Full Report
                  </button>

                  <button
                    onClick={(e) => handleDelete(rec._id, e)}
                    disabled={deletingId === rec._id}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
