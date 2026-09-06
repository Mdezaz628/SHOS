import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[SHOS ErrorBoundary Caught Error]:', error, errorInfo);
    this.setState({ errorInfo });

    // Auto-report error to local backend telemetry
    try {
      fetch('http://localhost:5000/api/telemetry/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error?.message || String(error),
          stack: error?.stack,
          componentStack: errorInfo?.componentStack,
          url: window.location.href,
          localStorageKeys: Object.keys(localStorage)
        })
      }).catch(() => {});
    } catch (e) {}
  }

  handleCopyError = () => {
    const text = `${this.state.error?.toString()}\n\nStack:\n${this.state.error?.stack || ''}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || ''}`;
    navigator.clipboard?.writeText(text);
    alert('Error details copied to clipboard! You can paste it here.');
  };

  handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace('/admin');
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#071321',
            color: '#f8fafc',
            fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
            padding: '24px'
          }}
        >
          <div
            style={{
              maxWidth: '680px',
              width: '100%',
              backgroundColor: '#0b1b2f',
              border: '2px solid #e11d48',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(225, 29, 72, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(225, 29, 72, 0.15)',
                  border: '1.5px solid #e11d48',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}
              >
                ⚠️
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#fda4af', fontWeight: 800 }}>
                  SHOS Clinical Application Notice
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  A UI rendering exception was captured. State recovery is available.
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#050c15',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#f43f5e',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap'
              }}
            >
              {this.state.error?.toString() || 'Unknown runtime error'}
            </div>

            {this.state.errorInfo?.componentStack && (
              <details style={{ marginBottom: '24px', cursor: 'pointer' }}>
                <summary style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                  Inspect Component Stack
                </summary>
                <div
                  style={{
                    backgroundColor: '#050c15',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    padding: '12px',
                    marginTop: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {this.state.errorInfo.componentStack}
                </div>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReload}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                🔄 Refresh Page
              </button>

              <button
                onClick={this.handleCopyError}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '1px solid #38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                📋 Copy Error Details
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e11d48',
                  backgroundColor: 'rgba(225, 29, 72, 0.1)',
                  color: '#f43f5e',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                🧹 Clear Cache & Reset to Admin
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
