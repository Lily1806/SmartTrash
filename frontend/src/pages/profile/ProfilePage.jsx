import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'

export default function ProfilePage() {
  const [user, setUser]           = useState(null)
  const [fullName, setFullName]   = useState('')
  const [oldPass, setOldPass]     = useState('')
  const [newPass, setNewPass]     = useState('')
  const [msg, setMsg]             = useState(null)
  const [loading, setLoading]     = useState(false)
  const logout   = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  useEffect(() => {
    authService.getMe().then(res => {
      setUser(res.data)
      setFullName(res.data.full_name || '')
    })
  }, [])

  const showMsg = (text, ok=true) => {
    setMsg({text, ok})
    setTimeout(() => setMsg(null), 3000)
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/users/me', { full_name: fullName })
      showMsg('Cập nhật thông tin thành công!')
    } catch {
      showMsg('Có lỗi xảy ra', false)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPass.length < 6) return showMsg('Mật khẩu mới phải ít nhất 6 ký tự', false)
    setLoading(true)
    try {
      await api.put('/users/me/password', { old_password: oldPass, new_password: newPass })
      showMsg('Đổi mật khẩu thành công!')
      setOldPass('')
      setNewPass('')
    } catch (err) {
      showMsg(err.response?.data?.detail || 'Mật khẩu cũ không đúng', false)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Bạn chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) return
    await api.delete('/users/me')
    logout()
    navigate('/login')
  }

  const inputStyle = {
    width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb',
    borderRadius:10, fontSize:14, outline:'none', boxSizing:'border-box'
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
          SmartTrash
        </div>
        <Link to="/" style={{fontSize:13,color:'#6b7280',textDecoration:'none'}}>← Về Dashboard</Link>
      </nav>

      <div style={{maxWidth:600,margin:'0 auto',padding:'32px 24px'}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#111',marginBottom:24}}>Thông tin cá nhân</h2>

        {msg && (
          <div style={{
            padding:'12px 16px',borderRadius:10,marginBottom:16,fontSize:14,fontWeight:500,
            background: msg.ok ? '#f0fdf4' : '#fef2f2',
            color: msg.ok ? '#16a34a' : '#dc2626',
            border: `1px solid ${msg.ok ? '#86efac' : '#fecaca'}`
          }}>
            {msg.ok ? '✅' : '❌'} {msg.text}
          </div>
        )}

        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'24px',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:24}}>
            <div style={{width:64,height:64,borderRadius:'50%',background:'#dcfce7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:700,color:'#16a34a',flexShrink:0}}>
              {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p style={{fontSize:17,fontWeight:700,color:'#111'}}>{user?.full_name || 'Chưa đặt tên'}</p>
              <p style={{fontSize:13,color:'#6b7280'}}>{user?.email}</p>
              <p style={{fontSize:11,color:'#9ca3af',marginTop:2}}>
                Tham gia: {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : ''}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <p style={{fontSize:14,fontWeight:600,color:'#374151',marginBottom:12}}>Chỉnh sửa thông tin</p>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#374151',marginBottom:6}}>Họ và tên</label>
              <input value={fullName} onChange={e=>setFullName(e.target.value)}
                placeholder="Nhập họ và tên" style={inputStyle}
                onFocus={e=>e.target.style.borderColor='#16a34a'}
                onBlur={e=>e.target.style.borderColor='#e5e7eb'} />
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#374151',marginBottom:6}}>Email</label>
              <input value={user?.email||''} disabled
                style={{...inputStyle, background:'#f9fafb', color:'#9ca3af'}} />
            </div>
            <button type="submit" disabled={loading}
              style={{padding:'10px 20px',background:'#16a34a',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'24px',marginBottom:16}}>
          <p style={{fontSize:14,fontWeight:600,color:'#374151',marginBottom:16}}>🔒 Đổi mật khẩu</p>
          <form onSubmit={handleChangePassword}>
            <div style={{marginBottom:14}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#374151',marginBottom:6}}>Mật khẩu cũ</label>
              <input type="password" value={oldPass} onChange={e=>setOldPass(e.target.value)}
                placeholder="••••••••" required style={inputStyle}
                onFocus={e=>e.target.style.borderColor='#16a34a'}
                onBlur={e=>e.target.style.borderColor='#e5e7eb'} />
            </div>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#374151',marginBottom:6}}>Mật khẩu mới</label>
              <input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)}
                placeholder="Tối thiểu 6 ký tự" required style={inputStyle}
                onFocus={e=>e.target.style.borderColor='#16a34a'}
                onBlur={e=>e.target.style.borderColor='#e5e7eb'} />
            </div>
            <button type="submit" disabled={loading}
              style={{padding:'10px 20px',background:'#2563eb',color:'#fff',border:'none',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>
              {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>

        <div style={{background:'#fff',border:'1px solid #fecaca',borderRadius:16,padding:'24px'}}>
          <p style={{fontSize:14,fontWeight:600,color:'#dc2626',marginBottom:8}}>⚠️ Vùng nguy hiểm</p>
          <p style={{fontSize:13,color:'#6b7280',marginBottom:16}}>Xóa tài khoản sẽ vô hiệu hóa tài khoản của bạn. Dữ liệu sẽ không bị xóa ngay lập tức.</p>
          <button onClick={handleDeleteAccount}
            style={{padding:'10px 20px',background:'#fff',color:'#dc2626',border:'1.5px solid #fecaca',borderRadius:10,fontSize:14,fontWeight:600,cursor:'pointer'}}>
            Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  )
}
