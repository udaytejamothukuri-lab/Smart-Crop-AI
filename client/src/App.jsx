import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import ResultsPage from './pages/ResultsPage';
import ComparisonPage from './pages/ComparisonPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';

function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-extrabold text-agri-950 mb-2">404</h1>
      <p className="text-lg text-gray-700 mb-6">Page Not Found</p>
      <a href="/" className="inline-block bg-agri-800 text-white font-semibold px-5 py-2.5 rounded-xl">
        Return to Dashboard
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#f8faf8] text-gray-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recommend" element={<InputPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/compare" element={<ComparisonPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/methodology" element={<AboutPage />} />
            <Route path="/about" element={<Navigate to="/methodology" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
