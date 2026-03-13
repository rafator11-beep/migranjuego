import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div style={{ padding: 16, maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Ups… la app ha petado 😅</h1>
        <p style={{ opacity: 0.85, marginBottom: 12 }}>
          No pasa nada: recarga la página. Si sigue, revisa que en Netlify estén puestas las variables de entorno
          (Supabase/OpenAI) o juega en modo offline.
        </p>
        <details style={{ whiteSpace: 'pre-wrap', opacity: 0.8 }}>
          <summary>Ver error</summary>
          {String(this.state.error)}
        </details>
        <button
          style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, border: '1px solid #ddd' }}
          onClick={() => window.location.reload()}
        >
          Recargar
        </button>
      </div>
    );
  }
}
