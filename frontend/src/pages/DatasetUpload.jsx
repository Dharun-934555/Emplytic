import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Cpu,
  RefreshCw,
  Table,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function DatasetUpload({ setCurrentTab }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [training, setTraining] = useState(false);
  const [trainedResult, setTrainedResult] = useState(null);

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

  const handleTrainModel = async () => {
    setTraining(true);
    try {
      const res = await api.trainModel();
      setTrainedResult(res);
    } catch (err) {
      alert(`Model retraining failed: ${err.message}`);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 text-amber-400 text-xs font-bold mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Dataset & Retraining</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            HR Dataset Upload & Model Retraining
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Upload custom employee CSV datasets to retrain Scikit-learn Machine Learning pipelines.
          </p>
        </div>

        {preview && (
          <button
            onClick={handleTrainModel}
            disabled={training}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Cpu className={`w-4 h-4 ${training ? 'animate-spin' : ''}`} />
            <span>{training ? 'Training Machine Learning Models...' : 'Train Model Now'}</span>
          </button>
        )}
      </div>

      {/* CSV Upload Box */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-8 text-center bg-slate-50/50 transition-colors">
            <UploadCloud className="w-10 h-10 text-amber-600 mx-auto mb-3 stroke-[1.8]" />
            <p className="text-sm font-bold text-slate-800">
              Select or Drop CSV Dataset File Here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports standard employee performance CSV datasets with feature columns
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-4 block mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!file || uploading}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {uploading ? 'Processing File...' : 'Upload & Analyze CSV'}
            </button>
          </div>
        </form>
      </div>

      {/* Retrained Success Banner */}
      {trainedResult && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex items-center justify-between border border-slate-800 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                ML Pipeline Successfully Retrained!
              </h4>
              <p className="text-xs text-slate-400">
                Champion Model: <strong className="text-amber-400">{trainedResult.best_model}</strong> with {(trainedResult.models[0].accuracy * 100).toFixed(2)}% Test Accuracy.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('model')}
            className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
          >
            View Model Metrics
          </button>
        </div>
      )}

      {/* Dataset Statistics Preview */}
      {preview && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Rows</span>
              <p className="text-2xl font-extrabold text-slate-900">{preview.total_rows}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Columns</span>
              <p className="text-2xl font-extrabold text-slate-900">{preview.total_columns}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Missing Values</span>
              <p className="text-2xl font-extrabold text-amber-700">{preview.missing_values}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Duplicates</span>
              <p className="text-2xl font-extrabold text-slate-900">{preview.duplicate_records}</p>
            </div>
          </div>

          {/* Features Column Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Numerical Features ({preview.numerical_columns.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {preview.numerical_columns.map((col) => (
                  <span key={col} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-mono">
                    {col}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categorical Features ({preview.categorical_columns.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {preview.categorical_columns.map((col) => (
                  <span key={col} className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-mono">
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dataset Preview Grid */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              CSV Preview Grid (First 10 Rows)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-extrabold uppercase text-slate-400 border-b border-slate-200">
                    {Object.keys(preview.preview_data[0] || {}).map((k) => (
                      <th key={k} className="py-2.5 px-4 font-mono">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] font-medium text-slate-700">
                  {preview.preview_data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="py-2.5 px-4 max-w-[150px] truncate">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
