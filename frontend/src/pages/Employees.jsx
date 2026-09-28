import React, { useState, useEffect } from 'react';
import {
  Search,
  UserPlus,
  ChevronRight,
  X,
  Building2,
  Briefcase,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { api, getErrorMessage } from '../services/api';

export default function Employees({ onSelectEmployee, setCurrentTab }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New employee form state
  const defaultForm = {
    employee_id: '',
    name: '',
    age: 30,
    gender: 'Female',
    department: 'Engineering',
    job_role: 'Software Engineer',
    years_at_company: 3,
    years_in_current_role: 2,
    monthly_income: 8500,
    job_level: 2,
    job_satisfaction: 4,
    environment_satisfaction: 4,
    work_life_balance: 3,
    training_hours: 45,
    projects_completed: 12,
    attendance_rate: 96.5,
    overtime_hours: 6,
    previous_experience: 3,
    promotion_last_5_years: 0,
    employee_engagement: 8.0,
    absenteeism: 2
  };

  const [formData, setFormData] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [search, selectedDept, selectedGroup, selectedRole]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedGroup !== 'All') params.performance_group = selectedGroup;
      if (selectedRole !== 'All') params.job_role = selectedRole;

      const res = await api.getEmployees(params);
      setEmployees(res);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setModalError('');
    setSuccessMessage('');

    if (!formData.name || !formData.name.trim()) {
      setModalError('Please enter the employee full name.');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.employee_id || !payload.employee_id.trim()) {
        delete payload.employee_id;
      }
      
      const created = await api.createEmployee(payload);
      setSuccessMessage(`Employee ${created.name} (${created.employee_id}) created successfully! Classified as ${created.performance_group}.`);
      setFormData(defaultForm);
      fetchEmployees();
      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage('');
      }, 1500);
    } catch (err) {
      setModalError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const getPerformanceBadge = (group) => {
    if (group === 'High Performance') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
          High Performance
        </span>
      );
    }
    if (group === 'Medium Performance') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          Medium Performance
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
        Low Performance
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Employees
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Manage organization staff and inspect AI performance evaluations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setModalError('');
              setSuccessMessage('');
              setShowAddModal(true);
            }}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Employee</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee name or ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Dept Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          {/* Performance Group Filter */}
          <div>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="All">All Performance Tiers</option>
              <option value="High Performance">High Performance</option>
              <option value="Medium Performance">Medium Performance</option>
              <option value="Low Performance">Low Performance</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                setSearch('');
                setSelectedDept('All');
                setSelectedGroup('All');
                setSelectedRole('All');
              }}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading employees...</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No employees found matching filter criteria.</p>
            <p className="text-xs text-slate-400">Try adjusting your search query or filter selection.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">ID & Name</th>
                  <th className="py-4 px-6">Department & Role</th>
                  <th className="py-4 px-6">Tenure & Exp</th>
                  <th className="py-4 px-6">Performance Tier</th>
                  <th className="py-4 px-6 text-center">Satisfaction</th>
                  <th className="py-4 px-6 text-center">Attendance</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp.employee_id)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block group-hover:text-amber-700 transition-colors">
                            {emp.name}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {emp.employee_id}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800 block">{emp.department}</span>
                      <span className="text-[11px] text-slate-500">{emp.job_role}</span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-medium text-slate-700 block">{emp.years_at_company} yrs company</span>
                      <span className="text-[11px] text-slate-400">{emp.previous_experience} yrs prior</span>
                    </td>

                    <td className="py-4 px-6">
                      {getPerformanceBadge(emp.performance_group)}
                    </td>

                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-700">
                        <span>⭐</span>
                        <span>{emp.job_satisfaction}/5</span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="font-bold text-slate-800">{emp.attendance_rate}%</span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEmployee(emp.employee_id);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-amber-700 hover:bg-amber-100/60 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Employee Modal with High Z-Index & Clean Styling */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8 max-h-[85vh] overflow-y-auto animate-fade-in z-[201]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Add New Employee</h3>
                <p className="text-xs text-slate-500">Fill in staff information for PostgreSQL storage & AI performance classification</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleAddEmployee} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Employee ID */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employee ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    placeholder="Auto-generated if blank (e.g. EMP-1653)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rachel Adams"
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
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
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
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                    value={formData.job_role}
                    onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Monthly Income */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Income ($) *</label>
                  <input
                    type="number"
                    required
                    value={formData.monthly_income}
                    onChange={(e) => setFormData({ ...formData, monthly_income: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Years at Company */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Years at Company *</label>
                  <input
                    type="number"
                    required
                    value={formData.years_at_company}
                    onChange={(e) => setFormData({ ...formData, years_at_company: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Years in Current Role */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Years in Current Role *</label>
                  <input
                    type="number"
                    required
                    value={formData.years_in_current_role}
                    onChange={(e) => setFormData({ ...formData, years_in_current_role: parseInt(e.target.value) || 0 })}
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
                    value={formData.job_satisfaction}
                    onChange={(e) => setFormData({ ...formData, job_satisfaction: parseInt(e.target.value) || 1 })}
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
                    value={formData.attendance_rate}
                    onChange={(e) => setFormData({ ...formData, attendance_rate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {/* Training Hours */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Training Hours *</label>
                  <input
                    type="number"
                    value={formData.training_hours}
                    onChange={(e) => setFormData({ ...formData, training_hours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold uppercase tracking-wider shadow-md transition-all hover:scale-105"
                >
                  {saving ? 'Saving Employee...' : 'Save & Classify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
