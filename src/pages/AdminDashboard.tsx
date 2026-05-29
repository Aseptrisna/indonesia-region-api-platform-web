import { Link } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'

const menuCards = [
  {
    to: '/admin/users',
    title: 'Manajemen User',
    desc: 'Buat, update, cari user, ubah role, dan reset password.',
    accentColor: '#4f46e5',
    accentBg: '#eef2ff',
  },
  {
    to: '/admin/api-keys',
    title: 'Manajemen API Key',
    desc: 'Approve/revoke key, monitor pemakaian, atur tanggal expired.',
    accentColor: '#0891b2',
    accentBg: '#ecfeff',
  },
  // TODO: aktifkan setelah payment gateway siap
  // {
  //   to: '/admin/payments',
  //   title: 'Manajemen Pembayaran',
  //   desc: 'Review bukti pembayaran dan konfirmasi secara manual.',
  //   accentColor: '#16a34a',
  //   accentBg: '#f0fdf4',
  // },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: -0.3 }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            Kelola user dan API key dari panel ini.
          </p>
        </div>

        {/* Menu cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginBottom: 24 }}>
          {menuCards.map(card => (
            <Link
              key={card.to}
              to={card.to}
              style={{
                display: 'block', textDecoration: 'none',
                background: '#fff', borderRadius: 14,
                border: '1px solid #e2e8f0', padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'box-shadow 0.15s, border-color 0.15s',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'
                ;(e.currentTarget as HTMLElement).style.borderColor = card.accentColor + '60'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'
                ;(e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'
              }}
            >
              {/* Icon block */}
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: card.accentBg,
                marginBottom: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ width: 20, height: 20, borderRadius: 5, background: card.accentColor }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.55 }}>
                {card.desc}
              </p>
              <span style={{ fontSize: 13, fontWeight: 600, color: card.accentColor }}>
                Kelola →
              </span>
            </Link>
          ))}
        </div>

        {/* API Docs quick link */}
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #eef2ff)',
          borderRadius: 12, border: '1px solid #bfdbfe',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#1d4ed8', margin: '0 0 4px' }}>
              Dokumentasi API (Swagger)
            </p>
            <p style={{ fontSize: 13, color: '#1e40af', margin: 0 }}>
              Lihat referensi API lengkap dan uji endpoint via Swagger UI.
            </p>
          </div>
          <a
            href={import.meta.env.VITE_SWAGGER_URL || 'http://localhost:3000/api/docs'}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 13, fontWeight: 600, color: '#fff',
              background: '#2563eb', padding: '8px 16px',
              borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            Buka Swagger UI
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
