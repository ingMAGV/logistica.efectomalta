import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import bottleImg from '@/imports/WhatsApp_Image_2026-06-09_at_15.01.06.jpeg'

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  green:      '#1C5A44',
  greenMid:   '#236B52',
  greenLight: '#E8F4EF',
  greenFaint: '#F0F8F4',
  gold:       '#B8821E',
  goldLight:  '#FDF3E0',
  goldBorder: '#E8C97A',
  page:       '#F2F4F6',
  card:       '#FFFFFF',
  border:     '#E4E8EC',
  borderMid:  '#D0D8DC',
  text:       '#1A2B2B',
  textMid:    '#4A6060',
  textMuted:  '#7A9090',
  red:        '#C0392B',
  ok:         '#1A7A4A',
  okBg:       '#E6F7EE',
}

// ─── Shared primitives ────────────────────────────────────────────────────────
const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: T.card,
  borderRadius: 14,
  border: `1px solid ${T.border}`,
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  ...extra,
})

const label = (extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: 'JetBrains Mono',
  fontSize: 9,
  fontWeight: 500,
  letterSpacing: '0.09em',
  textTransform: 'uppercase' as const,
  color: T.textMuted,
  ...extra,
})

// ─── Data ─────────────────────────────────────────────────────────────────────
const INV_DATA = [
  { m:'Feb', v:380 },{ m:'Mar', v:420 },{ m:'Abr', v:395 },
  { m:'May', v:450 },{ m:'Jun', v:435 },{ m:'Jul', v:468 },
]
const PROD_DATA = [
  { m:'Feb', p:480, d:460 },{ m:'Mar', p:500, d:490 },
  { m:'Abr', p:490, d:500 },{ m:'May', p:515, d:510 },
  { m:'Jun', p:510, d:505 },{ m:'Jul', p:520, d:515 },
]
const ROUTE_DATA = [
  { r:'Centro Histórico', v:210 },
  { r:'Polanco',          v:185 },
  { r:'Condesa',          v: 73 },
]
const DONUT = [{ v:98 },{ v:2 }]

const KPIS = [
  { icon:'📦', title:'Inventario',    value:'468',  unit:'Botellas', delta:'+4.2%', up:true  },
  { icon:'🚚', title:'Entregas',      value:'98',   unit:'%',        delta:'+1.0%', up:true  },
  { icon:'📊', title:'Exactitud',     value:'99',   unit:'%',        delta:'+0.5%', up:true  },
  { icon:'📉', title:'Merma',         value:'0.8',  unit:'%',        delta:'-0.2%', up:false },
  { icon:'🏭', title:'Producción',    value:'520',  unit:'Botellas', delta:'+3.8%', up:true  },
  { icon:'🌡', title:'Almacén Frío',  value:'4',    unit:'°C',       delta:'Óptimo',up:true  },
  { icon:'🔄', title:'Método Inv.',   value:'FIFO', unit:'PEPS',     delta:'Activo',up:true  },
]

const CHAIN = [
  { icon:'🌾', label:'Proveedor'    },
  { icon:'🧺', label:'Mat. Prima'   },
  { icon:'🍺', label:'Elaboración'  },
  { icon:'🧪', label:'Fermentación' },
  { icon:'📦', label:'Envasado'     },
  { icon:'❄️', label:'Almacén'      },
  { icon:'🚚', label:'Distribución' },
  { icon:'🛒', label:'Cliente'      },
]

const SUPPLIERS = [
  { icon:'🌾', name:'Malteurop México',   product:'Malta'             },
  { icon:'🌿', name:'Yakima Chief Hops', product:'Lúpulo'            },
  { icon:'🧫', name:'Fermentis',         product:'Levadura'          },
  { icon:'🫙', name:'Vitro México',      product:'Botellas de Vidrio'},
  { icon:'📦', name:'Smurfit Kappa MX',  product:'Cajas de Cartón'   },
]

