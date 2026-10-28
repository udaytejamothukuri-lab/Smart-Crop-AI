import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  CheckCircle, 
  Database, 
  SlidersHorizontal, 
  FileText, 
  Scale, 
  ShieldAlert, 
  Activity,
  Layers,
  Thermometer,
  CloudRain,
  FlaskConical
} from 'lucide-react';
import AdvisoryBanner from '../components/AdvisoryBanner';
import { checkBackendHealth } from '../services/api';

export default function HomePage() {
  const [backendHealth, setBackendHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  useEffect(() => {
    checkBackendHealth()
      .then(data => {
        setBackendHealth(data);
        setLoadingHealth(false);
      })
      .catch(() => {
        setBackendHealth({ status: 'offline', database: { connected: false } });
        setLoadingHealth(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top System Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-agri-200 rounded-xl px-4 py-2.5 mb-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Activity className="w-4 h-4 text-agri-600" />
          <span className="font-medium text-gray-800">System Status:</span>
          {loadingHealth ? (
            <span className="text-gray-400">Pinging backend...</span>
          ) : backendHealth?.status === 'ok' ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Backend Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Backend Offline
            </span>
          )}

          <span className="text-gray-300">|</span>

          <span className="text-gray-500">Database:</span>
          {backendHealth?.database?.connected ? (
            <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">MongoDB Connected</span>
          ) : (
            <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full">Offline / Standalone Mode</span>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Method: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">rule-based-v1.0</code>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-agri-900 via-agri-800 to-agri-950 text-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-xl mb-12">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-agri-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-agri-700/60 border border-agri-600/50 rounded-full px-3.5 py-1 text-xs text-agri-200 font-medium mb-6 backdrop-blur">
            <Sprout className="w-3.5 h-3.5" />
            Hackathon Problem HACK-P302 • Transparent Decision-Support
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            SmartCrop AI — Intelligent Crop Recommendation System
          </h1>

          <p className="text-base sm:text-lg text-agri-100 mb-8 leading-relaxed font-normal">
            A transparent, deterministic agronomic advisory engine. Enter your soil chemistry, regional climatology, and crop season to receive ranked crop matches with full physiological explanations and explicit limitation tracking.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/recommend"
              className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-agri-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/20 transition-all hover:translate-y-[-1px]"
            >
              Get Crop Recommendations
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/methodology"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3.5 rounded-xl border border-white/20 transition-colors backdrop-blur"
            >
              Explore Methodology
            </Link>

            <Link
              to="/history"
              className="inline-flex items-center gap-2 text-agri-200 hover:text-white font-medium px-4 py-3.5 transition-colors text-sm"
            >
              View Saved History →
            </Link>
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <AdvisoryBanner />

      {/* Key Features Grid */}
      <div className="my-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Engineered for Transparency & Agronomic Precision
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            No black-box models or fabricated numbers. Every suggestion is backed by documented requirements and rigorous parameter checks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-agri-200/80 rounded-2xl p-6 shadow-xs hover:border-agri-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Deterministic Rule Engine</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Computes compatibility against verified thresholds for soil pH, seasonal temperature, cumulative rainfall, humidity, and soil nutrients without random drift.
            </p>
          </div>

          <div className="bg-white border border-agri-200/80 rounded-2xl p-6 shadow-xs hover:border-agri-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Missing Value Awareness</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Omitted nutrient assays (N, P, K) are transparently categorized as unknown instead of being silently defaulted to zero, preserving agricultural validity.
            </p>
          </div>

          <div className="bg-white border border-agri-200/80 rounded-2xl p-6 shadow-xs hover:border-agri-400 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Side-by-Side Comparison</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Compare any two or more crops against the exact same soil profile to contrast water consumption, temperature windows, and soil type suitability.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Step-by-Step */}
      <div className="bg-agri-50/70 border border-agri-200 rounded-3xl p-8 sm:p-12 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          How the Recommendation Engine Operates
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-5 border border-agri-200 shadow-xs">
            <div className="text-xs font-bold text-agri-700 uppercase tracking-wider mb-2">Step 1</div>
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
              <FlaskConical className="w-5 h-5 text-agri-600" /> Input Data
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Enter your soil type, soil pH, climate figures, season, and available N-P-K laboratory values.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-agri-200 shadow-xs">
            <div className="text-xs font-bold text-agri-700 uppercase tracking-wider mb-2">Step 2</div>
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
              <Database className="w-5 h-5 text-agri-600" /> Agronomic Match
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              The backend tests conditions against documented ICAR/FAO physiological tolerance matrices.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-agri-200 shadow-xs">
            <div className="text-xs font-bold text-agri-700 uppercase tracking-wider mb-2">Step 3</div>
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
              <Layers className="w-5 h-5 text-agri-600" /> Ranked Output
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Crops are categorized into High, Moderate, Low, or Insufficient with positive and unmet factors.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-agri-200 shadow-xs">
            <div className="text-xs font-bold text-agri-700 uppercase tracking-wider mb-2">Step 4</div>
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
              <FileText className="w-5 h-5 text-agri-600" /> Save & Export
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Persist recommendations to MongoDB, run side-by-side comparisons, or print a clean summary.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action card */}
      <div className="bg-white border-2 border-agri-300 rounded-2xl p-8 sm:p-10 text-center shadow-sm">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          Ready to evaluate your farm soil & climate profile?
        </h3>
        <p className="text-sm text-gray-600 max-w-xl mx-auto mb-6">
          Use our interactive input form with built-in instant test presets representing complete, arid, summer, and missing-nutrient scenarios.
        </p>
        <Link
          to="/recommend"
          className="inline-flex items-center gap-2 bg-agri-800 hover:bg-agri-900 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-colors"
        >
          Launch Recommendation Engine
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
