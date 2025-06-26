import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Kostenloses Beratungsgespräch
        </CardTitle>
        <p className="text-gray-600 text-center">
          Lassen Sie uns über Ihr Projekt sprechen
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3" role="alert">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700">{submitMessage}</p>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3" role="alert">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{submitMessage}</p>
            </div>
          )}

          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <p className="text-red-700">{errors.general}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'border-red-500' : ''}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              placeholder="Ihr vollständiger Name"
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-Mail-Adresse *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'border-red-500' : ''}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="ihre@email.de"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefonnummer (optional)
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'border-red-500' : ''}
              aria-invalid={errors.phone ? 'true' : 'false'}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              placeholder="+49 123 456789"
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Company Field */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Unternehmen (optional)
            </label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleInputChange}
              className={errors.company ? 'border-red-500' : ''}
              aria-invalid={errors.company ? 'true' : 'false'}
              aria-describedby={errors.company ? 'company-error' : undefined}
              placeholder="Ihr Unternehmen"
            />
            {errors.company && (
              <p id="company-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.company}
              </p>
            )}
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Nachricht *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
              placeholder="Beschreiben Sie kurz Ihr Projekt oder Ihre Anfrage..."
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-2">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={formData.consent}
              onChange={handleInputChange}
              className={`mt-1 w-3 h-3 text-blue-600 bg-gray-100 border rounded focus:ring-blue-500 focus:ring-1 ${
                errors.consent ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={errors.consent ? 'true' : 'false'}
              aria-describedby={errors.consent ? 'consent-error' : 'consent-description'}
            />
            <div>
              <label htmlFor="consent" className="text-sm text-gray-700">
                Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                <a href="/datenschutz" className="text-blue-600 underline hover:text-blue-800">
                  Datenschutzerklärung
                </a>{' '}
                zu. *
              </label>
              <p id="consent-description" className="text-xs text-gray-500 mt-1">
                Ihre Daten werden nur zur Bearbeitung Ihrer Anfrage verwendet.
              </p>
              {errors.consent && (
                <p id="consent-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.consent}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || submitStatus === 'success'}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Wird gesendet...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Nachricht senden
              </>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            * Pflichtfelder
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
