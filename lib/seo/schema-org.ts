/**
 * Schema.org JSON-LD generator for AEO (AI search citation)
 *
 * Outputs the 7 most-cited types by ChatGPT, Claude, Perplexity, Gemini:
 * Organization, LocalBusiness, Service, FAQPage, HowTo, BreadcrumbList, AggregateRating.
 *
 * Adapted from production code at https://klarya.co.il
 */

export interface SchemaOrgInput {
  baseUrl: string;
  brandName: string;
  city: string;
  serviceLabel: string;
  servicePlural: string;
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  aggregateRating?: { value: number; count: number };
  geo?: { lat: number; lng: number };
  countryCode: string; // e.g. 'IL', 'FR', 'US'
}

export function generateSchemaNodes(input: SchemaOrgInput): unknown[] {
  const nodes: unknown[] = [];

  // Organization (global)
  nodes.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: input.brandName,
    url: input.baseUrl,
  });

  // LocalBusiness (per city)
  nodes.push({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${input.brandName} ${input.city}`,
    url: input.pageUrl,
    address: { '@type': 'PostalAddress', addressLocality: input.city, addressCountry: input.countryCode },
    ...(input.geo ? { geo: { '@type': 'GeoCoordinates', latitude: input.geo.lat, longitude: input.geo.lng } } : {}),
  });

  // Service
  nodes.push({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${input.servicePlural} ${input.city}`,
    description: input.pageDescription,
    provider: { '@type': 'Organization', name: input.brandName },
    areaServed: { '@type': 'City', name: input.city },
  });

  // FAQPage (boost AEO citation)
  if (input.faqs.length > 0) {
    nodes.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: input.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  // BreadcrumbList
  nodes.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: input.baseUrl },
      { '@type': 'ListItem', position: 2, name: input.servicePlural, item: input.pageUrl },
    ],
  });

  // AggregateRating (optional but boosts CTR if displayed)
  if (input.aggregateRating) {
    nodes.push({
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      itemReviewed: { '@type': 'LocalBusiness', name: input.brandName },
      ratingValue: input.aggregateRating.value,
      reviewCount: input.aggregateRating.count,
    });
  }

  return nodes;
}
