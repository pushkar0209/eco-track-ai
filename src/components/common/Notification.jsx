import { useEffect } from 'react';
import { X, Check } from 'lucide-react';

/**
 * Toast notification for non-blocking feedback.
 * Replaces standard browser alerts with accessible, premium toast alerts.
 */
export function Notification({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div 
      className={`glass-card toast-notification ${type}`}
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 20px',
        background: 'rgba(15, 23, 42, 0.95)',
        borderLeft: '4px solid var(--primary)',
        borderColor: type === 'danger' ? 'var(--danger)' : 'var(--primary)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        animation: 'slideIn 0.2s ease-out'
      }}
    >
      <div style={{
        background: type === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-glow)',
        padding: '6px',
        borderRadius: '50%',
        color: type === 'danger' ? 'var(--danger)' : 'var(--primary)'
      }}>
        <Check size={16} strokeWidth={3} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
          {message}
        </p>
      </div>
      <button 
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          padding: 4
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
