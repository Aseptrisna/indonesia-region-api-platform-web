import type { ReactNode } from 'react'

type Props = {
  title?: string
  show: boolean
  onClose: () => void
  children?: ReactNode
}

export default function Modal({ title, show, onClose, children }: Props) {
  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Dialog */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: '#fff', borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)',
        width: '100%', maxWidth: 500,
        padding: '28px 28px 24px',
        border: '1px solid #e2e8f0',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          {title && (
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            style={{
              marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 6, border: 'none',
              background: '#f1f5f9', color: '#64748b', cursor: 'pointer',
              fontSize: 16, lineHeight: 1, fontFamily: 'inherit',
              flexShrink: 0,
            }}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ fontSize: 14, color: '#374151' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
