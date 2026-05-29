import React, { useEffect, useState } from 'react'
import usersService from '../services/users'
import Modal from '../components/Modal'
import DashboardLayout from '../components/DashboardLayout'

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'USER']

const roleColor: Record<string, { bg: string; text: string }> = {
  SUPER_ADMIN: { bg: '#fdf2f8', text: '#9d174d' },
  ADMIN:       { bg: '#eef2ff', text: '#4338ca' },
  DEVELOPER:   { bg: '#f0fdf4', text: '#15803d' },
  USER:        { bg: '#f8fafc', text: '#475569' },
}

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '9px 12px',
  border: '1px solid #d1d5db', borderRadius: 8,
  fontSize: 14, color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', background: '#fff',
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [showRole, setShowRole] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await usersService.list(1, 50)
      setUsers(res.data || res)
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || 'Gagal memuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setFormEmail(''); setFormPassword(''); setShowCreate(true) }

  const submitCreate = async () => {
    try {
      await usersService.create({ email: formEmail, password: formPassword })
      setShowCreate(false)
      await load()
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message || 'Gagal membuat user')
    }
  }

  const openChangeRole = (u: any) => { setSelectedUser(u); setNewRole(u.role || ''); setShowRole(true) }

  const submitChangeRole = async () => {
    if (!selectedUser) return
    try {
      await usersService.updateRole(selectedUser.id || selectedUser._id, newRole)
      setShowRole(false)
      await load()
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message || 'Gagal mengubah role')
    }
  }

  const confirmDeactivate = async (u: any) => {
    if (!confirm(`Nonaktifkan user ${u.email}?`)) return
    try {
      await usersService.deactivate(u.id || u._id)
      await load()
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message || 'Gagal menonaktifkan user')
    }
  }

  const openReset = (u: any) => { setSelectedUser(u); setNewPassword(''); setShowReset(true) }

  const submitReset = async () => {
    if (!selectedUser) return
    try {
      await usersService.resetPassword(selectedUser.id || selectedUser._id, newPassword)
      setShowReset(false)
    } catch (e: any) {
      alert(e?.response?.data?.message || e.message || 'Gagal reset password')
    }
  }

  return (
    <DashboardLayout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: -0.3 }}>
              Manajemen User
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              Kelola akun, role, dan akses pengguna.
            </p>
          </div>
          <button
            onClick={openCreate}
            style={{ padding: '9px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
          >
            + Tambah User
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 14 }}>Memuat data...</div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Email', 'Role', 'Status', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid #e2e8f0' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
                      Tidak ada user ditemukan.
                    </td>
                  </tr>
                ) : users.map(u => {
                  const rc = roleColor[u.role] || roleColor.USER
                  return (
                    <tr key={u.id || u._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontSize: 14, color: '#0f172a', fontWeight: 500 }}>
                        {u.email}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 700, background: rc.bg, color: rc.text }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: u.isActive ? '#dcfce7' : '#f1f5f9', color: u.isActive ? '#16a34a' : '#6b7280' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.isActive ? '#16a34a' : '#9ca3af' }} />
                          {u.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            onClick={() => openChangeRole(u)}
                            style={{ padding: '5px 10px', background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Ubah Role
                          </button>
                          <button
                            onClick={() => openReset(u)}
                            style={{ padding: '5px 10px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Reset Password
                          </button>
                          <button
                            onClick={() => confirmDeactivate(u)}
                            style={{ padding: '5px 10px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                          >
                            Nonaktifkan
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create user modal */}
      <Modal show={showCreate} onClose={() => setShowCreate(false)} title="Tambah User Baru">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
            <input type="email" style={inputStyle} value={formEmail} onChange={e => setFormEmail(e.target.value)} placeholder="email@contoh.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password</label>
            <input type="password" style={inputStyle} value={formPassword} onChange={e => setFormPassword(e.target.value)} placeholder="Buat password" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
            <button onClick={() => setShowCreate(false)} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
            <button onClick={submitCreate} style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Buat User</button>
          </div>
        </div>
      </Modal>

      {/* Change role modal */}
      <Modal show={showRole} onClose={() => setShowRole(false)} title={`Ubah Role: ${selectedUser?.email}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Role Baru</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={newRole} onChange={e => setNewRole(e.target.value)}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => setShowRole(false)} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
            <button onClick={submitChangeRole} style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Simpan</button>
          </div>
        </div>
      </Modal>

      {/* Reset password modal */}
      <Modal show={showReset} onClose={() => setShowReset(false)} title={`Reset Password: ${selectedUser?.email}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Password Baru</label>
            <input type="password" style={inputStyle} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Masukkan password baru" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button onClick={() => setShowReset(false)} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#374151', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
            <button onClick={submitReset} style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Reset</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
