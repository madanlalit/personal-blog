import React from 'react';
import { Helmet } from 'react-helmet-async';

interface WebsiteSchemaProps {
    name?: string;
    description?: string;
    url?: string;
}

interface BlogPostSchemaProps {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    author?: string;
    image?: string;
}

interface PersonSchemaProps {
    name: string;
    url?: string;
    jobTitle?: string;
    location?: string;
    sameAs?: string[];
    skills?: string[];
    description?: string;
    seekingWork?: boolean;
}

interface BreadcrumbSchemaProps {
    items: { name: string; item: string }[];
}

// Website schema for the homepage
export const WebsiteSchema: React.FC<WebsiteSchemaProps> = ({
    name = "Lalit Madan - AI Engineer | Building Intelligent Systems",
    description = "Software engineer specializing in AI agents, automation, and intelligent systems. Explore technical projects, experiments, and insights. Open for hire.",
    url
}) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        description,
        url
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

// BlogPosting schema for individual blog posts
export const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
    title,
    description,
    url,
    datePublished,
    author = "Lalit Madan",
    image
}) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        url,
        datePublished,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url
        },
        author: {
            "@type": "Person",
            name: author
        },
        ...(image && { image })
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

// Person schema for about page
export const PersonSchema: React.FC<PersonSchemaProps> = ({
    name,
    url,
    jobTitle = "AI Engineer",
    location = "India",
    sameAs = [],
    skills = [],
    description,
    seekingWork = true
}) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name,
        url,
        jobTitle,
        ...(description && { description }),
        ...(skills.length > 0 && { knowsAbout: skills }),
        ...(sameAs.length > 0 && { sameAs }),
        ...(seekingWork && {
            jobTitle: `${jobTitle} (Open for Hire)`,
            "seeks": "Job opportunities in AI and automation"
        }),
        address: {
            "@type": "PostalAddress",
            addressCountry: location
        }
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

// Breadcrumb schema
export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.item,
        })),
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};