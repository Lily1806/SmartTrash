import api from './api'

export const reportService = {
  getStats:   () => api.get('/reports/stats'),
  getSummary: () => api.get('/reports/summary'),
}
