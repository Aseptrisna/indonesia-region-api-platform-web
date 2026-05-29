import api from './api'

type UploadPayload = {
  amount?: number
  transferDate?: string
  bankName?: string
  accountName?: string
  destinationAccount?: string
  proofUrl: string
  notes?: string
}

const payments = {
  async uploadProof(payload: UploadPayload) {
    const res = await api.post('/payments/proofs', payload)
    return res.data
  },

  async myPayments() {
    const res = await api.get('/payments/my')
    return res.data
  },

  async allPayments() {
    const res = await api.get('/payments')
    return res.data
  },

  async review(id: string, status: 'APPROVED' | 'REJECTED', note?: string) {
    const res = await api.put(`/payments/${id}/review`, { status, reviewNotes: note })
    return res.data
  }
}

export default payments
