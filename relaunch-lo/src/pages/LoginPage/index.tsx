import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Authentifizierungs-Logik implementieren
    navigate('/');
  };

  // Passwort zurücksetzen simulieren (keine echte API)
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    // Simuliere API-Aufruf
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('Link zum Zurücksetzen wurde versendet.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Helmet>
        <title>Anmelden | LeadGen Pro</title>
      </Helmet>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {isForgotPassword ? 'Passwort vergessen' : 'Anmelden'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isForgotPassword ? 'Geben Sie Ihre E-Mail ein.' : 'Geben Sie Ihre E-Mail und Ihr Passwort ein.'}
          </p>
        </div>
        {isForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPasswordSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">E-Mail-Adresse</label>
              <Input
                id="email" name="email" type="email" required
                placeholder="E-Mail-Adresse"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            {message && <p className="text-sm text-center text-gray-700">{message}</p>}
            <Button
              type="submit" disabled={isSubmitting}
              className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded"
            >
              {isSubmitting ? 'Senden...' : 'Link senden'}
            </Button>
            <Button
              type="button" onClick={() => setIsForgotPassword(false)}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded"
            >Zurück zum Login</Button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">E-Mail-Adresse</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="E-Mail-Adresse"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="password" className="sr-only">Passwort</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Passwort"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Angemeldet bleiben
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="font-medium text-brand-600 hover:underline"
                  >Passwort vergessen?</button>
                </div>
              </div>

              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                Einloggen
              </Button>
            </form>
        )}
       </div>
     </div>
   );
 };

export default LoginPage;
