import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Award,
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  BookOpen,
  Zap,
  Star
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { api } from '../services/api';

export default function EmployeeDetails({ employeeId, onBack, setCurrentTab }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employeeId) {
      loadEmployeeDetails();
    }
  }, [employeeId]);

  const loadEmployeeDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getEmployeeById(employeeId);
      setEmployee(res);
    } catch (err) {
      console.error('Failed to load employee details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Loading Employee Profile & AI Factor Breakdown...
        </p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-lg font-bold text-slate-800">Employee record not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold"
        >
          Return to Staff Directory
        </button>
      </div>
    );
  }

  // Calculate radar data for employee competencies
  const radarData = [
    { subject: 'Engagement', A: (employee.employee_engagement / 10) * 100, fullMark: 100 },
    { subject: 'Attendance', A: employee.attendance_rate, fullMark: 100 },
    { subject: 'Satisfaction', A: (employee.job_satisfaction / 5) * 100, fullMark: 100 },
    { subject: 'Work-Life', A: (employee.work_life_balance / 4) * 100, fullMark: 100 },
    { subject: 'Training', A: Math.min(100, (employee.training_hours / 80) * 100), fullMark: 100 },
    { subject: 'Projects', A: Math.min(100, (employee.projects_completed / 15) * 100), fullMark: 100 },
  ];

  // Specific key factors driving performance for this individual
  const individualFactors = [
    { factor: 'Employee Engagement', value: `${employee.employee_engagement}/10`, impact: 35 },
    { factor: 'Attendance Consistency', value: `${employee.attendance_rate}%`, impact: 28 },
    { factor: 'Job Satisfaction Rating', value: `${employee.job_satisfaction}/5`, impact: 18 },
    { factor: 'Completed Deliverables', value: `${employee.projects_completed} projects`, impact: 12 },
    { factor: 'Annual Training Hours', value: `${employee.training_hours} hrs`, impact: 7 },
  ];

  const getBadge = (group) => {
    if (group === 'High Performance') {
      return (
        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/20 flex items-center space-x-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>High Performance</span>
        </span>
      );
    }
    if (group === 'Medium Performance') {
      return (
        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md shadow-amber-500/20 flex items-center space-x-1.5">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Medium Performance</span>
        </span>
      );
    }
    return (
      <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-rose-500 text-white shadow-md shadow-rose-500/20 flex items-center space-x-1.5">
        <Zap className="w-3.5 h-3.5" />
        <span>Low Performance</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back Button & Top Banner */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Employees</span>
        </button>

        <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-3xl bg-slate-900 text-amber-400 font-extrabold flex items-center justify-center text-3xl shadow-xl shadow-slate-900/10 border border-slate-800">
              {employee.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-extrabold text-slate-900 font-sans">{employee.name}</h2>
                <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-mono font-bold">
                  {employee.employee_id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.department}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employee.job_role} (Level {employee.job_level})</span>
                </span>
              </div>
            </div>
          </div>

          <div>
            {getBadge(employee.performance_group)}
          </div>
        </div>
      </div>

      {/* Grid: 6 Key Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Satisfaction</span>
          <p className="text-2xl font-extrabold text-slate-900">{employee.job_satisfaction} / 5</p>
          <span className="text-[11px] text-amber-700 font-bold block">⭐ Rated</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Attendance</span>
          <p className="text-2xl font-extrabold text-slate-900">{employee.attendance_rate}%</p>
          <span className="text-[11px] text-emerald-600 font-bold block">{employee.absenteeism} days absent</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Training</span>
          <p className="text-2xl font-extrabold text-slate-900">{employee.training_hours} hrs</p>
          <span className="text-[11px] text-slate-500 font-bold block">Annual completion</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Projects</span>
          <p className="text-2xl font-extrabold text-slate-900">{employee.projects_completed}</p>
          <span className="text-[11px] text-slate-500 font-bold block">Deliverables done</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Experience</span>
          <p className="text-2xl font-extrabold text-slate-900">{employee.years_at_company} yrs</p>
          <span className="text-[11px] text-slate-500 font-bold block">At company</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-soft space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Monthly Income</span>
          <p className="text-2xl font-extrabold text-white">${employee.monthly_income.toLocaleString()}</p>
          <span className="text-[11px] text-amber-400 font-bold block">Base Salary</span>
        </div>
      </div>

      {/* Competency Radar & Key Factors Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Section */}
        <div className="lg:col-span-6 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Competency & Work Profile
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Multi-dimensional rating across key performance vectors
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name={employee.name} dataKey="A" stroke="#d97706" fill="#f59e0b" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance / Performance Factors Section */}
        <div className="lg:col-span-6 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Performance Factors & Drivers
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Primary metrics influencing AI classification for this employee
              </p>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-4 mt-6">
            {individualFactors.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{item.factor}</span>
                  <span className="text-[11px] font-semibold text-amber-700">{item.value}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 block">{item.impact}% weight</span>
                  <div className="w-24 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.impact * 2.5}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
