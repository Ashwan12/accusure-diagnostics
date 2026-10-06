import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Accusure Diagnostics caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '20px', background: '#f8fafc', color: '#0f172a' }}>
          <div style={{ maxWidth: '480px', width: '100%', background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>ACCUSURE DIAGNOSTICS</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Smart Healthcare & Diagnostic Management System</p>
            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '13px', textAlign: 'left', marginBottom: '20px' }}>
              {this.state.error?.message || 'Application encountered an unexpected error.'}
            </div>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/'; }}
              style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
