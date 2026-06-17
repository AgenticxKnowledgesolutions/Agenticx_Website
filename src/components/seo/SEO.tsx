import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: string;
}

export default function SEO({ title, description, keywords, ogType = 'website' }: SEOProps) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "AgenticX Knowledge Solutions",
    "url": "https://agenticx.co.in",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kollam",
      "addressRegion": "Kerala",
      "postalCode": "691004",
      "addressCountry": "IN"
    },
    "telephone": "+91 9496552094"
  };

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* OpenGraph tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={window.location.href} />

      {/* Structured Schema Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>
    </Helmet>
  );
}
