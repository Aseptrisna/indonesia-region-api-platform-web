import { useEffect, useState } from 'react'
import apiKeysService from '../services/apiKeys'
import DashboardLayout from '../components/DashboardLayout'
import Modal from '../components/Modal'

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
      background: active ? '#dcfce7' : '#f1f5f9',
      color: active ? '#16a34a' : '#6b7280',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#16a34a' : '#9ca3af' }} />
      {active ? 'Aktif' : 'Nonaktif'}
    </span>
  )
}

function getUserDisplay(k: any) {
  const u = k.user
  if (!u) return k.userId || '—'
  if (u.firstName) return `${u.firstName} ${u.lastName} (${u.email})`
  return u.email || '—'
}

export default function AdminApiKeys() {
  const [pending, setPending] = useState<any[]>([])
  const [activeKeys, setActiveKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Confirm modal
  const [modal, setModal] = useState<{ type: 'approve' | 'revoke'; key: any } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [pendingRes, activeRes] = await Promise.all([
        apiKeysService.pendingRequests(),
        apiKeysService.getAll(),
      ])
      setPending(Array.isArray(pendingRes) ? pendingRes : (pendingRes.data || []))
      setActiveKeys(Array.isArray(activeRes) ? activeRes : (activeRes.data || []))
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const doApprove = async () => {
    if (!modal) return
    setActionLoading(true)
    try {
      await apiKeysService.approve(modal.key.id || modal.key._id)
      setModal(null)
      await load()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal approve')
    } finally {
      setActionLoading(false)
    }
  }

  const doReject = async () => {
    if (!modal) return
    setActionLoading(true)
    try {
      // Pending request → hapus dokumen
      await apiKeysService.rejectRequest(modal.key.id || modal.key._id)
      setModal(null)
      await load()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menolak')
    } finally {
      setActionLoading(false)
    }
  }

  const doRevoke = async () => {
    if (!modal) return
    setActionLoading(true)
    try {
      // Key aktif → nonaktifkan
      await apiKeysService.revokeKey(modal.key.id || modal.key._id)
      setModal(null)
      await load()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal revoke')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: -0.3 }}>
            Manajemen API Key
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            Review permintaan dan kelola key yang aktif.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Permintaan Masuk', value: pending.length, color: '#ca8a04', bg: '#fefce8' },
            { label: 'Key Aktif', value: activeKeys.filter(k => k.isActive).length, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Total Key', value: activeKeys.length, color: '#4f46e5', bg: '#eef2ff' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0',
              padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>Memuat data...</div>
        ) : (
          <>
            {/* ── Permintaan Masuk ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Permintaan Masuk
                </h2>
                {pending.length > 0 && (
                  <span style={{
                    background: '#fef3c7', color: '#d97706',
                    fontSize: 12, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 9999,
                  }}>
                    {pending.length} baru
                  </span>
                )}
              </div>

              {pending.length === 0 ? (
                <div style={{
                  background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0',
                  padding: '28px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Tidak ada permintaan masuk saat ini.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {pending.map(k => (
                    <div key={k.id || k._id} style={{
                      background: '#fff', borderRadius: 10,
                      border: '1px solid #fde68a',
                      padding: '16px 20px',
                      display: 'flex', alignItems: 'center', gap: 16,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                      {/* Avatar */}
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #fde68a, #fbbf24)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 16, fontWeight: 700, color: '#92400e',
                      }}>
                        {(k.user?.firstName?.[0] || k.user?.email?.[0] || '?').toUpperCase()}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
                          {getUserDisplay(k)}
                        </div>
                        {k.description && (
                          <div style={{ fontSize: 13, color: '#64748b' }}>
                            {k.description}
                          </div>
                        )}
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
                          {new Date(k.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => setModal({ type: 'approve', key: k })}
                          style={{
                            padding: '7px 16px', background: '#16a34a', color: '#fff',
                            border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setModal({ type: 'revoke', key: k })}
                          style={{
                            padding: '7px 14px', background: '#fff', color: '#dc2626',
                            border: '1px solid #fecaca', borderRadius: 7, fontSize: 13, fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Key Aktif ── */}
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 14px' }}>
                Semua API Key
              </h2>

              {activeKeys.length === 0 ? (
                <div style={{
                  background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0',
                  padding: '28px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>Belum ada API key yang diterbitkan.</p>
                </div>
              ) : (
                <div style={{
                  background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['API Key', 'Pemilik', 'Status', 'Berlaku', 'Aksi'].map(h => (
                          <th key={h} style={{
                            padding: '10px 16px', textAlign: 'left',
                            fontSize: 11, fontWeight: 700, color: '#64748b',
                            textTransform: 'uppercase', letterSpacing: 0.5,
                            borderBottom: '1px solid #e2e8f0',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeKeys.map((k, i) => (
                        <tr key={k.id || k._id} style={{ borderTop: i === 0 ? 'none' : '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', maxWidth: 260 }}>
                            <code style={{
                              fontFamily: 'ui-monospace, Consolas, monospace',
                              fontSize: 12, background: '#f1f5f9',
                              padding: '3px 7px', borderRadius: 4,
                              color: '#334155', wordBreak: 'break-all', display: 'block',
                            }}>
                              {k.key}
                            </code>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>
                            {k.user?.email || k.userEmail || '—'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <StatusBadge active={k.isActive} />
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                            {k.expiresAt
                              ? new Date(k.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                              : 'Selamanya'}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {k.isActive && (
                              <button
                                onClick={() => setModal({ type: 'revoke', key: k })}
                                style={{
                                  padding: '5px 12px', background: '#fff', color: '#dc2626',
                                  border: '1px solid #fecaca', borderRadius: 6,
                                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                                }}
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Confirm Modal ── */}
      {modal && (
        <Modal
          show={true}
          onClose={() => !actionLoading && setModal(null)}
          title={modal.type === 'approve' ? 'Approve Permintaan' : modal.key.isActive ? 'Revoke API Key' : 'Tolak Permintaan'}
        >
          <p style={{ fontSize: 14, color: '#374151', margin: '0 0 6px' }}>
            {modal.type === 'approve'
              ? `Aktifkan API key untuk ${getUserDisplay(modal.key)}?`
              : modal.key.isActive
                ? `Nonaktifkan API key milik ${modal.key.user?.email || '—'}?`
                : `Tolak permintaan dari ${getUserDisplay(modal.key)}?`
            }
          </p>
          {modal.key.description && (
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px', background: '#f8fafc', padding: '8px 12px', borderRadius: 6 }}>
              {modal.key.description}
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <button
              onClick={() => setModal(null)}
              disabled={actionLoading}
              style={{
                padding: '8px 18px', background: '#f1f5f9', color: '#374151',
                border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Batal
            </button>
            <button
              onClick={
                modal.type === 'approve'
                  ? doApprove
                  : modal.key.isActive
                    ? doRevoke      // key aktif → revoke
                    : doReject      // pending request → tolak (delete)
              }
              disabled={actionLoading}
              style={{
                padding: '8px 18px',
                background: modal.type === 'approve' ? '#16a34a' : '#dc2626',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 700,
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: actionLoading ? 0.7 : 1,
              }}
            >
              {actionLoading
                ? 'Proses...'
                : modal.type === 'approve'
                  ? 'Ya, Approve'
                  : modal.key.isActive
                    ? 'Ya, Revoke'
                    : 'Ya, Tolak'
              }
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}
