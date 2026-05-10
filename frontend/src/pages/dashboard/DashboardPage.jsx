import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/authService'
import { reportService } from '../../services/reportService'

const CATEGORY_COLORS = {
  ORGANIC:'#16a34a', PLASTIC:'#2563eb', PAPER:'#d97706',
  METAL:'#6b7280', GLASS:'#0891b2', HAZARDOUS:'#dc2626',
}

function StatCard({ label, value, unit, color, icon }) {
  return (
    <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'20px 22px',display:'flex',alignItems:'center',gap:14}}>
      <div style={{width:48,height:48,borderRadius:12,background:color+'18',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>
        {icon}
      </div>
      <div>
        <p style={{fontSize:12,color:'#6b7280',marginBottom:4,fontWeight:500}}>{label}</p>
        <p style={{fontSize:24,fontWeight:700,color:'#111',lineHeight:1}}>
          {value}<span style={{fontSize:13,color:'#9ca3af',fontWeight:400,marginLeft:4}}>{unit}</span>
        </p>
      </div>
    </div>
  )
}

function QuickAction({ to, icon, title, desc, color, bg }) {
  return (
    <Link to={to} style={{textDecoration:'none'}}>
      <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'20px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',transition:'border-color .2s,transform .15s'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=color;e.currentTarget.style.transform='translateY(-2px)'}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor='#e5e7eb';e.currentTarget.style.transform='translateY(0)'}}>
        <div style={{width:52,height:52,borderRadius:14,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0}}>
          {icon}
        </div>
        <div>
          <p style={{fontSize:15,fontWeight:600,color:'#111',marginBottom:3}}>{title}</p>
          <p style={{fontSize:13,color:'#6b7280'}}>{desc}</p>
        </div>
        <div style={{marginLeft:'auto',color:'#9ca3af',fontSize:18}}>›</div>
      </div>
    </Link>
  )
}

