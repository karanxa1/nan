import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;

export const authAPI = {
  register: (data: { name: string; email: string; password: string; contact: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  resetPassword: (data: { email: string; contact: string; newPassword: string }) => api.post('/auth/reset-password', data),
};

export const firAPI = {
  create: (data: object) => api.post('/fir', data),
  getMy: () => api.get('/fir/my'),
  getAll: () => api.get('/fir/all'),
  getById: (id: number) => api.get(`/fir/${id}`),
  updateStatus: (id: number, status: string) => api.put(`/fir/${id}/status`, { status }),
  delete: (id: number) => api.delete(`/fir/${id}`),
};

export const legalAPI = {
  getAll: () => api.get('/legal'),
  search: (q: string) => api.get(`/legal/search?q=${encodeURIComponent(q)}`),
  getById: (id: number) => api.get(`/legal/${id}`),
  checkBail: (id: number) => api.get(`/legal/${id}/bail`),
  create: (data: object) => api.post('/legal', data),
  update: (id: number, data: object) => api.put(`/legal/${id}`, data),
  delete: (id: number) => api.delete(`/legal/${id}`),
};

export const caseAPI = {
  create: (data: object) => api.post('/case', data),
  getAll: () => api.get('/case/all'),
  getMy: () => api.get('/case/my'),
  getById: (id: number) => api.get(`/case/${id}`),
  update: (id: number, data: object) => api.put(`/case/${id}`, data),
  updateStatus: (id: number, status: string) => api.put(`/case/${id}/status`, { status }),
  addLog: (id: number, note: string) => api.post(`/case/${id}/log`, { note }),
};

export const docAPI = {
  upload: (caseId: number, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/document/upload/${caseId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getByCase: (caseId: number) => api.get(`/document/case/${caseId}`),
  download: (id: number) => api.get(`/document/download/${id}`, { responseType: 'blob' }),
  delete: (id: number) => api.delete(`/document/${id}`),
};

export const notifAPI = {
  getMy: () => api.get('/notification/my'),
  markRead: (id: number) => api.put(`/notification/${id}/read`),
  send: (userId: number, message: string) => api.post('/notification/send', { userId, message }),
  broadcast: (message: string) => api.post('/notification/broadcast', { message }),
};

export const reportAPI = {
  getSummary: () => api.get('/report/summary'),
  getFirStats: () => api.get('/report/fir-stats'),
  getUserActivity: () => api.get('/report/user-activity'),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
};
