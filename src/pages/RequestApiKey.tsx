import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiKeysService from '../services/apiKeys'
import DashboardLayout from '../components/DashboardLayout'

const USE_CASES = [
  { id: 'personal', label: 'Aplikasi Personal', icon: '🛠️', desc: 'Proyek pribadi / hobi' },
  { id: 'business', label: 'Bisnis / Startup', icon: '💼', desc: 'Produk komersial' },
  { id: 'research', label: 'Riset & Akademik', icon: '📚', desc: 'Penelitian / tugas akhir' },
  { id: 'testing', label: 'Testing / Dev', icon: '⚙️', desc: 'Uji coba & eksplorasi' },
]

export default function RequestApiKey() {
  const [useCase, setUseCase] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!useCase) return
    setLoading(true)
    setError('')
    try {
      const reason = note.trim() ? `${useCase} — ${note.trim()}` : useCase
      await apiKeysService.request(reason)
      setDone(true)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Gagal mengirim permintaan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: 520 }}>
        <button
          onClick={() => navigate('/user')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#64748b', padding: 0, marginBottom: 24,
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          ← Kembali ke Dashboard
        </button>

        {!done ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: -0.3 }}>
                Request API Key
              </h1>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
                Pilih kebutuhan dan kirim — admin akan review dalam 1x24 jam.
              </p>
            </div>

            <div style={{
              background: '#fff', borderRadius: 14,
              border: '1px solid #e2e8f0',
              padding: '28px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', gap: 22,
            }}>
              {/* Chips */}
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 10px' }}>
                  Untuk kebutuhan apa? <span style={{ color: '#ef4444' }}>*</span>
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {USE_CASES.map(uc => (
                    <button
                      key={uc.id}
                      type="button"
                      onClick={() => setUseCase(uc.label)}
                      style={{
                        padding: '14px 16px',
                        border: `2px solid ${useCase === uc.label ? '#4f46e5' : '#e2e8f0'}`,
                        borderRadius: 10,
                        background: useCase === uc.label ? '#eef2ff' : '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                    >
                      <div style={{ fontSize: 20, marginBottom: 6 }}>{uc.icon}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: useCase === uc.label ? '#4f46e5' : '#0f172a' }}>
                        {uc.label}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>{uc.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional note */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  Catatan singkat <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opsional)</span>
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  maxLength={100}
                  placeholder="Contoh: untuk fitur autocomplete alamat pengiriman"
                  style={{
                    display: 'block', width: '100%', padding: '10px 14px',
                    border: '1px solid #d1d5db', borderRadius: 8,
                    fontSize: 14, color: '#0f172a', outline: 'none',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
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
                type="button"
                onClick={handleSubmit}
                disabled={!useCase || loading}
                style={{
                  padding: '13px',
                  background: !useCase || loading ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 15, fontWeight: 700,
                  cursor: !useCase || loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: !useCase || loading ? 'none' : '0 2px 10px rgba(79,70,229,0.3)',
                }}
              >
                {loading ? 'Mengirim...' : 'Kirim Permintaan'}
              </button>
            </div>
          </>
        ) : (
          /* Success */
          <div style={{
            background: '#fff', borderRadius: 14,
            border: '1px solid #e2e8f0',
            padding: '48px 32px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            textAlign: 'center',
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: 24, color: '#fff',
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
              Permintaan Terkirim!
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px', lineHeight: 1.6 }}>
              Admin akan mereview dan mengaktifkan API key Anda segera.
            </p>
            <button
              onClick={() => navigate('/user')}
              style={{
                padding: '11px 28px',
                background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
              }}
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
