import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from '../config';

interface SEOProps {
    title: string;
    description?: string;
    author?: string;
    type?: string;
    url?: string;
    image?: string;
    publishedTime?: string;
    keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = SITE_CONFIG.description,
    author = SITE_CONFIG.author,
    type = "article",
    url,
    image = SITE_CONFIG.defaultImage,
    publishedTime,
    keywords = SITE_CONFIG.keywords
}) => {
    const location = useLocation();

    // Ensure absolute URLs for SEO metadata
    const siteUrl = SITE_CONFIG.url.endsWith('/') ? SITE_CONFIG.url.slice(0, -1) : SITE_CONFIG.url;
    const absoluteUrl = url ? `${siteUrl}${url.startsWith('/') ? url : `/${url}`}` : `${siteUrl}${location.pathname}`;
    const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`;

    const fullTitle = `${title} | ${author}`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={description} />
            <meta name='keywords' content={keywords} />
            <meta name='author' content={author} />
            <link rel="canonical" href={absoluteUrl} />
            <link rel="icon" type="image/svg+xml" href={SITE_CONFIG.favicon} />

            {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={SITE_CONFIG.title} />
            <meta property="og:url" content={absoluteUrl} />
            <meta property="og:image" content={absoluteImage} />
            <meta property="og:locale" content={SITE_CONFIG.locale} />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle || author} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />
        </Helmet>
    );
};

export default SEO;
