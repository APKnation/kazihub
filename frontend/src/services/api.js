import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request automatically (except auth endpoints)
api.interceptors.request.use((config) => {
  const isAuthRoute = config.url?.startsWith('/auth/');
  if (!isAuthRoute) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

// ── Jobs ──────────────────────────────────────────────
export const jobsAPI = {
  getAll: () => api.get('/jobs'),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  apply: (jobId, data) => api.post(`/jobs/${jobId}/apply`, data || {}),
  getMyApplications: () => api.get('/jobs/my-applications'),
  getPostedJobs: () => api.get('/jobs/posted'),
  getApplicationsForJob: (jobId) => api.get(`/jobs/${jobId}/applications`),
  updateApplicationStatus: (appId, status) => api.put(`/jobs/applications/${appId}/status?status=${status}`),
};

// ── Profile ───────────────────────────────────────────
export const profileAPI = {
  getJobSeekerProfile: () => api.get('/profiles/job-seeker/me'),
  updateJobSeekerProfile: (data) => api.put('/profiles/job-seeker/me', data),
  getEmployerProfile: () => api.get('/profiles/employer'),
  updateEmployerProfile: (data) => api.put('/profiles/employer', data),
};

// ── Skills ────────────────────────────────────────────
export const skillsAPI = {
  getAll: () => api.get('/skills'),
  addToProfile: (skillId) => api.post(`/skills/${skillId}/add`),
  removeFromProfile: (skillId) => api.delete(`/skills/${skillId}/remove`),
};

// ── Locations ─────────────────────────────────────────
export const locationAPI = {
  getRegions: () => api.get('/locations/regions'),
  getDistricts: (regionId) => api.get('/locations/districts', { params: { regionId } }),
  getWards: (districtId) => api.get('/locations/wards', { params: { districtId } }),
};

export default api;
