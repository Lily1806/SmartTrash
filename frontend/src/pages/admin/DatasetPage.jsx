import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

const LABELS = ["GLASS","METAL","PAPER","PLASTIC"]
const LABEL_VI = {
  PLASTIC:"Nhựa", PAPER:"Giấy/Bìa",
  METAL:"Kim loại", GLASS:"Thủy tinh"
}
const LABEL_COLOR = {
PLASTIC:"#2563eb", PAPER:"#d97706",
  METAL:"#6b7280", GLASS:"#0891b2"
}

export default function DatasetPage() {
  const [items, setItems]       = useState([])
  const [stats, setStats]       = useState({})
  const [total, setTotal]       = useState(0)
  const [cats, setCats]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [msg, setMsg]           = useState(null)
  const [filter, setFilter]     = useState("")
  const [editItem, setEditItem] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [form, setForm]         = useState({ category_id:"", label:"ORGANIC", note:"" })
  const fileRef = useRef()
  const batchRef = useRef()

  const showMsg = (text, ok=true) => {
    setMsg({text,ok})
    setTimeout(()=>setMsg(null), 3000)
  }

  const load = async (labelFilter="") => {
    setLoading(true)
    try {
      const params = labelFilter ? `?category_id=` : ""
      const res = await api.get(`/dataset/${params}`)
      const filtered = labelFilter
        ? res.data.items.filter(i => i.label === labelFilter)
        : res.data.items
      setItems(filtered)
      setStats(res.data.stats)
      setTotal(res.data.total)
    } catch { setItems([]) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    load()
    api.get('/waste-logs/categories').then(r => setCats(r.data)).catch(()=>{})
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!fileRef.current?.files?.length) return showMsg("Chưa chọn ảnh!", false)
    if (!form.category_id) return showMsg("Chưa chọn loại rác!", false)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", fileRef.current.files[0])
      fd.append("category_id", form.category_id)
      fd.append("label", form.label)
      if (form.note) fd.append("note", form.note)
      await api.post('/dataset/', fd, { headers:{'Content-Type':'multipart/form-data'} })
      showMsg("Thêm ảnh thành công!")
      setForm({ category_id:"", label:"ORGANIC", note:"" })
      fileRef.current.value = ""
      load(filter)
    } catch(err) {
      showMsg(err.response?.data?.detail || "Lỗi upload", false)
    } finally { setUploading(false) }
  }

  const handleBatchUpload = async (e) => {
    const files = e.target.files
    if (!files?.length || !form.category_id) return showMsg("Chọn loại rác trước!", false)
    setUploading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach(f => fd.append("files", f))
      fd.append("category_id", form.category_id)
      fd.append("label", form.label)
      const res = await api.post('/dataset/batch', fd, { headers:{'Content-Type':'multipart/form-data'} })
      showMsg(res.data.message)
      load(filter)
    } catch { showMsg("Lỗi upload batch", false) }
    finally { setUploading(false) }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/dataset/${editItem.id}`, {
        category_id: parseInt(editItem.category_id),
        label: editItem.label,
        note: editItem.note
      })
      showMsg("Cập nhật thành công!")
      setEditItem(null)
      load(filter)
    } catch { showMsg("Lỗi cập nhật", false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa ảnh này khỏi dataset?")) return
    await api.delete(`/dataset/${id}`)
    showMsg("Đã xóa ảnh!")
    load(filter)
  }

  const inputStyle = {
    padding:'8px 12px', border:'1.5px solid #e5e7eb', borderRadius:8,
    fontSize:13, outline:'none', width:'100%', boxSizing:'border-box'
  }

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:16,fontWeight:700,color:'#16a34a'}}>
          <div style={{width:34,height:34,background:'#16a34a',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
            </svg>
          </div>
          GarbageVision — Dataset
        </div>
        <div style={{display:'flex',gap:12}}>
          <Link to="/admin" style={{fontSize:13,color:'#6b7280',textDecoration:'none'}}>← Về Admin</Link>
          <Link to="/" style={{fontSize:13,color:'#6b7280',textDecoration:'none'}}>← Dashboard</Link>
        </div>
      </nav>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'28px 24px'}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#111',marginBottom:4}}>Quản lý Dataset Huấn luyện</h2>
        <p style={{fontSize:14,color:'#6b7280',marginBottom:20}}>Tổng cộng <strong>{total}</strong> ảnh trong dataset</p>

        {msg && (
          <div style={{padding:'10px 16px',borderRadius:10,marginBottom:16,fontSize:14,fontWeight:500,
            background:msg.ok?'#f0fdf4':'#fef2f2',color:msg.ok?'#16a34a':'#dc2626',
            border:`1px solid ${msg.ok?'#86efac':'#fecaca'}`}}>
            {msg.ok?'✅':'❌'} {msg.text}
          </div>
        )}

        {/* Thống kê */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>
          <button onClick={()=>{setFilter("");load("")}}
            style={{padding:'6px 14px',borderRadius:20,border:'1px solid #e5e7eb',fontSize:12,fontWeight:500,cursor:'pointer',
              background:filter===""?'#16a34a':'#fff',color:filter===""?'#fff':'#374151'}}>
            Tất cả ({total})
          </button>
          {Object.entries(stats).map(([label, count]) => (
            <button key={label} onClick={()=>{setFilter(label);load(label)}}
              style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${LABEL_COLOR[label]}`,fontSize:12,fontWeight:500,cursor:'pointer',
                background:filter===label?LABEL_COLOR[label]:'#fff',
                color:filter===label?'#fff':LABEL_COLOR[label]}}>
              {LABEL_VI[label]||label} ({count})
            </button>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:16,alignItems:'start'}}>

          {/* Form Upload */}
          <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'20px'}}>
            <p style={{fontSize:14,fontWeight:600,color:'#111',marginBottom:14}}>
              {editItem ? '✏️ Cập nhật ảnh' : '➕ Thêm ảnh mới'}
            </p>

            {editItem ? (
              <form onSubmit={handleUpdate}>
                <div style={{marginBottom:10}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>Loại rác</label>
                  <select value={editItem.category_id}
                    onChange={e=>setEditItem({...editItem,category_id:e.target.value})}
                    style={inputStyle}>
                    {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:10}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>Nhãn (Label)</label>
                  <select value={editItem.label}
                    onChange={e=>setEditItem({...editItem,label:e.target.value})}
                    style={inputStyle}>
                    {LABELS.map(l=><option key={l} value={l}>{l} — {LABEL_VI[l]}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>Ghi chú</label>
                  <input value={editItem.note||""} onChange={e=>setEditItem({...editItem,note:e.target.value})}
                    placeholder="Ghi chú..." style={inputStyle}/>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button type="submit" style={{flex:1,padding:'9px',background:'#16a34a',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:600,cursor:'pointer'}}>
                    Cập nhật
                  </button>
                  <button type="button" onClick={()=>setEditItem(null)}
                    style={{padding:'9px 14px',background:'#f3f4f6',border:'none',borderRadius:9,fontSize:13,cursor:'pointer'}}>
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleUpload}>
                <div style={{marginBottom:10}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>Loại rác *</label>
                  <select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})} style={inputStyle} required>
                    <option value="">-- Chọn loại rác --</option>
                    {cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:10}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>Nhãn (Label) *</label>
                  <select value={form.label} onChange={e=>setForm({...form,label:e.target.value})} style={inputStyle}>
                    {LABELS.map(l=><option key={l} value={l}>{l} — {LABEL_VI[l]}</option>)}
                  </select>
                </div>
                <div style={{marginBottom:10}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>Chọn ảnh *</label>
                  <input type="file" accept="image/*" ref={fileRef}
                    style={{...inputStyle, padding:'6px'}}/>
                </div>
                <div style={{marginBottom:14}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>Ghi chú</label>
                  <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})}
                    placeholder="Ghi chú thêm..." style={inputStyle}/>
                </div>
                <button type="submit" disabled={uploading}
                  style={{width:'100%',padding:'10px',background:uploading?'#86efac':'#16a34a',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:600,cursor:'pointer',marginBottom:8}}>
                  {uploading?'Đang upload...':'Upload 1 ảnh'}
                </button>

                <div style={{borderTop:'1px solid #f3f4f6',paddingTop:12,marginTop:4}}>
                  <p style={{fontSize:12,color:'#6b7280',marginBottom:8}}>Upload nhiều ảnh cùng lúc:</p>
                  <input type="file" accept="image/*" multiple ref={batchRef} style={{display:'none'}}
                    onChange={handleBatchUpload}/>
                  <button type="button" onClick={()=>batchRef.current.click()} disabled={uploading}
                    style={{width:'100%',padding:'9px',background:'#eff6ff',color:'#2563eb',border:'1px solid #bfdbfe',borderRadius:9,fontSize:13,fontWeight:500,cursor:'pointer'}}>
                    📁 Upload nhiều ảnh
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Danh sách ảnh */}
          <div>
            {loading ? (
              <div style={{textAlign:'center',padding:'48px',color:'#9ca3af'}}>Đang tải...</div>
            ) : items.length === 0 ? (
              <div style={{textAlign:'center',padding:'48px',background:'#fff',borderRadius:16,border:'1px solid #e5e7eb',color:'#9ca3af'}}>
                <div style={{fontSize:40,marginBottom:8}}>🖼️</div>
                <p style={{fontSize:14,fontWeight:500}}>Chưa có ảnh nào trong dataset</p>
                <p style={{fontSize:12,marginTop:4}}>Upload ảnh từ form bên trái để bắt đầu</p>
              </div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:10}}>
                {items.map(item=>(
                  <div key={item.id} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,overflow:'hidden',transition:'border-color .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=LABEL_COLOR[item.label]||'#16a34a'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor='#e5e7eb'}>
                    <img src={item.image_url} alt={item.label}
                      style={{width:'100%',height:110,objectFit:'cover',background:'#f3f4f6',display:'block'}}
                      onError={e=>{e.target.style.display='none'}}/>
                    <div style={{padding:'8px 10px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:3}}>
                        <span style={{fontSize:10,padding:'2px 6px',borderRadius:20,background:(LABEL_COLOR[item.label]||'#16a34a')+'20',color:LABEL_COLOR[item.label]||'#16a34a',fontWeight:500}}>
                          {item.label}
                        </span>
                      </div>
                      <p style={{fontSize:11,color:'#9ca3af',marginBottom:6}}>{item.created_at}</p>
                      <div style={{display:'flex',gap:4}}>
                        <button onClick={()=>setEditItem(item)}
                          style={{flex:1,padding:'4px',border:'1px solid #e5e7eb',borderRadius:6,fontSize:11,cursor:'pointer',background:'#fff'}}>
                          Sửa
                        </button>
                        <button onClick={()=>handleDelete(item.id)}
                          style={{flex:1,padding:'4px',border:'1px solid #fecaca',borderRadius:6,fontSize:11,cursor:'pointer',background:'#fff',color:'#dc2626'}}>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
