import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Database, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-agri-800 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-agri-200" />
              </div>
              <span className="font-bold text-lg text-agri-950">SmartCrop AI</span>
            </div>
            <p className="text-sm text-gray-600 max-w-md leading-relaxed">
              Transparent, rule-based decision-support system evaluating soil chemistry, seasonal climatology, and crop physiological tolerances for student hackathon problem <strong>HACK-P302</strong>.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-agri-600" /> Transparent Rules
              </span>
              <span className="flex items-center gap-1">
                <Database className="w-4 h-4 text-agri-600" /> ICAR/FAO Data
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-agri-600" /> Deterministic
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-agri-800 transition-colors">Dashboard Home</Link></li>
              <li><Link to="/recommend" className="hover:text-agri-800 transition-colors">Recommendation Form</Link></li>
              <li><Link to="/history" className="hover:text-agri-800 transition-colors">Saved History</Link></li>
              <li><Link to="/methodology" className="hover:text-agri-800 transition-colors">Methodology & Dataset</Link></li>
            </ul>
          </div>

          {/* Hackathon Specs */}
          <div>
            <h4 className="font-semibold text-sm text-gray-900 mb-3 uppercase tracking-wider">Project Specifications</h4>
            <ul className="space-y-1.5 text-xs text-gray-600">
              <li><span className="font-medium text-gray-800">Problem ID:</span> HACK-P302</li>
              <li><span className="font-medium text-gray-800">Category:</span> Agriculture</li>
              <li><span className="font-medium text-gray-800">Subject:</span> Backend Web Dev</li>
              <li><span className="font-medium text-gray-800">Engine:</span> Deterministic Heuristics</li>
              <li><span className="font-medium text-gray-800">Storage:</span> MongoDB Atlas Mongoose</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© {new Date().getFullYear()} SmartCrop AI — Decision Support System for Student Hackathon.</p>
          <p className="text-gray-400">Not intended as a sole replacement for certified agronomic field trials.</p>
        </div>
      </div>
    </footer>
  );
}