const TRACE_ROWS = [
  { label:'Producto',             value:'Efecto Malta'               },
  { label:'Lote',                 value:'EM-2026-001'                },
  { label:'Fecha Producción',     value:'30 julio 2026'              },
  { label:'Fecha Vencimiento',    value:'30 enero 2027'              },
  { label:'Inventario Disponible',value:'468 Botellas'               },
  { label:'Temperatura Almacén',  value:'4 °C'                       },
  { label:'Almacén',              value:'Ciudad de México'           },
  { label:'Centros Distribución', value:'Centro Histórico · Polanco' },
  { label:'Método Inventario',    value:'FIFO (PEPS)'                },
  { label:'Inspección Calidad',   value:'Aprobado ✓'                 },
  { label:'Supervisor',           value:'Marco Godínez'              },
]

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tip({ active, payload, label: lbl }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
      padding: '8px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontFamily: 'JetBrains Mono', fontSize: 9 }}>
      <p style={{ color: T.green, fontWeight: 600, marginBottom: 4 }}>{lbl}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color, margin: 0 }}>{p.name ?? ''}: <b>{p.value}</b></p>
      ))}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHead({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: T.greenLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{icon}</div>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: T.text, margin: 0 }}>{title}</h2>
      </div>
      {sub && <p style={{ fontSize: 10.5, color: T.textMuted, margin: '4px 0 0 38px' }}>{sub}</p>}
    </div>
  )
}

// ─── Status chip ──────────────────────────────────────────────────────────────
function Chip({ ok, children }: { ok?: boolean; children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'Inter', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
      background: ok ? T.okBg : T.goldLight,
      color: ok ? T.ok : T.gold,
      border: `1px solid ${ok ? '#B8E0CC' : T.goldBorder}`,
    }}>{children}</span>
  )
}

// ─── Gauge SVG ────────────────────────────────────────────────────────────────
function Gauge({ value, max = 12 }: { value: number; max?: number }) {
  const pct = value / max
  const r = 46, cx = 60, cy = 60
  const s = Math.PI * 0.75, e = Math.PI * 2.25, arc = e - s
  const va = s + arc * pct
  const tx = (a: number) => cx + r * Math.cos(a)
  const ty = (a: number) => cy + r * Math.sin(a)
  return (
    <svg width="120" height="88" viewBox="0 0 120 88">
      <path d={`M ${tx(s)} ${ty(s)} A ${r} ${r} 0 1 1 ${tx(e)} ${ty(e)}`}
        fill="none" stroke={T.border} strokeWidth="9" strokeLinecap="round"/>
      <path d={`M ${tx(s)} ${ty(s)} A ${r} ${r} 0 ${pct>0.5?1:0} 1 ${tx(va)} ${ty(va)}`}
        fill="none" stroke={T.green} strokeWidth="9" strokeLinecap="round"/>
      <text x={cx} y={55} textAnchor="middle" fill={T.green} fontSize="18" fontWeight="800" fontFamily="Outfit">{value}</text>
      <text x={cx} y={68} textAnchor="middle" fill={T.textMuted} fontSize="8" fontFamily="Inter">rot/año</text>
    </svg>
  )
}

