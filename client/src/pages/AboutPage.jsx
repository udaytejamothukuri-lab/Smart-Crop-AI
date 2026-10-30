import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Scale, 
  Users, 
  Database,
  FlaskConical,
  Award,
  ExternalLink
} from 'lucide-react';
import AdvisoryBanner from '../components/AdvisoryBanner';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Title */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-agri-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" /> Technical Documentation & Specification
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          System Methodology & Agronomic Rules
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-3xl leading-relaxed">
          Comprehensive explanation of the transparent decision-support engine, agronomic data sources, evaluation formulas, unit assumptions, and known limitations.
        </p>
      </div>

      <AdvisoryBanner />

      {/* Section 1: System Purpose */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5 text-agri-700" />
          1. System Purpose & Problem Context
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          SmartCrop AI was developed for hackathon problem <strong>HACK-P302</strong> under the Agriculture category. The objective is to provide a transparent, deterministic decision-support application that evaluates user-supplied soil and environmental parameters to suggest physiologically compatible crops without relying on opaque "black box" models.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          Unlike proprietary statistical models that produce uninterpretable confidence numbers, SmartCrop AI exposes the exact criteria evaluated, highlights limiting factors, identifies omitted data, and explains every recommendation.
        </p>
      </section>

      {/* Section 2: Rule-Based Evaluation Algorithm */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Scale className="w-5 h-5 text-agri-700" />
          2. Recommendation Algorithm & Scoring Architecture
        </h2>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          The engine operates on a multi-tier constraint evaluation system. Each supported environmental and soil factor has defined <strong>Optimal</strong> and <strong>Tolerable</strong> ranges:
        </p>

        {/* Weights Table */}
        <div className="overflow-x-auto my-4">
          <table className="w-full text-xs text-left border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-agri-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3">Parameter</th>
                <th className="p-3">Relative Weight</th>
                <th className="p-3">Optimal Score</th>
                <th className="p-3">Tolerable Score</th>
                <th className="p-3">Mismatched Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="p-3 font-semibold">Soil Type Compatibility</td>
                <td className="p-3">20%</td>
                <td className="p-3 text-emerald-700 font-medium">100% (20 pts)</td>
                <td className="p-3 text-gray-400">—</td>
                <td className="p-3 text-rose-700 font-medium">0% (Critical Mismatch)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Temperature Window (°C)</td>
                <td className="p-3">20%</td>
                <td className="p-3 text-emerald-700 font-medium">100% (20 pts)</td>
                <td className="p-3 text-amber-700 font-medium">60% (12 pts)</td>
                <td className="p-3 text-rose-700 font-medium">0% (Severe Mismatch)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Seasonal Alignment</td>
                <td className="p-3">15%</td>
                <td className="p-3 text-emerald-700 font-medium">100% (15 pts)</td>
                <td className="p-3 text-gray-400">—</td>
                <td className="p-3 text-rose-700 font-medium">0% (Critical Mismatch)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Cumulative Seasonal Rainfall (mm)</td>
                <td className="p-3">15%</td>
                <td className="p-3 text-emerald-700 font-medium">100% (15 pts)</td>
                <td className="p-3 text-amber-700 font-medium">60% (9 pts)</td>
                <td className="p-3 text-rose-700 font-medium">0%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Soil pH (0 - 14)</td>
                <td className="p-3">15%</td>
                <td className="p-3 text-emerald-700 font-medium">100% (15 pts)</td>
                <td className="p-3 text-amber-700 font-medium">60% (9 pts)</td>
                <td className="p-3 text-rose-700 font-medium">0%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Relative Humidity (%)</td>
                <td className="p-3">5%</td>
                <td className="p-3 text-emerald-700 font-medium">100% (5 pts)</td>
                <td className="p-3 text-amber-700 font-medium">60% (3 pts)</td>
                <td className="p-3 text-rose-700 font-medium">0%</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Available N-P-K Nutrients (Optional)</td>
                <td className="p-3">10% (3.33% each)</td>
                <td className="p-3 text-emerald-700 font-medium">100%</td>
                <td className="p-3 text-amber-700 font-medium">60%</td>
                <td className="p-3 text-rose-700 font-medium">0%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-base font-bold text-gray-900 mt-6 mb-2">
          Handling Missing Values (Coverage-Ratio Normalization)
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          A common flaw in agricultural tools is defaulting missing nutrient assays to zero, which falsely penalizes crops or triggers erroneous fertilizer flags. In SmartCrop AI:
        </p>
        <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 pl-2 mb-4">
          <li>Missing parameters are recorded explicitly in the <code>missingFactors</code> array.</li>
          <li>Scores are computed by normalizing earned points over the sum of weights of <strong>actually provided parameters</strong>.</li>
          <li>If the total active weight is under <strong>50%</strong> of the full matrix, the engine assigns the category <strong>"Insufficient information"</strong> with score <code>null</code>.</li>
        </ul>

        <h3 className="text-base font-bold text-gray-900 mt-6 mb-2">
          Suitability Categories & Criteria
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="font-bold text-emerald-900 mb-1">High Compatibility</div>
            <p className="text-emerald-800">
              Normalized score &ge; 80%, zero critical mismatches, and climate/soil within optimal or high-tolerance thresholds.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60">
            <div className="font-bold text-amber-900 mb-1">Moderate Compatibility</div>
            <p className="text-amber-800">
              Normalized score 60% – 79%, or key parameters (like rainfall or pH) fall within tolerable rather than optimal limits.
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60">
            <div className="font-bold text-rose-900 mb-1">Low Compatibility</div>
            <p className="text-rose-800">
              Score &lt; 60% OR one or more hard environmental constraints violated (e.g., season outside growing window, extreme temperature).
            </p>
          </div>
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80">
            <div className="font-bold text-slate-900 mb-1">Insufficient Information</div>
            <p className="text-slate-800">
              User-provided inputs account for less than 50% parameter coverage. No confident recommendation is fabricated.
            </p>
          </div>
        </div>

        <h3 className="text-base font-bold text-gray-900 mt-6 mb-2">
          Deterministic Tie-Breaking Hierarchy
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          To ensure completely repeatable results across runs, crops with equal scores are ordered strictly by:
          <br />
          <code>Category Priority (High &gt; Moderate &gt; Low) &rarr; Normalized Score (Desc) &rarr; Positive Matches Count (Desc) &rarr; Crop Name (A-Z Ascending)</code>.
        </p>
      </section>

      {/* Section 3: Data Sources and Units */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Database className="w-5 h-5 text-agri-700" />
          3. Agronomic Data Sources & Measurement Units
        </h2>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          All baseline crop requirements are compiled in <code>server/src/data/crops.js</code> (Dataset Version: <code>v1.1.0-icar-fao-documented</code>) from verified agronomic publications:
        </p>

        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 pl-2 mb-6">
          <li><strong>ICAR Handbook of Agriculture (6th Edition)</strong> — Indian Council of Agricultural Research agronomic packages of practices.</li>
          <li><strong>FAO Ecocrop Database & Irrigation/Drainage Paper 56</strong> — Food and Agriculture Organization crop evapotranspiration and physiological tolerance baselines.</li>
          <li><strong>TNAU Agritech Portal</strong> — Tamil Nadu Agricultural University crop production guides.</li>
        </ul>

        <h3 className="text-base font-bold text-gray-900 mb-2">
          Strict Unit Handling Assumptions
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-900 w-28 flex-shrink-0">Soil pH:</span>
            <span>Dimensionless standard scale (0.0 – 14.0). Agricultural soils typically range between 4.5 and 8.5.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-900 w-28 flex-shrink-0">Temperature:</span>
            <span>Degrees Celsius (°C). Represents mean ambient growing season temperature.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-900 w-28 flex-shrink-0">Rainfall:</span>
            <span>Millimeters (mm). Cumulative moisture received over the crop cultivation period (rainfall + assured irrigation).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-900 w-28 flex-shrink-0">Humidity:</span>
            <span>Relative humidity percentage (% RH).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-semibold text-gray-900 w-28 flex-shrink-0">Nutrients (N-P-K):</span>
            <span>Milligrams per kilogram of soil (mg/kg), corresponding to standard alkaline permanganate (N), Olsen/Bray (P), and ammonium acetate (K) laboratory assays.</span>
          </li>
        </ul>
      </section>

      {/* Section 4: System Limitations */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          4. Assumptions & Agronomic Limitations
        </h2>
        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed list-disc list-inside">
          <li><strong>Decision-Support Prototype:</strong> SmartCrop AI is a heuristic screening tool. It does not predict actual financial yield (quintals/hectare) or commodity market pricing.</li>
          <li><strong>Microclimate Variations:</strong> Real farm parcels may have localized drainage issues, high salinity patches, or frost pockets that require on-site inspection.</li>
          <li><strong>Biological Factors:</strong> Disease pressure, pest infestations (e.g. locusts, bollworms), and seed variety genetics (hybrid vs native heirloom) are not accounted for by static weather matrices.</li>
          <li><strong>Crucial Role of Agronomists:</strong> Farmers must consult certified agricultural extension officers and regional university advisory centers before purchasing seeds or initiating land preparation.</li>
        </ul>
      </section>

      {/* Section 5: Team Information (Mandated Section 18) */}
      <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-agri-700" />
          5. Project Team Information (HACK-P302)
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Four students from the same academic section collaborating on Full-Stack Backend Web Development.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Member 1: Team Lead */}
          <div className="p-4 rounded-xl border border-agri-200 bg-agri-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-agri-950">Thanveesh Lingala</span>
              <span className="text-[10px] bg-agri-200 text-agri-900 font-bold px-2 py-0.5 rounded-full">Team Lead</span>
            </div>
            <p className="text-gray-600 mb-2">Roll No: <strong>25MVCSDR0565</strong> • Branch: <strong>CSE (Data Science)</strong></p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Contribution:</strong> Architecture design, Rule-based Recommendation Engine implementation, API routing, deterministic tie-breaking logic.
            </p>
          </div>

          {/* Member 2: Backend Developer */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-gray-900">Uday Teja Mothukuri</span>
              <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">Backend Developer</span>
            </div>
            <p className="text-gray-600 mb-2">Roll No: <strong>25MVCSDR0571</strong> • Branch: <strong>CSE (Data Science)</strong></p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Contribution:</strong> Database schema & persistence, session/MongoDB connection lifecycle, history CRUD routes, validation middleware.
            </p>
          </div>

          {/* Member 3: Frontend Developer */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-gray-900">Ushakoyala Hema Chandra Sai</span>
              <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">Frontend Developer</span>
            </div>
            <p className="text-gray-600 mb-2">Roll No: <strong>25MVCSDR0590</strong> • Branch: <strong>CSE (Data Science)</strong></p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Contribution:</strong> React dashboard, responsive Tailwind UI, crop comparison matrix, print styling, client error handling.
            </p>
          </div>

          {/* Member 4: Data / Testing */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-gray-900">Gannimani JBL Nara Simha Swamy</span>
              <span className="text-[10px] bg-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">Data / Testing</span>
            </div>
            <p className="text-gray-600 mb-2">Roll No: <strong>25MVCSDR0555</strong> • Branch: <strong>CSE (Data Science)</strong></p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Contribution:</strong> ICAR/FAO dataset research, unit conversion verification, automated backend & profile testing, documentation & slide deck.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
