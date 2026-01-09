import { SITE_CONFIG } from '@/lib/config';

export default function JsonLd() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${SITE_CONFIG.url}/#website`,
                url: SITE_CONFIG.url,
                name: SITE_CONFIG.title,
                description: SITE_CONFIG.description,
                publisher: {
                    '@id': `${SITE_CONFIG.url}/#person`,
                },
                inLanguage: SITE_CONFIG.locale,
            },
            {
                '@type': 'Person',
                '@id': `${SITE_CONFIG.url}/#person`,
                name: SITE_CONFIG.author,
                url: SITE_CONFIG.url,
                image: {
                    '@type': 'ImageObject',
                    url: `${SITE_CONFIG.url}${SITE_CONFIG.defaultImage}`,
                },
                description: SITE_CONFIG.description,
                sameAs: [
                    'https://github.com/madanlalit',
                    'https://linkedin.com/in/madanlalit',
                    'https://x.com/lalitmadan',
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
