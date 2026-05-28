import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuthStore } from '../../store/authStore'

export default function LoginPage() {
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setToken = useAuthStore(s => s.setToken)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(form)
      setToken(res.data.access_token)
      navigate('/')
    } catch {
      setError('Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',background:'#f9fafb'}}>
      <div style={{flex:1,background:'#16a34a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px',color:'#fff'}}>
        <div style={{maxWidth:360}}>
          <div style={{width:72,height:72,background:'rgba(255,255,255,0.2)',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:24}}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
            </svg>
          </div>
          <h1 style={{fontSize:32,fontWeight:700,marginBottom:12,letterSpacing:-0.5}}>GarbageVision</h1>
          <p style={{fontSize:16,opacity:0.85,lineHeight:1.6,marginBottom:32}}>
            Phân loại rác thông minh bằng AI — góp phần bảo vệ môi trường mỗi ngày.
          </p>
          {[
            {icon:'🤖', title:'AI nhận diện tức thì', desc:'Chụp ảnh, AI phân loại ngay lập tức'},
            {icon:'📊', title:'Thống kê chi tiết',    desc:'Theo dõi lượng rác phân loại hàng ngày'},
            {icon:'🏆', title:'Tích điểm thưởng',    desc:'Nhận huy hiệu khi đóng góp cho môi trường'},
          ].map(f => (
            <div key={f.title} style={{display:'flex',gap:12,marginBottom:20,alignItems:'flex-start'}}>
              <span style={{fontSize:24}}>{f.icon}</span>
              <div>
                <p style={{fontWeight:600,fontSize:15}}>{f.title}</p>
                <p style={{fontSize:13,opacity:0.75,marginTop:2}}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{width:480,display:'flex',alignItems:'center',justifyContent:'center',padding:'48px 40px'}}>
        <div style={{width:'100%',maxWidth:380}}>
          <div style={{textAlign:'center',marginBottom:32}}>
            <div style={{width:56,height:56,background:'#16a34a',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
              </svg>
            </div>
            <h2 style={{fontSize:24,fontWeight:700,color:'#111',marginBottom:4}}>Chào mừng trở lại</h2>
            <p style={{fontSize:14,color:'#6b7280'}}>Đăng nhập vào tài khoản GarbageVision</p>
          </div>

          <div style={{display:'flex',background:'#f3f4f6',borderRadius:12,padding:4,marginBottom:24}}>
            <div style={{flex:1,textAlign:'center',padding:'8px',borderRadius:9,background:'#fff',fontSize:14,fontWeight:600,color:'#16a34a',boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
              Đăng nhập
            </div>
            <Link to="/register" style={{flex:1,textAlign:'center',padding:'8px',borderRadius:9,fontSize:14,fontWeight:500,color:'#6b7280',textDecoration:'none'}}>
              Đăng ký
            </Link>
          </div>

          {error && (
            <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'10px 14px',marginBottom:16,color:'#dc2626',fontSize:13}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#374151',marginBottom:6}}>Email</label>
              <input type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                style={{width:'100%',padding:'10px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box'}}
                onFocus={e => e.target.style.borderColor='#16a34a'}
                onBlur={e => e.target.style.borderColor='#e5e7eb'}
              />
            </div>
            <div style={{marginBottom:8}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,color:'#374151',marginBottom:6}}>Mật khẩu</label>
              <input type="password" placeholder="••••••••" required
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                style={{width:'100%',padding:'10px 14px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box'}}
                onFocus={e => e.target.style.borderColor='#16a34a'}
                onBlur={e => e.target.style.borderColor='#e5e7eb'}
              />
            </div>
            <div style={{textAlign:'right',marginBottom:20}}>
              <a href="#" style={{fontSize:13,color:'#16a34a',textDecoration:'none'}}>Quên mật khẩu?</a>
            </div>
            <button type="submit" disabled={loading}
              style={{width:'100%',padding:'12px',background:loading?'#86efac':'#16a34a',color:'#fff',border:'none',borderRadius:10,fontSize:15,fontWeight:600,cursor:loading?'not-allowed':'pointer',transition:'background .2s'}}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p style={{textAlign:'center',marginTop:20,fontSize:13,color:'#6b7280'}}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{color:'#16a34a',fontWeight:600,textDecoration:'none'}}>Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
