import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import auth from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await auth.login(email, password)
      const role = data.user?.role || 'user'
      if (role === 'super_admin' || role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/user')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Login gagal. Periksa email dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '10px 14px',
    border: '1px solid #d1d5db', borderRadius: 8,
    fontSize: 14, color: '#0f172a', outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s',
    background: '#fff',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #eef2ff 0%, #faf5ff 50%, #f0fdf4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 7 }} />
              <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>API Platform</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#6366f1', textTransform: 'uppercase' }}>
              Indonesia Region
            </div>
          </Link>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          padding: '36px 32px',
          border: '1px solid #e2e8f0',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: -0.3 }}>
            Masuk ke akun Anda
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
            Belum punya akun?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
              Daftar di sini
            </Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
                autoFocus
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = '#6366f1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password Anda"
                required
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = '#6366f1'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626',
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -8 }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.15s',
                fontFamily: 'inherit',
                boxShadow: loading ? 'none' : '0 2px 10px rgba(79,70,229,0.35)',
              }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', margin: 0 }}>
              Belum verifikasi email?{' '}
              <Link to="/verify-email" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                Verifikasi di sini
              </Link>
            </p>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#94a3b8' }}>
          <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>← Kembali ke halaman utama</Link>
        </p>
      </div>
    </div>
  )
}
