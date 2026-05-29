import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import payments from '../services/payments'
import api from '../services/api'
import DashboardLayout from '../components/DashboardLayout'

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '10px 14px',
  border: '1px solid #d1d5db', borderRadius: 8,
  fontSize: 14, color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', background: '#fff',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 600,
  color: '#374151', marginBottom: 6,
}

export default function PaymentUpload() {
  const [proofUrl, setProofUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [amount, setAmount] = useState('')
  const [transferDate, setTransferDate] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountName, setAccountName] = useState('')
  const [destinationAccount, setDestinationAccount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#6366f1'
    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#d1d5db'
    e.target.style.boxShadow = 'none'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      let urlToSubmit = proofUrl
      if (file) {
        const form = new FormData()
        form.append('file', file)
        const up = await api.post('/payments/proofs/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        urlToSubmit = up.data.url
      }

      const payload: any = {
        amount: amount ? Number(amount) : undefined,
        transferDate: transferDate ? new Date(transferDate).toISOString() : undefined,
        bankName,
        accountName,
        destinationAccount,
        proofUrl: urlToSubmit,
        notes: note,
      }

      await payments.uploadProof(payload)
      setMessage('Bukti pembayaran berhasil dikirim. Menunggu konfirmasi admin.')
      setProofUrl('')
      setFile(null)
      setAmount('')
      setTransferDate('')
      setBankName('')
      setAccountName('')
      setDestinationAccount('')
      setNote('')
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Upload gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: 640 }}>
        <Link to="/user" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', display: 'inline-block', marginBottom: 16 }}>
          ← Kembali ke Dashboard
        </Link>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: -0.3 }}>
            Upload Bukti Pembayaran
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
            Isi detail transfer dan upload bukti pembayaran Anda.
          </p>
        </div>

        {/* Rekening tujuan info */}
        <div style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px', marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#92400e', margin: '0 0 6px' }}>Rekening Tujuan Transfer</p>
          <p style={{ fontSize: 13, color: '#78350f', margin: '0 0 4px' }}>Bank: <strong>BCA</strong> | No. Rek: <strong>1234567890</strong></p>
          <p style={{ fontSize: 13, color: '#78350f', margin: 0 }}>Atas Nama: <strong>PT Logic Frame Indonesia</strong></p>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Amount */}
            <div>
              <label style={labelStyle}>Jumlah Transfer (IDR)</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Contoh: 150000"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Date */}
            <div>
              <label style={labelStyle}>Tanggal & Waktu Transfer</label>
              <input
                type="datetime-local"
                value={transferDate}
                onChange={e => setTransferDate(e.target.value)}
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Bank details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Nama Bank Pengirim</label>
                <input
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="Contoh: BCA, Mandiri, BNI"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Nama Pemilik Rekening</label>
                <input
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  placeholder="Nama sesuai rekening"
                  style={inputStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label style={labelStyle}>Nomor Rekening Tujuan</label>
              <input
                value={destinationAccount}
                onChange={e => setDestinationAccount(e.target.value)}
                placeholder="Nomor rekening yang Anda transfer ke"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Proof upload */}
            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 8, border: '2px dashed #d1d5db' }}>
              <label style={{ ...labelStyle, marginBottom: 10 }}>Bukti Pembayaran</label>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Upload file gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                  style={{ fontSize: 13, color: '#374151', cursor: 'pointer' }}
                />
                {file && <p style={{ fontSize: 12, color: '#16a34a', margin: '6px 0 0', fontWeight: 600 }}>File dipilih: {file.name}</p>}
              </div>
              <div style={{ borderTop: '1px dashed #d1d5db', paddingTop: 10 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>Atau paste URL gambar</label>
                <input
                  value={proofUrl}
                  onChange={e => setProofUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ ...inputStyle, fontSize: 13 }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label style={labelStyle}>Catatan (opsional)</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Informasi tambahan jika diperlukan..."
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {message && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#16a34a', fontWeight: 500 }}>
                {message}
              </div>
            )}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px',
                background: loading ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #6d28d9)',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: loading ? 'none' : '0 2px 10px rgba(79,70,229,0.3)',
              }}
            >
              {loading ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
