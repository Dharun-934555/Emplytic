const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('emplytic_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { detail: response.statusText || 'Unable to connect to the server.' };
    }

    let errorMsg = 'An unexpected API error occurred';
    if (typeof errorData.detail === 'string') {
      errorMsg = errorData.detail;
    } else if (Array.isArray(errorData.detail)) {
      errorMsg = errorData.detail.map(item => item.msg || 'Invalid input').join(', ');
    } else if (typeof errorData.message === 'string') {
      errorMsg = errorData.message;
    } else if (typeof errorData === 'string') {
      errorMsg = errorData;
    }

    const err = new Error(errorMsg);
    err.response = { data: errorData, status: response.status };
    throw err;
  }
  return response.json();
}

export function getErrorMessage(error) {
  if (!error) return 'An unexpected error occurred.';
  if (typeof error === 'string') return error;

  const data = error.response?.data || error.data;

  if (data) {
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail.map(item => item.msg || 'Invalid input').join(', ');
    }
    if (typeof data.message === 'string') return data.message;
    if (typeof data === 'string') return data;
  }

  if (error.message && typeof error.message === 'string') {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Load failed')) {
      return 'Unable to connect to the server.';
    }
    return error.message;
  }

  return 'Registration failed. Please try again.';
}

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(res);
    if (data.access_token) {
      localStorage.setItem('emplytic_token', data.access_token);
      localStorage.setItem('emplytic_user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  logout: () => {
    fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: { ...getAuthHeader() } }).catch(() => {});
    localStorage.removeItem('emplytic_token');
    localStorage.removeItem('emplytic_user');
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  markNotificationRead: async (id) => {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  markAllNotificationsRead: async () => {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Dashboard & Analytics
  getDashboardData: async () => {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  getAnalytics: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/analytics?${query}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  getInsights: async () => {
    const res = await fetch(`${API_BASE}/insights`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Employees
  getEmployees: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/employees?${query}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  getEmployeeById: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  createEmployee: async (data) => {
    const res = await fetch(`${API_BASE}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  updateEmployee: async (id, data) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  deleteEmployee: async (id) => {
    const res = await fetch(`${API_BASE}/employees/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Machine Learning
  predictPerformance: async (inputData) => {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(inputData)
    });
    return handleResponse(res);
  },

  getModelInfo: async () => {
    const res = await fetch(`${API_BASE}/model/info`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  trainModel: async () => {
    const res = await fetch(`${API_BASE}/model/train`, {
      method: 'POST',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  uploadDataset: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/model/dataset`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    return handleResponse(res);
  },

  // Reports
  downloadReport: (reportType) => {
    window.open(`${API_BASE}/reports/download/${reportType}`, '_blank');
  },

  generateCustomReport: async (payload) => {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload)
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(payload.title || 'Custom_HR_Report').replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};
