import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected network error occurred.';
    if (error.response) {
      const data = error.response.data;
      if (data && data.validationErrors) {
        message = data.validationErrors.join('\n');
      } else if (data && data.error) {
        message = data.message ? `${data.error}: ${data.message}` : data.error;
      } else if (data && data.message) {
        message = data.message;
      }
    } else if (error.request) {
      message = 'Could not connect to the SmartCrop AI backend server. Please verify the backend is running.';
    }
    return Promise.reject(new Error(message));
  }
);

export async function checkBackendHealth() {
  const res = await apiClient.get('/health');
  return res.data;
}

export async function getSupportedCrops() {
  const res = await apiClient.get('/crops');
  return res.data;
}

export async function getRecommendations(inputProfile) {
  const res = await apiClient.post('/recommendations', inputProfile);
  return res.data;
}

export async function getRecommendationHistory(page = 1, limit = 20) {
  const res = await apiClient.get(`/recommendations?page=${page}&limit=${limit}`);
  return res.data;
}

export async function getRecommendationRecord(id) {
  const res = await apiClient.get(`/recommendations/${id}`);
  return res.data;
}

export async function deleteRecommendationRecord(id) {
  const res = await apiClient.delete(`/recommendations/${id}`);
  return res.data;
}

export async function compareCropsApi(cropIds, inputProfile) {
  const res = await apiClient.post('/recommendations/compare', {
    cropIds,
    inputProfile
  });
  return res.data;
}
