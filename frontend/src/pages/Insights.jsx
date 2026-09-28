import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Info,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await api.getInsights();
      setInsights(res);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Mining AI Analytical Insights & Correlations...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>AI Knowledge & Insights</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
          HR Predictive Insights
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Synthesized pattern analysis extracted from current employee data and ML decision trees.
        </p>
      </div>

      {/* Important Disclaimer Card */}
      <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-slate-800 flex items-start space-x-4">
        <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-amber-950 uppercase tracking-wide">
            Analytical Disclaimer: Correlation vs. Causation
          </h4>
          <p className="text-slate-700 leading-relaxed">
            The insights presented below represent observed statistical correlations within the organizational workforce dataset.
            <strong> Note: Correlation does not prove causation.</strong> High training hours or satisfaction ratings correlate with top performance tiers, but contextual operational factors must be considered when implementing HR policy decisions.
          </p>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100">
                {item.category}
              </span>
              <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                {item.metric}
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span>ML Data Observation</span>
              <span className="text-amber-600 font-bold">Verified Signal</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
