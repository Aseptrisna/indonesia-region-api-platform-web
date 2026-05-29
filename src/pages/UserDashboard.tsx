import { useEffect, useState } from 'react'
import auth from '../services/auth'
import apiKeysService from '../services/apiKeys'
import DashboardLayout from '../components/DashboardLayout'
import Modal from '../components/Modal'

const USE_CASES = [
  { id: 'personal', label: 'Aplikasi Personal', icon: '🛠️', desc: 'Proyek pribadi / hobi' },
  { id: 'business', label: 'Bisnis / Startup', icon: '💼', desc: 'Produk komersial' },
  { id: 'research', label: 'Riset & Akademik', icon: '📚', desc: 'Penelitian / tugas akhir' },
  { id: 'testing', label: 'Testing / Dev', icon: '⚙️', desc: 'Uji coba & eksplorasi' },
]

type KeyStatus = 'active' | 'pending' | 'inactive'

function getStatus(k: any): KeyStatus {
  if (k.status) return k.status
  if (k.isActive) return 'active'
  if (k.metadata?.requested) return 'pending'
  return 'inactive'
}

function isExpiringSoon(expiresAt?: string) {
  if (!expiresAt) return false
  const diff = new Date(expiresAt).getTime() - Date.now()
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000 // < 7 hari
}

function isExpired(expiresAt?: string) {
  if (!expiresAt) return false
  return new Date(expiresAt).getTime() < Date.now()
}

