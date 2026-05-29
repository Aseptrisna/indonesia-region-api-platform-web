import React, { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import auth from '../services/auth'

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '10px 14px',
  border: '1px solid #d1d5db', borderRadius: 8,
  fontSize: 14, color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s',
  background: '#fff', boxSizing: 'border-box',
}

function focusInput(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#6366f1'
  e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
}
function blurInput(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = '#d1d5db'
  e.target.style.boxShadow = 'none'
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState(searchParams.get('token') || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Password dan konfirmasi password tidak cocok.')
      return
    }
    setLoading(true)
    try {
      await auth.resetPassword(token, password)
      setDone(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Token tidak valid atau sudah kadaluarsa.')
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
          {!done ? (
            <>
              {/* Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: '#eef2ff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: 20,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>

              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: -0.3 }}>
                Buat Password Baru
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
                Masukkan password baru Anda. Minimal 8 karakter, kombinasi huruf besar, kecil, dan angka.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Token field — shown if not pre-filled from URL */}
                {!searchParams.get('token') && (
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Token Reset
                    </label>
                    <input
                      type="text"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      placeholder="Paste token dari email"
                      required
                      style={{ ...inputStyle, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13 }}
                      onFocus={focusInput}
                      onBlur={blurInput}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Password Baru
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 karakter"
                    required
                    autoFocus={!!searchParams.get('token')}
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Konfirmasi Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Ulangi password baru"
                    required
                    style={inputStyle}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                  {confirm && password !== confirm && (
                    <p style={{ fontSize: 12, color: '#ef4444', margin: '5px 0 0' }}>
                      Password tidak cocok.
                    </p>
                  )}
                  {confirm && password === confirm && (
                    <p style={{ fontSize: 12, color: '#16a34a', margin: '5px 0 0' }}>
                      Password cocok.
                    </p>
                  )}
                </div>

                {/* Password strength hint */}
                {password && (
                  <PasswordStrength password={password} />
                )}

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
                  disabled={loading || !token || !password || password !== confirm}
                  style={{
                    width: '100%', padding: '12px',
                    background: (loading || !token || !password || password !== confirm) ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                    color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 15, fontWeight: 700,
                    cursor: (loading || !token || !password || password !== confirm) ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: (loading || !token || !password || password !== confirm) ? 'none' : '0 2px 10px rgba(79,70,229,0.35)',
                  }}
                >
                  {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: -0.3 }}>
                Password Berhasil Diubah!
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
                Password Anda sudah diperbarui. Silakan masuk menggunakan password baru.
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '12px',
                  background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 10px rgba(79,70,229,0.35)',
                }}
              >
                Masuk Sekarang
              </button>
            </div>
          )}
        </div>

        {!done && (
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
            <Link to="/forgot-password" style={{ color: '#64748b', textDecoration: 'none' }}>← Minta token baru</Link>
          </p>
        )}
      </div>
    </div>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Min. 8 karakter', ok: password.length >= 8 },
    { label: 'Huruf besar (A-Z)', ok: /[A-Z]/.test(password) },
    { label: 'Huruf kecil (a-z)', ok: /[a-z]/.test(password) },
    { label: 'Angka (0-9)', ok: /\d/.test(password) },
  ]
  const passed = checks.filter(c => c.ok).length
  const strengthColor = passed <= 1 ? '#ef4444' : passed <= 2 ? '#f59e0b' : passed === 3 ? '#3b82f6' : '#16a34a'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ height: 4, borderRadius: 9999, background: '#e2e8f0', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 9999,
          width: `${(passed / 4) * 100}%`,
          background: strengthColor,
          transition: 'width 0.3s, background 0.3s',
        }} />
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {checks.map(c => (
          <span key={c.label} style={{
            fontSize: 11, color: c.ok ? '#16a34a' : '#94a3b8',
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}
