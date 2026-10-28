import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, BarChart3, History, BookOpen, Layers } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Sprout },
    { to: '/recommend', label: 'Get Recommendations', icon: Layers },
    { to: '/history', label: 'History', icon: History },
    { to: '/methodology', label: 'Methodology & About', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-agri-100 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-agri-800 flex items-center justify-center text-white shadow-md shadow-agri-800/20 group-hover:bg-agri-700 transition-colors">
              <Sprout className="w-6 h-6 text-agri-200" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-agri-950 flex items-center gap-1.5">
                SmartCrop <span className="text-agri-700 text-sm font-semibold bg-agri-100 px-2 py-0.5 rounded-full border border-agri-200">AI</span>
              </span>
              <p className="text-[11px] text-gray-500 hidden sm:block">Intelligent Agronomic Advisory Engine</p>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-agri-100 text-agri-900 shadow-sm font-semibold'
                      : 'text-gray-600 hover:text-agri-900 hover:bg-agri-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-agri-700' : 'text-gray-400'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
