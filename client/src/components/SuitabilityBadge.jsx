import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

export default function SuitabilityBadge({ category, score, showScore = true }) {
  let badgeStyle = 'bg-gray-100 text-gray-800 border-gray-300';
  let Icon = HelpCircle;

  switch (category) {
    case 'High compatibility':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      Icon = CheckCircle2;
      break;
    case 'Moderate compatibility':
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
      Icon = AlertCircle;
      break;
    case 'Low compatibility':
      badgeStyle = 'bg-rose-50 text-rose-800 border-rose-300';
      Icon = XCircle;
      break;
    case 'Insufficient information':
    default:
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
      Icon = HelpCircle;
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{category}</span>
      {showScore && score !== null && score !== undefined && (
        <span className="ml-1 pl-1.5 border-l border-current/30 font-bold">
          {score}%
        </span>
      )}
    </span>
  );
}
