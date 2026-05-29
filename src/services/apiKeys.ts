import api from './api'

const apiKeys = {
  // ── User endpoints ─────────────────────────────────────────────

  // Lihat semua key milik sendiri (active + pending + inactive)
  async myKeys(page = 1, limit = 20) {
    const res = await api.get('/api-keys/my', { params: { page, limit } })
    return res.data
  },

  // Request API key baru
  async request(reason: string) {
    const res = await api.post('/api-keys/request', { reason })
    return res.data
  },

  // Perpanjang expiry key sendiri (+30 hari)
  async renew(id: string) {
    const res = await api.put(`/api-keys/${id}/renew`)
    return res.data
  },

  // Hapus key sendiri
  async deleteMyKey(id: string) {
    const res = await api.delete(`/api-keys/mine/${id}`)
    return res.data
  },

  // ── Admin endpoints ────────────────────────────────────────────

  // Semua key (active)
  async getAll(page = 1, limit = 20) {
    const res = await api.get('/api-keys', { params: { page, limit } })
    return res.data
  },

  // Pending requests
  async pendingRequests(page = 1, limit = 20) {
    const res = await api.get('/api-keys/requests', { params: { page, limit } })
    return res.data
  },

  // Approve pending request
  async approve(id: string) {
    const res = await api.put(`/api-keys/${id}/approve`)
    return res.data
  },

  // Tolak pending request (hapus dokumen)
  async rejectRequest(id: string) {
    const res = await api.delete(`/api-keys/${id}`)
    return res.data
  },

  // Revoke key aktif (nonaktifkan)
  async revokeKey(id: string) {
    const res = await api.put(`/api-keys/${id}/revoke`)
    return res.data
  },
}

export default apiKeys
