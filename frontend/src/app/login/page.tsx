'use client';

import { useState, useEffect } from 'react';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function LoginFormContent() {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, login, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = login(keyInput);

    if (success) {
      router.push('/');
    } else {
      setError('Chave inválida. Por favor, tente novamente.');
    }
  };

  if (loading || isAuthenticated) {
    return (
      <div style={styles.container}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Acesso Restrito</h1>
        <p style={styles.subtitle}>Insira a chave de administrador para continuar.</p>

        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            type="password"
            placeholder="Chave de Acesso (API Key)"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Entrar no Painel
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginFormContent />
    </AuthProvider>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '10px',
    color: '#333',
    fontSize: '28px',
  },
  subtitle: {
    marginBottom: '20px',
    color: '#666',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: 'black'
  },
  button: {
    padding: '12px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#e3342f',
    marginTop: '15px',
    fontWeight: 'bold',
  },
};