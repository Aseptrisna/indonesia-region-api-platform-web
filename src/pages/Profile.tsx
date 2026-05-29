import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import users from '../services/users'

interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  website?: string
  role: string
  emailVerified: boolean
  isActive: boolean
  createdAt: string
}

function getInitials(profile: UserProfile | null): string {
  if (!profile) return '?'
  const first = profile.firstName?.[0] || ''
  const last = profile.lastName?.[0] || ''
  if (first || last) return (first + last).toUpperCase()
  return profile.email?.[0]?.toUpperCase() || '?'
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '#e2e8f0' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Lemah', color: '#ef4444' }
  if (score <= 2) return { score, label: 'Cukup', color: '#f59e0b' }
  if (score <= 3) return { score, label: 'Baik', color: '#3b82f6' }
  return { score, label: 'Kuat', color: '#10b981' }
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Edit profile state
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '', company: '', website: '' })
  const [editSaving, setEditSaving] = useState(false)
  const [editMsg, setEditMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Change password state
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    users.getMe()
      .then((data: any) => {
        const p = data.data ?? data
        setProfile(p)
        setEditForm({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          phone: p.phone || '',
          company: p.company || '',
          website: p.website || '',
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setEditSaving(true)
    setEditMsg(null)
    try {
      const updated = await users.updateProfile(editForm)
      const p = updated.data ?? updated
      setProfile(p)
      setEditMsg({ type: 'success', text: 'Profil berhasil diperbarui.' })
    } catch (err: any) {
      setEditMsg({ type: 'error', text: err?.response?.data?.message || 'Gagal memperbarui profil.' })
    } finally {
      setEditSaving(false)
    }
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMsg(null)
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwMsg({ type: 'error', text: 'Konfirmasi password tidak cocok.' })
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'Password baru minimal 6 karakter.' })
      return
    }
    setPwSaving(true)
    try {
      await users.changePassword(pwForm.oldPassword, pwForm.newPassword)
      setPwMsg({ type: 'success', text: 'Password berhasil diubah.' })
      setPwForm({ oldPassword: '', newPassword: '', confirm: '' })
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err?.response?.data?.message || 'Gagal mengubah password.' })
    } finally {
      setPwSaving(false)
    }
  }

  const strength = passwordStrength(pwForm.newPassword)

  const roleLabel: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    developer: 'Developer',
    business: 'Business',
    user: 'User',
  }

  const roleColor: Record<string, { bg: string; color: string }> = {
    super_admin: { bg: '#fef3c7', color: '#92400e' },
    admin: { bg: '#fee2e2', color: '#991b1b' },
    developer: { bg: '#ede9fe', color: '#5b21b6' },
    business: { bg: '#d1fae5', color: '#065f46' },
    user: { bg: '#e0f2fe', color: '#075985' },
  }

  const roleBadge = roleColor[profile?.role || ''] || { bg: '#f1f5f9', color: '#475569' }

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: 760, margin: '0 auto' }}>
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: -0.3 }}>
            Manajemen Profil
          </h1>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
            Perbarui informasi profil dan keamanan akun Anda.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0', fontSize: 14 }}>
            Memuat profil...
          </div>
        ) : (
          <>
            {/* ── Profile header card ── */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '24px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              {/* Avatar */}
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                fontWeight: 800,
                color: '#fff',
                flexShrink: 0,
                letterSpacing: -1,
              }}>
                {getInitials(profile)}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
                  {[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || profile?.email}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{profile?.email}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 10px',
                    borderRadius: 9999,
                    background: roleBadge.bg,
                    color: roleBadge.color,
                    letterSpacing: 0.3,
                  }}>
                    {roleLabel[profile?.role || ''] || profile?.role}
                  </span>
                  {profile?.emailVerified && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#10b981' }}>
                      Email Terverifikasi
                    </span>
                  )}
                  {profile?.createdAt && (
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                      Bergabung {new Date(profile.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Edit profile card ── */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '24px',
              marginBottom: 20,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>
                Informasi Profil
              </h2>

              <form onSubmit={handleEditSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px', marginBottom: 14 }}>
                  {/* First name */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Nama Depan
                    </label>
                    <input
                      value={editForm.firstName}
                      onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))}
                      placeholder="Nama depan"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        padding: '9px 12px', fontSize: 14, color: '#0f172a',
                        outline: 'none', fontFamily: 'inherit',
                        background: '#f8fafc',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                  </div>
                  {/* Last name */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Nama Belakang
                    </label>
                    <input
                      value={editForm.lastName}
                      onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))}
                      placeholder="Nama belakang"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        padding: '9px 12px', fontSize: 14, color: '#0f172a',
                        outline: 'none', fontFamily: 'inherit',
                        background: '#f8fafc',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                  </div>
                  {/* Phone */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+62 812 3456 7890"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        padding: '9px 12px', fontSize: 14, color: '#0f172a',
                        outline: 'none', fontFamily: 'inherit',
                        background: '#f8fafc',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                  </div>
                  {/* Company */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                      Perusahaan
                    </label>
                    <input
                      value={editForm.company}
                      onChange={e => setEditForm(f => ({ ...f, company: e.target.value }))}
                      placeholder="Nama perusahaan"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        padding: '9px 12px', fontSize: 14, color: '#0f172a',
                        outline: 'none', fontFamily: 'inherit',
                        background: '#f8fafc',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                  </div>
                </div>

                {/* Website */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))}
                    placeholder="https://example.com"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      border: '1.5px solid #e2e8f0', borderRadius: 8,
                      padding: '9px 12px', fontSize: 14, color: '#0f172a',
                      outline: 'none', fontFamily: 'inherit',
                      background: '#f8fafc',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                  />
                </div>

                {editMsg && (
                  <div style={{
                    marginBottom: 14,
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    background: editMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: editMsg.type === 'success' ? '#15803d' : '#dc2626',
                    border: `1px solid ${editMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  }}>
                    {editMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={editSaving}
                  style={{
                    padding: '10px 24px',
                    background: editSaving ? '#a5b4fc' : '#4f46e5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: editSaving ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.15s',
                  }}
                >
                  {editSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>

            {/* ── Change password card ── */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: '24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                Ubah Password
              </h2>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 20px' }}>
                Gunakan password yang kuat dan unik.
              </p>

              <form onSubmit={handlePasswordSave}>
                {/* Old password */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Password Lama
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showOld ? 'text' : 'password'}
                      value={pwForm.oldPassword}
                      onChange={e => setPwForm(f => ({ ...f, oldPassword: e.target.value }))}
                      placeholder="Password saat ini"
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        padding: '9px 40px 9px 12px', fontSize: 14, color: '#0f172a',
                        outline: 'none', fontFamily: 'inherit',
                        background: '#f8fafc',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOld(v => !v)}
                      style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', fontSize: 12, padding: '2px 4px',
                      }}
                    >
                      {showOld ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Password Baru
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={pwForm.newPassword}
                      onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                      placeholder="Password baru"
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        padding: '9px 40px 9px 12px', fontSize: 14, color: '#0f172a',
                        outline: 'none', fontFamily: 'inherit',
                        background: '#f8fafc',
                      }}
                      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff' }}
                      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(v => !v)}
                      style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', fontSize: 12, padding: '2px 4px',
                      }}
                    >
                      {showNew ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                </div>

                {/* Strength bar */}
                {pwForm.newPassword && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                          flex: 1, height: 4, borderRadius: 2,
                          background: i <= strength.score ? strength.color : '#e2e8f0',
                          transition: 'background 0.2s',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}

                {/* Confirm password */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    Konfirmasi Password Baru
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                      placeholder="Ulangi password baru"
                      required
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: `1.5px solid ${pwForm.confirm && pwForm.confirm !== pwForm.newPassword ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: 8,
                        padding: '9px 40px 9px 12px', fontSize: 14, color: '#0f172a',
                        outline: 'none', fontFamily: 'inherit',
                        background: '#f8fafc',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = pwForm.confirm && pwForm.confirm !== pwForm.newPassword ? '#ef4444' : '#6366f1'
                        e.target.style.background = '#fff'
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = pwForm.confirm && pwForm.confirm !== pwForm.newPassword ? '#ef4444' : '#e2e8f0'
                        e.target.style.background = '#f8fafc'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', fontSize: 12, padding: '2px 4px',
                      }}
                    >
                      {showConfirm ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  {pwForm.confirm && pwForm.confirm !== pwForm.newPassword && (
                    <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>Password tidak cocok.</p>
                  )}
                </div>

                {pwMsg && (
                  <div style={{
                    marginBottom: 14,
                    padding: '10px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    background: pwMsg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                    color: pwMsg.type === 'success' ? '#15803d' : '#dc2626',
                    border: `1px solid ${pwMsg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                  }}>
                    {pwMsg.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pwSaving}
                  style={{
                    padding: '10px 24px',
                    background: pwSaving ? '#fca5a5' : '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: pwSaving ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.15s',
                  }}
                >
                  {pwSaving ? 'Menyimpan...' : 'Ubah Password'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
