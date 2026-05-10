import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function AdminPage() {
  const [users, setUsers]   = useState([])
  const [cats, setCats]     = useState([])
  const [tab, setTab]       = useState('users')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]       = useState(null)
  const [newCat, setNewCat] = useState({ name:'', code:'', color_hex:'#16a34a', tips:'' })
  const [editCat, setEditCat] = useState(null)

  const showMsg = (text, ok=true) => {
    setMsg({text,ok})
    setTimeout(()=>setMsg(null), 3000)
  }

  const loadUsers = () => api.get('/users/').then(r=>setUsers(r.data)).catch(()=>{})
  const loadCats  = () => api.get('/waste-logs/categories').then(r=>setCats(r.data)).catch(()=>{})

  useEffect(() => {
    Promise.all([loadUsers(), loadCats()]).finally(()=>setLoading(false))
  }, [])

  const toggleUser = async (id) => {
    await api.put(`/users/${id}/toggle-active`)
    loadUsers()
    showMsg('Cập nhật trạng thái thành công!')
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Xóa user này?')) return
    await api.delete(`/users/${id}`)
    loadUsers()
    showMsg('Xóa user thành công!')
  }

  const createCat = async (e) => {
    e.preventDefault()
    try {
      await api.post('/waste-logs/categories', newCat)
      setNewCat({ name:'', code:'', color_hex:'#16a34a', tips:'' })
      loadCats()
      showMsg('Thêm loại rác thành công!')
    } catch(err) {
      showMsg(err.response?.data?.detail || 'Lỗi', false)
    }
  }

  const deleteCat = async (id) => {
    if (!window.confirm('Xóa loại rác này?')) return
    await api.delete(`/waste-logs/categories/${id}`)
    loadCats()
    showMsg('Xóa loại rác thành công!')
  }

  const updateCat = async (e) => {
    e.preventDefault()
    await api.put(`/waste-logs/categories/${editCat.id}`, editCat)
    setEditCat(null)
    loadCats()
    showMsg('Cập nhật thành công!')
  }

  const inputStyle = {
    padding:'8px 12px', border:'1.5px solid #e5e7eb', borderRadius:8,
    fontSize:13, outline:'none', width:'100%', boxSizing:'border-box'
  }
  const tabStyle = (active) => ({
    padding:'8px 20px', borderRadius:8, border:'none', cursor:'pointer',
    fontSize:14, fontWeight:600,
    background: active ? '#16a34a' : '#f3f4f6',
    color: active ? '#fff' : '#6b7280'
  })

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <nav style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:16,fontWeight:700,color:'#16a34a'}}>
          <div style={{width:34,height:34,background:'#16a34a',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
            </svg>
          </div>
          SmartTrash — Admin
        </div>
        <Link to="/" style={{fontSize:13,color:'#6b7280',textDecoration:'none'}}>← Về Dashboard</Link>
      </nav>

      <div style={{maxWidth:900,margin:'0 auto',padding:'32px 24px'}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#111',marginBottom:20}}>Quản trị hệ thống</h2>

        {msg && (
          <div style={{padding:'12px 16px',borderRadius:10,marginBottom:16,fontSize:14,fontWeight:500,
            background:msg.ok?'#f0fdf4':'#fef2f2',color:msg.ok?'#16a34a':'#dc2626',
            border:`1px solid ${msg.ok?'#86efac':'#fecaca'}`}}>
            {msg.ok?'✅':'❌'} {msg.text}
          </div>
        )}

        <div style={{display:'flex',gap:8,marginBottom:20}}>
          <button style={tabStyle(tab==='users')} onClick={()=>setTab('users')}>👥 Người dùng ({users.length})</button>
          <button style={tabStyle(tab==='cats')}  onClick={()=>setTab('cats')}>🗂️ Loại rác ({cats.length})</button>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'48px',color:'#9ca3af'}}>Đang tải...</div>
        ) : tab === 'users' ? (
          <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f9fafb',borderBottom:'1px solid #e5e7eb'}}>
                  {['Tên','Email','Vai trò','Trạng thái','Ngày tạo','Hành động'].map(h=>(
                    <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:12,fontWeight:600,color:'#6b7280'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u=>(
                  <tr key={u.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                    <td style={{padding:'12px 16px',fontSize:14,fontWeight:500,color:'#111'}}>{u.full_name||'—'}</td>
                    <td style={{padding:'12px 16px',fontSize:13,color:'#6b7280'}}>{u.email}</td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{fontSize:11,padding:'2px 8px',borderRadius:99,background:u.role==='admin'?'#fef3c7':'#f0fdf4',color:u.role==='admin'?'#d97706':'#16a34a',fontWeight:600}}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{fontSize:11,padding:'2px 8px',borderRadius:99,background:u.is_active?'#f0fdf4':'#fef2f2',color:u.is_active?'#16a34a':'#dc2626',fontWeight:600}}>
                        {u.is_active?'Hoạt động':'Vô hiệu'}
                      </span>
                    </td>
                    <td style={{padding:'12px 16px',fontSize:13,color:'#9ca3af'}}>{u.created_at}</td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',gap:6}}>
                        <button onClick={()=>toggleUser(u.id)}
                          style={{padding:'5px 10px',border:'1px solid #e5e7eb',borderRadius:6,fontSize:12,cursor:'pointer',background:'#fff',color:'#374151'}}>
                          {u.is_active?'Khóa':'Mở'}
                        </button>
                        <button onClick={()=>deleteUser(u.id)}
                          style={{padding:'5px 10px',border:'1px solid #fecaca',borderRadius:6,fontSize:12,cursor:'pointer',background:'#fff',color:'#dc2626'}}>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'20px'}}>
              <p style={{fontSize:14,fontWeight:600,color:'#111',marginBottom:14}}>
                {editCat ? '✏️ Sửa loại rác' : '➕ Thêm loại rác mới'}
              </p>
              <form onSubmit={editCat ? updateCat : createCat}>
                {[
                  {label:'Tên loại rác', key:'name', placeholder:'Rác hữu cơ'},
                  {label:'Mã code',      key:'code', placeholder:'ORGANIC'},
                  {label:'Hướng dẫn',   key:'tips', placeholder:'Cách xử lý...'},
                ].map(f=>(
                  <div key={f.key} style={{marginBottom:12}}>
                    <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>{f.label}</label>
                    <input placeholder={f.placeholder} required={f.key!=='tips'}
                      value={editCat ? editCat[f.key]||'' : newCat[f.key]||''}
                      onChange={e => editCat
                        ? setEditCat({...editCat,[f.key]:e.target.value})
                        : setNewCat({...newCat,[f.key]:e.target.value})}
                      style={inputStyle}
                      onFocus={e=>e.target.style.borderColor='#16a34a'}
                      onBlur={e=>e.target.style.borderColor='#e5e7eb'} />
                  </div>
                ))}
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',fontSize:12,fontWeight:500,color:'#374151',marginBottom:4}}>Màu sắc</label>
                  <input type="color"
                    value={editCat ? editCat.color_hex||'#16a34a' : newCat.color_hex}
                    onChange={e => editCat
                      ? setEditCat({...editCat,color_hex:e.target.value})
                      : setNewCat({...newCat,color_hex:e.target.value})}
                    style={{width:48,height:36,borderRadius:8,border:'1px solid #e5e7eb',cursor:'pointer'}} />
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button type="submit"
                    style={{flex:1,padding:'10px',background:'#16a34a',color:'#fff',border:'none',borderRadius:9,fontSize:13,fontWeight:600,cursor:'pointer'}}>
                    {editCat ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  {editCat && (
                    <button type="button" onClick={()=>setEditCat(null)}
                      style={{padding:'10px 14px',background:'#f3f4f6',color:'#374151',border:'none',borderRadius:9,fontSize:13,cursor:'pointer'}}>
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'20px'}}>
              <p style={{fontSize:14,fontWeight:600,color:'#111',marginBottom:14}}>Danh sách loại rác</p>
              {cats.map(cat=>(
                <div key={cat.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:'1px solid #f3f4f6'}}>
                  <div style={{width:32,height:32,borderRadius:8,background:cat.color_hex+'20',border:`1px solid ${cat.color_hex}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <div style={{width:12,height:12,borderRadius:'50%',background:cat.color_hex}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:13,fontWeight:600,color:'#111'}}>{cat.name}</p>
                    <p style={{fontSize:11,color:'#9ca3af'}}>{cat.code}</p>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <button onClick={()=>setEditCat(cat)}
                      style={{padding:'4px 10px',border:'1px solid #e5e7eb',borderRadius:6,fontSize:12,cursor:'pointer',background:'#fff'}}>
                      Sửa
                    </button>
                    <button onClick={()=>deleteCat(cat.id)}
                      style={{padding:'4px 10px',border:'1px solid #fecaca',borderRadius:6,fontSize:12,cursor:'pointer',background:'#fff',color:'#dc2626'}}>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
