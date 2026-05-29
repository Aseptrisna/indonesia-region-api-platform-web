import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Provinsi & Kabupaten/Kota',
    desc: 'Query semua 38 provinsi dan 500+ kabupaten/kota di seluruh Indonesia dengan data terkini.',
  },
  {
    title: 'Kecamatan & Kelurahan',
    desc: 'Drill-down ke 7.000+ kecamatan dan 83.000+ desa/kelurahan lengkap dengan kode wilayah.',
  },
  {
    title: 'API Key Management',
    desc: 'Kunci API aman dengan expiry date, monitoring pemakaian, dan revokasi instan.',
  },
  {
    title: 'RESTful JSON API',
    desc: 'Endpoint REST standar dengan response JSON bersih — mudah diintegrasikan ke aplikasi apa pun.',
  },
]

const steps = [
  { num: '01', title: 'Register Akun', desc: 'Daftar menggunakan email Anda.' },
  { num: '02', title: 'Request API Key', desc: 'Ajukan permintaan kunci; admin menyetujui dalam 24 jam.' },
  { num: '03', title: 'Mulai Pakai API', desc: 'Gunakan header X-API-Key untuk mengakses semua endpoint.' },
  // TODO: aktifkan setelah payment gateway siap
  // { num: '04', title: 'Upload Bukti Bayar', desc: 'Transfer dan upload bukti pembayaran Anda.' },
]

const stats = [
  { value: '38', label: 'Provinsi' },
  { value: '500+', label: 'Kabupaten/Kota' },
  { value: '7.000+', label: 'Kecamatan' },
  { value: '83.000+', label: 'Desa/Kelurahan' },
]

