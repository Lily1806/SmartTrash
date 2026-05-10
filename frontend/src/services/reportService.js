import api from './api'

export const reportService = {
  getStats:  ()         => api.get('/reports/stats'),
  getDaily:  (days=7)   => api.get(`/reports/daily?days=${days}`),
}
