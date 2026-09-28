import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  Zap,
  RotateCcw,
  CheckCircle2,
  Sliders,
  BarChart3
} from 'lucide-react';
import { api } from '../services/api';

export default function MLPrediction() {
  const defaultForm = {
    age: 34,
    gender: 'Female',
    department: 'Engineering',
    job_role: 'Software Engineer',
    years_at_company: 4,
    years_in_current_role: 3,
    monthly_income: 9500,
    job_level: 3,
    job_satisfaction: 4,
    environment_satisfaction: 4,
    work_life_balance: 3,
    training_hours: 50,
    projects_completed: 14,
    attendance_rate: 97.5,
    overtime_hours: 6,
    previous_experience: 4,
    promotion_last_5_years: 1,
    employee_engagement: 8.5,
    absenteeism: 1
  };

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const applyPreset = (type) => {
    if (type === 'high') {
      setForm({
        ...defaultForm,
        employee_engagement: 9.2,
        attendance_rate: 98.5,
        job_satisfaction: 5,
        projects_completed: 18,
        training_hours: 75,
        promotion_last_5_years: 1,
        absenteeism: 0,
        overtime_hours: 10
      });
    } else if (type === 'medium') {
      setForm({
        ...defaultForm,
        employee_engagement: 6.5,
        attendance_rate: 93.0,
        job_satisfaction: 3,
        projects_completed: 9,
        training_hours: 30,
        promotion_last_5_years: 0,
        absenteeism: 4,
        overtime_hours: 15
      });
    } else if (type === 'low') {
      setForm({
        ...defaultForm,
        employee_engagement: 3.2,
        attendance_rate: 84.0,
        job_satisfaction: 1,
        projects_completed: 4,
        training_hours: 12,
        promotion_last_5_years: 0,
        absenteeism: 12,
        overtime_hours: 35
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.predictPerformance(form);
      setResult(res);
    } catch (err) {
      alert(`Prediction failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Predictive Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Performance Prediction
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Predict employee performance using Machine Learning models trained on workforce analytics.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">Quick Presets:</span>
          <button
            onClick={() => applyPreset('high')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
          >
            High Performer
          </button>
          <button
            onClick={() => applyPreset('medium')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100"
          >
            Medium
          </button>
          <button
            onClick={() => applyPreset('low')}
            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100"
          >
            At-Risk / Low
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column (18 Fields) */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>Employee Features & Indicators</span>
              </h3>
              <button
                type="button"
                onClick={() => setForm(defaultForm)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* 1. Age */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 2. Department */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              {/* 3. Job Role */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Role</label>
                <input
                  type="text"
                  value={form.job_role}
                  onChange={(e) => setForm({ ...form, job_role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 4. Years at Company */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Years at Company</label>
                <input
                  type="number"
                  value={form.years_at_company}
                  onChange={(e) => setForm({ ...form, years_at_company: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 5. Years in Current Role */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Years in Current Role</label>
                <input
                  type="number"
                  value={form.years_in_current_role}
                  onChange={(e) => setForm({ ...form, years_in_current_role: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 6. Monthly Income */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Monthly Income ($)</label>
                <input
                  type="number"
                  value={form.monthly_income}
                  onChange={(e) => setForm({ ...form, monthly_income: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 7. Job Level */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Level (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form.job_level}
                  onChange={(e) => setForm({ ...form, job_level: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 8. Job Satisfaction */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Satisfaction (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form.job_satisfaction}
                  onChange={(e) => setForm({ ...form, job_satisfaction: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 9. Environment Satisfaction */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Environment Satisfaction (1-5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form.environment_satisfaction}
                  onChange={(e) => setForm({ ...form, environment_satisfaction: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 10. Work Life Balance */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Work Life Balance (1-4)</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={form.work_life_balance}
                  onChange={(e) => setForm({ ...form, work_life_balance: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 11. Training Hours */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Training Hours</label>
                <input
                  type="number"
                  value={form.training_hours}
                  onChange={(e) => setForm({ ...form, training_hours: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 12. Projects Completed */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Projects Completed</label>
                <input
                  type="number"
                  value={form.projects_completed}
                  onChange={(e) => setForm({ ...form, projects_completed: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 13. Attendance Rate */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Attendance Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={form.attendance_rate}
                  onChange={(e) => setForm({ ...form, attendance_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 14. Overtime Hours */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Overtime Hours</label>
                <input
                  type="number"
                  value={form.overtime_hours}
                  onChange={(e) => setForm({ ...form, overtime_hours: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 15. Previous Experience */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Previous Experience (Yrs)</label>
                <input
                  type="number"
                  value={form.previous_experience}
                  onChange={(e) => setForm({ ...form, previous_experience: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 16. Promotion History */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Promoted in Last 5 Yrs?</label>
                <select
                  value={form.promotion_last_5_years}
                  onChange={(e) => setForm({ ...form, promotion_last_5_years: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                >
                  <option value={1}>Yes (1)</option>
                  <option value={0}>No (0)</option>
                </select>
              </div>

              {/* 17. Employee Engagement */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Employee Engagement Score (1-10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="10"
                  value={form.employee_engagement}
                  onChange={(e) => setForm({ ...form, employee_engagement: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>

              {/* 18. Absenteeism */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Absenteeism (Days)</label>
                <input
                  type="number"
                  value={form.absenteeism}
                  onChange={(e) => setForm({ ...form, absenteeism: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm tracking-wider uppercase flex items-center justify-center space-x-3 shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.01]"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Computing Probabilities...</span>
                  </div>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5 text-amber-400" />
                    <span>Predict Performance Group</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Large Result Card Column */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="space-y-1 border-b border-slate-800 pb-4">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                  PREDICTED PERFORMANCE RESULT
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight font-sans text-white uppercase">
                  {result.predicted_group}
                </h3>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{result.confidence}% ML Confidence</span>
                </div>
              </div>

              {/* Class Probabilities Breakdown */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Probability Distribution
                </h4>

                {/* High */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      High Performance
                    </span>
                    <span className="text-emerald-400 font-extrabold">{result.high_probability}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${result.high_probability}%` }}
                    ></div>
                  </div>
                </div>

                {/* Medium */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      Medium Performance
                    </span>
                    <span className="text-amber-400 font-extrabold">{result.medium_probability}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${result.medium_probability}%` }}
                    ></div>
                  </div>
                </div>

                {/* Low */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      Low Performance
                    </span>
                    <span className="text-rose-400 font-extrabold">{result.low_probability}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${result.low_probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Top Factors */}
              {result.top_factors && result.top_factors.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Key Drivers for Prediction
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {result.top_factors.slice(0, 4).map((f, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                        <span className="text-slate-400 block text-[10px]">{f.factor}</span>
                        <span className="text-white font-bold">{f.impact}% weight</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 rounded-3xl bg-white border border-slate-200/80 shadow-soft text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Awaiting Form Submission</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Adjust features on the left or choose a preset and click "Predict Performance" to generate AI output.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
