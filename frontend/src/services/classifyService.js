import api from './api'

export const classifyService = {
  // Gửi ảnh lên server, nhận kết quả AI
  classify: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/classifications/', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getHistory: () => api.get('/classifications/'),
}
