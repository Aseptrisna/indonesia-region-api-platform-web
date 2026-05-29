import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import RequestApiKey from './pages/RequestApiKey'
import AdminApiKeys from './pages/AdminApiKeys'
import PaymentUpload from './pages/PaymentUpload'
import AdminPayments from './pages/AdminPayments'
import AdminUsers from './pages/AdminUsers'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/request-api-key" element={<RequestApiKey />} />
        <Route path="/payments/upload" element={<PaymentUpload />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/api-keys" element={<AdminApiKeys />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App
