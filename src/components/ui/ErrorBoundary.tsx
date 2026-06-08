import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside boundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '24px',
          margin: '20px auto',
          maxWidth: '500px',
          background: 'rgba(254, 242, 242, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #fee2e2',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#ef4444',
            marginBottom: '16px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>error</span>
          </div>
          <h3 style={{ margin: '0 0 8px 0', color: '#991b1b', fontSize: '18px', fontWeight: 600 }}>
            Something went wrong
          </h3>
          <p style={{ margin: '0 0 16px 0', color: '#7f1d1d', fontSize: '14px', lineHeight: '1.5' }}>
            We encountered an unexpected error rendering this section. Please refresh or try again later.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#b91c1c')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#dc2626')}
            >
              Reload Page
            </button>
            <button
              onClick={this.handleReset}
              style={{
                background: '#ffffff',
                color: '#4b5563',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#f9fafb')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#ffffff')}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
