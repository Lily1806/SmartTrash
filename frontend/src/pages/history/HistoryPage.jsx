import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { classifyService } from '../../services/classifyService'

const EMOJI = {
  ORGANIC:'🌿', PLASTIC:'♻️', PAPER:'📄',
  METAL:'🔩', GLASS:'🫙', HAZARDOUS:'⚠️'
}

export default function HistoryPage() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    classifyService.getHistory()
      .then(res => setItems(res.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(i =>
    i.category_name.toLowerCase().includes(search.toLowerCase())
  )

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
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <div>
            <h2 style={{fontSize:22,fontWeight:700,color:'#111',marginBottom:4}}>Lịch sử phân loại</h2>
            <p style={{fontSize:14,color:'#6b7280'}}>Tổng cộng {items.length} lần phân loại</p>
          </div>
          <Link to="/classify"
            style={{padding:'10px 18px',background:'#16a34a',color:'#fff',borderRadius:10,fontSize:13,fontWeight:600,textDecoration:'none'}}>
            + Phân loại mới
          </Link>
        </div>

        <div style={{position:'relative',marginBottom:20,marginTop:20}}>
          <input
            type="text" placeholder="Tìm kiếm theo loại rác..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{width:'100%',padding:'10px 14px 10px 38px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box',background:'#fff'}}
            onFocus={e=>e.target.style.borderColor='#16a34a'}
            onBlur={e=>e.target.style.borderColor='#e5e7eb'}
          />
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#9ca3af',fontSize:16}}>🔍</span>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'48px',color:'#9ca3af',fontSize:15}}>Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'64px 24px',background:'#fff',borderRadius:16,border:'1px solid #e5e7eb'}}>
            <div style={{fontSize:48,marginBottom:12}}>📭</div>
            <p style={{fontSize:16,fontWeight:600,color:'#374151',marginBottom:6}}>
              {search ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử phân loại'}
            </p>
            <p style={{fontSize:13,color:'#9ca3af',marginBottom:20}}>
              {search ? 'Thử từ khóa khác' : 'Hãy phân loại ảnh rác đầu tiên!'}
            </p>
            {!search && (
              <Link to="/classify"
                style={{padding:'10px 20px',background:'#16a34a',color:'#fff',borderRadius:10,fontSize:13,fontWeight:600,textDecoration:'none'}}>
                Phân loại ngay
              </Link>
            )}
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {filtered.map(item => (
              <div key={item.id}
                style={{background:'#fff',border:'1px solid #e5e7eb',borderRadius:14,padding:'16px',display:'flex',alignItems:'center',gap:14,transition:'border-color .2s'}}
                onMouseEnter={e=>e.currentTarget.style.borderColor='#86efac'}
                onMouseLeave={e=>e.currentTarget.style.borderColor='#e5e7eb'}>
                <img src={item.image_url} alt="waste"
                  style={{width:64,height:64,borderRadius:10,objectFit:'cover',background:'#f3f4f6',flexShrink:0}}
                  onError={e=>{ e.target.style.display='none' }}
                />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                    <span style={{fontSize:18}}>{EMOJI[item.category] || '🗑️'}</span>
                    <span style={{fontSize:15,fontWeight:600,color:'#111'}}>{item.category_name}</span>
                    <span style={{fontSize:11,padding:'2px 8px',borderRadius:99,background:item.category_color+'20',color:item.category_color,fontWeight:600}}>
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                  <p style={{fontSize:12,color:'#9ca3af'}}>🕐 {item.classified_at}</p>
                </div>
                <div style={{width:56,flexShrink:0}}>
                  <div style={{height:5,background:'#f3f4f6',borderRadius:99,marginBottom:4}}>
                    <div style={{height:5,borderRadius:99,background:item.category_color,width:`${Math.round(item.confidence*100)}%`}}/>
                  </div>
                  <p style={{fontSize:11,color:'#9ca3af',textAlign:'right'}}>{Math.round(item.confidence*100)}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
