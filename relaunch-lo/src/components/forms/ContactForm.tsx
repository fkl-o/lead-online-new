import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { SecurityUtils } from '../../lib/security';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    consent: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!SecurityUtils.validateText(formData.name, 100)) {
      newErrors.name = 'Bitte geben Sie einen gültigen Namen ein (max. 100 Zeichen)';
    }

    // Email validation
    if (!SecurityUtils.validateEmail(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }

    // Phone validation (optional)
    if (formData.phone && !SecurityUtils.validatePhone(formData.phone)) {
      newErrors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein';
    }

    // Company validation (optional)
    if (formData.company && !SecurityUtils.validateText(formData.company, 200)) {
      newErrors.company = 'Firmenname ist zu lang (max. 200 Zeichen)';
    }

    // Message validation
    if (!SecurityUtils.validateText(formData.message, 2000)) {
      newErrors.message = 'Bitte geben Sie eine Nachricht ein (max. 2000 Zeichen)';
    }

    // Consent validation
    if (!formData.consent) {
      newErrors.consent = 'Bitte stimmen Sie der Datenverarbeitung zu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const sanitizedValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : SecurityUtils.escapeString(value);

    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Rate limiting check
    if (!SecurityUtils.checkRateLimit('contact_form', 3, 300000)) {
      setErrors({ general: 'Zu viele Anfragen. Bitte warten Sie 5 Minuten.' });
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setSubmitMessage('Vielen Dank für Ihre Nachricht! Wir melden uns binnen 24 Stunden bei Ihnen.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        consent: false
      });
      
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Es gab einen Fehler beim Senden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary-600 mb-4">
          Kontakt aufnehmen
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sprechen Sie mit uns über Ihr digitales Vorhaben. Wir freuen uns auf Ihre Nachricht und melden uns schnellstmöglich bei Ihnen.
        </p>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="mb-8 p-6 bg-green-50 border-l-4 border-green-400 rounded-lg" role="alert">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h4 className="text-green-800 font-semibold">Nachricht erfolgreich gesendet!</h4>
              <p className="text-green-700 mt-1">{submitMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {submitStatus === 'error' && (
        <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-lg" role="alert">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h4 className="text-red-800 font-semibold">Fehler beim Senden</h4>
              <p className="text-red-700 mt-1">{submitMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-400 rounded-lg" role="alert">
          <p className="text-red-700 font-medium">{errors.general}</p>
        </div>
      )}

      {/* Form Card */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-secondary-600">
                  Vollständiger Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.name 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-brand-600 hover:border-gray-300'
                  } focus:ring-2 focus:ring-brand-600/20`}
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  placeholder="Max Mustermann"
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-secondary-600">
                  E-Mail-Adresse *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-brand-600 hover:border-gray-300'
                  } focus:ring-2 focus:ring-brand-600/20`}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  placeholder="max@mustermann.de"
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Phone and Company Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-secondary-600">
                  Telefonnummer
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.phone 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-brand-600 hover:border-gray-300'
                  } focus:ring-2 focus:ring-brand-600/20`}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  placeholder="+49 123 456789"
                />
                {errors.phone && (
                  <p id="phone-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="block text-sm font-semibold text-secondary-600">
                  Unternehmen
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleInputChange}
                  className={`h-12 border-2 transition-all duration-200 ${
                    errors.company 
                      ? 'border-red-400 focus:border-red-500' 
                      : 'border-gray-200 focus:border-brand-600 hover:border-gray-300'
                  } focus:ring-2 focus:ring-brand-600/20`}
                  aria-invalid={errors.company ? 'true' : 'false'}
                  aria-describedby={errors.company ? 'company-error' : undefined}
                  placeholder="Mustermann GmbH"
                />
                {errors.company && (
                  <p id="company-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {errors.company}
                  </p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-semibold text-secondary-600">
                Ihre Nachricht *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 resize-none ${
                  errors.message 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 focus:border-brand-600 hover:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-brand-600/20`}
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
                placeholder="Beschreiben Sie uns Ihr Projekt oder Ihre Anfrage. Je detaillierter Ihre Beschreibung, desto besser können wir Ihnen helfen..."
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-4 h-4" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className={`mt-1 w-4 h-4 text-brand-600 bg-white border-2 rounded focus:ring-brand-600/20 focus:ring-2 transition-all ${
                    errors.consent ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-invalid={errors.consent ? 'true' : 'false'}
                  aria-describedby={errors.consent ? 'consent-error' : 'consent-description'}
                />
                <div className="flex-1">
                  <label htmlFor="consent" className="text-sm text-secondary-600 leading-relaxed">
                    Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                    <a href="/datenschutz" className="text-brand-600 underline hover:text-brand-700 font-medium">
                      Datenschutzerklärung
                    </a>{' '}
                    zu. *
                  </label>
                  <p id="consent-description" className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Ihre Daten werden ausschließlich zur Bearbeitung Ihrer Anfrage verwendet und nicht an Dritte weitergegeben.
                  </p>
                  {errors.consent && (
                    <p id="consent-error" className="mt-2 text-sm text-red-600 flex items-center gap-1" role="alert">
                      <AlertCircle className="w-4 h-4" />
                      {errors.consent}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="w-full h-14 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Nachricht wird gesendet...
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Erfolgreich gesendet
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Nachricht senden
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          * Pflichtfelder • Wir antworten in der Regel innerhalb von 24 Stunden
        </p>
      </div>
    </div>
  );
};
