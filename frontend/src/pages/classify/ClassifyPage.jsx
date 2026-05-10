import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { classifyService } from '../../services/classifyService'

const CATEGORIES = {
  ORGANIC:   { label: 'Rác hữu cơ',  color: '#16a34a', bg: '#f0fdf4', emoji: '🌿' },
  PLASTIC:   { label: 'Nhựa',         color: '#2563eb', bg: '#eff6ff', emoji: '♻️' },
  PAPER:     { label: 'Giấy/Bìa',    color: '#d97706', bg: '#fffbeb', emoji: '📄' },
  METAL:     { label: 'Kim loại',     color: '#6b7280', bg: '#f9fafb', emoji: '🔩' },
  GLASS:     { label: 'Thủy tinh',   color: '#0891b2', bg: '#ecfeff', emoji: '🫙' },
  HAZARDOUS: { label: 'Rác nguy hại',color: '#dc2626', bg: '#fef2f2', emoji: '⚠️' },
}

const TIPS = {
  ORGANIC:   'Bỏ vào thùng xanh lá. Có thể làm phân compost tại nhà.',
  PLASTIC:   'Rửa sạch trước khi bỏ thùng tái chế xanh dương.',
  PAPER:     'Giữ khô ráo, bỏ thùng tái chế. Có thể bán ve chai.',
  METAL:     'Dẹp lon để tiết kiệm không gian. Bán ve chai được giá.',
  GLASS:     'Bọc kỹ tránh vỡ. Đem đến điểm thu gom thủy tinh.',
  HAZARDOUS: '⚠️ KHÔNG vứt chung rác thường! Đem đến điểm thu gom rác nguy hại.',
}

function Step({ num, label, status }) {
  const isActive = status === 'active'
  const isDone   = status === 'done'
  return (
    <div style={{display:'flex',alignItems:'center',gap:6}}>
      <div style={{
        width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',
        justifyContent:'center',fontSize:12,fontWeight:700,
        background: isDone ? '#16a34a' : isActive ? '#16a34a' : '#f3f4f6',
        color: isDone||isActive ? '#fff' : '#9ca3af'
      }}>
        {isDone ? '✓' : num}
      </div>
      <span style={{fontSize:13,fontWeight:500,color:isDone||isActive?'#16a34a':'#9ca3af'}}>{label}</span>
    </div>
  )
}

function StepLine() {
  return <div style={{flex:1,height:1,background:'#e5e7eb',margin:'0 8px'}}/>
}

