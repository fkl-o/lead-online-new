import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object;
  noindex?: boolean;
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/og-default.jpg',
  ogType = 'website',
  structuredData,
  noindex = false
}) => {
  const fullTitle = title.includes('LeadGen Pro') ? title : `${title} | LeadGen Pro`;
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* SEO Directives */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="LeadGen Pro" />
      <meta property="og:locale" content="de_DE" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags for German Market */}
      <meta name="language" content="de" />
      <meta name="geo.region" content="DE" />
      <meta name="geo.country" content="Germany" />
      
      {/* Performance & Security */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

// Predefined structured data schemas
export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LeadGen Pro",
  "description": "Ihre Digitalagentur für Webentwicklung, Marketing Automation und Digitalisierung",
  "url": "https://leadgen-pro.de",
  "logo": "https://leadgen-pro.de/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+49-XXX-XXXXXXX",
    "contactType": "Customer Service",
    "availableLanguage": "German"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "DE",
    "addressLocality": "Deutschland"
  },
  "sameAs": [
    "https://www.linkedin.com/company/leadgen-pro",
    "https://www.xing.com/companies/leadgen-pro"
  ]
});

export const createServiceSchema = (serviceName: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": serviceName,
  "description": description,
  "provider": {
    "@type": "Organization",
    "name": "LeadGen Pro"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Germany"
  }
});

export const createWebPageSchema = (pageName: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": pageName,
  "description": description,
  "isPartOf": {
    "@type": "WebSite",
    "name": "LeadGen Pro",
    "url": "https://leadgen-pro.de"
  }
});
