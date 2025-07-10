import React from 'react';
import { Shield, Eye, Lock,                <p className="font-semibold">lead.online GmbH</p>
                <p>Baierbrunner Str. 3</p>
                <p>81379 München</p>
                <p>Deutschland</p>
                <p className="mt-2">
                  <strong>E-Mail:</strong> datenschutz@lead.online<br />
                  <strong>Telefon:</strong> +49 123 456 789
                </p>FileText, AlertTriangle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16" role="main">
      <SEOHead
        title="Datenschutzerklärung | DSGVO-konforme Datenverarbeitung | Lead Online"
        description="Datenschutzerklärung von Lead Online: Erfahren Sie, wie wir Ihre persönlichen Daten DSGVO-konform sammeln, verwenden und schützen."
        keywords={['Datenschutzerklärung', 'DSGVO', 'Datenschutz', 'Datenverarbeitung', 'Lead Online', 'Deutschland']}
      />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-10 h-10 text-brand-600" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Datenschutzerklärung
            </h1>
          </div>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}
            </p>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-brand-600" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-gray-900">1. Überblick</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Lead Online nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung 
                informiert Sie darüber, wie wir Ihre Daten sammeln, verwenden und schützen, wenn Sie unsere 
                Website besuchen oder unsere Dienste nutzen.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-blue-400 mr-3 mt-0.5" aria-hidden="true" />
                  <p className="text-blue-800">
                    <strong>Wichtig:</strong> Wir verarbeiten Ihre Daten nur auf Grundlage gesetzlicher 
                    Bestimmungen (DSGVO, TKG 2003) und nur in dem Umfang, wie es für die Bereitstellung 
                    unserer Services erforderlich ist.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-brand-600" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-gray-900">2. Verantwortlicher</h2>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">lead.online GmbH</p>
                <p>Baierbrunner Str. 3</p>
                <p>81379 München</p>
                <p>Deutschland</p>
                <p className="mt-2">
                  <strong>E-Mail:</strong> datenschutz@lead.online<br />
                  <strong>Telefon:</strong> +49 123 456 789
                </p>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-brand-600" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-gray-900">3. Datenverarbeitung</h2>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Website-Besuch</h3>
              <p className="text-gray-700 mb-4">
                Bei jedem Besuch unserer Website werden automatisch Informationen gespeichert:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>IP-Adresse (anonymisiert nach 24 Stunden)</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Aufgerufene Seiten</li>
                <li>Übertragene Datenmenge</li>
                <li>Browser-Typ und -Version</li>
                <li>Betriebssystem</li>
              </ul>
              <p className="text-gray-700 mb-6">
                <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) 
                zur Gewährleistung der IT-Sicherheit und Optimierung unserer Website.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Kontaktformular</h3>
              <p className="text-gray-700 mb-4">
                Wenn Sie unser Kontaktformular nutzen, verarbeiten wir:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Name</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer (optional)</li>
                <li>Nachrichteninhalt</li>
                <li>Zeitpunkt der Anfrage</li>
              </ul>
              <p className="text-gray-700 mb-6">
                <strong>Rechtsgrundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) bzw. 
                vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Cookies</h3>
              <p className="text-gray-700 mb-4">
                Wir verwenden verschiedene Arten von Cookies:
              </p>
              <div className="space-y-4 mb-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Notwendige Cookies</h4>
                  <p className="text-gray-700 text-sm">
                    Erforderlich für die Grundfunktionen der Website (Session-Management, Sicherheit)
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Analyse-Cookies</h4>
                  <p className="text-gray-700 text-sm">
                    Helfen uns zu verstehen, wie Besucher unsere Website nutzen (nur mit Ihrer Einwilligung)
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Marketing-Cookies</h4>
                  <p className="text-gray-700 text-sm">
                    Für personalisierte Werbung und Retargeting (nur mit Ihrer Einwilligung)
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-brand-600" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-gray-900">4. Ihre Rechte</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
                <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
                <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
                <li><strong>Recht auf Einschränkung</strong> (Art. 18 DSGVO)</li>
                <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
                <li><strong>Recht auf Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO)</li>
              </ul>
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-green-800">
                  <strong>Kontakt:</strong> Zur Ausübung Ihrer Rechte wenden Sie sich an: 
                  <a href="mailto:datenschutz@leadgenpro.com" className="underline">
                    datenschutz@leadgenpro.com
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Datensicherheit</h2>
              <p className="text-gray-700 mb-4">
                Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten zu schützen:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>SSL/TLS-Verschlüsselung für alle Datenübertragungen</li>
                <li>Regelmäßige Sicherheits-Updates</li>
                <li>Zugriffsbeschränkungen und Berechtigungskonzepte</li>
                <li>Regelmäßige Datensicherungen</li>
                <li>Mitarbeiterschulungen zum Datenschutz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Speicherdauer</h2>
              <p className="text-gray-700 mb-4">
                Wir speichern Ihre Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                <li>Kontaktanfragen: 3 Jahre nach Bearbeitung</li>
                <li>Website-Logs: 30 Tage</li>
                <li>Cookie-Einstellungen: 12 Monate</li>
                <li>Vertragsdaten: Gesetzliche Aufbewahrungsfristen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Kontakt</h2>
              <p className="text-gray-700 mb-4">
                Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>E-Mail:</strong> datenschutz@leadgenpro.com</p>
                <p><strong>Telefon:</strong> +49 123 456 789</p>
                <p><strong>Post:</strong> lead.online GmbH, Baierbrunner Str. 3, 81379 München</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
