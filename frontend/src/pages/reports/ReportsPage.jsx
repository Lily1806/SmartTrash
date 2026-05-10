import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { reportService } from '../../services/reportService'

const EMOJI = {
  ORGANIC:'🌿', PLASTIC:'♻️', PAPER:'📄',
  METAL:'🔩', GLASS:'🫙', HAZARDOUS:'⚠️'
}

export default function ReportsPage() {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reportService.getStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total = stats?.by_category?.reduce((s, c) => s + c.count, 0) || 1

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

      <div style={{maxWidth:800,margin:'0 auto',padding:'32px 24px'}}>
        <h2 style={{fontSize:22,fontWeight:700,color:'#111',marginBottom:4}}>Báo cáo & Thống kê</h2>
        <p style={{fontSize:14,color:'#6b7280',marginBottom:28}}>Tổng quan hoạt động phân loại rác của bạn</p>

        {loading ? (
          <div style={{textAlign:'center',padding:'48px',color:'#9ca3af'}}>Đang tải...</div>
        ) : (
          <>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))',gap:12,marginBottom:24}}>
              {[
                {label:'Tổng phân loại', value:stats?.total_classifications||0, unit:'lần',  icon:'📷', color:'#16a34a'},
                {label:'Tổng điểm',      value:stats?.total_points||0,           unit:'điểm', icon:'⭐', color:'#d97706'},
                {label:'Tổng kg rác',    value:(stats?.total_kg||0).toFixed(1),  unit:'kg',   icon:'⚖️', color:'#2563eb'},
                {label:'Tỉ lệ tái chế', value: stats?.by_category ?
                  Math.round(
                    (stats.by_category.filter(c=>['PLASTIC','PAPER','METAL','GLASS'].includes(c.code))
                      .reduce((s,c)=>s+c.count,0) / Math.max(total,1)) * 100
                  ) : 0,
                  unit:'%', icon:'♻️', color:'#0891b2'},
              ].map(s => (
                <div key={s.label} style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:'18px 20px'}}>
                  <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
                  <p style={{fontSize:24,fontWeight:700,color:s.color,lineHeight:1}}>
                    {s.value}<span style={{fontSize:12,color:'#9ca3af',fontWeight:400,marginLeft:3}}>{s.unit}</span>
                  </p>
                  <p style={{fontSize:12,color:'#6b7280',marginTop:4}}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:16,padding:'22px',marginBottom:20}}>
              <p style={{fontSize:15,fontWeight:600,color:'#111',marginBottom:20}}>📊 Tỉ lệ theo loại rác</p>
              {stats?.by_category?.map(cat => {
                const pct = Math.round((cat.count / total) * 100)
                return (
                  <div key={cat.code} style={{marginBottom:16}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{fontSize:16}}>{EMOJI[cat.code]||'🗑️'}</span>
                        <span style={{fontSize:14,fontWeight:500,color:'#374151'}}>{cat.name}</span>
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <span style={{fontSize:13,color:'#6b7280'}}>{cat.count} lần</span>
                        <span style={{fontSize:12,padding:'2px 8px',borderRadius:99,background:cat.color+'20',color:cat.color,fontWeight:600,minWidth:40,textAlign:'center'}}>
                          {pct}%
                        </span>
                      </div>
                    </div>
                    <div style={{height:8,background:'#f3f4f6',borderRadius:99}}>
                      <div style={{height:8,borderRadius:99,background:cat.color,width:`${pct}%`,transition:'width 1s ease'}}/>
                    </div>
                  </div>
                )
              })}
              {(!stats?.by_category || stats.by_category.every(c=>c.count===0)) && (
                <div style={{textAlign:'center',padding:'32px',color:'#9ca3af',fontSize:14}}>
                  Chưa có dữ liệu — hãy phân loại ảnh đầu tiên!
                </div>
              )}
            </div>

            <div style={{background:'#f0fdf4',border:'1px solid #86efac',borderRadius:16,padding:'20px',display:'flex',gap:14,alignItems:'flex-start'}}>
              <span style={{fontSize:28}}>🌍</span>
              <div>
                <p style={{fontSize:15,fontWeight:600,color:'#15803d',marginBottom:4}}>Tác động môi trường</p>
                <p style={{fontSize:13,color:'#374151',lineHeight:1.7}}>
                  Bạn đã phân loại <strong>{stats?.total_classifications||0} lần</strong> rác,
                  góp phần tái chế <strong>{(stats?.total_kg||0).toFixed(1)} kg</strong> rác thải.
                  Tiếp tục phân loại đúng cách để bảo vệ môi trường mỗi ngày! 💪
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