// ─── Mini sparkline ───────────────────────────────────────────────────────────
function Spark({ up }: { up: boolean }) {
  const d = [3,4,3,5,4,6,5,7,6,8].map((v,i,a) => {
    const x = (i/(a.length-1))*52
    const y = 16 - ((v-3)/5)*13
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width="52" height="18" viewBox="0 0 52 18">
      <polyline points={d} fill="none" stroke={up ? T.ok : T.red}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err,  setErr ] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === 'admin' && pass === 'efectomalta2026') {
      setBusy(true); setErr('')
      setTimeout(onLogin, 800)
    } else setErr('Usuario o contraseña incorrectos')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', background: T.page,
      padding:'24px 16px', fontFamily:'Inter,sans-serif' }}>

      {/* Top bar */}
      <div style={{ width:'100%', maxWidth:400, marginBottom:28, display:'flex',
        alignItems:'center', gap:10 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:T.greenLight,
          border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🍺</div>
        <div>
          <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:12, color:T.green,
            margin:0, letterSpacing:'0.05em', textTransform:'uppercase' }}>Malta y Asociados S.A. de C.V.</p>
          <p style={{ fontFamily:'Inter', fontSize:10, color:T.textMuted, margin:0 }}>Malta Logistics Cloud · ERP</p>
        </div>
      </div>

      <div style={{ width:'100%', maxWidth:400 }}>
        {/* Bottle card */}
        <div style={{ ...card(), overflow:'hidden', marginBottom:16, display:'flex', height:100 }}>
          <div style={{ width:72, flexShrink:0, overflow:'hidden' }}>
            <img src={bottleImg} alt="Efecto Malta bottle"
              style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'right center' }}/>
          </div>
          <div style={{ flex:1, padding:'14px 16px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <p style={{ ...label(), marginBottom:4 }}>Sistema ERP</p>
            <h1 style={{ fontFamily:'Outfit', fontWeight:800, fontSize:17, color:T.green,
              margin:'0 0 2px', lineHeight:1.1 }}>Efecto Malta</h1>
            <p style={{ fontSize:10, color:T.textMuted, margin:0 }}>Logistics Intelligence Center</p>
          </div>
        </div>

        {/* Login card */}
        <div style={{ ...card(), padding:'24px 20px' }}>
          <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:16, color:T.text,
            margin:'0 0 2px', textAlign:'center' }}>Iniciar Sesión</p>
          <p style={{ fontSize:10.5, color:T.textMuted, textAlign:'center', margin:'0 0 20px' }}>
            Acceso al Sistema de Trazabilidad
          </p>

          <form onSubmit={submit}>
            <div style={{ marginBottom:12 }}>
              <p style={{ ...label(), marginBottom:5 }}>Usuario</p>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:13, opacity:0.45 }}>👤</span>
                <input type="text" value={user} placeholder="admin"
                  onChange={e => { setUser(e.target.value); setErr('') }}
                  style={{ width:'100%', padding:'10px 12px 10px 32px', borderRadius:9,
                    border:`1.5px solid ${err ? '#E0B0B0' : T.border}`,
                    background:'#FAFBFC', fontFamily:'Inter', fontSize:13, color:T.text,
                    outline:'none', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = T.green}
                  onBlur={e => e.target.style.borderColor = err ? '#E0B0B0' : T.border}/>
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <p style={{ ...label(), marginBottom:5 }}>Contraseña</p>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:13, opacity:0.45 }}>🔒</span>
                <input type={show?'text':'password'} value={pass} placeholder="••••••••••••"
                  onChange={e => { setPass(e.target.value); setErr('') }}
                  style={{ width:'100%', padding:'10px 36px 10px 32px', borderRadius:9,
                    border:`1.5px solid ${err ? '#E0B0B0' : T.border}`,
                    background:'#FAFBFC', fontFamily:'Inter', fontSize:13, color:T.text,
                    outline:'none', boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = T.green}
                  onBlur={e => e.target.style.borderColor = err ? '#E0B0B0' : T.border}/>
                <button type="button" onClick={() => setShow(v=>!v)} style={{
                  position:'absolute', right:10, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', fontSize:13, opacity:0.4, padding:0 }}>
                  {show ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {err && (
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 11px',
                background:'#FDF0EE', border:'1px solid #F0C0BC', borderRadius:8, marginBottom:14 }}>
                <span style={{ fontSize:12 }}>⚠️</span>
                <span style={{ fontSize:11, color:T.red }}>{err}</span>
              </div>
            )}

            <button type="submit" disabled={busy} style={{
              width:'100%', padding:'12px', borderRadius:10, border:'none', cursor: busy ? 'default' : 'pointer',
              background: busy ? '#A0C4B4' : T.green,
              color:'#fff', fontFamily:'Outfit', fontWeight:700, fontSize:13,
              letterSpacing:'0.03em', transition:'background 0.2s',
              boxShadow: busy ? 'none' : '0 2px 10px rgba(28,90,68,0.25)',
            }}>
              {busy ? 'Verificando...' : 'Ingresar al Dashboard →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', marginTop:16, fontFamily:'JetBrains Mono',
          fontSize:8.5, color:T.textMuted }}>
          Malta Logistics Cloud v2026.1 · Acceso Seguro
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [auth, setAuth] = useState(false)
  const [tab, setTab]   = useState<'overview'|'trace'|'chain'>('overview')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />

  const fmt = (d: Date) => d.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' })

  return (
    <div style={{ minHeight:'100vh', background:T.page, fontFamily:'Inter,sans-serif' }}>

      {/* ── TOP NAV BAR ──────────────────────────────────────────────────────── */}
      <div style={{ background:T.green, padding:'0 16px', position:'sticky', top:0, zIndex:50,
        boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth:480, margin:'0 auto', display:'flex', alignItems:'center',
          justifyContent:'space-between', height:52 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, overflow:'hidden', border:'1.5px solid rgba(255,255,255,0.3)', flexShrink:0 }}>
              <img src={bottleImg} alt="EM" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'right' }}/>
            </div>
            <div>
              <p style={{ fontFamily:'Outfit', fontWeight:800, fontSize:13, color:'#fff', margin:0, lineHeight:1 }}>Efecto Malta</p>
              <p style={{ fontFamily:'Inter', fontSize:8.5, color:'rgba(255,255,255,0.65)', margin:0, letterSpacing:'0.04em' }}>LOGISTICS INTELLIGENCE CENTER</p>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div className="pulse-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80' }}/>
            <span style={{ fontFamily:'JetBrains Mono', fontSize:8.5, color:'rgba(255,255,255,0.7)' }}>{fmt(time)}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'0 14px 40px' }}>

        {/* ── HERO BATCH CARD ───────────────────────────────────────────────── */}
        <div style={{ ...card({ marginTop:16, marginBottom:16, overflow:'hidden', padding:0 }) }}>
          {/* Green header stripe */}
          <div style={{ background:`linear-gradient(135deg, ${T.green}, ${T.greenMid})`, padding:'12px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontFamily:'JetBrains Mono', fontSize:8.5, color:'rgba(255,255,255,0.6)',
                  margin:'0 0 2px', letterSpacing:'0.08em' }}>LOTE DE PRODUCCIÓN</p>
                <h2 style={{ fontFamily:'Outfit', fontWeight:800, fontSize:22, color:'#fff', margin:0, letterSpacing:'-0.01em' }}>EM-2026-001</h2>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(74,222,128,0.2)',
                border:'1px solid rgba(74,222,128,0.4)', borderRadius:20, padding:'5px 11px' }}>
                <div className="pulse-dot" style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80' }}/>
                <span style={{ fontFamily:'Inter', fontSize:10, fontWeight:700, color:'#4ade80' }}>Disponible</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ display:'flex', gap:0 }}>
            {/* Bottle image */}
            <div style={{ width:90, flexShrink:0, background:'#F8FAF9', borderRight:`1px solid ${T.border}`, overflow:'hidden' }}>
              <img src={bottleImg} alt="Efecto Malta bottle"
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'right center', minHeight:110 }}/>
            </div>
            {/* Meta */}
            <div style={{ flex:1, padding:'14px 14px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 8px' }}>
                {[
                  { l:'Producto',     v:'Efecto Malta' },
                  { l:'Estilo',       v:'Amber Ale' },
                  { l:'Producción',   v:'30 Jul 2026' },
                  { l:'Vencimiento',  v:'30 Ene 2027' },
                  { l:'ABV',          v:'5.8%' },
                  { l:'Volumen',      v:'320 ml' },
                ].map(r => (
                  <div key={r.l}>
                    <p style={{ ...label(), marginBottom:1 }}>{r.l}</p>
                    <p style={{ fontFamily:'Outfit', fontWeight:600, fontSize:11.5, color:T.text, margin:0 }}>{r.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Label art strip */}
          <div style={{ height:52, overflow:'hidden', position:'relative', borderTop:`1px solid ${T.border}` }}>
            <img src={bottleImg} alt="Etiqueta Efecto Malta"
              style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'left 28%', filter:'brightness(0.7)' }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(28,90,68,0.85), rgba(28,90,68,0.3))',
              display:'flex', alignItems:'center', padding:'0 16px', justifyContent:'space-between' }}>
              <p style={{ fontFamily:'Outfit', fontWeight:800, fontSize:13, color:'#fff',
                margin:0, letterSpacing:'0.04em' }}>EFECTO MALTA</p>
              <p style={{ fontFamily:'Inter', fontSize:9, color:'rgba(255,255,255,0.7)',
                margin:0, fontStyle:'italic' }}>Desde lo más profundo de nuestras raíces · México</p>
            </div>
          </div>
        </div>

        {/* ── TABS ──────────────────────────────────────────────────────────── */}
        <div style={{ display:'flex', gap:0, marginBottom:16, background:T.card,
          border:`1px solid ${T.border}`, borderRadius:11, padding:3, boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
          {([
            { k:'overview', l:'Resumen'     },
            { k:'trace',    l:'Trazabilidad'},
            { k:'chain',    l:'Cadena'      },
          ] as const).map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              flex:1, padding:'8px 4px', borderRadius:9, border:'none', cursor:'pointer',
              fontFamily:'Outfit', fontSize:11, fontWeight:600,
              transition:'all 0.2s',
              background: tab===t.k ? T.green : 'transparent',
              color:       tab===t.k ? '#fff'   : T.textMid,
              boxShadow:   tab===t.k ? '0 2px 6px rgba(28,90,68,0.25)' : 'none',
            }}>{t.l}</button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* OVERVIEW TAB                                                      */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div className="slide-in">

            {/* KPI grid */}
            <SectionHead icon="📊" title="KPIs Ejecutivos" sub="Actualizado · 30 Jul 2026"/>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
              {KPIS.map((k,i) => (
                <div key={i} style={{ ...card({ padding:'14px 13px' }) }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:T.greenLight,
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>{k.icon}</div>
                    <span style={{
                      fontFamily:'JetBrains Mono', fontSize:8, fontWeight:600, padding:'2px 5px', borderRadius:5,
                      background: k.up ? T.okBg : '#FDF0EE',
                      color:      k.up ? T.ok   : T.red,
                    }}>{k.up ? '▲' : '▼'} {k.delta}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:3, marginBottom:1 }}>
                    <span style={{ fontFamily:'Outfit', fontWeight:800, fontSize:22, color:T.green, lineHeight:1 }}>{k.value}</span>
                    <span style={{ fontSize:9.5, color:T.textMuted }}>{k.unit}</span>
                  </div>
                  <p style={{ fontSize:9.5, color:T.textMid, margin:'0 0 6px' }}>{k.title}</p>
                  <Spark up={k.up}/>
                </div>
              ))}
            </div>

            {/* Line chart */}
            <div style={{ ...card({ padding:16, marginBottom:14 }) }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div>
                  <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:13, color:T.text, margin:0 }}>Niveles de Inventario</p>
                  <p style={{ fontSize:9.5, color:T.textMuted, margin:'2px 0 0' }}>Feb – Jul 2026 · Botellas</p>
                </div>
                <Chip ok>Mensual</Chip>
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={INV_DATA}>
                  <XAxis dataKey="m" tick={{ fill:T.textMuted, fontSize:9, fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:T.textMuted, fontSize:8 }} axisLine={false} tickLine={false} width={26}/>
                  <Tooltip content={<Tip/>}/>
                  <Line type="monotone" dataKey="v" name="Botellas" stroke={T.green} strokeWidth={2.5}
                    dot={{ r:3, fill:T.green, stroke:'#fff', strokeWidth:2 }} activeDot={{ r:5 }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart */}
            <div style={{ ...card({ padding:16, marginBottom:14 }) }}>
              <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:13, color:T.text, margin:'0 0 2px' }}>Producción vs Demanda</p>
              <p style={{ fontSize:9.5, color:T.textMuted, margin:'0 0 12px' }}>Botellas · Feb – Jul 2026</p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={PROD_DATA} barGap={2} barSize={9}>
                  <XAxis dataKey="m" tick={{ fill:T.textMuted, fontSize:9, fontFamily:'JetBrains Mono' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill:T.textMuted, fontSize:8 }} axisLine={false} tickLine={false} width={26}/>
                  <Tooltip content={<Tip/>}/>
                  <Bar dataKey="p" name="Producción" fill={T.green}   radius={[3,3,0,0]}/>
                  <Bar dataKey="d" name="Demanda"    fill={T.gold}    radius={[3,3,0,0]} opacity={0.85}/>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display:'flex', gap:16, marginTop:6 }}>
                {[{c:T.green,l:'Producción'},{c:T.gold,l:'Demanda'}].map(x=>(
                  <div key={x.l} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:x.c }}/>
                    <span style={{ fontSize:9, color:T.textMuted }}>{x.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut + Gauge */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              <div style={{ ...card({ padding:14 }) }}>
                <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:11.5, color:T.text, margin:'0 0 2px' }}>Cumplimiento</p>
                <p style={{ fontSize:9, color:T.textMuted, margin:'0 0 6px' }}>Entregas a tiempo</p>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <PieChart width={106} height={86}>
                    <Pie data={DONUT} cx={53} cy={43} innerRadius={26} outerRadius={40}
                      startAngle={90} endAngle={-270} dataKey="v" stroke="none">
                      <Cell fill={T.green}/>
                      <Cell fill={T.border}/>
                    </Pie>
                    <text x={53} y={39} textAnchor="middle" fill={T.green} fontSize={16} fontWeight={800} fontFamily="Outfit">98%</text>
                    <text x={53} y={52} textAnchor="middle" fill={T.textMuted} fontSize={7} fontFamily="Inter">a tiempo</text>
                  </PieChart>
                </div>
                <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                  <span style={{ fontSize:8, color:T.ok }}>● A tiempo 98%</span>
                  <span style={{ fontSize:8, color:T.red }}>● Retraso 2%</span>
                </div>
              </div>
              <div style={{ ...card({ padding:14 }) }}>
                <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:11.5, color:T.text, margin:'0 0 2px' }}>Rotación Inv.</p>
                <p style={{ fontSize:9, color:T.textMuted, margin:'0 0 2px' }}>Rotaciones/año</p>
                <div style={{ display:'flex', justifyContent:'center' }}>
                  <Gauge value={12} max={12}/>
                </div>
                <p style={{ textAlign:'center', fontSize:8, color:T.ok, margin:0 }}>✓ Meta alcanzada</p>
              </div>
            </div>

            {/* Horizontal bars */}
            <div style={{ ...card({ padding:16, marginBottom:14 }) }}>
              <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:13, color:T.text, margin:'0 0 2px' }}>Rutas de Distribución</p>
              <p style={{ fontSize:9.5, color:T.textMuted, margin:'0 0 14px' }}>Entregas por centro · Jul 2026</p>
              {ROUTE_DATA.map((r,i) => {
                const mx = Math.max(...ROUTE_DATA.map(x=>x.v))
                return (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:10.5, color:T.textMid }}>{r.r}</span>
                      <span style={{ fontFamily:'JetBrains Mono', fontSize:10, fontWeight:600, color:T.green }}>{r.v}</span>
                    </div>
                    <div style={{ height:6, background:T.greenLight, borderRadius:4, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(r.v/mx)*100}%`, borderRadius:4,
                        background:`linear-gradient(90deg, ${T.green}, ${T.gold})`, transition:'width 1.2s ease' }}/>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status panel */}
            <div style={{ ...card({ padding:16 }) }}>
              <SectionHead icon="🚦" title="Estado Ejecutivo"/>
              {[
                { l:'Inventario', s:'Saludable'  },
                { l:'Producción', s:'En Tiempo'  },
                { l:'Logística',  s:'Estable'    },
                { l:'Entregas',   s:'98%'        },
                { l:'Calidad',    s:'Aprobado'   },
              ].map((row,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'9px 12px', borderRadius:9, background:'#F8FAF9',
                  marginBottom: i < 4 ? 6 : 0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div className="pulse-dot" style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e' }}/>
                    <span style={{ fontSize:11.5, color:T.textMid }}>{row.l}</span>
                  </div>
                  <Chip ok>{row.s}</Chip>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* TRACEABILITY TAB                                                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === 'trace' && (
          <div className="slide-in">
            <SectionHead icon="🔍" title="Trazabilidad del Producto" sub="Batch EM-2026-001 · Lote activo"/>

            {/* QC banner */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
              background:T.okBg, border:`1px solid #B8E0CC`, borderRadius:11, marginBottom:14 }}>
              <span style={{ fontSize:18 }}>✅</span>
              <div>
                <p style={{ fontFamily:'Inter', fontWeight:700, fontSize:11, color:T.ok, margin:0 }}>Inspección de Calidad: Aprobado</p>
                <p style={{ fontSize:9, color:T.textMuted, margin:0 }}>Supervisor: Marco Godínez · 30 Jul 2026</p>
              </div>
            </div>

            {/* Shelf life */}
            <div style={{ ...card({ padding:16, marginBottom:14 }) }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:13, color:T.text, margin:0 }}>Vida Útil Restante</p>
                <Chip ok>97% restante</Chip>
              </div>
              <div style={{ height:8, background:T.greenLight, borderRadius:6, overflow:'hidden', marginBottom:6 }}>
                <div style={{ height:'100%', width:'3%', background:`linear-gradient(90deg, ${T.ok}, ${T.gold})`, borderRadius:6 }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:9, color:T.textMuted }}>30 Jul 2026</span>
                <span style={{ fontFamily:'JetBrains Mono', fontSize:9, color:T.textMuted }}>183 días restantes</span>
                <span style={{ fontSize:9, color:T.textMuted }}>30 Ene 2027</span>
              </div>
            </div>

            {/* Data table */}
            <div style={{ ...card({ padding:16, marginBottom:14 }) }}>
              <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:13, color:T.text, margin:'0 0 14px' }}>Ficha del Lote</p>
              {TRACE_ROWS.map((r,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between',
                  padding:'9px 0', borderBottom: i < TRACE_ROWS.length-1 ? `1px solid ${T.border}` : 'none', gap:12 }}>
                  <span style={{ fontSize:10, color:T.textMuted, flexShrink:0, minWidth:130 }}>{r.label}</span>
                  <span style={{ fontFamily:'Outfit', fontWeight:600, fontSize:11.5, color:T.text, textAlign:'right' }}>{r.value}</span>
                </div>
              ))}
            </div>

            {/* Specs grid */}
            <div style={{ ...card({ padding:16 }) }}>
              <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:13, color:T.text, margin:'0 0 12px' }}>Especificaciones</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {[
                  { l:'Estilo',    v:'Amber Ale' },
                  { l:'Volumen',   v:'320 ml'    },
                  { l:'ABV',       v:'5.8%'      },
                  { l:'IBU',       v:'25'        },
                  { l:'EBC',       v:'18'        },
                  { l:'Temp.',     v:'4 °C'      },
                ].map((s,i) => (
                  <div key={i} style={{ textAlign:'center', padding:'10px 4px', borderRadius:9,
                    background:T.greenFaint, border:`1px solid ${T.border}` }}>
                    <p style={{ fontFamily:'Outfit', fontWeight:800, fontSize:13, color:T.green, margin:'0 0 2px' }}>{s.v}</p>
                    <p style={{ fontSize:8.5, color:T.textMuted, margin:0 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* CHAIN TAB                                                         */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {tab === 'chain' && (
          <div className="slide-in">
            <SectionHead icon="🔗" title="Cadena de Suministro" sub="Flujo completo · Lote EM-2026-001"/>

            {/* Flow */}
            <div style={{ ...card({ padding:16, marginBottom:14 }) }}>
              {CHAIN.map((step,i) => (
                <div key={i}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px',
                    borderRadius:11, background:T.greenFaint, border:`1px solid ${T.border}` }}>
                    <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, fontSize:19,
                      background:T.card, border:`1px solid ${T.border}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>{step.icon}</div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:'Outfit', fontWeight:600, fontSize:12.5, color:T.text, margin:0 }}>{step.label}</p>
                      <p style={{ fontFamily:'JetBrains Mono', fontSize:8.5, color:T.ok, margin:0 }}>✓ Completado</p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 8px',
                      background:T.okBg, border:`1px solid #B8E0CC`, borderRadius:20 }}>
                      <div className="pulse-dot" style={{ width:5, height:5, borderRadius:'50%', background:'#22c55e' }}/>
                      <span style={{ fontSize:8.5, color:T.ok, fontWeight:600 }}>OK</span>
                    </div>
                  </div>
                  {i < CHAIN.length-1 && (
                    <div className="flow-anim" style={{ textAlign:'center', color:T.gold, fontSize:16, padding:'2px 0' }}>↓</div>
                  )}
                </div>
              ))}
            </div>

            {/* Suppliers */}
            <SectionHead icon="🏭" title="Proveedores Certificados" sub="Red de suministro activa"/>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {SUPPLIERS.map((s,i) => (
                <div key={i} style={{ ...card({ padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }) }}>
                  <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, fontSize:19,
                    background:T.goldLight, border:`1px solid ${T.goldBorder}`,
                    display:'flex', alignItems:'center', justifyContent:'center' }}>{s.icon}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:'Outfit', fontWeight:600, fontSize:12, color:T.text, margin:0 }}>{s.name}</p>
                    <p style={{ fontSize:9.5, color:T.textMuted, margin:0 }}>{s.product}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 8px',
                    background:T.okBg, border:`1px solid #B8E0CC`, borderRadius:20 }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:'#22c55e' }}/>
                    <span style={{ fontSize:8.5, color:T.ok, fontWeight:600 }}>Activo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FOOTER ────────────────────────────────────────────────────────── */}
        <footer style={{ marginTop:28, padding:'16px 0 0', borderTop:`1.5px solid ${T.border}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <p style={{ ...label({ marginBottom:2 }) }}>Sistema ERP</p>
              <p style={{ fontFamily:'Outfit', fontWeight:700, fontSize:11.5, color:T.green, margin:0 }}>Malta Logistics Cloud</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ ...label({ marginBottom:2 }) }}>Última actualización</p>
              <p style={{ fontFamily:'JetBrains Mono', fontSize:10, color:T.textMid, margin:0 }}>30 Jul 2026 · 23:45</p>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'8px 0',
            background:T.greenFaint, borderRadius:10, border:`1px solid ${T.border}` }}>
            <span style={{ fontSize:13 }}>🦅</span>
            <p style={{ fontFamily:'Outfit', fontSize:9, color:T.textMuted, margin:0, letterSpacing:'0.04em', textTransform:'uppercase' }}>
              Cerveza Artesanal · Hecho en México · Desde lo más profundo de nuestras raíces
            </p>
            <span style={{ fontSize:13 }}>🌵</span>
          </div>
          <p style={{ textAlign:'center', fontSize:8.5, color:T.textMuted, marginTop:10, margin:'10px 0 0' }}>
            © 2026 Malta y Asociados S.A. de C.V. · Todos los derechos reservados
          </p>
        </footer>

      </div>
    </div>
  )
}