export default function ClassifyPage() {
  const [preview, setPreview]   = useState(null)
  const [file, setFile]         = useState(null)
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [saved, setSaved]       = useState(false)
  const inputRef = useRef()

  const step = !preview ? 1 : loading ? 2 : result ? 3 : 2

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    setResult(null)
    setError(null)
    setSaved(false)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleClassify = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const res = await classifyService.classify(file)
      setResult(res.data)
    } catch {
      setError('Không thể phân loại. Vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaved(true)
  }

  const handleReset = () => {
    setPreview(null)
    setFile(null)
    setResult(null)
    setError(null)
    setSaved(false)
  }

  const cat = result ? CATEGORIES[result.category] : null
  const tip = result ? TIPS[result.category] : null
  const conf = result ? Math.round(result.confidence * 100) : 0

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:16,fontWeight:700,color:'#16a34a'}}>
          <div style={{width:32,height:32,background:'#16a34a',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
            </svg>
          </div>
          SmartTrash
        </div>
        <Link to="/" style={{fontSize:13,color:'#6b7280',textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
          ← Về Dashboard
        </Link>
      </nav>

      <div style={{maxWidth:640,margin:'0 auto',padding:'32px 24px'}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#111',marginBottom:4}}>Phân loại rác bằng AI</h2>
        <p style={{fontSize:14,color:'#6b7280',marginBottom:24}}>Tải ảnh rác lên để AI nhận diện và hướng dẫn xử lý đúng cách</p>

        <div style={{display:'flex',alignItems:'center',marginBottom:28}}>
          <Step num={1} label="Tải ảnh" status={step>1?'done':step===1?'active':'inactive'} />
          <StepLine/>
          <Step num={2} label="AI phân tích" status={step>2?'done':step===2?'active':'inactive'} />
          <StepLine/>
          <Step num={3} label="Kết quả" status={step===3?'active':'inactive'} />
        </div>

        {!preview ? (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current.click()}
            style={{
              border:'2px dashed #86efac',borderRadius:16,background:'#f0fdf4',
              padding:'52px 24px',textAlign:'center',cursor:'pointer',
              transition:'border-color .2s,background .2s'
            }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#16a34a';e.currentTarget.style.background='#dcfce7'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='#86efac';e.currentTarget.style.background='#f0fdf4'}}
          >
            <div style={{width:60,height:60,background:'#16a34a',borderRadius:16,margin:'0 auto 16px',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p style={{fontSize:16,fontWeight:600,color:'#15803d',marginBottom:6}}>Kéo thả ảnh vào đây</p>
            <p style={{fontSize:13,color:'#6b7280',marginBottom:16}}>hoặc click để chọn từ máy tính</p>
            <div style={{display:'inline-block',padding:'9px 22px',background:'#16a34a',color:'#fff',borderRadius:10,fontSize:13,fontWeight:600}}>
              Chọn ảnh
            </div>
            <p style={{fontSize:12,color:'#9ca3af',marginTop:12}}>Hỗ trợ JPG, PNG, WEBP — tối đa 10MB</p>
            <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}}
              onChange={e => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,overflow:'hidden'}}>
            <div style={{position:'relative'}}>
              <img src={preview} alt="preview"
                style={{width:'100%',maxHeight:280,objectFit:'contain',background:'#f9fafb',display:'block'}} />
              <button onClick={handleReset}
                style={{position:'absolute',top:10,right:10,width:32,height:32,borderRadius:'50%',background:'rgba(0,0,0,0.5)',border:'none',color:'#fff',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>
                ✕
              </button>
            </div>

            <div style={{padding:20}}>
              {error && (
                <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'10px 14px',marginBottom:14,color:'#dc2626',fontSize:13}}>
                  {error}
                </div>
              )}

              {!result && !loading && (
                <button onClick={handleClassify}
                  style={{width:'100%',padding:'13px',background:'#16a34a',color:'#fff',border:'none',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer'}}>
                  🔍 Phân loại ngay
                </button>
              )}

              {loading && (
                <div style={{textAlign:'center',padding:'16px 0'}}>
                  <div style={{fontSize:32,marginBottom:8}}>🤖</div>
                  <p style={{fontSize:15,fontWeight:600,color:'#16a34a',marginBottom:4}}>AI đang phân tích...</p>
                  <p style={{fontSize:13,color:'#9ca3af'}}>Vui lòng chờ trong giây lát</p>
                </div>
              )}

              {result && cat && (
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:16,padding:'16px',background:cat.bg,borderRadius:12}}>
                    <div style={{fontSize:40}}>{cat.emoji}</div>
                    <div>
                      <p style={{fontSize:20,fontWeight:700,color:cat.color}}>{cat.label}</p>
                      <p style={{fontSize:13,color:'#6b7280',marginTop:2}}>Độ chính xác: {conf}%</p>
                    </div>
                  </div>

                  <div style={{marginBottom:16}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#6b7280',marginBottom:6}}>
                      <span>Độ tự tin của AI</span><span>{conf}%</span>
                    </div>
                    <div style={{height:8,background:'#e5e7eb',borderRadius:99}}>
                      <div style={{height:8,background:cat.color,borderRadius:99,width:`${conf}%`,transition:'width 1s ease'}}/>
                    </div>
                  </div>

                  <div style={{background:'#f0fdf4',borderRadius:10,padding:'12px 14px',marginBottom:16}}>
                    <p style={{fontSize:12,fontWeight:600,color:'#15803d',marginBottom:4}}>💡 Hướng dẫn xử lý</p>
                    <p style={{fontSize:13,color:'#374151',lineHeight:1.6}}>{tip}</p>
                  </div>

                  {saved ? (
                    <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:10,padding:'11px',textAlign:'center',color:'#16a34a',fontWeight:600,fontSize:14}}>
                      ✅ Đã lưu vào lịch sử!
                    </div>
                  ) : (
                    <div style={{display:'flex',gap:10}}>
                      <button onClick={handleSave}
                        style={{flex:1,padding:'12px',background:'#16a34a',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>
                        Lưu kết quả
                      </button>
                      <button onClick={handleReset}
                        style={{padding:'12px 16px',background:'#fff',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,color:'#374151',cursor:'pointer'}}>
                        Ảnh khác
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
