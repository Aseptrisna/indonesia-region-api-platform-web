import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import type { ReactNode } from 'react'

interface JwtPayload {
  email?: string
  role?: string
  sub?: string
}

function getUser(): { email: string; role: string } | null {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    const decoded = jwtDecode<JwtPayload>(token)
    return {
      email: decoded.email || decoded.sub || '',
      role: decoded.role || 'USER',
    }
  } catch {
    return null
  }
}

const adminMenu = [
  { path: '/admin', label: 'Dashboard', exact: true },
  { path: '/admin/users', label: 'User Management', exact: false },
  { path: '/admin/api-keys', label: 'API Keys', exact: false },
  // { path: '/admin/payments', label: 'Payments', exact: false },
  { path: '/profile', label: 'Profil', exact: true },
]

const userMenu = [
  { path: '/user', label: 'Dashboard', exact: true },
  { path: '/request-api-key', label: 'Request API Key', exact: true },
  // { path: '/payments/upload', label: 'Upload Payment', exact: true },
  { path: '/profile', label: 'Profil', exact: true },
]

const sidebarStyle: React.CSSProperties = {
  width: 240,
  minWidth: 240,
  background: '#1e1b4b',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky' as const,
  top: 0,
  height: '100vh',
  overflowY: 'auto',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getUser()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const menu = isAdmin ? adminMenu : userMenu

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    navigate('/')
  }

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* ── Sidebar ── */}
      <aside style={sidebarStyle}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3, color: '#818cf8', textTransform: 'uppercase', marginBottom: 4 }}>
              Indonesia Region
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
              API Platform
            </div>
          </Link>
        </div>

        {/* User info */}
        {user && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, color: '#818cf8', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Signed in as
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#e0e7ff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: 6,
            }}>
              {user.email}
            </div>
            <span style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 10px',
              borderRadius: 9999,
              background: 'rgba(129, 140, 248, 0.2)',
              color: '#a5b4fc',
              letterSpacing: 0.3,
            }}>
              {user.role}
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '10px 10px' }}>
          {menu.map(item => {
            const active = isActive(item.path, item.exact)
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '9px 12px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  marginBottom: 2,
                  color: active ? '#fff' : '#c7d2fe',
                  background: active ? 'rgba(99, 102, 241, 0.55)' : 'transparent',
                  transition: 'background 0.12s, color 0.12s',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.2)'
                    ;(e.currentTarget as HTMLElement).style.color = '#fff'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#c7d2fe'
                  }
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '9px 12px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: '#fca5a5',
              fontSize: 14,
              fontWeight: 500,
              textAlign: 'left',
              fontFamily: 'inherit',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(220,38,38,0.15)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, minHeight: '100vh', overflowX: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
