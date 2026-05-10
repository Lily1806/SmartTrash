import { useState } from 'react'
import { classifyService } from '../services/classifyService'

export function useClassify() {
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const classify = async (file) => {
    setLoading(true)
    setError(null)
    try {
      const res = await classifyService.classify(file)
      setResult(res.data)
    } catch (e) {
      setError('Không thể phân loại ảnh. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return { classify, result, loading, error }
}
