import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import auth from '../services/auth'

type Step = 'request' | 'confirm' | 'done'

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

export default function VerifyEmail() {
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const navigate = useNavigate()

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setInfo('')
    try {
      const res = await auth.requestEmailVerification(email)
      // Dev mode: backend returns token directly
      if (res.verificationToken) {
        setToken(res.verificationToken)
        setInfo(`Token verifikasi: ${res.verificationToken}`)
      }
      setStep('confirm')
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Gagal mengirim token verifikasi.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await auth.confirmEmailVerification(token)
      setStep('done')
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
          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            {(['request', 'confirm', 'done'] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: step === s
                    ? 'linear-gradient(135deg, #4f46e5, #6d28d9)'
                    : (['request', 'confirm', 'done'].indexOf(step) > i ? '#e0e7ff' : '#f1f5f9'),
                  color: step === s
                    ? '#fff'
                    : (['request', 'confirm', 'done'].indexOf(step) > i ? '#4f46e5' : '#94a3b8'),
                }}>
                  {['request', 'confirm', 'done'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1, height: 2,
                    background: ['request', 'confirm', 'done'].indexOf(step) > i ? '#c7d2fe' : '#e2e8f0',
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step: Request */}
          {step === 'request' && (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: -0.3 }}>
                Verifikasi Email
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
                Masukkan email Anda untuk mendapatkan token verifikasi.
              </p>
              <form onSubmit={handleRequest} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
                {error && <AlertBox type="error">{error}</AlertBox>}
                <button type="submit" disabled={loading} style={btnStyle(loading)}>
                  {loading ? 'Mengirim...' : 'Kirim Token Verifikasi'}
                </button>
              </form>
            </>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: -0.3 }}>
                Masukkan Token
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px' }}>
                Token telah dikirim ke <strong style={{ color: '#374151' }}>{email}</strong>.
              </p>
              {info && (
                <div style={{
                  background: '#eff6ff', border: '1px solid #bfdbfe',
                  borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1d4ed8', marginBottom: 18,
                  wordBreak: 'break-all',
                }}>
                  <strong>Dev Mode —</strong> {info}
                </div>
              )}
              <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Token Verifikasi
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="Paste token di sini"
                    required
                    autoFocus
                    style={{ ...inputStyle, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13 }}
                    onFocus={focusInput}
                    onBlur={blurInput}
                  />
                </div>
                {error && <AlertBox type="error">{error}</AlertBox>}
                <button type="submit" disabled={loading} style={btnStyle(loading)}>
                  {loading ? 'Memverifikasi...' : 'Konfirmasi Verifikasi'}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep('request'); setError('') }}
                  style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  ← Kirim ulang token
                </button>
              </form>
            </>
          )}

          {/* Step: Done */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 24,
              }}>
                ✓
              </div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: -0.3 }}>
                Email Terverifikasi!
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>
                Akun Anda sudah aktif. Silakan masuk untuk melanjutkan.
              </p>
              <button
                onClick={() => navigate('/login')}
                style={{ ...btnStyle(false), cursor: 'pointer' }}
              >
                Masuk Sekarang
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

function AlertBox({ type, children }: { type: 'error' | 'success', children: React.ReactNode }) {
  const isError = type === 'error'
  return (
    <div style={{
      background: isError ? '#fef2f2' : '#f0fdf4',
      border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
      borderRadius: 8, padding: '10px 14px', fontSize: 13,
      color: isError ? '#dc2626' : '#16a34a',
    }}>
      {children}
    </div>
  )
}

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: '100%', padding: '12px',
    background: disabled ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #6d28d9)',
    color: '#fff', border: 'none', borderRadius: 8,
    fontSize: 15, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    boxShadow: disabled ? 'none' : '0 2px 10px rgba(79,70,229,0.35)',
  }
}
