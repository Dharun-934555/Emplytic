import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Filter,
  RotateCcw,
  Layers,
  PieChart as PieIcon,
  TrendingUp,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../services/api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dept, setDept] = useState('All');
  const [role, setRole] = useState('All');
  const [group, setGroup] = useState('All');

  useEffect(() => {
    fetchAnalytics();
  }, [dept, role, group]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics({
        department: dept,
        job_role: role,
        performance_group: group
      });
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Filtering Interactive HR Analytics Datasets...
        </p>
      </div>
    );
  }

  const deptData = data?.department_vs_performance || [];
  const roleData = data?.role_vs_performance || [];
  const expData = data?.experience_vs_performance || [];
  const trainingData = data?.training_vs_performance || [];
  const attendanceData = data?.attendance_vs_performance || [];
  const satisfactionData = data?.satisfaction_vs_performance || [];
  const incomeData = data?.income_vs_performance || [];
  const overtimeData = data?.overtime_vs_performance || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive HR Dashboard</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Workforce Performance Analytics
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Multi-dimensional cross-tabulations and metric distributions.
          </p>
        </div>

        {/* Global Analytics Filters */}
        <div className="flex flex-wrap items-center gap-3 p-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-1.5 px-3 text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-700">Filters:</span>
          </div>

          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>

          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
          >
            <option value="All">All Performance Tiers</option>
            <option value="High Performance">High Performance</option>
            <option value="Medium Performance">Medium Performance</option>
            <option value="Low Performance">Low Performance</option>
          </select>

          <button
            onClick={() => { setDept('All'); setRole('All'); setGroup('All'); }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of 8 Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Department vs Performance */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Department vs Performance</h3>
          <p className="text-[11px] text-slate-500 mb-4">Distribution across organizational departments</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Job Role vs Performance */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Job Role Breakdown</h3>
          <p className="text-[11px] text-slate-500 mb-4">Performance distribution per position title</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData.slice(0, 7)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="role" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Experience vs Performance */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Experience (Tenure) vs Performance</h3>
          <p className="text-[11px] text-slate-500 mb-4">Tenure brackets and performance class frequency</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="experience" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Training Hours vs Performance */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Training Hours vs Performance</h3>
          <p className="text-[11px] text-slate-500 mb-4">Impact of professional development hours</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="training" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Attendance vs Performance */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Attendance Rate vs Performance</h3>
          <p className="text-[11px] text-slate-500 mb-4">Workplace presence and reliability tiers</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="attendance" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Job Satisfaction vs Performance */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Job Satisfaction vs Performance</h3>
          <p className="text-[11px] text-slate-500 mb-4">Self-reported satisfaction levels (1 to 5)</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="rating" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Income vs Performance */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Monthly Income Brackets vs Performance</h3>
          <p className="text-[11px] text-slate-500 mb-4">Compensation band correlation</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="income" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 8. Overtime vs Performance */}
        <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Overtime Hours vs Performance</h3>
          <p className="text-[11px] text-slate-500 mb-4">Overtime workload impact</p>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overtimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="overtime" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Low" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
