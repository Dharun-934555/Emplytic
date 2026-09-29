import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Star,
  Edit3,
  X,
  AlertCircle,
  Trash2
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
import { api, getErrorMessage } from '../services/api';

export default function EmployeeDetails({ employeeId, onBack, setCurrentTab }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editForm, setEditForm] = useState({});

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
      setEditForm(res);
    } catch (err) {
      console.error('Failed to load employee details:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({ ...employee });
    setEditError('');
    setSuccessMessage('');
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setEditError('');
    setSuccessMessage('');
    setSaving(true);

    try {
      const updated = await api.updateEmployee(employee.employee_id, editForm);
      setEmployee(updated);
      setSuccessMessage(`Employee ${updated.name} updated successfully! Re-classified as ${updated.performance_group}.`);
      setTimeout(() => {
        setShowEditModal(false);
        setSuccessMessage('');
      }, 1400);
    } catch (err) {
      setEditError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (window.confirm(`Are you sure you want to remove employee ${employee.name} (${employee.employee_id})?`)) {
      try {
        await api.deleteEmployee(employee.employee_id);
        onBack();
      } catch (err) {
        alert(getErrorMessage(err));
      }
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

          <div className="flex items-center space-x-3">
            {getBadge(employee.performance_group)}
            <button
              onClick={openEditModal}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-md transition-all hover:scale-105 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 stroke-[2.5]" />
              <span>Edit Employee</span>
            </button>
            <button
              onClick={handleDeleteEmployee}
              className="px-4 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs tracking-wider uppercase flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer"
              title="Remove employee record"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Remove</span>
            </button>
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

      {/* Edit Employee Modal */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-auto max-h-[90vh] flex flex-col z-[10000]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 font-sans">Edit Employee Record</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Update staff metrics for <span className="font-bold text-slate-800">{employee.employee_id}</span> (AI re-classifies tier automatically)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2 flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Scrollable Form Body */}
            <form onSubmit={handleUpdateEmployee} className="space-y-4 text-xs overflow-y-auto pr-1.5 flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="75"
                    value={editForm.age || 18}
                    onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) || 18 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={editForm.gender || 'Female'}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department *</label>
                  <select
                    value={editForm.department || 'Engineering'}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                {/* Job Role */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Role *</label>
                  <input
                    type="text"
                    required
                    value={editForm.job_role || ''}
                    onChange={(e) => setEditForm({ ...editForm, job_role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Monthly Income */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Income ($) *</label>
                  <input
                    type="number"
                    required
                    value={editForm.monthly_income || 0}
                    onChange={(e) => setEditForm({ ...editForm, monthly_income: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Years at Company */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Years at Company *</label>
                  <input
                    type="number"
                    required
                    value={editForm.years_at_company || 0}
                    onChange={(e) => setEditForm({ ...editForm, years_at_company: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Years in Current Role */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Years in Current Role *</label>
                  <input
                    type="number"
                    required
                    value={editForm.years_in_current_role || 0}
                    onChange={(e) => setEditForm({ ...editForm, years_in_current_role: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Job Satisfaction */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Job Satisfaction (1-5) *</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editForm.job_satisfaction || 1}
                    onChange={(e) => setEditForm({ ...editForm, job_satisfaction: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Attendance Rate */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Attendance Rate (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editForm.attendance_rate || 0}
                    onChange={(e) => setEditForm({ ...editForm, attendance_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Training Hours */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Training Hours *</label>
                  <input
                    type="number"
                    value={editForm.training_hours || 0}
                    onChange={(e) => setEditForm({ ...editForm, training_hours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Projects Completed */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Projects Completed *</label>
                  <input
                    type="number"
                    value={editForm.projects_completed || 0}
                    onChange={(e) => setEditForm({ ...editForm, projects_completed: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Performance Group Override */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Performance Tier</label>
                  <select
                    value={editForm.performance_group || 'High Performance'}
                    onChange={(e) => setEditForm({ ...editForm, performance_group: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="High Performance">High Performance</option>
                    <option value="Medium Performance">Medium Performance</option>
                    <option value="Low Performance">Low Performance</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 flex-shrink-0 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold uppercase tracking-wider shadow-md transition-all hover:scale-105"
                >
                  {saving ? 'Updating Employee...' : 'Save & Re-Classify'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
