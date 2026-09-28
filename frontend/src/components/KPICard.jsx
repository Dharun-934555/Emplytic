import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KPICard({ title, value, percentage, trend, trendText, icon: Icon, colorTheme = 'default' }) {
  const isDark = colorTheme === 'dark';
  const isGold = colorTheme === 'gold';

  return (
    <div
      className={`p-6 rounded-3xl transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? 'bg-slate-900 text-white border border-slate-800 shadow-xl shadow-slate-900/10'
          : isGold
          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20'
          : 'bg-white border border-slate-200/80 shadow-soft text-slate-900'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className={`text-xs font-semibold tracking-wide uppercase ${
            isDark ? 'text-slate-400' : isGold ? 'text-amber-100' : 'text-slate-500'
          }`}
        >
          {title}
        </span>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDark
                ? 'bg-slate-800 text-amber-400'
                : isGold
                ? 'bg-amber-400/30 text-white'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}
          >
            <Icon className="w-5 h-5 stroke-[2]" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="text-3xl font-extrabold tracking-tight font-sans">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </h3>
          {percentage !== undefined && (
            <span
              className={`text-xs font-semibold mt-1 block ${
                isDark ? 'text-slate-400' : isGold ? 'text-amber-100' : 'text-slate-500'
              }`}
            >
              {percentage}% of workforce
            </span>
          )}
        </div>

        {trendText && (
          <div
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              trend === 'up'
                ? isDark
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : trend === 'down'
                ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trendText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
