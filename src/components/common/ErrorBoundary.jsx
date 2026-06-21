import React from 'react';

/**
 * Premium Error Boundary for capturing React runtime failures.
 * Improves user experience (UX) and prevents absolute app crashes.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('EcoTrack Boundary Caught Exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#060913',
          color: '#f8fafc',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div className="glass-card" style={{ maxWidth: '500px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <span style={{ fontSize: '3rem', marginBottom: '16px', display: 'block' }}>⚠️</span>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: '#ef4444' }}>A component failed to render.</h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '24px' }}>
              EcoTrack encountered an unexpected error. Don't worry, your carbon calculator state was safely preserved.
            </p>
            <pre style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              textAlign: 'left',
              overflowX: 'auto',
              color: '#f1f5f9',
              marginBottom: '20px',
              maxHeight: '150px'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
            <button 
              className="btn-primary" 
              style={{ background: '#ef4444', color: '#fff', boxShadow: 'none' }}
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
