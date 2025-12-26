import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    name?: string;
    type?: string;
    url?: string;
    image?: string;
    publishedTime?: string;
}

const SITE_NAME = "Lalit Madan | Blog";
const DEFAULT_IMAGE = "/lm.svg";

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Software engineer exploring AI, automation, and building things. Minimal, retro-themed personal blog.",
    name = "Lalit Madan",
    type = "article",
    url,
    image = DEFAULT_IMAGE,
    publishedTime
}) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title} | {name}</title>
            <meta name='description' content={description} />

            {/* Canonical URL */}
            {url && <link rel="canonical" href={url} />}

            {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={SITE_NAME} />
            {url && <meta property="og:url" content={url} />}
            {image && <meta property="og:image" content={image} />}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
