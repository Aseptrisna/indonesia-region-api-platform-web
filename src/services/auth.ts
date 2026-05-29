import api from './api'

type LoginResp = {
  accessToken: string
  refreshToken?: string
  user?: any
}

const auth = {
  async login(email: string, password: string): Promise<LoginResp> {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken)
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken)
    }
    return data
  },

  async register(email: string, password: string, firstName: string, lastName: string) {
    const res = await api.post('/auth/register', { email, password, firstName, lastName })
    return res.data
  },

  async logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  async getProfile() {
    const res = await api.get('/users/me')
    return res.data
  },

  async requestEmailVerification(email: string) {
    const res = await api.post('/auth/verify-email/request', { email })
    return res.data
  },

  async confirmEmailVerification(token: string) {
    const res = await api.post('/auth/verify-email/confirm', { token })
    return res.data
  },

  async forgotPassword(email: string) {
    const res = await api.post('/auth/forgot-password', { email })
    return res.data
  },

  async resetPassword(token: string, password: string) {
    const res = await api.post('/auth/reset-password', { token, newPassword: password })
    return res.data
  }
}

export default auth