export default function DashboardPage() {
  const [user, setUser]       = useState(null)
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const logout   = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([authService.getMe(), reportService.getStats()])
      .then(([userRes, statsRes]) => {
        setUser(userRes.data)
        setStats(statsRes.data)
      })
      .catch(() => { logout(); navigate('/login') })
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }
  const maxCount = stats ? Math.max(...stats.by_category.map(c => c.count), 1) : 1
  const isAdmin = user?.role === 'admin'

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

        <div style={{display:'flex',alignItems:'center',gap:12}}>
          {isAdmin && (
            <Link to="/admin"
              style={{padding:'6px 14px',background:'#fef3c7',color:'#d97706',borderRadius:8,fontSize:13,fontWeight:600,textDecoration:'none',border:'1px solid #fde68a'}}>
              ⚙️ Admin
            </Link>
          )}
          <div style={{position:'relative'}}>
            <div
              onClick={() => setShowMenu(!showMenu)}
              style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',padding:'6px 10px',borderRadius:10,border:'1px solid #e5e7eb',background:'#fff'}}
              onMouseEnter={e=>e.currentTarget.style.background='#f9fafb'}
              onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'#dcfce7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#16a34a'}}>
                {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p style={{fontSize:13,fontWeight:600,color:'#111',lineHeight:1.2}}>{user?.full_name || 'Người dùng'}</p>
                <p style={{fontSize:11,color:'#9ca3af'}}>{user?.email}</p>
              </div>
              <span style={{color:'#9ca3af',fontSize:12,marginLeft:4}}>▾</span>
            </div>

            {showMenu && (
              <div style={{position:'absolute',right:0,top:'calc(100% + 8px)',background:'#fff',border:'1px solid #e5e7eb',borderRadius:12,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',minWidth:180,zIndex:100}}>
                <Link to="/profile"
                  onClick={()=>setShowMenu(false)}
                  style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',textDecoration:'none',color:'#374151',fontSize:14,borderBottom:'1px solid #f3f4f6'}}>
                  <span>👤</span> Thông tin cá nhân
                </Link>
                {isAdmin && (
                  <Link to="/admin"
                    onClick={()=>setShowMenu(false)}
                    style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',textDecoration:'none',color:'#374151',fontSize:14,borderBottom:'1px solid #f3f4f6'}}>
                    <span>⚙️</span> Quản trị hệ thống
                  </Link>
                )}
                <button onClick={handleLogout}
                  style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',width:'100%',border:'none',background:'none',color:'#dc2626',fontSize:14,cursor:'pointer',textAlign:'left'}}>
                  <span>🚪</span> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div style={{maxWidth:900,margin:'0 auto',padding:'32px 24px'}}>
        <div style={{marginBottom:28}}>
          <h2 style={{fontSize:22,fontWeight:700,color:'#111',marginBottom:4}}>
            Xin chào, {user?.full_name || 'bạn'} 👋
          </h2>
          <p style={{fontSize:14,color:'#6b7280'}}>Đây là tổng quan hoạt động phân loại rác của bạn</p>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'48px',color:'#9ca3af',fontSize:15}}>Đang tải dữ liệu...</div>
        ) : (
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14,marginBottom:28}}>
              <StatCard label="Lần phân loại"  value={stats?.total_classifications||0} unit="lần"  color="#16a34a" icon="📷"/>
              <StatCard label="Điểm tích lũy"  value={stats?.total_points||0}          unit="điểm" color="#2563eb" icon="⭐"/>
              <StatCard label="Kg rác xử lý"   value={(stats?.total_kg||0).toFixed(1)} unit="kg"   color="#d97706" icon="⚖️"/>
              <StatCard label="Lần ghi log"     value={stats?.total_logs||0}            unit="lần"  color="#0891b2" icon="📋"/>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:28}}>
              <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'20px'}}>
                <p style={{fontSize:15,fontWeight:600,color:'#111',marginBottom:16}}>📊 Phân loại theo loại rác</p>
                {stats?.by_category?.length > 0 ? (
                  stats.by_category.map(cat => (
                    <div key={cat.code} style={{marginBottom:12}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:5}}>
                        <span style={{color:'#374151',fontWeight:500}}>{cat.name}</span>
                        <span style={{color:'#6b7280'}}>{cat.count} lần</span>
                      </div>
                      <div style={{height:7,background:'#f3f4f6',borderRadius:99}}>
                        <div style={{
                          height:7,borderRadius:99,
                          background:CATEGORY_COLORS[cat.code]||'#16a34a',
                          width:`${Math.round((cat.count/maxCount)*100)}%`,
                          transition:'width .8s ease'
                        }}/>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{textAlign:'center',padding:'24px 0',color:'#9ca3af',fontSize:13}}>
                    Chưa có dữ liệu — hãy phân loại ảnh đầu tiên!
                  </div>
                )}
              </div>

              <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'20px'}}>
                <p style={{fontSize:15,fontWeight:600,color:'#111',marginBottom:16}}>🏆 Thành tích</p>
                {[
                  {icon:'🌱', label:'Người mới bắt đầu', done:(stats?.total_classifications||0)>=1,  desc:'Phân loại lần đầu'},
                  {icon:'⭐', label:'Chiến binh xanh',   done:(stats?.total_points||0)>=500,          desc:'Tích lũy 500 điểm'},
                  {icon:'🏅', label:'Huyền thoại',       done:(stats?.total_points||0)>=2000,         desc:'Tích lũy 2000 điểm'},
                ].map(a=>(
                  <div key={a.label} style={{display:'flex',alignItems:'center',gap:12,marginBottom:14,opacity:a.done?1:0.4}}>
                    <div style={{width:38,height:38,borderRadius:10,background:a.done?'#f0fdf4':'#f9fafb',border:`1px solid ${a.done?'#86efac':'#e5e7eb'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>
                      {a.icon}
                    </div>
                    <div>
                      <p style={{fontSize:13,fontWeight:600,color:'#111'}}>{a.label}</p>
                      <p style={{fontSize:12,color:'#9ca3af'}}>{a.desc}</p>
                    </div>
                    {a.done && <div style={{marginLeft:'auto',color:'#16a34a',fontWeight:700,fontSize:13}}>✓</div>}
                  </div>
                ))}
              </div>
            </div>

            <p style={{fontSize:15,fontWeight:600,color:'#111',marginBottom:14}}>⚡ Thao tác nhanh</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
              <QuickAction to="/classify" icon="📷" title="Phân loại rác"  desc="Chụp ảnh để AI nhận diện"    color="#16a34a" bg="#f0fdf4"/>
              <QuickAction to="/history"  icon="📋" title="Lịch sử"        desc="Xem các lần phân loại trước" color="#2563eb" bg="#eff6ff"/>
              <QuickAction to="/reports"  icon="📊" title="Báo cáo"        desc="Thống kê và phân tích"       color="#d97706" bg="#fffbeb"/>
              <QuickAction to="/profile"  icon="👤" title="Hồ sơ cá nhân" desc="Xem và chỉnh sửa thông tin"  color="#8b5cf6" bg="#f5f3ff"/>
            </div>
          </>
        )}
      </div>

      {showMenu && (
        <div onClick={()=>setShowMenu(false)}
          style={{position:'fixed',inset:0,zIndex:50}}/>
      )}
    </div>
  )
}
