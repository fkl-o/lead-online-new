import React from 'react';
import { Building, Mail, Phone, MapPin, FileText, Scale } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

const Imprint: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16" role="main">
      <SEOHead
        title="Impressum | Rechtliche Angaben & Kontaktdaten | lead.online"
        description="Impressum und rechtliche Informationen zu lead.online - Ihrer Digitalagentur für Webentwicklung, Marketing Automation und Digitalisierung."
        keywords={['Impressum', 'Rechtliche Angaben', 'Kontaktdaten', 'lead.online', 'Deutschland']}
      />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <Scale className="w-10 h-10 text-brand-600" aria-hidden="true" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Impressum
            </h1>
          </div>
          
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Building className="w-6 h-6 text-brand-600" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-gray-900">Angaben gemäß § 5 TMG</h2>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-lg font-semibold text-gray-900 mb-2">lead.online GmbH</p>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-600" aria-hidden="true" />
                    <span>Baierbrunner Str. 3, 81379 München, Deutschland</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-600" aria-hidden="true" />
                    <span>+49 123 456 789</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-600" aria-hidden="true" />
                    <a href="mailto:info@leadgenpro.com" className="text-brand-600 hover:underline">
                      info@leadgenpro.com
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-brand-600" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-gray-900">Handelsregister</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Registergericht:</p>
                  <p className="text-gray-700">Amtsgericht Musterstadt</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Registernummer:</p>
                  <p className="text-gray-700">HRB 12345</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Umsatzsteuer-ID</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:
                </p>
                <p className="text-gray-700">DE123456789</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vertretungsberechtigte Geschäftsführer</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Max Mustermann, Maria Musterfrau</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Redaktionell verantwortlich</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Max Mustermann<br />
                  Musterstraße 123<br />
                  12345 Musterstadt
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">EU-Streitschlichtung</h2>
              <p className="text-gray-700 mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a 
                  href="https://ec.europa.eu/consumers/odr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline ml-1"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="text-gray-700">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verbraucherstreitbeilegung/Universalschlichtungsstelle
              </h2>
              <p className="text-gray-700">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Inhalte</h2>
              <p className="text-gray-700 mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
                fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                rechtswidrige Tätigkeit hinweisen.
              </p>
              <p className="text-gray-700">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Links</h2>
              <p className="text-gray-700 mb-4">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                Seiten verantwortlich.
              </p>
              <p className="text-gray-700">
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße 
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine 
                permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte 
                einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir 
                derartige Links umgehend entfernen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
              <p className="text-gray-700 mb-4">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
              <p className="text-gray-700">
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch 
                gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden 
                die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche 
                gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, 
                bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden 
                wir derartige Inhalte umgehend entfernen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Imprint;