export default function Landing() {
  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: '#1e293b', margin: 0 }}>

      {/* ── Sticky Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 6 }} />
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: '#6366f1', textTransform: 'uppercase', display: 'block', lineHeight: 1 }}>Indonesia Region</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>API Platform</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none', padding: '6px 12px', borderRadius: 6 }}>Masuk</Link>
            <Link to="/register" style={{
              fontSize: 14, fontWeight: 600, color: '#fff',
              background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
              padding: '8px 18px', borderRadius: 8, textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
            }}>
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg, #eef2ff 0%, #faf5ff 50%, #f0fdf4 100%)', padding: '88px 24px 100px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, color: '#4f46e5',
            background: '#e0e7ff', padding: '5px 16px', borderRadius: 9999,
            marginBottom: 28, letterSpacing: 0.3,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f46e5', display: 'inline-block' }} />
            Data Wilayah Indonesia Terlengkap
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5.5vw, 60px)',
            fontWeight: 900,
            lineHeight: 1.08,
            margin: '0 0 22px',
            letterSpacing: -2,
            color: '#0f172a',
          }}>
            Akses Data Wilayah<br />
            <span style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Indonesia via API
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#475569', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Provinsi, kabupaten/kota, kecamatan, hingga kelurahan — semua tersedia dengan satu API key. Dibangun untuk developer, didukung data resmi akurat.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              fontSize: 15, fontWeight: 700, color: '#fff',
              background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
              padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 4px 18px rgba(79,70,229,0.4)',
              transition: 'transform 0.15s',
            }}>
              Dapatkan API Key — Gratis
            </Link>
            <a href={import.meta.env.VITE_SWAGGER_URL || 'http://localhost:3000/api/docs'} target="_blank" rel="noreferrer" style={{
              fontSize: 15, fontWeight: 600, color: '#374151',
              background: '#fff',
              padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}>
              Lihat API Docs
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '32px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 24, textAlign: 'center',
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#4f46e5', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: -0.5 }}>
              Semua yang Anda butuhkan
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
              Data wilayah komprehensif untuk aplikasi atau layanan Indonesia apapun.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {features.map((f, i) => (
              <div key={f.title} style={{
                background: '#fff', borderRadius: 14, padding: '28px 24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.2s',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: ['#eef2ff', '#f0fdf4', '#fff7ed', '#fdf2f8'][i % 4],
                  marginBottom: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    background: ['#4f46e5', '#16a34a', '#f97316', '#7c3aed'][i % 4],
                  }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: -0.5 }}>
              Mulai dalam 4 langkah
            </h2>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>
              Dari registrasi hingga API call pertama — simpel dan langsung.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ position: 'relative' }}>
                {i < steps.length - 1 && (
                  <div style={{
                    display: 'none', // hidden on mobile, show on desktop via media query not possible inline
                  }} />
                )}
                <div style={{
                  background: '#f8fafc', borderRadius: 14, padding: '24px 20px',
                  border: '1px solid #e2e8f0', textAlign: 'center',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                    color: '#4f46e5', fontSize: 15, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 14px',
                    border: '2px solid #c7d2fe',
                  }}>
                    {s.num}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Code example ── */}
      <section style={{ padding: '80px 24px', background: '#0f172a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>
              Mudah diintegrasikan
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 14px', color: '#f1f5f9', lineHeight: 1.25 }}>
              Satu header,<br />semua data wilayah
            </h2>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
              Cukup tambahkan <code style={{ background: '#1e293b', color: '#a5b4fc', padding: '2px 8px', borderRadius: 4, fontSize: 13 }}>X-API-Key</code> ke request header Anda dan dapatkan akses ke seluruh data wilayah Indonesia.
            </p>
          </div>
          <div style={{
            background: '#1e293b', borderRadius: 12, padding: '20px 24px',
            border: '1px solid #334155', fontFamily: 'ui-monospace, Consolas, monospace',
            fontSize: 13, lineHeight: 1.7,
            overflowX: 'auto',
          }}>
            <div style={{ color: '#64748b', marginBottom: 8, fontSize: 12 }}>{'# Request contoh'}</div>
            <div><span style={{ color: '#7dd3fc' }}>GET</span> <span style={{ color: '#f1f5f9' }}>/api/regions/provinces</span></div>
            <div style={{ color: '#94a3b8', marginTop: 6 }}>Host: <span style={{ color: '#fbbf24' }}>api.logicframe.id</span></div>
            <div style={{ color: '#94a3b8' }}>X-API-Key: <span style={{ color: '#86efac' }}>your_api_key_here</span></div>
            <div style={{ marginTop: 16, color: '#64748b', fontSize: 12 }}>{'# Response'}</div>
            <div style={{ color: '#f1f5f9', marginTop: 4 }}>{'{'}</div>
            <div style={{ color: '#f1f5f9', paddingLeft: 16 }}>
              <span style={{ color: '#c084fc' }}>"data"</span><span style={{ color: '#94a3b8' }}>: [</span>
            </div>
            <div style={{ color: '#94a3b8', paddingLeft: 32 }}>{'{ "id": 11, "name": "Aceh", ... },'}</div>
            <div style={{ color: '#94a3b8', paddingLeft: 32 }}>{'{ "id": 12, "name": "Sumatera Utara", ... }'}</div>
            <div style={{ color: '#94a3b8', paddingLeft: 16 }}>{']'}</div>
            <div style={{ color: '#f1f5f9' }}>{'}'}</div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '88px 24px',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 14px', letterSpacing: -0.5 }}>
          Siap untuk mulai membangun?
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', margin: '0 0 36px', lineHeight: 1.6 }}>
          Daftar sekarang dan dapatkan API key Anda disetujui dalam 24 jam.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            display: 'inline-block', fontSize: 15, fontWeight: 700,
            color: '#4f46e5', background: '#fff',
            padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}>
            Buat Akun Gratis
          </Link>
          <Link to="/login" style={{
            display: 'inline-block', fontSize: 15, fontWeight: 600,
            color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)',
            padding: '14px 32px', borderRadius: 10, textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            Sudah punya akun? Masuk
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0f172a', color: '#64748b', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>Indonesia Region API Platform</span>
            <span style={{ margin: '0 8px' }}>·</span>
            Built by Logic Frame Indonesia
          </div>
          <div style={{ fontSize: 13 }}>
            &copy; {new Date().getFullYear()} Logic Frame Indonesia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
