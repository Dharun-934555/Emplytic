import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  BarChart2
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import KPICard from '../components/KPICard';
import { api } from '../services/api';

export default function Dashboard({ setCurrentTab, setSelectedEmployeeId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardData();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Analyzing Workforce Machine Learning Data...
        </p>
      </div>
    );
  }

  const perfDistribution = data?.performance_distribution || [];
  const deptPerformance = data?.department_performance || [];
  const perfTrend = data?.performance_trend || [];
  const topFactors = data?.top_performance_factors || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI HR Predictive Platform</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-sans">
            Welcome back 👋
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Here's your employee performance overview powered by active machine learning classification models.
          </p>
        </div>

        <div className="mt-6 md:mt-0 flex items-center space-x-3 relative z-10">
          <button
            onClick={() => setCurrentTab('prediction')}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Run ML Prediction</span>
          </button>
          <button
            onClick={() => setCurrentTab('employees')}
            className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center space-x-2 border border-slate-700 transition-all"
          >
            <span>View All Staff</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Total Employees"
          value={data?.total_employees || 0}
          trend="up"
          trendText="+4.2% MoM"
          icon={Users}
          colorTheme="default"
        />
        <KPICard
          title="High Performers"
          value={data?.high_performers || 0}
          percentage={data?.high_percentage}
          trend="up"
          trendText="Top Tier"
          icon={Award}
          colorTheme="gold"
        />
        <KPICard
          title="Medium Performers"
          value={data?.medium_performers || 0}
          percentage={data?.medium_percentage}
          trend="neutral"
          trendText="Stable"
          icon={TrendingUp}
          colorTheme="default"
        />
        <KPICard
          title="Low Performers"
          value={data?.low_performers || 0}
          percentage={data?.low_percentage}
          trend="down"
          trendText="Action Req."
          icon={AlertTriangle}
          colorTheme="dark"
        />
      </div>

      {/* Grid: Employee Performance Distribution & Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Performance Distribution Donut Chart */}
        <div className="lg:col-span-5 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Performance Distribution
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Workforce division across ML classified groups
              </p>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>

          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={perfDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {perfDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [`${value} employees`, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center stat in donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-slate-900">
                {data?.total_employees || 0}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Staff Total
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
            {perfDistribution.map((item) => (
              <div key={item.name} className="text-center p-2 rounded-2xl bg-slate-50">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-[10px] font-bold text-slate-500 truncate">{item.name.replace(' Performance', '')}</span>
                </div>
                <span className="text-sm font-extrabold text-slate-900">{item.value}</span>
                <span className="block text-[10px] text-slate-400 font-semibold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Department Performance Bar Chart */}
        <div className="lg:col-span-7 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Department Performance Breakdown
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Distribution of performance tiers across organizational units
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformance} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                <Bar dataKey="High" fill="#10b981" radius={[6, 6, 0, 0]} name="High Performance" />
                <Bar dataKey="Medium" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Medium Performance" />
                <Bar dataKey="Low" fill="#ef4444" radius={[6, 6, 0, 0]} name="Low Performance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Performance Trend & Top Performance Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3. Performance Trend Line Chart */}
        <div className="lg:col-span-7 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Performance & Engagement Trend
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Workforce satisfaction and high performer ratio over tenure years
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={perfTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="tenure" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="high_performance_pct" name="High Performer %" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="avg_engagement" name="Avg Engagement (1-10)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Top Performance Factors Horizontal Bar Chart */}
        <div className="lg:col-span-5 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Top Performance Drivers
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Feature importance extracted dynamically from Random Forest classifier
              </p>
            </div>
          </div>

          <div className="space-y-3.5 mt-4">
            {topFactors.map((factor, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{factor.feature || factor.factor}</span>
                  <span className="text-amber-700 font-extrabold">{factor.importance}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (factor.importance || factor.impact) * 2.5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
