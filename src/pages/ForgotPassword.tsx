import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import auth from '../services/auth'

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '10px 14px',
  border: '1px solid #d1d5db', borderRadius: 8,
  fontSize: 14, color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s',
  background: '#fff', boxSizing: 'border-box',
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetToken, setResetToken] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResetToken('')
    try {
      const res = await auth.forgotPassword(email)
      // Dev mode: backend returns resetToken directly
      if (res.resetToken) {
        setResetToken(res.resetToken)
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Email tidak ditemukan. Periksa kembali alamat email Anda.')
    } finally {
      setLoading(false)
    }
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

        <div style={{
          background: '#fff', borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
          padding: '36px 32px',
          border: '1px solid #e2e8f0',
        }}>
          {!resetToken ? (
            <>
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: '#eef2ff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 20,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: -0.3 }}>
                Lupa Password?
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
                Masukkan email Anda dan kami akan mengirimkan token untuk mereset password.
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

                {error && (
                  <div style={{
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '12px',
                    background: loading ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                    color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: loading ? 'none' : '0 2px 10px rgba(79,70,229,0.35)',
                  }}
                >
                  {loading ? 'Mengirim...' : 'Kirim Token Reset'}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: '#f0fdf4', border: '2px solid #bbf7d0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 0 20px', fontSize: 24,
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', letterSpacing: -0.3 }}>
                Token Terkirim
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>
                Token reset password berhasil dibuat untuk <strong style={{ color: '#374151' }}>{email}</strong>.
              </p>

              {/* Dev mode token box */}
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe',
                borderRadius: 8, padding: '12px 14px', marginBottom: 24,
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#1d4ed8', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Dev Mode — Token Reset
                </p>
                <code style={{
                  display: 'block', fontSize: 12,
                  fontFamily: 'ui-monospace, Consolas, monospace',
                  color: '#1e40af', wordBreak: 'break-all',
                }}>
                  {resetToken}
                </code>
              </div>

              <button
                onClick={() => navigate(`/reset-password?token=${encodeURIComponent(resetToken)}`)}
                style={{
                  width: '100%', padding: '12px',
                  background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 10px rgba(79,70,229,0.35)',
                }}
              >
                Reset Password Sekarang →
              </button>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
          <Link to="/login" style={{ color: '#64748b', textDecoration: 'none' }}>← Kembali ke halaman masuk</Link>
        </p>
      </div>
    </div>
  )
}