function StatusBadge({ status }: { status: KeyStatus }) {
  const map = {
    active:   { bg: '#dcfce7', color: '#16a34a', dot: '#16a34a', label: 'Aktif' },
    pending:  { bg: '#fef9c3', color: '#ca8a04', dot: '#ca8a04', label: 'Menunggu' },
    inactive: { bg: '#f1f5f9', color: '#6b7280', dot: '#9ca3af', label: 'Nonaktif' },
  }
  const s = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 9999,
      fontSize: 12, fontWeight: 600,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot }} />
      {s.label}
    </span>
  )
}

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null)
  const [keys, setKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [renewingId, setRenewingId] = useState<string | null>(null)
  const [renewMsg, setRenewMsg] = useState<Record<string, string>>({})
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // Request modal
  const [showModal, setShowModal] = useState(false)
  const [useCase, setUseCase] = useState('')
  const [note, setNote] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [reqSuccess, setReqSuccess] = useState(false)
  const [reqError, setReqError] = useState('')

  const loadData = async () => {
    try {
      const profile = await auth.getProfile()
      setUser(profile)
    } catch { /* not authenticated */ }
    try {
      const res = await apiKeysService.myKeys()
      setKeys(Array.isArray(res) ? res : (res.data || []))
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const openModal = () => {
    setUseCase(''); setNote(''); setReqError(''); setReqSuccess(false); setShowModal(true)
  }

  const handleRequest = async () => {
    if (!useCase) return
    setRequesting(true); setReqError('')
    try {
      const reason = note.trim() ? `${useCase} — ${note.trim()}` : useCase
      await apiKeysService.request(reason)
      setReqSuccess(true)
      // refresh list after success
      const res = await apiKeysService.myKeys()
      setKeys(Array.isArray(res) ? res : (res.data || []))
    } catch (err: any) {
      setReqError(err?.response?.data?.message || err.message || 'Gagal mengirim permintaan.')
    } finally {
      setRequesting(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await apiKeysService.deleteMyKey(id)
      setConfirmDeleteId(null)
      const res = await apiKeysService.myKeys()
      setKeys(Array.isArray(res) ? res : (res.data || []))
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menghapus key.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRenew = async (id: string) => {
    setRenewingId(id)
    setRenewMsg(prev => ({ ...prev, [id]: '' }))
    try {
      const res = await apiKeysService.renew(id)
      const exp = res.expiresAt ? new Date(res.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
      setRenewMsg(prev => ({ ...prev, [id]: `Diperpanjang hingga ${exp}` }))
      // refresh
      const keysRes = await apiKeysService.myKeys()
      setKeys(Array.isArray(keysRes) ? keysRes : (keysRes.data || []))
    } catch (err: any) {
      setRenewMsg(prev => ({ ...prev, [id]: err?.response?.data?.message || 'Gagal renew.' }))
    } finally {
      setRenewingId(null)
    }
  }

  const activeKeys = keys.filter(k => getStatus(k) === 'active')
  const pendingKeys = keys.filter(k => getStatus(k) === 'pending')

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: -0.3 }}>
            Dashboard
          </h1>
          {user && (
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              Selamat datang, <strong style={{ color: '#374151' }}>
                {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
              </strong>
            </p>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>Memuat data...</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Total Key', value: keys.length, color: '#4f46e5' },
                { label: 'Aktif', value: activeKeys.length, color: '#16a34a' },
                { label: 'Menunggu', value: pendingKeys.length, color: '#ca8a04' },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
                  padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ fontSize: 30, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* API Keys section */}
            <div style={{
              background: '#fff', borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              marginBottom: 20,
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>API Key Saya</h2>
                <button onClick={openModal} style={{
                  fontSize: 13, fontWeight: 600, color: '#fff',
                  background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                  padding: '7px 14px', borderRadius: 8, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 1px 6px rgba(79,70,229,0.3)',
                }}>
                  + Request API Key
                </button>
              </div>

              {keys.length === 0 ? (
                <div style={{ padding: '52px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🔑</div>
                  <p style={{ color: '#374151', fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>Belum punya API Key</p>
                  <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 20px' }}>Request sekarang, gratis untuk coba.</p>
                  <button onClick={openModal} style={{
                    padding: '10px 22px',
                    background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                    color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit', boxShadow: '0 2px 10px rgba(79,70,229,0.3)',
                  }}>
                    Request API Key →
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {keys.map((k, i) => {
                    const status = getStatus(k)
                    const expiring = isExpiringSoon(k.expiresAt)
                    const expired = isExpired(k.expiresAt)
                    const id = k.id || k._id
                    return (
                      <div key={id} style={{
                        padding: '16px 20px',
                        borderTop: i === 0 ? 'none' : '1px solid #f1f5f9',
                        display: 'flex', alignItems: 'flex-start', gap: 14,
                      }}>
                        {/* Status indicator */}
                        <div style={{
                          width: 36, height: 36, borderRadius: 9, flexShrink: 0, marginTop: 2,
                          background: status === 'active' ? '#dcfce7' : status === 'pending' ? '#fef9c3' : '#f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                        }}>
                          {status === 'active' ? '✓' : status === 'pending' ? '⏳' : '✕'}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <StatusBadge status={status} />
                            {expiring && (
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: 9999 }}>
                                Segera Kedaluwarsa
                              </span>
                            )}
                            {expired && (
                              <span style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: 9999 }}>
                                Kedaluwarsa
                              </span>
                            )}
                          </div>

                          {/* Key value */}
                          {status === 'active' ? (
                            <code style={{
                              display: 'block', fontSize: 12,
                              fontFamily: 'ui-monospace, Consolas, monospace',
                              background: '#f8fafc', border: '1px solid #e2e8f0',
                              padding: '6px 10px', borderRadius: 6,
                              color: '#334155', wordBreak: 'break-all',
                              marginBottom: 6,
                            }}>
                              {k.key}
                            </code>
                          ) : status === 'pending' ? (
                            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 6px' }}>
                              Permintaan sedang diproses admin.
                              {k.description && <span style={{ color: '#94a3b8' }}> ({k.description})</span>}
                            </p>
                          ) : (
                            <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 6px' }}>
                              Key ini sudah tidak aktif.
                            </p>
                          )}

                          {/* Meta info */}
                          <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94a3b8', flexWrap: 'wrap' }}>
                            <span>Dibuat: {new Date(k.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            {k.expiresAt && (
                              <span style={{ color: expired ? '#dc2626' : expiring ? '#d97706' : '#94a3b8' }}>
                                Berlaku: {new Date(k.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            )}
                            {!k.expiresAt && status === 'active' && <span>Berlaku: Selamanya</span>}
                          </div>

                          {renewMsg[id] && (
                            <p style={{ fontSize: 12, color: '#16a34a', margin: '4px 0 0', fontWeight: 500 }}>
                              ✓ {renewMsg[id]}
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                          {/* Renew — hanya untuk key aktif yang punya expiry */}
                          {status === 'active' && k.expiresAt && (
                            <button
                              onClick={() => handleRenew(id)}
                              disabled={renewingId === id}
                              style={{
                                padding: '6px 14px',
                                background: renewingId === id ? '#f1f5f9' : '#eef2ff',
                                color: renewingId === id ? '#94a3b8' : '#4f46e5',
                                border: `1px solid ${renewingId === id ? '#e2e8f0' : '#c7d2fe'}`,
                                borderRadius: 7, fontSize: 12, fontWeight: 600,
                                cursor: renewingId === id ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit', whiteSpace: 'nowrap',
                              }}
                            >
                              {renewingId === id ? '...' : '↻ Renew'}
                            </button>
                          )}

                          {/* Hapus — inline confirm */}
                          {confirmDeleteId === id ? (
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                onClick={() => handleDelete(id)}
                                disabled={deletingId === id}
                                style={{
                                  padding: '5px 10px', background: '#dc2626', color: '#fff',
                                  border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 700,
                                  cursor: deletingId === id ? 'not-allowed' : 'pointer',
                                  fontFamily: 'inherit', whiteSpace: 'nowrap',
                                }}
                              >
                                {deletingId === id ? '...' : 'Yakin?'}
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                style={{
                                  padding: '5px 8px', background: '#f1f5f9', color: '#374151',
                                  border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
                                  cursor: 'pointer', fontFamily: 'inherit',
                                }}
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(id)}
                              style={{
                                padding: '6px 14px', background: '#fff', color: '#dc2626',
                                border: '1px solid #fecaca', borderRadius: 7,
                                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'inherit', whiteSpace: 'nowrap',
                              }}
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Quick links */}
            {/* <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              <Link to="/payments/upload" style={{
                display: 'block', textDecoration: 'none',
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: 10, padding: '18px 20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Upload Bukti Pembayaran</p>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Kirim bukti transfer untuk diverifikasi admin</p>
              </Link>
              <a href={import.meta.env.VITE_SWAGGER_URL || 'http://localhost:3000/api/docs'} target="_blank" rel="noreferrer" style={{
                display: 'block', textDecoration: 'none',
                background: '#fff', border: '1px solid #e2e8f0',
                borderRadius: 10, padding: '18px 20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Dokumentasi API</p>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Jelajahi semua endpoint yang tersedia</p>
              </a>
            </div> */}
          </>
        )}
      </div>

      {/* ── Request API Key Modal ── */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Request API Key">
        {!reqSuccess ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 10px' }}>
                Untuk kebutuhan apa? <span style={{ color: '#ef4444' }}>*</span>
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {USE_CASES.map(uc => (
                  <button key={uc.id} type="button" onClick={() => setUseCase(uc.label)} style={{
                    padding: '12px 14px',
                    border: `2px solid ${useCase === uc.label ? '#4f46e5' : '#e2e8f0'}`,
                    borderRadius: 10,
                    background: useCase === uc.label ? '#eef2ff' : '#fff',
                    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{uc.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: useCase === uc.label ? '#4f46e5' : '#0f172a' }}>{uc.label}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{uc.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Catatan singkat <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opsional)</span>
              </label>
              <input
                type="text" value={note} onChange={e => setNote(e.target.value)} maxLength={100}
                placeholder="Contoh: untuk fitur autocomplete alamat"
                style={{
                  display: 'block', width: '100%', padding: '10px 14px',
                  border: '1px solid #d1d5db', borderRadius: 8,
                  fontSize: 14, color: '#0f172a', outline: 'none',
                  fontFamily: 'inherit', boxSizing: 'border-box',
                }}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
                onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {reqError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626' }}>
                {reqError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={() => setShowModal(false)} style={{
                flex: 1, padding: '11px', background: '#f1f5f9', color: '#374151',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>Batal</button>
              <button type="button" onClick={handleRequest} disabled={!useCase || requesting} style={{
                flex: 2, padding: '11px',
                background: !useCase || requesting ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700,
                cursor: !useCase || requesting ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                boxShadow: !useCase || requesting ? 'none' : '0 2px 8px rgba(79,70,229,0.3)',
              }}>
                {requesting ? 'Mengirim...' : 'Kirim Permintaan'}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 22, color: '#fff',
            }}>✓</div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Permintaan Terkirim!</h3>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
              Status akan berubah ke <strong>Aktif</strong> setelah admin menyetujui.
            </p>
            <button onClick={() => setShowModal(false)} style={{
              width: '100%', padding: '11px',
              background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
              color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}>Oke, Tutup</button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
