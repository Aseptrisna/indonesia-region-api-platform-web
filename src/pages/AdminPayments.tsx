import React, { useEffect, useState } from 'react'
import payments from '../services/payments'
import Modal from '../components/Modal'
import DashboardLayout from '../components/DashboardLayout'

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING:  { bg: '#fef9c3', text: '#ca8a04', dot: '#ca8a04' },
  APPROVED: { bg: '#dcfce7', text: '#16a34a', dot: '#16a34a' },
  REJECTED: { bg: '#fee2e2', text: '#dc2626', dot: '#dc2626' },
}

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '9px 12px',
  border: '1px solid #d1d5db', borderRadius: 8,
  fontSize: 14, color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', resize: 'vertical' as const,
  background: '#fff',
}

function formatIDR(amount: number | undefined) {
  if (!amount) return '—'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function AdminPayments() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [showReview, setShowReview] = useState(false)
  const [selected, setSelected] = useState<any>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED')

  const load = async () => {
    setLoading(true)
    try {
      const res = await payments.allPayments()
      setItems(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openReview = (it: any, status: 'APPROVED' | 'REJECTED') => {
    setSelected(it)
    setReviewNote('')
    setReviewStatus(status)
    setShowReview(true)
  }

  const doReview = async () => {
    if (!selected) return
    try {
      await payments.review(selected._id, reviewStatus, reviewNote || undefined)
      setShowReview(false)
      await load()
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message || 'Review gagal')
    }
  }

  const pending = items.filter(it => it.status === 'PENDING')
  const approved = items.filter(it => it.status === 'APPROVED')

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: -0.3 }}>
            Manajemen Pembayaran
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            Review dan konfirmasi bukti pembayaran dari pengguna.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total', value: items.length, color: '#4f46e5' },
            { label: 'Menunggu', value: pending.length, color: '#ca8a04' },
            { label: 'Disetujui', value: approved.length, color: '#16a34a' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e2e8f0', padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>Memuat data...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['User', 'Jumlah', 'Bank', 'Tanggal Transfer', 'Bukti', 'Status', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                      Tidak ada data pembayaran.
                    </td>
                  </tr>
                ) : items.map(it => {
                  const sc = statusStyle[it.status] || statusStyle.PENDING
                  return (
                    <tr key={it._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151', fontWeight: 500 }}>
                        {it.user?.email || it.userEmail || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#0f172a', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {formatIDR(it.amount)}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#374151' }}>
                        {it.bankName || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
                        {it.transferDate ? new Date(it.transferDate).toLocaleDateString('id-ID') : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {it.proofUrl ? (
                          <a href={it.proofUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
                            Lihat
                          </a>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: sc.bg, color: sc.text }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                          {it.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {it.status === 'PENDING' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => openReview(it, 'APPROVED')} style={{ padding: '5px 10px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                              Setujui
                            </button>
                            <button onClick={() => openReview(it, 'REJECTED')} style={{ padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                              Tolak
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>Selesai</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        show={showReview}
        onClose={() => setShowReview(false)}
        title={reviewStatus === 'APPROVED' ? 'Setujui Pembayaran' : 'Tolak Pembayaran'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 14, color: '#374151', margin: 0 }}>
            Review pembayaran dari{' '}
            <strong>{selected?.user?.email || selected?.userEmail}</strong>
            {selected?.amount && (
              <span style={{ color: '#16a34a', fontWeight: 700 }}> — {formatIDR(selected.amount)}</span>
            )}
          </p>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
              Catatan (opsional)
            </label>
            <textarea
              style={inputStyle}
              rows={3}
              value={reviewNote}
              onChange={e => setReviewNote(e.target.value)}
              placeholder="Tambahkan catatan untuk pengguna..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => setShowReview(false)} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
            <button
              onClick={doReview}
              style={{ padding: '8px 16px', background: reviewStatus === 'APPROVED' ? '#16a34a' : '#dc2626', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              {reviewStatus === 'APPROVED' ? 'Setujui' : 'Tolak'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
