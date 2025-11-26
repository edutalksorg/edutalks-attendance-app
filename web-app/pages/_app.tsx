import { AuthProvider } from '@app/contexts/AuthContext';
import type { AppProps } from 'next/app';
import '../styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
