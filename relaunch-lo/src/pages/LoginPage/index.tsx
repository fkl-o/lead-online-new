import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { authApi } from '../../lib/api';
import { SEOHead } from '../../components/SEOHead';
import { SecurityUtils } from '../../lib/security';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});

  // Get the intended destination or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // User is already logged in, redirect them
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!SecurityUtils.validateEmail(email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    
    if (!isForgotPassword && password.length < 6) {
      newErrors.password = 'Das Passwort muss mindestens 6 Zeichen lang sein';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setErrors({});

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await authApi.login({ 
        email: SecurityUtils.escapeString(email), 
        password: SecurityUtils.escapeString(password) 
      });
      
      if (response.success) {
        setMessage('Login erfolgreich! Sie werden weitergeleitet...');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        setErrors({ general: response.message || 'Login fehlgeschlagen' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Es gab einen Fehler beim Login. Bitte versuchen Sie es erneut.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Passwort zurücksetzen
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setErrors({});
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    // Simuliere API-Aufruf
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage('Link zum Zurücksetzen wurde versendet.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" role="main">
      <SEOHead
        title={`${isForgotPassword ? 'Passwort vergessen' : 'Anmelden'} | LeadGen Pro`}
        description="Melden Sie sich in Ihrem LeadGen Pro Konto an"
        noindex={true}
      />
      
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow" role="form">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            {isForgotPassword ? 'Passwort vergessen' : 'Anmelden'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isForgotPassword ? 'Geben Sie Ihre E-Mail ein.' : 'Geben Sie Ihre E-Mail und Ihr Passwort ein.'}
          </p>
        </div>
        
        {isForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPasswordSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail-Adresse
              </label>
              <Input
                id="email" 
                name="email" 
                type="email" 
                required
                placeholder="ihre@email.de"
                value={email} 
                onChange={e => setEmail(e.target.value)}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
            
            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md" role="status">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            )}
            
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            )}
            
            <Button
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded"
              aria-describedby="submit-help"
            >
              {isSubmitting ? 'Senden...' : 'Link senden'}
            </Button>
            <p id="submit-help" className="sr-only">
              Klicken Sie hier, um den Reset-Link zu senden
            </p>
            
            <Button
              type="button" 
              onClick={() => setIsForgotPassword(false)}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded"
            >
              Zurück zum Login
            </Button>
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
                    className="h-3 w-3 text-brand-600 focus:ring-brand-500 focus:ring-1 border-gray-300 rounded"
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
                </div>              </div>

              {message && (
                <div className={`text-sm p-3 rounded ${message.includes('erfolgreich') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Wird eingeloggt...' : 'Einloggen'}
              </Button>
            </form>
        )}
       </div>
     </div>
   );
 };

export default LoginPage;
