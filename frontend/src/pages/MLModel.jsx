import React, { useState, useEffect } from 'react';
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  Award,
  UploadCloud,
  Layers,
  Sparkles,
  Check,
  TrendingUp,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';

export default function MLModel() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);

  // Dataset upload states
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    setLoading(true);
    try {
      const res = await api.getModelInfo();
      setModelInfo(res);
    } catch (err) {
      console.error('Failed to load model info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setTraining(true);
    try {
      const res = await api.trainModel();
      setModelInfo(res);
    } catch (err) {
      alert(`Retraining failed: ${err.message}`);
    } finally {
      setTraining(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const res = await api.uploadDataset(file);
      setPreview(res);
    } catch (err) {
      alert(`CSV Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Evaluating Trained Scikit-Learn Classifiers...
        </p>
      </div>
    );
  }

  const models = modelInfo?.models || [];
  const activeModel = models.find((m) => m.is_active) || models[0];
  const featureImportances = modelInfo?.feature_importances || [];

  const chartData = models.map((m) => ({
    name: m.model_name,
    Accuracy: Math.round(m.accuracy * 1000) / 10,
    Precision: Math.round(m.precision * 1000) / 10,
    Recall: Math.round(m.recall * 1000) / 10,
    F1: Math.round(m.f1_score * 1000) / 10
  }));

  const cm = activeModel?.confusion_matrix || [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];

  const labels = ['High Perf', 'Med Perf', 'Low Perf'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Machine Learning Pipeline</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            ML Model Training & Evaluation
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Train, evaluate, and manage Scikit-learn workforce classification models dynamically.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={training}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-md transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${training ? 'animate-spin' : ''}`} />
          <span>{training ? 'Training Models...' : 'Train Model Now'}</span>
        </button>
      </div>

      {/* Dataset Info & Preprocessing Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dataset Size</span>
          <p className="text-2xl font-extrabold text-slate-900">{modelInfo?.dataset_size || 0}</p>
          <span className="text-[11px] text-slate-500 font-medium">Historical Records</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Training Subset</span>
          <p className="text-2xl font-extrabold text-slate-900">{modelInfo?.training_samples || 0}</p>
          <span className="text-[11px] text-slate-500 font-medium">80% Train Split</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Testing Subset</span>
          <p className="text-2xl font-extrabold text-slate-900">{modelInfo?.testing_samples || 0}</p>
          <span className="text-[11px] text-slate-500 font-medium">20% Evaluation Split</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-soft">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Selected Model</span>
          <p className="text-xl font-extrabold text-amber-400">{modelInfo?.best_model || 'Random Forest'}</p>
          <span className="text-[11px] text-slate-300 font-medium">Saved via Joblib</span>
        </div>
      </div>

      {/* Dataset Upload Section */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-amber-600" />
            <span>Historical Dataset Upload & Preview</span>
          </h3>
          <span className="text-xs font-medium text-slate-500">Target: performance_group</span>
        </div>
        <p className="text-xs text-slate-500">
          The dataset contains historical employee records used to clean, preprocess, and train classification models.
        </p>

        <form onSubmit={handleUpload} className="flex items-center space-x-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
          />
          <button
            type="submit"
            disabled={!file || uploading}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload & Analyze CSV'}
          </button>
        </form>

        {preview && (
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex space-x-4 text-xs font-bold text-slate-700">
              <span>Rows: {preview.total_rows}</span>
              <span>Cols: {preview.total_columns}</span>
              <span>Missing: {preview.missing_values}</span>
              <span>Duplicates: {preview.duplicate_records}</span>
            </div>
            <div className="overflow-x-auto max-h-48 border border-slate-100 rounded-xl">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-slate-50 font-bold uppercase text-slate-400">
                  <tr>
                    {Object.keys(preview.preview_data[0] || {}).map((k) => (
                      <th key={k} className="p-2">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {preview.preview_data.slice(0, 5).map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="p-2 max-w-[120px] truncate">{String(v)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Model Comparison Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-soft p-7 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Model Evaluation Comparison Table
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-6">Model</th>
                <th className="py-3.5 px-6">Accuracy</th>
                <th className="py-3.5 px-6">Precision</th>
                <th className="py-3.5 px-6">Recall</th>
                <th className="py-3.5 px-6">F1 Score</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {models.map((m, idx) => (
                <tr key={idx} className={m.is_active ? 'bg-amber-50/40' : ''}>
                  <td className="py-4 px-6 font-bold text-slate-900">{m.model_name}</td>
                  <td className="py-4 px-6 text-amber-700 font-extrabold">{(m.accuracy * 100).toFixed(2)}%</td>
                  <td className="py-4 px-6 text-slate-700">{(m.precision * 100).toFixed(2)}%</td>
                  <td className="py-4 px-6 text-slate-700">{(m.recall * 100).toFixed(2)}%</td>
                  <td className="py-4 px-6 text-slate-900 font-bold">{(m.f1_score * 100).toFixed(2)}%</td>
                  <td className="py-4 px-6 text-right">
                    {m.is_active ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950">
                        <Check className="w-3 h-3 mr-1 stroke-[3]" /> Active Pipeline
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">Candidate</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparative Charts */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Metrics Visual Comparison (%)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Accuracy" fill="#d97706" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Precision" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Recall" fill="#6366f1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="F1" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confusion Matrix & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-base font-bold text-slate-900 mb-2">Confusion Matrix ({activeModel?.model_name})</h3>
          <p className="text-xs text-slate-500 mb-4">Evaluation grid across target classes</p>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-extrabold uppercase text-slate-400">
              <div>Actual \ Pred</div>
              <div>High</div>
              <div>Med</div>
              <div>Low</div>
            </div>
            {cm.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-4 gap-2 text-center items-center">
                <div className="text-xs font-bold text-slate-700 text-left">{labels[rIdx]}</div>
                {row.map((val, cIdx) => (
                  <div
                    key={cIdx}
                    className={`py-3.5 rounded-2xl font-mono text-sm font-extrabold ${
                      rIdx === cIdx ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <h3 className="text-base font-bold text-slate-900 mb-2">Feature Importance Ranking</h3>
          <p className="text-xs text-slate-500 mb-4">Features influencing Random Forest decision trees</p>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {featureImportances.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-800">{item.feature}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.importance * 2.5}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-amber-700 w-12 text-right">{item.importance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
