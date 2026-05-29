import api from './api'

const users = {
  async list(page = 1, limit = 20, role?: string) {
    const res = await api.get('/users', { params: { page, limit, role } })
    return res.data
  },
  async create(payload: any) {
    const res = await api.post('/users', payload)
    return res.data
  },
  async updateRole(id: string, role: string) {
    const res = await api.put(`/users/${id}/role`, { role })
    return res.data
  },
  async deactivate(id: string) {
    const res = await api.put(`/users/${id}/deactivate`)
    return res.data
  },
  async resetPassword(id: string, newPassword: string) {
    const res = await api.put(`/users/${id}/reset-password`, { newPassword })
    return res.data
  },
  async getMe() {
    const res = await api.get('/users/me')
    return res.data
  },
  async updateProfile(payload: { firstName?: string; lastName?: string; phone?: string; company?: string; website?: string }) {
    const res = await api.put('/users/me', payload)
    return res.data
  },
  async changePassword(oldPassword: string, newPassword: string) {
    const res = await api.put('/users/me/change-password', { oldPassword, newPassword })
    return res.data
  },
}

export default users
